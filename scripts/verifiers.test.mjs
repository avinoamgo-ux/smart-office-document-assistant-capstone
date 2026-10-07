import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runPrivacyScan } from './verify-privacy.mjs';

const sha256 = (v) => createHash('sha256').update(v).digest('hex');
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

describe('privacy verifier — real repository', () => {
  const result = runPrivacyScan();

  it('scans a non-trivial number of tracked files', () => {
    expect(result.scanned).toBeGreaterThan(10);
  });

  it('finds no forbidden value in any tracked file', () => {
    expect(result.findings).toEqual([]);
    expect(result.hostFindings).toEqual([]);
  });

  // Public copy: hashes derived from real private values are not published.
  it('publishes no private-derived hash in the manifest', () => {
    const manifest = JSON.parse(
      readFileSync(join(REPO_ROOT, 'n8n', 'baseline', 'BASELINE_MANIFEST.json'), 'utf8'),
    );
    expect(manifest.forbidden_value_hashes).toEqual([]);
    expect(manifest.raw_private_baseline.sha256).toBeUndefined();
    expect(result).not.toHaveProperty('rawProvenanceHash');
  });

  it.skipIf(!process.env.PRIVACY_HASHES_FILE)(
    'covers the required forbidden categories (external hash list)',
    () => {
      expect(result.hashSource).toBe('external');
      for (const cat of ['personal_email', 'credential_id', 'drive_id', 'spreadsheet_id']) {
        expect(result.forbiddenCategories).toContain(cat);
      }
    },
  );
});

describe('privacy verifier — synthetic positive case', () => {
  let dir;
  const SYNTHETIC_SECRET = 'SYNTHETIC_TEST_TOKEN_0123456789ABCDEF';

  beforeAll(() => {
    dir = mkdtempSync(join(tmpdir(), 'ig-privacy-'));
    execFileSync('git', ['init', '-q'], { cwd: dir });
    execFileSync('git', ['config', 'user.email', 't@example.com'], { cwd: dir });
    execFileSync('git', ['config', 'user.name', 'T'], { cwd: dir });
    mkdirSync(join(dir, 'n8n', 'baseline'), { recursive: true });
    writeFileSync(
      join(dir, 'n8n', 'baseline', 'BASELINE_MANIFEST.json'),
      JSON.stringify({
        raw_private_baseline: { sha256: 'a'.repeat(64) },
        forbidden_value_hashes: [
          { category: 'credential_id', sha256: sha256(SYNTHETIC_SECRET) },
        ],
      }),
    );
    writeFileSync(join(dir, 'leak.txt'), `config id: ${SYNTHETIC_SECRET}\n`);
    writeFileSync(join(dir, 'clean.txt'), 'id: RECONNECT_CREDENTIAL_IN_N8N\n');
    execFileSync('git', ['add', '-A'], { cwd: dir });
  });

  afterAll(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it('flags a tracked file that contains a forbidden value', () => {
    const r = runPrivacyScan(resolve(dir));
    const leak = r.findings.find((f) => f.file === 'leak.txt');
    expect(leak).toBeTruthy();
    expect(leak.category).toBe('credential_id');
  });

  it('does not flag the file that only uses the synthetic placeholder', () => {
    const r = runPrivacyScan(resolve(dir));
    expect(r.findings.some((f) => f.file === 'clean.txt')).toBe(false);
  });
});

describe('privacy verifier — external hash list (public copy)', () => {
  let dir;
  let outside;
  const SYNTHETIC_SECRET = 'SYNTHETIC_EXTERNAL_TOKEN_0123456789ABCDEF';

  beforeAll(() => {
    dir = mkdtempSync(join(tmpdir(), 'ig-privacy-ext-'));
    outside = mkdtempSync(join(tmpdir(), 'ig-privacy-hashes-'));
    execFileSync('git', ['init', '-q'], { cwd: dir });
    mkdirSync(join(dir, 'n8n', 'baseline'), { recursive: true });
    writeFileSync(
      join(dir, 'n8n', 'baseline', 'BASELINE_MANIFEST.json'),
      JSON.stringify({ raw_private_baseline: {}, forbidden_value_hashes: [] }),
    );
    writeFileSync(join(dir, 'leak.txt'), `config id: ${SYNTHETIC_SECRET}\n`);
    execFileSync('git', ['add', '-A'], { cwd: dir });
    writeFileSync(
      join(outside, 'hashes.json'),
      JSON.stringify({ forbidden_value_hashes: [{ category: 'credential_id', sha256: sha256(SYNTHETIC_SECRET) }] }),
    );
    writeFileSync(join(outside, 'empty.json'), JSON.stringify({ forbidden_value_hashes: [] }));
  });

  afterAll(() => {
    rmSync(dir, { recursive: true, force: true });
    rmSync(outside, { recursive: true, force: true });
  });

  it('reports no hash source when the manifest list is empty and no file is given', () => {
    const r = runPrivacyScan(resolve(dir), '');
    expect(r.hashSource).toBe('none');
    expect(r.findings).toEqual([]);
  });

  it('flags the leak when the hash list comes from an external file', () => {
    const r = runPrivacyScan(resolve(dir), join(outside, 'hashes.json'));
    expect(r.hashSource).toBe('external');
    expect(r.findings).toEqual([{ category: 'credential_id', file: 'leak.txt', count: 1 }]);
  });

  it('fails closed on a missing or empty external file', () => {
    expect(() => runPrivacyScan(resolve(dir), join(outside, 'missing.json'))).toThrow();
    expect(() => runPrivacyScan(resolve(dir), join(outside, 'empty.json'))).toThrow();
  });
});

// --- Prompt 5X: fail-closed Drive link-template exception ---------------------
describe('privacy verifier — dynamic Drive link templates in Workflow A', () => {
  // Built by concatenation so this test file holds no literal Google host.
  const DRIVE = 'https://' + 'drive.google' + '.com';
  const DOCS = 'https://' + 'docs.google' + '.com';
  const FAKE_ID = '1SyntheticFakeDriveFileId0123456789'; // synthetic, 35 chars
  const realWorkflowA = JSON.parse(
    readFileSync(join(REPO_ROOT, 'n8n', 'exports', 'workflow-a.json'), 'utf8'),
  );
  const tempDirs = [];

  // A throwaway git repo whose only tracked files are the manifest and `files`.
  function scan(files) {
    const dir = mkdtempSync(join(tmpdir(), 'ig-drive-'));
    tempDirs.push(dir);
    execFileSync('git', ['init', '-q'], { cwd: dir });
    mkdirSync(join(dir, 'n8n', 'baseline'), { recursive: true });
    mkdirSync(join(dir, 'n8n', 'exports'), { recursive: true });
    writeFileSync(
      join(dir, 'n8n', 'baseline', 'BASELINE_MANIFEST.json'),
      JSON.stringify({ raw_private_baseline: { sha256: 'a'.repeat(64) }, forbidden_value_hashes: [] }),
    );
    for (const [rel, doc] of Object.entries(files)) {
      writeFileSync(join(dir, rel), JSON.stringify(doc, null, 2) + '\n');
    }
    execFileSync('git', ['add', '-A'], { cwd: dir });
    return runPrivacyScan(resolve(dir)).hostFindings;
  }
  const workflowA = (mutate = () => {}) => {
    const doc = structuredClone(realWorkflowA);
    mutate(doc);
    return doc;
  };
  const A = 'n8n/exports/workflow-a.json';

  afterAll(() => {
    for (const d of tempDirs) rmSync(d, { recursive: true, force: true });
  });

  it('the real export holds exactly the three approved dynamic templates', () => {
    const vals = [
      realWorkflowA.nodes[3].parameters.columns.value['File Link'],
      realWorkflowA.nodes[10].parameters.responseBody,
      realWorkflowA.nodes[11].parameters.responseBody,
    ];
    for (const v of vals) {
      expect(v.startsWith('={{')).toBe(true);
      expect(v).toContain(`'${DRIVE}/file/d/' + $('Upload file').`);
    }
  });

  it('passes each approved dynamic template', () => {
    expect(scan({ [A]: workflowA() })).toEqual([]);
  });

  it('fails a literal Drive file id at an otherwise approved path', () => {
    const doc = workflowA((d) => {
      d.nodes[3].parameters.columns.value['File Link'] = `={{ '${DRIVE}/file/d/${FAKE_ID}/view' }}`;
    });
    expect(scan({ [A]: doc })).toEqual([{ category: 'account_specific_url', file: A, count: 1 }]);
  });

  it('fails a Google URL at any other path of the export', () => {
    const doc = workflowA((d) => {
      d.nodes[4].parameters.message = d.nodes[3].parameters.columns.value['File Link'];
    });
    expect(scan({ [A]: doc })).toEqual([{ category: 'account_specific_url', file: A, count: 1 }]);
  });

  it('fails the same template in a different export file', () => {
    const B = 'n8n/exports/workflow-b.json';
    const doc = workflowA();
    expect(scan({ [B]: doc })).toEqual([{ category: 'account_specific_url', file: B, count: 3 }]);
  });

  it('fails a template that also carries an extra literal private id', () => {
    const doc = workflowA((d) => {
      d.nodes[10].parameters.responseBody = d.nodes[10].parameters.responseBody.replace(
        "+ '/view'",
        `+ '/view?resourcekey=${FAKE_ID}'`,
      );
    });
    expect(scan({ [A]: doc })).toEqual([{ category: 'account_specific_url', file: A, count: 1 }]);
  });

  it('fails an intact template whose value also holds a long literal id', () => {
    const doc = workflowA((d) => {
      d.nodes[11].parameters.responseBody = d.nodes[11].parameters.responseBody.replace(
        'notification_sent: true',
        `notification_sent: true, ref: '${FAKE_ID}'`,
      );
    });
    expect(scan({ [A]: doc })).toEqual([{ category: 'account_specific_url', file: A, count: 1 }]);
  });

  it('fails a template value that adds a second Google host', () => {
    const doc = workflowA((d) => {
      d.nodes[11].parameters.responseBody = d.nodes[11].parameters.responseBody.replace(
        'notification_sent: true',
        `notification_sent: true, sheet: '${DOCS}/spreadsheets/d/' + $json.sheet`,
      );
    });
    expect(scan({ [A]: doc })).toEqual([{ category: 'account_specific_url', file: A, count: 2 }]);
  });
});

// --- Prompt 2A-R1 regression: baseline line-ending policy ---------------------
describe('baseline line-ending policy (R1)', () => {
  const BASELINE = 'n8n/baseline/part1-baseline.json';
  const EXPECTED_SHA =
    '5e049657f234db7fb72ede215e47e5a5b6b4de1864649d5ebf114faa2b4d516a';

  const manifest = JSON.parse(
    readFileSync(join(REPO_ROOT, 'n8n', 'baseline', 'BASELINE_MANIFEST.json'), 'utf8'),
  );
  const workBuf = readFileSync(join(REPO_ROOT, BASELINE));
  const stagedBuf = execFileSync('git', ['show', `:${BASELINE}`], { cwd: REPO_ROOT });
  const attributes = readFileSync(join(REPO_ROOT, '.gitattributes'), 'utf8');
  const eolAttr = execFileSync('git', ['check-attr', 'eol', '--', BASELINE], {
    cwd: REPO_ROOT,
  })
    .toString()
    .trim();

  it('manifest still pins exactly the LF hash (not weakened / multi-hash)', () => {
    expect(manifest.sanitized_tracked_baseline.sha256).toBe(EXPECTED_SHA);
    expect(typeof manifest.sanitized_tracked_baseline.sha256).toBe('string');
  });

  it('.gitattributes pins the baseline to LF', () => {
    expect(attributes).toContain(`${BASELINE} text eol=lf`);
    expect(eolAttr).toMatch(/: eol: lf$/);
  });

  it('working-tree baseline is LF-only and matches the manifest hash', () => {
    expect((workBuf.toString('latin1').match(/\r\n/g) || []).length).toBe(0);
    expect(sha256(workBuf)).toBe(EXPECTED_SHA);
    expect(sha256(workBuf)).toBe(manifest.sanitized_tracked_baseline.sha256);
  });

  it('staged blob is LF-only and matches the manifest hash', () => {
    expect((stagedBuf.toString('latin1').match(/\r\n/g) || []).length).toBe(0);
    expect(sha256(stagedBuf)).toBe(EXPECTED_SHA);
  });

  it('working tree and staged blob are byte-identical', () => {
    expect(Buffer.compare(workBuf, stagedBuf)).toBe(0);
  });

  it('parsed workflow content is intact (11 nodes, dynamic expressions, empty pinData)', () => {
    const wf = JSON.parse(workBuf.toString('utf8'));
    expect(wf.nodes).toHaveLength(11);
    expect(Object.keys(wf.pinData)).toHaveLength(0);
    const byName = (n) => wf.nodes.find((x) => x.name === n);
    expect(byName('Download file').parameters.fileId.value).toBe('={{ $json.id }}');
    expect(byName('Information Extractor').parameters.text).toBe('={{ $json.data }}');
  });
});
