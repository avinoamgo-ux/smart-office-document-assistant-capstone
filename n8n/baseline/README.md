# Part 1 baseline — sanitized submission artifact

**File:** `part1-baseline.json`

This is a **sanitized** copy of the approved Part 1 n8n workflow
(*Final Project - Phase 01 - Consciousness Center Document Assistant*), prepared
for version control and course submission.

## What is preserved

- Valid n8n workflow JSON.
- All **11 nodes**, their types, `typeVersion`s, canvas positions, and internal
  node ids.
- All node **connections** and the full routing logic
  (Drive trigger → download → extract → Information Extractor + OpenAI Chat Model
  → append row → `If` (urgency) → urgent / normal Gmail → Drive *move* nodes).
- Parameter structure, including the Google Sheets `Status` expression that can
  yield both `Needs Review` and `Processed`.
- The dynamic expressions `={{ $json.id }}` and `={{ $json.data }}` — **unchanged**.
- `workflow id` and `versionId` — kept as provenance of the approved baseline.
- Empty `pinData`.

## What is redacted (deterministic synthetic placeholders)

| Category | Placeholder |
|---|---|
| Credential ids | `RECONNECT_CREDENTIAL_IN_N8N` |
| Credential display names | `<provider> OAuth2 (reconnect in n8n)` |
| Personal email address | `example.user@example.com` |
| Incoming Drive folder id | `EXAMPLE_INCOMING_DRIVE_FOLDER_ID` |
| Processed Drive folder id | `EXAMPLE_PROCESSED_DRIVE_FOLDER_ID` |
| Spreadsheet id | `EXAMPLE_SPREADSHEET_ID` |
| Gmail node `webhookId` | `EXAMPLE_WEBHOOK_ID` |
| n8n `meta.instanceId` | `EXAMPLE_INSTANCE_ID` |
| Google URLs | `https://example.com/...` |

## Using it

Import `part1-baseline.json` into n8n and **reconnect every credential locally**
(Google Drive, Google Sheets, Gmail, OpenAI). Point the Drive folder, spreadsheet,
and notification address at your own resources. No secret is present in this file.

## Immutable raw source

The original, unmodified Part 1 export is kept **privately** at
`private/baseline/part1-baseline.raw.json` and is **excluded from Git**
(`.gitignore` → `/private/`). Its SHA-256 is recorded as provenance in
`BASELINE_MANIFEST.json`; the raw file itself is never committed or pushed.
