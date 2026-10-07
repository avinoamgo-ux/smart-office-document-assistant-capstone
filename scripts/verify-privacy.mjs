#!/usr/bin/env node
/**
 * verify-privacy.mjs
 *
 * Privacy / sanitization verifier.
 *
 * Fails if any TRACKED project file contains a value copied from the raw Part 1
 * baseline in these categories: personal email, credential id, account-specific
 * URL, Drive id, spreadsheet id (plus n8n webhook / instance ids).
 *
 * Detection is hash-based: the raw values are NOT stored anywhere. Candidate
 * tokens found in tracked files are SHA-256'd and compared against
 * `forbidden_value_hashes` in n8n/baseline/BASELINE_MANIFEST.json.
 *
 * Public copy: those hashes are derived from real private values, so the list
 * is empty here and the hash-based scan is reported as SKIP. To run it, set
 * PRIVACY_HASHES_FILE to a JSON file kept outside this repository that holds a
 * `forbidden_value_hashes` array (the private manifest has this shape). An
 * unreadable or empty file fails the scan. The literal Google-host and
 * gmail.com checks below always run.
 *
 * The script never prints a matched value — only category, count, and path.
 * Documented synthetic placeholders and `example.com` are not flagged. The only
 * Google-host exception is the three exact dynamic Drive link templates in
 * n8n/exports/workflow-a.json (see `approvedDriveTemplateHits`).
 *
 * Exit 0 = clean, non-zero = a private value is present in a tracked file.
 */

import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve, extname } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const SKIP_EXT = new Set([
  '.ico', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.zip', '.gz', '.pdf',
  '.woff', '.woff2', '.ttf', '.eot',
]);

// Candidate token shapes worth hashing.
const TOKEN_RES = [
  /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, // emails
  /[A-Za-z0-9_-]{16,}/g,                              // long ids (Google ids, hex, uuids)
];

const sha256 = (v) => createHash('sha256').update(v).digest('hex');

// literal account-specific host URLs (example.com is allowed)
const HOST_RE = /https?:\/\/(?:[a-z0-9-]+\.)*(?:drive|docs)\.google\.com/gi;

// Narrow, fail-closed exception (approved 2026-10-03, PROMPTS.md 5X): the three
// dynamic Drive file-link templates in the redacted Workflow A export. Their
// file id comes only from the n8n expression `$('Upload file')…json.id`; no
// literal id is present. Any other file, JSON path, URL shape, extra host or
// long literal id in the same value is still reported.
export const DRIVE_TEMPLATE_FILE = 'n8n/exports/workflow-a.json';
export const DRIVE_TEMPLATE_PATHS = [
  ['nodes', 3, 'parameters', 'columns', 'value', 'File Link'],
  ['nodes', 10, 'parameters', 'responseBody'],
  ['nodes', 11, 'parameters', 'responseBody'],
];
const DRIVE_TEMPLATE_RE =
  /'https:\/\/drive\.google\.com\/file\/d\/' \+ \$\('Upload file'\)\.(?:item|first\(\))\.json\.id \+ '\/view'/g;
const LONG_ID_RE = /[A-Za-z0-9_-]{25,}/;

/** Number of host hits in `text` covered by an approved dynamic template. */
export function approvedDriveTemplateHits(rel, text) {
  if (rel !== DRIVE_TEMPLATE_FILE) return 0;
  let doc;
  try {
    doc = JSON.parse(text);
  } catch {
    return 0;
  }
  let allowed = 0;
  for (const path of DRIVE_TEMPLATE_PATHS) {
    const value = path.reduce((node, key) => (node == null ? undefined : node[key]), doc);
    if (typeof value !== 'string' || !value.startsWith('={{')) continue;
    if ((value.match(DRIVE_TEMPLATE_RE) || []).length !== 1) continue;
    if ((value.match(HOST_RE) || []).length !== 1) continue;
    if (LONG_ID_RE.test(value.replace(DRIVE_TEMPLATE_RE, ''))) continue;
    allowed += 1;
  }
  // Never cover more hits than the unescaped templates present in the raw text.
  return Math.min(allowed, (text.match(DRIVE_TEMPLATE_RE) || []).length);
}

/** Reads a `forbidden_value_hashes` list from a file outside the repository. Fails closed. */
export function loadExternalHashes(file) {
  let list;
  try {
    list = JSON.parse(readFileSync(file, 'utf8')).forbidden_value_hashes;
  } catch {
    throw new Error('PRIVACY_HASHES_FILE is set but could not be read as JSON');
  }
  if (!Array.isArray(list) || list.length === 0) {
    throw new Error('PRIVACY_HASHES_FILE holds no forbidden_value_hashes entries');
  }
  return list;
}

export function runPrivacyScan(root = ROOT, hashesFile = process.env.PRIVACY_HASHES_FILE) {
  const manifest = JSON.parse(
    readFileSync(join(root, 'n8n', 'baseline', 'BASELINE_MANIFEST.json'), 'utf8'),
  );
  const external = hashesFile ? loadExternalHashes(hashesFile) : [];
  const forbidden = new Map(); // sha256 -> category
  for (const { category, sha256: h } of [...(manifest.forbidden_value_hashes ?? []), ...external]) {
    forbidden.set(h, category);
  }
  const hashSource = external.length ? 'external' : forbidden.size ? 'manifest' : 'none';

  // Tracked files = git index contents (works before the first commit).
  const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: root })
    .toString('utf8')
    .split('\0')
    .filter(Boolean);

  const findings = []; // { category, file, count }
  const hostFindings = []; // { category, file, count }
  let scanned = 0;

  for (const rel of tracked) {
    if (SKIP_EXT.has(extname(rel).toLowerCase())) continue;
    let text;
    try {
      text = readFileSync(join(root, rel), 'utf8');
    } catch {
      continue;
    }
    scanned += 1;

    // hash-based token match
    const perCategory = new Map();
    for (const re of TOKEN_RES) {
      const matches = text.match(re) || [];
      for (const tok of matches) {
        const cat = forbidden.get(sha256(tok));
        if (cat) perCategory.set(cat, (perCategory.get(cat) || 0) + 1);
      }
    }
    for (const [category, count] of perCategory) {
      findings.push({ category, file: rel, count });
    }

    const gmailRe = /@gmail\.com/gi;
    const hostHits = (text.match(HOST_RE) || []).length - approvedDriveTemplateHits(rel, text);
    const gmailHits = (text.match(gmailRe) || []).length;
    if (hostHits) hostFindings.push({ category: 'account_specific_url', file: rel, count: hostHits });
    if (gmailHits) hostFindings.push({ category: 'gmail_address_literal', file: rel, count: gmailHits });
  }

  return {
    scanned,
    findings,
    hostFindings,
    hashSource,
    forbiddenCount: forbidden.size,
    forbiddenCategories: [...new Set([...forbidden.values()])],
  };
}

function main() {
  let result;
  try {
    result = runPrivacyScan();
  } catch (err) {
    console.log(`  FAIL  ${err.message}`);
    console.log('\nVERDICT: PRIVACY SCAN FAILED');
    process.exit(1);
  }
  const { scanned, findings, hostFindings, hashSource, forbiddenCount, forbiddenCategories } = result;
  console.log('# privacy / sanitization scan');
  console.log(`scanned ${scanned} tracked files`);
  console.log(`forbidden-value hashes: ${forbiddenCount} (source: ${hashSource})`);

  const all = [...findings, ...hostFindings];
  if (all.length === 0) {
    if (hashSource === 'none') {
      console.log('  SKIP  hash-based forbidden-value scan (no hashes in this public copy; set PRIVACY_HASHES_FILE to run it)');
    }
    for (const cat of [...forbiddenCategories, 'account_specific_url', 'gmail_address_literal']) {
      console.log(`  PASS  no ${cat} in tracked files`);
    }
    console.log(
      hashSource === 'none'
        ? '\nVERDICT: NO PRIVATE VALUES FOUND BY THE LITERAL CHECKS (hash-based scan skipped)'
        : '\nVERDICT: NO PRIVATE VALUES IN TRACKED FILES',
    );
    process.exit(0);
  }

  for (const f of all) {
    console.log(`  FAIL  ${f.category} present in tracked file: ${f.file} (${f.count} occurrence(s))`);
  }
  console.log(`\nVERDICT: PRIVACY SCAN FAILED (${all.length} finding(s)) — value(s) not printed`);
  process.exit(1);
}

if (resolve(fileURLToPath(import.meta.url)) === resolve(process.argv[1] ?? '')) {
  main();
}
