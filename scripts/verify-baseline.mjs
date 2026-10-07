#!/usr/bin/env node
/**
 * verify-baseline.mjs
 *
 * Integrity + structure check for the Part 1 baseline artifacts.
 * Standard-library only. Prints safe results only.
 *
 *  - Sanitized tracked baseline (n8n/baseline/part1-baseline.json): ALWAYS verified
 *    (hash + structure).
 *  - Raw private baseline (private/baseline/part1-baseline.raw.json): verified ONLY
 *    when present locally. Its absence never fails this check.
 *
 * Exit code 0 on success, non-zero on any failure.
 */

import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST_PATH = join(ROOT, 'n8n', 'baseline', 'BASELINE_MANIFEST.json');

const problems = [];

function check(condition, label) {
  if (condition) {
    console.log(`  PASS  ${label}`);
  } else {
    problems.push(label);
    console.log(`  FAIL  ${label}`);
  }
}

function fatal(label) {
  console.log(`  FAIL  ${label}`);
  console.log('\nVERDICT: BASELINE VERIFICATION FAILED');
  process.exit(1);
}

let manifest;
try {
  manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
} catch {
  fatal('read BASELINE_MANIFEST.json');
}

const san = manifest.sanitized_tracked_baseline ?? {};
const raw = manifest.raw_private_baseline ?? {};

// ---------------------------------------------------------------------------
// 1. Sanitized tracked baseline — always required
// ---------------------------------------------------------------------------
console.log('# sanitized tracked baseline');

const sanPath = join(ROOT, san.path ?? '');
let sanBuf;
try {
  sanBuf = readFileSync(sanPath);
} catch {
  fatal('read sanitized tracked baseline at manifest path');
}

const sanHash = createHash('sha256').update(sanBuf).digest('hex');
check(sanHash === san.sha256, 'sanitized baseline SHA-256 matches manifest');

let wf;
try {
  wf = JSON.parse(sanBuf.toString('utf8'));
} catch {
  fatal('sanitized baseline JSON parse');
}

const s = san.structural_checks ?? {};
check(wf.name === s.workflow_name, 'workflow name');
check(wf.id === s.workflow_id, 'workflow id (provenance)');
check(wf.versionId === s.versionId, 'versionId (provenance)');
check(wf.active === s.active, 'active value');

const nodes = Array.isArray(wf.nodes) ? wf.nodes : [];
check(nodes.length === s.node_count, `node count = ${s.node_count}`);

const connSources = wf.connections ? Object.keys(wf.connections).length : 0;
check(connSources === s.connections_source_nodes, `connections: ${s.connections_source_nodes} source nodes`);

const pinEmpty =
  Boolean(wf.pinData) &&
  typeof wf.pinData === 'object' &&
  Object.keys(wf.pinData).length === 0;
check(pinEmpty === Boolean(s.pinData_empty), 'pinData is empty');

const byName = (name) => nodes.find((n) => n && n.name === name);
const dl = byName('Download file');
const ie = byName('Information Extractor');
check(
  dl?.parameters?.fileId?.value === s.dynamic_expressions?.download_file_fileId,
  'Download file dynamic expression preserved',
);
check(
  ie?.parameters?.text === s.dynamic_expressions?.information_extractor_text,
  'Information Extractor dynamic expression preserved',
);

check(manifest.immutable === true, 'manifest marks baseline immutable');

// ---------------------------------------------------------------------------
// 2. Raw private baseline — verified only if present
// ---------------------------------------------------------------------------
console.log('# raw private baseline (optional)');
const rawPath = join(ROOT, raw.path ?? '');
if (!raw.sha256) {
  // Public copy: the raw provenance hash is derived from the unredacted private
  // export and is not published (see PUBLIC_COPY_NOTES.md).
  console.log('  SKIP  raw provenance hash not published in this copy');
} else if (existsSync(rawPath)) {
  const rawHash = createHash('sha256').update(readFileSync(rawPath)).digest('hex');
  check(rawHash === raw.sha256, 'raw private baseline SHA-256 matches provenance');
  check(rawHash !== sanHash, 'raw and sanitized hashes intentionally differ');
} else {
  console.log('  SKIP  raw private baseline not present (expected on a clean checkout / CI)');
}

console.log('');
if (problems.length === 0) {
  console.log('VERDICT: BASELINE VERIFIED');
  process.exit(0);
}
console.log(`VERDICT: BASELINE VERIFICATION FAILED (${problems.length} problem(s))`);
process.exit(1);
