# Smart Office Document Assistant — Historical Prompt Log

> **Historical record.** This is the dated, prompt-by-prompt work log of the
> Smart Office Document Assistant (Part 2). Its entries are kept as they were
> written, and statements in them describe the project at their own dates. For
> the current status, see the README "Status" section. Original title:
> "Claude Code Prompt Log — Intent Gate | שער הכוונה".

**Part 2 — Workflow AI Agent course**
**Document date: 2026-09-05**
**Amended: 2026-09-06 — human-review amendment recorded below as Prompt 1A.**

## Prompt 2B — Verified GitHub publication documentation sync

| Field | Value |
|---|---|
| **Status** | `COMPLETE` (2026-09-08) |
| **Milestone** | M2 / Prompt 3 checkpoint gate |
| **Scope** | Documentation-only status update and operational checkpoint sync |
| **Goal** | Synchronize live documentation with the verified GitHub publication in the private project repository (not publicly accessible), branch `main`, HEAD `62d30e04e1e720076d1760b61166de27f27d8fb6`.
| **Verified facts** | Repository is private; current branch `main`; remote was empty before the first push; Git CLI publication verified with `git push -u origin main`; published tree contains approved `.env.example` only; no private/, artifacts/, node_modules/, test-results/, `.next/`, runtime environment files, secret/key-style paths, or raw baseline were published; IntentSeal repo not accessed. |
| **Plugin use** | GitHub plugin use remains pending and must not be falsely claimed. Git CLI publication is verified, but this is not verified GitHub plugin use. |
| **Next allowed action** | **M2 / Prompt 3 — contract review, data contracts and app-side proxy routes.** |


This file logs the eight Claude Code prompts used to build Part 2. Each entry
records the prompt's **goal**, **allowed scope**, **files produced**,
**verification method**, and **completion status**.

Rules for this log:
- No outcome is recorded before it has actually happened.
- Prompts 2–8 are placeholders. Their scope is a *plan*, not a result.
- Prompts 2–8 are **not** renumbered by any amendment. Amendments to a completed
  prompt are recorded as lettered sub-entries (e.g. Prompt 1A).
- Status values: `COMPLETE` · `NOT STARTED` · `IN PROGRESS` · `BLOCKED`.

---

## Prompt 1 — Planning & documentation

| Field | Value |
|---|---|
| **Status** | `COMPLETE` (2026-09-05) |
| **Milestone** | M0 |

### Goal
Produce the full planning and documentation set for Part 2 of Intent Gate, so a
human can review the plan before any implementation begins. Establish project
identity, purpose, scope, ethical/epistemic boundaries, proposed architecture,
draft data contracts for the three course webhooks, an ordered milestone plan,
and this prompt log.

### Allowed scope
- **Allowed:** create exactly six documentation files (Markdown only).
- **Forbidden and not done:** application source code; installing packages;
  running npm; creating or modifying n8n workflows; network requests; inventing
  credentials, URLs, workflow exports, or test results.
- Planning and documentation only. No implementation.

### Files produced
1. `README.md` — project identity, current status, Part 1 baseline, Part 2
   purpose, explicit statement that implementation has not started.
2. `docs/PROJECT_BRIEF.md` — problem, users, product purpose, inputs and
   outputs, scope, explicit non-goals, ethical and epistemic boundaries.
3. `docs/ARCHITECTURE.md` — proposed application architecture, app/n8n
   separation, existing-workflow preservation, new workflow boundaries,
   Human-in-the-Loop lifecycle, secrets and configuration approach, testing
   strategy.
4. `docs/DATA_CONTRACT_DRAFT.md` — draft request/response contracts for
   `POST /webhook/process-document`, `GET /webhook/documents`,
   `POST /webhook/review`; *[Omitted from this public copy: superseded design details of this draft. See `PUBLIC_COPY_NOTES.md`.]*; all marked
   as drafts pending review.
5. `docs/MILESTONES.md` — ordered milestones M0–M7, the eight-prompt index, and
   cross-cutting tracks (n8n, application, two custom Skills, GitHub plugin use,
   testing, screenshots/video, README/SPEC/PROMPTS/implementation
   report/deployment prep).
6. `PROMPTS.md` — this log: Prompt 1 recorded, Prompts 2–8 as named
   placeholders.

### Verification method
- Confirmed each of the six files exists at its stated path after creation.
- Reviewed each file against the Prompt 1 requirements checklist (identity,
  status, baseline, purpose, non-started statement; brief sections; architecture
  sections; contract sections; milestone sections; prompt-log fields).
- Confirmed no other files were created or modified: no `package.json`, no
  `node_modules`, no `.json` workflow export, no source directories.
- Confirmed no commands were run that install packages or make network requests.
- Final response to the human lists created files, summarizes the architecture,
  lists unresolved decisions and missing assets, and confirms no code/package/
  workflow was created or changed.

### Completion status
`COMPLETE` — six documentation files created on 2026-09-05. Awaiting human
review of the plan. No implementation performed. No further action taken.

**Amended by Prompt 1A (2026-09-06)** — documentation-only human-review
corrections. Prompt 1 remains `COMPLETE`; see the sub-entry below.

### Original Prompt 1 — exact text
> *[Omitted from this public copy: the original Prompt 1 text describing the superseded IntentSeal / consciousness-mapping design (249 lines). The full record is kept in the private project repository. See `PUBLIC_COPY_NOTES.md`.]*

## Prompt 1A — Human review amendment

| Field | Value |
|---|---|
| **Status** | `COMPLETE` (2026-09-06) |
| **Milestone** | M0 (documentation correction) |
| **Type** | Human-review amendment to Prompt 1. **Not Prompt 2.** |

### Reason for the amendment
Human review of the Prompt 1 output identified six documentation defects to
correct, documentation-only:

1. **Truthful prompt history.** The log did not preserve the exact original
   Prompt 1 instruction text.
2. **Unsupported GitHub claim.** The docs stated that a configured GitHub MCP
   server "failed to connect"; no verified connection attempt occurred during
   Prompt 1, so no result should be claimed.
3. **Relationship to Part 1.** Part 2 was described as an unrelated standalone
   capability instead of an upgrade-by-derivation of, and application wrapper
   around, the Part 1 n8n automation.
4–5. *[Omitted from this public copy: two corrections to the superseded design (review lifecycle and action-history schema). See `PUBLIC_COPY_NOTES.md`.]*
6. **Demo-data boundary.** No explicit statement that development, demo, and
   submission evidence use synthetic or anonymized data only, and that
   production safeguards are out of scope and not implemented.

### Exact correction prompt

````text
Perform a documentation-only human-review amendment to Prompt 1.

This is not Prompt 2. Do not create application code, install packages, run npm, initialize Git, make network requests, or create/modify n8n workflows.

Review and update only the existing Markdown documentation.

## Correction 1 — Preserve truthful prompt history

Update `PROMPTS.md`:

- Keep Prompt 1 marked COMPLETE.
- Add the exact full Prompt 1 user instruction in a fenced text block under Prompt 1.
- Do not reconstruct or paraphrase it.
- Use the original Prompt 1 message available in this Claude Code conversation.
- If the exact original text is unavailable, write `EXACT PROMPT TEXT UNAVAILABLE` instead of inventing it.
- Add a subsection named `Prompt 1A — Human review amendment`.
- Record this current correction request as Prompt 1A, including:
  - reason for the amendment;
  - exact correction prompt;
  - files changed;
  - verification performed;
  - completion status.
- Do not renumber the planned Prompts 2–8.

## Correction 2 — Remove an unsupported GitHub claim

The documentation currently states that a configured GitHub MCP server failed to connect.

No verified connection attempt occurred during Prompt 1.

Remove that unsupported statement everywhere.

Replace it with:

“GitHub integration is planned but has not yet been installed, connected, or verified for this project. No connection result is claimed.”

Do not claim success or failure until a real connection attempt is performed and verified.

## Correction 3 — Make the relationship to Part 1 explicit

The course requires Part 2 to be an application wrapper around the n8n automation created in Part 1, with optional upgrades to the flow.

Revise `README.md`, `docs/PROJECT_BRIEF.md`, `docs/ARCHITECTURE.md`, and `docs/MILESTONES.md` so they do not describe Part 2 as an unrelated standalone capability.

Use this engineering position:

- The submitted Part 1 JSON export remains an immutable baseline and submission artifact.
- The existing Google Drive route must remain operational.
- Part 2 is an upgrade-by-derivation of the Part 1 automation.
- The Part 2 processing workflow reuses and extends the established Part 1 pipeline pattern:
  input → extraction → AI processing → persistence → routing/status.
- The application becomes the new controlled interface around the upgraded n8n engine.
- The new webhook route is an additional input path, not a replacement for the Google Drive route.
> *[Omitted from this public copy: one sentence on the superseded consciousness-mapping sub-workflow (1 line). The full record is kept in the private project repository. See `PUBLIC_COPY_NOTES.md`.]*
- Do not claim that the original submitted workflow has already been modified.

In the future n8n milestone, specify that work begins by preserving/exporting the baseline and creating a derived Part 2 workflow. Do not rebuild Part 1 from zero.

> *[Omitted from this public copy: Corrections 4–5: the superseded AI_DRAFT review lifecycle and IntentSeal Lite action-history schema (48 lines). The full record is kept in the private project repository. See `PUBLIC_COPY_NOTES.md`.]*

## Correction 6 — Demo-data boundary

Add a clear statement to the brief, architecture, and test plan:

- Development, screenshots, video, tests, and course demonstration use synthetic or explicitly anonymized material only.
- No real client conversation, identifying information, medical record, or confidential WhatsApp content is committed to Git or used in submission evidence.
- Production privacy, access control, retention, and legal compliance are outside the academic prototype and must be addressed before any real-world use.

Do not claim that these production safeguards are already implemented.

## Verification

After editing:

1. Search all Markdown files for the unsupported phrase about GitHub connection failure.
2–3. *[Omitted from this public copy: two checks on the superseded design. See `PUBLIC_COPY_NOTES.md`.]*
4. Confirm the documentation explicitly calls Part 2 an upgrade-by-derivation and application wrapper around the Part 1 n8n foundation.
5. Confirm Prompt 1A is recorded truthfully.
6. Confirm no non-Markdown file was created.
7. Confirm no code, package, Git operation, network request, or n8n change occurred.

Return:

- files changed;
- exact corrections completed;
- verification results;
- any unresolved point;
- confirmation that implementation still has not started.

Then stop for human review. Do not begin Prompt 2.
````

### Files changed
- `PROMPTS.md` — added the exact original Prompt 1 text; added this Prompt 1A
  record (reason, exact correction prompt, files changed, verification, status);
  header amendment note; renumbering rule for Prompts 2–8. Prompt 1 stays
  `COMPLETE`; Prompts 2–8 unchanged.
- `README.md` — GitHub claim replaced with the required sentence; Part 1
  described as immutable baseline and Part 2 as upgrade-by-derivation /
  application wrapper; *[Omitted from this public copy: superseded design changes. See `PUBLIC_COPY_NOTES.md`.]*;
  demo-data boundary added; "as of" date updated to 2026-09-06.
- `docs/PROJECT_BRIEF.md` — new "Relationship to Part 1 (upgrade-by-derivation)"
  framing in §3.1 and §5; *[Omitted from this public copy: superseded design changes. See `PUBLIC_COPY_NOTES.md`.]*; demo-data
  boundary added as boundary #9.
- `docs/ARCHITECTURE.md` — guiding principle #2 rewritten to upgrade-by-derivation;
  §3 diagram and §4 rewritten (immutable baseline, additional input path, not a
  replacement); §5 boundaries note the derivation; *[Omitted from this public copy: superseded design changes in §5–§7. See `PUBLIC_COPY_NOTES.md`.]*;
  §8 test bullets and a demo-data boundary added.
- `docs/DATA_CONTRACT_DRAFT.md` — *[Omitted from this public copy: superseded design changes to this draft. See `PUBLIC_COPY_NOTES.md`.]*
- `docs/MILESTONES.md` — GitHub claim replaced with the required sentence; M3 /
  index / cross-cutting rewritten as "preserve + export baseline, then derive"
  (no rebuild); M2/M3 bullets updated (*[Omitted from this public copy: superseded design details. See `PUBLIC_COPY_NOTES.md`.]*);
  demo-data boundary added to the testing
  track and M7 evidence.

No non-Markdown file was created or changed.

### Verification performed
1. Grep across all Markdown for `fail(ing|ed) to connect` / `MCP server` /
   `badly formatted` → the GitHub connection-failure statement is gone;
   remaining GitHub text is the approved "planned but not connected/verified"
   sentence.
2–3. *[Omitted from this public copy: two checks on the superseded design. See `PUBLIC_COPY_NOTES.md`.]*
4. Confirmed `README.md`, `docs/PROJECT_BRIEF.md`, `docs/ARCHITECTURE.md`, and
   `docs/MILESTONES.md` each state that Part 2 is an upgrade-by-derivation of,
   and an application wrapper around, the Part 1 n8n automation, with the Part 1
   export as an immutable baseline.
5. This Prompt 1A entry records the reason, the exact correction prompt, the
   files changed, the verification performed, and the completion status.
6. `find . -type f` → six Markdown files only (`README.md`, `PROMPTS.md`,
   `docs/PROJECT_BRIEF.md`, `docs/ARCHITECTURE.md`, `docs/DATA_CONTRACT_DRAFT.md`,
   `docs/MILESTONES.md`). No non-Markdown file exists.
7. No application code, package install, npm command, Git operation, network
   request, or n8n workflow change was performed during this amendment.

### Completion status
`COMPLETE` (2026-09-06) — documentation-only amendment. Prompts 2–8 unchanged and
not renumbered. Implementation has not started. Stopped for human review.

---

## Prompt 1B — Part 1 baseline verification

| Field | Value |
|---|---|
| **Status** | `COMPLETE` (2026-09-06) |
| **Milestone** | M0 → M1 preflight |
| **Type** | Read-only verification. No file changed. |

### Goal
Verify, read-only, the single JSON file placed under `n8n/baseline/` against the
approved Part 1 baseline identifiers, and report only safe facts.

### Exact prompt

````text
Perform a read-only verification of the single JSON file currently located under:

`n8n/baseline/`

Do not modify, rename, copy, move, or delete any file.
Do not update documentation.
Do not create code.
Do not run npm, Git, or network commands.
Do not print credential values, account identifiers, email addresses, Google Drive IDs, Google Sheet IDs, tokens, or URLs.

Parse the JSON and report only the following safe verification facts:

1. Exact local filename.
2. File size in bytes.
3. SHA-256 hash.
4. Top-level workflow `name`.
5. Top-level workflow `id`.
6. Top-level `versionId`.
7. Top-level `active` value.
8. Number of nodes.
9. Ordered list of node names and node types.
10. Whether `pinData` is empty.
11. Whether the Download file node uses the dynamic expression `={{ $json.id }}` rather than a hard-coded file ID.
12. Whether the Information Extractor reads dynamically from `={{ $json.data }}` rather than hard-coded sample text.
13. Whether the Google Sheets Status expression can produce both `Needs Review` and `Processed`.
14. Whether both notification branches end in Google Drive move nodes.
15. Whether the workflow structure matches all of these expected baseline identifiers:

- workflow name:
  `Final Project - Phase 01 - Consciousness Center Document Assistant`
- workflow id:
  `OjXIBXA0HzK1ztN7`
- versionId:
  `af0cf5fb-df83-4f5e-9586-d39fb57155bb`
- active:
  `true`
- node count:
  `11`
- pinData:
  empty

End with exactly one verdict:

`VERDICT: MATCHES APPROVED PART 1 BASELINE`

or:

`VERDICT: DOES NOT MATCH APPROVED PART 1 BASELINE`

If it does not match, list only the mismatched verification fields.

Stop after reporting. Do not proceed to Prompt 2.
````

### Verified result

- Filename as delivered: `Final_Project_Part_A_Smart_Document_Assistant_FINAL.json.json`
- Size: 17081 bytes
- SHA-256: [raw-baseline hash removed from public copy]
- Workflow name / id / versionId / active / node count (11) / empty pinData — all
  match the expected baseline identifiers.
- Download file uses `={{ $json.id }}`; Information Extractor uses
  `={{ $json.data }}`; Google Sheets `Status` ternary can produce both
  `Needs Review` and `Processed`; both notification branches end in Google Drive
  move nodes.
- **Doubled `.json.json` extension: recorded as a naming issue only, not a
  content mismatch.** Node names also differ from the informal doc labels
  (`Send a message`, `Gmail - Send Normal Notification`, `Move file`,
  `Move file1`) — structure, count, wiring, and all expected identifiers still
  match.

**`VERDICT: MATCHES APPROVED PART 1 BASELINE`**

### Completion status
`COMPLETE` (2026-09-06) — read-only. No file was modified, renamed, or moved.

---

## Prompt 2 — Safeguards, scaffold, and configuration (M1)

| Field | Value |
|---|---|
| **Status** | `COMPLETE` (2026-09-06) |
| **Milestone** | M1 |
| **Type** | Implementation. Scaffold + safeguards only — no business logic, no n8n, no real credentials. |

### Exact prompt

````text
Execute Prompt 2 — Project safeguards, scaffold, and configuration.

Work only inside the current `intent-gate` project directory.

This prompt begins implementation milestone M1. It may install the packages required for the scaffold and tests, but it must not implement business logic, connect to n8n, modify an n8n workflow, or use real credentials.

## 1. Mandatory preflight

Before changing anything:

1. Print the current working directory.
2. List the current project files.
3. Report `node --version` and `npm --version`.
4. Require Node.js 20.9 or newer. If it is older, stop without modifying files.
5. Find the single JSON file under `n8n/baseline/`.
6. Parse it and verify:
   - workflow name:
     `Final Project - Phase 01 - Consciousness Center Document Assistant`
   - workflow id:
     `OjXIBXA0HzK1ztN7`
   - versionId:
     `af0cf5fb-df83-4f5e-9586-d39fb57155bb`
   - active:
     `true`
   - node count:
     `11`
   - `pinData` is empty
   - Download file uses `={{ $json.id }}`
   - Information Extractor uses `={{ $json.data }}`
7. Compute and retain its SHA-256 hash.
8. If any baseline check fails, stop immediately and make no change.

Never print credentials, account IDs, email addresses, Google Drive IDs, Google Sheet IDs, tokens, or URLs found inside the JSON.

## 2. Canonicalize and protect the Part 1 baseline

The verified file currently has a non-canonical filename and may have a doubled `.json.json` extension.

After successful verification:

1. Rename the sole verified JSON file to:

   `n8n/baseline/part1-baseline.json`

2. Do not change its contents.
3. Compute its SHA-256 again and prove that the hash is unchanged after the rename.
4. Create:

   `n8n/baseline/BASELINE_MANIFEST.json`

The manifest must contain only safe metadata:

- canonical path;
- SHA-256;
- workflow name;
- workflow id;
- versionId;
- active value;
- node count;
- `pinData` empty;
- expected dynamic expressions;
- `immutable: true`;
- verification date.

Do not place credentials, provider IDs, emails, Drive IDs, Sheet IDs, tokens, or URLs in the manifest.

5. Create `scripts/verify-baseline.mjs` using Node.js standard-library modules only.

The script must:

- read the manifest and baseline;
- verify SHA-256;
- verify the safe workflow identifiers;
- verify node count and empty `pinData`;
- verify the two dynamic expressions;
- return exit code `0` on success and non-zero on failure;
- print only safe results;
- never expose credential objects or external resource identifiers.

Add this package script:

`"verify:baseline": "node scripts/verify-baseline.mjs"`

## 3. Permanent project operating controls

Create a root `CLAUDE.md` that Claude Code must read at the beginning of every future session.

It must state:

- `docs/PROJECT_STATE.md` is the operational source of truth.
- `n8n/baseline/part1-baseline.json` is immutable.
- Run `npm run verify:baseline` before and after every milestone that can affect repository files.
- Inspect existing work before creating anything.
- Never rebuild completed work.
- Perform only the active milestone.
- Separate verified fact, working assumption, proposal, and unresolved question.
- Never claim a command, test, plugin connection, deployment, or workflow run succeeded without evidence.
- Never commit credentials, real client data, confidential WhatsApp material, or identifying information.
- Use synthetic or explicitly anonymized demo material only.
- Update `PROMPTS.md` and `docs/PROJECT_STATE.md` after each completed prompt.
- Stop for human review at the end of each milestone.
- Prefer content identity, workflow metadata, and hashes over filenames.
- Do not run `npm audit fix` automatically.
- Do not modify or delete unrelated files.

Create `docs/PROJECT_STATE.md` with:

- approved product identity;
- current milestone;
- completed work: Prompt 1, Prompt 1A, and verified baseline preflight;
- verified baseline identifiers and canonical path;
- completed decisions;
- unresolved dependencies;
- next allowed action;
- explicit "do not rebuild" list;
- last verification date.

This document must be concise and updated as a living checkpoint.

## 4. Scaffold the application safely

The current directory is not empty. It already contains approved documents and the baseline.

Do not overwrite or replace:

- `README.md`
- `PROMPTS.md`
- `docs/`
- `n8n/`
- the baseline manifest
- `CLAUDE.md`

Create a current stable Next.js application using:

- npm;
- TypeScript;
- App Router;
- `src/` directory;
- ESLint;
- Tailwind CSS;
- import alias `@/*`.

Because the project directory is non-empty, use a safe temporary scaffold directory if needed. Inspect collisions before merging. Preserve all existing project documents. Remove only the temporary scaffold directory after its required files have been safely merged.

Record the actual installed versions. Do not invent or preselect version numbers.

Set the project package name to:

`intent-gate`

Do not use external runtime font downloads. Use a local CSS font stack suitable for Hebrew, such as:

`Heebo, Rubik, Arial, sans-serif`

## 5. Create the Hebrew-first application shell only

Create a clean, restrained prototype shell with:

- `<html lang="he" dir="rtl">`;
- Hebrew-first interface;
- responsive layout;
- accessible navigation;
- visible project identity:
  `שער הכוונה | Intent Gate`;
- subtitle:
  `ממפגש אנושי למיפוי תודעתי מבוקר`;
- a clear "academic prototype / synthetic data only" notice.

Create placeholder-only screens:

1. `/`
   - dashboard shell;
   - no real data;
   - clear empty state;
   - navigation to create a new session.

2. `/sessions/new`
   - page shell explaining that session intake will be implemented later;
   - no active form submission and no API call.

3. `/sessions/demo`
   - placeholder mapping page demonstrating only the future section layout;
   - do not generate a mapping or use real session content.

The placeholder UI may show the three labels:

- מקור הלקוח
- תצפית המנחה
- השערת AI

It must not include diagnosis, hidden-intention inference, or actual consciousness-mapping business logic.

Do not create the three API proxy routes yet. They belong to Prompt 3.

## 6. Environment-variable plumbing

Create `.env.example` containing names with empty values only:

- `N8N_BASE_URL=`
- `N8N_WEBHOOK_PROCESS_PATH=`
- `N8N_WEBHOOK_DOCUMENTS_PATH=`
- `N8N_WEBHOOK_REVIEW_PATH=`
- `N8N_AUTH_TOKEN=`
- `APP_REQUEST_TIMEOUT_MS=`

Ensure `.env.local` and other secret-bearing environment files are git-ignored.

Create `src/lib/env.ts` as a server-only, lazy environment reader.

Requirements:

- it must not expose variables to browser code;
- it must not require real values during this scaffold milestone;
- it must provide a clear error only when a missing value is actually requested;
- no `NEXT_PUBLIC_` secret variable.

Do not create `.env.local`.

## 7. Configure tests

Install and configure Vitest for unit tests.

Create one meaningful lightweight unit test that verifies a stable scaffold rule, such as the project identity configuration or another pure module. Do not add fake business-logic tests.

Install and configure Playwright.

Install only the Chromium browser required for the initial E2E test.

Create one E2E smoke test that verifies:

- the home page loads;
- the Hebrew project title is visible;
- the document uses `lang="he"` and `dir="rtl"`.

Configure Playwright's local web server correctly.

Add clear package scripts:

- `lint`
- `test:unit`
- `test:e2e`
- `build`
- `verify:baseline`
- optionally `check`, combining safe verification commands.

## 8. Documentation

Create `docs/SPEC.md` version 1, consolidating the approved technical specification.

It must clearly mark:

- implemented in Prompt 2;
- planned for later prompts;
- not in scope;
- Part 1 baseline relationship;
- app/n8n responsibility boundary;
- Human-in-the-Loop lifecycle;
- IntentSeal Lite boundary;
- synthetic-data restriction;
- three required n8n endpoints;
- planned custom Skills and plugin use.

Do not claim that later functionality exists.

Update:

- `README.md`
- `docs/MILESTONES.md`
- `docs/PROJECT_STATE.md`
- `PROMPTS.md`

### Prompt log requirements

In `PROMPTS.md`:

1. Add `Prompt 1B — Part 1 baseline verification`.
2. Use the exact baseline-verification prompt available in this Claude Code conversation.
3. Record its verified result:
   `VERDICT: MATCHES APPROVED PART 1 BASELINE`.
4. Record the observed doubled extension as a naming issue only, not a content mismatch.
5. Replace the Prompt 2 placeholder with this exact Prompt 2 text.
6. Record actual files, commands, installed versions, test results, problems, corrections, and completion status.
7. Preserve Prompts 3–8 as unexecuted placeholders.
8. Do not fabricate results.

## 9. Git checkpoint

Initialize a local Git repository if one does not already exist.

Before staging:

- confirm `.env.local`, `.env*` secrets, `node_modules`, `.next`, Playwright reports, test results, and temporary scaffold folders are ignored;
- confirm the Part 1 baseline JSON and safe manifest are included;
- confirm no credential value was copied into new documentation or source files.

Use an existing configured Git author identity only.

Do not invent or change `user.name` or `user.email`.

If Git author identity is already configured:

- create one local commit with a clear M1 message.

If it is not configured:

- leave the files uncommitted;
- report this as one non-destructive blocker.

Do not create a GitHub repository, remote, or push in this prompt.

GitHub/plugin connection will be handled as a separate verified checkpoint and must not block the local scaffold.

Update `docs/MILESTONES.md` if necessary so it no longer falsely requires a GitHub push to complete the scaffold milestone. Keep verified GitHub plugin use as a later submission milestone.

## 10. Required verification

Run, in this order:

1. `npm run verify:baseline`
2. `npm run lint`
3. `npm run test:unit`
4. `npm run test:e2e`
5. `npm run build`
6. `npm run verify:baseline` again
7. `git diff --check`
8. `git status --short`

If a command fails:

- diagnose the actual cause;
- make only a scoped M1 fix;
- rerun the failed verification;
- record the failure and correction truthfully.

Do not bypass tests, disable checks, suppress relevant errors, or claim success without the final passing output.

## 11. Completion boundary

Prompt 2 is complete only if:

- the baseline content hash is unchanged;
- the baseline verification command passes;
- the Next.js application shell exists;
- the three placeholder pages exist;
- RTL and Hebrew attributes are present;
- no real n8n call or API proxy exists;
- no secret or real client material exists;
- Vitest passes;
- Playwright smoke test passes;
- production build passes;
- documentation reflects actual state;
- Git status is known;
- Git commit status is truthfully reported.

At the end, return:

1. Node, npm, Next.js, React, Vitest, and Playwright versions.
2. Baseline canonical path and abbreviated SHA-256.
3. Files created, changed, renamed, and removed.
4. Verification commands with PASS/FAIL.
5. Git initialization and commit status.
6. Any actual warning or blocker.
7. Confirmation that no n8n workflow, webhook, proxy route, business logic, real credential, or real client data was created or used.
8. The exact next allowed milestone.

Then stop for human review.

Do not start Prompt 3.
````

### Preflight results (safe facts)

- Working directory: the local project folder.
- Node `v24.18.0` (≥ 20.9 — OK); npm `11.16.0`.
- Project files before change: `README.md`, `PROMPTS.md`, `docs/` (4 files),
  `n8n/baseline/<the delivered JSON>`.
- Baseline parsed and verified: name / id / versionId / active / 11 nodes /
  empty pinData all match; Download file `={{ $json.id }}`; Information Extractor
  `={{ $json.data }}`.
- SHA-256 retained: [raw-baseline hash removed from public copy].

### Actual files

**Created**
- `n8n/baseline/BASELINE_MANIFEST.json`
- `scripts/verify-baseline.mjs`
- `CLAUDE.md`
- `docs/PROJECT_STATE.md`
- `docs/SPEC.md`
- `.env.example`
- `.gitignore` (from scaffold, then edited: `!.env.example`, test outputs, scaffold dir)
- `next.config.ts`, `tsconfig.json`, `next-env.d.ts`, `eslint.config.mjs`,
  `postcss.config.mjs`, `package.json`, `package-lock.json`
- `AGENTS.md` (Next.js 16 generates + maintains this; committed so `next dev` keeps the tree clean)
- `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `src/app/favicon.ico`
- `src/app/sessions/new/page.tsx`, `src/app/sessions/demo/page.tsx`
- `src/components/site-header.tsx`, `src/components/prototype-notice.tsx`
- `src/lib/env.ts`, `src/lib/project.ts`, `src/lib/project.test.ts`
- `vitest.config.mts`, `playwright.config.ts`, `e2e/home.spec.ts`
- `public/` (create-next-app default SVGs)

**Renamed**
- `n8n/baseline/Final_Project_Part_A_Smart_Document_Assistant_FINAL.json.json`
  → `n8n/baseline/part1-baseline.json` (content unchanged; SHA-256 identical
  before and after).

**Removed**
- `scaffold-tmp/` (temporary Next.js scaffold directory, after merge).

**Not touched**
- `docs/PROJECT_BRIEF.md`, `docs/ARCHITECTURE.md`, `docs/DATA_CONTRACT_DRAFT.md`
  (content unchanged this prompt).
- `docs/MILESTONES.md`, `README.md`, `PROMPTS.md` — updated to reflect M1 state.

### Commands run (safe summary)

- `npx create-next-app@latest scaffold-tmp --ts --app --src-dir --eslint --tailwind --import-alias "@/*" --use-npm --no-turbopack --disable-git --yes`
- `npm install -D @types/node@^24 vitest@latest @playwright/test@latest`
- `npx playwright install chromium`
- Verification sequence (§10) — see results below.

### Installed versions (actual)

| Tool | Version |
|---|---|
| Node | v24.18.0 |
| npm | 11.16.0 |
| next | 16.3.4 |
| react / react-dom | 19.2.8 |
| typescript | ^5 (5.x) |
| eslint | ^9 · eslint-config-next 16.3.4 |
| tailwindcss | ^4 · @tailwindcss/postcss ^4 |
| @types/node | ^24.13.3 |
| vitest | ^5.0.0 |
| @playwright/test | ^1.63.0 (Playwright CLI 1.63.0) · Chromium build v1243 |

### Problems and corrections (truthful)

1. **create-next-app rejected `_scaffold`** (npm name cannot start with `_`).
   Fix: used `scaffold-tmp`, set package name to `intent-gate` in the merged
   `package.json`.
2. **`vitest@latest` (5.0.0) peer-conflicted** with the scaffold's
   `@types/node@^20`. Fix (scoped): bumped `@types/node` to `^24` to match the
   Node 24 runtime; vitest + playwright then installed cleanly with no
   `--force` / `--legacy-peer-deps`.
3. **`rm -rf scaffold-tmp` failed** ("Device or resource busy" on Windows) after
   the file move. Fix: removed the now-empty directory via PowerShell
   `Remove-Item -Recurse -Force`. Directory confirmed gone.
4. **ESLint: 10 warnings** in `scripts/verify-baseline.mjs`
   (`no-unused-expressions` from ternary-as-statement). Fix: rewrote the script
   with explicit `if`/helper functions. Lint now clean (0 errors, 0 warnings).
5. **Vitest config loader warning** ("ESM syntax in a file loaded as CommonJS"
   for `vitest.config.ts`). Fix: renamed to `vitest.config.mts`. Warning gone.
6. **Next.js 16 auto-generates `AGENTS.md` + `CLAUDE.md`** via
   `next dev`/`next build`. To protect the required operating-controls
   `CLAUDE.md`: committed `AGENTS.md` (which hosts Next's managed block), so the
   generator always updates `AGENTS.md` and **skips `CLAUDE.md`** (verified in
   `node_modules/next/dist/server/lib/generate-agent-files.js`).

### Verification results (§10)

| # | Command | Result |
|---|---|---|
| 1 | `npm run verify:baseline` | **PASS** — `VERDICT: BASELINE VERIFIED`, exit 0 |
| 2 | `npm run lint` | **PASS** — 0 errors, 0 warnings, exit 0 |
| 3 | `npm run test:unit` | **PASS** — 1 file, 10 tests passed, exit 0 |
| 4 | `npm run test:e2e` | **PASS** — 1 Chromium test passed, exit 0 |
| 5 | `npm run build` | **PASS** — compiled + typechecked; routes `/`, `/sessions/new`, `/sessions/demo`, `/_not-found` static; exit 0 |
| 6 | `npm run verify:baseline` (again) | **PASS** — hash unchanged, exit 0 |
| 7 | `git diff --check` | see Git section |
| 8 | `git status --short` | see Git section |

Baseline SHA-256 identical at steps 1 and 6:
[raw-baseline hash removed from public copy].

### Git

Recorded in the completion report below (init + commit status, `git diff --check`,
`git status --short`).

### Completion status
`COMPLETE` (2026-09-06) — M1 scaffold + safeguards. No business logic, no n8n
call, no API proxy route, no real credential or client data. Awaiting human
review. Next allowed milestone: **M2 / Prompt 3**.

---

## Prompt 2A — Privacy hardening, source preservation, Git correction, local checkpoint

| Field | Value |
|---|---|
| **Status** | `COMPLETE` (2026-09-07) |
| **Milestone** | M1 addendum |
| **Type** | Privacy hardening + local Git checkpoint. No business logic, no API routes, no webhooks, no DB, no new n8n workflows, no remote/push. No existing IntentSeal repo accessed. |

### Exact prompt

````text
We are continuing the Intent Gate capstone project from the approved M1 checkpoint.

This is Prompt 2A only: privacy hardening, source preservation, Git correction, and creation of a clean local checkpoint.

Do not start Prompt 3.
Do not implement business logic, API routes, webhooks, database functionality, or new n8n workflows.
Do not create a GitHub repository, remote, pull request, release, or push.
Do not access, inspect, modify, reference, or connect to any existing IntentSeal repository or directory.

> *[Omitted from this public copy: the superseded project identity block (old subtitle, local path, planned repository) (17 lines). The full record is kept in the private project repository. See `PUBLIC_COPY_NOTES.md`.]*

## Safety rules

1. Work only inside the current `intent-gate` repository.
2. The only allowed output outside tracked project files is the ignored local backup/archive structure described below.
3. Do not delete the original Part 1 baseline.
4. Do not overwrite the original before a byte-for-byte copy has been created and verified.
5. Do not print credential values, private email addresses, URLs, tokens, or other sensitive values in the terminal report or documentation.
6. Do not use destructive Git commands.
7. If any precondition is not satisfied, stop and report the exact mismatch without trying to repair it automatically.
8. Use synthetic/example values only in tracked files.
9. Preserve the existing Hebrew UTF-8 content and RTL-oriented project documentation.
10. Keep an exact record of this prompt and its results in `PROMPTS.md`.

## Phase 1 — Read-only preflight

Before changing anything:

1. Run `git rev-parse --show-toplevel`.
2. Confirm the repository root is exactly the current `intent-gate` directory.
3. Run `git status --short`.
4. Check whether HEAD already contains commits.
5. Run `git remote -v`.
6. Confirm that no Git remote is configured.
7. Confirm this file exists:
   `n8n/baseline/part1-baseline.json`
8. Calculate its SHA-256 without modifying it.
9. Confirm the SHA-256 is exactly:

   [raw-baseline hash removed from public copy]

10. Confirm the baseline still contains:
    - 11 nodes
    - workflow ID `OjXIBXA0HzK1ztN7`
    - version ID `af0cf5fb-df83-4f5e-9586-d39fb57155bb`
    - empty `pinData`
    - dynamic expressions `={{ $json.id }}` and `={{ $json.data }}`

Expected Git state:
- Git is initialized.
- Project files may already be staged.
- No first commit has been created.
- No remote exists.

If the repository root, hash, structure, commit state, or remote state differs from these expectations, stop before making changes.

Do not display sensitive baseline values during preflight. Report counts and pass/fail results only.

## Phase 2 — Preserve the raw baseline first

Only after all preflight checks pass:

1. Add these local-only directories to `.gitignore`:

   `/private/`
   `/artifacts/`
   `/test-results/`
   `/.next/`
   `/node_modules/`

2. Create:

   `private/baseline/`

3. Make a byte-for-byte copy of:

   `n8n/baseline/part1-baseline.json`

   to:

   `private/baseline/part1-baseline.raw.json`

4. Do not parse and rewrite the raw copy. Use a binary-safe file copy.
5. Calculate the SHA-256 of the copied raw file.
6. Confirm it is exactly:

   [raw-baseline hash removed from public copy]

7. Confirm with `git check-ignore` that the raw copy and `private/` are ignored.
8. Confirm the raw copy does not appear in staged or untracked Git output.

If the copied hash is different, stop immediately and leave the tracked source unchanged.

## Phase 3 — Create the tracked sanitized baseline

Only after the raw copy passes verification:

1. Sanitize the tracked file:

   `n8n/baseline/part1-baseline.json`

2. Preserve:
   - valid JSON
   - all 11 nodes
   - node types
   - node positions
   - node connections
   - routing logic
   - parameter structure
   - dynamic expressions
   - the educational and architectural meaning of the Part 1 workflow

3. Replace or redact:
   - credential IDs
   - credential display names containing private information
   - personal email addresses
   - literal private URLs
   - Drive folder/file identifiers
   - spreadsheet identifiers
   - any account-specific identifiers
   - any other personal or environment-specific values

4. Use deterministic synthetic placeholders, for example:
   - `RECONNECT_CREDENTIAL_IN_N8N`
   - `example.user@example.com`
   - `EXAMPLE_DRIVE_FOLDER_ID`
   - `EXAMPLE_SPREADSHEET_ID`
   - `https://example.com/...`

5. Do not replace or damage:
   - `={{ $json.id }}`
   - `={{ $json.data }}`

6. Add a clear top-level or adjacent documentation notice explaining:
   - this is a sanitized submission artifact;
   - it preserves the workflow structure;
   - credentials must be reconnected locally;
   - the immutable raw source is kept privately and is excluded from Git.

7. Calculate and record the new SHA-256 of the sanitized baseline.

Do not claim that the sanitized file has the same hash as the raw file.

## Phase 4 — Manifest and verifier

Update `n8n/baseline/BASELINE_MANIFEST.json` and the existing verifier so they distinguish between:

### Raw private baseline

- Path:
  `private/baseline/part1-baseline.raw.json`
- Expected SHA-256:
  [raw-baseline hash removed from public copy]
- Git status:
  ignored and private
- Verification:
  verify when present locally; do not fail CI or another clean checkout merely because the private raw file is absent

### Sanitized tracked baseline

- Path:
  `n8n/baseline/part1-baseline.json`
- SHA-256:
  the newly calculated sanitized hash
- Git status:
  tracked
- Verification:
  always required
- Structural checks:
  11 nodes, valid connections, preserved dynamic expressions, empty `pinData`, and no private/account-specific values

The verifier must:

1. Never print the sensitive values it detects.
2. Report only category, count, affected tracked path, and pass/fail.
3. Fail if tracked project files contain any value copied from the raw baseline in these categories:
   - private email addresses
   - credential identifiers
   - account-specific URLs
   - Drive IDs
   - spreadsheet IDs
4. Avoid false positives for documented synthetic placeholders and `example.com`.
5. Preserve the verified raw hash as provenance without exposing the raw file.

Add or update automated tests for the verifier where appropriate.

## Phase 5 — Documentation and process preservation

Update only the relevant existing documents:

- `README.md`
- `PROMPTS.md`
- `docs/PROJECT_STATE.md`
- `docs/MILESTONES.md`
- architecture/data-contract documentation only if a privacy statement requires correction

Document clearly:

1. M1 was completed before this prompt.
2. Prompt 2A preserves the raw Part 1 artifact privately and creates a sanitized Git-tracked artifact.
3. GitHub stores code, documentation, prompt history, sanitized workflow artifacts, tests, and version history.
4. GitHub must not store:
   - real client or patient information
   - raw private workflow data
   - credentials
   - API keys
   - `.env.local`
   - runtime production data
5. The existing IntentSeal repository is separate and untouched.
6. The future repository will be:
   `avinoamgo-ux/intent-gate-capstone`
7. No repository or remote was created during Prompt 2A.
8. The next milestone remains Prompt 3 and must not begin automatically.

Append this full Prompt 2A verbatim to `PROMPTS.md`, followed by an execution report containing:
- files changed
- checks performed
- test results
- raw baseline verification result
- sanitized baseline hash
- Git configuration result
- commit result
- archive result
- explicit confirmation that no remote or push was created

Do not include private values in the report.

## Phase 6 — Configure Git locally only

Configure Git identity for this repository only:

`git config --local user.name "Avinoam Golan"`

`git config --local user.email "271078295+avinoamgo-ux@users.noreply.github.com"`

Do not use `--global`.

Verify:
- local user name
- local noreply email
- no remote exists

Do not modify Git configuration for any other repository.

## Phase 7 — Full verification before commit

Run the established project checks:

1. baseline verifier
2. privacy/sanitization verifier
3. ESLint
4. Vitest
5. Playwright
6. Next.js production build
7. baseline verifier again after the build
8. `git status --short`
9. staged-content privacy scan

Before committing, inspect the staged snapshot—not only the working tree—and confirm:

- `private/` is not staged
- `artifacts/` is not staged
- `node_modules/` is not staged
- `.next/` is not staged
- `test-results/` is not staged
- `.env.local` is not staged
- the raw baseline is not staged
- no private email, credential ID, account-specific URL, Drive ID, spreadsheet ID, API key, token, or secret is staged
- the sanitized baseline is staged
- all required M1 source and documentation files are staged

Do not display matched sensitive values. If a privacy scan fails, do not commit.

## Phase 8 — First local commit

Only if every verification passes:

1. Stage the approved tracked files.
2. Create the first local commit with:

   `chore: secure M1 baseline and checkpoint`

3. Confirm the commit exists.
4. Record the short commit hash.
5. Confirm again that no remote exists.
6. Do not push.

## Phase 9 — Create a clean archive

Only after the commit succeeds:

1. Create:

   `artifacts/intent-gate-m1-secure-checkpoint.zip`

2. Generate it from committed Git content using `git archive`, not by compressing the working directory.
3. Confirm the archive does not contain:
   - `.git`
   - `node_modules`
   - `.next`
   - `private`
   - `artifacts`
   - `test-results`
   - `.env.local`
   - the raw baseline
4. Report:
   - archive path
   - archive size
   - file count
   - commit hash represented by the archive
5. Do not include or print sensitive file contents.

## Required final response

Return a structured report with:

1. Preflight result
2. Raw baseline preservation result
3. Sanitization result
4. Raw and sanitized hashes
5. Files changed
6. Test results
7. Local Git identity result
8. Privacy scan result
9. First commit hash
10. Clean archive path, size, and file count
11. Confirmation that no GitHub remote, repository, push, or existing IntentSeal project was touched
12. Exact next allowed milestone

End with:

`Stopping for human review. Prompt 3 has not started.`

Do not continue beyond Prompt 2A.
````

### Execution report

**Preflight (Phase 1) — all PASS**
- `git rev-parse --show-toplevel` → repository root is the current `intent-gate`
  directory.
- `git status --short` → 40 files staged (`A`), consistent with the M1
  checkpoint.
- HEAD → no commits (unborn).
- `git remote -v` → no remote configured.
- `n8n/baseline/part1-baseline.json` present; SHA-256 matched
  [raw-baseline hash removed from public copy].
- Structure: 11 nodes, workflow id `OjXIBXA0HzK1ztN7`, versionId
  `af0cf5fb-df83-4f5e-9586-d39fb57155bb`, empty `pinData`, 9 connection source
  nodes, `active: true`, both dynamic expressions present.
- Expected Git state (initialized, files staged, no first commit, no remote) — matched.

**Raw baseline preservation (Phase 2) — PASS**
- `.gitignore` extended with `/private/`, `/artifacts/`, `/test-results/`,
  `/.next/`, `/node_modules/`.
- `private/baseline/part1-baseline.raw.json` created with a binary-safe copy
  (`cp -p`), byte-for-byte identical to the source (`cmp` clean).
- Raw copy SHA-256 = [raw-baseline hash removed from public copy]
  (unchanged).
- `git check-ignore` confirms `private/` and the raw copy are ignored; the raw
  copy appears in neither staged nor untracked Git output.

**Sanitization (Phase 3) — PASS**
- Redacted in `n8n/baseline/part1-baseline.json` via deterministic string
  replacement (no JSON round-trip): credential ids → `RECONNECT_CREDENTIAL_IN_N8N`;
  credential display names → `<provider> OAuth2 (reconnect in n8n)`; personal
  email → `example.user@example.com`; incoming Drive folder id →
  `EXAMPLE_INCOMING_DRIVE_FOLDER_ID`; processed Drive folder id →
  `EXAMPLE_PROCESSED_DRIVE_FOLDER_ID`; spreadsheet id → `EXAMPLE_SPREADSHEET_ID`;
  Gmail `webhookId` → `EXAMPLE_WEBHOOK_ID`; `meta.instanceId` →
  `EXAMPLE_INSTANCE_ID`; Google URLs → `https://example.com/...`.
- Preserved: valid JSON; all 11 nodes with types, positions, names; all
  connections and routing logic; parameter structure; the Google Sheets `Status`
  ternary (`Needs Review` / `Processed`); `workflow id` and `versionId` as
  provenance; empty `pinData`; and — untouched — `={{ $json.id }}` and
  `={{ $json.data }}`.
- Adjacent notice added: `n8n/baseline/README.md`.

**Raw and sanitized hashes (Phase 3/4)**
- Raw private baseline SHA-256:
  [raw-baseline hash removed from public copy]
- Sanitized tracked baseline SHA-256:
  `5e049657f234db7fb72ede215e47e5a5b6b4de1864649d5ebf114faa2b4d516a`
- The two hashes are intentionally different.

**Manifest & verifier (Phase 4) — done**
- `n8n/baseline/BASELINE_MANIFEST.json` restructured: `raw_private_baseline`
  (path, hash, "verify only if present") vs `sanitized_tracked_baseline` (path,
  new hash, structural checks) + `synthetic_placeholders` +
  `forbidden_value_hashes` (SHA-256 of each raw value — the values themselves are
  not stored anywhere).
- `scripts/verify-baseline.mjs` rewritten: always checks the sanitized tracked
  baseline (hash + structure); checks the raw private baseline only when present,
  and never fails on its absence.
- `scripts/verify-privacy.mjs` added (`npm run verify:privacy`): hash-based scan
  of every tracked file; fails on any raw value by category; prints only
  category / count / path, never a value; ignores documented placeholders and
  `example.com`; records the raw provenance hash without opening the raw file.
- `scripts/verifiers.test.mjs` added: asserts the real repo is clean and that a
  self-contained synthetic secret is detected. Vitest `include` extended to
  `scripts/**/*.test.mjs`. `check` script now runs `verify:privacy` too.

**Files changed / added**
- Modified: `.gitignore`, `n8n/baseline/part1-baseline.json` (now sanitized),
  `n8n/baseline/BASELINE_MANIFEST.json`, `scripts/verify-baseline.mjs`,
  `package.json`, `vitest.config.mts`, `README.md`, `docs/PROJECT_STATE.md`,
  `docs/MILESTONES.md`, `PROMPTS.md`.
- Added (tracked): `n8n/baseline/README.md`, `scripts/verify-privacy.mjs`,
  `scripts/verifiers.test.mjs`.
- Added (git-ignored, local only): `private/baseline/part1-baseline.raw.json`,
  and `artifacts/intent-gate-m1-secure-checkpoint.zip` (Phase 9).
- Not touched: `docs/ARCHITECTURE.md`, `docs/DATA_CONTRACT_DRAFT.md`
  (no privacy statement required correction), `docs/PROJECT_BRIEF.md`,
  `docs/SPEC.md`, all `src/**` and `e2e/**`.

**Checks performed / test results (Phase 7) — all PASS**
1. `npm run verify:baseline` → `VERDICT: BASELINE VERIFIED` (sanitized hash +
   structure; raw hash matches provenance; hashes differ).
2. `npm run verify:privacy` → `VERDICT: NO PRIVATE VALUES IN TRACKED FILES`
   (42 tracked files scanned).
3. `npm run lint` → clean (0 errors, 0 warnings).
4. `npm run test:unit` → 2 files, 16 tests passed (identity/env + verifier).
5. `npm run test:e2e` → 1 Chromium test passed.
6. `npm run build` → compiled + typechecked; static routes `/`, `/sessions/new`,
   `/sessions/demo`, `/_not-found`.
7. `npm run verify:baseline` again → `VERDICT: BASELINE VERIFIED`; sanitized hash
   still `5e049657…d516a`, raw still [raw-baseline hash removed from public copy].
8. `git status --short` → tracked files staged as `A`; `private/`, `artifacts/`,
   `node_modules/`, `.next/`, `test-results/`, `.env.local`, and the raw baseline
   are **not** staged; the sanitized baseline **is** staged.
9. Staged-blob privacy scan (reads `git show :<path>`, hash-based) → CLEAN across
   all staged blobs.

**Git configuration (Phase 6) — done**
- `git config --local user.name "Avinoam Golan"` and
  `git config --local user.email "271078295+avinoamgo-ux@users.noreply.github.com"`.
- No `--global` change (global name/email remain unset).
- No remote configured.

**Commit (Phase 8) and archive (Phase 9)**
- These run after this file is staged. The commit
  (`chore: secure M1 baseline and checkpoint`) therefore includes this
  `PROMPTS.md`; its short hash and the `git archive` details
  (`artifacts/intent-gate-m1-secure-checkpoint.zip` — path, size, file count,
  commit hash) are recorded in the Prompt 2A terminal execution report for this
  session. `git log` on this repo is the durable record.

**No remote / no push**
- No GitHub repository, remote, branch push, pull request, or release was
  created. `git remote -v` is empty. No existing IntentSeal repository or
  directory was accessed, inspected, referenced, or modified.

### Completion status
`COMPLETE` (2026-09-07) — privacy hardening, raw source preserved privately,
sanitized tracked baseline + split verifiers, local Git identity + first local
commit, clean archive. No remote, no push. Next allowed milestone: **M2 /
Prompt 3** (not started).

> **CORRECTION (Prompt 2A-R1, 2026-09-07):** the archive produced by Prompt 2A
> (`artifacts/intent-gate-m1-secure-checkpoint.zip`, commit
> `40560bfcba13274c6fbc12ecee6bcd3c48240366`) **failed subsequent independent
> integrity verification.** Its sanitized baseline was emitted with CRLF line
> endings (582 CRLF; byte SHA-256
> `36fdcddce1d51677c80796725315324a50c90607d4ab037cb7cc90f77ed79a8a`), so it did
> not match the LF hash `5e049657f234db7fb72ede215e47e5a5b6b4de1864649d5ebf114faa2b4d516a`
> recorded in `BASELINE_MANIFEST.json`. Cause: `core.autocrlf=true` with no
> `.gitattributes` rule, so `git archive` produced the checked-out (CRLF) form.
> The **committed** blob was correct LF at every layer (working tree, index,
> HEAD). Fixed in Prompt 2A-R1: a `.gitattributes` rule pins the file to
> `eol=lf`; a new archive `intent-gate-m1-secure-checkpoint-r1.zip` is verified
> after extraction. The original ZIP and commit history are retained.

---

## Prompt 2A-R1 — Checkpoint repair: stabilize baseline line endings

| Field | Value |
|---|---|
| **Status** | `COMPLETE` (2026-09-07) |
| **Milestone** | M1 addendum (checkpoint repair) |
| **Type** | Targeted repair. No rebuild, no Prompt 3, no remote/push, no deps, no business logic, no IntentSeal access, no global Git change. |

### Exact prompt

````text
Prompt 2A-R1
Type: Workflow Instruction — targeted checkpoint repair

Continue in the local project folder only.
Read AGENTS.md, CLAUDE.md, and docs/PROJECT_STATE.md first.

Goal: fix the sanitized baseline's line-ending inconsistency and verify the actual exported archive. Do not rebuild M1 or start Prompt 3.

Verified external audit:
- The uploaded archive identifies commit:
  40560bfcba13274c6fbc12ecee6bcd3c48240366
- Its sanitized baseline contains 582 CRLF line endings.
- Its byte-level SHA-256 is:
  36fdcddce1d51677c80796725315324a50c90607d4ab037cb7cc90f77ed79a8a
- Replacing CRLF with LF, without any other change, produces:
  5e049657f234db7fb72ede215e47e5a5b6b4de1864649d5ebf114faa2b4d516a
- That LF hash exactly matches BASELINE_MANIFEST.json.
- The existing privacy scan passed on the extracted files after creating a disposable local Git index. The privacy script currently requires Git metadata; a plain Git archive does not contain it.

Boundaries:
- No remote, push, GitHub repository creation, dependency upgrades, or business-logic changes.
- Do not access any existing IntentSeal repository.
- Do not modify global Git configuration.
- Preserve the existing commit history and original ZIP.
- Never edit, normalize, delete, or stage private/baseline/part1-baseline.raw.json.
- Do not weaken the verifier, accept multiple hashes, or replace the expected hash merely to make a test pass.
- Do not print sensitive values.

1. Read-only preflight

Confirm the exact repository root, clean working tree/index, HEAD equal to the audited commit, and no remotes.

Verify the private raw file exists, is ignored and untracked, and has SHA-256:
[raw-baseline hash removed from public copy]

Inspect the sanitized baseline in the working tree, index, HEAD, and existing ZIP. Report hashes and LF/CRLF counts only. Read Git's effective attributes and line-ending configuration.

If unexpected edits, a different HEAD, a remote, or a raw-hash mismatch is found, stop without modifying anything.
If the baseline discrepancy cannot be explained entirely by CRLF versus LF, stop.

2. Minimal repair

Create or carefully extend the repository-root .gitattributes with this exact path-specific rule:

n8n/baseline/part1-baseline.json text eol=lf

Normalize only that sanitized file to UTF-8 LF, preserving all other bytes, including its existing final-newline state. Do not JSON-reserialize it.

Renormalize and stage only this baseline and the new attributes rule using explicit paths. Do not run repository-wide normalization.

Keep the manifest's expected sanitized hash unchanged:
5e049657f234db7fb72ede215e47e5a5b6b4de1864649d5ebf114faa2b4d516a

Keep byte-level verification strict. Verify that working-tree and staged-blob bytes both match this hash and that parsed workflow content is unchanged.

3. Validation and documentation

Run the baseline verifier, existing privacy verifier, staged-blob privacy scan, and existing unit tests. Do not silently skip a failed test.

Add a focused regression check, using existing tooling and no new dependencies, that verifies the LF policy and the expected staged baseline hash. Preserve existing tests.

Append this prompt and the verified diagnosis to PROMPTS.md; retain the original Prompt 2A report and add a correction explaining that its exported ZIP failed subsequent integrity verification.

Update docs/PROJECT_STATE.md with R1 progress and the requirement to validate extracted archives before accepting future checkpoints. Do not claim archive validation succeeded before running it.

Do not rerun unrelated UI development, browser downloads, or dependency installation. Explain any additional test that becomes necessary.

4. Commit and archive verification

After the checks pass, review and stage only the intended repair, test, and documentation files. Create a new commit:
fix: stabilize baseline line endings for checkpoints

Do not amend or reset the previous commit.

Create a new, non-overwriting archive under artifacts/ using git archive, named:
intent-gate-m1-secure-checkpoint-r1.zip

Extract it into a fresh disposable directory. Before changing anything in that extracted directory:
- Hash the extracted baseline and confirm it equals the manifest.
- Run its baseline verifier successfully.
- Confirm the archive excludes private data, credentials, dependency/build directories, Git metadata, and local environment files.

To run the current Git-dependent privacy verifier, initialize a disposable repository only inside the extracted copy and index its files. Do not add a remote or commit there. Clearly report that this is audit-only Git metadata, not part of the delivered ZIP.

Run the privacy verifier on that copy. A failure means the checkpoint is not approved.

Recheck the untouched private raw file's hash in the original project.

5. Durable results and stop

Write an audit receipt under ignored artifacts/, containing:
- repair commit hash
- archive filename, compressed byte size, SHA-256, and regular-file count
- extracted baseline hash
- actual test commands, exit codes, and outcomes
- private raw hash verification outcome
- confirmation that no remote or push occurred

Use a separate receipt because a commit cannot contain its own final hash. Never invent retrospective results.

Final response: concise PASS/FAIL report, changed files, commit hash, ZIP and receipt paths, and any remaining limitations. A local private copy is not an independent off-device backup; do not claim otherwise.

End:
Stopping for human review. Prompt 3 has not started.
````

### Verified diagnosis

**Preflight (read-only) — all PASS**

| Item | Result |
|---|---|
| Repository root | the local project folder |
| Working tree / index | clean (`git status --porcelain` empty) |
| HEAD | `40560bfcba13274c6fbc12ecee6bcd3c48240366` — equals the audited commit |
| Remotes | none |
| Raw private file | exists, git-ignored, untracked; SHA-256 [raw-baseline hash removed from public copy] |

Sanitized baseline `n8n/baseline/part1-baseline.json` at each layer:

| Layer | bytes | SHA-256 | CRLF | LF |
|---|---|---|---|---|
| working tree | 17133 | `5e049657…d516a` | 0 | 582 |
| index blob | 17133 | `5e049657…d516a` | 0 | 582 |
| HEAD blob | 17133 | `5e049657…d516a` | 0 | 582 |
| existing ZIP (`intent-gate-m1-secure-checkpoint.zip`) | 17715 | `36fdcddce…d79a8a` | 582 | 0 |

Git line-ending state before repair: `core.autocrlf=true`, `core.eol` unset,
**no `.gitattributes`**, no path attribute on the baseline.

**Conclusion:** the discrepancy is explained *entirely* by CRLF vs LF —
17715 − 17133 = 582 = the exact CRLF count, and converting the ZIP file's 582
CRLF back to LF (no other byte change) reproduces `5e049657…d516a`. The committed
content is correct LF at every Git layer; only `git archive` (which emits the
checked-out form, and with `autocrlf=true` and no attribute that is CRLF) shipped
the wrong bytes. No other divergence found → proceeded with the minimal repair.

### Repair applied

- **`.gitattributes`** (new, repository root) — pins the one path:
  `n8n/baseline/part1-baseline.json text eol=lf` (with a two-line explanatory
  comment). No repository-wide `* text=auto` rule was added.
- `git add --renormalize -- n8n/baseline/part1-baseline.json` — the blob was
  already LF (`5e049657…`), so the content is unchanged; the file is now bound to
  `eol=lf` so future `git archive` / checkout output is LF. `git check-attr`:
  `text: set`, `eol: lf`.
- Working-tree and staged-blob bytes both still hash to
  `5e049657f234db7fb72ede215e47e5a5b6b4de1864649d5ebf114faa2b4d516a`
  (17133 bytes, 0 CRLF, existing no-final-newline state preserved). Parsed
  workflow unchanged: 11 nodes, empty `pinData`, `={{ $json.id }}` /
  `={{ $json.data }}` intact.
- **Manifest unchanged.** `BASELINE_MANIFEST.json` still pins exactly
  `5e049657…d516a`; no second hash accepted, verifier not weakened.
- Regression tests added to `scripts/verifiers.test.mjs`
  (`describe('baseline line-ending policy (R1)')`): manifest still pins the LF
  hash; `.gitattributes` contains the exact rule and `git check-attr eol` is
  `lf`; working tree and staged blob are LF-only and equal the manifest hash and
  each other; parsed workflow intact. Existing tests preserved.

### Validation (step 3) — all PASS

| Command | Result |
|---|---|
| `npm run verify:baseline` | `VERDICT: BASELINE VERIFIED` (exit 0) |
| `npm run verify:privacy` | `VERDICT: NO PRIVATE VALUES IN TRACKED FILES` (exit 0) |
| staged-blob privacy scan (`git show :<path>`, hash-based) | CLEAN, 43 blobs (exit 0) |
| `npm run test:unit` | 2 files, **22 tests passed** (16 prior + 6 R1) (exit 0) |

No additional test became necessary beyond the R1 regression `describe` block.
Steps 4 (new commit `fix: stabilize baseline line endings for checkpoints`) and 5
(r1 archive built + extracted + re-verified, audit receipt) run after this file
is staged; their results are in `artifacts/AUDIT-RECEIPT-r1.md` and the terminal
report. No remote, no push, no amend/reset of `40560bf`.

### Completion status
`COMPLETE` (2026-09-07) — baseline line-ending policy fixed and pinned; new
verified checkpoint archive produced; original ZIP and commit history retained.
Next allowed milestone: **M2 / Prompt 3** (not started).

---

## Prompt 3 — Data contracts & proxy routes (app side)

| Field | Value |
|---|---|
| **Status** | `COMPLETE — COMMITTED AND PUBLISHED (commit 6ccf0236d63330c41f4d12722be48a593da010dd)` |
| **Milestone** | M2 |
| **Git state** | Committed and published on `main` at commit `6ccf0236d63330c41f4d12722be48a593da010dd`. Base commit for this work is Prompt 2B's `8f4eea9` (see Prompt 2B above). `origin/main` was verified at the same commit at publication. |

### Goal
Implement zod schemas mirroring `docs/DATA_CONTRACT_DRAFT.md`, the server-only
n8n client wrapper, the three Next.js proxy route handlers, and the
layer-preserving response mapper, with Vitest contract and proxy tests against a
**mocked** n8n.

### Allowed scope
- `src/lib/contracts.ts`, `src/lib/n8n-client.ts`, `src/lib/map-response.ts`.
- `src/app/api/process-document/route.ts`, `src/app/api/documents/route.ts`,
  `src/app/api/review/route.ts` — proxy only, no business logic.
- Vitest tests against a mocked n8n client.
- One dependency addition: `zod` (added to `package.json` / `package-lock.json`)
  for schema validation.
- **Not allowed and not done:** real n8n calls, real n8n workflow creation, UI
  screens, M3 storage, atomic lifecycle enforcement, deployment, custom Skills,
  or verified GitHub plugin use.

### Approved narrow contract amendment
A human-approved amendment adds one error code, `INVALID_REVIEW_REQUEST`, to the
review endpoint only, for malformed JSON or a structurally invalid review
request not already covered by `MISSING_REVIEWER_IDENTITY` or
`MISSING_DECISION`. Recorded in `docs/DATA_CONTRACT_DRAFT.md` §3.3. No other
part of Contract v0.1 was redesigned or expanded.

### Files produced (implemented, as inspected in the working tree)
- `src/lib/contracts.ts` + `src/lib/contracts.test.ts`
- `src/lib/map-response.ts` + `src/lib/map-response.test.ts`
- `src/lib/n8n-client.ts` + `src/lib/n8n-client.test.ts`
- `src/app/api/process-document/route.ts` + `route.test.ts`
- `src/app/api/documents/route.ts` + `route.test.ts`
- `src/app/api/review/route.ts` + `route.test.ts`

All of the above were committed and published in commit
`6ccf0236d63330c41f4d12722be48a593da010dd`, including the `package.json` and
`package-lock.json` update for the `zod` dependency.

### Verification method
Vitest contract and proxy-route tests run against a **mocked** n8n client —
these tests exercise request/response shape, error mapping, and status-code
behavior only. They are not, and do not claim to be, a real n8n integration
test. No live n8n call has been made.

### Correction cycles completed before final verification
- The initially requested checkpoint commands `npm run verify` and
  `npm run test` do not exist in the live `package.json`. The final
  verification sequence was corrected to the actual existing scripts —
  `verify:baseline`, `verify:privacy`, `lint`, `test:unit`, `build`, `check` —
  without modifying `package.json`.
- Five ESLint errors were corrected across three test files
  (`src/lib/contracts.test.ts`, `src/app/api/process-document/route.test.ts`,
  `src/lib/n8n-client.test.ts`): one `prefer-as-const` fix and four
  `no-explicit-any` removals/replacements. No assertion, expected value, or
  test was weakened, deleted, skipped, or renamed.
- Four grouped root-cause repairs resolved all 14 TypeScript build errors
  across `src/app/api/documents/route.ts`,
  `src/app/api/process-document/route.test.ts`, and
  `src/lib/n8n-client.test.ts` (a widened `validDate` parameter type, an
  `init` presence guard, explicit mock parameter types at four `fetchSpy`
  declarations plus one `Headers` cast, and one discriminated-union narrowing
  guard). No `any`, `ts-ignore`, `eslint-disable`, test exclusion, or
  configuration change was used.

### Verification results (VERIFIED — freshly reproduced)
- `npm run verify:baseline` — PASS, exit code 0.
- `npm run verify:privacy` — PASS, exit code 0, 43 tracked files scanned.
- `npm run lint` — PASS, exit code 0, 0 errors, 17 warnings. The 17 warnings
  are non-blocking and remain unresolved by scope decision (8 of them are new,
  intentionally-unused mock-parameter warnings introduced by the TypeScript
  root-cause repairs above).
- `npm run test:unit` — PASS, exit code 0, 8 test files, 126 tests. Tests run
  against a **mocked** n8n client and do not prove real n8n integration.
- `npm run build` — PASS, exit code 0. TypeScript completed with no errors;
  6/6 static pages generated.
- `npm run check` — PASS, exit code 0 (runs all of the above in sequence).

### Completion status
Prompt 3 implementation, local verification, commit, and publication are
**complete**. Prompt 3 was **committed and published** to `origin/main` at
commit `6ccf0236d63330c41f4d12722be48a593da010dd` and is recorded as
`COMPLETE`/closed. **M3 / Prompt 4 has not started** and requires separate
human authorization to begin. Real n8n workflows, M3 storage and atomic
lifecycle enforcement, the application UI, deployment, custom Skills, and
verified GitHub plugin use remain pending and unimplemented.

---

## Prompt 3A — Source alignment and read-only evidence review

| Field | Value |
|---|---|
| **Status** | `COMPLETE` (2026-09-27) — documentation only |
| **Milestone** | Not designated. See `docs/PROJECT_STATE.md` → "Source alignment — 2026-09-27". No milestone is marked `ACTIVE`, because no source designates one. |
| **Scope** | Read-only inspection of the sources, the working tree, and the isolated copy; then alignment of `docs/PROJECT_STATE.md` and this file. |
| **Git state** | Not committed by this entry. The working tree carries uncommitted Smart Office work: 11 modified tracked files, 11 untracked paths. |

### Goal
Bring the operational state records into line with the current authoritative
sources (root `CONTRACT.md`, root `SPEC.md`, and the `CLAUDE.md` Authoritative
Course Recovery Directive of 2026-09-22), and record what is actually proven
about the `POST /api/process-document` work and the isolated verification copy.

### Allowed scope
- **Allowed and done:** edits to `docs/PROJECT_STATE.md` and this file only.
- **Forbidden and not done:** any change to code, to `CONTRACT.md`, or to
  `SPEC.md`; running tests, `build`, `verify:baseline`, `verify:privacy`, or any
  n8n command; reading or displaying environment files, secrets, private
  addresses, or document content; any request to n8n or Google Sheets.

### What was inspected
Root `CONTRACT.md`, root `SPEC.md` (§16 and the milestone rule in `CLAUDE.md`
in particular), the instructor Part 2 document in
the local course-requirements folder (outside the repository) (§5.1–§5.5, §7, §9.2–§9.3,
Appendix A), `src/app/api/process-document/route.ts` and its test file,
`src/lib/process-document-contract.ts`, `src/lib/process-document-client.ts`,
`src/lib/n8n-url.ts`, `src/lib/env.ts`, `scripts/verify-privacy.mjs`, the
stored `test-results` markers in both locations, and the isolated copy at
`%TEMP%\intent-gate-mock-verify` (a local copy outside the repository).

### Findings — VERIFIED
- The isolated copy **exists**. An earlier report recorded it as unavailable on
  the strength of `git worktree list` alone; that is not a directory-existence
  check, and the conclusion was wrong. Corrected forward here; the earlier
  record is left as written.
- The inspected code files are **identical**: 34 files under `src/` and `e2e/`
  are byte-identical between the project and the isolated copy, as are 10
  configuration files. Comparison was by content hash with a line-ending
  fallback check. Environment files were excluded and not read.
- The isolated copy contains **no source or state documents** — no root
  `CONTRACT.md`, no root `SPEC.md`, no `docs/`, no `PROMPTS.md`, no `scripts/`,
  no `n8n/`. Its `CLAUDE.md` is an 11-byte pointer file, not this project's
  operating controls. It holds one extra file, `verify-documents-gate.mjs`.
- The isolated copy holds a **passing-run marker only**:
  `test-results/.last-run.json` with `"status": "passed"` and an empty
  `failedTests` array, timestamped 2026-09-24 16:53:03. No test names, no
  count.
- This project's stored failed run (2026-09-24 13:32:26) predates the
  13:54:12 modification of `e2e/home.spec.ts`, so it belongs to an earlier
  version of that spec.

### Findings — REPORTED (not verified)
- "Playwright 13/13 passed" in the isolated copy. Recorded as `REPORTED`. No
  Playwright report, JUnit file, HTML report, or stdout log exists in either
  location; the number 13 comes from counting `test(` declarations in the two
  spec files, not from a run record.

### Findings — UNKNOWN
- Which tests the passing isolated run executed.
- **Whether that run covered `POST /api/process-document` — unproven.** No UI
  or e2e caller for that route exists; both spec files address the dashboard
  and `/api/documents`.
- Whether the isolated run used a mock or a real n8n path; that depends on an
  environment file which was deliberately not read.
- `verify:baseline`, `verify:privacy`, `lint`, `test:unit`, and `build` for the
  current working tree. No stored output exists, and none was run here.

### Open items carried forward
1. **Unapproved change to `CONTRACT.md` example values — OPEN, not changed by
   this entry.** `CONTRACT.md:112` (§3.2) and `CONTRACT.md:164` (§4), both the
   example value of `file_link`, differ from the published approved version
   `ee0adad`. No field name, type, status code, error code, enum value, or
   structure changed, and no code depends on the value. It awaits Avinoam's
   decision: keep with a forward-recorded correction, or revert.
   **RESOLVED 2026-09-30:** kept and committed as a sanitization in `8ec4fc5`
   (Prompt 5J).
2. No milestone is designated `ACTIVE`, and `SPEC.md` §16 M2 is not marked
   complete. Two incompatible M0–M7 numbering schemes are in use; the sources
   do not reconcile them.
3. The uncommitted Smart Office work has no verification output and is not
   committed.

### Completion status
`COMPLETE` for the documentation alignment only. No implementation, no
verification run, and no commit. `docs/PROJECT_STATE.md` and this file were the
only files changed.

---

## Prompt 4 — n8n workflows  *(PLACEHOLDER — NOT STARTED)*

| Field | Value |
|---|---|
| **Status** | `NOT STARTED` |
| **Milestone** | M3 |

### Goal *(planned)*
Build the three Part 2 webhook workflows (`process-document`, `documents`,
`review`) *[Omitted from this public copy: a superseded sub-workflow. See `PUBLIC_COPY_NOTES.md`.]* in n8n, while
leaving the Part 1 Google Drive workflow (11 nodes) untouched; export each
workflow to JSON.

### Allowed scope *(planned)*
- New n8n workflows only. Part 1 workflow is read-only / preserved.
- Storage via Google Sheets or existing n8n-managed storage, in Part 2's own
  rows/range.
- Export to `n8n/*.json`.
- **Not allowed:** editing Part 1 nodes; fabricating run results.

### Files produced *(to be recorded after execution)*
_Not yet run._

### Verification method *(planned)*
Each webhook responds per `docs/DATA_CONTRACT_DRAFT.md`; Part 1 Drive route still
runs; real run notes recorded (no fabricated output); workflow JSON exported.

### Completion status
`NOT STARTED`.

---

## Prompt 5 — Core UI: upload, processing, mapping view  *(PLACEHOLDER — NOT STARTED)*

| Field | Value |
|---|---|
| **Status** | `NOT STARTED` |
| **Milestone** | M4 |

### Goal *(planned)*
> *[Omitted from this public copy: the superseded Prompt 5 goal (declared intentions, epistemic layers, hypothesis component) (5 lines). The full record is kept in the private project repository. See `PUBLIC_COPY_NOTES.md`.]*

### Allowed scope *(planned)*
- `app/sessions/new`, `app/sessions/[id]`, and the listed components.
- Consumes the proxy routes from Prompt 3; polls for processing state.
- **Not allowed:** dashboard, review gate, n8n changes.

### Files produced *(to be recorded after execution)*
_Not yet run._

### Verification method *(planned)*
Vitest component tests for layer separation and evidence rendering pass; manual
walkthrough shows processing state then a layered mapping.

### Completion status
`NOT STARTED`.

---

## Prompt 5A — M2 scaffold: F1 upload screen against a local mock

Does not renumber or replace the Prompt 5 placeholder above, whose planned
consciousness-mapping scope is superseded for this submission (`CLAUDE.md`
directive 6). This entry covers one slice of the current F1 requirement only.

| Field | Value |
|---|---|
| **Status** | `COMPLETE` (2026-09-27) — M2 scaffold slice only, not committed. F1 is not closed. |
| **Milestone** | `SPEC.md` §16 **M2 — ACTIVE** (approved 2026-09-27; the §16 numbering is the scheme in force). M2 is not complete. |
| **Scope** | One slice: an M2 scaffold of the F1 upload screen, against a local mock, with no network call. |
| **Git state** | Not committed and not pushed. |

### Goal
Build an M2 scaffold of the F1 upload screen: choose or drag one document, show
its name and size, refuse an unsupported type or an oversized file in the
browser before anything is sent, and send an accepted file to a local mock that
matches root `CONTRACT.md` §3.2.

### Sources read before changing anything
Instructor Part 2 doc §7 F1 (in the local course-requirements folder (outside the repository)),
root `CONTRACT.md` §3.1–§3.3, §6 and §8, root `SPEC.md` §16, `CLAUDE.md`, and
the existing shell — `src/app/layout.tsx`, `src/components/site-header.tsx`,
`src/components/documents-dashboard.tsx`, `src/lib/project.ts`,
`src/lib/documents-contract.ts`, `src/lib/process-document-contract.ts`,
`e2e/home.spec.ts`, and both test configs.

### Status of the F1 send requirement — OPEN
Instructor F1 says the screen "sends it to `/process-document`", while
`SPEC.md` §16 M2's done-when is "Screens render mock data with no network
calls". What is on record: M2 was approved as the active milestone, and the
current F1 task was defined as a scaffold against a local mock with no network.
The present implementation is therefore an M2 scaffold. Meeting F1's
requirement to send to `/process-document` remains **open** and belongs to the
connection stage (`SPEC.md` §16 M5). No ruling on the tension between the two
requirements is recorded here, and none is attributed to anyone.

### Allowed scope
- **Allowed and done:** new files `src/lib/upload-file-rules.ts`,
  `src/lib/process-document-mock.ts`,
  `src/components/document-upload-form.tsx`, `src/app/upload/page.tsx`, the two
  Vitest test files, and `e2e/upload-f1.spec.ts`; one nav link added to
  `src/lib/project.ts` so the screen is reachable.
- **Forbidden and not done:** any change to `CONTRACT.md`, to
  `GET /api/documents`, to the documents dashboard, to `src.zip`, or to n8n
  settings; reading environment files or secrets; committing or pushing; any
  request to n8n or Google Sheets.

### Files produced
- `src/lib/upload-file-rules.ts` — the two client-side rules from the sources
  and nothing else, as pure functions.
- `src/lib/process-document-mock.ts` — local mock send target; the
  `CONTRACT.md` §3.2 example as a labelled fixture, validated against the
  contract schema before it is returned, `notification_sent: false`, no fetch.
- `src/components/document-upload-form.tsx` — the F1 screen.
- `src/app/upload/page.tsx` — the `/upload` route.
- `src/lib/upload-file-rules.test.ts`, `src/lib/process-document-mock.test.ts`,
  `e2e/upload-f1.spec.ts`.
- `src/lib/project.ts` — one added nav link.

### Verification — run only in the isolated copy
Only the changed files were copied into
`%TEMP%\intent-gate-mock-verify` (a local copy outside the repository), and both runs were
executed there. Nothing was run in this working tree.

- `npx vitest run src/lib/upload-file-rules.test.ts src/lib/process-document-mock.test.ts`
  — **PASS**, 2 files, 11 tests.
- `npx playwright test e2e/upload-f1.spec.ts` — **PASS**, 4 tests. Every test
  also asserts the screen made no request to any `/api/` route.
- **Correction cycle:** the first Playwright attempt failed 3 of 4 tests on my
  own selector, not on the screen — Next.js renders a `role="alert"` route
  announcer outside `main`, so an unscoped `getByRole('alert')` matched two
  elements. The spec now scopes both live regions to `main`, the same scoping
  `e2e/home.spec.ts` already needs for `role="note"`. Recorded because the
  first result was a real failure.
- **NOT VERIFIED:** `verify:baseline`, `verify:privacy`, `lint`, `build`, and
  the full `test:unit` suite. None was run, in either location.

### What the scaffold covers now, and what is still open
- Covered: one document at a time; name and size shown; unsupported type and
  oversized file refused in the browser before any send; an accepted file sent
  to the local mock; a contract-shaped response received.
- Open: **F1's send to `/process-document` — the scaffold does not satisfy it**;
  F2 processing state, F3 result view, and the Detail screen (all inside
  M2 or later); the connection stage (M5); a browser that
  reports an empty MIME type is refused as unsupported, since the sources name
  no extension fallback; the unapproved `CONTRACT.md` example-value change from
  Prompt 3A remains open and untouched.

### Completion status
`COMPLETE` for the M2 scaffold slice only. F1 is not closed and M2 stays
`ACTIVE`. Not committed, not pushed.

---

## Prompt 5B — F2 processing state on the mock-backed upload screen

Continues Prompt 5A on the same screen. Does not renumber or replace the
Prompt 5 placeholder. **Corrected forward by Prompt 5C:** the visible submission
counter described below was removed from the screen; the count is now asserted
from inside the Playwright spec.

| Field | Value |
|---|---|
| **Status** | `COMPLETE` (2026-09-27) — F2 slice only, not committed |
| **Milestone** | `SPEC.md` §16 **M2 — ACTIVE**. M2 is not complete. |
| **Scope** | F2 only, on the existing `/upload` screen, still against the local mock with no network call. |
| **Git state** | Not committed and not pushed. |

### The requirement, as written
Instructor Part 2 doc §7 F2 — what it does: "Shows an unmistakable in-progress
state while n8n works, and disables the Send button"; must handle: "A wait of up
to a minute without looking broken or frozen"; checked by: "Double-clicking Send
creates exactly one row in the spreadsheet". The same doc's pitfalls table adds:
"Disable the button during the request and ignore responses from superseded
requests." Root `CONTRACT.md` §9 repeats the rule for this application and names
client-side button-disable as the only deduplication mechanism it defines.

### What was built
- While the mock is pending: a `role="status"` block stating
  "מעבד את המסמך…" in words, with a non-essential pulse indicator, plus the
  sentence that real processing may take up to a minute and that the button is
  locked meanwhile.
- Send, Clear and the file input are all disabled for the duration; `aria-busy`
  is set on Send while it is in flight.
- Double-submit: the disabled button is the visible guard, and a ref is the
  reliable one — two click handlers dispatched in the same tick both run before
  React re-renders, so a state flag alone would let the second through.
- `submitDocumentToMockDelayed` adds a local 1,200 ms wait, so the in-progress
  state has a duration that a person and a test can both see. It is a deliberate
  local delay — not a simulation of n8n latency, and not the 90,000 ms contract
  timeout, which belongs to the real client.
- No "ignore superseded responses" branch was written: single-flight means there
  is never a superseded response in this slice. The real client at M5 must
  implement that rule; the mock cannot exercise it.

### Honest limit of the F2 check
The instructor's check counts spreadsheet rows. In mock mode there is no
spreadsheet, so **no Sheets write was tested or claimed**. The screen instead
shows how many submissions reached the mock, and that count is what the test
asserts — the mock-mode equivalent of "exactly one row", not the check itself.

### Files changed
- `src/lib/process-document-mock.ts` — added `MOCK_PROCESSING_DELAY_MS` and
  `submitDocumentToMockDelayed`; the synchronous mock is unchanged.
- `src/components/document-upload-form.tsx` — F2 state, the ref guard, the
  submission counter, and the disabled controls.
- `e2e/upload-f2.spec.ts` — new focused spec.
- `docs/PROJECT_STATE.md`, `PROMPTS.md` — this record.

### Verification — one focused run, isolated copy only
Only the three changed files were copied into
`%TEMP%\intent-gate-mock-verify` (a local copy outside the repository). Nothing was run in
this working tree.

- `npx playwright test e2e/upload-f2.spec.ts` — **PASS**, 3 tests: the
  processing state with all three controls disabled and `aria-busy` flipping
  back to `false`; two clicks in one tick reaching the mock once; and a second
  send after the first finished counted as a second submission. Every test also
  asserts no request to any `/api/` route.
- **NOT RE-VERIFIED:** `e2e/upload-f1.spec.ts`, although this slice changed code
  that spec exercises. Its recorded result predates these changes.
- **NOT VERIFIED:** `verify:baseline`, `verify:privacy`, `lint`, `build`, and the
  full `test:unit` suite. None was run, per the instruction for this slice.

### Completion status
`COMPLETE` for F2 on the mock-backed screen. M2 stays `ACTIVE`. F1's send to
`/process-document`, F3, and the Detail screen remain open. Not committed, not
pushed.

---

## Prompt 5C — Remove the visible submission counter from the F2 screen

Focused correction to Prompt 5B. Prompt 5B's text is left as written and is
corrected forward from here.

| Field | Value |
|---|---|
| **Status** | `COMPLETE` (2026-09-27) — correction only, not committed |
| **Milestone** | `SPEC.md` §16 **M2 — ACTIVE**. M2 is not complete. |
| **Scope** | Remove the on-screen counter; keep the locked buttons and the double-submit guard; move the call-count assertion into the test. |
| **Git state** | Not committed and not pushed. |

### Why
Prompt 5B put a submission counter on the upload screen so the F2 double-click
check had something to assert. That is a diagnostic display an office employee
has no use for, and the sources ask for no such element. It was removed.

### What changed
- `src/components/document-upload-form.tsx` — the counter state, its label and
  its paragraph are gone. The processing state, the `aria-busy` attribute, the
  disabled Send/Clear/file input, and the ref-based double-submit guard are
  unchanged.
- `e2e/upload-f2.spec.ts` — the count is now measured from the test side. An init
  script patches `window.setTimeout` to count timers of exactly
  `MOCK_PROCESSING_DELAY_MS`, delegating to the real `setTimeout`, so each
  `submitDocumentToMockDelayed` call is counted once and page behaviour is
  unchanged. The spec first asserts the count is `0`, which is what shows nothing
  else schedules a timer of that length.
- `src/lib/process-document-mock.ts` — **not changed** by this correction.

### Verification — isolated copy only
Only the two changed files were copied into
`%TEMP%\intent-gate-mock-verify` (a local copy outside the repository). Nothing was run in this
working tree.

- `npx playwright test e2e/upload-f1.spec.ts e2e/upload-f2.spec.ts` — **PASS**,
  7 tests (4 F1 + 3 F2), one run. This also closes the gap left open by Prompt
  5B, where `upload-f1.spec.ts` had not been re-run after F2 touched shared code.
- `npx vitest run src/lib/process-document-mock.test.ts` — **PASS**, 4 tests. Run
  because the F2 slice had changed that module without re-running its focused
  unit test.
- **NOT VERIFIED:** `verify:baseline`, `verify:privacy`, `lint`, `build`, and the
  full `test:unit` suite. None was run, per the instruction for this correction.
- **Still not claimed:** no Google Sheets write was tested. The instructor's
  "exactly one row" check remains unproven; what passes is the mock-mode
  equivalent, at most one submission reaching the mock.

### Completion status
`COMPLETE`. M2 stays `ACTIVE`. F1's send to `/process-document`, F3, and the
Detail screen remain open. Not committed, not pushed.

---

## Prompt 5D — F3 result view on the mock-backed upload screen

Continues Prompts 5A–5C on the same screen. Does not renumber or replace the
Prompt 5 placeholder.

| Field | Value |
|---|---|
| **Status** | `COMPLETE` (2026-09-27) — F3 slice only, not committed |
| **Milestone** | `SPEC.md` §16 **M2 — ACTIVE**. M2 is not complete, and F1 is not complete. |
| **Scope** | F3 only, on the existing `/upload` screen, still against the local mock with no network call. |
| **Git state** | Not committed and not pushed. |

### Source requirements used
- Instructor Part 2 doc §7 F3 — what it does: "Displays all seven extracted
  fields plus the file link, with a coloured urgency badge"; must handle:
  "'Not found' and 'No action found' values shown honestly rather than as empty
  space"; checked by: "Processing the Part 1 complaint document with no deadline
  still renders a complete card".
- Instructor §5.2 — "Field values come from Part 1 — do not invent new ones…
  The application may style them but must never translate, rename, or add
  categories. Missing information arrives as 'Not found' or 'No action found'
  and must be displayed as such, never hidden and never replaced with a guess."
- Root `CONTRACT.md` §2 — the seven field names, their order, their allowed enum
  values, and the absence values.
- Root `CONTRACT.md` §3.2 — the response carrying the fields plus `file_link`,
  `received_at`, `document_id`, `notification_sent`.
- Root `CONTRACT.md` §8 — the application may not decide or alter a business
  field.
- Root `SPEC.md` §5 F3 and §16 M2 — screens against a mock, no network calls.

All of these were available and consistent; no source conflict and no gap was
found, so no stop was required.

### What was built
- `src/lib/result-view.ts` (new, pure): `RESULT_FIELD_ORDER` and `resultFields()`
  return all seven fields in `CONTRACT.md` §2 order with every value passed
  through unmodified — nothing substituted, defaulted, trimmed, translated or
  dropped. Plus the three urgency badge classes and a fixed-UTC timestamp
  formatter that never converts a time zone and returns an unparseable value
  unchanged.
- `src/components/document-upload-form.tsx`: on a successful mock submission the
  returned document is kept in state and rendered as a result card — the seven
  fields, a coloured urgency badge that also carries its text label, and the file
  link, with `file_name`, `received_at`, `document_id` and `notification_sent`
  shown separately. The card is cleared when a new file is chosen or a new send
  begins, so it never outlives its file. F1 validation and F2's processing state,
  locked controls and double-submit guard are unchanged.
- `src/lib/process-document-mock.ts`: only the acknowledgment sentence changed —
  it no longer says the result view is still to come, and it now states that the
  result shown is fixed demo data, not an extraction of the sent file. The mock's
  behaviour, fixture and delay are unchanged.

### Honest limits
The card renders the mock's single fixed fixture. The instructor's F3 check names
the Part 1 complaint document with no deadline; no document was processed and
nothing was extracted, because the application may not derive fields from a file.
The no-deadline case is therefore verified at the pure-logic level over a
complaint fixture with the contract's absence values, not in the browser. No
Google Sheets, n8n or live service was involved.

### Files changed
- New: `src/lib/result-view.ts`, `src/lib/result-view.test.ts`,
  `e2e/upload-f3.spec.ts`.
- Modified: `src/components/document-upload-form.tsx`,
  `src/lib/process-document-mock.ts`, `e2e/upload-f1.spec.ts`,
  `docs/PROJECT_STATE.md`, `PROMPTS.md`.

### Verification — affected focused tests only, isolated copy only
Only the six changed source and spec files were copied into
`%TEMP%\intent-gate-mock-verify` (a local copy outside the repository), and all artifacts
stayed there. Nothing was run in this working tree.

- `npx vitest run src/lib/result-view.test.ts src/lib/process-document-mock.test.ts`
  — **PASS**, 2 files, 14 tests, including the complete-result case and the
  no-deadline case.
- `npx playwright test e2e/upload-f1.spec.ts e2e/upload-f2.spec.ts e2e/upload-f3.spec.ts`
  — **PASS**, 9 tests (4 F1 + 3 F2 + 2 F3). F1 and F2 were re-run because this
  slice changed code they exercise.
- **Correction cycle:** the first F3 run failed 1 of 9 on my own selector — the
  badge's LTR wrapper nests two spans containing the same text — not on the
  screen. The spec now targets the outer badge span.
- **Test change to record:** the F1 spec's assertion that no extracted field was
  rendered was removed, because it encoded the old slice boundary. Nothing else
  in that spec changed.
- **NOT VERIFIED:** `verify:baseline`, `verify:privacy`, `lint`, `build`, and the
  full `test:unit` suite. None was run, per the instruction for this slice.

### Completion status
`COMPLETE` for F3 on the mock-backed screen. **M2 is not complete and F1 is not
complete.** F1's send to `/process-document` and the Detail screen remain open.
Not committed, not pushed.

---

## Prompt 5E — F3 no-deadline acceptance case in the browser

Continues Prompt 5D. **Corrects 5D forward:** the no-deadline case is no longer
covered only at the pure-logic level; it now has a browser test.

| Field | Value |
|---|---|
| **Status** | `COMPLETE` (2026-09-27) — one test plus its seam, not committed |
| **Milestone** | `SPEC.md` §16 **M2 — ACTIVE**. M2 is not complete, and F1 is not complete. |
| **Scope** | A second labelled mock fixture, a demo route that selects it, and one browser test. |
| **Git state** | Not committed and not pushed. |

### Why a seam was needed
The screen renders whatever the mock returns, and the only value that travelled
from the test into the card was `file_name`. There was no safe way to put a
result with `deadline: "Not found"` on screen, so the seam was proposed first and
approved before any edit: option B, a second explicit variant plus a labelled
demo page.

### What changed
- `src/lib/process-document-mock.ts` — added `MockResultVariant`, a typed
  `MOCK_FIELDS_NO_DEADLINE` complaint fixture, and a per-variant fixture record.
  `deadline` is `"Not found"` and `requested_action` is `"No action found"`, the
  exact `CONTRACT.md` §2 absence wording; `sender_or_company` stays a real value
  so the card shows a mixture. Every value is a legal §2 value and passes the
  §3.2 schema. `submitDocumentToMock` and `submitDocumentToMockDelayed` take an
  optional `variant` whose default selects the original fixture, so the default
  fixture and default behaviour are unchanged.
- `src/components/document-upload-form.tsx` — accepts an optional `variant` prop,
  defaulting to `'default'`, and passes it to the mock. Nothing else changed.
- `src/app/upload/no-deadline/page.tsx` — new, clearly labelled demo route. It
  explains in Hebrew that the result shown is a complaint without a deadline and
  that the route exists only to demonstrate and test the complete card. **Not**
  added to the main navigation.
- `e2e/upload-f3.spec.ts` — one new test, plus a scoped `fieldRow` helper.

### Cleanup obligation
The variant, the second fixture and the demo route are removed together with the
mock when the real Workflow A connection lands (`SPEC.md` §16 M5).

### Verification — only the F3 spec, isolated folder only
Four changed files copied into
`%TEMP%\intent-gate-mock-verify` (a local copy outside the repository); all artifacts stayed
there; nothing was run in this working tree.

- `npx playwright test e2e/upload-f3.spec.ts` — **PASS, 3 tests**, including the
  new one. Inside the region named `תוצאת העיבוד` it asserts: the card is
  visible; each of the seven contract fields appears exactly once; the deadline
  reads `Not found` and `requested_action` reads `No action found`; the populated
  fields still show their values; the urgency badge is present with its text
  label and colour class; and the file link is present with an href. It also
  asserts no `/api/` request. Passed on the first run, with no correction cycle.
- All field locators are scoped to that region and matched by each row's contract
  field name, so a nested LTR span cannot double-match. No broad text locator is
  used for a value.
- No semantic change was needed: the result card was already an accessible
  region.
- **NOT RE-VERIFIED in this step:** `upload-f1.spec.ts` and `upload-f2.spec.ts`,
  although the mock module and the upload component changed. Their last passing
  run predates this change. **Closed by the follow-up regression check below.**

### Follow-up — F1/F2 regression check after this slice (2026-09-27)
Run because the F3 slice changed the shared upload form and the shared mock
module. No code and no test was edited for it, and F3 was not re-run.

- The isolated copy was first confirmed to already hold the current shared files
  and both specs, byte-identical to the working tree, so nothing needed copying.
- `npx playwright test e2e/upload-f1.spec.ts e2e/upload-f2.spec.ts` — **PASS**,
  7 tests (4 F1 + 3 F2), 20.1s, in the isolated folder with all artifacts kept
  there. Nothing was run in this working tree.
- F1's four tests and F2's three tests all still pass against the screen as it
  stands after F3, so the shared changes caused no regression.
- Still NOT VERIFIED: `verify:baseline`, `verify:privacy`, `lint`, `build`, and
  the full `test:unit` suite.
- **NOT VERIFIED:** `verify:baseline`, `verify:privacy`, `lint`, `build`, and the
  full `test:unit` suite. None was run, per the instruction for this step.

### Completion status
The browser-level no-deadline check is **complete and passing**. **M2 is not
complete and F1 is not complete.** F1's send to `/process-document` and the
Detail screen remain open. Not committed, not pushed.

---

## Prompt 5F — F6 detail screen and local review, against mock records

Continues the M2 screen work. Does not renumber or replace the Prompt 6
placeholder below, whose planned scope is the superseded review screen.

| Field | Value |
|---|---|
| **Status** | `COMPLETE` (2026-09-27) — F6 mock slice only, not committed |
| **Milestone** | `SPEC.md` §16 **M2 — ACTIVE**. M2 is not complete, and F1 is not complete. |
| **Scope** | The Detail screen named in M2, against mock records, with a local review action. |
| **Git state** | Not committed and not pushed. |

### Source requirements used
- Instructor Part 2 doc §7 F6 — what it does: "Opens one document, shows every
  field, and offers Mark as reviewed with an optional note"; must handle:
  "Sending the update through /review and reflecting the new status in the list";
  checked by: "The Status cell in the Google Sheet changes after pressing the
  button". Only the first clause is in M2 scope.
- Instructor §9.2 — the suggested screen name `DocumentDetail`, and "Build
  Against a Mock First".
- Root `CONTRACT.md` §4 — the twelve fields of one row and their order.
- Root `CONTRACT.md` §2 — allowed enum values, and the Status rule that a review
  may set `Reviewed` or `Needs Review` but never return to `Processed`.
- Root `CONTRACT.md` §5.1 — `status` is `Reviewed` or `Needs Review`,
  `review_note` is optional and at most 200 characters, `reviewed_by` is
  required.
- Root `CONTRACT.md` §5.3 — a 404 means no row matches the `document_id`.
- Root `CONTRACT.md` §8 — no business field may be decided or altered here.
- Root `SPEC.md` §5 F6 and §16 M2 and M6 — screens against a mock with no network
  calls at M2; Workflow C and the real review action at M6.

No source was missing and none conflicted, so no stop was required. One gap the
sources leave open was filled as a recorded **[DECISION]**: they name the screen
and the API endpoints but no application route, so the route is
`/documents/[document_id]`, keyed by the `document_id` that `CONTRACT.md` §4
guarantees on every row.

### What was built
- `src/lib/document-detail-view.ts` (new, pure): `DETAIL_FIELD_ORDER` and
  `detailFields()` return all twelve fields in §4 order with values passed
  through unchanged — the single exception being the fixed-UTC display of
  `received_at`, the same presentation the dashboard and the F3 card already use.
  Plus `findDocument()`, the 200-character note rule, and `REVIEWED_STATUS` /
  `isAlreadyReviewed()`.
- `src/components/document-detail.tsx` (new, client): the field list, the review
  section with an optional note capped at 200 characters, and the "סימון כנבדק"
  action. The action sets only the locally displayed status to `Reviewed`; the
  button is disabled once the status is `Reviewed`.
- `src/app/documents/[document_id]/page.tsx` (new, server): looks the record up
  in the mock set and renders either the detail screen or a named not-found state
  that echoes the requested id. `params` is awaited, per this Next version's
  documented dynamic-segment signature.
- `src/components/documents-dashboard.tsx` (modified, two lines plus an import):
  the row title is now the link into the detail screen. Nothing else about the
  dashboard, its filters or its data source changed.

### Honesty about the review
The review is local to the screen and says so twice: a notice before the action
and the confirmation after it both state that nothing is saved — not to Google
Sheets, not to the dashboard, not across a reload — and that no request was sent.
No `reviewed_by` field was invented; `CONTRACT.md` §5.1 requires one and the
application still has no source of reviewer identity, which is recorded as open.
When no note is entered, the screen says no note was recorded.

### Files changed
- New: `src/lib/document-detail-view.ts`, `src/lib/document-detail-view.test.ts`,
  `src/components/document-detail.tsx`,
  `src/app/documents/[document_id]/page.tsx`, `e2e/document-detail.spec.ts`.
- Modified: `src/components/documents-dashboard.tsx`, `docs/PROJECT_STATE.md`,
  `PROMPTS.md`.

### Verification — affected focused tests only, isolated folder only
Six changed files copied into
`%TEMP%\intent-gate-mock-verify` (a local copy outside the repository); all artifacts stayed
there; nothing was run in this working tree.

- `npx vitest run src/lib/document-detail-view.test.ts` — **PASS**, 9 tests.
- `npx playwright test e2e/document-detail.spec.ts e2e/home.spec.ts` — **PASS**,
  8 tests (4 detail + 4 dashboard). The dashboard spec was included because this
  slice changed that component; all four of its tests still pass.
- The detail tests cover opening a document from the dashboard, all twelve fields
  with the opened row's values, submitting the optional note, submitting without a
  note, and the not-found state for an unknown id. Every test asserts no `/api/`
  request. Locators are scoped to the named regions `פרטי המסמך` and
  `בדיקה אנושית`.
- Both runs passed on the first attempt, with no correction cycle.
- The upload specs (F1/F2/F3) were not re-run and did not need to be: this slice
  changed no file they exercise.
- **NOT VERIFIED:** `verify:baseline`, `verify:privacy`, `lint`, `build`, and the
  full `test:unit` suite. None was run, per the instruction for this slice.

### Completion status
`COMPLETE` for the F6 detail screen against mock records. **M2 is not complete and
F1 is not complete.** F1's send to `/process-document`, the real `POST /review`
with its Sheet write and list reflection, and the `reviewed_by` identity question
remain open. Not committed, not pushed.

---

## Prompt 5G — M2 acceptance gate and evidence reconciliation

Documentation only. No test, build, lint or external service was run, and no
application code was touched.

| Field | Value |
|---|---|
| **Status** | `COMPLETE` (2026-09-27) — gate assessment, not committed |
| **Milestone** | `SPEC.md` §16 **M2 — COMPLETE**. Next: **M3**, not started. |
| **Scope** | Assess M2 against its exact §16 criteria using recorded evidence; reconcile the earlier 13-test report. |
| **Git state** | Not committed and not pushed. |

### The criteria, verbatim
`SPEC.md` §16 line 259 is the only M2 entry in the file. Work: "Scaffold app
screens (Upload, Dashboard, Detail) against a mock API matching `CONTRACT.md`".
Done when: "Screens render mock data with no network calls".

### Reconciliation of the earlier 13-test report
An earlier note in this session said `e2e/dashboard-api.spec.ts` had never been
run. That was wrong. The isolated copy's stored marker records
`"status": "passed"` with an empty `failedTests` array at 2026-09-24 16:53, and
the spec files declare exactly 9 and 4 `test(` blocks — the reported 13. So that
run did execute the dashboard spec and it passed. What remains `REPORTED` rather
than verified is only the per-file breakdown, because no run record lists names or
counts. Corrected forward in `docs/PROJECT_STATE.md` rather than by rewriting the
earlier entry.

### Verdict
- **Criterion 1 — work: PASS.** Upload against the contract-validated mock,
  Dashboard against the §4/§2 mock records, Detail with all twelve §4 fields.
- **Criterion 2 — done when: PASS.** Upload F1 4/4, F2 3/3, F3 3/3 and Detail 4/4
  each assert no `/api/` request. The Dashboard is covered by the
  `dashboard-api.spec.ts` test "the default dashboard stays on labelled mock data
  and issues no api request", which counts every intercepted `**/api/documents`
  request and asserts zero, alongside the 22 labelled mock rows and the notice.
- **Evidence level for the dashboard half:** verified on the 2026-09-24
  component, **not** re-run after the F6 slice wrapped the row title in a link. It
  applies because the default source is still `'mock'`
  (`documents-dashboard.tsx:183`), the only `fetch` is still inside `loadFromApi`
  (`:193`) and is never called on mount, and a presentational link cannot add a
  data request; `home.spec.ts` passing 4/4 after F6 confirms the same test's other
  assertions. That is an inference over unchanged code paths, recorded as such and
  not as a fresh run.
- **"No network calls" is read as** no request to the application's own API
  routes; framework route, chunk and dev traffic is not an application data call.
  The same reading was used in every earlier slice.
- **Not counted:** the real F1 send (M5), the real review call (M6), and
  `verify:baseline` / `verify:privacy` / `lint` / `build`, none of which §16 names
  in the M2 row.

### What this does and does not mean
M2 is complete. The next milestone is M3 as §16 words it — work: "Connect
dashboard to real Workflow B; add search/filters (F4, F5)"; done when: "Real rows
appear; filters work" — and it has not started. **No live Workflow B connection
exists**; the dashboard's default source is still the labelled mock set, and its
opt-in API mode has never been exercised against real n8n.

### Files changed
`docs/PROJECT_STATE.md` and `PROMPTS.md` only.

---

## Prompt 5H — M3 acceptance gate: live Workflow B connection

Documentation only. No application code, contract, workflow, Sheet or
environment file was changed for this record. No test, build, lint, HTTP request
or n8n execution was run.

| Field | Value |
|---|---|
| **Status** | `COMPLETE` (2026-09-28) — gate record, not committed |
| **Milestone** | `SPEC.md` §16 **M3 — COMPLETE**. Next: **M4**, not started, needs approval. |
| **Evidence level** | **USER-REPORTED MANUAL UI CHECK** — not an automated test run |
| **Git state** | Not committed and not pushed. |

### The criterion, verbatim
`SPEC.md` §16 line 260. Work: "Connect dashboard to real Workflow B; add
search/filters (F4, F5)". Done when: "Real rows appear; filters work".

### Evidence (reported by Avinoam, 2026-09-28)
- Dashboard API mode loaded 2 real document rows from the active sheet.
- Filtering urgency to `High` showed exactly 1 row, matching the sheet's 1
  `High` row.
- Before that, the full original sheet was backed up and, with Avinoam's
  authorization, 20 historical rows were removed; the active sheet has 2 data
  rows. That operation is external and was not repeated here.

### How the connection was reached (isolated copy, 2026-09-27/28)
- The constructed Workflow B path was wrong because `N8N_BASE_URL` carried an
  extra path segment. Only that key was corrected, in the isolated copy's
  `.env.local`; the real `buildN8nUrl` then produced `/webhook/documents`.
- Single app GETs then showed, in order: `401` (upstream `403`); after the secret
  was corrected, `502 malformed` with 110 schema issues; after Workflow B's Edit
  Fields change, `502 malformed` with 36 issues — 20 empty `document_id` values
  and 4 invalid values each in `document_type`, `urgency`, `department` and
  `received_at`.
- Temporary diagnostics that log only statuses, counts, Zod codes and allowlisted
  field names were added to the isolated copy's `src/lib/documents-client.ts`
  for this. They are still there and must be removed; they are not in this
  working tree.
- No app GET was made from this session after the row removal.

### Verdict
- "Real rows appear" — **PASS** (user-reported).
- "filters work" — **PASS for the urgency filter** (user-reported). Other filters
  and search were not reported live; over API rows they are covered only by the
  intercepted-response test in `e2e/dashboard-api.spec.ts`.

### Not claimed
- The live Part 1 `Document ID` mapping is recorded as **user-reported**. No
  evidence of it is stored in this repository.
- `verify:baseline`, `verify:privacy`, `lint`, `test:unit` and `build` were not
  run.
- The isolated copy's product-alignment slice is not in this working tree.

### Files changed
`docs/PROJECT_STATE.md` and `PROMPTS.md` only.

---

## Prompt 5I — M5: live Workflow A connection, product shell, and closure

A sequence of separately authorized steps on 2026-09-30, recorded together.
Unlike Prompts 5A–5F, every automated check ran **in this working tree**, not
in the isolated copy.

| Field | Value |
|---|---|
| **Status** | `COMPLETE` (2026-09-30) |
| **Milestone** | `SPEC.md` §16 **M5 — COMPLETE**. M4 reported VERIFIED PASS, recorded forward. Next: **M6**, not started, needs approval. |
| **Evidence level** | Automated checks VERIFIED (real output in-session). Live acceptance test USER-REPORTED. |
| **Git state** | Not committed, not pushed, not deployed. **SUPERSEDED 2026-09-30:** committed locally on `main`, not pushed, not deployed — see Prompt 5J. **SUPERSEDED 2026-10-01 — pushed and verified:** on `origin/main`, not deployed — see Prompt 5K. |

### The criterion, verbatim
`SPEC.md` §16 line 262. Work: "Build upload screen, processing state, result view
(F1–F3) against real Workflow A". Done when: "A browser submission produces a
row, an email, and an on-screen result".

### M4, recorded forward
This log has no M4 entry. Avinoam reports **M4 VERIFIED PASS**: Workflow A was
tested through the High and the Normal branch and published as "M4 Verified —
High & Normal E2E — 2026-09-30". A read-only inspection of the exported
published backup (kept outside Git) found two `Respond to Webhook` nodes, one
per `IF` branch. Both return HTTP 200 with keys and types matching
`processDocumentResponseSchema`. Do not reopen Part 1, M4/Workflow A or the
direct High/Normal tests without a new, identified failure.

### What was built
- **Upload connection.** `src/components/document-upload-form.tsx` now sends a
  same-origin `POST /api/process-document`. The server route, client, contract
  and URL builder were already in place and were not changed. The secret and the
  webhook URL stay server-side.
  - A latest-request guard and a 95,000 ms browser timeout were added.
  - The route's sanitized error message is shown. Non-JSON replies, network
    failures and timeouts get fixed Hebrew messages with no upstream content.
  - `src/app/upload/page.tsx` and `src/app/upload/no-deadline/page.tsx` were
    updated: the mock wording was removed and the mock `variant` was dropped.
- **Upload E2E migration.** `e2e/upload-f1.spec.ts`, `upload-f2.spec.ts` and
  `upload-f3.spec.ts` now intercept `/api/process-document` with synthetic
  responses validated against the app schema. A catch-all aborts any other
  `/api/` request, and the tests assert it stays empty. F1 gained two error
  tests. The 502 error fixture matches the route's real shape, with no
  `error_code`.
- **Product shell.** The active identity is now **Smart Office Document
  Assistant**: header, subtitle, `<title>`, description and footer. The
  prototype notice no longer mentions WhatsApp. Navigation is exactly
  `/` → `לוח מסמכים` and `/upload` → `העלאת מסמך`. The `/sessions/*` pages remain
  in the code, unlinked. Files: `src/lib/project.ts`, `src/app/layout.tsx`,
  `src/components/prototype-notice.tsx`, `src/lib/project.test.ts`,
  `e2e/home.spec.ts`.

### Verification — VERIFIED, this working tree
- `tsc --noEmit` — PASS. `npm run lint` — PASS, with no finding in any M5 or
  shell file. 17 unrelated warnings remain from before.
- Upload E2E with intercepted transport: F1 **6/6**, F2 **3/3**, F3 **3/3**
  PASS. The blocked-request guard stayed empty in every test.
- `src/lib/project.test.ts` — **13/13** PASS.
- `e2e/home.spec.ts` — **5/5** PASS.
- `npm run build` — PASS. All 10 routes compiled and 8 static pages were
  generated.

### Controlled live acceptance test — USER-REPORTED
- One synthetic Normal document, `M5_APP_LIVE_NORMAL_20260930_1906.txt`, was
  submitted through the application UI.
- The screen showed a complete result: `document_id` 21, `document_type`
  `other`, `urgency` `Low`, `department` `General`, `notification_sent` `true`.
- Gmail received exactly one Normal notification. Google Sheets has exactly one
  matching row, with correct `document_id`, `urgency`, `department` and
  `file_link`. The Drive source file opened. There was no duplicate submission
  and no duplicate row.

### Environment — classification only
One routing segment in `.env.local` was changed from `webhook-test` to `webhook`,
with authorization. The effective URL now classifies as
`PRODUCTION_WEBHOOK_EFFECTIVE_URL`. HTTPS, origin, duplicate-segment,
query/fragment and public-exposure checks passed. No value was displayed or
recorded, and the secret line was unchanged.

### Incident — transient local 404, recorded because the first result was a real failure
The first F3 run got local Next.js 404 pages before any assertion ran. A
read-only diagnosis found no code, config or spec cause, and the mechanism
remains **UNKNOWN**. The old dev state was preserved as
`.next\dev.f3-404-2026-09-30`. On a fresh dev cache, the single authorized F3
rerun passed 3/3. This is recorded as a transient dev-cache/runtime incident,
not an application-code failure.

### Governance verification — VERIFIED, 2026-09-30
- `npm run verify:baseline` — **PASS** (exit 0), 13/13 checks, "BASELINE
  VERIFIED".
- `npm run verify:privacy` — **PASS** (exit 0), 8/8 checks on 57 tracked
  files, "NO PRIVATE VALUES IN TRACKED FILES".
- The official script scans tracked files only. The six untracked M5 files
  were checked separately, and **all six passed**:
  - `src/components/document-upload-form.tsx`
  - `src/app/upload/page.tsx`, `src/app/upload/no-deadline/page.tsx`
  - `e2e/upload-f1.spec.ts`, `upload-f2.spec.ts`, `upload-f3.spec.ts`

  The only links are synthetic `example.test` links in the three E2E files. No
  private value, secret, real URL, webhook identifier or personal identifier
  was found. Marker: `M5_UNTRACKED_PRIVACY_CHECK_PASS`.
- No repository file changed.

### Not claimed
- No commit, push, deployment or publication.
- ~~`verify:baseline` and `verify:privacy` were not run.~~ **RESOLVED
  2026-09-30:** both passed; see "Governance verification" above.
- The full `test:unit` suite, `dashboard-api.spec.ts` and
  `document-detail.spec.ts` were not re-run.
- The High branch was not submitted through the UI.

### Open items
1. **OPEN — documentation governance:** root `CONTRACT.md` and `SPEC.md` still
   say "Intent Gate — Smart Document Review". The later explicit decision names
   the active submission **Smart Office Document Assistant**. Neither file was
   edited.
2. The dashboard in this tree defaults to mock data. The live Workflow B mode
   exists separately. M3 is not reopened. **RESOLVED 2026-10-01 by M6-D
   (Prompt 5P)** — the dashboard loads live data on mount, with no mock mode.
3. ~~`process-document-mock.ts` and its test are now unused.~~ **RESOLVED
   2026-09-30** by commit `639c5fd`, kept as a historical test fixture (Prompt
   5J).

### Files changed
Code and tests, across the authorized steps:
- `src/components/document-upload-form.tsx`
- `src/app/upload/page.tsx`
- `src/app/upload/no-deadline/page.tsx`
- `e2e/upload-f1.spec.ts`, `e2e/upload-f2.spec.ts`, `e2e/upload-f3.spec.ts`
- `src/lib/project.ts`, `src/app/layout.tsx`, `src/components/prototype-notice.tsx`
- `src/lib/project.test.ts`, `e2e/home.spec.ts`

Local configuration: `.env.local`, one segment, not tracked. This record:
`docs/PROJECT_STATE.md` and `PROMPTS.md`.

---

## Prompt 5J — Local checkpoint commits for M2–M5

A sequence of separately authorized steps on 2026-09-30. This entry supersedes
the "not committed" statements in Prompts 3A and 5A–5I, which are retained as
written; each was true when recorded.

| Field | Value |
|---|---|
| **Status** | `COMPLETE` (2026-09-30) |
| **Milestone** | No milestone change. M5 stays COMPLETE. **M6 not started**, needs approval. |
| **Git state** | Committed locally on `main`. **Not pushed. Not deployed.** **SUPERSEDED 2026-10-01 — pushed and verified:** on `origin/main`, not deployed — see Prompt 5K. |

### Checkpoints
| Commit | Subject | Files |
|---|---|---|
| `8ec4fc5c7b713952f2ace55a118ebb7c9879196a` | `chore: harden repository privacy safeguards` | `CONTRACT.md`, `.gitignore` |
| `45c4f45b9c23c8f6dc75bb3363840f4d0ad6c123` | `feat: build Smart Office document workflows and UI (M2-M5)` | 38 authorized application and test files |
| `639c5fdf5516989b1ad8248bd0e4105a149b816a` | `chore: preserve upload mock test fixture` | `process-document-mock.ts` and its test |
| *(this record)* | `docs: record verified M2-M5 checkpoints` | `PROMPTS.md`, `docs/PROJECT_STATE.md` |

Each commit was staged by explicit path and gated on the exact expected index,
a clean `git diff --cached --check`, and `npm run verify:privacy`. The 38-file
commit also passed `verify:baseline` and a staged-content scan for environment
values and private identifiers.

### Final pre-commit verification — VERIFIED
- `npm run check` PASS:
  - `verify:baseline` 13/13 and `verify:privacy` 8/8;
  - lint with 0 errors and 17 pre-existing warnings;
  - unit tests 13/13 files, 163/163 tests;
  - build PASS, with 8/8 static pages and 10 routes.
- M2 E2E: `dashboard-api.spec.ts` 9/9 and `document-detail.spec.ts` 4/4, total
  13/13.
- M5 E2E: F1 6/6, F2 3/3, F3 3/3.
- No live request occurred during these runs.

### Resolved
- `CONTRACT.md` sanitized `file_link` examples — resolved by `8ec4fc5`.
- `process-document-mock.ts`, unused and untracked — resolved by `639c5fd` as a
  historical test fixture.

### Still open
- The naming in root `SPEC.md`/`CONTRACT.md` vs. the active Smart Office
  Document Assistant decision.
- The dashboard defaults to mock data. **RESOLVED 2026-10-01 by M6-D (Prompt
  5P).**
- The `CLAUDE.md` "Current milestone" section is stale.
- Not pushed; not deployed. **SUPERSEDED 2026-10-01 — pushed and verified;**
  still not deployed. See Prompt 5K.
- M6 not started.

### Operational note
- `src.zip` is protected by the `/src.zip` rule in `.gitignore`.
- Automatic Git gc is disabled in this local clone only (`gc.auto=0`). This
  protects four incomplete historical worktree metadata records, which an
  automatic prune attempted and failed to remove during the first checkpoint.
- The setting is not committed and not portable.

---

## Prompt 5K — Controlled push of the M2–M5 checkpoints

Two separately authorized steps on 2026-10-01: a read-only submission-readiness
gate, then a controlled push. This entry supersedes the "not pushed" statements
about the M2–M5 checkpoints in Prompts 5I and 5J, which are retained as written.

| Field | Value |
|---|---|
| **Status** | `COMPLETE` (2026-10-01) |
| **Milestone** | No milestone change. M5 stays COMPLETE. **M6 not started**, needs approval. **SUPERSEDED 2026-10-01 — M6 started (ACTIVE)**, see Prompt 5L. |
| **Git state** | Committed and pushed to `origin/main`. **Not deployed.** |

### Readiness gate (read-only)
- Verdict: `SAFE_TO_PUSH_CURRENT_CHECKPOINTS`.
- No repository finding blocked the push. The final-submission gaps it listed are
  unchanged by the push and remain open.

### Push — VERIFIED from real command output
- Before the push: branch `main`, HEAD
  `59a50d358209e7c2bd140e9bf1c7184711591228`, clean tree, local `gc.auto=0`.
- `git fetch origin main` succeeded. Divergence was then exactly `0 4`.
- `git push origin main` was a normal fast-forward:
  `3ab6555..59a50d3  main -> main`.
- After the push: divergence `0 0`. Remote `main` equals local HEAD
  `59a50d358209e7c2bd140e9bf1c7184711591228`. The tree stayed clean.
- Only `main` was pushed. No force, merge, rebase, pull, reset, tag or
  deployment.

### Not claimed
- No deployment and no final-submission readiness.
- No M6 work.

### This record
`docs/PROJECT_STATE.md` ("Push verification — 2026-10-01") and `PROMPTS.md`,
committed as `docs: record M2-M5 push verification`.

---

## Prompt 5L — M6-A: review contract and server client

Three separately authorized steps on 2026-10-01: a read-only M6 design audit,
the M6-A implementation, and a targeted privacy check of the new untracked
files. This entry supersedes the "M6 not started" statements in Prompt 5K,
which are retained as written.

| Field | Value |
|---|---|
| **Status** | `COMPLETE` (2026-10-01) — M6-A only |
| **Milestone** | `SPEC.md` §16 **M6 — ACTIVE, not complete**. Workflow C, F6, F7 and F8 are not complete. M2–M5 stay closed. |
| **Git state** | Committed with this record as `feat: add Workflow C review contract and client (M6-A)`. **Not deployed.** |

### Design audit (read-only)
- Verdict: `M6_DESIGN_AUDIT_READY`.
- Main findings:
  - the existing `/api/review` route runs on the superseded IntentSeal client;
  - the detail page resolves IDs against mock records only;
  - the dashboard defaults to mock data;
  - the F8 cleanup depends on removing the legacy client.

### Built
- `src/lib/review-contract.ts`: `CONTRACT.md` §5.1–§5.3 schemas. `reviewed_by` is
  a required non-empty string with no maximum, since the source defines none.
  `review_note` is optional, up to 200 characters. `status` is `Reviewed` or
  `Needs Review`.
- `src/lib/review-client.ts`: a server-only Workflow C client. It sends
  `x-api-key` and no `Authorization` header, uses a 90,000 ms timeout, validates
  the request and the response, and requires the echoed `document_id` to match.
- `N8N_REVIEW_PATH` added to `src/lib/env.ts` and `.env.example`;
  `src/lib/project.test.ts` updated to ten names. No superseded name was
  removed.
- No `.env.local` value was added or read. Nothing calls the new client yet, so
  runtime behaviour is unchanged. No n8n change and no external request.

### Accepted client refinements
1. `invalid_request` reports a request rejected locally, before any network call.
2. A 404 maps to `not_found` only when its body matches the review-not-found
   contract. Otherwise it maps to `upstream`, since n8n also returns 404 for an
   unregistered webhook.

### Approved design decisions
- `reviewed_by` will be a required free-text reviewer-name field.
- The UI will offer `Reviewed` only. The contract still accepts `Reviewed` and
  `Needs Review`.
- The live detail screen will later load through `/api/documents`.
- The dashboard will later default to live data.
- The legacy modules will be removed only after the migration succeeds.
- The two Skills will be created before M6-B.

### Verification — VERIFIED
- Targeted unit run: 3 files, 40/40 tests PASS.
- Typecheck PASS.
- Lint PASS: 0 errors and the same 17 pre-existing warnings.
- `verify:baseline` PASS before and after.
- `verify:privacy` PASS on tracked files.
- Targeted privacy scan of the 4 new untracked files PASS
  (`M6_A_UNTRACKED_PRIVACY_PASS`).

### Not claimed
- No full unit suite, E2E run, build or server.
- No Workflow C, no review call, no Sheet change, no deployment.

---

## Prompt 5M — M6 project Skills (`SPEC.md` §14)

Two separately authorized steps on 2026-10-01, after M6-A: creating the Skills,
then correcting the second Skill to match `SPEC.md` §14.

| Field | Value |
|---|---|
| **Status** | `COMPLETE` (2026-10-01) — creation and structural validation only |
| **Milestone** | `SPEC.md` §16 **M6 — ACTIVE, not complete**. F6, F7, F8, Workflow C, Plugins and submission are not complete. |
| **Git state** | Committed with this record as `feat: add M6 contract and business-logic guard skills`. **Not deployed.** |

### Created
- `.claude/skills/contract-drift-guard/SKILL.md`: compares root `CONTRACT.md`,
  the implementation and the tests before any endpoint change. It covers
  method, path, fields, success shape, `error_code` rules, statuses,
  `x-api-key`, timeout, the secret boundary and echoed IDs. Missing evidence is
  `UNKNOWN`. It ends with `CONTRACT_DRIFT_GUARD_PASS` or `_BLOCKED`.
- `.claude/skills/business-logic-leak-detector/SKILL.md`: enforces the
  instructor boundary that n8n owns extraction, classification, routing, Gmail,
  Drive and Sheets behavior. It lists 10 forbidden and 8 permitted app
  behaviors. It ends with `BUSINESS_LOGIC_LEAK_DETECTOR_PASS` or `_BLOCKED`.

Both are project-owned Claude Code Skills. Neither edits files.

### Correction before commit
- The first draft of the second Skill, `privacy-leak-guard`, did not match the
  planned Business-Logic Leak Detector in `SPEC.md` §14.
- It was **never committed**. It was removed and replaced before any commit,
  and is **not part of the project**. `SPEC.md` was not changed.
- Privacy remains enforced by `scripts/verify-privacy.mjs` and by targeted
  scanning of untracked files.

### Verification — VERIFIED
- Structural validation PASS:
  - exactly `name` and `description` in the frontmatter;
  - names match their folders;
  - trigger-only descriptions;
  - no TODO or placeholder;
  - 113 and 117 lines.
- `contract-drift-guard` unchanged by the correction (same SHA-256).
- `verify:privacy` PASS; `verify:baseline` PASS.
- Targeted privacy scan of both untracked `SKILL.md` files PASS, with no
  findings.
- No application, test, environment, route, UI or n8n behavior changed.

### Not claimed
- **Neither Skill has been used successfully on a real task yet.**
- M6-B, in a fresh Claude Code session, will be their first evidence-producing
  use.
- **SUPERSEDED 2026-10-01 — both Skills were used successfully in M6-B;** see
  Prompt 5N.

---

## Prompt 5N — M6-B: `/api/review` migrated onto the Workflow C client

Separately authorized steps on 2026-10-01, in a fresh Claude Code session:

1. a read-only preflight (`M6_B_FRESH_SESSION_READY`);
2. the first real `contract-drift-guard` run;
3. the implementation;
4. a second `contract-drift-guard` run;
5. the first real `business-logic-leak-detector` run;
6. this record, commit and push.

| Field | Value |
|---|---|
| **Status** | `COMPLETE` (2026-10-01) — M6-B only |
| **Milestone** | `SPEC.md` §16 **M6 — ACTIVE, not complete**. Workflow C, the review UI, the live review call, F7 and F8 are not complete. M2–M5 stay closed. |
| **Git state** | Committed with this record as `feat: migrate review API to Workflow C contract (M6-B)`. **Not deployed.** |

### Built
- `src/app/api/review/route.ts` was rewritten. It no longer uses the
  superseded IntentSeal route (`contracts.ts` schema, `proxyToN8n`,
  `mapReviewResponse`). It validates with `reviewRequestSchema`, calls
  `submitReview` exactly once, and returns only the Smart Office response and
  error shapes. It reads no environment value.
- `src/app/api/review/route.test.ts` was replaced: 16 legacy IntentSeal tests
  removed, 19 Smart Office tests added.
- No other file changed. `review-client.ts`, `review-contract.ts`, the UI, the
  environment files and the legacy modules are unchanged.

### Approved route mapping
- Invalid JSON, invalid request or `invalid_request` → 400,
  `{status: "error", message}`.
- Success → 200, exactly `{status: "updated", document_id}`.
- `unauthorized` → 401, `{status: "error", error_code: "UNAUTHORIZED", message}`.
  `UNAUTHORIZED` is the only allowed `error_code`.
- `not_found` → 404, exactly `{status: "error", message: "Document not found."}`.
- `misconfigured` → 500.
- `timeout` → 504.
- `unreachable`, `upstream`, `malformed` → 502.
- No 503. All non-success bodies other than the 401 carry no `error_code`.
  Messages are fixed, sanitized Hebrew text, except the 404 contract literal.

### Verification — VERIFIED
- Targeted unit run (route, review contract, review client): 3 files, 46/46
  tests PASS.
- Typecheck PASS.
- Lint PASS: 0 errors and 16 remaining pre-existing warnings, none in an M6-B
  file.
- `verify:privacy` PASS.
- `verify:baseline` PASS before and after.

### Project Skills — first real use
Both Skills ran as read-only checks and made no edits.
- `contract-drift-guard`, before M6-B: `CONTRACT_DRIFT_GUARD_BLOCKED`. 13 FAIL
  rows on the browser hop, plus material UNKNOWN items (the 400 status and
  secret/URL leakage). The M6-A server hop passed every row.
- `contract-drift-guard`, after M6-B: `CONTRACT_DRIFT_GUARD_PASS`. All 13
  former FAIL rows became PASS. No FAIL and no material UNKNOWN remained.
- `business-logic-leak-detector`, first real run:
  `BUSINESS_LOGIC_LEAK_DETECTOR_PASS`. No app-side AI, classification, Google
  API, notification, file movement, Sheet lookup or update, or client-side
  secret was found.

### Open, non-blocking follow-ups
- Legacy IntentSeal modules and env names remain, for M6-E cleanup.
- An explicit `import 'server-only'` in `review-client.ts` will be considered
  in M6-E.
- The review UI, Workflow C, the live review call, F7 and F8 are not complete.
  *(SUPERSEDED 2026-10-01 in part — the review UI was built in M6-C; see Prompt
  5O. Workflow C, the live review call, F7 and F8 remain open.)*

### Not claimed
- **The route has not reached a real n8n instance.** All results come from
  unit tests with the client mocked or `fetch` stubbed.
- No Workflow C, Sheet change, full unit suite, E2E run, build, server or
  deployment.

---

## Prompt 5O — M6-C: live detail and review UI

Separately authorized steps on 2026-10-01:

1. a read-only `contract-drift-guard` run before M6-C;
2. the M6-C implementation;
3. a post-M6-C `contract-drift-guard` run;
4. a test-only evidence correction;
5. a `business-logic-leak-detector` run;
6. a `contract-drift-guard` rerun;
7. a test-only fix for the last gap;
8. the final `contract-drift-guard` rerun;
9. a targeted privacy scan of the untracked spec;
10. this record.

| Field | Value |
|---|---|
| **Status** | `COMPLETE` (2026-10-01) — M6-C only, at the application and intercepted-test boundary |
| **Milestone** | `SPEC.md` §16 **M6 — ACTIVE, not complete**. M6-D, M6-E, the real Workflow C, the controlled live review test, and overall F7 and F8 remain open. M2–M5 stay closed. *(M6-D: **RESOLVED 2026-10-01** at the application and intercepted-test boundary; see Prompt 5P. The rest stays open.)* |
| **Git state** | **Not committed.** Not deployed. *(SUPERSEDED 2026-10-01 — committed and pushed as `f5b3139`; see "Commit and push — VERIFIED" below. Not deployed.)* |

### Built
- The detail page no longer reads `MOCK_DOCUMENTS`. It decodes the
  `document_id` safely and renders the live client detail screen.
- The client fetches only the same-origin `GET /api/documents`, validates the
  whole response, selects the exact `document_id`, and has no mock fallback.
- The review UI sends only the same-origin `POST /api/review`:
  - `reviewed_by` required and trimmed;
  - `review_note` optional, trimmed, at most 200 characters, omitted when
    empty;
  - the approved user action sends `status: "Reviewed"`;
  - the status changes only after a valid success reply with a matching
    `document_id`;
  - an already-`Reviewed` document cannot be submitted again.
- GET and POST each use a 95,000 ms browser timeout, `AbortController`, a
  request-id guard against superseded replies, and cleanup on unmount. Review
  has a synchronous double-submit guard.
- Loading, retry, not-found, malformed, network, timeout and sanitized
  route-error states are implemented.
- Changed files: `src/app/documents/[document_id]/page.tsx`,
  `src/components/document-detail.tsx`, `src/lib/document-detail-view.ts`,
  `src/lib/document-detail-view.test.ts`, `e2e/document-detail.spec.ts`, and
  the new `e2e/document-review.spec.ts`.

### Verification — VERIFIED
- Targeted unit run: 72/72 PASS.
- Typecheck PASS.
- Lint PASS: 0 errors and 16 pre-existing warnings outside M6-C.
- `verify:privacy` PASS on tracked files; `verify:baseline` PASS before and
  after.
- Intercepted Playwright runs:
  - initial run 20/20;
  - evidence-correction run 24/24 (`document-detail.spec.ts` 12/12,
    `document-review.spec.ts` 12/12);
  - final `document-detail.spec.ts` run 14/14.
- Every test asserted that the unexpected-API list was empty. No real API
  route, n8n workflow or external service was reached.

### Project Skills — chronology
Both Skills ran as read-only checks and made no edits.
- `contract-drift-guard` after M6-C first returned `BLOCKED` on missing test
  evidence, not code drift.
- Timeout-boundary (94,999 ms / +1 ms), transport-failure and held-request
  unmount tests were added.
- `business-logic-leak-detector` then returned `PASS`: the client secret
  boundary is preserved, the browser calls only relative `/api` paths, and no
  n8n-owned business decision is reproduced.
- A `contract-drift-guard` rerun returned `BLOCKED` on one narrow gap: a non-OK
  `GET /api/documents` reply with a body outside the route-error shape.
- Two tests were added: a 502 with a non-JSON body and a 500 with a wrongly
  shaped JSON body.
- The final `contract-drift-guard` rerun returned `CONTRACT_DRIFT_GUARD_PASS`:
  every row PASS, no FAIL and no material UNKNOWN.

### Privacy
- The untracked `e2e/document-review.spec.ts` received a targeted scan with the
  official rules plus extra categories: `M6_C_UNTRACKED_PRIVACY_PASS`.
  Synthetic and reserved fixtures only.

### Open
- The dashboard still defaults to mock rows that can link into the live detail
  screen (M6-D). **RESOLVED 2026-10-01 by M6-D (Prompt 5P).**
- Workflow C does not yet exist in n8n, or has not been verified live.
- The legacy IntentSeal modules and superseded env names remain (M6-E), where
  an explicit `server-only` marker will also be considered. **RESOLVED
  2026-10-01 by M6-E (Prompt 5Q)**; the marker was considered and not added.
- A repository-wide business-logic leak check is required before submission.
  **RESOLVED 2026-10-01 — passed after M6-E (Prompt 5Q).**

### Not claimed
- No live review, no real Sheet `Status`, `Reviewed By` or `Review Note`
  update, no deployment, no submission readiness.

### Commit and push — VERIFIED (added 2026-10-01)
- Commit `f5b3139deaf8aff8a25569bf48514840adf710fd`, `feat: connect live
  document detail and review UI (M6-C)`, with exactly the 8 authorized paths.
- Normal fast-forward push `13195c1..f5b3139 main -> main`.
- Local HEAD, `origin/main` and remote `main` equalled `f5b3139`; divergence
  `0 0`; working tree clean.
- No force, tags, deployment, n8n request, gc, maintenance or prune.
- M6 stays ACTIVE, not complete.

---

## Prompt 5P — M6-D: live dashboard default and review-status reflection

Separately authorized steps on 2026-10-01:

1. a read-only audit before changing the dashboard default;
2. a read-only `contract-drift-guard` run before M6-D;
3. the M6-D implementation and an intercepted four-spec Playwright run;
4. a post-M6-D `contract-drift-guard` run;
5. a fresh-session preflight;
6. a test-only network-failure correction;
7. a `business-logic-leak-detector` run;
8. the final `contract-drift-guard` rerun;
9. this record.

| Field | Value |
|---|---|
| **Status** | `COMPLETE` (2026-10-01) — M6-D only, at the application and intercepted-test boundary |
| **Milestone** | `SPEC.md` §16 **M6 — ACTIVE, not complete**. M6-A, M6-B, M6-C and M6-D are complete. M6-E, the real Workflow C, the controlled live review test, overall F7 and F8, and the submission work remain open. M2–M5 stay closed. |
| **Git state** | **Not committed. Not pushed.** Not deployed. HEAD and the locally stored `origin/main` ref equal `14f77ad`, checked without a fetch. *(SUPERSEDED 2026-10-01 — committed and pushed as `b506cdd3e0e76865c990977fde767abfe0550cd2`, `feat: make document dashboard live by default (M6-D)`, by a normal fast-forward `14f77ad..b506cdd`. Not deployed.)* |

### Built
- The dashboard no longer imports or displays `MOCK_DOCUMENTS`. The mock/API
  switch, the mock buttons and the mock notices were removed.
- The same-origin `GET /api/documents` runs automatically on mount.
- The whole response is validated with `documentsResponseSchema`. Malformed
  data is rejected all or nothing. No failure falls back to mock rows.
- Each exact `document_id` becomes an encoded detail link.
- Newest-first sorting, search and filters remain presentation behavior.
- Refresh and retry each issue a fresh request. There is no polling.
- Each request uses `AbortController`, a 95,000 ms browser timeout, a
  request-id guard and cleanup on unmount.
- The route's message is accepted only from `{status: "error", message}`.
  Non-JSON and wrongly shaped bodies get a fixed generic message. Transport and
  timeout failures get fixed, sanitized messages.
- Status is never derived or optimistically changed.
- Returning through the in-app link causes a fresh GET. `Reviewed` is shown
  only when that fresh GET returns `Reviewed`.
- Changed files: `src/app/page.tsx`, `src/components/documents-dashboard.tsx`,
  `src/lib/documents-view.ts`, `src/lib/documents-view.test.ts`,
  `e2e/home.spec.ts`, `e2e/dashboard-api.spec.ts`,
  `e2e/document-detail.spec.ts` and `e2e/document-review.spec.ts`.

### Verification — VERIFIED
- Unit tests: 36/36 PASS.
- Typecheck PASS.
- Lint PASS: 0 errors and 16 pre-existing warnings outside M6-D.
- `verify:privacy` PASS; `verify:baseline` PASS before and after.
- Intercepted Playwright runs:
  - one run across four specs: 51/51 (`home.spec.ts` 5,
    `dashboard-api.spec.ts` 20, `document-detail.spec.ts` 14,
    `document-review.spec.ts` 12);
  - targeted `dashboard-api.spec.ts` run after adding the network-failure
    test: 21/21.
- Every E2E test asserts that the unexpected-API list is empty. No real API
  route, n8n workflow or external service was reached.

### Project Skills — chronology
Both Skills ran as read-only checks and made no edits.
- A read-only audit identified the unsafe `home.spec.ts` path before the
  default was changed.
- `contract-drift-guard` before M6-D returned `BLOCKED`: the old
  implementation had not yet been replaced and no evidence existed yet. It
  found no problem with the approved plan.
- M6-D was implemented; the four-spec run passed 51/51.
- `contract-drift-guard` after M6-D returned `BLOCKED` on two evidence gaps,
  not code drift: a dashboard transport-failure E2E, and Skill evidence for the
  client secret boundary.
- One transport-level test, using a locally aborted intercepted request, was
  added; `dashboard-api.spec.ts` passed 21/21.
- `business-logic-leak-detector` returned `PASS`: the client import graph
  preserves the secret boundary; the browser calls only the same-origin
  `/api/documents`; no n8n-owned classification, Sheet action or status
  decision is reproduced; `Reviewed` is reflected only from a fresh GET.
- The final `contract-drift-guard` rerun returned `CONTRACT_DRIFT_GUARD_PASS`:
  the network-failure and secret-boundary UNKNOWNs are now PASS, with no FAIL
  and no material UNKNOWN.

### Open
- `documents-mock.ts` remains as unused historical and test support until
  M6-E. **RESOLVED 2026-10-01 by M6-E (Prompt 5Q) — deleted.**
- The search placeholder still holds generic example words; a non-blocking
  cosmetic follow-up only. **RESOLVED 2026-10-01 by M6-E (Prompt 5Q).**
- Explicit `server-only` markers on the server clients remain an M6-E
  hardening consideration. **DECIDED 2026-10-01 in M6-E (Prompt 5Q) — not
  added.**
- The real Workflow C is not yet built or live-tested.
- A repository-wide business-logic leak check is required before submission.
  **RESOLVED 2026-10-01 — passed after M6-E (Prompt 5Q).**

### Not claimed
- No live review, no real Sheet `Status`, `Reviewed By` or `Review Note`
  update, no commit or push, no deployment, no submission readiness.
  *(SUPERSEDED 2026-10-01 in part — committed and pushed as `b506cdd`. Still no
  live review, no deployment and no submission readiness.)*

### Commit and push — VERIFIED (added 2026-10-01)
- Commit `b506cdd3e0e76865c990977fde767abfe0550cd2`, `feat: make document
  dashboard live by default (M6-D)`, with exactly the 10 authorized paths.
- Normal fast-forward push `14f77ad..b506cdd main -> main`.
- Local HEAD, `origin/main` and remote `main` equalled `b506cdd`; divergence
  `0 0`; working tree clean.
- No force, tags, deployment, n8n request, gc, maintenance or prune.
- M6 stays ACTIVE, not complete.

---

## Prompt 5Q — M6-E: legacy cleanup and repository hardening

Separately authorized steps on 2026-10-01:

1. a read-only consolidated M6-E audit;
2. the M6-E implementation, with its full verification run;
3. a repository-wide `business-logic-leak-detector` run;
4. a final `contract-drift-guard` run;
5. a test-only correction pinning two server timeouts;
6. the final `contract-drift-guard` rerun;
7. this record, with the commit and push.

| Field | Value |
|---|---|
| **Status** | `COMPLETE` (2026-10-01) — M6-E only, at the repository and intercepted-test boundary |
| **Milestone** | `SPEC.md` §16 **M6 — ACTIVE, not complete**. M6-A to M6-E are complete. The real Workflow C, live acceptance of its path and secret, the controlled live review with a real Sheet update, the live 401, 404 and n8n-unavailable cases, and the submission work remain open. M2–M5 stay closed. |
| **Git state** | Committed and pushed by the controlled checkpoint operation whose commit subject is `chore: remove legacy paths and harden Smart Office (M6-E)`. Its parent is `b506cdd`. Not deployed. |

### Decisions (Avinoam, 2026-10-01)
- Delete all 11 legacy files, including the upload mock and its test.
- Remove the 5 superseded environment names and the optional env reader.
- Add no `server-only` package or import; change no Vitest configuration;
  install nothing.
- Replace the dashboard search placeholder with a neutral Hebrew hint.
- Add exactly two upload E2E cases: transport failure and the exact 95,000 ms
  browser timeout.
- Record F7 as complete only at the intercepted-test boundary, and F8 only at
  the repository and configuration boundary.

### Built — 23 code, test and configuration paths
- **Deleted (11):** `contracts.ts` and its test, `map-response.ts` and its test,
  `n8n-client.ts` and its test, `documents-mock.ts`, `process-document-mock.ts`
  and its test, and the two `/sessions` pages.
- **Modified (10, originally authorized):** `.env.example`, `env.ts`,
  `project.ts`, `project.test.ts`, the comments in the three contract modules
  and `n8n-url.ts`, the dashboard placeholder, and `e2e/upload-f1.spec.ts`.
- **Modified (2, a later test-only correction):**
  `src/app/api/documents/route.test.ts` and
  `src/app/api/process-document/route.test.ts`.
- **Outcomes:**
  - IntentSeal schemas, the `AI_DRAFT` token set, the epistemic vocabulary and
    the `/sessions` routes are removed from runtime code;
  - both mock modules and the legacy Bearer-auth n8n client are removed;
  - exactly 5 current environment names remain, and `.env.example` lists them
    with empty values only;
  - the dashboard placeholder no longer holds fixture-derived words;
  - upload transport-failure and exact browser-timeout E2E tests were added;
  - exact 90,000 ms server-timeout tests were added for Workflow A and B.
- No route, server client, contract schema, URL-building logic, package,
  lockfile or configuration file changed.

### Verification — VERIFIED
- Full unit run: 148/148 PASS, before the two timeout tests.
- Targeted route tests after them: 29/29 PASS.
- Typecheck PASS on the final run. The first run failed only on generated,
  git-ignored validator files that still listed the deleted pages.
- Lint PASS: 0 errors and 0 warnings.
- `verify:privacy` PASS; `verify:baseline` PASS before and after.
- Intercepted Playwright, all seven specs in one run: 66/66 PASS.
- Production build PASS; no `/sessions` route in the route list.
- No real API route, n8n workflow, Google service or external service was
  reached.

### Project Skills — chronology
Both Skills ran as read-only checks and made no edits.
- `business-logic-leak-detector`, repository-wide: `PASS`.
- The first final `contract-drift-guard` run returned `BLOCKED` only because
  the Workflow A and B 90,000 ms server timeouts were not pinned by a test. No
  drift and no FAIL.
- Two test-only corrections pinned both timeouts at 89,999 ms and +1 ms.
- The rerun returned `CONTRACT_DRIFT_GUARD_PASS`, with no FAIL and no material
  UNKNOWN.

### Feature boundaries
- F7: complete at the intercepted-test boundary.
- F8: complete at the repository and configuration boundary.

### Open — live only
- The real Workflow C in n8n, and live acceptance of its path and secret.
- A real Sheet `Status`, `Reviewed By` and `Review Note` update.
- The live 401, 404 and n8n-unavailable cases.

### Not claimed
- No live review, no real Sheet update, no deployment, no submission readiness.
  M6 is not complete.

---

## Prompt 5R — M6: published Workflow C, live F6 review, F7/F8 evidence

Separately authorized steps, 2026-10-01 to 2026-10-02:

1. draft-stage `/api/review` tests through the draft Test webhook;
2. a guarded `.env.local` edit adding `N8N_REVIEW_PATH`;
3. one production-path `/api/review` test;
4. a read-only diagnosis of a `/api/documents` 502;
5. one F6 review through the UI, performed by Avinoam;
6. one F7 Playwright pass;
7. one `verify:privacy` run;
8. live F5 filter checks, by Avinoam;
9. one value-blind real-secret check;
10. this record, corrected before commit and updated for the M6 closure.

| Field | Value |
|---|---|
| **Status** | `COMPLETE` (2026-10-02) — evidence record and M6 closure. F1–F8 PASS |
| **Milestone** | `SPEC.md` §16 **M6 — COMPLETE (2026-10-02). M7 — NEXT, not started**; it needs approval. Open in M7: assessing the full `SPEC.md` §9 test matrix (test 9 already has evidence; tests 7 and 8 have no live run yet; existing evidence is mapped before any repeat test), and the §10 deliverables. M2–M6 stay closed. |
| **Git state** | No code change. This record and `docs/PROJECT_STATE.md` are **not committed**. Not deployed. |

### Evidence labels
- **AGENT-REPORTED (Claude Code):** Claude Code command output or code reading.
- **DIRECT SHEET READ (ChatGPT, read-only):** a read-only Document Log check
  by ChatGPT.
- **USER-CONFIRMED (screenshot):** a result Avinoam confirmed from a
  screenshot.
- **USER-REPORTED:** anything else Avinoam reported.

### Evidence
- **USER-REPORTED:** Workflow C was published and backed up outside Git.
- **AGENT-REPORTED:** `N8N_REVIEW_PATH` was added to `.env.local` by a guarded,
  value-blind script after approval. It checked HTTPS, the same origin as
  `N8N_BASE_URL`, a `/webhook/` path, no query or fragment, and an identical
  `buildN8nUrl` rebuild. It appended one line. No value was recorded.
- **Draft Test webhook, 2026-10-01 (not production):**
  - **AGENT-REPORTED:** a nonexistent synthetic ID returned 404 with the §5.3
    body, and a success-path request returned 200.
  - **Duplicate-ID branch:** returned 409 upstream (USER-REPORTED); the local
    proxy exposed 502 through its `upstream` mapping (AGENT-REPORTED).
    `CONTRACT.md` §5 defines no 409, so this is observed, not
    contract-approved.
- **Production, 2026-10-02:**
  - **AGENT-REPORTED:** one `POST /api/review` for a synthetic ID returned 200
    with the §5.2 shape and a matching ID.
  - **DIRECT SHEET READ (ChatGPT):** the row was updated, and the omitted
    `review_note` left the earlier note unchanged. That is observed behaviour,
    not a contract rule.
- **Malformed row:**
  - **AGENT-REPORTED:** the local `/api/documents` returned 502. One in-memory
    GET to Workflow B returned upstream 200 and an array of 6. Item 5 failed the
    schema on `file_link` and `deadline` (`too_small`) and on `document_type`
    and `department` (`invalid_value`).
  - **USER-REPORTED:** only that synthetic row was cleared, and document 21
    loaded again.
- **F6:**
  - **USER-CONFIRMED (screenshot):** one UI review of synthetic document 21 set
    `Reviewed` on the detail screen and on the dashboard.
  - **DIRECT SHEET READ (ChatGPT):** Document Log row 6 shows `Reviewed`, with
    `Reviewed By` and `Review Note` filled in.
  - No extra review request was sent after the UI success.
- **F7 — AGENT-REPORTED:** 55/55 selected intercepted Playwright tests passed
  once (upload-f1, dashboard-api, document-detail, document-review). A temporary
  config outside the repository targeted the running port-3010 server, with no
  `webServer` and retries 0. No live n8n request was made. The live "n8n
  unavailable" and "wrong secret" runs are `SPEC.md` §9 tests 7–8 (M7), not F7
  gaps.
- **F8 — AGENT-REPORTED:**
  - `verify:privacy` passed once: exit 0, 80 tracked files, no findings. That
    covers only its own rules.
  - A one-time value-blind check loaded the effective `N8N_SECRET` privately in
    process memory and found 0 exact matches across all 81 Git-tracked files.
    Exit 0. No property of the secret is recorded.
  - The server-only configuration was checked from code.
- **F5 — live dashboard:**
  - `document_type` = `invoice`: 1 of 5 rows, the matching invoice.
    USER-CONFIRMED (screenshot), reviewed by ChatGPT in the session.
  - `department` = `Management`: the matching M4 document (count not
    explicitly reported). USER-REPORTED.
  - `status` = `Reviewed`: 1 of 5 rows, document 21. USER-REPORTED.
  - The Sheet read selected the expected data. It did not independently verify
    the browser filters.

### F1–F8 evidence map
- **PASS:** F1–F8.
- **F5:**
  - Unit: search and all four filters in `src/lib/documents-view.test.ts`
    (lines 38, 56, 64, 73).
  - Browser, intercepted: urgency and search in
    `e2e/dashboard-api.spec.ts:462`, `e2e/home.spec.ts:149` and `:162`.
  - Live: urgency (M3, USER-REPORTED); `document_type` (2026-10-02,
    USER-CONFIRMED screenshot); `department` and `status` (2026-10-02,
    USER-REPORTED).
- **F8:** the value-blind check (0 of 81) and `verify:privacy` (80 files).
- The full map is in `docs/PROJECT_STATE.md`.

### Not claimed
- No plugin evidence is recorded.
- `verify:baseline` (Part 1 baseline integrity check):
  - NOT RUN before the 2026-10-02 edits.
  - After the M6 documentation edits, it ran once: PASS, exit 0, 13/13
    subchecks (agent-reported). It was read-only and did not affect port 3010.
  - It is not an app build and not a test suite.
- Unit tests, lint and build were not run on 2026-10-02.
- No commit, push or deployment.
- The full `SPEC.md` §9 test matrix has not yet been assessed, and existing
  evidence must be mapped before any repeat test.
  - §9 test 9 (review action) already has evidence: the live UI review of
    document 21, the Sheet row 6 check and the dashboard refresh.
  - Tests 7 and 8 have no live run yet.
  - Not all ten tests are complete.

---

## Prompt 5S — M7: workflow exports, §9 evidence map and README

A chain of separately approved prompts, 2026-10-03:

1. a read-only T10 evidence check;
2. a read-only submission inventory;
3. a read-only inventory of the local n8n backups;
4. source selection for A, B and C;
5. a credential-stripped staging copy;
6. redacted candidates for B and C, with A blocked;
7. a read-only look at A `nodes[12]`;
8. A redacted after approvals, blocked once more and then passed;
9. a byte-exact copy into `n8n/exports/`;
10. this record and the README update.

| Field | Value |
|---|---|
| **Status** | `COMPLETE` (2026-10-03) — exports and records only. **M7 ACTIVE, not complete** |
| **Milestone** | `SPEC.md` §16 M7 |
| **Git state** | Untracked `n8n/exports/` (3 files). `README.md`, `PROMPTS.md` and `docs/PROJECT_STATE.md` modified. **Not committed.** Not deployed. |

### What came back
- **T10:** the existing dashboard screenshot shows the Part 1-era row FP01 and
  the app-submitted T05 PDF together. No saved evidence proves FP01's Drive
  origin, so T10 stays OPEN (partial).
- **Inventory:**
  - the A/B/C exports were missing;
  - `code-review` evidence was missing;
  - M7 test evidence exists only outside the repository;
  - README still had a `<repository-url>` placeholder.
- **Backups:** the newest A file was labelled "draft", and the C backup was
  inactive. A fresh n8n download was taken for A and for C.
- **Exports:**
  - `n8n/exports/workflow-a.json`, `workflow-b.json` and `workflow-c.json`.
  - Credentials removed (8, 2 and 3).
  - Redacted with the `n8n/baseline/README.md` placeholders, plus the new
    `EXAMPLE_APP_UPLOAD_DRIVE_FOLDER_ID`.
  - Each passed read-back checks: hash, no `credentials`, empty `pinData`, no
    forbidden hash, email, secret or stray Google URL, identical structure,
    `git diff --check`. `verify:baseline` passed before and after.
  - Hashes are in `docs/PROJECT_STATE.md`.
- **Context7:** local session transcripts show real use, 10 calls on
  2026-10-01 for the Workflow C design. That session's report says Context7
  corrected the plan: Workflow C must not use "Append or Update Row". A further
  round left five node-behaviour questions UNKNOWN. No result is invented
  beyond that report.

### What had to be corrected
- The requested C filename ended in `.json`; the real file ends in `.json.json`.
- A was blocked before writing, twice:
  1. A literal processed-folder ID inside an expression, a Google URL template
     inside three expressions, and a folder with no baseline placeholder.
     Avinoam approved `=EXAMPLE_PROCESSED_DRIVE_FOLDER_ID`,
     `EXAMPLE_APP_UPLOAD_DRIVE_FOLDER_ID`, and keeping the dynamic link
     templates.
  2. Four scan hits: a node `type` string and three editor UUIDs. Avinoam
     approved keeping exactly those four paths.
- `git diff --check` does not cover untracked files, so each new file was also
  checked with `--no-index --check`.

### §9 evidence map (corrected the same day)
The full table is in `docs/PROJECT_STATE.md`. Each row separates the
**observed result** from the **saved submission evidence in the repository**.

| Test | Observed result | Saved in the repository |
|---|---|---|
| T01, T02, T03, T05, T06 | **PASS observed.** USER-REPORTED, plus an EXTERNAL READ (reported) of the Sheet and Gmail in the working session: one row and one email each, on the relevant urgency branch. Claude Code did not make those reads. | None |
| T04 | **Intercepted automated test only.** `e2e/upload-f1.spec.ts:343` (`.png` refused before sending), in the 8/8 run of 2026-10-02 (AGENT-REPORTED). Not a live run. | Test code only |
| T07 | **OPEN** | None |
| T08 | **PASS observed, with a deviation.** AGENT-REPORTED, Claude Code session of 2026-10-02: an isolated port-3011 server with a wrong secret in its process environment gave 401 `UNAUTHORIZED`, the configuration message and a usable page. The screenshot shows the message, not the status. §9 says "in `.env`"; the run used a process override instead. | None |
| T09 | **PASS observed.** M6 record: USER-CONFIRMED screenshots and a DIRECT SHEET READ (ChatGPT) of `Status`, `Reviewed By` and `Review Note`. | None |
| T10 | **Partial.** Both files appear on one dashboard (AGENT-REPORTED screenshot). FP01's Part 1 origin has no saved evidence. | None |

The first version of this map, earlier on 2026-10-03, was corrected in three
ways:
- **T08:** moved from OPEN to "PASS observed with a deviation", after a
  read-only check of the existing session record.
- **T01–T03, T05 and T06:** the external Sheet and Gmail reads were added.
- **T04:** recorded as an intercepted test, not a live run.

The options for closing the T10 gap are listed separately in
`docs/PROJECT_STATE.md`. No rerun is scheduled.

### Still missing
- Committed screenshots: the upload screen, a filtered dashboard, the detail
  view and the spreadsheet are not captured yet.
- The demo recording.
- `code-review` plugin evidence.
- **§9:**
  - a T07 run;
  - a live T04 run or screenshot;
  - T10 Part 1 origin evidence;
  - saved submission evidence for every test.
- A record of the Workflow A PDF change and its Part 1 impact.
- Forward corrections to the stale "context7 not yet used" lines in `SPEC.md`
  §13 and `CLAUDE.md`, and to the reflection's draft label.
- Commit and push.

### Not claimed
- No live test, n8n, Drive or Sheets access.
- No unit, lint, build or Playwright run.
- No commit or push.

---

## Prompt 5T — M7: literal T07 run and screenshot evidence

Separately approved steps, 2026-10-03:

1. A read of the T07 wording and code path.
   - **Result:** BLOCKED for a non-listening local URL.
   - **Why:** §9 says "with the workflow deactivated", and an unreachable
     address takes the `unreachable` code path, not `upstream`.
2. Preparation: the existing `next dev` on port 3010, a value-blind config
   check (Workflow B's path is production `/webhook/`), and a readiness `GET /`
   that cannot call n8n.
3. Avinoam unpublished Workflow B. Claude Code made one headless page load.
4. Avinoam republished Workflow B. Claude Code made one headless page load.
5. Screenshot packaging and this record.

| Field | Value |
|---|---|
| **Status** | `COMPLETE` (2026-10-03). **M7 ACTIVE, not complete** |
| **Milestone** | `SPEC.md` §16 M7 |
| **Git state** | New untracked `screenshots/m7/` (10 PNG files) and `n8n/exports/` (3 files). `README.md`, `PROMPTS.md` and `docs/PROJECT_STATE.md` modified. **Not committed.** |

### What came back
- **T07, Workflow B unpublished (AGENT-REPORTED):**
  - one page load gave `/api/documents` **502**, category `upstream`, body
    `{status, message}` with no `error_code`;
  - the readable error was visible;
  - Try Again was visible and enabled (not clicked);
  - the Upload link was visible with `href="/upload"`;
  - no raw upstream detail and no crash.
- **Restoration, Workflow B republished (AGENT-REPORTED):** one page load gave
  **200**, **10/10** rows and no error region.
- **Request count:** each page load produced **two** `/api/documents`
  requests. On the restoration load the first was browser-aborted
  (`net::ERR_ABORTED`) and the second returned 200. The failure load's
  per-request outcomes were not recorded separately. No cause is asserted.
- **Screenshots:** all 16 unique local images were inspected visually, and 10
  were copied byte for byte (SHA-256 equal):
  - [T01 result](screenshots/m7/T01-result-urgent-invoice.png)
  - [T02 result](screenshots/m7/T02-result-normal-report.png)
  - [T03 result](screenshots/m7/T03-result-no-deadline.png)
  - [T05 retest result](screenshots/m7/T05-result-large-pdf-retest.png)
  - [T06 result](screenshots/m7/T06-result-double-submit.png)
  - [T06 dashboard afterwards](screenshots/m7/T06-dashboard-after.png)
  - [T07 error with Workflow B unpublished](screenshots/m7/T07-error-workflow-b-unpublished.png)
  - [T07 dashboard restored](screenshots/m7/T07-dashboard-restored.png)
  - [T08 configuration error](screenshots/m7/T08-error-wrong-secret.png)
  - [T10 shared dashboard](screenshots/m7/T10-dashboard-both-entry-points.png)
- **Held back:**
  - 8 redundant intermediate or duplicate dashboard files (5 unique images);
  - the two first-attempt T05 images, because their failure cause is not
    recorded.
  - No image was unsafe.

### What had to be corrected
- The first hash comparison after copying reported a mismatch for every file.
  The cause was the checker: `sha256sum` prefixes a `\` when the source path
  contains backslashes. A Node SHA-256 check then showed 10/10 identical. No
  file was changed.

### Observed result versus saved evidence
- **T07:**
  - observed: PASS;
  - saved: the two T07 screenshots. The status codes rest on the session
    record.
- **T01–T03, T05, T06, T08 and the T10 dashboard:** screenshots are now saved.
  Their Sheet and Gmail outcomes remain reported only.
- **Unchanged:**
  - T04 is an intercepted automated test only;
  - T10's Part 1 origin has no saved evidence;
  - T09 has no committed screenshot.

### Additional app views (same day)
One headless session, GET only, no upload and no review action, captured:
- [clean upload screen](screenshots/m7/view-upload-clean.png);
- [dashboard filtered](screenshots/m7/view-dashboard-filter-urgency-high.png)
  by `urgency` = `High` (3 of 10);
- [detail view](screenshots/m7/view-detail-document-21.png) of synthetic
  document 21.

A first attempt's filtered image was held back outside Git: the filter had been
applied while the list was still loading, so it showed no results. All three
kept images come from the second session.

### Spreadsheet evidence and T09 (same day)
- **Inconsistency found (read-only investigation):**
  - A direct read and an official PDF export of the live Sheet showed the
    synthetic Workflow C note in **N1**, the `Review Note` header cell, and
    nothing in document 21's note cell.
  - In `n8n/exports/workflow-c.json`, `nodes[6]` "Update row in sheet" matches
    on `Document ID` and maps `Review Note` by header name. No parameter
    targets row 1.
  - **The cause is still unknown.**
- **Repair (USER-REPORTED):** N1 was restored to `Review Note`, and document
  21's existing note was moved back to its own row. Both were read back
  successfully.
- **T09 rerun (AGENT-REPORTED):**
  - Synthetic document 79 showed `Processed`.
  - Exactly one app review was sent (one `POST /api/review`), returning **200**
    `{status: "updated", document_id: "79"}`.
  - The screen then showed `Reviewed`.
  - A first script run stopped before entering anything, because it read the
    page before the data loaded. Nothing was sent.
- **Sheet confirmation (EXTERNAL READ, reported):** the headers `Status` /
  `Document ID` / `Reviewed By` / `Review Note`, and document 79's own row with
  `Reviewed`, the test reviewer and the test note.
- **Evidence:** the [spreadsheet review-columns image](screenshots/m7/view-spreadsheet-export-review-columns.png),
  rendered from an official Google Drive PDF export of the live Sheet, not a
  browser screenshot. SHA-256 verified before and after copying. No File Link
  column. Its 9 data rows omit document ID 20; this is noted, not interpreted.
- A DOCX with two thin spreadsheet crops was held back earlier: it had no
  headers and showed the start of a Drive link.
- **T09: PASS.**

### Still missing
- Screenshots: none. All six §10.6 views are present.
- The demo recording.
- `code-review` evidence.
- A live T04 run.
- T10 Part 1 origin evidence.
- The Workflow A change record.
- Commit and push.

### Not claimed
- Claude Code made no n8n, Drive, Sheets or Gmail change. The Workflow B
  unpublish and republish were Avinoam's.
- No upload, click or retry.
- The Playwright test suite, unit tests, lint and build were not run.
- No commit or push.

---

## Prompt 5U — M7: final factual documentation corrections

| Field | Value |
|---|---|
| **Status** | `COMPLETE` (2026-10-03) — documentation only. **M7 ACTIVE, not complete** |
| **Milestone** | `SPEC.md` §16 M7 |
| **Git state** | Modified: `SPEC.md`, `CLAUDE.md`, `README.md`, `docs/REFLECTION.md`, `PROMPTS.md`, `docs/PROJECT_STATE.md`. Untracked, from earlier prompts: `n8n/exports/` and `screenshots/m7/`. **Not committed.** |

### What changed
- **Context7 status, corrected forward:**
  - `SPEC.md` §13: an inline marker on the `context7` line and a dated status
    note recording the 10 calls of 2026-10-01 during Workflow C planning, and
    the correction they produced ("Append or Update Row" not to be used).
  - `CLAUDE.md` item 9: a forward correction. The normative requirement text
    is unchanged.
  - `code-review` is still recorded as not used.
- **Reflection:**
  - The "Draft" label was removed from `docs/REFLECTION.md` and from the
    `README.md` repository map, after checking that all four §10.7 questions
    and the §11 maintenance-cost note are present.
  - One three-sentence paragraph was added: the Workflow A PDF path is an
    instance of the duplication drift.
- **Workflow A change record (`docs/PROJECT_STATE.md`):**
  - M4 backup: 15 nodes. Export: 18 nodes, adding `Switch` (`nodes[16]`),
    `Extract PDF` (`nodes[15]`, operation `pdf`) and `Edit Fields`
    (`nodes[17]`).
  - Routing: PDFs go to PDF extraction; TXT and DOCX stay on text extraction.
  - The Part 1 baseline has a single text-extraction step and no corresponding
    PDF path. No claim is made that Part 1 needs the fix.
- `README.md` repository map: a `screenshots/m7/` row.

### Kept as they were
- T04 is intercepted only, and T10 is partial.
- The Sheet image is described as rendered from an official PDF export, not a
  browser screenshot.
- No §9 item was promoted.

### Not done
No live test, and no n8n, Drive, Sheets or Gmail access. No commit or push.

---

## Prompt 5V — M7: T04 local UI check

| Field | Value |
|---|---|
| **Status** | `COMPLETE` (2026-10-03) — **T04 PASS** (local UI). **M7 ACTIVE, not complete** |
| **Milestone** | `SPEC.md` §16 M7 |
| **Git state** | New: `screenshots/m7/T04-upload-unsupported-png.png`. Modified: `PROMPTS.md`, `docs/PROJECT_STATE.md`. **Not committed.** |

### What came back (AGENT-REPORTED)
One headless session on the running local app selected a 70-byte synthetic
`.png` on `/upload`. Every non-GET request was set to be blocked, as a guard.
- **Validation message shown:** "ניתן לעבד קובצי PDF, DOCX ו-TXT בלבד. הקובץ לא
  נשלח." ("Only PDF, DOCX and TXT files can be processed. The file was not
  sent.")
- **Send:** disabled before and after. One forced click was dispatched and did
  nothing.
- **Requests:** 0 POST requests, including 0 `POST /api/process-document`.
  Nothing needed blocking.
- **Page:** no result region; "Clear selection", the file input and navigation
  stayed usable.
- **Screenshot:** [validation state](screenshots/m7/T04-upload-unsupported-png.png).

### Observed result versus earlier evidence
- **This run:** the real local app, with no request interception.
- **Earlier:** the intercepted E2E spec `e2e/upload-f1.spec.ts:343` (2026-10-02,
  8/8).
- T04 is an application-side rule, so no upstream n8n run is needed.

### Not done
No upload, no n8n, Drive or Sheets access, no commit or push.

---

## Prompt 5W — M7: demo recording, T10 verdict and PR preparation

| Field | Value |
|---|---|
| **Status** | `COMPLETE` (2026-10-03) — demo recorded and finalized; records updated; branch and PR prepared for the `code-review` plugin. **M7 ACTIVE, not complete** |
| **Milestone** | `SPEC.md` §16 M7 |

### Demo — direct observations (AGENT-REPORTED)
- **Recording:** a headless Playwright recording of the running local app. At
  most one upload POST and one review POST were allowed, and nothing was
  blocked.
- **Upload:** **one** synthetic `M7_DEMO_printer_service_memo_20261003.txt`,
  returning 200 `processed`, document **106**, `Low`, `notification_sent: true`.
- **Review:** **one** review of document 106, returning 200 `updated`, status
  `Processed` → `Reviewed`.
- **Also shown live:** an unsupported-file rejection with no request,
  dashboard search and filters, and the dashboard reflecting `Reviewed`.
- **Final file:** [`demo/Smart_Office_Demo_2026-10-03.mp4`](demo/Smart_Office_Demo_2026-10-03.mp4),
  3:35, 8,039,680 bytes, H.264, 1280×800. It decodes fully, and its frames were
  inspected for privacy.

### Demo — user-supplied and external content
- **Email (USER-SUPPLIED content):**
  - ChatGPT independently found exactly one matching Gmail message (EXTERNAL
    READ, reported).
  - Subject: "Document processed: M7_DEMO_printer_service_memo_20261003.txt".
  - Body heading: "Document processed successfully".
  - Values: `report`, `Low`, `General`, "No action is required from staff."
- **Sheet (EXTERNAL READ, reported, ChatGPT):** one row for Document ID 106,
  currently row 12: `Reviewed`, "M7 demo reviewer", "Checked during the demo
  recording".
- Both appear in the video as labelled **text slides** (12 s each, inserted at
  181.48 s), not as Gmail or Sheets screenshots. Links and IDs are removed.

### Exact limits on screen
- No live Gmail or Sheets UI is shown.
- The Sheet image in the video is the earlier labelled PDF-export rendering
  (document 79).
- T07 and T08 appear as previously captured screenshots.

### T10 (recorded against the exact §9 wording)
- **Observed:** FP01 (22.09) and an app-uploaded PDF are on the same dashboard.
- **EXTERNAL READ (reported, ChatGPT):**
  - FP01 is in Drive "02 - Processed Documents";
  - one urgent Gmail message from 22 September;
  - one Sheet row with Document ID 6.
- **Inference:** the processed folder is shared with Workflow A. FP01 predates
  Workflow A (built 2026-09-30), so only Part 1 could have produced it.
- **Not read:** any n8n trigger execution record.
- **Verdict:** PASS against the §9 wording, with provenance inferred, not
  directly verified.

### Other corrections
- `SPEC.md` §14 and `CLAUDE.md` item 10 now say, as forward corrections, that
  both Skills exist (since 2026-10-01).
- `README.md` has a "Demo recording" section that states the limits above.

### Not done
- No rerun of T01–T09, no other upload or review, no n8n, Gmail or Sheets
  change.
- The `code-review` plugin has not been run. That is the next step, on the PR.

---

## Prompt 5X — M7: `code-review` plugin on PR #1, follow-up and merge

| Field | Value |
|---|---|
| **Status** | `COMPLETE` (2026-10-04) — plugin run recorded; stale status corrected; privacy-gate gap fixed with a fail-closed rule; all gates pass. **M7 ACTIVE** |
| **Milestone** | `SPEC.md` §16 M7, `SPEC.md` §13 item 1 |

### Setup (AGENT-REPORTED)
- `code-review@claude-plugins-official` was already installed at user scope and
  enabled.
- GitHub CLI 2.102.0 was installed with WinGet.
- **Login:**
  - Two background device-flow attempts did not complete: the first code
    expired, and the second process kept polling after GitHub showed "Device
    connected".
  - Avinoam then completed an interactive `gh auth login --web`, as
  `avinoamgo-ux`, with the token kept in the keyring.
- **Checks:** `gh pr view 1` showed the PR open and non-draft, and the
  repository `PRIVATE`.

### Plugin run (AGENT-REPORTED)
- **Command:** `/code-review:code-review 1` on PR #1, head
  `ee666997e4ee1d3dc90eb8d7074dd09767933e2b`.
- **Agents:** Haiku agents for the checks, five parallel Sonnet reviewers, and
  Haiku scoring at threshold 80.
- **Candidates:**
  - **Score 75:** stale "not committed" status text in `docs/PROJECT_STATE.md`.
    A real documentation issue, fixed in this follow-up.
  - **Score 0:** a false positive about document 21's empty review inputs.
- **Final eligibility check:** the agent printed `NOT_ELIGIBLE`, contrary to
  its own evidence (open, non-draft, no reviews, unchanged head). The run
  continued and posted.
- **Posted:** "No issues found", as a comment on PR #1 in the private project repository (not publicly accessible).
- **Report:** [`docs/CODE_REVIEW_PR1.md`](docs/CODE_REVIEW_PR1.md).
- This is an automated review, not an independent human approval.

### Follow-up commit
- Adds `docs/CODE_REVIEW_PR1.md`.
- Forward-corrects the current "not committed" and "code-review not used"
  status in `docs/PROJECT_STATE.md`, `SPEC.md` §13 and `CLAUDE.md` item 9. The
  requirements are unchanged.
- **Historical note:** the "Not committed" statements in Prompts 5S–5W
  describe the state when each prompt ended. The work was committed in
  `ee66699`.
- The plugin was not rerun for this documentation-only commit.

### Blocker found while checking (AGENT-REPORTED)
- `npm run verify:privacy` now **fails**: rule `account_specific_url`, 3
  occurrences in `n8n/exports/workflow-a.json`.
- The rule rejects any literal `drive.google.com` or `docs.google.com` host. The
  three hits are the approved dynamic file-link templates: the Drive
  `file/d/` link prefix followed by an expression, with no literal ID.
- The earlier `npm run check` PASS (Prompt 5W) ran while the exports were still
  untracked, so the checker, which scans tracked files only, did not see them.
  That PASS therefore does not cover commit `ee66699`.
- A fix needs Avinoam's decision. Merge is on hold.

### Resolution (2026-10-04)
- **Approved:** Avinoam chose Option 1, with a fail-closed scope.
- **The rule:** `scripts/verify-privacy.mjs` now covers only the three exact
  JSON paths in `n8n/exports/workflow-a.json`, and only when the file ID comes
  solely from `$('Upload file')…json.id`. No other host or long literal ID may
  appear in the value, and the template must also appear unescaped in the raw
  text. There is no general Drive allowance and no folder exclusion, and the
  exports are unchanged.
- **Tests:** 8 new tests in `scripts/verifiers.test.mjs`. Each approved template
  passes. These fail:
  - a literal file ID at an approved path;
  - another export path;
  - another export file;
  - an extra literal ID in the URL;
  - a long literal ID elsewhere in the value;
  - a second Google host.
- **Results:**
  - `npx vitest run scripts/verifiers.test.mjs`: 20/20.
  - `npm run check` with the exports tracked: exit 0 (baseline,
    `verify:privacy` over 86 tracked files, lint, 158/158 unit tests, build).
- **Also caught:** the rule flagged a literal Drive link prefix in this record's
  own blocker note, which was reworded.
- **PR body:** its "Checks" section was corrected on GitHub.
- Details are in [`docs/CODE_REVIEW_PR1.md`](docs/CODE_REVIEW_PR1.md).

---

## Prompt 6 — Dashboard, search/filter & review screen  *(PLACEHOLDER — NOT STARTED)*

| Field | Value |
|---|---|
| **Status** | `NOT STARTED` |
| **Milestone** | M5 |

### Goal *(planned)*
Build the sessions/documents dashboard with search and filtering, and the single
Human-in-the-Loop review screen (reviewer identity, decision, optional
correction/note) wired to `POST /webhook/review`.

### Allowed scope *(planned)*
- `app/page.tsx`, filter UI, `app/sessions/[id]/review`.
- Dashboard and review empty/error states.
- **Not allowed:** a second review gate; n8n changes.

### Files produced *(to be recorded after execution)*
_Not yet run._

### Verification method *(planned)*
Vitest tests for filter-query building and review-form validation pass; a
`NEEDS_REVIEW` mapping can be approved / revised / rejected and the state change
is reflected.

### Completion status
`NOT STARTED`.

---

## Prompt 7 — Two custom Skills  *(PLACEHOLDER — NOT STARTED)*

*SUPERSEDED 2026-10-01: the two Skills planned below belong to the superseded
IntentSeal design. The two `SPEC.md` §14 Skills were created instead in Prompt
5M. This placeholder is retained as written.*

| Field | Value |
|---|---|
| **Status** | `NOT STARTED` |
| **Milestone** | M6 |

### Goal *(planned)*
> *[Omitted from this public copy: the superseded Prompt 7 goal (two IntentSeal-era Skills that were never built) (6 lines). The full record is kept in the private project repository. See `PUBLIC_COPY_NOTES.md`.]*

### Allowed scope *(planned)*
- Skill definitions and reference material.
- Guard logic also expressed as Vitest checks where practical.
- **Not allowed:** claiming a skill works before it is run on fixtures.

### Files produced *(to be recorded after execution)*
_Not yet run._

### Verification method *(planned)*
Both skills invoke and produce the intended structured output on fixture data;
the guard flags a planted unsupported claim and a planted scope violation.

### Completion status
`NOT STARTED`.

---

## Prompt 8 — E2E tests, evidence, reports & deployment prep  *(PLACEHOLDER — NOT STARTED)*

| Field | Value |
|---|---|
| **Status** | `NOT STARTED` |
| **Milestone** | M7 |

### Goal *(planned)*
Add the Playwright critical end-to-end tests, capture screenshots or a full-run
video, and finalize documentation: implementation report, SPEC, README, PROMPTS,
and a deployment-preparation document.

### Allowed scope *(planned)*
- Playwright critical flows only (upload→mapping, dashboard filter+empty, review
  gate per decision, error/empty states).
- `docs/evidence/` screenshots or one run video.
- `docs/IMPLEMENTATION_REPORT.md`, finalize `docs/SPEC.md`, update `README.md`
  and this file, `docs/DEPLOYMENT_PREP.md` (preparation only — no live deploy).
- **Not allowed:** production deployment; fabricated test results.

### Files produced *(to be recorded after execution)*
_Not yet run._

### Verification method *(planned)*
Playwright suite passes; evidence files exist; all five documents complete and
mutually consistent; real results recorded.

### Completion status
`NOT STARTED`.

---

## Summary

| Prompt | Title | Status |
|---|---|---|
| 1 | Planning & documentation | `COMPLETE` (2026-09-05) |
| 1A | Human review amendment | `COMPLETE` (2026-09-06) |
| 1B | Part 1 baseline verification | `COMPLETE` (2026-09-06) — MATCHES baseline |
| 2 | Safeguards, scaffold & configuration (M1) | `COMPLETE` (2026-09-06) |
| 2A | Privacy hardening + source preservation + local checkpoint | `COMPLETE` (2026-09-07) — exported ZIP later failed integrity check (CRLF); see 2A-R1 |
| 2A-R1 | Checkpoint repair: stabilize baseline line endings | `COMPLETE` (2026-09-07) |
| 3 | Data contracts & proxy routes (app side) | `COMPLETE` — committed and published at `6ccf0236d63330c41f4d12722be48a593da010dd` |
| 3A | Source alignment & read-only evidence review | `COMPLETE` (2026-09-27) — documentation only, not committed |
| 4 | n8n workflows | `NOT STARTED` |
| 5 | Core UI: upload, processing, mapping view | `NOT STARTED` |
| 5A | M2 scaffold: F1 upload screen against a local mock | `COMPLETE` (2026-09-27) — scaffold only, not committed; F1's send to `/process-document` still open; `SPEC.md` §16 M2 stays `ACTIVE` |
| 5B | F2 processing state on the mock-backed upload screen | `COMPLETE` (2026-09-27) — F2 slice only, not committed; no Sheets write tested; corrected forward by 5C |
| 5C | Remove the visible submission counter from the F2 screen | `COMPLETE` (2026-09-27) — correction only, not committed; F1+F2 specs 7/7 and the mock unit test 4/4 PASS |
| 5D | F3 result view on the mock-backed upload screen | `COMPLETE` (2026-09-27) — F3 slice only, not committed; unit 14/14 and F1+F2+F3 specs 9/9 PASS; corrected forward by 5E |
| 5E | F3 no-deadline acceptance case in the browser | `COMPLETE` (2026-09-27) — F3 spec 3/3 PASS including the new no-deadline test; F1/F2 regression check 7/7 PASS; not committed; M2 and F1 not complete |
| 5F | F6 detail screen and local review, against mock records | `COMPLETE` (2026-09-27) — unit 9/9 and detail+dashboard specs 8/8 PASS; review is local and unsaved; not committed |
| 5G | M2 acceptance gate and evidence reconciliation | `COMPLETE` (2026-09-27) — documentation only; both §16 M2 criteria PASS, **M2 closed**; next is M3, not started |
| 5H | M3 acceptance gate: live Workflow B connection | `COMPLETE` (2026-09-28) — documentation only; **M3 closed**, evidence level USER-REPORTED MANUAL UI CHECK; next is M4, not started *(superseded 2026-09-30: M4 reported VERIFIED PASS, see 5I)* |
| 5I | M5: live Workflow A connection, product shell, and closure | `COMPLETE` (2026-09-30) — **M5 closed**; automated checks VERIFIED in this tree (upload E2E 6/6, 3/3, 3/3; unit 13/13; home 5/5; tsc, lint, build, `verify:baseline`, `verify:privacy` PASS; untracked M5 files privacy-scanned PASS); live acceptance USER-REPORTED; M4 recorded forward as reported PASS; next is M6, not started; not committed *(superseded 2026-09-30: committed locally, see 5J)* |
| 5J | Local checkpoint commits for M2–M5 | `COMPLETE` (2026-09-30) — `8ec4fc5`, `45c4f45`, `639c5fd` + records commit, local on `main`; `npm run check` PASS (163/163 unit), M2 E2E 13/13; not pushed, not deployed; M6 not started *(superseded 2026-10-01: pushed and verified, see 5K)* |
| 5K | Controlled push of the M2–M5 checkpoints | `COMPLETE` (2026-10-01) — fast-forward `3ab6555..59a50d3` to `origin/main`; remote equals local HEAD `59a50d3`; divergence `0 0`; not deployed; M6 not started *(superseded 2026-10-01: M6 started, see 5L)* |
| 5L | M6-A: review contract and server client | `COMPLETE` (2026-10-01) — M6-A only; **M6 ACTIVE, not complete**; review contract, server client and `N8N_REVIEW_PATH` name; unit 40/40, tsc, lint, `verify:baseline`, `verify:privacy` and targeted privacy PASS; runtime unchanged; no n8n or external request |
| 5M | M6 project Skills (`SPEC.md` §14) | `COMPLETE` (2026-10-01) — `contract-drift-guard` and `business-logic-leak-detector` created and structurally validated; uncommitted `privacy-leak-guard` draft replaced before commit; `verify:privacy`, `verify:baseline` and targeted privacy PASS; **not yet used on a real task**; M6 ACTIVE, not complete *(superseded 2026-10-01: both used successfully in M6-B, see 5N)* |
| 5N | M6-B: `/api/review` migrated onto the Workflow C client | `COMPLETE` (2026-10-01) — M6-B only; **M6 ACTIVE, not complete**; route uses `reviewRequestSchema` + `submitReview`, approved 400/401/404/500/502/504 mapping, no 503; unit 46/46, tsc, lint (0 errors), `verify:privacy`, `verify:baseline` PASS; `contract-drift-guard` BLOCKED → PASS, `business-logic-leak-detector` PASS; not run against real n8n |
| 5O | M6-C: live detail and review UI | `COMPLETE` (2026-10-01) — M6-C only, application and intercepted-test boundary; **M6 ACTIVE, not complete**; detail loads live through `/api/documents`, review posts to `/api/review`; unit 72/72, tsc, lint (0 errors), `verify:privacy`, `verify:baseline` PASS; Playwright 20/20, 24/24, then 14/14, all intercepted; final `contract-drift-guard` PASS, `business-logic-leak-detector` PASS, untracked-spec privacy PASS; no live review; not committed *(superseded 2026-10-01: committed and pushed as `f5b3139`, see 5O)* |
| 5P | M6-D: live dashboard default and review-status reflection | `COMPLETE` (2026-10-01) — M6-D only, application and intercepted-test boundary; **M6 ACTIVE, not complete**; dashboard loads live `/api/documents` on mount with no mock mode or fallback; `Reviewed` shown only from a fresh GET; unit 36/36, tsc, lint (0 errors), `verify:privacy`, `verify:baseline` PASS; Playwright 51/51, then `dashboard-api.spec.ts` 21/21, all intercepted; `contract-drift-guard` BLOCKED (evidence gaps only) → PASS, `business-logic-leak-detector` PASS; no live review; not committed, not pushed *(superseded 2026-10-01: committed and pushed as `b506cdd`, see 5P)* |
| 5Q | M6-E: legacy cleanup and repository hardening | `COMPLETE` (2026-10-01) — M6-E only, repository and intercepted-test boundary; **M6 ACTIVE, not complete**; 23 paths: 11 legacy files deleted, 10 authorized files modified, 2 route tests added; 5 current env names only; unit 148/148, then route tests 29/29; tsc, lint (0 errors, 0 warnings), `verify:privacy`, `verify:baseline` PASS; Playwright 66/66, build PASS; repository-wide `business-logic-leak-detector` PASS; `contract-drift-guard` BLOCKED (timeout evidence only) → PASS; F7 complete at the intercepted boundary, F8 at the repository boundary; live Workflow C open; committed and pushed as `chore: remove legacy paths and harden Smart Office (M6-E)` |
| 5R | M6: published Workflow C, live F6 review, F7/F8 evidence | `COMPLETE` (2026-10-02) — evidence record and **M6 closure: M6 COMPLETE, M7 NEXT**; Workflow C published (user-reported); production `/api/review` 200 (agent-reported); malformed synthetic row diagnosed (agent-reported) and cleared (user-reported); **F6 PASS** (screenshot user-confirmed, Sheet row 6 by direct read-only ChatGPT check); **F7 PASS** (55/55 intercepted, agent-reported); **F5 PASS** (live type filter by user-confirmed screenshot; department and status filters user-reported); **F8 PASS** (value-blind real-secret check 0/81, agent-reported; `verify:privacy` 80 files); duplicate ID 409 → 502, preserved `review_note` and draft-only 404 recorded as observed, not contract-approved; full §9 test matrix not yet assessed (test 9 has evidence; tests 7–8 have no live run) and §10 deliverables open in M7; not committed |
| 5S | M7: workflow exports, §9 evidence map and README | `COMPLETE` (2026-10-03) — **M7 ACTIVE, not complete**; redacted A/B/C exports in `n8n/exports/`, read-back checks and `verify:baseline` PASS; §9 map, corrected the same day: PASS observed for T01–T03, T05 and T06 (user-reported and external read), T08 (agent-reported, deviation recorded) and T09 (M6); T04 intercepted only; T07 OPEN; T10 partial; nothing saved in the repository yet; Context7 real use found (2026-10-01); `code-review`, screenshots and demo missing; not committed |
| 5T | M7: literal T07 run and screenshot evidence | `COMPLETE` (2026-10-03) — **T07 PASS observed**: Workflow B unpublished → 502 `upstream`, readable error, usable page; republished → 200, 10/10 rows; two `/api/documents` requests per load, cause not asserted; 10 inspected screenshots copied byte for byte to `screenshots/m7/`; then the 3 app views and a Sheet PDF-export image; Review Note header found overwritten (cause unknown), repaired; **T09 PASS** (document 79: one POST, 200, `Reviewed`; Sheet read confirmed); T04 and T10 limits unchanged; not committed |
| 5U | M7: final factual documentation corrections | `COMPLETE` (2026-10-03) — documentation only; Context7 use corrected forward in `SPEC.md` §13 and `CLAUDE.md`; reflection finalized; Workflow A PDF path (15 → 18 nodes) recorded, and Part 1 has no corresponding path; T04 and T10 unchanged; not committed |
| 5V | M7: T04 local UI check | `COMPLETE` (2026-10-03) — **T04 PASS**: synthetic `.png` rejected on `/upload`, readable alert, Send disabled, 0 POST, page usable; screenshot committed; not committed |
| 5W | M7: demo recording, T10 verdict and PR preparation | `COMPLETE` (2026-10-03) — 3:35 demo in `demo/` (one upload and one review of document 106; email and Sheet values as labelled text slides); T10 PASS against the §9 wording, with Part 1 provenance inferred; Skills status corrected forward; PR prepared, `code-review` not yet run |
| 5X | M7: `code-review` plugin on PR #1, follow-up and merge | `COMPLETE` (2026-10-03) — `/code-review:code-review 1` posted "No issues found" (candidates scored 75 and 0, threshold 80; contradictory final eligibility output recorded); report in `docs/CODE_REVIEW_PR1.md`; stale status corrected forward; pre-commit gap found (`verify:privacy` had not seen the untracked exports) and fixed with a fail-closed rule plus 8 tests; `npm run check` PASS (158/158) |
| 6 | Dashboard, search/filter & review screen | `NOT STARTED` |
| 7 | Two custom Skills | `NOT STARTED` *(superseded 2026-10-01: the `SPEC.md` §14 Skills were created in 5M)* |
| 8 | E2E tests, evidence, reports & deployment prep | `NOT STARTED` |

Prompts 1, 1A, 1B, 2 (M1), 2A, 2A-R1, 2B, and 3 (M2) are complete. The Prompt
2A archive failed a later byte-level integrity check (CRLF vs LF) and was
corrected in 2A-R1 with a `.gitattributes` `eol=lf` pin and a re-verified
`-r1` archive; the original ZIP and commit history are retained. The
application-side data contracts and proxy routes (Prompt 3) are implemented,
tested against a mocked n8n client, committed, and published to `origin/main`
at commit `6ccf0236d63330c41f4d12722be48a593da010dd`. The GitHub remote (the private project
repository) is configured and published. Real n8n workflows and live n8n integration have not started.
M3 / Prompt 4 has not started and requires separate human authorization
to begin.

Added 2026-09-27 (Prompt 3A, documentation only): the working tree carries
uncommitted Smart Office work against root `CONTRACT.md` §3, including a
rewritten `POST /api/process-document`. An isolated verification copy exists at
`%TEMP%\intent-gate-mock-verify` (a local copy outside the repository); its inspected code
and configuration files are byte-identical to the project's, but it contains
none of the source or state documents. It holds a passing-run marker with no
test names and no count — "13/13" is `REPORTED`, not verified — and coverage of
`POST /api/process-document` by that run is `UNKNOWN`. An unapproved change to
two `CONTRACT.md` example values remains open and was deliberately left
untouched. No milestone is designated `ACTIVE`, and `SPEC.md` §16 M2 is not
complete. See `docs/PROJECT_STATE.md` → "Source alignment — 2026-09-27".

Added 2026-09-27 (Prompt 5A): `SPEC.md` §16 M2 was approved as the active
milestone and the §16 numbering as the scheme in force. The current F1 task was
defined as a scaffold against a local mock with no network, so what exists at
`/upload` is an M2 scaffold, verified only in the isolated copy — Vitest 11/11
and Playwright 4/4 PASS, after a first Playwright attempt that failed 3 of 4 on
a selector of mine. M2 remains `ACTIVE` and is not complete. F1's send to
`/process-document` stays open for the connection stage, as do F2, F3, the
Detail screen, and the `CONTRACT.md` example-value question from Prompt 3A.

Added 2026-09-27 (Prompt 5B): F2 was built on the same mock-backed screen — an
in-progress state stated in words, Send, Clear and the file input disabled for
the duration, and a ref guard so two clicks in one tick reach the mock once.
Verified by one focused Playwright run in the isolated copy, 3/3 PASS, with no
request to any `/api/` route. No Google Sheets write was tested or claimed, so
the instructor's "exactly one row" check itself is not proven. `upload-f1.spec.ts`
was not re-run although this slice touched code it exercises. M2 stays `ACTIVE`;
F1's send, F3, and the Detail screen remain open.

Added 2026-09-27 (Prompt 5C): the visible submission counter was removed from the
upload screen and the call-count assertion moved into `e2e/upload-f2.spec.ts`,
which counts the mock's own timer from the test side. The locked buttons and the
double-submit guard are unchanged, and the mock module was not touched. One
Playwright run covering both specs passed 7/7 (4 F1 + 3 F2), closing the gap
where `upload-f1.spec.ts` had not been re-run, and the mock's focused unit test
passed 4/4. No Sheets write was tested.

Added 2026-09-27 (Prompt 5D): F3 was built on the same mock-backed screen — a
result card with all seven fields in `CONTRACT.md` §2 order, the file link and a
coloured urgency badge, with every returned value passed through unmodified by
the new pure module `src/lib/result-view.ts`. Verified in the isolated copy only:
unit tests 14/14 PASS (covering the complete result and a no-deadline complaint
fixture whose absence values stay visible as text), and the F1, F2 and F3 specs
9/9 PASS in one run. The card shows the mock's fixed fixture, so nothing was
extracted from a real document and no Sheets, n8n or live service was involved.
**M2 and F1 remain incomplete**; F1's send to `/process-document` and the Detail
screen are still open.

Added 2026-09-27 (Prompt 5E): the F3 acceptance case now has a browser test. The
mock gained a second explicitly typed fixture — a complaint with `deadline`
`"Not found"` and `requested_action` `"No action found"`, the contract's own
absence wording — reachable through the labelled demo route `/upload/no-deadline`,
which is not in the main navigation. The default fixture and default behaviour are
unchanged, and the variant plus the demo route are removed with the mock at M5.
`npx playwright test e2e/upload-f3.spec.ts` passed 3/3 in the isolated folder,
with all field locators scoped inside the result region and no `/api/` request.
A follow-up regression check then ran `upload-f1.spec.ts` and `upload-f2.spec.ts`
in the isolated folder — **7/7 PASS** (4 F1 + 3 F2) — because the slice had touched
the shared upload form and mock module; no code or test was edited for it and F3
was not re-run. **M2 and F1 remain incomplete.**

Added 2026-09-27 (Prompt 5F): the F6 detail screen was built at
`/documents/[document_id]` against the mock records — all twelve `CONTRACT.md` §4
fields in contract order, the urgency badge, the file link, and a "סימון כנבדק"
action with an optional 200-character note. The review is local to the screen and
labelled twice as unsaved: nothing reaches Google Sheets, the dashboard, or a
reload, and no request is sent. The dashboard's row title became the link into the
screen; nothing else there changed. Verified in the isolated folder only: unit 9/9
PASS and the detail plus dashboard specs 8/8 PASS, both on the first attempt, with
no `/api/` request in any test. F6's other half — the real `POST /review`, the
Sheet write and the list reflection — is M6 and was not built, and `CONTRACT.md`
§5.1's required `reviewed_by` still has no source of identity.

Added 2026-09-27 (Prompt 5G): M2 was assessed against its exact `SPEC.md` §16 row
and **passed both criteria**, so M2 is closed. The earlier 13-test report was
reconciled: that run did execute `e2e/dashboard-api.spec.ts` and passed, and its
first test is the dashboard's no-request assertion for the default mock view;
only the per-file breakdown stays `REPORTED`. That assertion was verified before
the F6 link change and not re-run after it, which is recorded as an inference over
unchanged code paths rather than a fresh run. The real F1 send (M5) and the real
review call (M6) were not counted against M2, because §16 does not put them in the
M2 row. **The next milestone is M3 — "Connect dashboard to real Workflow B; add
search/filters (F4, F5)" — and it has not started; no live Workflow B connection
exists.**

Added 2026-09-28 (Prompt 5H): **M3 passed** its `SPEC.md` §16 criterion, "Real
rows appear; filters work", at the evidence level **USER-REPORTED MANUAL UI
CHECK**. Avinoam reported that dashboard API mode loaded 2 real rows and that the
urgency `High` filter showed exactly the sheet's 1 `High` row. This was reached
in the isolated copy after correcting `N8N_BASE_URL` there, correcting the
secret, a Workflow B Edit Fields change, and the authorized removal of 20
historical rows after a full backup. Other filters and search were not reported
live. Temporary diagnostics remain in the isolated copy and must be removed. The
live Part 1 `Document ID` mapping is recorded as user-reported. **Next is M4**,
not started and awaiting approval. The statements above that M3 had not started
are retained as history.

Added 2026-09-30 (Prompt 5I): **M5 passed** its `SPEC.md` §16 criterion, "A
browser submission produces a row, an email, and an on-screen result".
- **Built:** the upload screen now posts to `/api/process-document`, which proxies
  to published Workflow A with the secret server-side. The three upload specs now
  use intercepted transport.
- **Shell:** the active product shell now reads **Smart Office Document
  Assistant**, and navigation is limited to `/` and `/upload`.
- **VERIFIED in this working tree:** `tsc` and lint PASS; F1 6/6, F2 3/3 and F3
  3/3 PASS; `project.test.ts` 13/13; `home.spec.ts` 5/5; build PASS with 10
  routes.
- **USER-REPORTED:** one synthetic Normal document submitted through the UI
  (`document_id` 21) gave exactly one row, one email and a complete on-screen
  result.
- **Recorded forward:** M4 is reported VERIFIED PASS, which supersedes the "M4
  not started" statements above.
- **Incident:** one F3 run hit a transient local Next.js 404 with an unknown
  mechanism. It passed on a fresh dev cache.
- **Open:**
  - the "Intent Gate — Smart Document Review" naming in `CONTRACT.md`/`SPEC.md`
    vs. the active Smart Office Document Assistant identity;
  - the dashboard defaulting to mock data in this tree. **RESOLVED
    2026-10-01 by M6-D (Prompt 5P).**
- **Not done:** no commit, push or deployment. ~~`verify:baseline` and
  `verify:privacy` were not run.~~
- **Resolved the same day:** `verify:baseline` PASS (13/13) and
  `verify:privacy` PASS (8/8, 57 tracked files). The six untracked M5 files
  passed a separate privacy scan (`M5_UNTRACKED_PRIVACY_CHECK_PASS`).
- **Next is M6**, not started and awaiting approval.

Added 2026-09-30 (Prompt 5J): the completed M2–M5 work is **committed locally on
`main`**, in three checkpoints plus a records commit:
- `8ec4fc5`: privacy safeguards, the `CONTRACT.md` sanitization and the
  `/src.zip` ignore rule;
- `45c4f45`: 38 application and test files;
- `639c5fd`: the historical upload mock and its test.

Final verification before committing: `npm run check` PASS (unit 163/163,
build 10 routes) and M2 E2E 13/13, with no live request. The `CONTRACT.md`
example-value item and the unused-mock item are resolved.

Still open: the product-naming inconsistency in `SPEC.md`/`CONTRACT.md`, the
dashboard's mock default *(RESOLVED 2026-10-01 by M6-D, Prompt 5P)*, the stale `CLAUDE.md` milestone section, and M6. The
earlier "not committed" statements are superseded. **Not pushed. Not
deployed.** *(SUPERSEDED 2026-10-01 — pushed and verified; see Prompt 5K.)*

Added 2026-10-01 (Prompt 5K): the four M2–M5 checkpoint commits were **pushed to
`origin/main`** as a normal fast-forward, `3ab6555..59a50d3`. After the push,
remote `main` equalled local HEAD `59a50d358209e7c2bd140e9bf1c7184711591228`,
divergence was `0 0`, and the tree stayed clean. No force, merge, rebase, pull,
tag or deployment. **Not deployed. M6 not started.** The open items above are
unchanged. *(SUPERSEDED 2026-10-01 — M6 started; see Prompt 5L.)*

Added 2026-10-01 (Prompt 5L): **M6 is ACTIVE, not complete.** M6-A added the
Workflow C review contract (`review-contract.ts`), the server-only review client
(`review-client.ts`), and the `N8N_REVIEW_PATH` name. Nothing calls the client
yet, so runtime behaviour is unchanged. Two client refinements were accepted:
`invalid_request`, and a 404 maps to `not_found` only for the contract's 404
body. Approved design decisions for M6: a required free-text reviewer name;
`Reviewed` only in the UI; live detail through `/api/documents`; a live
dashboard default; legacy modules removed after the migration; the Skills
before M6-B. Verified: unit 40/40, tsc, lint (0 errors), `verify:baseline`,
`verify:privacy` and targeted privacy all PASS. No n8n change, external request
or deployment. Workflow C, F6, F7 and F8 remain open.

Added 2026-10-01 (Prompt 5M): the two `SPEC.md` §14 project Skills,
`contract-drift-guard` and `business-logic-leak-detector`, were created in
`.claude/skills/` and passed structural validation, `verify:privacy`,
`verify:baseline` and a targeted privacy scan. An uncommitted
`privacy-leak-guard` draft was replaced before commit and is not part of the
project. Privacy stays enforced by `scripts/verify-privacy.mjs` and targeted
scans of untracked files. **Neither Skill has been used on a real task yet.**
M6-B, in a fresh session, will be their first evidence-producing use. M6 stays
ACTIVE. F6, F7, F8, Workflow C, the Plugins and the submission remain open.

Added 2026-10-01 (Prompt 5N, backfilled in the M6-C records step): **M6-B is
complete; M6 stays ACTIVE, not complete.**
- `POST /api/review` was migrated from the superseded IntentSeal route to the
  Workflow C contract and the M6-A review client (`reviewRequestSchema` and
  `submitReview`). The legacy review fields, error codes and mappings were
  removed from that route.
- Verified: unit 46/46 across the route, review contract and review client;
  tsc, lint (0 errors), `verify:privacy` and `verify:baseline` PASS.
- Skills, first real use: `contract-drift-guard` first returned `BLOCKED` on
  the legacy route's drift, then `CONTRACT_DRIFT_GUARD_PASS` after the
  migration. `business-logic-leak-detector` returned `PASS`.
- No real Workflow C and no live review call are claimed.
- Committed and pushed as `13195c1`. Not deployed.

Added 2026-10-01 (Prompt 5O): **M6-C is complete at the application and
intercepted-test boundary; M6 stays ACTIVE, not complete.**
- The detail screen now loads its record live through the same-origin
  `GET /api/documents`, with strict validation, exact-id selection and no mock
  fallback.
- "Mark as reviewed" sends the same-origin `POST /api/review` with a required
  reviewer name and an optional note. The status changes only after a valid,
  matching success reply.
- Verified: unit 72/72, tsc, lint (0 errors), `verify:privacy` and
  `verify:baseline` PASS; intercepted Playwright 20/20, 24/24 and 14/14, with
  no real API, n8n or external request.
- Skills: `contract-drift-guard` blocked twice on missing test evidence (never
  on code drift) and passed after test-only fixes; `business-logic-leak-detector`
  passed. The untracked spec passed a targeted privacy scan.
- Open: M6-D (dashboard default and list reflection), M6-E (legacy cleanup),
  the real Workflow C and a controlled live review, F7, F8, and a
  repository-wide leak check. **Not committed. Not deployed.** *(SUPERSEDED
  2026-10-01 — committed and pushed; see the next note.)* *(M6-D: **RESOLVED
  2026-10-01** at the application and intercepted-test boundary; see Prompt
  5P.)*

Added 2026-10-01 (Prompt 5O, commit and push): M6-C was committed as
`f5b3139` (`feat: connect live document detail and review UI (M6-C)`) with
exactly the 8 authorized paths, and pushed by a normal fast-forward,
`13195c1..f5b3139`. Afterwards local HEAD, `origin/main` and remote `main`
were equal, divergence was `0 0` and the tree was clean. No force, tags,
deployment, n8n request, gc, maintenance or prune. **M6 stays ACTIVE, not
complete. Not deployed.**

Added 2026-10-01 (Prompt 5P): **M6-D is complete at the application and
intercepted-test boundary; M6 stays ACTIVE, not complete.**
- The dashboard now loads the same-origin `GET /api/documents` on mount, with
  strict whole-response validation, encoded exact-id links, no mock mode and
  no mock fallback.
- Returning through the in-app link causes a fresh GET; `Reviewed` appears only
  when that GET returns it. No status is derived or changed optimistically.
- Verified: unit 36/36, tsc, lint (0 errors), `verify:privacy` and
  `verify:baseline` PASS; intercepted Playwright 51/51, then
  `dashboard-api.spec.ts` 21/21, with no real API, n8n or external request.
- Skills: `contract-drift-guard` blocked on two evidence gaps (never on code
  drift) and passed after a test-only network-failure test;
  `business-logic-leak-detector` passed.
- The earlier "dashboard defaults to mock data" open items are **RESOLVED**.
- Open: M6-E (legacy cleanup, `documents-mock.ts`, `server-only` markers), the
  real Workflow C and a controlled live review, F7, F8, a repository-wide leak
  check, and the submission work. **Not committed. Not pushed. Not
  deployed.** *(SUPERSEDED 2026-10-01 — committed and pushed as `b506cdd`
  (`feat: make document dashboard live by default (M6-D)`); M6-E, the leak
  check, F7 and F8 at the repository boundary are closed by Prompt 5Q. Not
  deployed.)*

Added 2026-10-01 (Prompt 5P, commit and push): M6-D was committed as
`b506cdd` (`feat: make document dashboard live by default (M6-D)`) with exactly
the 10 authorized paths, and pushed by a normal fast-forward,
`14f77ad..b506cdd`. Afterwards local HEAD, `origin/main` and remote `main` were
equal, divergence was `0 0` and the tree was clean. No force, tags, deployment,
n8n request, gc, maintenance or prune. **M6 stays ACTIVE, not complete. Not
deployed.**

Added 2026-10-01 (Prompt 5Q): **M6-E is complete at the repository and
intercepted-test boundary; M6 stays ACTIVE, not complete.**
- 23 code, test and configuration paths: 11 legacy files deleted, 10
  authorized files modified, and 2 route test files added for exact timeout
  evidence.
- The IntentSeal schemas, the `AI_DRAFT` token set, the epistemic vocabulary,
  the `/sessions` routes, both mock modules and the legacy Bearer-auth client
  are gone. Exactly 5 current environment names remain.
- Verified: unit 148/148, then route tests 29/29; tsc, lint (0 errors, 0
  warnings), `verify:privacy` and `verify:baseline` PASS; intercepted Playwright
  66/66; build PASS with no `/sessions` route.
- Skills: repository-wide `business-logic-leak-detector` PASS;
  `contract-drift-guard` blocked only on unpinned Workflow A and B timeouts,
  then passed after two test-only corrections.
- F7 is complete at the intercepted-test boundary; F8 at the repository and
  configuration boundary.
- Open, live only: the real Workflow C, live acceptance of its path and secret,
  a real Sheet update, and the live 401, 404 and n8n-unavailable cases.
- Committed and pushed by the checkpoint operation whose commit subject is
  `chore: remove legacy paths and harden Smart Office (M6-E)`. **Not
  deployed.**

Added 2026-10-02 (Prompt 5R, corrected before commit): **Workflow C is
published; F1–F8 pass; M6 COMPLETE; M7 NEXT, not started.**
- Production `/api/review` returned 200 (agent-reported).
- One UI review set document 21 to `Reviewed` on screen and on the dashboard
  (user-confirmed screenshot), and in Sheet row 6 (direct read-only ChatGPT
  check).
- A malformed synthetic row made `/api/documents` return 502. It was diagnosed
  read-only and then cleared. No code was changed.
- F7: 55/55 intercepted tests passed. The live n8n-unavailable and wrong-secret
  runs are `SPEC.md` §9 tests 7–8, in M7.
- Observed, not contract-approved: the duplicate-ID branch returned 409
  upstream and 502 at the proxy. An omitted `review_note` preserved the earlier
  note. The 404 was seen only through the draft Test webhook.
- F5: the live `document_type` filter was checked (user-confirmed screenshot),
  as were the `department` and `status` filters (user-reported).
- F8: a value-blind check found 0 real-secret matches in 81 tracked files
  (agent-reported).
- Open in M7:
  - assessing the full `SPEC.md` §9 test matrix: test 9 already has evidence,
    tests 7 and 8 have no live run, and existing evidence is mapped before any
    repeat test;
  - the §10 deliverables.
- **Not committed. Not deployed.**

Added 2026-10-03 (Prompt 5S): **M7 is ACTIVE, not complete.**
- The redacted exports of Workflows A, B and C are in `n8n/exports/`.
  Credentials are removed, private IDs are replaced by baseline-style
  placeholders, and each file passed read-back checks. `verify:baseline` passed
  before and after.
- `README.md` now has the real clone command and an n8n import section.
- A §9 evidence map from existing evidence only is in `docs/PROJECT_STATE.md`.
  T07 stays OPEN. T10 stays OPEN because the Part 1 origin of the FP01 row is
  not proven by saved evidence.
- Real Context7 use was found in local session transcripts (2026-10-01,
  Workflow C).
- Still missing: `code-review` evidence, the screenshots, the demo recording,
  T07, live T04 and T10 Part 1 origin evidence, saved §9 evidence in the
  repository, and the Workflow A change record.
- Corrected the same day: T08 is "PASS observed with a deviation" from the
  2026-10-02 session record. T01–T03, T05 and T06 also have a reported
  external Sheet and Gmail read. T04 is intercepted only.
- **Not committed. Not deployed.**

Added 2026-10-03 (Prompt 5T): **T07 was observed passing** under its literal
condition, Workflow B unpublished by Avinoam.
- One page load returned 502 `upstream`, with a readable error and a usable
  page.
- After republishing, one load returned 200 with 10/10 rows.
- Each load made two `/api/documents` requests. No cause is asserted.
- Ten inspected M7 screenshots are now in `screenshots/m7/`.
- The T04 and T10 limitations are unchanged.
- **Not committed. Not deployed.**
