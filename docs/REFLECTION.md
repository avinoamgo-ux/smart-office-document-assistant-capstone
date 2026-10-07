# Reflection — Smart Office Document Assistant

*2026-10-02, finalized 2026-10-03. Grounded in `docs/PROJECT_STATE.md` and
`PROMPTS.md`.*

## What the application adds that n8n alone could not

Part 1 worked only for someone who could drop a file into the right Drive
folder and then read a spreadsheet. The application makes the same automation
usable by an employee who never opens n8n:

- an upload that refuses wrong types and files over 10 MB before sending;
- the extracted fields and urgency badge on screen;
- one searchable dashboard over the shared Sheet;
- a review action that writes `Status`, `Reviewed By` and `Review Note` back
  to the Sheet.

Every failure becomes a sentence the user can act on. The server layer keeps
the secret out of the browser and checks every n8n reply against the contract.
That check refused wrong data twice: 110 schema issues in a Workflow B response
during M3 (in an isolated copy), and one malformed synthetic row in M6.

## What still requires a human

- **Judging the AI fields.** The AI chooses `urgency`, `document_type` and
  `department`, and only a person can confirm them. That is why the review
  action exists.
- **Fixing data.** When a row breaks the contract, the app stops at an error
  message. A person must correct the Sheet.
- **Deciding open rules.** The contract does not yet define duplicate document
  IDs, or what an omitted review note should do. In testing, an omitted note
  kept the earlier one, but that is observed behaviour, not a promised rule.
- **Operating n8n.** Publishing workflows, correcting the secret and approving
  every change stayed manual.

## What would break first at a thousand documents a day

**The dashboard read.** `GET /documents` returns the whole Sheet on every load,
with no paging, and the app validates the entire array. Loads would slow as
the Sheet grows, and one malformed row among thousands would hide every
document.

Next would come:

- Google Sheets quotas, because the Sheet is the only store;
- synchronous uploads that wait up to 90 seconds with no queue;
- duplicate rows from network retries, since only a disabled button prevents
  them.

## One thing to build differently

Move the shared processing steps into **one n8n sub-workflow** called by both
the Drive trigger and the webhook, as the instructor document recommends,
instead of duplicating them in Workflow A.

## Maintenance cost of duplicating the Part 1 chain

Workflow A contains its own copy of the extraction, AI-field, Sheet-append,
urgency `IF` and notification steps. Every change to the fields, extraction
instructions, urgency rule, email templates or Sheet mapping must therefore be
made twice. If only one copy changes, Drive uploads and app uploads quietly
drift apart. No error appears, because both workflows still run. Part 1 itself
received only the `Document ID` column in its Sheet mapping, added after a
backup.

This drift has already started. After M4, Workflow A gained a separate PDF
extraction path, routed by file type. The Part 1 baseline still has one
text-extraction step, so the two copies now handle PDFs differently.
