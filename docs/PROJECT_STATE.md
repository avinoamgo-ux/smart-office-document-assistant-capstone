# Smart Office Document Assistant — Historical Project State Record

> **Historical record.** This is the dated operational record of the Smart
> Office Document Assistant (Part 2). The entries below are kept as they were
> written. Original title: "Project State — Intent Gate | שער הכוונה".

**Forward status note (2026-10-08, public copy):**
- **Submission:** the owner reports that the submission was sent to the
  lecturer. This record does not verify it independently.
- **Grading and M7:** grading and the formal closure of M7 are **not
  verified**. Any "M7 active" or "in progress" line below is a dated status.
- **Deployment:** the application is **not deployed**.
- **n8n:** the owner's n8n trial has ended. Workflows A, B and C and the
  Part 1 workflow are **not live** now. Where the entries below call them live,
  active or published, that was true at the date of the entry. The redacted
  exports in `n8n/exports/` and the baseline in `n8n/baseline/` remain.

Living checkpoint. Keep concise. Update after every completed prompt.

**Current status (2026-10-03):** **M7 — ACTIVE, not complete.** The redacted
Workflow A/B/C exports are in `n8n/exports/` (VERIFIED). The §9 evidence map,
the Context7 finding and the remaining submission gaps are in "M7 — workflow
exports and §9 evidence map, 2026-10-03". `verify:baseline` passed on
2026-10-03. T07 was observed passing on 2026-10-03, and 10 inspected M7
screenshots are in `screenshots/m7/`. *(Updated later on 2026-10-03: T09 PASS
after the Review Note header repair, with a Sheet export image; 14 images in
`screenshots/m7/`. Factual documentation finalized: Context7 status, the
reflection, and the Workflow A change record. Later still: T04 PASS (local UI,
15 images); the 3:35 demo in `demo/`; T10 PASS against the §9 wording, with
Part 1 provenance inferred; the Skills status corrected forward in `SPEC.md`
§14 and `CLAUDE.md`. Prepared for a private PR; the `code-review` plugin has
not been run yet.)* The exports, the screenshots and this
record are **not committed**. The status lines
below predate this and are kept as written.

**Forward correction (2026-10-03, after commit `ee66699`):**
- The two "not committed" and "code-review not run" statements above are
  superseded.
- The Workflow A/B/C exports, the 15 screenshots, the demo MP4 and these records
  were committed in `ee666997e4ee1d3dc90eb8d7074dd09767933e2b` and pushed on
  branch `m7-submission-evidence` as PR #1.
- The `code-review` plugin ran on PR #1 at that commit and posted "No issues
  found". See [`docs/CODE_REVIEW_PR1.md`](CODE_REVIEW_PR1.md).
- **Verification gap, found 2026-10-03 and fixed 2026-10-04:**
  - The `npm run check` PASS before PR #1 ran while the exports were untracked,
    so `verify:privacy`, which scans tracked files only, never saw them. At
    `ee66699` it failed on the three approved Drive link templates in
    `n8n/exports/workflow-a.json`.
  - **Fix (approved):** a fail-closed exception in
    `scripts/verify-privacy.mjs`, covering those three exact JSON paths only
    and only when the file ID comes from the n8n expression. 8 new tests.
  - **Results:** `npm run check` exit 0 with the exports tracked (`verify:privacy`
    over 86 files, 158/158 unit tests, build). The exports are unchanged.

**Last verification date:** 2026-10-02 — published Workflow C through
`/api/review`, one F6 UI review, the selected intercepted F7 Playwright specs
(55/55) and `verify:privacy`. See "M6 — live Workflow C, F6 review and F7/F8
evidence, 2026-10-02". *(Until then: 2026-10-01 — M6-E verification: full unit
run, targeted route tests, typecheck, lint, `verify:privacy`, `verify:baseline`,
all seven intercepted Playwright specs, a production build, and the post-M6-E
Skill runs. Before that: the M6-D, M6-C and M6-B verification runs and the
structural validation of the two project Skills.)*
**Last documentation alignment:** 2026-10-02 — live Workflow C and F6–F8
evidence record (Prompt 5R). *(Until then: 2026-10-01 — M6-E record (Prompt
5Q); before that, the M6-D record (Prompt 5P), the M6-C record (Prompt 5O), the
M6-B record (Prompt 5N) and the M6 project Skills record (Prompt 5M).)*
**Active milestone:** `SPEC.md` §16 **M6 — COMPLETE (2026-10-02). M7 — NEXT,
not started**; it needs Avinoam's approval. M6's done-when, "All eight features
pass their checks", is met: F1–F8 are each supported by the recorded checks in
the F1–F8 evidence map in the 2026-10-02 section. Still open, in M7:
assessing the full `SPEC.md` §9 test matrix (existing evidence, such as the
2026-10-02 live review for test 9, is mapped before any test is repeated;
tests 7 and 8 have no live run yet), screenshots, the demo recording, the
workflow exports, the README, the reflection and the other §10 deliverables.
M2–M6 stay closed. *(Until the
2026-10-02 M6 closure, this line read: "**M6 — ACTIVE, not complete** (started
2026-10-01). Work: "Build Workflow C and the review action (F6); finish
error/empty states (F7); confirm config/secrets (F8)"; done when: "All eight
features pass their checks"".)* *(Until the 2026-10-02 record, this line read:
"**M6-A to M6-E complete.** M6-C, M6-D and M6-E are complete at the repository
and intercepted-test boundary only. F7 is complete at the intercepted-test
boundary; F8 is complete at the repository and configuration boundary. Still
open: the real Workflow C in n8n, live acceptance of its path and secret, the
controlled live review test with a real Sheet update, the live 401, 404 and
n8n-unavailable cases, and the submission work".)* *(Until the M6-E
record, this line read: "**M6-A, M6-B, M6-C and M6-D complete.** M6-C and M6-D
are complete at the application and intercepted-test boundary only. Still open:
M6-E (legacy cleanup), the real Workflow C in n8n, the controlled live review
test, overall F7 and F8, and the submission work".)* *(Until the M6-D record, this line read:
"**M6-A, M6-B and M6-C complete.** M6-C is complete at the application and
intercepted-test boundary only. Still open: M6-D (the dashboard default and the
list reflection), M6-E (legacy cleanup), the real Workflow C in n8n, the
controlled live review test, and overall F7 and F8".)* *(Until the M6-C
record, this line read: "M6-A and M6-B complete. Both `SPEC.md` §14 project
Skills have now been used successfully on a real task (M6-B). The next M6 step
needs Avinoam's approval. Workflow C, the review UI, the live review call, F7
and F8 are not complete". Until the M6-B record: "M6-A complete. The two
`SPEC.md` §14 project Skills are created, not yet used. The next step is M6-B,
in a fresh Claude Code session, which needs Avinoam's approval". Until earlier
on 2026-10-01: "the next step is the two Skills, then M6-B".)*
*(Superseded line, retained as written:* **Active milestone:** none. `SPEC.md`
§16 **M5 passed 2026-09-30**. **M4 is reported VERIFIED PASS (2026-09-30)** by
Avinoam; this is recorded forward in the M5 gate section. **Next: `SPEC.md` §16
M6** — … Not started; needs Avinoam's approval. **SUPERSEDED 2026-10-01 — M6
started.**)*
**Git state (2026-10-01):** the completed M2–M5 work is **committed and pushed
to `origin/main`; not deployed**. Pushed checkpoint HEAD:
`59a50d358209e7c2bd140e9bf1c7184711591228`. See "Push verification —
2026-10-01". The push record followed as `ebbd059`. M6-A was committed and
pushed as `25d4a72` (`feat: add Workflow C review contract and client (M6-A)`).
The two project Skills are committed with this record as `feat: add M6 contract
and business-logic guard skills`. Not deployed. *(Updated 2026-10-01: that
commit is `41fc680`, the published checkpoint before M6-B. M6-B is committed
with its record as `feat: migrate review API to Workflow C contract (M6-B)`.
Not deployed.)* *(Updated 2026-10-01: M6-B was pushed as `13195c1`, which
`origin/main` equalled after the push. The M6-C files and this record are **not
yet committed**. Not deployed.)* *(SUPERSEDED 2026-10-01 — **committed and
pushed through `f5b3139`** (`feat: connect live document detail and review UI
(M6-C)`); see "M6-C commit and push verification — 2026-10-01". **Not
deployed.**)* *(Updated 2026-10-01: the M6-C checkpoint record followed as
`14f77ad` (`docs: record M6-C checkpoint verification`). At the start of M6-D
records work, local HEAD and the locally stored `origin/main` ref both equalled
`14f77ad`, checked without a fetch. The 8 M6-D files and this record are **not
yet committed or pushed**. Not deployed.)* *(SUPERSEDED 2026-10-01 — M6-D was
**committed and pushed** as `b506cdd3e0e76865c990977fde767abfe0550cd2`
(`feat: make document dashboard live by default (M6-D)`), by a normal
fast-forward `14f77ad..b506cdd`. The M6-E checkpoint, this record included, is
committed and pushed by the controlled operation whose commit subject is
`chore: remove legacy paths and harden Smart Office (M6-E)`. Not deployed.)*
*(Updated 2026-10-02: the M6-E checkpoint is pushed as `3793c0f`, which the
locally stored `origin/main` equalled at the start of the session, checked
without a fetch. The 2026-10-02 work changed no tracked file except this record
and `PROMPTS.md`, which are **not committed**. Not deployed.)*
*(Superseded line, retained as written:* **Git state (2026-09-30):** the
completed M2–M5 work is **committed locally on `main`**, in three checkpoints
ending at `639c5fd`, plus this records commit. It is **not pushed and not
deployed**. See "Local checkpoint commits — 2026-09-30". **SUPERSEDED
2026-10-01 — pushed and verified.** *(Until then this line read: "the M4-era,
M5 and shell work is not committed, not pushed and not deployed".))*

> *Superseded header, retained as written until 2026-09-30:*
> **Last verification date:** 2026-09-16 (implementation verification, Prompt 3).
> The 2026-09-28 M3 gate rests on a user-reported manual UI check, not on a new
> automated run.
> **Last documentation alignment:** 2026-09-28 — M3 acceptance record (Prompt
> 5H). Documentation only. No code, `CONTRACT.md`, workflow, Sheet, test, build,
> lint, HTTP request or n8n execution was changed or run for it.
> **Active milestone:** none. `SPEC.md` §16 **M3 passed 2026-09-28** (evidence
> level: USER-REPORTED MANUAL UI CHECK). **Next: M4 — not started**, awaiting
> Avinoam's approval to begin. M2 closed 2026-09-27.
> **Last slice:** live Workflow B connection for the dashboard (M3), exercised in
> the isolated copy, 2026-09-27/28. The real F1 send to `/process-document`
> belongs to M5 and is still open.
> *(Header updated 2026-09-28. Until then it read: active milestone "M3 — not
> started"; last slice "F6 detail screen against mock records, 2026-09-27".)*

---

## M7 — workflow exports and §9 evidence map, 2026-10-03

**M7 — ACTIVE (2026-10-03).** Not complete, and not ready for submission. This
section supersedes the "M7 — NEXT, not started" statements below. Those are
kept as written.

No secret, private URL, private ID, email address or document text is
recorded here.

### Evidence labels used in this section

- **VERIFIED** — reviewable evidence stored in this repository, with real
  command output recorded.
- **AGENT-REPORTED (Claude Code)** — command output, a file read or a screenshot
  that Claude Code read in its session. The evidence itself is outside the
  repository.
- **USER-REPORTED** — a result Avinoam reported. This includes his 2026-10-03
  handoff.
- **EXTERNAL READ (reported)** — a direct Sheet or Gmail read made in the
  working session, outside Claude Code, and reported from that session. Claude
  Code did not make these reads.
- **USER-CONFIRMED (screenshot)** and **DIRECT SHEET READ (ChatGPT,
  read-only)** — as defined in the M6 section below.
- **OPEN** — no sufficient evidence yet.

### Workflow exports (`SPEC.md` §10.3) — VERIFIED

The files were prepared outside Git, then copied byte for byte into the
repository, with Avinoam's approval at each step.

| Repository path | Workflow | Nodes | SHA-256 |
|---|---|---|---|
| `n8n/exports/workflow-a.json` | A — Process Document | 18 | `da24e9ebc624fc8c7287e9b1788484ce47aae5af6bf2ad37978d9fffbe82f735` |
| `n8n/exports/workflow-b.json` | B — Documents API | 4 | `91c708d8ef6adc87101b29b84e10b61c249b6e115c3ee1eb7dcea318fddf6e0e` |
| `n8n/exports/workflow-c.json` | C — Review Update | 12 | `c184aad39ad29608e21f356419667ab2758a5921f2310ec1d662ea64e07e2ada` |

**Source selection (AGENT-REPORTED)**
- **A:** the n8n download of 2026-10-03. Its nodes and connections are
  identical to the 2026-10-03 PDF-fix backup.
- **B:** the 2026-10-02 backup. It is the only B file.
- **C:** the 2026-10-03 published download. Its nodes are identical to the
  2026-10-02 backup, but only it is marked active.

**Credential strip (AGENT-REPORTED)**
- Every node-level `credentials` property was removed: 8 in A, 2 in B and 3 in
  C.
- No credential material was found anywhere else.

**Redaction, following the `n8n/baseline/README.md` method (AGENT-REPORTED)**

| Category | A | B | C |
|---|---|---|---|
| `meta.instanceId` → `EXAMPLE_INSTANCE_ID` | 1 | 1 | 1 |
| `webhookId` → `EXAMPLE_WEBHOOK_ID` | 3 | 1 | 1 |
| Spreadsheet ID → `EXAMPLE_SPREADSHEET_ID` | 1 | 1 | 2 |
| Drive folder IDs | 3 | — | — |
| Email → `example.user@example.com` | 2 | — | — |
| Cached Google URLs → `https://example.com/…` | 4 | 2 | 4 |
| Display name: `(draft)` removed | 1 | — | — |

- The spreadsheet ID, the processed-folder ID and the email each matched their
  `BASELINE_MANIFEST.json` forbidden hash before replacement.
- **Approved decisions (Avinoam, 2026-10-03):**
  - A `nodes[6]` folder becomes `=EXAMPLE_PROCESSED_DRIVE_FOLDER_ID`, the same
    form as baseline line 404.
  - The A `nodes[12]` "Upload file" folder becomes
    `EXAMPLE_APP_UPLOAD_DRIVE_FOLDER_ID`, a new name. It occurs once.
  - The three dynamic Google file-link expressions in A stay unchanged. They
    contain no literal ID and implement `file_link`.
  - Four A paths stay unchanged: a node `type` string and three
    editor-generated condition and assignment UUIDs. The baseline keeps the
    same kind of field.
- **Kept, as the baseline does:** workflow `id`, `versionId`, node IDs, cached
  result names and the sheet `gid`.
- **Corrections on the way:**
  - The C file had a doubled `.json.json` extension.
  - A was blocked twice before writing: first on IDs inside expressions and a
    folder with no baseline name, then on the four classified paths. Both were
    resolved by the approvals above, not by guessing.

**Checks on each repository file (VERIFIED, 2026-10-03)**
- Its hash equals the approved value.
- There is no `credentials` key, and `pinData` is empty.
- No token matches a manifest forbidden hash.
- There is no email except the placeholder, and no detected secret.
- Google URLs appear only in A's three dynamic templates, unchanged. B and C
  have none.
- Node names, types, connections, expressions and webhook paths match the
  sources.
- `git diff --check` passed, and so did a `--no-index --check` on each new
  file.
- `npm run verify:baseline` passed before and after the copy (13/13).

**Structural note (AGENT-REPORTED):** exported A has 18 nodes, including a
Switch and a PDF extraction path. The 2026-09-30 M4 backup had 15. This
change to Workflow A is not recorded in this repository. Whether Part 1 needs
the same change (`SPEC.md` §11 duplication) is **OPEN**. *(Recorded below on
2026-10-03.)*

**Workflow A PDF-path change after M4 (recorded 2026-10-03, AGENT-REPORTED
structural read):**
- **M4 version (local backup of 2026-09-30, outside Git):** 15 nodes. It had no
  Switch and no Set node; one "Extract from File" text step handled every file.
- **Exported version (`n8n/exports/workflow-a.json`):** 18 nodes. The three
  added nodes:
  - `Switch` (`nodes[16]`): rule 0 is `$binary.data.mimeType` not equal to
    `application/pdf` → "Extract from File" (`nodes[0]`, operation `text`).
    The fallback output (`extra`) → "Extract PDF" (`nodes[15]`, operation
    `pdf`).
  - `Edit Fields` (`nodes[17]`, Set): `data = {{ $json.text ?? $json.data }}`,
    so both extraction paths give the AI step one `data` field. It feeds
    Merge input 1.
- **Routing:** PDFs go to PDF extraction. TXT and DOCX stay on the text path,
  as before.
- **Part 1 baseline (`n8n/baseline/part1-baseline.json`):** 11 nodes, with one
  "Extract from File" step (operation `text`) between "Download file" and
  "Information Extractor". There is **no** Switch, PDF-extraction or Set node,
  so it has no corresponding PDF path.
- **Not claimed:**
  - that Part 1 needs this fix — no contract or test evidence here shows a
    Part 1 PDF failure;
  - why the change was made, beyond its link to the T05 retest;
  - when it was approved.
  The change is a concrete instance of the §11 duplication cost.

### `SPEC.md` §9 evidence map (existing evidence only; no test rerun)

Each row keeps two things apart:
- **Observed result:** what a test run showed, with the label of its source.
- **Saved submission evidence:** what is stored in this repository.

Screenshots committed to `screenshots/m7/` (2026-10-03) are linked below. The
screenshot shows the screen only. The Sheet and Gmail outcomes still rest on
the reports named in the "Observed result" column.

| Test (`SPEC.md` §9) | Observed result | Saved submission evidence in the repository |
|---|---|---|
| T01 Urgent invoice | **PASS observed.** USER-REPORTED (handoff). EXTERNAL READ (reported): one Sheet row, one email, urgent branch. AGENT-REPORTED: the 2026-10-03 dashboard screenshot shows the file with `High`. | **Screenshot:** [result view](../screenshots/m7/T01-result-urgent-invoice.png). No Sheet or Gmail evidence saved. |
| T02 Normal report | **PASS observed.** USER-REPORTED. EXTERNAL READ (reported): one Sheet row, one email, normal branch. AGENT-REPORTED: the dashboard shows `Low`. | **Screenshot:** [result view](../screenshots/m7/T02-result-normal-report.png). No Sheet or Gmail evidence saved. |
| T03 No deadline | **PASS observed.** USER-REPORTED. EXTERNAL READ (reported): one Sheet row, one email, the relevant urgency branch. AGENT-REPORTED: the dashboard shows the deadline as `Not found`. | **Screenshot:** [result view](../screenshots/m7/T03-result-no-deadline.png), deadline `Not found`. No Sheet or Gmail evidence saved. |
| T04 Unsupported file | **PASS** (2026-10-03, AGENT-REPORTED, local UI check). T04 is an application-side rule ("rejected in the application before any request is sent"), so no upstream run is needed. One headless session on the running local app (port 3010) selected a 70-byte synthetic `.png` on `/upload`. Results: the alert "ניתן לעבד קובצי PDF, DOCX ו-TXT בלבד. הקובץ לא נשלח." ("only PDF, DOCX and TXT files can be processed; the file was not sent") was shown; Send was disabled before and after; one forced Send click was dispatched once and did nothing; **0** POST requests of any kind, including **0** `POST /api/process-document` (the browser was set to block every non-GET request; nothing needed blocking); no result region. The page stayed usable: "Clear selection" and the file input were enabled, and navigation was visible. *Separate, earlier evidence:* `e2e/upload-f1.spec.ts:343` (intercepted `/api/**`), part of the 8/8 upload run on 2026-10-02. | **Screenshot:** [validation state](../screenshots/m7/T04-upload-unsupported-png.png). The test code for the intercepted spec is also in the repository. |
| T05 Large document | **PASS observed** (retest after the Workflow A PDF change). USER-REPORTED. EXTERNAL READ (reported): one Sheet row, one email, the relevant branch. AGENT-REPORTED: the PDF appears on the dashboard. | **Screenshot:** [retest result view](../screenshots/m7/T05-result-large-pdf-retest.png). No Sheet or Gmail evidence saved. |
| T06 Double submission | **PASS observed.** USER-REPORTED. EXTERNAL READ (reported): exactly one Sheet row and one email. AGENT-REPORTED: the file appears once on the 2026-10-03 dashboard. | **Screenshots:** [result view](../screenshots/m7/T06-result-double-submit.png) and [dashboard afterwards](../screenshots/m7/T06-dashboard-after.png), with the T06 file listed once. The single Sheet row is not shown in a saved image. |
| T07 n8n unavailable | **PASS observed** (2026-10-03, AGENT-REPORTED, Claude Code). Literal condition: Avinoam unpublished Workflow B. One fresh headless page load of the local dashboard returned **502** in the `upstream` category, body `{status, message}` with no `error_code`. The readable error ("loading the documents failed" plus the automation-error sentence) was visible; the Try Again button was visible and enabled; the Upload link was visible with `href="/upload"`; no raw upstream detail and no crash. After Avinoam republished Workflow B, one fresh page load returned **200** and showed **10/10** rows with no error region. **Request count:** each of the two page loads produced **two** `/api/documents` requests. On the restoration load the first was browser-aborted (`net::ERR_ABORTED`) and the second returned 200. The failure load's per-request outcomes were not recorded separately. No cause is asserted. No click, retry or upload was made. | **Screenshots:** [error with Workflow B unpublished](../screenshots/m7/T07-error-workflow-b-unpublished.png) and [dashboard after restoration](../screenshots/m7/T07-dashboard-restored.png). The status codes rest on the session record. |
| T08 Wrong secret | **PASS observed, with a recorded deviation.** AGENT-REPORTED, Claude Code session of 2026-10-02 (16:36 UTC): an isolated `next start` on port 3011 got a newly generated wrong `N8N_SECRET` in its process environment only (`.env.local` unchanged). One dashboard load made 1 `/api/documents` request: **401** `UNAUTHORIZED`, the fixed configuration message, the page still usable, no raw upstream detail, no crash. Port 3011 was then stopped. AGENT-REPORTED, 2026-10-03: the screenshot shows the "loading failed" heading, the configuration-problem sentence and a Retry button. **Deviation:** §9 says "a corrupted secret in `.env`"; the run overrode the effective secret in one process instead. **Not shown by the screenshot alone:** the HTTP status and the injected wrong secret. Those rest on the session record. | **Screenshot:** [configuration error](../screenshots/m7/T08-error-wrong-secret.png). The session record is outside the repository. |
| T09 Review action | **PASS** (2026-10-03). AGENT-REPORTED (Claude Code): synthetic document 79 showed `Processed`. Exactly one app review was sent (one `POST /api/review`, no retry), returning **200** with `{status: "updated", document_id: "79"}`. The detail screen then showed **`Reviewed`** and the saved reviewer and note. EXTERNAL READ (reported): a separate direct read of the live Sheet confirmed the headers `Status` / `Document ID` / `Reviewed By` / `Review Note`, and document 79's own row with `Reviewed`, the test reviewer and the test note. *History:* the 2026-10-02 M6 review of document 21 (USER-CONFIRMED screenshot; DIRECT SHEET READ, ChatGPT) was later **contradicted**: a direct read and an official PDF export on 2026-10-03 showed the synthetic note in **N1**, where the `Review Note` header belongs, and nothing in document 21's note cell. The cause is still **unknown**; nothing in the exported Workflow C configuration targets row 1. N1 was restored to `Review Note` and document 21's existing note was moved back to its row, both read back successfully (USER-REPORTED repair) before the document 79 review. | **Image:** [spreadsheet review columns](../screenshots/m7/view-spreadsheet-export-review-columns.png). It was rendered from an official Google Drive PDF export of the live Sheet after the header repair and the document 79 review. It is **not** a browser screenshot. It shows only Urgency, Department, Status, Document ID, Reviewed By and Review Note, with no File Link column. Its 9 data rows do not include document ID 20; a double border between 19 and 60 may be a PDF page break (not interpreted). |
| T10 Both entry points | **PASS against the §9 wording, with Part 1 provenance inferred, not directly verified** (updated 2026-10-03). §9: "a file dropped in the Drive folder (Part 1) and a file sent from the application both appear in the same dashboard." **Observed (AGENT-REPORTED):** the dashboard screenshot shows `FP01_Test_06_Urgent_Own_Account.txt` (received 22.09) and the app-uploaded `M7_T05_large_document.pdf` together. **EXTERNAL READ (reported, ChatGPT, read-only):** the FP01 file is in the Drive folder "02 - Processed Documents"; exactly one matching urgent Gmail message from 22 September; one live Sheet row for FP01 with Document ID 6. **Inference:** Workflow A also moves files to the same processed folder, so the folder alone does not identify the path. The discriminating fact is the date: FP01 (22.09) predates Workflow A, built in M4 on 2026-09-30, so only the Part 1 Drive path could have produced that row and email. **Not done:** no n8n execution record of the Part 1 trigger has been read, and no new test file was created. | **Screenshot:** [both files on one dashboard](../screenshots/m7/T10-dashboard-both-entry-points.png). The external reads are not saved in the repository. |

**Saved evidence summary:**
- App screenshots are committed for T01–T03 and T05–T08, and for the
  shared-dashboard half of T10.
- **T09** has a committed Sheet image from an official PDF export (2026-10-03).
- No other test has its Sheet or Gmail outcome saved in the repository.
- T04 has a committed screenshot of its local UI check (2026-10-03).
- No §9 test other than T09 has both its app result and its Sheet outcome in
  saved evidence.

**Screenshot packaging (2026-10-03, AGENT-REPORTED):**
- All 16 unique images in the local `ig-m7-screens` folder were inspected
  visually (20 files; 4 were byte duplicates).
- 10 were copied byte for byte into `screenshots/m7/` with descriptive names.
  Each copy's SHA-256 equals its source. None was cropped or altered.
- **Held back (safe, but not needed):**
  - `T01_1_dashboard_before.png`, `T01_3_dashboard_after.png` (the same image
    as `T03_1_dashboard_before.png`), `T02_3_dashboard_after.png` and
    `T03_3_dashboard_after.png` (the same as `T06_1_dashboard_before.png`):
    intermediate dashboard states.
  - `T02_1_dashboard_before.png` and `T05_1_dashboard_before.png`: byte-equal
    to the copied T06 dashboard.
- **Held back (context not recorded):** `T05_2_result.png` and
  `T05_3_dashboard_after.png`, from the first T05 attempt. They show an upload
  error and a failed dashboard load, and their cause is not recorded in the
  repository.
- No image was held back as unsafe.

**App-view capture (2026-10-03, AGENT-REPORTED):**
- A headless Playwright session against the running local app captured the
  three app views linked under "Still missing" item 1. The browser allowed GET
  only and blocked non-local hosts; nothing was blocked. There was no upload,
  no text entry and no review action.
- A first session's filtered-dashboard image was **held back**: the filter
  had been applied while the list was still loading, so it showed no results.
  It stays outside Git.
- All three kept images come from one second session, which waited for the
  rows to load. Each was inspected visually and copied byte for byte.
- The second session made two `GET /api/documents` requests, both 200: one for
  the dashboard and one for the detail page.

**T10: ways to close the evidence gap** (options only; none is scheduled):
1. Existing n8n execution history, if Part 1's execution for that row is still
   retained: a screenshot showing the Google Drive trigger run.
2. An existing Drive "Processed" folder listing that shows the file moved there
   by Part 1.
3. An existing Sheet or Gmail record of that run that ties the row to the
   Part 1 path.
4. A new synthetic Drive drop. That is a new live run and would need separate
   approval. It would also cover the §17 criterion "the Part 1 Google Drive
   trigger still works".

### Plugin and Skill evidence

- **Context7 — AGENT-REPORTED, real use found.** Local Claude Code session
  transcripts, outside the repository, record these calls:
  - **2026-10-01, Workflow C design:** 10 calls (1 `resolve-library-id`, 9
    `query-docs` against the n8n docs). The session's report says Context7
    corrected the plan: Workflow C must **not** use "Append or Update Row".
    A follow-up round left five Update Row, Respond to Webhook and Get Row(s)
    questions UNKNOWN.
  - **2026-09-16:** 4 calls about multipart webhook input, a design later
    superseded.
- **`code-review` plugin — OPEN.** No recorded use. *(Corrected forward
  2026-10-03: **USED** — `/code-review:code-review 1` on PR #1, head
  `ee666997e4ee1d3dc90eb8d7074dd09767933e2b`. Result "No issues found",
  posted on PR #1 in the private project repository (not publicly accessible).
  Report: [`docs/CODE_REVIEW_PR1.md`](CODE_REVIEW_PR1.md).)*
- **Project Skills:** both exist, with PASS evidence recorded in the M6 sections
  below. No change.

### Still missing for submission (`SPEC.md` §10, §13, §17)

1. **Screenshots (§10.6):** committed in `screenshots/m7/`:
   - **result view:** T01, T02, T03, T05 and T06;
   - **dashboard:** T06 afterwards, T07 restored, T10;
   - **error state:** T07, T08.
   - **App views added 2026-10-03:**
     - [clean upload screen](../screenshots/m7/view-upload-clean.png), with no
       file chosen;
     - [dashboard filtered](../screenshots/m7/view-dashboard-filter-urgency-high.png)
       by `urgency` = `High`, 3 of 10 documents shown;
     - [detail view](../screenshots/m7/view-detail-document-21.png) of
       synthetic document 21, status `Reviewed`, review fields empty, nothing
       pressed.

   - **Spreadsheet, added 2026-10-03:**
     [review columns](../screenshots/m7/view-spreadsheet-export-review-columns.png),
     rendered from an official Google Drive PDF export of the live Sheet, not a
     browser screenshot. SHA-256
     `5e0d04679702a1c0e03b0faf39561fceeb1f4cc5617e57be802da45b9ded2352`.
     An earlier source (two thin crops in a DOCX) was held back: it had no
     headers and one crop showed the start of a Drive link.

   All six `SPEC.md` §10.6 screenshot views are now present.
2. **Demo recording (§10.4):** 3–5 minutes. None exists. *(RESOLVED
   2026-10-03: [`demo/Smart_Office_Demo_2026-10-03.mp4`](../demo/Smart_Office_Demo_2026-10-03.mp4),
   3:35; see "M7 demo recording" below.)*
3. **`code-review` plugin evidence (§13.1):** a saved report, run before the
   final commit. *(RESOLVED 2026-10-03: [`docs/CODE_REVIEW_PR1.md`](CODE_REVIEW_PR1.md).)*
4. **§9 gaps:**
   - **T07:** PASS observed on 2026-10-03 (see the table). **CLOSED** at the
     observation level, with screenshots committed.
   - **T04:** only an intercepted automated test; no live run or screenshot.
     *(RESOLVED 2026-10-03: local UI check PASS, 0 POST requests, screenshot
     committed.)*
   - **T10:** the Part 1 origin of the FP01 row has no saved evidence. The
     options are listed above. The §17 criterion "the Part 1 Google Drive
     trigger still works" also has only historical evidence. *(Updated
     2026-10-03: T10 PASS against the §9 wording, with provenance inferred
     from three external reads. Still not read: an n8n execution record of
     the Part 1 trigger. §17 "still works" rests on the 22.09 run only; no new
     Drive drop was made.)*
   - **Saved submission evidence:**
     - screenshots are committed for T01–T03, T05–T08 and the T10 dashboard;
     - no Sheet or Gmail evidence is saved for any test;
     - T04 has a committed screenshot (2026-10-03). T09 has its Sheet export
       image (2026-10-03).
   - **T08:** its deviation from the literal §9 wording (a process override,
     not an `.env` edit) must stay stated wherever T08 is claimed.
5. **Workflow A change record:** what changed after M4 (PDF path), and whether
   Part 1 needs the same change. *(RECORDED 2026-10-03 above. Part 1 has no
   PDF path; whether it needs one is not established.)*
6. **Stale statements to correct forward:**
   - `SPEC.md` §13 and `CLAUDE.md` still say "context7 — planned, not yet
     used";
   - `README.md` and `docs/REFLECTION.md` still call the reflection a draft.

   *(RESOLVED 2026-10-03: `SPEC.md` §13 has a dated status note and `CLAUDE.md`
   item 9 a forward correction. The draft label was removed from
   `docs/REFLECTION.md` and `README.md`, after confirming that all four §10.7
   questions and the §11 maintenance-cost note are present.)*
7. **Commit and push** of the exports and these records. Not done.
   *(RESOLVED 2026-10-03: committed in `ee66699` and pushed as PR #1. The
   review report and these corrections follow in the next commit on the same
   branch.)*

### M7 demo recording (`SPEC.md` §10.4), 2026-10-03

**File:** [`demo/Smart_Office_Demo_2026-10-03.mp4`](../demo/Smart_Office_Demo_2026-10-03.mp4).
- 3:35 (215.44 s), H.264, 1280×800, 25 fps, no audio, 8,039,680 bytes.
- SHA-256 `b6de1a9c38e1993ff837a28eb1eb03e0469891a1931aa06ae012635c98b1edd1`.
- It decodes fully, and its metadata holds only encoder tags.

**Recorded live (AGENT-REPORTED, Claude Code):** a headless Playwright
recording of the running local app, with captions added in the page. Guards:
non-local hosts were blocked, and at most one `POST /api/process-document`
and one `POST /api/review` were allowed. Nothing was blocked. The walkthrough:
1. The dashboard.
2. **One** upload of the new synthetic `M7_DEMO_printer_service_memo_20261003.txt`:
   200, `processed`, document **106**, urgency `Low`, `notification_sent: true`.
3. The result view.
4. A live unsupported `.png` rejection, with no request.
5. Dashboard search and filters (`urgency = High`, then `status = Needs Review`
   added).
6. The detail view of document 106, then **one** review: 200, `updated`, status
   `Processed` → `Reviewed`.
7. The dashboard showing `Reviewed` after a fresh read.

**Previously captured evidence, labelled in the video as not live:**
- the Sheet PDF-export image (document 79; it does not contain document 106);
- the T07 and T08 screenshots.

**Text slides added after recording:** two 12-second slides, inserted at
181.48 s, before the closing segment. The walkthrough is unchanged.
- **Email:** content supplied by Avinoam (USER-SUPPLIED). ChatGPT independently
  located exactly one matching Gmail message (EXTERNAL READ, reported).
  - Subject: "Document processed: M7_DEMO_printer_service_memo_20261003.txt".
  - Body heading: "Document processed successfully".
  - Values: file name, `report`, `Low`, `General`, and "No action is required
    from staff."
  - The Drive link, the n8n footer and tracking link, provider IDs and private
    URLs are removed.
- **Sheet:** values independently read after the recording (EXTERNAL READ,
  reported, ChatGPT, read-only). One row for Document ID 106, currently row 12:
  `Reviewed`, "M7 demo reviewer", "Checked during the demo recording".

**Exact limits of what is on screen:**
- No live Gmail or Google Sheets UI is shown. The email and the row for
  document 106 appear only as labelled text slides.
- The n8n failure cases (T07, T08) appear only as earlier screenshots.

**Inspection:** a contact sheet of the original and frames at every join of the
final video were inspected. They show synthetic data only, with no browser
chrome, URL, secret or personal data, and readable captions.

**External effects:**
- One new Sheet row (document 106). n8n reported a notification email sent; its
  Drive handling was not checked directly.
- One review update of that row.
- No change to n8n, credentials, the Sheet header or other rows.

### Not claimed

- No live test was run for the export and evidence-map records. *(Updated
  2026-10-03: the literal T07 run followed, as recorded above. Its only n8n
  effect was the unpublish and republish of Workflow B, which Avinoam did. Claude
  Code made no n8n, Drive, Sheets or Gmail change.)*
- Unit, lint, build and the Playwright suite were not run on 2026-10-03. The T07
  page loads used headless Playwright scripts outside the repository, not the
  test suite.
- Not committed. Not deployed. *(Corrected forward 2026-10-03: committed in
  `ee66699` as PR #1. Still not deployed.)*

---

## M6 — live Workflow C, F6 review and F7/F8 evidence, 2026-10-02

**M6 — COMPLETE (2026-10-02). M7 — NEXT, not started.** Workflow C is
published and was reached through the application. F1–F8 each pass their M6
feature check; see the evidence map below. F5 and F8 were PARTIAL until the
2026-10-02 checks recorded in "F5 — live filter checks" and in the F8
subsection.

No secret, URL, header, environment value, full response body or document
content is recorded here.

### Evidence labels used in this section

- **AGENT-REPORTED (Claude Code)** — command output or code reading reported by
  Claude Code in its session. Claude Code did not access Google Sheets or n8n.
- **DIRECT SHEET READ (ChatGPT, read-only)** — a read-only check of the Document
  Log performed by ChatGPT.
- **USER-CONFIRMED (screenshot)** — Avinoam confirmed the result from a
  screenshot of the application.
- **USER-REPORTED** — an operation or observation reported by Avinoam, outside
  the sources above.

No source is promoted into another.

### Workflow C and configuration

- **USER-REPORTED:** Workflow C was published in n8n and backed up outside Git.
  No export is in this repository.
- **AGENT-REPORTED (Claude Code):** with Avinoam's approval, `N8N_REVIEW_PATH`
  was added to `.env.local` by a guarded script. Before writing, the script
  checked that the candidate was one HTTPS URL with the same origin as
  `N8N_BASE_URL`, a `/webhook/` path (not `/webhook-test/`), and no query or
  fragment. It also checked that `buildN8nUrl` rebuilds the identical URL. The
  script appended one line, preserved every existing line, and printed only
  `PATH_SET`. No value was displayed or recorded.
- **AGENT-REPORTED (Claude Code):** a label-only check showed that
  `N8N_BASE_URL` carries no webhook segment. Each workflow's path variable
  therefore carries its own `webhook` or `webhook-test` segment.
- **AGENT-REPORTED (Claude Code):** one detached `next dev` on port 3010 loads
  `.env.local`. No process-level `N8N_REVIEW_PATH` overrides it.

### Draft-stage results (2026-10-01, draft Test webhook — not production)

All sent through the local `/api/review` route to the **draft Test webhook**,
using synthetic IDs, one request each, with no retry.

- **AGENT-REPORTED (Claude Code):** a nonexistent synthetic `document_id`
  returned **404** with the exact `CONTRACT.md` §5.3 body. Two earlier attempts
  returned 502 (`upstream`, then `malformed`) while the draft was not listening
  or not yet in contract shape. This 404 was **not** repeated against the
  published workflow.
- **AGENT-REPORTED (Claude Code):** a success-path request returned **200**
  with the §5.2 shape.
- **Duplicate-ID branch:**
  - **USER-REPORTED:** Workflow C's duplicate-ID branch returned **409**
    upstream.
  - **AGENT-REPORTED (Claude Code):** the local proxy returned **502** to the
    caller, through its `upstream` mapping for any non-2xx answer other than
    401, 403 and a §5.3-shaped 404.
  - `CONTRACT.md` §5 defines no duplicate case and no 409, so this 409 → 502
    behaviour is **observed, not contract-approved**.

### Production-path test (2026-10-02)

- **AGENT-REPORTED (Claude Code):** one `POST /api/review` through the app to
  published Workflow C, for a synthetic `document_id` with `status: "Reviewed"`
  and no `review_note`. It returned **200** with
  `{status: "updated", document_id}`, and the echoed ID matched.
- **DIRECT SHEET READ (ChatGPT, read-only):** the synthetic row was updated in
  the Document Log.
- **Omitted `review_note`:**
  - **DIRECT SHEET READ (ChatGPT, read-only):** a request without `review_note`
    left the row's earlier `Review Note` unchanged.
  - `CONTRACT.md` §5.1 makes the field optional but doesn't say what happens to
    the cell, so this is **observed behaviour, not a contract rule**.

### Malformed synthetic row and `/api/documents` (2026-10-02)

- **USER-REPORTED:** `/documents/21` showed the route's `malformed` message.
- **AGENT-REPORTED (Claude Code):** one local `GET /api/documents` returned
  **502**. Its body was not inspected: the tool's temporary path mismatched,
  and the GET was not repeated.
- **AGENT-REPORTED (Claude Code):** one read-only GET to published Workflow B,
  using the same configuration and authentication as `documents-client.ts`,
  with the response kept in memory only. It returned upstream **200** and a
  JSON array of 6. One item, index 5, failed `documentsResponseSchema`:

  | Field | Zod issue code |
  |---|---|
  | `file_link` | `too_small` |
  | `document_type` | `invalid_value` |
  | `deadline` | `too_small` |
  | `department` | `invalid_value` |

- **USER-REPORTED:** only that synthetic row was cleared. Document 21 then
  loaded again.
- This confirms the known contract behaviour that one bad row rejects the whole
  list (`CONTRACT.md` §4, `documentsResponseSchema`). The code was not changed.

### F6 — live UI review (2026-10-02)

- **USER-CONFIRMED (screenshot):** one "סימון כנבדק" review of the existing
  synthetic document 21 changed its status to `Reviewed` on the detail screen.
  The dashboard then showed `Reviewed`.
- **DIRECT SHEET READ (ChatGPT, read-only):** Document Log row 6 showed
  `Status` = `Reviewed`, with `Reviewed By` and `Review Note` filled in. Their
  values are not recorded here.
- No further review request was sent after the UI success. Claude Code sent
  none.
- **AGENT-REPORTED (Claude Code, code reading):** the button posts the
  same-origin `/api/review`. The status changes only after a validated success
  that echoes the same ID. The dashboard re-reads `/api/documents` on every
  mount.

### F7 — intercepted error and empty states (2026-10-02)

- **AGENT-REPORTED (Claude Code):** one run of
  `npx playwright test --config <temporary config outside the repository> e2e/upload-f1.spec.ts e2e/dashboard-api.spec.ts e2e/document-detail.spec.ts e2e/document-review.spec.ts`
  returned **55/55 PASS** (dashboard 21, detail 14, review 12, upload 8).
- The temporary config had `baseURL` on port 3010, no `webServer`, retries 0,
  and output outside the repository. It was removed afterwards.
- Every selected test registers an abort-all `**/api/**` guard before
  navigation. No live n8n or Sheets request was made. Port 3010 stayed running.
  `git status` was clean afterwards.
- The live "n8n unavailable" and "wrong secret" runs are `SPEC.md` §9 tests 7
  and 8. They belong to M7 and are **not** F7 feature gaps.

### F5 — live filter checks (2026-10-02)

Observed on the live dashboard. Each result carries its own source label:

- `document_type` = `invoice`: 1 of 5 rows, the matching invoice.
  **USER-CONFIRMED (screenshot)**, reviewed by ChatGPT in the session.
- `department` = `Management`: the matching M4 document. The row count was not
  explicitly reported. **USER-REPORTED.**
- `status` = `Reviewed`: 1 of 5 rows, document 21. **USER-REPORTED.**

The Sheet read selected the expected data. It did not independently verify the
browser filters. The earlier search and unit-test evidence in the evidence map
still applies.

### F8 — configuration and secrets (2026-10-02)

- **AGENT-REPORTED (Claude Code):** `npm run verify:privacy` ran once: exit 0,
  80 tracked files, all 8 of its rules PASS, no findings.
  - That PASS covers only the checker's own rules (hashed Part 1 baseline
    values and two literal host patterns).
  - It does **not** establish that the real `N8N_SECRET` value is absent from
    tracked files.
- **AGENT-REPORTED (Claude Code):** a one-time value-blind check, authorized by
  Avinoam:
  - It loaded the effective `N8N_SECRET` privately in process memory, with the
    same `@next/env` loader `next dev` uses. It first confirmed that the value
    was not already set in the process and that exactly one env file defines
    it.
  - It found **0** exact matches across all **81** Git-tracked files, read as
    raw bytes, so text and binary files were both covered. Exit 0.
  - The secret was not displayed, logged, hashed for output, saved or passed as
    an argument. No property of it is recorded.
- **AGENT-REPORTED (Claude Code, code reading):**
  - The five server environment names have no `NEXT_PUBLIC_` prefix.
  - They are read only by `src/lib/env.ts` (server-only assertion) and the
    three server clients. No client component imports them.
  - The secret is attached only as the server-side `x-api-key`.
  - `.env*` is git-ignored except `.env.example`.

### F1–F8 evidence map (M6 feature checks; the ten §9 live tests are M7)

| Feature | Supporting checks | M6 status |
|---|---|---|
| F1 Upload | M5 live submission, USER-REPORTED (2026-09-30); `upload-f1` 8/8 intercepted (2026-10-02) | PASS |
| F2 Processing state | `upload-f2` 3/3 intercepted (M5); M5 live submission, USER-REPORTED | PASS |
| F3 Result view | `upload-f3` 3/3 intercepted (M5); M5 complete result for document 21, USER-REPORTED | PASS |
| F4 Dashboard | `dashboard-api` 21/21 intercepted (2026-10-02); M3 real rows, USER-REPORTED (2026-09-28); 2026-10-02 dashboard with document 21 `Reviewed`, USER-CONFIRMED (screenshot) | PASS |
| F5 Search and filters | Unit: `src/lib/documents-view.test.ts` — search over file name, sender and summary (line 38), case and whitespace (line 56), a single facet (line 64), all four filters combined with AND (line 73); last run in the M6-E full unit run, 148/148 (2026-10-01). Browser: `e2e/dashboard-api.spec.ts:462` (urgency filter, file-name search, no-results; 2026-10-02) and `e2e/home.spec.ts:149` and `:162` (urgency, sender search, no-results; M6-E run, 2026-10-01). Live: urgency filter, USER-REPORTED (M3); `document_type` filter, USER-CONFIRMED (screenshot), and `department` and `status` filters, USER-REPORTED (2026-10-02, see "F5 — live filter checks") | PASS |
| F6 Detail + review | 2026-10-02 UI review, USER-CONFIRMED (screenshot), Sheet row 6 DIRECT SHEET READ (ChatGPT); production `/api/review` 200, AGENT-REPORTED; `document-detail` 14/14 and `document-review` 12/12 intercepted (2026-10-02) | PASS |
| F7 Error and empty states | 55/55 selected intercepted specs (2026-10-02); draft-only live 404 (2026-10-01); live `malformed` message, USER-REPORTED | PASS |
| F8 Configuration and secrets | Value-blind real-secret check: 0 matches in 81 tracked files, AGENT-REPORTED (2026-10-02); `verify:privacy` PASS for its own rules over 80 tracked files (2026-10-02); code reading | PASS |

### M6 closure and what stays open (M7)

M6 is **COMPLETE**. F1–F8 are each supported by the checks above. **M7 is
next** and has not started. Open in M7:

- the full `SPEC.md` §9 test matrix, which has **not yet been assessed**.
  Existing evidence must be mapped before any test is repeated:
  - §9 test 9 (review action) already has evidence: the 2026-10-02 live UI
    review of document 21 (USER-CONFIRMED screenshot), the Sheet row 6 check
    (DIRECT SHEET READ, ChatGPT) and the dashboard refresh showing `Reviewed`
    (USER-CONFIRMED screenshot);
  - test 7 (n8n unavailable) and test 8 (wrong secret) have no live run yet;
  - not all ten tests are complete;
- the `SPEC.md` §10 deliverables: workflow exports, README, demo recording,
  screenshots, the `PROMPTS.md` finalization and the reflection.

### Recorded observations, not M6 gaps

- The 404 through *published* Workflow C hasn't been observed. Only the draft
  Test webhook was tested.
- Duplicate ID: 409 upstream, 502 at the proxy. Not contract-approved; see
  above.
- Omitted `review_note`: the earlier note was preserved. Not a contract rule;
  see above.
- The `SPEC.md` §9 test matrix is assessed in M7. Test 9 already has evidence
  (above). Tests 7 and 8 have no live run yet.

### Not claimed

- No plugin use is recorded here. No `code-review` or `context7` evidence exists
  in these records.
- `verify:baseline`, the Part 1 baseline integrity check:
  - **NOT RUN** before the 2026-10-02 edits.
  - After the M6 documentation edits, `npm run verify:baseline` ran once:
    **PASS**, exit 0, 13/13 subchecks (AGENT-REPORTED). It was read-only and
    did not affect port 3010.
  - It is not an app build and not a test suite.
- Unit tests, lint, build and the full Playwright suite were not run on
  2026-10-02.
- Not committed. Not deployed. Not ready for submission.

---

## M6-E — legacy cleanup and repository hardening, 2026-10-01

**M6 stays ACTIVE and not complete.** M6-E is complete at the repository and
intercepted-test boundary. **No request reached a real API route, n8n workflow,
Google service or other external service.** No real Workflow C and no real Sheet
update are claimed. This checkpoint is committed and pushed by the controlled
operation whose commit subject is `chore: remove legacy paths and harden Smart
Office (M6-E)`. Not deployed, not ready for submission.

### Approved decisions (Avinoam, 2026-10-01)

- Delete the 11 legacy files, including the upload mock and its test.
- Remove the 5 superseded environment names and the optional env reader.
- Add no `server-only` package or import, change no Vitest configuration, and
  install nothing.
- Replace the dashboard search placeholder with a neutral Hebrew hint.
- Add exactly two upload E2E cases: a transport failure and the exact
  95,000 ms browser timeout.

### What changed (VERIFIED FROM CODE)

23 code, test and configuration paths.

**Deleted (11)**
- `src/lib/contracts.ts`, `src/lib/contracts.test.ts`
- `src/lib/map-response.ts`, `src/lib/map-response.test.ts`
- `src/lib/n8n-client.ts`, `src/lib/n8n-client.test.ts`
- `src/lib/documents-mock.ts`
- `src/lib/process-document-mock.ts`, `src/lib/process-document-mock.test.ts`
- `src/app/sessions/demo/page.tsx`, `src/app/sessions/new/page.tsx`

**Modified — the 10 originally authorized files**
- `.env.example`, `src/lib/env.ts`, `src/lib/project.ts`,
  `src/lib/project.test.ts`
- `src/lib/documents-contract.ts`, `src/lib/process-document-contract.ts`,
  `src/lib/review-contract.ts`, `src/lib/n8n-url.ts` (comments only)
- `src/components/documents-dashboard.tsx` (placeholder only)
- `e2e/upload-f1.spec.ts`

**Modified — 2 route test files, added by a later test-only correction**
- `src/app/api/documents/route.test.ts`
- `src/app/api/process-document/route.test.ts`

**Outcomes**
- The IntentSeal schemas, the `AI_DRAFT` token set, the epistemic vocabulary and
  the `/sessions` routes are removed from runtime code.
- Both mock modules are removed.
- The legacy n8n client, which used Bearer authentication and the superseded
  names, is removed.
- Exactly 5 current environment names remain. `.env.example` lists those names
  with empty values only.
- The dashboard search placeholder no longer holds fixture-derived words.
- Upload transport-failure and exact browser-timeout E2E tests were added.
- Exact 90,000 ms server-timeout tests were added for Workflow A and Workflow B.
  Workflow C already had one.

No route, server client, contract schema, URL-building logic, application
component behavior, package, lockfile or configuration file changed.

### Verification — VERIFIED, run in this working tree, 2026-10-01

- Full unit run: **148/148 PASS**, before the two timeout tests were added.
- Targeted route tests after adding them: **29/29 PASS**.
- `tsc --noEmit` — **PASS** on the final run. The first run failed only on
  generated, git-ignored validator files that still listed the deleted pages;
  they were regenerated by the dev server and the build.
- `npm run lint` — **PASS**: 0 errors and 0 warnings. The 16 earlier warnings
  were in the deleted legacy files.
- `npm run verify:privacy` — **PASS**.
- `npm run verify:baseline` — **PASS** before and after.
- Playwright, all API traffic intercepted, all seven specs in one run:
  **66/66 PASS**.
- `npm run build` — **PASS**. The route list contains no `/sessions` route.

### Project Skills — post-M6-E evidence (chronological)

Both Skills ran as read-only checks and made no edits.

1. `business-logic-leak-detector`, repository-wide:
   **`BUSINESS_LOGIC_LEAK_DETECTOR_PASS`**.
2. `contract-drift-guard`, first final run: `BLOCKED` only because the
   Workflow A and Workflow B 90,000 ms server timeouts were implemented but not
   pinned by a test. No drift and no FAIL.
3. Two test-only corrections pinned both timeouts at 89,999 ms and +1 ms.
4. `contract-drift-guard` rerun: **`CONTRACT_DRIFT_GUARD_PASS`**. No FAIL and no
   material UNKNOWN.

### Feature boundaries

- **F7** is complete at the intercepted-test boundary for Upload, Dashboard,
  Detail and Review.
- **F8** is complete at the repository and configuration boundary.
- **Still open, live only:** the real Workflow C in n8n; live acceptance of its
  path and secret; a real Sheet `Status`, `Reviewed By` and `Review Note`
  update; and the live 401, 404 and n8n-unavailable cases.

### Not claimed

- No real n8n, Sheet or external call; no live review.
- Not deployed. M6 is not complete. Not ready for submission.

---

## M6-D — live dashboard default and review-status reflection, 2026-10-01

**M6 stays ACTIVE and not complete.** M6-D is complete at the application and
intercepted-test boundary. **No request reached a real API route, n8n workflow
or external service.** No real Sheet `Status`, `Reviewed By` or `Review Note`
update is claimed. Not committed, not pushed, not deployed, not ready for
submission. *(SUPERSEDED 2026-10-01 in part — committed and pushed as
`b506cdd` (`feat: make document dashboard live by default (M6-D)`). Still not
deployed and not ready for submission.)*

### What changed (VERIFIED FROM CODE)

Eight files changed:

- `src/app/page.tsx`
- `src/components/documents-dashboard.tsx`
- `src/lib/documents-view.ts`
- `src/lib/documents-view.test.ts`
- `e2e/home.spec.ts`
- `e2e/dashboard-api.spec.ts`
- `e2e/document-detail.spec.ts`
- `e2e/document-review.spec.ts`

**Data source**
- The dashboard no longer imports or displays `MOCK_DOCUMENTS`.
- The mock/API switch, the mock buttons and the mock notices were removed.
- The same-origin `GET /api/documents` runs automatically on mount.
- The whole response is validated with `documentsResponseSchema`. Malformed
  data is rejected all or nothing, with no partial rows.
- No failure falls back to mock rows.

**Presentation**
- Each exact `document_id` becomes an encoded link to its detail screen.
- Newest-first sorting, search and filters remain presentation behavior over
  the returned rows.
- Status is never derived, defaulted or optimistically changed.

**Requests and errors**
- Refresh and retry each issue a fresh request. There is no polling.
- Each request uses `AbortController`, a 95,000 ms browser timeout, a
  request-id guard and cleanup on unmount.
- The route's message is shown only when the body is exactly
  `{status: "error", message}`.
- Non-JSON and wrongly shaped bodies get a fixed generic message.
- Transport and timeout failures get fixed, sanitized messages.

**Review-status reflection**
- Returning to the dashboard through the in-app link remounts it and causes a
  fresh GET.
- `Reviewed` is displayed only when that fresh GET returns `Reviewed`.

No route, server client, contract, environment or Skill file changed.

### Verification — VERIFIED, run in this working tree, 2026-10-01

- Unit tests: **36/36 PASS**.
- `tsc --noEmit` — **PASS**.
- `npm run lint` — **PASS**: 0 errors and 16 pre-existing warnings, none in an
  M6-D file.
- `npm run verify:privacy` — **PASS**.
- `npm run verify:baseline` — **PASS** before and after.
- Playwright, all API traffic intercepted in the browser:

  | Run | Result |
  |---|---|
  | One run across four specs | 51/51 (`home.spec.ts` 5, `dashboard-api.spec.ts` 20, `document-detail.spec.ts` 14, `document-review.spec.ts` 12) |
  | Targeted `dashboard-api.spec.ts` run, after adding the network-failure test | 21/21 |

- Every E2E test asserts that the unexpected-request list is empty.

### Project Skills — post-M6-D evidence (chronological)

Both Skills ran as read-only checks and made no edits.

1. A read-only audit identified the unsafe `home.spec.ts` path before the
   dashboard default was changed.
2. `contract-drift-guard`, before M6-D: `BLOCKED`, because the old
   implementation had not yet been replaced and no evidence existed yet. It
   found no problem with the approved plan.
3. M6-D was implemented. The intercepted four-spec run passed 51/51.
4. `contract-drift-guard`, after M6-D: `BLOCKED` on **two evidence gaps, not
   code drift**:
   - no E2E test for a dashboard transport failure;
   - no Skill evidence yet for the client secret boundary.
5. Test-only correction: one transport-level test, using a locally aborted
   intercepted request, was added to `dashboard-api.spec.ts`. That spec passed
   21/21.
6. `business-logic-leak-detector`: **`PASS`**.
   - The client import graph preserves the secret boundary.
   - The browser calls only the same-origin `/api/documents`.
   - No n8n-owned classification, Sheet action or status decision is
     reproduced.
   - `Reviewed` is reflected only from a fresh GET.
7. Final `contract-drift-guard` rerun: **`CONTRACT_DRIFT_GUARD_PASS`**.
   - The former network-failure UNKNOWN is now PASS.
   - The former secret-boundary UNKNOWN is now PASS.
   - No FAIL and no material UNKNOWN.

### Known interim state and future scope

- `documents-mock.ts` remains as unused historical and test support until
  M6-E. No runtime code imports it. **RESOLVED 2026-10-01 by M6-E — deleted.**
- The search placeholder still holds generic example words. This is a
  non-blocking cosmetic follow-up only. **RESOLVED 2026-10-01 by M6-E.**
- Explicit `server-only` markers on the server clients remain an M6-E
  hardening consideration. **DECIDED 2026-10-01 in M6-E — not added**, by
  Avinoam's decision; the runtime guard in `env.ts` and the repository-wide
  leak check are the evidence.
- The real Workflow C is not yet built or live-tested.
- A repository-wide `business-logic-leak-detector` run is still required before
  submission. **RESOLVED 2026-10-01 — it passed after M6-E.**

### Not claimed

- No real n8n, Sheet or external call; no live review; no real Sheet `Status`,
  `Reviewed By` or `Review Note` update.
- Not committed, not pushed, not deployed, not ready for submission.
  *(SUPERSEDED 2026-10-01 in part — committed and pushed as `b506cdd`. Still
  not deployed and not ready for submission.)*
- No build was run for M6-D.

---

## M6-C commit and push verification — 2026-10-01

VERIFIED from real command output. **M6 stays ACTIVE and not complete.** M6-D,
M6-E, the real Workflow C, the controlled live review test, F7 and F8 remain
open. Nothing technical about M6-C changed in this step. *(M6-D: **RESOLVED
2026-10-01** at the application and intercepted-test boundary; see "M6-D — live
dashboard default and review-status reflection, 2026-10-01". The rest stays
open.)*

- **Commit:** `f5b3139deaf8aff8a25569bf48514840adf710fd`, `feat: connect live
  document detail and review UI (M6-C)`. It contains exactly the 8 authorized
  M6-C code, test and record paths.
- **Push:** a normal fast-forward, `13195c1..f5b3139 main -> main`.
- **After the push:** local HEAD, `origin/main` and remote `main` all equalled
  `f5b3139`; divergence `0 0`; working tree clean.
- **Not done:** no force push, no tags, no deployment, no n8n request, and no
  gc, maintenance or worktree prune.

---

## M6-C — live detail and review UI, 2026-10-01

**M6 stays ACTIVE and not complete.** M6-C is complete at the application and
intercepted-test boundary. **No request reached a real API route, n8n workflow
or external service.** No real Sheet `Status`, `Reviewed By` or `Review Note`
update is claimed. Not committed, not deployed, not ready for submission.
*(SUPERSEDED 2026-10-01 in part — committed and pushed as `f5b3139`; see "M6-C
commit and push verification — 2026-10-01". Still not deployed and not ready
for submission.)*

### What changed (VERIFIED FROM CODE)

Six files changed:

- `src/app/documents/[document_id]/page.tsx`
- `src/components/document-detail.tsx`
- `src/lib/document-detail-view.ts`
- `src/lib/document-detail-view.test.ts`
- `e2e/document-detail.spec.ts`
- `e2e/document-review.spec.ts` (new)

**Loading the record**
- The detail page no longer reads `MOCK_DOCUMENTS`. It decodes the
  `document_id` safely; a malformed segment renders the not-found state and is
  not echoed.
- The client screen fetches only the same-origin `GET /api/documents`. It
  validates the whole response with `documentsResponseSchema`, selects the
  exact `document_id`, and has no mock fallback.
- States: loading, retry ("נסה שוב"), not found, empty list, malformed or
  non-JSON reply, network failure, timeout, and the route's sanitized error
  message.

**Review**
- The review form sends only the same-origin `POST /api/review`.
- `reviewed_by` is required and trimmed; a blank or whitespace-only name blocks
  the action.
- `review_note` is optional, trimmed, limited to 200 characters (the limit is
  imported from `review-contract.ts`) and omitted when empty.
- The approved user action sends `status: "Reviewed"`.
- The shown status changes only after a valid success reply whose
  `document_id` matches the one sent.
- An already-`Reviewed` document cannot be submitted again.
- Error handling:
  - 400, 401, 500, 502 and 504 show the route's sanitized message;
  - 404 shows a fixed Hebrew message;
  - non-JSON, malformed, mismatched-id, network and timeout replies each show
    a fixed Hebrew message.

**Guards (GET and POST)**
- A 95,000 ms browser timeout, just above the server's 90,000 ms.
- `AbortController`, a request-id guard against superseded replies, and abort
  on unmount.
- Review only: a synchronous double-submit guard plus disabled controls while
  sending.

No route, client, contract, dashboard or environment file changed.

### Verification — VERIFIED, run in this working tree, 2026-10-01

- Targeted unit run (detail view, review contract, review client, review
  route): **72/72 PASS**.
- `tsc --noEmit` — **PASS**.
- `npm run lint` — **PASS**: 0 errors and 16 pre-existing warnings, none in an
  M6-C file.
- `npm run verify:privacy` — **PASS** on tracked files.
- `npm run verify:baseline` — **PASS** before and after each step.
- Playwright, all API traffic intercepted in the browser:

  | Run | Result |
  |---|---|
  | Initial M6-C run | 20/20 |
  | Evidence-correction run | 24/24 (`document-detail.spec.ts` 12/12, `document-review.spec.ts` 12/12) |
  | Final `document-detail.spec.ts` run, after closing the last gap | 14/14 |

- Every test registers a catch-all `/api/**` guard before navigation and
  asserts that the unexpected-request list is empty.

### Project Skills — post-M6-C evidence (chronological)

Both Skills ran as read-only checks and made no edits.

1. `contract-drift-guard`, before M6-C: `BLOCKED`. The detail screen was still
   mock-only, and the guard raised eight open decisions. Avinoam's M6-C
   authorization approved them before implementation.
2. `contract-drift-guard`, after M6-C: `BLOCKED` on **missing test evidence,
   not code drift**. The 95,000 ms values were not pinned, the load timeout,
   load network failure and unmount handling were untested, and the client
   secret boundary had no asserting evidence.
3. Test-only correction: timeout boundaries pinned at 94,999 ms and +1 ms for
   GET and POST, a transport-failure test, and held-request unmount tests for
   GET and POST.
4. `business-logic-leak-detector`: `PASS`. The client import graph preserves
   the secret boundary; the browser calls only the relative `/api` paths; no
   n8n-owned business decision is reproduced in the app.
5. `contract-drift-guard` rerun: `BLOCKED` on one narrow E2E gap — a non-OK
   `GET /api/documents` reply with a body outside the route-error shape.
6. Two tests added: a 502 with a non-JSON body and a 500 with a wrongly shaped
   JSON body.
7. Final `contract-drift-guard` rerun: **`CONTRACT_DRIFT_GUARD_PASS`**. Every
   row PASS; no FAIL and no material UNKNOWN.

### Privacy

- `verify:privacy` passed for tracked files.
- `e2e/document-review.spec.ts` is untracked, so it received a separate
  targeted scan applying the official rules plus extra categories. No forbidden
  or private value was found (`M6_C_UNTRACKED_PRIVACY_PASS`). The file holds
  synthetic and reserved fixtures only.

### Known interim state and future scope

- The dashboard still defaults to mock rows that link into this live screen,
  so a mock row can show "not found". This belongs to M6-D, together with
  reflecting the new status in the list. **RESOLVED 2026-10-01 by M6-D** — the
  dashboard now loads only live rows, and `Reviewed` appears after a fresh GET.
- Workflow C does not yet exist in n8n, or has not been verified live. No live
  review has run.
- The legacy IntentSeal modules and superseded env names remain, for M6-E. An
  explicit `server-only` marker will be considered there. **RESOLVED 2026-10-01
  by M6-E** — both removed; the `server-only` marker was considered and not
  added, by decision.
- A repository-wide `business-logic-leak-detector` run is still required before
  submission. **RESOLVED 2026-10-01 — it passed after M6-E.**

### Not claimed

- No real n8n, Sheet or external call; no live review; no deployment.
- No full unit suite, full E2E suite or build was run for M6-C.

---

## M6-B — `/api/review` migrated, 2026-10-01

**M6 stays ACTIVE and not complete.** Workflow C, the review UI, the live review
call, F7 and F8 are **not** complete. *(SUPERSEDED 2026-10-01 in part — the
review UI was built at the intercepted-test boundary in M6-C; Workflow C, the
live review call, F7 and F8 remain open.)* **The route has not reached a real
n8n instance.** Every result below comes from unit tests with the review client
mocked or `fetch` stubbed.

### What changed (VERIFIED FROM CODE)

Only two files changed: `src/app/api/review/route.ts` and
`src/app/api/review/route.test.ts`.

- `POST /api/review` no longer uses the superseded IntentSeal route. It now
  validates with `reviewRequestSchema` from `review-contract.ts`, calls
  `submitReview` from `review-client.ts` exactly once, and returns only the
  Smart Office response and error shapes.
- The route no longer imports `contracts.ts`, `proxyToN8n` or
  `mapReviewResponse`. It reads no environment value itself.
- The success body is rebuilt from the validated fields only:
  `{status: "updated", document_id}`.
- `review-client.ts`, `review-contract.ts`, the UI, the environment files and
  the legacy modules were not changed.

### Approved route mapping (Avinoam, 2026-10-01)

| Case | HTTP | Body |
|---|---|---|
| Invalid JSON or request, or `invalid_request` | 400 | `{status: "error", message}` |
| Success | 200 | `{status: "updated", document_id}` |
| `unauthorized` (upstream 401 or 403) | 401 | `{status: "error", error_code: "UNAUTHORIZED", message}` |
| `not_found` | 404 | `{status: "error", message: "Document not found."}` (contract literal) |
| `misconfigured` | 500 | `{status: "error", message}` |
| `timeout` | 504 | `{status: "error", message}` |
| `unreachable`, `upstream`, `malformed` | 502 | `{status: "error", message}` |

`UNAUTHORIZED` is the only allowed `error_code`. No 503 is used. Every message
except the 404 literal is fixed, sanitized Hebrew text. No upstream body, URL,
secret or exception text is forwarded.

### Verification — VERIFIED, run in this working tree, 2026-10-01

- `npm run test:unit -- src/app/api/review/route.test.ts
  src/lib/review-contract.test.ts src/lib/review-client.test.ts` — **PASS**,
  3 files, 46/46 tests. The 16 legacy route tests were replaced by 19 Smart
  Office tests.
- `tsc --noEmit` — **PASS** (exit 0).
- `npm run lint` — **PASS** (exit 0): 0 errors and 16 remaining pre-existing
  warnings, none in an M6-B file. (17 were recorded at M6-A.)
- `npm run verify:privacy` — **PASS**.
- `npm run verify:baseline` — **PASS** before and after the edits.

### Project Skills — first real use (evidence)

Both Skills ran as read-only checks. **Neither edited a file.**

| Run | Verdict | Finding |
|---|---|---|
| `contract-drift-guard`, before M6-B | `CONTRACT_DRIFT_GUARD_BLOCKED` | 13 FAIL rows on the browser hop: legacy request fields and success shape, manufactured `error_code` values, no 404 or 401 path, a `Bearer` header instead of `x-api-key`, a 5,000 ms timeout, legacy env names. Material UNKNOWN items included the 400 status and secret/URL leakage. The M6-A server hop passed every row. |
| `contract-drift-guard`, after M6-B | `CONTRACT_DRIFT_GUARD_PASS` | All 13 former FAIL rows became PASS. No FAIL and no material UNKNOWN remained. |
| `business-logic-leak-detector`, first real run | `BUSINESS_LOGIC_LEAK_DETECTOR_PASS` | No app-side AI call, extraction, classification, urgency or department decision, Google API call, notification decision, file movement, Sheet lookup or update, default value or client-side secret. `submitReview` is server-side transport only. |

### Open, non-blocking follow-ups

- The legacy IntentSeal modules (`n8n-client.ts`, `contracts.ts`,
  `map-response.ts`, their tests and the legacy env names) remain, for M6-E
  cleanup.
- An explicit `import 'server-only'` in `review-client.ts` will be considered
  in M6-E.
- The review UI, Workflow C, the live review call, F7 and F8 are not complete.
  *(SUPERSEDED 2026-10-01 in part — the review UI was built in M6-C; the rest
  remains open.)*
- Whether to disable the review action while a request is in flight is still
  open. §9 does not require it. *(RESOLVED 2026-10-01 — approved for M6-C and
  implemented with a synchronous guard and disabled controls.)*

### Not claimed

- No call to a real n8n instance, no Workflow C, no Sheet change.
- No full unit suite, E2E run, build, server or deployment.

---

## M6 project Skills — created, 2026-10-01

Recorded after M6-A, within M6. **M6 stays ACTIVE and not complete.** F6, F7,
F8, Workflow C, the Plugins and the submission are **not** complete.

### Created — the two `SPEC.md` §14 project Skills

| Skill | File | Purpose |
|---|---|---|
| `contract-drift-guard` | `.claude/skills/contract-drift-guard/SKILL.md` | Before any endpoint change, compare root `CONTRACT.md`, the implementation and the tests row by row. Missing evidence is `UNKNOWN`. Block on a failure or a material unknown. |
| `business-logic-leak-detector` | `.claude/skills/business-logic-leak-detector/SKILL.md` | Enforce the instructor boundary: n8n owns extraction, classification, routing, Gmail, Drive and Sheets behavior; the app only validates, proxies, maps errors and displays. Block on any leak. |

Both are project-owned Claude Code Skills stored in this repository. They are
not Plugins, n8n integrations or personal Skills. Neither edits files; each ends
with a single PASS or BLOCKED line.

### Privacy is still enforced

Privacy stays covered by `scripts/verify-privacy.mjs` for tracked files, plus a
targeted scan of untracked files before staging.

An earlier draft, `privacy-leak-guard`, was **never committed**. It was replaced
by `business-logic-leak-detector` before any commit, to match `SPEC.md` §14, and
is **not part of the project**. `SPEC.md` was not changed.

### Verification — VERIFIED, 2026-10-01

- Structural validation PASS for both files:
  - frontmatter holds exactly `name` and `description`;
  - each name matches its folder;
  - each description lists activation triggers only;
  - no TODO or placeholder;
  - 113 and 117 lines, both under 150.
- `contract-drift-guard` is byte-identical (SHA-256) before and after the draft
  replacement.
- `npm run verify:privacy` — **PASS**.
- `npm run verify:baseline` — **PASS**.
- Targeted privacy scan of both untracked `SKILL.md` files — **PASS**, no
  findings.
- No application, test, environment, route, UI or n8n behavior changed.

### Not claimed

- **Neither Skill has yet been used successfully on a real task.** Creating and
  validating them is not evidence of use.
- **M6-B, run in a fresh Claude Code session, will be their first
  evidence-producing use.**
- **SUPERSEDED 2026-10-01 — both Skills were used successfully in M6-B;** see
  "M6-B — `/api/review` migrated, 2026-10-01".

---

## M6 — ACTIVE; M6-A complete, 2026-10-01

This section supersedes the "M6 has not started" statements in this file and in
`PROMPTS.md`. Those statements are retained as written; each was true when
recorded. **M6 is not complete.** Workflow C, F6, F7 and F8 are **not** complete.

### M6-A — what was built (VERIFIED FROM CODE)

- `src/lib/review-contract.ts`: zod schemas for root `CONTRACT.md` §5.1–§5.3.
  The request has `document_id`, `status` (`Reviewed` or `Needs Review`),
  `reviewed_by` (a required non-empty string with no maximum, since the source
  defines none) and an optional `review_note` of up to 200 characters. Success is
  `{status: "updated", document_id}`. The 404 body is `{status: "error", message}`
  with no `error_code`.
- `src/lib/review-client.ts`: a server-only client for Workflow C. It reads only
  the names `N8N_BASE_URL`, `N8N_REVIEW_PATH` and `N8N_SECRET`, builds the URL
  through `n8n-url.ts`, and posts JSON with `x-api-key` and no `Authorization`
  header. It aborts after 90,000 ms. It validates the outgoing request and the
  success response, and requires the echoed `document_id` to equal the one sent.
- Outcome labels: `invalid_request`, `misconfigured`, `unauthorized` (401/403),
  `not_found`, `timeout`, `unreachable`, `upstream` and `malformed`.
- The name `N8N_REVIEW_PATH` was added to `src/lib/env.ts` and `.env.example`, and
  `src/lib/project.test.ts` now expects exactly ten names. No superseded name was
  removed.
- **No `.env.local` value was added or read.**
- **Nothing calls the new client yet.** `/api/review`, every UI file and the
  legacy `n8n-client.ts` are unchanged, so **runtime behaviour is unchanged**.
- **No n8n change and no external request.**

### Accepted client refinements

1. `invalid_request` reports a request rejected locally, before any network call.
   None of the eight originally listed outcomes fitted that case.
2. A 404 maps to `not_found` only when its body matches the §5.3 not-found
   shape. Any other 404 maps to `upstream`, because n8n also answers 404 for an
   unregistered webhook, such as an inactive workflow.

### Approved design decisions (Avinoam, 2026-10-01)

- `reviewed_by` will be a required free-text reviewer-name field.
- The UI will offer `Reviewed` only. The contract still accepts `Reviewed` and
  `Needs Review`.
- The live detail screen will later load its record through `/api/documents`.
- The dashboard will later default to live data.
- The legacy modules (`n8n-client.ts`, `contracts.ts`, `map-response.ts` and their
  tests) will be removed only after the migration succeeds.
- The two Skills will be created before M6-B.

### Verification — VERIFIED, run in this working tree, 2026-10-01

- `npm run test:unit -- src/lib/review-contract.test.ts
  src/lib/review-client.test.ts src/lib/project.test.ts` — **PASS**, 3 files,
  40/40 tests.
- `tsc --noEmit` — **PASS** (exit 0).
- `npm run lint` — **PASS** (exit 0): 0 errors and the same 17 pre-existing
  warnings, none in an M6-A file.
- `npm run verify:baseline` — **PASS** before and after the edits.
- `npm run verify:privacy` — **PASS** on tracked files.
- A targeted privacy scan of the four new untracked files — **PASS**, no
  findings. It applied the official rules plus extra checks. The only allowlisted
  matches are contract Status values, names ending in "Example", reserved
  `.invalid` hosts and one test-only secret string.

### Not run or not claimed

- No full unit suite, E2E run, build or server.
- No Workflow C, no real review call, and no Sheet change.
- No deployment.

---

## Push verification — 2026-10-01

This section supersedes the "not pushed" statements about the M2–M5 checkpoints
in this file and in `PROMPTS.md`. Those statements are retained as written; each
was true when recorded.

### VERIFIED — real command output, 2026-10-01

- Before the push: branch `main`, HEAD
  `59a50d358209e7c2bd140e9bf1c7184711591228`, working tree clean, local
  `gc.auto=0`.
- `git fetch origin main` succeeded. Divergence `origin/main...main` was then
  exactly `0 4` (behind 0, ahead 4).
- `git push origin main` was a normal fast-forward:
  `3ab6555..59a50d3  main -> main`.
- After the push:
  - divergence `0 0`;
  - `git ls-remote --heads origin main` returned
    `59a50d358209e7c2bd140e9bf1c7184711591228`, equal to local HEAD;
  - working tree clean;
  - `src.zip`, `.env.local`, `private/` and `artifacts/` still untracked.
- Only branch `main` was pushed. No force, merge, rebase, pull, reset, tag or
  deployment occurred.

### Scope of the claim

- The four checkpoint commits (`8ec4fc5`, `45c4f45`, `639c5fd`, `59a50d3`) are on
  `origin/main`. Nothing more is claimed.
- **Not deployed.** The push does not claim final-submission readiness.
- **M6 had not started** at the time of the push, and still has not.
  **SUPERSEDED 2026-10-01 — M6 started;** see "M6 — ACTIVE; M6-A complete".
- The final-submission gaps and the open items below are unchanged.

---

## Local checkpoint commits — 2026-09-30

This section supersedes every earlier "not committed" statement about the M2–M5
work in this file and in `PROMPTS.md`. Those statements are retained as written;
each was true when recorded.

### The checkpoints, on `main`, local only

| Commit | Subject | Files |
|---|---|---|
| `8ec4fc5c7b713952f2ace55a118ebb7c9879196a` | `chore: harden repository privacy safeguards` | `CONTRACT.md`, `.gitignore` |
| `45c4f45b9c23c8f6dc75bb3363840f4d0ad6c123` | `feat: build Smart Office document workflows and UI (M2-M5)` | 38 authorized application, shared server, shell and test files |
| `639c5fdf5516989b1ad8248bd0e4105a149b816a` | `chore: preserve upload mock test fixture` | `src/lib/process-document-mock.ts` and its test |

A fourth commit, `docs: record verified M2-M5 checkpoints`, adds this record.
Every file was staged by explicit path. Before each commit the index was checked
for the exact expected set, `git diff --cached --check` was clean, and
`npm run verify:privacy` passed against the staged state. `verify:baseline` also
passed for the 38-file commit, and the mock's unit test (4/4) passed for its
commit. **Not pushed. Not deployed.** **SUPERSEDED 2026-10-01 — pushed and
verified;** still not deployed. See "Push verification — 2026-10-01".

### Final pre-commit verification — VERIFIED, this working tree

- `npm run check` — **PASS** (exit 0):
  - `verify:baseline` 13/13;
  - `verify:privacy` 8/8;
  - lint with 0 errors and 17 pre-existing warnings;
  - unit tests **13/13 files, 163/163 tests**;
  - production build PASS, with 8/8 static pages and 10 routes.
- M2 E2E, run once on a fresh Playwright server:
  - `e2e/dashboard-api.spec.ts` 9/9, with every `/api/documents` request
    intercepted;
  - `e2e/document-detail.spec.ts` 4/4, where the code path makes no API
    request;
  - total **13/13**.
- M5 E2E (unchanged from the M5 gate): F1 6/6, F2 3/3, F3 3/3.
- No live request reached the real routes, n8n or any external service during
  these final runs.

### Open items resolved

- **`CONTRACT.md` `file_link` examples — RESOLVED by `8ec4fc5`.** Only the host
  changed, from Google Drive to `example.com`. The path and the rest of each line
  are unchanged. The earlier open item is marked below.
- **`process-document-mock.ts` unused and untracked — RESOLVED by `639c5fd`**,
  kept as a historical test fixture. Only its own test imports it.

### Still open

1. Root `SPEC.md` and `CONTRACT.md` name the product "Intent Gate — Smart
   Document Review", while the active product decision is **Smart Office
   Document Assistant**.
2. The dashboard defaults to mock data in this tree. The live Workflow B mode
   exists separately. **RESOLVED 2026-10-01 by M6-D** — the dashboard loads
   live data on mount, with no mock mode.
3. The `CLAUDE.md` "Current milestone" section still describes the 2026-09-16
   state.
4. The work is not pushed and not deployed. **SUPERSEDED 2026-10-01 — pushed
   and verified;** still not deployed.
5. M6 has not started and needs Avinoam's approval. **SUPERSEDED 2026-10-01 —
   M6 started (ACTIVE, not complete).**

### Operational note — local only

- `src.zip` is protected by the repository-root `/src.zip` rule in
  `.gitignore`, committed in `8ec4fc5`.
- Automatic Git gc is disabled **for this local clone only** (`gc.auto=0` in
  `.git/config`). The first checkpoint commit set off an automatic attempt to
  prune four incomplete historical worktree metadata records. The attempt failed
  on permissions and removed nothing. The setting stops that attempt from
  recurring.
- This configuration is not committed and does not travel with the repository.
  A manual `git gc` or `git worktree prune` would still try to remove those
  records, so neither should be run without a decision.

---

## M5 acceptance gate — PASS, 2026-09-30

Documentation record. This section supersedes the statements further down that
M4 has "not started" and that the real F1 send to `/process-document` "belongs to
M5 and is still open". Those statements are retained as written.

### The criterion, verbatim

`SPEC.md` §16 line 262, the only M5 row: work — "Build upload screen, processing
state, result view (F1–F3) against real Workflow A"; done when — "A browser
submission produces a row, an email, and an on-screen result".

### M4, recorded forward

No M4 gate record existed in this file. As reported by Avinoam: **M4 VERIFIED
PASS**. Workflow A was tested through both the High and the Normal branch and
published as "M4 Verified — High & Normal E2E — 2026-09-30". Read-only evidence
from this session: the exported published backup (kept outside Git) has exactly
two `Respond to Webhook` nodes, one per `IF` branch. Both return HTTP 200 with a
body whose keys and types match `processDocumentResponseSchema`. Do not reopen
Part 1, M4/Workflow A, or the direct High/Normal webhook tests unless a new,
identified failure appears.

### Implementation — VERIFIED FROM CODE

- `src/components/document-upload-form.tsx` sends a same-origin
  `POST /api/process-document` instead of calling the local mock. The mock
  imports, the mock notice and the mock acknowledgment were removed.
- The existing server route (`src/app/api/process-document/route.ts`) validates
  the request and proxies it to Workflow A through `submitDocument()`. Neither
  file was changed for M5.
- `N8N_BASE_URL`, `N8N_PROCESS_PATH` and `N8N_SECRET` are read only by the
  server-only `src/lib/env.ts`. There is no `NEXT_PUBLIC_` variable, and the
  client form imports nothing that reads the environment. The browser receives
  no n8n secret and no webhook URL.
- A latest-request guard (`CONTRACT.md` §9) lets only the current submission
  update the screen. A 95,000 ms browser timeout sits just above the route's
  90,000 ms upstream timeout.
- The route's sanitized error message is shown as an alert. A non-JSON reply, an
  unexpected shape, a network failure and a timeout each get a fixed Hebrew
  message. No upstream content is shown.
- `/upload/no-deadline` now renders the same live form. The mock `variant` prop
  is gone. `src/lib/process-document-mock.ts` and its unit test still exist but
  are no longer used by the UI or the E2E specs. Their removal needs a separate
  decision. **RESOLVED 2026-09-30:** kept as a historical test fixture in
  commit `639c5fd`.

### Product shell — VERIFIED FROM CODE

- The active product identity is **Smart Office Document Assistant**: the
  header, the subtitle ("קליטת מסמכים, חילוץ מידע, תיעדוף ומעקב במקום אחד"),
  the browser title and description, and the footer.
- The Intent Gate / therapist-meeting / consciousness-mapping identity was
  removed from the active header, subtitle, navigation, metadata and footer. The
  prototype notice no longer mentions WhatsApp.
- Active navigation is exactly: `/` → `לוח מסמכים`, `/upload` → `העלאת מסמך`.
- `/sessions/new` and `/sessions/demo` remain in the code, unlinked. The old
  constants they use remain in `src/lib/project.ts`.
- Files changed for the shell: `src/lib/project.ts`, `src/app/layout.tsx`,
  `src/components/prototype-notice.tsx`, `src/lib/project.test.ts`,
  `e2e/home.spec.ts`.

### Automated verification — VERIFIED, run in this working tree, 2026-09-30

- `node .\node_modules\typescript\bin\tsc --noEmit` — PASS (exit 0), both after
  the M5 edits and after the shell edits.
- `npm run lint` — PASS (exit 0). No finding in any M5 or shell file. The 17
  warnings are pre-existing and unrelated (unused variables in older test files
  and `n8n-client.ts`).
- Upload E2E, with `/api/process-document` intercepted by the test and every
  other `/api/` request aborted and asserted empty. No request reached the real
  route or n8n.
  - `e2e/upload-f1.spec.ts` — 6/6 PASS.
  - `e2e/upload-f2.spec.ts` — 3/3 PASS. A held response confirmed the
    processing state. POST counts were 1 for a normal send, 1 for two clicks in
    one tick, and 2 for a resend.
  - `e2e/upload-f3.spec.ts` — 3/3 PASS, on the single authorized rerun (see the
    incident below).
- `npm run test:unit -- src/lib/project.test.ts` — 13/13 PASS.
- `e2e/home.spec.ts` — 5/5 PASS, against the running dev server for this
  folder. It checks the exact title, the subtitle, exactly two nav links, the
  absence of the stale labels, the footer, and `lang="he"`/`dir="rtl"`.
- `npm run build` — PASS (exit 0). All 10 routes compiled and 8 static pages
  were generated. Telemetry was disabled for the run. No tracked or source file
  changed apart from the regenerated, git-ignored `next-env.d.ts`.

### Controlled live acceptance test — USER-REPORTED, 2026-09-30

Performed by Avinoam through the application UI. It was not observed from this
session, and no output of it is stored in this repository.

- Exactly one synthetic Normal document was submitted:
  `M5_APP_LIVE_NORMAL_20260930_1906.txt`. It was created for the test and is
  kept outside the repository.
- The application showed a complete result: `document_id` = `21`,
  `document_type` = `other`, `urgency` = `Low`, `department` = `General`,
  `notification_sent` = `true`.
- Gmail: exactly one Normal notification received.
- Google Sheets: exactly one matching row. Its `document_id`, `urgency`,
  `department` and `file_link` were correct.
- Google Drive: the matching source file opened.
- No duplicate submission and no duplicate row.

### Environment — VERIFIED by classification only

No environment value was displayed or recorded.

- Before the test, the effective URL the application built pointed at the Test
  webhook. With Avinoam's authorization, one routing segment in `.env.local` was
  changed from `webhook-test` to `webhook`. The `N8N_SECRET` line was byte-for-byte
  unchanged.
- The effective URL, recomputed with the exact `src/lib/n8n-url.ts` logic,
  classified as `PRODUCTION_WEBHOOK_EFFECTIVE_URL`. HTTPS, origin composition,
  duplicate segment, query/fragment and public exposure all passed.
- The string `webhook-test` still appears elsewhere in `.env.local`, outside the
  three M5 keys. The M5 route does not read it.

### Incident — transient local dev-cache/runtime 404, not an application failure

- The first F3 run returned local Next.js 404 pages for `/upload` and
  `/upload/no-deadline` before any test assertion ran. F1 and F2 had loaded
  `/upload` normally earlier the same day.
- A read-only diagnosis found valid route files, route manifests that listed
  both routes, and no code, config or spec change between F2 and F3. The dev
  trace showed the server resolving the pages to its not-found page. The exact
  Next.js/Turbopack mechanism remains **UNKNOWN**.
- The old dev state was preserved by renaming `.next\dev` to
  `.next\dev.f3-404-2026-09-30`. Nothing was deleted, and the folder is
  git-ignored.
- A fresh `.next\dev` was generated, and the single authorized F3 rerun passed
  3/3.

### Cleanup — VERIFIED

The dev server was stopped, ports 3000 and 3001 were verified free, and no
Next.js process for this project remains.

### Governance verification — VERIFIED, 2026-09-30

Run after the M5 closure record, in this working tree. No repository file
changed.

- `npm run verify:baseline` — **PASS** (exit 0). 13/13 checks passed.
  Verdict: "BASELINE VERIFIED".
- `npm run verify:privacy` — **PASS** (exit 0). 8/8 checks passed on 57 tracked
  files. Verdict: "NO PRIVATE VALUES IN TRACKED FILES".
- **Coverage limit, closed.** The official privacy script scans tracked files
  only, so the six untracked M5 files were checked separately:
  - `src/components/document-upload-form.tsx`
  - `src/app/upload/page.tsx`
  - `src/app/upload/no-deadline/page.tsx`
  - `e2e/upload-f1.spec.ts`, `e2e/upload-f2.spec.ts`, `e2e/upload-f3.spec.ts`

  The scan applied the official rules (forbidden-value hash match, Google
  Drive/Docs hosts, Gmail literals) plus checks for email addresses, URLs outside
  an allowlist, webhook paths and identifiers, n8n and Google hosts, secret,
  token and Authorization values, key shapes, personal identifiers, phone
  numbers, and long identifier shapes. **All six passed.** The only links are
  the synthetic `example.test` links in the three E2E files. No private value,
  secret, real URL, webhook identifier or personal identifier was found. Final
  marker: `M5_UNTRACKED_PRIVACY_CHECK_PASS`.

### Verdict

- "A browser submission produces a row, an email, and an on-screen result" —
  **PASS**. The row and the email are user-reported. The on-screen result is
  user-reported for the live run and verified with intercepted transport by the
  F1–F3 specs.
- **M5 is complete.** Per `CLAUDE.md`, work stops here for human review. M6 does
  not start without Avinoam's approval.

### Not claimed

- No Git commit, push, deployment or publication of the application.
- ~~`npm run verify:baseline` and `verify:privacy` were **not** run for this
  milestone, although `CLAUDE.md` requires `verify:baseline` before and after
  any milestone that can affect repository files.~~ **RESOLVED 2026-09-30:**
  both were run and passed, and the untracked M5 files passed a targeted
  privacy scan. See "Governance verification" above. `verify:baseline` ran
  after the M5 changes, not before them.
- The full `test:unit` suite, `e2e/dashboard-api.spec.ts` and
  `e2e/document-detail.spec.ts` were not re-run.
- The High branch was not exercised through the application UI. It is covered
  by the reported M4 test.

### Open items from M5

1. **OPEN — documentation governance.** Root `CONTRACT.md` and `SPEC.md` still
   name the product "Intent Gate — Smart Document Review". That conflicts with
   the later explicit project decision that the active submission is **Smart
   Office Document Assistant**, which the shell now shows. Neither file was
   edited. The inconsistency needs a separate, authorized decision.
2. **Dashboard data source.** In this working tree, `/` defaults to the labelled
   mock data. The live Workflow B/API mode exists as a separate, switchable mode
   inside the dashboard (`documents-dashboard.tsx`). M3's live check was made in
   the isolated copy. M3 is not reopened by this note.
3. ~~The unused `process-document-mock.ts` and its unit test (see
   Implementation).~~ **RESOLVED 2026-09-30** by commit `639c5fd`, kept as a
   historical test fixture.
4. The `/sessions/*` pages and their old constants remain in the code, unlinked.
5. The `CLAUDE.md` "Current milestone" section (a protected path) still
   describes the 2026-09-16 state. It was not edited.
6. The isolated copy's product-alignment slice (M3 open item 2) is now
   superseded in part by this working tree's own shell correction. That slice
   was not ported.

---

## M3 acceptance gate — PASS, 2026-09-28

Documentation only. This section supersedes the "M3 has **not** started"
statements further down, which are retained as written.

### The criterion, verbatim

`SPEC.md` §16 line 260, the only M3 row: work — "Connect dashboard to real
Workflow B; add search/filters (F4, F5)"; done when — "Real rows appear;
filters work".

### Evidence level: USER-REPORTED MANUAL UI CHECK

Reported by Avinoam from the 2026-09-28 live application check. It is a manual
observation in the browser, not an automated test run, and no stored output of
it exists.

- Dashboard API mode loaded **2 real document rows** from the active sheet.
- Filtering urgency to `High` displayed **exactly 1 row**, matching the active
  sheet's 1 `High` row.

### Verdict

- **"Real rows appear" — PASS** (user-reported, above).
- **"filters work" — PASS for the urgency filter** (user-reported, above). The
  other filters and free-text search were **not** reported in live mode. Their
  behaviour over API rows is covered only by the intercepted-response test in
  `e2e/dashboard-api.spec.ts` ("search and filters still work over api rows"),
  which does not reach n8n.

**M3 is complete at the evidence level stated.** Per `CLAUDE.md`, work stops here
for human review; M4 does not start without Avinoam's approval.

### VERIFIED in the isolated copy during the M3 diagnosis (2026-09-27/28)

All of this is in `%TEMP%\intent-gate-mock-verify` (a local copy outside the repository), not
in this working tree. Values of environment variables, URLs, headers and
document data were never displayed.

- Port 3000 was served by that copy's `next dev`, identified from its process
  command line, at each check before a request.
- The copy's `N8N_BASE_URL` carried an extra path segment, so the constructed
  path was not `/webhook/documents`. The key was corrected in that copy's
  `.env.local` only; a check with the real `buildN8nUrl` then returned the exact
  path `/webhook/documents`. `N8N_DOCUMENTS_PATH` and `N8N_SECRET` were unchanged
  by that edit.
- Single application GETs to `/api/documents`, in order:
  1. 401 `unauthorized`, twice, with upstream status 403 logged.
  2. After the secret in `.env.local` was corrected and the server restarted:
     502 `malformed`, schema failure, 110 issues.
  3. After Workflow B's Edit Fields change was published: 502 `malformed`,
     36 issues across 20 affected rows. All 20 had an empty `document_id`.
     `document_type`, `urgency` and `department` each had 4 values outside
     their `CONTRACT.md` §2 enums; none was empty or a case/whitespace variant.
     `received_at` had 4 values failing the ISO prefix.
- No application GET was made from this session after the rows were removed; the
  pass rests on the user-reported check above.

### USER-REPORTED — external operations, not repeated or verified here

- The `.env.local` secret correction and the Workflow B Edit Fields change
  (above).
- The full original sheet was backed up; then, with Avinoam's authorization, 20
  historical rows were removed. The active sheet now has 2 data rows.
  `CONTRACT.md` defines no rule for removing rows; this was Avinoam's decision.
- **The live Part 1 workflow's `Document ID` mapping is already verified.** No
  evidence of that check is stored in this repository. The tracked
  `n8n/baseline/part1-baseline.json` has no `Document ID` column mapping, as
  expected for a snapshot that predates the `CONTRACT.md` §10 change.

### Working assumptions

- The copy that served the 2026-09-28 manual UI check was the isolated copy. It
  served port 3000 at every process check in this session, but the UI check
  itself was not independently tied to a process.
- The dashboard and `/api/documents` code in this working tree match the
  isolated copy apart from the changes listed under open items. They were
  byte-identical on 2026-09-27; this tree was not re-compared.

### Open items from M3

1. **Temporary diagnostics in the isolated copy.** `src/lib/documents-client.ts`
   there carries temporary `console.warn` lines (upstream 401/403 status and an
   aggregate `malformed_reason` line). They must be removed and must not be
   carried into this working tree.
2. **Isolated-copy changes not in this working tree:** a product-alignment slice
   (identity, navigation, footer and notice wording; legacy meeting screens moved
   to `legacy/intent-gate/`; `tsconfig.json` and `eslint.config.mjs` exclusions;
   matching test updates) and one sentence on `/upload`. Whether to port them
   is undecided.
3. **Evidence of the live Part 1 `Document ID` mapping** is user-reported only.
   Its ID format (with or without an `exec-` prefix, `CONTRACT.md` §1 vs. the
   §3.2/§4 examples) is not recorded here.
4. `verify:baseline` was **not** run before or after this milestone, because this
   prompt excluded running commands. `CLAUDE.md` requires it for milestones that
   can affect repository files.
5. The `CLAUDE.md` "Current milestone" section (a protected path) still describes
   the 2026-09-16 state. It was not edited.

---

## Source alignment — 2026-09-27

Documentation-only alignment of this file and `PROMPTS.md` to the current
sources. Nothing was implemented, committed, or run. Environment files and
secrets were not read.

**Authority order in force** (`CLAUDE.md`, Authoritative Course Recovery
Directive, 2026-09-22): instructor requirements in
the local course-requirements folder (outside the repository) → root `CONTRACT.md` and root
`SPEC.md` (directive 1) → this file for operational state. `docs/SPEC.md`
remains dated historical material and does not drive implementation.

### Active milestone — `SPEC.md` §16 M3 · **ACTIVE**; M2 closed 2026-09-27

**M2 passed its acceptance gate on 2026-09-27** — see "M2 acceptance gate" below
for the criterion-by-criterion evidence. The next milestone is the one `SPEC.md`
§16 defines after it, in its own words:

> **M3** — work: "Connect dashboard to real Workflow B; add search/filters (F4,
> F5)"; done when: "Real rows appear; filters work".

M3 has **not** started. Its live Workflow B connection remains open, and the
dashboard's default data source is still the labelled mock set. Nothing in the
M2 close claims any live n8n connection.

The M2 record below is retained as written.

### M2 — `SPEC.md` §16 M2 · **COMPLETE 2026-09-27**

`SPEC.md` §16 holds the ordered milestone table (M0–M7) for this submission.
Its M2 row reads, in the source's own words: work — "Scaffold app screens
(Upload, Dashboard, Detail) against a mock API matching `CONTRACT.md`"; done
when — "Screens render mock data with no network calls".

**Approved by Avinoam, 2026-09-27: `SPEC.md` §16 M2 is the active milestone,
and the `SPEC.md` §16 numbering is the scheme in force.** No other milestone is
restated, renumbered, or reassessed here; the older `docs/MILESTONES.md`
numbering is retained below as history. *(M2 was `ACTIVE` and not complete when
this paragraph was written; it closed later the same day — see the gate record.)*

**M2 progress — 2026-09-27**

- **Done in this slice:** an M2 **scaffold** of the F1 upload screen at
  `/upload`, working against a local mock with no network call. It is a
  scaffold, not F1 compliance — see the reconciliation bullet below.
  One document at a time, name and size shown,
  and the two rules from the sources enforced in the browser before anything is
  sent — accepted types PDF/DOCX/TXT (instructor §7 F1, `CONTRACT.md` §6) and
  the 10 MB maximum (`CONTRACT.md` §6, a local pre-request check with no
  `error_code`).
- **Send target:** `submitDocumentToMock` in `src/lib/process-document-mock.ts`,
  a local fixture validated against the `CONTRACT.md` §3.2 schema. The screen
  does not call `/api/process-document`, n8n, Google Sheets, or Gmail. The real
  Workflow A connection is `SPEC.md` §16 M5.
- **Status of the F1 send requirement — OPEN.** Instructor F1 says the screen
  "sends it to `/process-document`", while `SPEC.md` §16 M2's done-when is
  "Screens render mock data with no network calls". What is on record: M2 was
  approved as the active milestone, and the current F1 task was defined as a
  scaffold against a local mock with no network. The present implementation is
  therefore an M2 scaffold. Meeting F1's requirement to send to
  `/process-document` remains **open** and belongs to the connection stage
  (`SPEC.md` §16 M5). No ruling on the tension between the two requirements is
  recorded here, and none is attributed to anyone.
- **F2 slice, same screen (2026-09-27):** while the mock is pending the screen
  states "מעבד את המסמך…" in words plus a non-essential pulse, names the
  possible wait of up to a minute, and locks the Send button, the Clear button
  and the file input; `aria-busy` is set on Send for the duration. Two clicks
  dispatched in the same tick reach the mock once — the visible guard is the
  disabled button, and the reliable one is a ref, because two handlers in one
  tick both run before React re-renders. No "ignore superseded responses" branch
  exists, since single-flight means there is never a superseded response here;
  the real client at M5 must implement that rule (`CONTRACT.md` §9).
  `submitDocumentToMockDelayed` adds a local 1,200 ms wait so the state has a
  duration — a deliberate local delay, not n8n latency and not the 90,000 ms
  contract timeout.
- **F2 follow-up fix (2026-09-27):** the submission counter that this slice first
  put on the screen was removed. The screen now carries no counter and no other
  diagnostic display. The "at most one submission" assertion moved into
  `e2e/upload-f2.spec.ts`, which counts the mock's own 1,200 ms timer from the
  test side through an init script that delegates to the real `setTimeout`. No
  application code exists for the test's benefit, and the mock's behaviour was
  not changed by the fix.
- **Not claimed for F2:** nothing was written to or read from Google Sheets, so
  the instructor's "exactly one row" check is **not** verified. What is verified
  is the mock-mode equivalent: at most one submission reaches the mock.
- **F3 slice, same screen (2026-09-27):** after a successful mock submission the
  screen renders a result card with all seven fields in `CONTRACT.md` §2 order,
  the file link, and a coloured urgency badge that also carries its text label.
  The rows come from the new pure module `src/lib/result-view.ts`, which passes
  every value through unmodified — no substitution, no default, no translation,
  no dropped field. The Hebrew on the card is labels only; each label also
  carries the contract's own field name. An absence arrives as the contract's own
  wording (`"Not found"`, `"No action found"`) and is displayed as that text, so
  a document with no deadline still produces a complete card. Supporting values
  from §3.2 are shown separately: `file_name`, `received_at` (fixed UTC display,
  never converted), `document_id`, and `notification_sent`. The result is cleared
  when a new file is chosen or a new send starts, so a card never outlives the
  file that produced it.
- **F3 honesty limits:** the card shows one of the mock's fixed fixtures, not an
  extraction of the chosen file, and the acknowledgment text says so. The
  instructor's F3 check names "the Part 1 complaint document with no deadline";
  no real document was processed and nothing was extracted, because the
  application is not allowed to derive fields from a file.
- **F3 no-deadline case — now verified in the browser (2026-09-27).** The mock
  gained a second, explicitly typed fixture: a complaint whose `deadline` is
  `"Not found"` and whose `requested_action` is `"No action found"`, the exact
  `CONTRACT.md` §2 absence wording, with `sender_or_company` left as a real value
  so the card shows a mixture rather than a wall of absences. Every value is a
  legal §2 value and is validated against the §3.2 schema like the default one.
  The default fixture and the default behaviour are unchanged: the variant is an
  optional argument whose default selects the original fixture.
  `/upload/no-deadline` is a clearly labelled demo route that selects it, and it
  is deliberately **not** in the main navigation. **Cleanup obligation:** the
  variant, the demo route and the second fixture are removed together with the
  mock when the real Workflow A connection lands (M5).
- **F6 slice — Detail screen (2026-09-27):** `/documents/[document_id]` renders
  one mock record with **all twelve `CONTRACT.md` §4 fields** in contract order,
  each label carrying its own contract field name; `urgency` as a coloured badge
  with its text label, `file_link` as a link, `received_at` in fixed UTC. Values
  pass through unchanged, absence markers included. The row title in the existing
  dashboard is now the link into this screen — the only change made to the
  dashboard. An unknown id renders a named not-found state that echoes the
  requested id, with no field or review section on the page. The route path is an
  **[DECISION]**: the sources name the screen ("Detail", instructor §9.2
  `DocumentDetail`) and the API endpoints, but no application route.
- **F6 review action is local and labelled:** "סימון כנבדק" sets the status shown
  on that screen to `Reviewed` — the only value it ever targets, never back to
  `Processed` (`CONTRACT.md` §2) — with an optional note capped at 200 characters
  (`CONTRACT.md` §5.1). A notice states before the action, and the confirmation
  repeats after it, that nothing is saved: not to Google Sheets, not to the
  dashboard, not across a reload, and that no request was sent. When no note is
  given the screen says so rather than inventing one.
- **Not claimed for F6:** the second half of the requirement — "Sending the
  update through /review and reflecting the new status in the list", and its check
  "The Status cell in the Google Sheet changes after pressing the button" — is
  **not** built and not implied. That is `SPEC.md` §16 M6 (Workflow C). Also open:
  `CONTRACT.md` §5.1 requires `reviewed_by`, and the application still has no
  source of reviewer identity; that must be resolved when the real review call is
  built.
- **Carried past M2, by `SPEC.md` §16's own split:** the real F1 send to
  `/process-document` is M5 work, and the real review call is M6 work. Neither is
  an M2 criterion, and neither is done. The dashboard's own F4/F5 behaviour was
  not otherwise changed, and its live Workflow B connection is M3.

**RESOLVED 2026-09-27 — milestone numbering collision.** Two different M0–M7
schemes were in use:

- `SPEC.md` §16 — M2 = scaffold screens against a mock; M3 = connect the
  dashboard to real Workflow B; M4 = build Workflow A.
- `docs/MILESTONES.md`, `PROMPTS.md`, and the `CLAUDE.md` "Current milestone"
  section — M2 = Prompt 3 (data contracts and proxy routes, complete);
  M3 = Prompt 4 (real n8n workflows, not started, separate approval required).

The identifier "M2" therefore denoted two different things depending on the
document. Avinoam's approval of 2026-09-27 settles it: the `SPEC.md` §16
numbering is in force, and the older scheme stays as history only.

### F1 slice verification — VERIFIED, 2026-09-27

Both runs were executed **only in the isolated copy** at
`%TEMP%\intent-gate-mock-verify` (a local copy outside the repository), into which only the
changed files were copied. Nothing was run in this working tree.

- `npx vitest run src/lib/upload-file-rules.test.ts src/lib/process-document-mock.test.ts`
  — PASS: 2 test files, 11 tests. Covers the accepted-type rule, the empty
  reported type, the exact 10 MB boundary and one byte over it, the check order,
  the size formatting, the mock's conformance to the `CONTRACT.md` §3.2 schema,
  and that the mock issues no `fetch`.
- `npx playwright test e2e/upload-f1.spec.ts` — PASS: 4 tests. Covers the
  mock-only notice and the empty state, a valid file showing name and size and a
  send that reaches the local mock, an unsupported type refused before sending,
  and an oversized file refused before sending. Each test also asserts that the
  screen issued **no** request to any `/api/` route.
- First attempt at the Playwright spec failed 3 of 4 on my own selector, not on
  the screen: Next.js renders a `role="alert"` route announcer outside `main`,
  so an unscoped `getByRole('alert')` matched two elements. The spec now scopes
  both live regions to `main`, the same scoping `e2e/home.spec.ts` already needs
  for `role="note"`. Recorded because the first result was a real failure.
- NOT VERIFIED for this slice: `verify:baseline`, `verify:privacy`, `lint`,
  `build`, and the full `test:unit` suite. None was run, in either location.

### F2 slice verification — VERIFIED, 2026-09-27

One focused run, **only in the isolated copy** at
`%TEMP%\intent-gate-mock-verify` (a local copy outside the repository), into which only the
three changed files were copied. Nothing was run in this working tree.

- `npx playwright test e2e/upload-f2.spec.ts` — **PASS**, 3 tests:
  1. the processing state is visible while the mock is pending, and Send, Clear
     and the file input are all disabled until it ends, with `aria-busy` on Send
     turning from `true` back to `false`;
  2. two clicks dispatched in the same tick reach the mock **once** (submission
     count 1, one processing cycle, still 1 after it closed);
  3. a second send after the first finished is counted as a second submission —
     so the guard blocks a double click without freezing the screen.
  Each test also asserts the screen issued **no** request to any `/api/` route.
- **Not proven:** the instructor's F2 check as written ("Double-clicking Send
  creates exactly one row in the spreadsheet"). No spreadsheet was involved. The
  mock-mode equivalent — at most one submission reaching the mock — is what
  passed.
- NOT VERIFIED for this slice: `verify:baseline`, `verify:privacy`, `lint`,
  `build`, and the full `test:unit` suite. None was run, in either location.

### Re-verification after the F2 follow-up fix — VERIFIED, 2026-09-27

Two runs in the isolated copy, after copying only the two changed files
(`src/components/document-upload-form.tsx`, `e2e/upload-f2.spec.ts`). Nothing
was run in this working tree.

- `npx playwright test e2e/upload-f1.spec.ts e2e/upload-f2.spec.ts` — **PASS**,
  7 tests (4 F1 + 3 F2). This closes the earlier gap: `upload-f1.spec.ts` had
  not been re-run after F2 touched shared code, and it now passes against the
  current screen.
- `npx vitest run src/lib/process-document-mock.test.ts` — **PASS**, 4 tests.
  Run because `process-document-mock.ts` had been changed by the F2 slice
  without its focused unit test being re-run.
- The F2 spec's first assertion is that the timer count is `0` before any send,
  which is also what shows that nothing else in the page schedules a 1,200 ms
  timer and that the count is therefore a faithful proxy for mock submissions.
- Still NOT VERIFIED: `verify:baseline`, `verify:privacy`, `lint`, `build`, and
  the full `test:unit` suite. None was run.

### F3 slice verification — VERIFIED, 2026-09-27

Two runs in the isolated copy, after copying only the six changed files. All
build and test artifacts stayed inside that folder; nothing was run in this
working tree.

- `npx vitest run src/lib/result-view.test.ts src/lib/process-document-mock.test.ts`
  — **PASS**, 2 files, 14 tests. The result-view tests cover: all seven fields
  present in contract order; every value passed through unchanged; only `urgency`
  marked as the badge; every label carrying its contract field name and no value
  containing Hebrew; and, for a complaint fixture with `deadline: "Not found"`,
  `requested_action: "No action found"` and `sender_or_company: "Not found"` —
  still seven fields, no empty value, the absence wording shown as the value, and
  the urgency badge still produced. Also: three distinct urgency badge classes,
  and the UTC formatter neither shifting a date nor replacing an unparseable
  value.
- `npx playwright test e2e/upload-f1.spec.ts e2e/upload-f2.spec.ts e2e/upload-f3.spec.ts`
  — **PASS**, 9 tests (4 F1 + 3 F2 + 2 F3). The F3 tests assert the card shows
  all seven contract field names and all seven returned values, a badge carrying
  the text `High` with its colour class, a file link that is present and has an
  href (without asserting the address), and that the card disappears when a new
  file is chosen. F1 and F2 were re-run because this slice changed code they
  exercise; both still pass.
- Every F3 test also asserts the screen issued **no** request to any `/api/`
  route.
- **Correction cycle:** the first F3 run failed 1 of 9 on my own selector, not on
  the screen — the badge's LTR wrapper means two nested spans contain the text,
  so an unscoped span filter matched two elements. The spec now targets the outer
  badge span. Recorded because the first result was a real failure.
- **Test change to record:** `e2e/upload-f1.spec.ts` previously asserted that no
  extracted field was rendered, which encoded the old slice boundary. That one
  assertion was removed, since the result card is now expected; nothing else in
  the F1 spec changed.
- Still NOT VERIFIED: `verify:baseline`, `verify:privacy`, `lint`, `build`, and
  the full `test:unit` suite. None was run.

### F3 no-deadline browser check — VERIFIED, 2026-09-27

- `npx playwright test e2e/upload-f3.spec.ts` — **PASS**, 3 tests, run in the
  isolated copy after copying only the four changed files. All artifacts stayed
  in that folder; nothing was run in this working tree.
- The new test navigates to the labelled demo route, uploads and submits a
  supported file, then asserts inside the region named `תוצאת העיבוד`: the card
  is visible; each of the seven contract fields appears exactly once; the missing
  deadline reads `Not found` and `requested_action` reads `No action found`; the
  fields that do have values still show them; the urgency badge is present with
  its text label `Low` and its colour class; and the file link is present with an
  href, without asserting the address. It also asserts **no** `/api/` request.
- Field locators are scoped to that region and matched through each row's
  contract field name, so a nested LTR span cannot double-match.
- No semantic change was needed: the card was already an accessible region
  (`<section aria-labelledby>` plus its heading), which the existing F3 locator
  already relied on.
- This closes the gap recorded above, where the no-deadline case was covered only
  at the pure-logic level. The unit-level coverage remains and still passes as of
  its own run.
- Still NOT VERIFIED: `verify:baseline`, `verify:privacy`, `lint`, `build`, and
  the full `test:unit` suite. None was run. `upload-f1.spec.ts` and
  `upload-f2.spec.ts` were not re-run in that step, although the mock module and
  the upload component changed — closed by the regression check below.

### F1/F2 regression check after the F3 slice — VERIFIED, 2026-09-27

Follow-up to Prompt 5E, run because that slice changed the shared upload form and
the shared mock module. No code and no test was edited for it.

- Before running, the isolated copy was confirmed to already hold the current
  files: `process-document-mock.ts`, `document-upload-form.tsx`, `result-view.ts`,
  both upload pages and both specs were byte-identical to this working tree, so
  nothing needed copying.
- `npx playwright test e2e/upload-f1.spec.ts e2e/upload-f2.spec.ts` — **PASS**,
  7 tests (4 F1 + 3 F2), 20.1s, run in the isolated folder with all artifacts
  kept there. Nothing was run in this working tree.
- F1's four tests still pass: the mock-only notice and empty state, a valid file
  showing name and size with a send that reaches the local mock, an unsupported
  type refused before sending, and an oversized file refused before sending.
- F2's three tests still pass: the processing state with Send, Clear and the file
  input disabled, two clicks in one tick reaching the mock once, and a second send
  after the first finished counted as a second submission.
- F3 was **not** re-run in this step, by instruction; its own 3/3 result stands
  from the run recorded above.
- Still NOT VERIFIED: `verify:baseline`, `verify:privacy`, `lint`, `build`, and
  the full `test:unit` suite. None was run.
- **M2 and F1 remain open.**

### M2 acceptance gate — PASS, 2026-09-27

Assessed against the exact `SPEC.md` §16 M2 row (line 259), which is the only
place M2 appears in `SPEC.md`. No test, build, lint or external service was run
for this gate; it reads existing evidence only.

**Interpretation of "no network calls", stated so it is not silently assumed:**
it means no request to the application's own API routes. Framework traffic that
every Next screen makes — route/RSC payloads, chunk loads, dev HMR — is not an
application data call, and the same reading was used for every earlier slice,
where "no `/api/` request" was the asserted form.

**Criterion 1 — work:** "Scaffold app screens (Upload, Dashboard, Detail)
against a mock API matching `CONTRACT.md`" — **PASS**.

- Upload: the F1 scaffold, F2 processing state and F3 result view, all against
  `process-document-mock.ts`, whose every response is validated against the
  `CONTRACT.md` §3.2 schema before it reaches the screen, with §2 enum values and
  §2 absence wording.
- Dashboard: renders `documents-mock.ts`, which mirrors the §4 row shape and §2
  enums. `e2e/home.spec.ts` PASS 4/4, recorded in the F6 run.
- Detail: all twelve §4 fields in contract order; unit 9/9 and detail spec 4/4
  PASS, recorded in the F6 run.

**Criterion 2 — done when:** "Screens render mock data with no network calls" —
**PASS**.

- Upload: F1 4/4, F2 3/3, F3 3/3, every test asserting no `/api/` request.
- Detail: 4/4, every test asserting no `/api/` request.
- Dashboard: covered by `e2e/dashboard-api.spec.ts`'s first test, "the default
  dashboard stays on labelled mock data and issues no api request", which
  intercepts and counts every `**/api/documents` request, navigates to `/`, and
  asserts 22 labelled mock rows, the mock notice, and a request count of zero.
  That test ran and passed in the isolated copy on 2026-09-24 at 16:53 as part of
  the 13-test run reconciled above.

**Evidence level for the dashboard half, stated exactly:** the assertion was
verified against the component as it stood on 2026-09-24, and has **not** been
re-run since the F6 slice wrapped the row title in a link. It is treated as
applying to the current screen for three reasons that are checkable without
running anything: the default source is still `useState<DashboardSource>('mock')`
(`documents-dashboard.tsx:183`); the component's only `fetch` is still the one
inside `loadFromApi` (`:193`), reachable solely from the three buttons and never
on mount; and the F6 change was presentational inside a card, which cannot
introduce a data request. `e2e/home.spec.ts` passing 4/4 after F6 independently
confirms the other half of the same test's subject — 22 mock rows and the mock
notice on the default view. This is an inference over unchanged code paths, not a
fresh run, and it is recorded as such.

**Not counted against this gate**, because `SPEC.md` §16 does not put them in the
M2 row: the real F1 send to `/process-document` (M5), the real `POST /review`
with its Sheet write and list reflection (M6), and `verify:baseline`,
`verify:privacy`, `lint` and `build`, which §16 never names as M2 exit criteria.

**Verdict: both M2 criteria satisfied. M2 is complete.** The next milestone is
M3 as §16 words it; its live Workflow B connection is open and unstarted.

### F6 detail-screen verification — VERIFIED, 2026-09-27

Two runs in the isolated copy, after copying only the six changed files. All
artifacts stayed in that folder; nothing was run in this working tree.

- `npx vitest run src/lib/document-detail-view.test.ts` — **PASS**, 9 tests: all
  twelve fields in §4 order; every value unchanged except the UTC display of
  `received_at`; absence markers kept as their contract wording; `urgency` marked
  as the badge and `file_link` as a link; every label carrying its contract field
  name with no Hebrew inside any value; lookup by id and `null` for an unknown id;
  the 200-character note boundary; and the review target being `Reviewed` only,
  never `Processed`.
- `npx playwright test e2e/document-detail.spec.ts e2e/home.spec.ts` — **PASS**,
  8 tests (4 detail + 4 dashboard). The dashboard spec was included because this
  slice changed `documents-dashboard.tsx`; all four of its tests still pass.
- The four detail tests cover: opening a document by clicking its dashboard row
  title and seeing all twelve fields with the opened row's values, the badge, the
  file link and the unsaved-review notice; marking as reviewed **with** a note,
  where the confirmation states it applies to this screen only and that no
  request was sent, the status field changes to `Reviewed` and the button becomes
  disabled; marking as reviewed **without** a note, where the screen says no note
  was recorded; and an unknown id showing the named not-found state with no field
  or review section. Every test asserts **no** `/api/` request.
- All locators are scoped to the named regions `פרטי המסמך` and `בדיקה אנושית`,
  and field rows are matched by their contract field name.
- Both runs passed on the first attempt; no correction cycle.
- Still NOT VERIFIED: `verify:baseline`, `verify:privacy`, `lint`, `build`, and
  the full `test:unit` suite. The upload specs (F1/F2/F3) were not re-run, and did
  not need to be: this slice changed no file they exercise.
- **M2 and F1 remain open.**

### Evidence ledger

**VERIFIED — inspected directly, read-only, 2026-09-27**

- Uncommitted Smart Office work exists in the working tree: 11 modified
  tracked files (`.env.example`, `CONTRACT.md`, `e2e/home.spec.ts`, both
  `src/app/api/documents` files, both `src/app/api/process-document` files,
  `src/app/page.tsx`, `src/lib/env.ts`, `src/lib/n8n-client.ts`,
  `src/lib/project.test.ts`) and 11 untracked paths (`e2e/dashboard-api.spec.ts`,
  `src.zip`, `src/components/documents-dashboard.tsx`, `src/lib/documents-client.ts`,
  `src/lib/documents-contract.ts`, `src/lib/documents-mock.ts`,
  `src/lib/documents-view.ts`, `src/lib/documents-view.test.ts`,
  `src/lib/n8n-url.ts`, `src/lib/process-document-client.ts`,
  `src/lib/process-document-contract.ts`). None of it is committed.
- **An isolated copy exists** at
  `%TEMP%\intent-gate-mock-verify` (a local copy outside the repository). An earlier report
  in this project recorded it as unavailable on the basis of
  `git worktree list` alone; that was not a directory-existence check and the
  conclusion was wrong. Corrected here and forward only — the earlier record
  is not rewritten.
- **The inspected code files are identical.** 34 files under `src/` and `e2e/`
  are byte-identical between the project and the isolated copy, as are 10
  configuration files (`package.json`, `package-lock.json`, `tsconfig.json`,
  `next.config.ts`, `next-env.d.ts`, `playwright.config.ts`,
  `vitest.config.mts`, `postcss.config.mjs`, `eslint.config.mjs`,
  `AGENTS.md`). Comparison was by content hash, with a line-ending fallback
  check. Environment files were excluded and not read.
- **The source and state documents are absent from the isolated copy.** It has
  no root `CONTRACT.md`, no root `SPEC.md`, no `docs/`, no `PROMPTS.md`, no
  `scripts/`, and no `n8n/`. Its `CLAUDE.md` is an 11-byte pointer file, not
  this project's operating controls. It holds one file the project does not:
  `verify-documents-gate.mjs`.
- **The isolated copy holds a passing-run marker only.**
  `test-results/.last-run.json` there records `"status": "passed"` with an
  empty `failedTests` array, timestamped 2026-09-24 16:53:03. The marker
  proves that a run passed with no failed tests; it carries no test names and
  no count.
- The two Playwright spec files in the isolated copy declare 13 `test(` blocks
  (4 in `home.spec.ts`, 9 in `dashboard-api.spec.ts`) and are byte-identical
  to the project's.
- This project's own `test-results/.last-run.json` records a **failed** run at
  2026-09-24 13:32:26, while `e2e/home.spec.ts` was last modified at
  13:54:12 — after that run. That stored failure therefore belongs to an
  earlier version of the spec, not to the current file content.

**REPORTED — claimed earlier, not proven by any stored output**

- "Playwright 13/13 passed" in the isolated copy. No Playwright report, JUnit
  file, HTML report, or stdout log exists in either location, so the count 13
  comes from counting declarations in the spec files, not from a run record.
  Recorded as `REPORTED`, not verified.
- **Reconciled 2026-09-27 (M2 gate).** The two figures line up exactly and are
  corroborated: `e2e/dashboard-api.spec.ts` declares 9 `test(` blocks and
  `e2e/home.spec.ts` declares 4, which is the reported 13, and the stored marker
  records `"status": "passed"` with an empty `failedTests` array. So that run
  **did** execute `dashboard-api.spec.ts` and it passed; what stays `REPORTED`
  is only the per-file breakdown, since no run record lists names or counts. An
  earlier note in this session that the spec had "never been run" was wrong and
  is corrected here.

**UNKNOWN — cannot be verified from what exists**

- Which test names the passing isolated run actually executed.
- Whether that run covered `POST /api/process-document`. No UI or e2e caller
  for that route exists; both spec files address the dashboard and
  `/api/documents`. Coverage of that endpoint is therefore unproven.
- Whether the isolated run used a mock or a real n8n path. That depends on the
  isolated copy's environment file, which was deliberately not read.
- `verify:baseline`, `verify:privacy`, `lint`, `test:unit`, and `build` for the
  current working tree. No stored output exists for any of them, and none was
  run for this documentation update.

### Open items

1. **Unapproved change to `CONTRACT.md` example values — OPEN.** Two lines in
   the working tree differ from the published approved version (`ee0adad`):
   `CONTRACT.md:112` (§3.2) and `CONTRACT.md:164` (§4), both the example value
   of the `file_link` field. Field names, types, HTTP statuses, error codes,
   the seven business field names, enum values, and JSON structure are
   unchanged, and no code depends on the value. Working assumption for the
   cause: `scripts/verify-privacy.mjs` rejects the original literal host in any
   tracked file and permits a neutral example domain. **This update does not
   change it.** It awaits Avinoam's decision — keep it with a forward-recorded
   correction, or revert it.
   **RESOLVED 2026-09-30 by commit `8ec4fc5`**, kept as a forward-recorded
   sanitization. Only the host changed, from Google Drive to `example.com`.
   Reverting it would make `verify:privacy` fail.
2. The uncommitted working-tree work above has no verification output and is
   not committed. **SUPERSEDED 2026-09-30:** verified and committed locally.
   See "Local checkpoint commits — 2026-09-30".
3. `SPEC.md` §13 and §14: both plugins (`code-review`, `context7`) and both
   project skills (Contract-Drift Guard, Business-Logic Leak Detector) remain
   planned only, with no evidence of use or creation. **SUPERSEDED 2026-10-01
   for the Skills only:** both Skills are created, not yet used. See "M6 project
   Skills — created, 2026-10-01". Both Plugins remain planned only.

---

## Approved product identity

**SUPERSEDED for this submission (2026-09-22)** by the `CLAUDE.md`
Authoritative Course Recovery Directive, directives 4–6: the product is
**Intent Gate — Smart Document Review**, an application wrapper around the
Smart Office Document Assistant, over office documents and the seven Part 1
business fields (`document_type`, `sender_or_company`, `summary`,
`requested_action`, `deadline`, `urgency`, `department`). The
consciousness-mapping purpose, the three epistemic layers, and
`declared_intentions` below are explicitly superseded by directive 6 and
`SPEC.md` §15, and must not drive implementation. The original text is
retained unchanged as history, per directive 7.

> *[Omitted from this public copy: the superseded product identity (consciousness-mapping purpose and subtitle) (7 lines). The full record is kept in the private project repository. See `PUBLIC_COPY_NOTES.md`.]*

- Course: Workflow AI Agent, Part 2.

## Current milestone

**Read the "Source alignment — 2026-09-27" section above first.** The record in
this section is retained as history and remains accurate for the work it
describes (Prompts 1–3, the old M-numbering). It is not the designation of an
active milestone for the current sources: as of 2026-09-27 no milestone is
designated `ACTIVE`, and the M-numbering here is the `docs/MILESTONES.md`
scheme, not the `SPEC.md` §16 scheme.

**M1 complete (2026-09-06). Prompt 2A complete (2026-09-07). Prompt 2A-R1
complete (2026-09-07). Prompt 2B — Verified GitHub publication documentation
sync completed (2026-09-08)** — verified GitHub publication documentation
synchronization.

**M2 / Prompt 3 — implementation, local verification, commit, and
publication complete; milestone closed (as of 2026-09-16).** The data
contracts (zod, mirroring `docs/DATA_CONTRACT_DRAFT.md` plus the approved
narrow `INVALID_REVIEW_REQUEST` amendment), the server-only n8n client
wrapper, the layer-preserving response mapper, the three Next.js proxy route
handlers, and their Vitest tests against a **mocked** n8n client exist in the
working tree. VERIFIED: `verify:baseline` PASS (exit 0); `verify:privacy`
PASS (exit 0, 43 tracked files scanned); `lint` PASS (exit 0, 0 errors, 17
non-blocking warnings, unresolved by scope decision); `test:unit` PASS
(exit 0, 8 test files, 126 tests); `build` PASS (exit 0, TypeScript clean,
6/6 static pages); `check` PASS (exit 0). Five ESLint errors and 14
TypeScript build errors were corrected across three test files plus one
production route file during this verification cycle (see `PROMPTS.md` →
Prompt 3 for the exact grouped corrections). Mocked tests are not, and do not
prove, real n8n integration. Prompt 3 was **committed and published** to
`origin/main` at commit `6ccf0236d63330c41f4d12722be48a593da010dd`; it is
recorded as complete and closed.

**Next milestone: M3 / Prompt 4 (real n8n workflows and live n8n
integration).** It has not started and requires separate human authorization
to begin.

### Prompt 2A-R1 progress

- **Diagnosis (verified):** the Prompt 2A archive
  (`artifacts/intent-gate-m1-secure-checkpoint.zip`, commit `40560bf`) shipped
  the sanitized baseline with **CRLF** line endings (byte SHA-256
  `36fdcddce…d79a8a`), not the LF hash `5e049657…d516a` in the manifest. The
  committed blob was correct LF at every Git layer; `git archive` emitted the
  checked-out form and, with `core.autocrlf=true` and no `.gitattributes`, that
  was CRLF. Difference is 100% CRLF↔LF (582 line endings; 582-byte size delta).
- **Repair:** added repository-root `.gitattributes` with
  `n8n/baseline/part1-baseline.json text eol=lf`; renormalized + re-staged that
  one file (blob content unchanged, `5e049657…d516a`); manifest hash **not**
  changed or weakened; regression tests added to `scripts/verifiers.test.mjs`.
- **Validation run:** `verify:baseline`, `verify:privacy`, staged-blob privacy
  scan, and `test:unit` (22 tests) all PASS.
- New repair commit `fix: stabilize baseline line endings for checkpoints` and a
  new non-overwriting archive `intent-gate-m1-secure-checkpoint-r1.zip` are
  produced and then re-verified after extraction; results are recorded in
  `artifacts/AUDIT-RECEIPT-r1.md` (git-ignored). Nothing about archive
  validation is asserted here before it actually runs.

### Checkpoint acceptance rule (added by R1)

A checkpoint archive is **not** accepted until, after extraction to a throwaway
directory: (1) the extracted `n8n/baseline/part1-baseline.json` SHA-256 equals
`BASELINE_MANIFEST.json`; (2) its `verify:baseline` passes; (3) the archive
contains no `.git/`, `node_modules/`, `.next/`, `private/`, `artifacts/`,
`test-results/`, or `.env*`; (4) `verify:privacy` passes against a *disposable,
audit-only* Git index created inside the extracted copy (never committed, no
remote). Build the archive with `git archive` and always validate the extracted
bytes — do not trust the working tree or the commit blob alone, because
line-ending conversion happens at export.

## Completed work

- **Prompt 1** — planning & documentation (6 docs). COMPLETE.
- **Prompt 1A** — human-review amendment (GitHub claim, Part 1 relationship,
  two superseded design corrections, demo-data boundary).
  COMPLETE.
- **Prompt 1B** — Part 1 baseline verification (read-only). COMPLETE.
  Result: `VERDICT: MATCHES APPROVED PART 1 BASELINE`.
- **Prompt 2 / M1** — baseline canonicalized + protected; verify-baseline
  script; Next.js 16 Hebrew-first RTL shell with 3 placeholder pages;
  env plumbing; Vitest + Playwright; SPEC v1; docs updated. COMPLETE.
- **Prompt 2A** — raw Part 1 export preserved privately at
  `private/baseline/part1-baseline.raw.json` (git-ignored); the tracked
  `n8n/baseline/part1-baseline.json` replaced with a **sanitized** artifact
  (structure + expressions preserved, all private/account-specific values
  replaced with synthetic placeholders); manifest + verifiers split into
  baseline vs privacy checks; local Git identity configured; first local commit
  `chore: secure M1 baseline and checkpoint` (`40560bf`); archive built with
  `git archive`. No remote, no push. COMPLETE — but the archive later failed a
  byte-level integrity check (CRLF); see Prompt 2A-R1.
- **Prompt 2A-R1** — checkpoint repair: `.gitattributes` pins the sanitized
  baseline to `eol=lf`; regression tests added; repair commit
  `fix: stabilize baseline line endings for checkpoints`; re-verified archive
  `intent-gate-m1-secure-checkpoint-r1.zip`. Manifest hash unchanged. No remote,
  no push. COMPLETE.

## Verified baseline (facts)

Two artifacts (see `n8n/baseline/README.md` and `BASELINE_MANIFEST.json`):

- **Raw private** — `private/baseline/part1-baseline.raw.json`
  - SHA-256: [raw-baseline hash removed from public copy]
  - git-ignored (`/private/`), never committed or pushed; hash kept as provenance.
  - Verified only when present locally; its absence must not fail a clean
    checkout or CI.
- **Sanitized tracked** — `n8n/baseline/part1-baseline.json`
  - SHA-256: `5e049657f234db7fb72ede215e47e5a5b6b4de1864649d5ebf114faa2b4d516a`
  - tracked; always verified.
  - Preserved: workflow name, workflow id `OjXIBXA0HzK1ztN7`, versionId
    `af0cf5fb-df83-4f5e-9586-d39fb57155bb`, `active: true`, 11 nodes,
    9 connection source nodes, empty `pinData`, node types / positions /
    connections / routing, and the dynamic expressions Download file
    `={{ $json.id }}` and Information Extractor `={{ $json.data }}`.
  - Redacted → synthetic placeholders: credential ids, credential display names,
    personal email, Drive folder ids, spreadsheet id, Gmail `webhookId`,
    n8n `meta.instanceId`, Google URLs.
- Guarded by `npm run verify:baseline` (structure + both hashes) and
  `npm run verify:privacy` (no raw value in any tracked file — hash-based, never
  prints a value).

## Completed decisions

- App = upgrade-by-derivation of, and application wrapper around, the Part 1 n8n
  automation. Part 1 export is an immutable baseline/submission artifact.
- Stack: Next.js 16 (App Router, Turbopack, `src/`), React 19, TypeScript,
  Tailwind v4, ESLint 9 flat config, import alias `@/*`.
- Hebrew-first, `<html lang="he" dir="rtl">`, local font stack
  `Heebo, Rubik, Arial, sans-serif` — no external/runtime font downloads.
- Tests: Vitest (unit/contract), Playwright (Chromium only, critical E2E).
> *[Omitted from this public copy: two superseded design decisions (AI_DRAFT lifecycle, IntentSeal Lite history) (7 lines). The full record is kept in the private project repository. See `PUBLIC_COPY_NOTES.md`.]*

- Synthetic / anonymized data only. Production safeguards out of scope.
- GitHub CLI publication is verified on the private project repository
  (not publicly accessible), branch `main`,
  HEAD `62d30e04e1e720076d1760b61166de27f27d8fb6`, and the published tree
  contains the approved `.env.example` only. No private/, artifacts/,
  node_modules/, test-results/, `.next/`, runtime environment files,
  secret/key-style paths, or the raw baseline were published.
- GitHub plugin use is still pending and must not be falsely claimed.
- The existing IntentSeal repository was not accessed or modified.
- Local Git identity is set **for this repo only** (`--local`): name
  `Avinoam Golan`, GitHub noreply email. No `--global` change.

## Unresolved dependencies

- n8n base URL, webhook paths, auth token, storage identity — not provided.
- Data-contract open questions (see `docs/DATA_CONTRACT_DRAFT.md` §4).
- GitHub integration not yet installed, connected, or verified.
- Synthetic fixture set not yet created (needed from M2/M4).
- Added 2026-09-27: the unapproved `CONTRACT.md` example-value change is still
  open — see "Source alignment — 2026-09-27" above. The active-milestone
  designation and the M-numbering collision were settled the same day
  (`SPEC.md` §16 M2 is `ACTIVE`; the §16 numbering is in force).
  **RESOLVED 2026-09-30:** the example-value change was committed as a
  sanitization in `8ec4fc5`.

## Next milestone

**As of 2026-09-30: M5 passed** — see "M5 acceptance gate — PASS, 2026-09-30"
above. M4 is reported VERIFIED PASS (2026-09-30), recorded forward in the same
section. The next milestone is `SPEC.md` §16 **M6**, in its own words — work:
"Build Workflow C and the review action (F6); finish error/empty states (F7);
confirm config/secrets (F8)"; done when: "All eight features pass their checks".
It has not started and needs Avinoam's approval. The M2–M5 work is committed
locally on `main` (see "Local checkpoint commits — 2026-09-30"); it is not
pushed and not deployed. The paragraphs below are retained as history; their M4
"has not started" statement is superseded.

**As of 2026-09-28: M3 passed** (USER-REPORTED MANUAL UI CHECK — see "M3
acceptance gate — PASS, 2026-09-28" above). The next milestone is `SPEC.md` §16
M4 — work: "Build Workflow A (duplicated chain, §11), `Respond to Webhook` on
both `IF` branches; add `Document ID` to both Part 1 and Workflow A mappings";
done when: "curl returns extracted fields and a row appears in the sheet". It has
not started and needs Avinoam's approval. The Part 1 half of its `Document ID`
item is reported as already live. The paragraphs below are retained as history.

**As of 2026-09-27 the active milestone is `SPEC.md` §16 M3, not started.** M2 was
approved as active that day and closed the same day after passing its acceptance
gate — see "Source alignment — 2026-09-27" above, and the gate record for the
criterion-by-criterion evidence. §16 words M3 as: work — "Connect dashboard to
real Workflow B; add search/filters (F4, F5)"; done when — "Real rows appear;
filters work". The paragraph below is retained as the 2026-09-16 record in the
older `docs/MILESTONES.md` numbering and is not the current designation.

**Next milestone: M3 / Prompt 4 (real n8n workflows), pending separate human
authorization.** Prompt 3 implementation, local verification, commit, and
publication are complete (contracts, n8n client wrapper, response mapper,
three proxy routes, and mocked tests all pass `npm run check`; published to
`origin/main` at commit `6ccf0236d63330c41f4d12722be48a593da010dd`).
Prompt 3 is closed.

## Do NOT rebuild

- Part 1 Google Drive workflow / the baseline artifacts (raw private +
  sanitized tracked).
- Prompt 1, Prompt 1A, Prompt 1B, Prompt 2, Prompt 2A, Prompt 2A-R1 outputs.
- The M1 scaffold, shell pages, env plumbing, or test setup.
- The six planning documents (amend, don't recreate).
- The privacy / baseline verifiers and manifest split.
- The `.gitattributes` `eol=lf` pin on the sanitized baseline.
