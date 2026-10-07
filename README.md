# Smart Office Document Assistant

A web application that lets office staff use an existing n8n document
automation without ever opening n8n. It covers uploading a document, seeing
what was extracted, browsing every processed document, and marking a document
as reviewed by a person.

Final project, Part 2 (application layer), Workflow AI Agent course. The
interface is Hebrew-first and right-to-left.

> **Historical note.** This repository began under an earlier project scope
> that was **superseded on 2026-09-22** and is not part of this submission.
> The early design documents for that scope are not included in this public
> copy; see [`PUBLIC_COPY_NOTES.md`](PUBLIC_COPY_NOTES.md). The authoritative
> sources are the root [`CONTRACT.md`](CONTRACT.md) and [`SPEC.md`](SPEC.md).

---

## What it does

Part 1 of the project is an n8n workflow. A file dropped into a Google Drive
folder is downloaded, its text is extracted, an AI step fills seven business
fields, a row is appended to a Google Sheet, and an urgent or normal Gmail
notification is sent.

This application adds a second way in and a way to work with the results:

| Feature | What the user gets |
|---|---|
| F1 Upload | Choose or drag one PDF, DOCX or TXT file. Unsupported or oversized files are refused before anything is sent. |
| F2 Processing state | A clear in-progress state; Send is disabled until the request ends. |
| F3 Result view | All seven fields, the file link and an urgency badge. "Not found" and "No action found" are shown as written. |
| F4 Dashboard | Every processed document from the shared Sheet, newest first, with Refresh. |
| F5 Search and filters | Free text over file name, sender and summary; filters for urgency, document type, department and status. |
| F6 Detail and review | All fields for one document, plus "Mark as reviewed" with a required reviewer name and an optional note of up to 200 characters. |
| F7 Error and empty states | Every failure is shown as a plain sentence, never as a raw status code or stack trace. |
| F8 Configuration and secrets | Webhook paths and the shared secret come from server-side environment variables only. |

The seven business fields are `document_type`, `sender_or_company`, `summary`,
`requested_action`, `deadline`, `urgency` and `department`. Their exact
values are defined in [`CONTRACT.md`](CONTRACT.md) §2.

**The application keeps no database of its own.** The Google Sheet "Document
Processing Log" is the single source of truth for every screen. This is
intentional.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│ 1. Browser — Next.js UI (Hebrew, RTL)                        │
│    Upload · Dashboard · Detail/Review                        │
│    Calls only same-origin /api/* routes. Holds no secret.    │
└───────────────────────────────┬──────────────────────────────┘
                                │ JSON
┌───────────────────────────────▼──────────────────────────────┐
│ 2. Next.js route handlers (server only)                      │
│    /api/process-document · /api/documents · /api/review      │
│    Validate the shape, add the x-api-key header, enforce the │
│    90 s timeout, return sanitized errors. No business logic. │
└───────────────────────────────┬──────────────────────────────┘
                                │ HTTPS + x-api-key
┌───────────────────────────────▼──────────────────────────────┐
│ 3. n8n — all business logic                                  │
│    Workflow A  POST /webhook/process-document                │
│    Workflow B  GET  /webhook/documents                       │
│    Workflow C  POST /webhook/review                          │
│    Part 1      Google Drive trigger (unchanged entry point)  │
│         └──► one Google Sheet · Gmail · Google Drive · AI    │
└──────────────────────────────────────────────────────────────┘
```

- The application never calls an AI model, never decides urgency or any
  other business field, and never calls Google APIs directly
  ([`CONTRACT.md`](CONTRACT.md) §8).
- Workflow A duplicates the Part 1 processing chain instead of sharing a
  sub-workflow. See "Known limitations" and [`SPEC.md`](SPEC.md) §11.
- The request and response shapes for all three endpoints are fixed in
  [`CONTRACT.md`](CONTRACT.md).

---

## Setup

Requirements: Node.js 20.9 or later (required by Next.js 16), npm, and a running n8n instance with
Workflows A, B and C active and connected to the shared Google Sheet.

```bash
# clone this repository with the address shown on its GitHub page, then:
cd <repository-folder>
npm install
cp .env.example .env.local
```

### n8n workflows

The three Part 2 workflows are exported in [`n8n/exports/`](n8n/exports/):

| File | Workflow | Webhook |
|---|---|---|
| `workflow-a.json` | A — Process Document | `POST /webhook/process-document` |
| `workflow-b.json` | B — Documents API | `GET /webhook/documents` |
| `workflow-c.json` | C — Review Update | `POST /webhook/review` |

The exports are redacted. They will import, but they won't run until you
configure them again:

- **Credentials are removed.** Attach your own Google Sheets, Google Drive,
  Gmail and OpenAI credentials to the nodes that need them. Each Webhook node
  also needs a Header Auth credential whose header is `x-api-key` and whose
  value is your shared secret.
- **Private IDs are replaced by example values** that follow the Part 1
  baseline ([`n8n/baseline/README.md`](n8n/baseline/README.md)):
  `EXAMPLE_SPREADSHEET_ID`, `EXAMPLE_PROCESSED_DRIVE_FOLDER_ID`,
  `EXAMPLE_APP_UPLOAD_DRIVE_FOLDER_ID`, `EXAMPLE_WEBHOOK_ID`,
  `EXAMPLE_INSTANCE_ID`, `example.user@example.com` and `https://example.com/`
  links. Point them at your own Sheet, Drive folders and notification address.
- Webhook paths, node logic and expressions are unchanged.

Fill in `.env.local`. It is git-ignored, so never commit it. Use placeholders
like these, replaced with your own values:

| Variable | Placeholder | Meaning |
|---|---|---|
| `N8N_BASE_URL` | `https://your-n8n-host.example.com` | The n8n origin only, with no path |
| `N8N_PROCESS_PATH` | `webhook/process-document` | Workflow A path, including its `webhook` segment |
| `N8N_DOCUMENTS_PATH` | `webhook/documents` | Workflow B path |
| `N8N_REVIEW_PATH` | `webhook/review` | Workflow C path |
| `N8N_SECRET` | `replace-with-the-shared-secret` | The value n8n expects in the `x-api-key` header |

All five are read only on the server (`src/lib/env.ts`). None of them reaches
the browser.

### Run it

```bash
npm run dev
```

Then open the address Next.js prints, `http://localhost:3000` by default.

### Checks

```bash
npm run verify:baseline   # Part 1 baseline integrity (hashes and structure)
npm run verify:privacy    # no private value from the baseline in tracked files
npm run lint
npm run test:unit
npm run test:e2e          # Playwright; every /api/ request is intercepted
npm run build
npm run check             # verify:baseline + verify:privacy + lint + test:unit + build
```

---

## Error messages shown to the user

The UI shows each message in Hebrew. This table summarizes them.

| Where | Situation | HTTP from the app | What the user is told |
|---|---|---|---|
| Upload | File type is not PDF, DOCX or TXT | none (refused before sending) | Only PDF, DOCX and TXT can be processed; the file was not sent |
| Upload | File is larger than 10 MB | none (refused before sending) | The file is too large; choose a smaller one |
| Upload | More than one file chosen | none | Only one document can be chosen |
| Upload | `UNSUPPORTED_FILE_TYPE` | 400 | Only PDF, DOCX and TXT can be processed |
| Upload | `EMPTY_DOCUMENT` | 400 | No readable text was found; try another file, for example one that is not a scanned image |
| Upload | `EXTRACTION_FAILED` | 500 | Extracting the information failed; you can send it again |
| Any screen | Wrong or missing secret (`UNAUTHORIZED`) | 401 | The server is not authorized with the automation system; this is a configuration problem, not something to fix on screen |
| Any screen | Missing server configuration | 500 | Server configuration error; contact whoever maintains the system |
| Any screen | n8n did not answer in 90 s | 504 | It did not finish in time; you can try again |
| Any screen | n8n unreachable | 502 | No connection to the automation system right now; try again in a moment |
| Any screen | n8n returned an error | 502 | The automation system returned an error |
| Any screen | Reply in an unexpected shape | 502 | The reply came back in an unexpected shape and was not shown |
| Review | No row matches the document ID | 404 | The document was not found in the log, so the review was not saved |
| Dashboard | The Sheet has no rows | 200 | No documents to show yet |
| Dashboard | Search and filters match nothing | — | No matching results; try clearing the filters |
| Any screen | The browser could not reach the app | — | The application server could not be reached; try again |

---

## Repository map

| Path | Purpose |
|---|---|
| `src/app/` | Pages (`/`, `/upload`, `/upload/no-deadline`, `/documents/[document_id]`) and the three `/api/*` route handlers |
| `src/components/` | Upload form, dashboard, detail and review UI |
| `src/lib/` | Contract schemas, server-only n8n clients, URL building, environment reader, view helpers |
| `e2e/` | Playwright specs (intercepted transport) |
| `n8n/baseline/` | The sanitized, immutable Part 1 workflow baseline and its manifest |
| `n8n/exports/` | Redacted exports of Workflows A, B and C |
| `scripts/` | `verify-baseline.mjs`, `verify-privacy.mjs` |
| `.claude/skills/` | The two project Skills: `contract-drift-guard`, `business-logic-leak-detector` |
| `CONTRACT.md`, `SPEC.md` | Authoritative contract and specification |
| `PROMPTS.md`, `docs/PROJECT_STATE.md` | Prompt log and operational record |
| `docs/REFLECTION.md` | Project reflection |
| `screenshots/m7/` | Submission screenshots and the Sheet export image (M7) |
| `demo/` | The 3:35 demo recording (M7) |

---

## Status

Status as of 2026-10-08:

- Milestones M0–M6 are complete. The owner reports that the submission was
  sent to the lecturer. **Grading and the formal closure of M7 are not
  verified.** The dated record is in
  [`docs/PROJECT_STATE.md`](docs/PROJECT_STATE.md).
- **Not deployed.** During development and testing, the application ran
  locally against the owner's n8n instance. That n8n trial has ended, so the
  workflows are **not live** now. To run the app, import the exports into your
  own n8n instance (see "Setup").
- The redacted n8n exports of Workflows A, B and C are in `n8n/exports/`. The
  Part 1 baseline is in `n8n/baseline/`.

---

## Demo recording

[`demo/Smart_Office_Demo_2026-10-03.mp4`](demo/Smart_Office_Demo_2026-10-03.mp4)
is 3:35, H.264, 1280×800, with no audio. It is a real walkthrough of the
running local app, recorded on 2026-10-03 with on-screen captions:
- one new synthetic TXT upload and its result (document 106);
- a live unsupported-file rejection;
- dashboard search and filters;
- the detail view and one review (document 106 → `Reviewed`);
- the dashboard reflecting that review.

What it does **not** show live:
- **Gmail:** the email appears only as a labelled **text slide**, built from
  email content supplied by the user. One matching Gmail message was located
  independently. It is not a Gmail screenshot, and links and IDs were removed.
- **Google Sheets:** the new row appears only as a labelled **text slide** of
  values read independently after the recording. The Sheet image in the video
  is an earlier, labelled official PDF-export rendering, and does not contain
  document 106.
- **n8n failures:** test 7 (n8n unavailable) and test 8 (wrong secret) appear
  as **previously captured** screenshots, not live runs.

Screenshots for the submission are in [`screenshots/m7/`](screenshots/m7/).

---

## Known limitations

- **No server-side idempotency.** Duplicate submissions are prevented only by
  disabling Send in the browser. A retried network request could still create
  two rows ([`CONTRACT.md`](CONTRACT.md) §13).
- **One bad Sheet row hides the whole list.** The dashboard validates the whole
  `GET /documents` response, so one row with an empty or out-of-range field
  makes the list fail with a "malformed" message until that row is fixed. This
  happened once during M6 with a synthetic row.
- **Duplicate document IDs are not defined by the contract.** Workflow C's
  duplicate-ID branch answers 409. The app shows it as a generic automation
  error (502). This mapping is observed behaviour, not a contract rule.
- **An omitted review note keeps the earlier note.** This was observed in the
  Sheet; the contract does not define it.
- **Whole-sheet reads.** `GET /documents` returns every row on each dashboard
  load, with no paging. This suits a classroom-sized Sheet, not a large one.
- **Synchronous processing.** Each upload waits for n8n to finish, up to 90
  seconds (95 seconds in the browser). Very slow AI responses end in a timeout
  message.
- **Duplicated Part 1 chain.** Workflow A copies the Part 1 processing steps.
  Any change to the fields, the extraction instructions, the urgency rule, the
  notification templates or the Sheet mapping must be made in both places.
- **No user accounts.** The reviewer name is free text, and one shared secret
  protects all three webhooks.
- **Uploads only up to 10 MB, PDF, DOCX or TXT.** Scanned PDFs without a text
  layer return "no readable text".
- **Local only.** There is no deployment, and the default port 3000 can clash
  with other local servers.

---

## Data and privacy

Development, tests, screenshots and demos use synthetic or explicitly
anonymized documents only. No credential, `.env.local` file or real client
document is committed. `npm run verify:privacy` checks tracked files for values
from the private Part 1 baseline.

In this public copy, the privacy check's hash list is empty. Those hashes are
derived from real private values, so they are not published. The hash-based
part of the check is reported as `SKIP`. The literal Google-host and gmail.com
checks still run. See [`PUBLIC_COPY_NOTES.md`](PUBLIC_COPY_NOTES.md).
