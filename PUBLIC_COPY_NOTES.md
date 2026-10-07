# Public copy notes

This repository is a public copy of the course capstone, prepared from commit
`f2047be1bed1debe7d01e7fefbdc24bb64390700` of the private project repository. It has **no Git history** from
that repository.

## Not included

| Path | Reason |
|---|---|
| `CLAUDE.md` | local agent operating instructions (local paths, private-repo workflow rules) |
| `AGENTS.md` | local agent configuration note |
| `docs/PROJECT_BRIEF.md` | superseded IntentSeal-era design document |
| `docs/ARCHITECTURE.md` | superseded IntentSeal-era design document |
| `docs/DATA_CONTRACT_DRAFT.md` | superseded IntentSeal-era design document |
| `docs/SPEC.md` | superseded IntentSeal-era design document |
| `docs/MILESTONES.md` | superseded IntentSeal-era design document |

Local and untracked files (environment files, editor and agent settings,
`node_modules`, build output) were never part of the export.

## Omitted passages

The project began under an earlier, superseded scope (an IntentSeal-era
consciousness-mapping design). That design is not part of this submission. In
the files below, passages describing it were replaced by a visible omission
note. Short mentions that only state the old scope is excluded were kept.

| File | Omitted passage | Lines |
|---|---|---|
| `PROMPTS.md` | the original Prompt 1 text describing the superseded IntentSeal / consciousness-mapping design | 249 |
| `PROMPTS.md` | one sentence on the superseded consciousness-mapping sub-workflow | 1 |
| `PROMPTS.md` | Corrections 4–5: the superseded AI_DRAFT review lifecycle and IntentSeal Lite action-history schema | 48 |
| `PROMPTS.md` | the superseded project identity block (old subtitle, local path, planned repository) | 17 |
| `PROMPTS.md` | the superseded Prompt 5 goal (declared intentions, epistemic layers, hypothesis component) | 5 |
| `PROMPTS.md` | the superseded Prompt 7 goal (two IntentSeal-era Skills that were never built) | 6 |
| `docs/PROJECT_STATE.md` | the superseded product identity (consciousness-mapping purpose and subtitle) | 7 |
| `docs/PROJECT_STATE.md` | two superseded design decisions (AI_DRAFT lifecycle, IntentSeal Lite history) | 7 |
| `README.md` | historical note rewritten to drop references to excluded documents | 7 |

A second pass removed more narrative about the superseded design. Each spot now
carries the same kind of visible omission note:
- in `PROMPTS.md`:
  - the old design details in the Prompt 1 description of the data-contract
    draft;
  - Prompt 1A's corrections 4–5, its verification steps 2–3 (in the pasted
    correction prompt and in the results), and its design changes to the
    excluded documents;
  - one clause in the Prompt 4 placeholder;
- in `docs/PROJECT_STATE.md`: the Prompt 1A summary under "Completed work".

## References kept on purpose

These remaining mentions of the superseded scope are kept, because they record
an exclusion, a boundary or a removal rather than describe the old design:
- **Exclusion lists:** `CONTRACT.md` §12 and `SPEC.md` §15.
- **The README historical note.**
- **Migration records in `PROMPTS.md` and `docs/PROJECT_STATE.md`:** the legacy
  IntentSeal modules were replaced, then deleted in M6-E.
- **Boundary statements:** the separate IntentSeal repository was not accessed.
- **One test key** in `src/app/api/review/route.test.ts`, which asserts that a
  legacy field is rejected.
- **The `contract-drift-guard` Skill's warning** not to compare against the
  superseded schemas.

The Part 1 baseline in `n8n/baseline/` keeps its submitted workflow name
("Consciousness Center Document Assistant"). The file is hash-verified and
unchanged.

Some records also name excluded files, such as `CLAUDE.md` and the old
`docs/` drafts, as historical references. Those files are not part of this copy.

## Adapted for this copy

- **`.claude/skills/contract-drift-guard/SKILL.md`:**
  - Its authority order no longer requires the excluded `CLAUDE.md`. Item 4
    now says those instructions are not included, and that
    `docs/PROJECT_STATE.md` records the decisions they governed.
  - The list of superseded files no longer names files that are absent from
    this copy.
  - The Skill's checks are otherwise unchanged.
- **Local paths:** personal Windows paths in `PROMPTS.md`,
  `docs/PROJECT_STATE.md` and `SPEC.md` were replaced by portable
  descriptions: "the local project folder", "the local course-requirements
  folder (outside the repository)", and `%TEMP%\intent-gate-mock-verify`. The
  recorded facts are unchanged.
- **`README.md`:** the clone command that pointed to the private repository was
  removed. Clone this repository with the address shown on its GitHub page.

### Status and headings (2026-10-08)

- **Local path:** one more repository path in `PROMPTS.md`, in the Prompt 2A-R1
  preflight table, was replaced with "the local project folder".
- **Headings:** `PROMPTS.md` and `docs/PROJECT_STATE.md` now have headings
  that mark them as historical records of the Smart Office Document
  Assistant. Each has a short note that keeps the original title. The dated
  entries are unchanged.
- **`docs/PROJECT_STATE.md`:** a forward status note was added at the top.
  Its points are:
  - the owner reports that the submission was sent to the lecturer;
  - grading and the formal closure of M7 are not verified;
  - the app is not deployed;
  - the owner's n8n trial has ended, so the workflows are not live now.

  The older dated status lines are kept as history.
- **`README.md`:** the "Status" section was corrected with the same facts. It
  no longer says that M7 is in progress or that the app runs against a live
  n8n instance.
- **Checks:** only focused link and privacy checks ran after these edits. No
  code, workflow or media file changed.

## Hashes of private values removed

The private repository kept SHA-256 hashes of real private values. They let the
privacy check find leaks without storing the values. A hash of a short value,
such as an email address or an ID, can be confirmed by guessing. So these hashes
are not published in this copy:

- **`n8n/baseline/BASELINE_MANIFEST.json`:**
  - `forbidden_value_hashes` is now an empty list. It had 11 entries in these
    categories: personal email, Drive ID, spreadsheet ID, credential ID, n8n
    webhook ID and n8n instance ID.
  - `raw_private_baseline.sha256` was removed. It was the hash of the
    unredacted Part 1 export. The path and the policy notes remain.
- **`PROMPTS.md` and `docs/PROJECT_STATE.md`:** 13 copies of the raw-baseline
  hash were replaced with `[raw-baseline hash removed from public copy]`. That
  is 12 full copies and one shortened copy.

**Kept:** the hash of the sanitized tracked baseline
(`n8n/baseline/part1-baseline.json`) and its structural checks are unchanged.
That file is public, so its hash reveals nothing private. `npm run
verify:baseline` still checks the baseline in full. The other hashes kept in
the records are hashes of files included in this copy, or of the same
sanitized baseline with CRLF line endings.

### Verifier changes

- **`scripts/verify-baseline.mjs`:** when no raw provenance hash is on record,
  the raw-baseline step prints `SKIP`. The sanitized-baseline checks are
  unchanged.
- **`scripts/verify-privacy.mjs`:**
  - It no longer prints the raw provenance hash.
  - With an empty hash list, it reports the hash-based scan as `SKIP` instead
    of `PASS`, and the verdict says that scan was skipped.
  - The `PRIVACY_HASHES_FILE` environment variable can point to a JSON file
    kept **outside** the repository, with a `forbidden_value_hashes` array.
    The private manifest has this shape. If the file cannot be read, or its
    list is empty, the scan fails.
- **`scripts/verifiers.test.mjs`:**
  - Two tests depended on the removed hashes. They were replaced by a test
    that the manifest publishes no private-derived hash.
  - The category-coverage test now runs only when `PRIVACY_HASHES_FILE` is
    set. Otherwise it is skipped.
  - New synthetic tests cover the external hash list, including how it fails
    closed.

### Reduced privacy-check coverage

In a clone of this copy, `npm run verify:privacy` **cannot** find copied
private values by hash, because the hash list is empty. These checks still run:
- literal Drive and Docs host URLs, apart from the three approved dynamic
  templates in Workflow A;
- literal gmail.com email addresses.

A copied credential ID, Drive ID, spreadsheet ID or n8n ID, or a personal email
address that is not on gmail.com, would **not** be detected. Only the owner can
restore full coverage, by running the check with `PRIVACY_HASHES_FILE` set to
the private manifest. That run was made for this copy before publication. See
"How this copy was prepared".

## The private pull request

The `code-review` plugin ran on pull request #1 in the private project
repository. That PR and its comment are not publicly accessible. Links to them
were replaced by plain-text references. The review run, its result and its
limits are recorded in [`docs/CODE_REVIEW_PR1.md`](docs/CODE_REVIEW_PR1.md).

## How this copy was prepared

Prepared locally on 2026-10-07:
1. **Export:** the tracked files of the source commit were exported with
   `git archive`, without history.
2. **Removal:** the files listed above were removed, and the passages above
   were omitted or adapted.
3. **Checks:** the repository's checks ran on the copy before the second editing
   pass, using a temporary Git index that was then removed:
   - `npm run check`: baseline, privacy, lint, 158/158 unit tests, build;
   - the intercepted Playwright suite: 65/66, with the one timeout passing on
     rerun.
4. **Focused checks after the second pass:** links, privacy and references.
5. **Hash removal pass:** the hashes of private values were removed, as
   described above. Checks then ran with a temporary Git index that was then
   removed:
   - `npm run verify:baseline`: `BASELINE VERIFIED`; the raw step was skipped.
   - `npm run verify:privacy` without a hash list: the hash-based scan was
     skipped; the literal checks passed.
   - `npm run verify:privacy` with `PRIVACY_HASHES_FILE` set to the private
     manifest: 11 hashes, all six categories passed, no private value found.
   - `npm run lint`: passed.
   - Unit tests: 160 passed and 1 skipped; the skipped one needs
     `PRIVACY_HASHES_FILE`. With that file set, the verifier tests passed
     23/23.
   - `npm run build`: passed.
   - A scan of all files in this copy, excluding `node_modules` and `.next`,
     found no full or shortened copy of any removed hash.
   - Playwright and n8n were not run in this pass. Only the verifier scripts
     and documents changed.

No repository was created and nothing was published.
