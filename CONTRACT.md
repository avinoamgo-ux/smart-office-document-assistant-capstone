# CONTRACT.md — Intent Gate — Smart Document Review

Status: APPROVED CONTRACT v1.0 — implementation pending.
Source: `01-Smart_Office_Assistant_Part2_Application_Layer.docx` §3–§5, §8
(instructor Part 2 doc), cross-checked against
`01-Practical_No_Code_n8n_Project_With_Diagram.docx` §4.2/§6.1 (instructor
Part 1 doc). Where this file states a value not found verbatim in either
document, it is marked as an **approved decision**, not an instructor quote.

If this contract changes, it changes in three places at once: this file,
the n8n workflow, and the application. (Instructor doc §5, "Contract
discipline.")

---

## 0. Architecture map

```
Browser
  │  same-origin fetch, JSON body, no secret
  ▼
Next.js Route Handlers (server-only — hold N8N_BASE_URL + N8N_SECRET)
  │  server-to-server HTTPS + x-api-key header
  ▼
n8n (Production URL, workflow Active)
  ├─ Workflow A — POST /webhook/process-document
  ├─ Workflow B — GET  /webhook/documents
  └─ Workflow C — POST /webhook/review
        all three read/write ONE shared Google Sheet:
        "Document Processing Log" (same sheet Part 1 already writes to)
```

| Browser-facing route | Proxies to | Method |
|---|---|---|
| `/api/process-document` | `POST /webhook/process-document` | POST |
| `/api/documents` | `GET /webhook/documents` | GET |
| `/api/review` | `POST /webhook/review` | POST |

Next.js is not a transparent pass-through. See §8 for exactly what it may
and must not do.

---

## 1. Conventions

- Transport: HTTPS, `application/json` at **every** hop — browser→Next.js
  and Next.js→n8n alike. The file is sent as base64 inside the JSON body,
  not as `multipart/form-data`.
- Timestamps: ISO 8601 UTC (e.g. `2026-09-22T09:24:00Z`).
- `document_id`: the n8n execution identifier for the run that created the
  record, converted to a string. See §10 for scope (both submission paths).
- Auth: server-to-server only, header `x-api-key: <N8N_SECRET>`. Never sent
  from the browser. See §7.
- Storage: one Google Sheet, "Document Processing Log," shared by the Part 1
  Drive-trigger path and every Part 2 endpoint. No separate sheet, range, or
  database.
- Request timeout: **90,000 ms** (90 seconds).
- Maximum upload size: **10 MB**, enforced client-side before any request is
  sent. See §6.

---

## 2. Part 1 field names and allowed enum values

(Exact values — the app must never translate, rename, add, or invent a
category. Source: Part 1 doc §6.1, restated as binding in Part 2 doc §5.2.)

| Field | Type | Allowed values | On absence |
|---|---|---|---|
| `document_type` | string enum | `invoice`, `request`, `report`, `complaint`, `contract`, `quote`, `other` | — |
| `sender_or_company` | string | free text | `"Not found"` |
| `summary` | string | ≤ 3 sentences | — |
| `requested_action` | string | free text | `"No action found"` |
| `deadline` | string | exact as written in the document | `"Not found"` |
| `urgency` | string enum | `Low`, `Medium`, `High` | — |
| `department` | string enum | `Sales`, `Finance`, `Support`, `HR`, `Management`, `General` | — |

Sheet `Status` column — valid values: `Processed`, `Needs Review`,
`Reviewed`. Part 1's append step writes only `Processed` or `Needs Review`.
`POST /review` may change `Status` to `Reviewed` or `Needs Review` (never
back to `Processed`).

---

## 3. `POST /api/process-document` ↔ `POST /webhook/process-document`

### 3.1 Request (identical shape at both hops)

```json
{
  "file_name": "invoice-4471.pdf",
  "mime_type": "application/pdf",
  "file_base64": "JVBERi0xLjQK...",
  "submitted_by": "dana@office.com"
}
```

| Field | Required | Notes |
|---|---|---|
| `file_name` | Yes | Original name including extension |
| `mime_type` | Yes | `application/pdf`, `text/plain`, or `application/vnd.openxmlformats-officedocument.wordprocessingml.document` |
| `file_base64` | Yes | Base64, **no** data-URL prefix |
| `submitted_by` | No | Optional caller metadata. Its persistence in Google Sheets is not required or guaranteed by this contract — do not assume it is written to any column. |

### 3.2 Success response — `200 OK`

```json
{
  "status": "processed",
  "document_id": "exec-1043",
  "file_name": "invoice-4471.pdf",
  "file_link": "https://example.com/file/d/1a2b3c/view",
  "received_at": "2026-09-22T09:24:00Z",
  "fields": {
    "document_type": "invoice",
    "sender_or_company": "Nordic Supplies Ltd",
    "summary": "Invoice for office chairs delivered in February.",
    "requested_action": "Approve and pay invoice 4471",
    "deadline": "12 March 2026",
    "urgency": "High",
    "department": "Finance"
  },
  "notification_sent": true
}
```

`document_id` is the n8n execution identifier, converted to a string.

### 3.3 Error response

```json
{ "status": "error", "error_code": "UNSUPPORTED_FILE_TYPE", "message": "human-readable" }
```

| HTTP (browser-facing) | `error_code` | When | UI behavior |
|---|---|---|---|
| 400 | `UNSUPPORTED_FILE_TYPE` | MIME type not PDF/DOCX/TXT | Inline message; file not resent |
| 400 | `EMPTY_DOCUMENT` | Extraction produced nothing (e.g. scanned image) | Explain no readable text; suggest another file |
| 500 | `EXTRACTION_FAILED` | AI step failed or returned unusable output | Offer Retry; keep file in the form |
| 401 | `UNAUTHORIZED` | Missing/wrong secret header | Configuration-error message, not end-user-actionable |

An oversized file never reaches this endpoint at all — see §6. There is no
fifth `error_code` for it.

---

## 4. `GET /api/documents` ↔ `GET /webhook/documents`

No query parameters. Returns the full list; search/filter (F5) is applied
in the application layer over this array.

The application presents rows ordered by `received_at` descending (newest
first). Sorting is presentation behavior in the application, not n8n
business logic — the endpoint itself defines no required order.

### Response — `200 OK`

```json
[
  {
    "document_id": "exec-1043",
    "received_at": "2026-09-22T09:24:00Z",
    "file_name": "invoice-4471.pdf",
    "file_link": "https://example.com/file/d/1a2b3c/view",
    "document_type": "invoice",
    "sender_or_company": "Nordic Supplies Ltd",
    "summary": "Invoice for office chairs delivered in February.",
    "requested_action": "Approve and pay invoice 4471",
    "deadline": "12 March 2026",
    "urgency": "High",
    "department": "Finance",
    "status": "Processed"
  }
]
```

A flat array — not wrapped in `items`/`page`/`total`. Every row, regardless
of whether it originated from the Drive trigger or the application, carries
a `document_id`. See §10.

---

## 5. `POST /api/review` ↔ `POST /webhook/review`

### 5.1 Request

```json
{
  "document_id": "exec-1043",
  "status": "Reviewed",
  "reviewed_by": "dana@office.com",
  "review_note": "Payment approved"
}
```

| Field | Type | Notes |
|---|---|---|
| `document_id` | string | Must match a `Document ID` row |
| `status` | string enum | `Reviewed` or `Needs Review` |
| `reviewed_by` | string | Name or email |
| `review_note` | string | Optional, ≤ 200 characters |

### 5.2 Success response — `200 OK`

```json
{ "status": "updated", "document_id": "exec-1043" }
```

### 5.3 Error

| HTTP (browser-facing) | Meaning |
|---|---|
| 404 | No row matches `document_id` |
| 401 | Missing/wrong secret header (`UNAUTHORIZED`, same normalization as §3.3) |

404 body:

```json
{ "status": "error", "message": "Document not found." }
```

No `error_code` is defined for this case.

---

## 6. File rules (PDF / DOCX / TXT)

- Accepted MIME types only: PDF, DOCX, TXT. An unsupported MIME type, if it
  ever reaches the API, maps to `UNSUPPORTED_FILE_TYPE`.
- Maximum upload size: **10 MB**. This is a **local, pre-request** check in
  the browser/application — the file is never sent if it exceeds the limit.
  It is not `UNSUPPORTED_FILE_TYPE` and has no `error_code` of its own,
  because no API request is made.
- Scanned/unreadable content that reaches extraction with no usable text
  maps to `EMPTY_DOCUMENT`.

---

## 7. Authentication and server-side secrets

- Every n8n webhook requires header authentication: `x-api-key: <N8N_SECRET>`
  (header name matches the instructor's curl examples).
- The secret is read from a server-only environment variable and attached
  only inside the Next.js route handler. It is never sent to, stored in, or
  readable from the browser.
- Upstream n8n may respond `401` or `403` to an authentication failure,
  depending on platform behavior — this contract does not assume which.
  The Next.js proxy **normalizes either case to `401` with
  `error_code: "UNAUTHORIZED"`** in its response to the browser, without
  exposing which upstream status or any other internal detail occurred.
- `.env.example` commits variable **names** with placeholder values only;
  the real `.env` is git-ignored. Searching the repository for the secret
  must return nothing.

---

## 8. Proxy responsibility

The Next.js routes are not a transparent pass-through. They may:

- validate the request's transport shape (required fields present, JSON
  well-formed) before forwarding;
- enforce the 90,000 ms request timeout;
- attach the `x-api-key` header server-side;
- normalize upstream authentication failures to `401 UNAUTHORIZED` (§7);
- sanitize error messages so no internal n8n detail (URL, stack trace,
  upstream status text) reaches the browser.

They must **not**:

- call an AI model or perform document extraction;
- decide or alter `urgency`, `document_type`, or any other business field;
- call Google Drive, Google Sheets, or Gmail directly;
- perform any other business logic that belongs in n8n.

---

## 9. Duplicate submission and timeout

- The Send button is disabled for the duration of an in-flight
  `process-document` request; responses from a superseded request are
  ignored.
- Required test: pressing Send twice quickly must still produce exactly
  one spreadsheet row.
- Timeout: **90,000 ms**, per §1.
- No idempotency key or additional field is added to the API contract at
  this stage. Client-side button-disable is the only deduplication
  mechanism this contract defines. Server-side idempotency is a **known
  limitation** — see §13.

---

## 10. Shared Google Sheet — column mapping and Document ID scope

Same sheet Part 1 already writes to (`Document Processing Log`), extended
with three separate new columns:

| Existing Part 1 columns | New Part 2 columns |
|---|---|
| Received At, File Name, File Link, Document Type, Sender / Company, Summary, Requested Action, Deadline, Urgency, Department, Status | **Document ID**, **Reviewed By**, **Review Note** |

`Document ID` is populated for **both** submission paths:

- App-submitted documents (Workflow A) — the execution identifier of the
  process-document run, as already specified by the instructor doc.
- Drive-trigger documents (Part 1) — Part 1's own execution identifier.
  This requires one minimal, additive change to Part 1's existing "Append
  row in sheet" mapping (map the execution id into the new `Document ID`
  column) after a backup/export of the current Part 1 workflow. Part 1's
  business logic (extraction, AI fields, urgency decision, notification,
  file move) is unchanged.

`Reviewed By` and `Review Note` are populated only by Workflow C.

---

## 11. General / undocumented endpoint failures

This contract defines exactly four `error_code` values (§3.3, §5.3's
`UNAUTHORIZED`) and no others. For any failure outside those — an
unreachable n8n instance, a network/DNS failure, a timeout expiry, or an
upstream 4xx/5xx that isn't one of the documented codes — the proxy
returns a sanitized, human-readable application error without exposing
n8n internals, and without a manufactured `error_code`. The HTTP status
alone (e.g. a `502`/`504`-class response, or pass-through of a genuine
upstream status) conveys the category; the application renders a generic
fallback message from that status rather than a specific code.

---

## 12. Explicit exclusions

This contract defines **no**:
- consciousness mapping, epistemic layers, or `declared_intentions`
- `IntentSealLite` or any IntentSeal-named metadata
- the superseded `AI_DRAFT → NEEDS_REVIEW → APPROVED | REVISED | REJECTED`
  multi-state lifecycle token set
- `202 Accepted` + polling — every response is synchronous `200`/error
- `multipart/form-data` transport to n8n — base64-in-JSON only
- a separate n8n Data Table, or any storage other than the one shared
  Google Sheet

The official Sheet value `"Needs Review"` (§2, §5.1) is **preserved** —
only the superseded lifecycle's uppercase `NEEDS_REVIEW` token and its
surrounding state machine are excluded, not the real Status value.

---

## 13. Known limitations

- **Server-side idempotency is not defined.** Deduplication of a
  double-submitted document relies entirely on client-side button-disable
  (§9). A retried or replayed request at the network layer could still
  produce two rows; this contract does not address that case.
