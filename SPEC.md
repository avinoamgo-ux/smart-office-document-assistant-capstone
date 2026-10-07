# SPEC.md — Intent Gate — Smart Document Review

Status: APPROVED ROOT SPEC v1.0 — implementation pending.

This file is the **authoritative implementation specification** for this
project, superseding `docs/SPEC.md` wherever the two differ. `docs/SPEC.md`
is left untouched as dated historical material describing an earlier,
superseded contract; it is not deleted or edited here, and is not to be
followed for implementation.

Every requirement below is tagged by source so written requirements,
the verbal addendum, and engineering decisions are never mixed silently:

- **[INSTRUCTOR]** — stated in `01-Smart_Office_Assistant_Part2_Application_Layer.docx`
  or `01-Practical_No_Code_n8n_Project_With_Diagram.docx`, in the local
  course-requirements folder (outside the repository).
  Highest authority.
- **[ADDENDUM]** — Avinoam's confirmed verbal instruction (two relevant
  plugins; two dedicated project skills). Binding, but not present in
  either written document.
- **[DECISION]** — an approved engineering decision filling a gap the
  instructor documents leave open, or exercising an option the instructor
  documents explicitly permit.

**Source consistency check:** no unresolved contradiction was found between
the three source tiers beyond the one already resolved in `CONTRACT.md`
(the Sheet `Status` value set, reconciled as `Processed` / `Needs Review` /
`Reviewed`). If a future source reveals a genuine conflict, it must be
reported here rather than resolved silently.

---

## 1. Product and purpose

**[INSTRUCTOR]** Product: **Intent Gate — Smart Document Review**. Purpose:
an application wrapper around the already-working "Smart Office Document
Assistant" n8n automation (Part 1) — an employee sends a document, watches
it processed, reads the extracted result, and marks it reviewed. All
business logic stays in n8n; the application only collects input, calls
n8n, and presents what n8n returns.

## 2. Relationship to Part 1

**[INSTRUCTOR]** Part 1 (the Drive-triggered document-intake workflow,
already built and hash-verified against the submitted ZIP) **remains
operational and unmodified in its business logic**. Part 2 does not
rebuild it. See §11 for the one approved additive change to its Sheet
mapping.

## 3. Architecture

**[INSTRUCTOR]** Three-layer separation:
- **Application (Next.js)** — presentation only: file input, processing
  state, result/dashboard/detail views, review action UI, error/empty
  states, secure configuration. Holds no Google credentials, makes no AI
  call, makes no business decision.
- **n8n** — owns all business logic: extraction, AI field generation,
  urgency decision, Sheet writes, notifications, file moves, review-state
  writes.
- **[DECISION]** Stack: Next.js + TypeScript (App Router), already
  scaffolded in this repository. The instructor doc's default
  recommendation is React + Vite; Next.js is explicitly listed as an
  accepted alternative ("server routes and a front end in one project").
  This is a permitted choice, not a deviation.

**[INSTRUCTOR]** Storage: **one shared Google Sheet** ("Document Processing
Log"). Both the Drive-trigger path and every Part 2 endpoint read and
write the same sheet — there is no separate Part 2 range, sheet, or
database.

## 4. Endpoints

**[INSTRUCTOR]** Three n8n webhooks, each proxied by one Next.js
browser-facing route. Exact request/response JSON, field names, enum
values, HTTP statuses, and error codes are defined in the approved root
`CONTRACT.md` and are not restated here — `CONTRACT.md` governs.

| Browser route | n8n webhook |
|---|---|
| `POST /api/process-document` | `POST /webhook/process-document` |
| `GET /api/documents` | `GET /webhook/documents` |
| `POST /api/review` | `POST /webhook/review` |

## 5. Eight mandatory application features (F1–F8)

**[INSTRUCTOR]** A submission missing any of these is incomplete regardless
of polish:

| # | Feature | Core requirement |
|---|---|---|
| F1 | Upload screen | Choose/drag one PDF/DOCX/TXT file; reject unsupported/oversized before sending |
| F2 | Processing state | Unmistakable in-progress state; Send disabled during the request |
| F3 | Result view | All 7 extracted fields + file link + urgency badge; "Not found"/"No action found" shown honestly |
| F4 | Dashboard | Lists every processed document from `GET /documents`, newest first, with Refresh |
| F5 | Search and filters | Free-text over file name/sender/summary; filters for urgency, document type, department, status |
| F6 | Detail + human review | Full field view; "Mark as reviewed" with optional note, via `POST /review` |
| F7 | Error and empty states | Every failure becomes a sentence a non-technical employee can act on |
| F8 | Configuration and secrets | Webhook URLs and shared secret from environment variables only |

## 6. File rules and limits

**[INSTRUCTOR]** Accepted formats: PDF, DOCX, TXT only.
**[DECISION, per approved `CONTRACT.md` §1/§6]** Maximum upload size:
**10 MB**, enforced client-side before any request is sent (not an API
error). Request timeout: **90,000 ms**.

## 7. Security and secret-handling rules

**[INSTRUCTOR]** Every n8n webhook requires header authentication
(`x-api-key`, shared secret). The secret is read from a server-only
environment variable and attached only inside the Next.js route handler —
never sent to, stored in, or readable from the browser. A committed
`.env.example` holds variable names and placeholder values only; the real
`.env` is git-ignored. Searching the repository for the secret must return
nothing. **[DECISION, per `CONTRACT.md` §7]** The proxy normalizes any
upstream `401`/`403` authentication failure to a single `401 UNAUTHORIZED`
toward the browser, without exposing upstream details.

## 8. Three Sheet additions

**[INSTRUCTOR]** Two new columns are required by the instructor doc;
**[DECISION, per `CONTRACT.md` §10]** they are implemented as **three
separate columns**:

- `Document ID`
- `Reviewed By`
- `Review Note`

## 9. Ten required functional tests

**[INSTRUCTOR]**, Part 2 doc §11, verbatim in substance:

1. Happy path — invoice due tomorrow: result on screen, row added to sheet, urgent email sent, badge shows High.
2. Normal document — internal report: the IF node's false branch still returns a response; no timeout.
3. Missing information — complaint with no deadline: "Not found" displayed as text; no invented date.
4. Unsupported file — a `.png` or `.xlsx`: rejected in the application before any request is sent.
5. Large document: completes within the agreed timeout, or fails with a clear message — never an endless spinner.
6. Double submission: pressing Send twice quickly produces exactly one spreadsheet row.
7. n8n unavailable: with the workflow deactivated, the application shows a readable error and stays usable.
8. Wrong secret: a corrupted secret in `.env` reports a configuration problem, not a crash.
9. Review action: "Mark as reviewed" updates Status, Reviewed By, and Review Note in the sheet; the dashboard reflects it after refresh.
10. Both entry points: a file dropped in the Drive folder (Part 1) and a file sent from the application both appear in the same dashboard.

## 10. Required submission deliverables

**[INSTRUCTOR]**, Part 2 doc §12:

1. Git repository — application source, `.env.example`, `.gitignore`, `SPEC.md`, `CONTRACT.md`, `PROMPTS.md`, `README.md`.
2. `README.md` — what the project does, architecture diagram, setup steps, the one command that runs it, and a "Known limitations" section.
3. n8n workflow exports — JSON export of all three workflows (and the sub-workflow, if used), credentials removed.
4. Demo recording — 3–5 minutes: send a document, show the result, show the sheet and the email, filter the dashboard, mark as reviewed, and show one failure being handled.
5. `PROMPTS.md` — at least eight prompts that mattered, each with what came back and what had to be corrected.
6. Screenshots — upload screen, result view, dashboard with filters applied, detail view, one error state, and the updated spreadsheet.
7. Reflection (one page) — what the application adds that n8n alone could not; what still requires a human; what would break first at scale; what would be built differently next time (must include the duplication maintenance-cost note — see §11).

## 11. Approved implementation decision — Part 1 chain duplication

**[DECISION]** The instructor doc's *recommended* approach is to move the
shared processing steps into one sub-workflow, called from both the Drive
trigger and the new webhook via an `Execute Sub-workflow` node. The
instructor doc explicitly permits an alternative: **[INSTRUCTOR]**
"Duplicating the nodes into a second workflow is acceptable, but students
must then explain the maintenance cost in their reflection."

This project adopts the duplication alternative: Workflow A
(`POST /webhook/process-document`) contains its own copy of the extraction,
AI-field-generation, Sheet-append, urgency-`IF`, and notification steps,
rather than refactoring Part 1 into a shared sub-workflow.

**Maintenance cost (must also appear in the §10 reflection deliverable):**
any future change to the extracted fields, the AI extraction instructions,
the urgency rule, the notification templates, or the Sheet column mapping
must be applied **twice** — once in Part 1's workflow, once in Workflow A —
with a real risk of the two drifting out of sync if only one copy is
updated. Part 1 itself receives no change beyond the minimal `Document ID`
addition to its Sheet-append mapping (§8), applied only after a backup/export
of the current Part 1 workflow.

## 12. Hebrew/RTL presentation

**[INSTRUCTOR]** Hebrew/RTL is listed only under the instructor doc's
*optional extensions* ("Right-to-left and Hebrew interface support
alongside English") — it is not a core requirement. **[DECISION]** The
existing Hebrew-first RTL shell may remain, but **must not delay or
displace any of F1–F8**. If a scheduling conflict arises, F1–F8 take
priority and the Hebrew/RTL work is deferred.

## 13. Planned plugins (addendum)

**[ADDENDUM]** Avinoam's verbal instruction requires demonstrating two
relevant plugins. **[DECISION]** The two chosen are below. Neither has
been used yet on this project — both are planned only.

1. **`code-review`** — PLANNED, NOT YET USED. *(Status corrected forward
   2026-10-03: **USED** on PR #1. See the status note at the end of this
   section.)*
   - Relevance: matches the instructor doc's explicit §9.6 "Review Before
     Accepting" requirement and the 15-point "Claude Code process" rubric
     area.
   - Evidence path: a saved `/code-review` report, referenced from
     `PROMPTS.md`, run before the final submission commit.
2. **`context7`** — PLANNED, NOT YET USED. *(Status corrected forward
   2026-10-03: **USED**. See the status note at the end of this section.)*
   - Relevance: live documentation lookup while generating Next.js/n8n
     integration code, reducing invented APIs — supports the "Explain or
     delete" rule (§9.6).
   - Evidence path: a note in `PROMPTS.md` at any point a `context7`
     lookup materially changed a prompt or an implementation decision.

Availability was last confirmed connected/working in this session's tool
context; this is not a claim that either plugin has been invoked for this
project.

**Status note, 2026-10-03 (factual, not a change to the requirement):**
- **`context7`:** used. Local Claude Code session transcripts record 10 calls
  on 2026-10-01 while Workflow C was being planned (1 `resolve-library-id`, 9
  `query-docs` against the n8n documentation). That session's report says the
  lookup corrected the plan: Workflow C must not use "Append or Update Row". A
  follow-up round left five node-behaviour questions unresolved. The evidence
  note is in `PROMPTS.md` (Prompt 5S) and `docs/PROJECT_STATE.md`.
- **`code-review`:** still **not used**. No report exists yet. *(Superseded
  later on 2026-10-03: `/code-review:code-review 1` ran on PR #1 at commit
  `ee666997e4ee1d3dc90eb8d7074dd09767933e2b` and posted "No issues found". The
  saved report, referenced from `PROMPTS.md` (Prompt 5X), is
  `docs/CODE_REVIEW_PR1.md`. The requirement above is unchanged.)*

## 14. Planned project skills (addendum)

**[ADDENDUM]** Avinoam's verbal instruction requires two dedicated project
skills whose practical need and solved problem can be explained and
evidenced. **[DECISION]** Neither skill has been created yet — both are
planned only.

*(Status corrected forward 2026-10-03: both Skills were **created** on
2026-10-01 as `.claude/skills/contract-drift-guard/` and
`.claude/skills/business-logic-leak-detector/`. Their PASS runs are recorded in
`PROMPTS.md` (Prompts 5M–5Q) and `docs/PROJECT_STATE.md`. The requirements
below are unchanged.)*

1. **Contract-Drift Guard** — PLANNED, NOT YET CREATED.
   - Problem: the instructor doc names field-mismatch between the contract
     and the real n8n response as "the single most common cause of lost
     time" (§5) and repeats it in the Pitfalls table ("Rows appear but
     fields are blank").
   - Use point: before switching each endpoint from mock to real (§9.3,
     one at a time), and once before final submission.
   - Evidence: the diff/PASS output saved into `PROMPTS.md` or a dedicated
     check file.
2. **Business-Logic Leak Detector** — PLANNED, NOT YET CREATED.
   - Problem: the instructor doc's defining rule ("the application must
     not re-implement any business logic") and its named up-to-20-point
     deduction for AI/urgency/Google logic inside the app.
   - Use point: before each commit, and mandatorily before final
     submission.
   - Evidence: the pass/fail output committed or referenced in `PROMPTS.md`.

## 15. Explicit exclusions

**[INSTRUCTOR + DECISION]** This project excludes, everywhere:

- consciousness mapping, epistemic layers, or `declared_intentions`
- `IntentSealLite` or any IntentSeal-named metadata
- the superseded `AI_DRAFT → NEEDS_REVIEW → APPROVED | REVISED | REJECTED` lifecycle token set
- `202 Accepted` + polling — every response is synchronous
- `multipart/form-data` transport to n8n — base64-in-JSON only (per `CONTRACT.md`)
- a separate n8n Data Table, or any storage other than the one shared Google Sheet
- any business logic (AI calls, urgency decisions, direct Google API calls) inside the application

The official Sheet value `"Needs Review"` is preserved — only the
superseded lifecycle's `NEEDS_REVIEW` token is excluded, not the real
Status value (see `CONTRACT.md` §12).

## 16. Ordered milestones

**[DECISION]**, informed by the instructor doc's suggested build order
(§10, non-mandatory) and adapted to this project's approved contract:

| Milestone | Work | Done when |
|---|---|---|
| M0 | Lock `CONTRACT.md` and this `SPEC.md`; confirm Part 1 backup/export | Both files approved; Part 1 export preserved |
| M1 | Build Workflow B (`GET /documents`), test with curl | curl returns a real JSON array from the shared sheet |
| M2 | Scaffold app screens (Upload, Dashboard, Detail) against a mock API matching `CONTRACT.md` | Screens render mock data with no network calls |
| M3 | Connect dashboard to real Workflow B; add search/filters (F4, F5) | Real rows appear; filters work |
| M4 | Build Workflow A (duplicated chain, §11), `Respond to Webhook` on both `IF` branches; add `Document ID` to both Part 1 and Workflow A mappings | curl returns extracted fields and a row appears in the sheet |
| M5 | Build upload screen, processing state, result view (F1–F3) against real Workflow A | A browser submission produces a row, an email, and an on-screen result |
| M6 | Build Workflow C and the review action (F6); finish error/empty states (F7); confirm config/secrets (F8) | All eight features pass their checks |
| M7 | Run the ten required tests (§9); capture screenshots and demo recording; finalize README/CONTRACT/SPEC/PROMPTS; write the reflection (incl. §11 maintenance-cost note) | All ten tests recorded; all deliverables (§10) complete |

## 17. Acceptance criteria

**[INSTRUCTOR]**, Part 2 doc §11.1, Minimum Success Criteria:

- All three webhook endpoints work from outside n8n and are protected by a secret.
- At least five documents processed through the application, visible in the dashboard.
- At least one urgent and one normal document, both answered without a timeout.
- At least one document marked as reviewed, with the change visible in Google Sheets.
- The Part 1 Google Drive trigger still works.
- No secret and no credential anywhere in the Git repository.
- No AI prompt, urgency rule, or Google API call inside the application code.
