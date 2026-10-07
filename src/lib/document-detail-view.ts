/**
 * F6 display and review rules for one document, as pure data.
 *
 * Sources:
 * - Instructor Part 2 doc §7 F6 — what it does: "Opens one document, shows every
 *   field, and offers Mark as reviewed with an optional note"; must handle:
 *   "Sending the update through /review and reflecting the new status in the
 *   list"; checked by: "The Status cell in the Google Sheet changes after
 *   pressing the button".
 * - Root `CONTRACT.md` §4 — the twelve fields of one row, and their order; the
 *   flat array returned by `GET /api/documents`.
 * - Root `CONTRACT.md` §2 — allowed enum values, and the Status rule: a review
 *   may set `Reviewed` or `Needs Review`, never back to `Processed`.
 * - Root `CONTRACT.md` §5.1–§5.2 — the review request and its success reply.
 * - Root `CONTRACT.md` §8 — the application may not decide or alter a business
 *   field.
 * - Approved M6-C decisions (Avinoam, 2026-10-01): the UI offers `Reviewed`
 *   only; `reviewed_by` is required free text; both inputs are trimmed; a blank
 *   reviewer is blocked; an empty note is omitted.
 *
 * Values are passed through as they arrived. The one exception is `received_at`,
 * which is formatted for display by the shared UTC formatter — the same
 * presentation the dashboard and the F3 card already apply, with no time-zone
 * conversion. Hebrew here is labels only, never values.
 */

import {
  documentsResponseSchema,
  type DocumentRecord,
  type DocumentStatus,
} from './documents-contract';
import { formatReceivedAtUtc } from './result-view';
import { REVIEW_NOTE_MAX_LENGTH, reviewResponseSchema, type ReviewRequest } from './review-contract';

/** `CONTRACT.md` §5.1 — one definition, owned by the review contract. */
export { REVIEW_NOTE_MAX_LENGTH };

export type DetailFieldKey = keyof DocumentRecord;

/** How the screen renders one value; the value itself is never changed. */
export type DetailFieldKind = 'ltr' | 'auto' | 'badge' | 'link';

export type DetailField = {
  key: DetailFieldKey;
  /** Hebrew label plus the contract's own field name, for traceability. */
  label: string;
  value: string;
  kind: DetailFieldKind;
};

/** `CONTRACT.md` §4 order — all twelve fields of one row. */
export const DETAIL_FIELD_ORDER: readonly DetailFieldKey[] = [
  'document_id',
  'received_at',
  'file_name',
  'file_link',
  'document_type',
  'sender_or_company',
  'summary',
  'requested_action',
  'deadline',
  'urgency',
  'department',
  'status',
];

const FIELD_LABELS_HE: Record<DetailFieldKey, string> = {
  document_id: 'מזהה מסמך (document_id)',
  received_at: 'נקלט, UTC (received_at)',
  file_name: 'שם הקובץ (file_name)',
  file_link: 'קובץ (file_link)',
  document_type: 'סוג מסמך (document_type)',
  sender_or_company: 'שולח / חברה (sender_or_company)',
  summary: 'תקציר (summary)',
  requested_action: 'פעולה נדרשת (requested_action)',
  deadline: 'מועד יעד (deadline)',
  urgency: 'דחיפות (urgency)',
  department: 'מחלקה (department)',
  status: 'סטטוס (status)',
};

const FIELD_KINDS: Record<DetailFieldKey, DetailFieldKind> = {
  document_id: 'ltr',
  received_at: 'ltr',
  file_name: 'ltr',
  file_link: 'link',
  document_type: 'ltr',
  sender_or_company: 'ltr',
  summary: 'auto',
  requested_action: 'auto',
  deadline: 'ltr',
  urgency: 'badge',
  department: 'ltr',
  status: 'ltr',
};

/**
 * All twelve fields, in contract order, including any whose value is an absence
 * marker such as `"Not found"` — the same honesty rule F3 states, applied here.
 */
export function detailFields(row: DocumentRecord): DetailField[] {
  return DETAIL_FIELD_ORDER.map((key) => ({
    key,
    label: FIELD_LABELS_HE[key],
    value: key === 'received_at' ? formatReceivedAtUtc(row.received_at) : row[key],
    kind: FIELD_KINDS[key],
  }));
}

/**
 * The route segment as a `document_id`, or `null` when it cannot be decoded or
 * is empty. A malformed segment never throws and is never echoed back.
 */
export function decodeDocumentId(segment: string): string | null {
  let decoded: string;
  try {
    decoded = decodeURIComponent(segment);
  } catch {
    return null;
  }
  return decoded.length > 0 ? decoded : null;
}

/** Lookup by exact `document_id` equality; `null` drives the not-found state. */
export function findDocument(
  rows: readonly DocumentRecord[],
  documentId: string,
): DocumentRecord | null {
  return rows.find((row) => row.document_id === documentId) ?? null;
}

/**
 * `CONTRACT.md` §4 — the whole `/api/documents` payload, or `null` when any part
 * of it breaks the contract. Nothing is repaired or filled in.
 */
export function parseDocumentsResponse(payload: unknown): DocumentRecord[] | null {
  const parsed = documentsResponseSchema.safeParse(payload);
  return parsed.success ? parsed.data : null;
}

/** The trimmed reviewer name, or `null` when it is blank or whitespace only. */
export function normalizeReviewer(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/** The trimmed note, or `undefined` when nothing is left to send. */
export function normalizeReviewNote(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/** `CONTRACT.md` §5.1 — the note as sent (trimmed) is at most 200 characters. */
export function isReviewNoteWithinLimit(note: string): boolean {
  return note.trim().length <= REVIEW_NOTE_MAX_LENGTH;
}

/**
 * `CONTRACT.md` §2 — the only status this screen's action sets. `Needs Review`
 * is the other value a review may set; it is not offered here, and returning to
 * `Processed` is forbidden.
 */
export const REVIEWED_STATUS = 'Reviewed' satisfies DocumentStatus;

export function isAlreadyReviewed(status: DocumentStatus): boolean {
  return status === REVIEWED_STATUS;
}

/**
 * The `CONTRACT.md` §5.1 body for "Mark as reviewed", or `null` when the reviewer
 * is blank or the note is too long. `review_note` is left out when empty.
 */
export function buildReviewRequest(
  documentId: string,
  reviewer: string,
  note: string,
): ReviewRequest | null {
  const reviewed_by = normalizeReviewer(reviewer);
  if (documentId.length === 0 || reviewed_by === null || !isReviewNoteWithinLimit(note)) {
    return null;
  }

  const review_note = normalizeReviewNote(note);
  return review_note === undefined
    ? { document_id: documentId, status: REVIEWED_STATUS, reviewed_by }
    : { document_id: documentId, status: REVIEWED_STATUS, reviewed_by, review_note };
}

/**
 * `CONTRACT.md` §5.2 — a success reply counts only when its shape is exact and
 * it echoes the `document_id` that was sent.
 */
export function isReviewSuccessFor(payload: unknown, documentId: string): boolean {
  const parsed = reviewResponseSchema.safeParse(payload);
  return parsed.success && parsed.data.document_id === documentId;
}

/**
 * The sanitized sentence a route error carries, only when the body is
 * `{status: "error", message: string}`. Any other body yields `null`, so the
 * screen falls back to its own fixed message and never shows foreign content.
 */
export function routeErrorMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;
  const body = payload as Record<string, unknown>;
  if (body.status !== 'error' || typeof body.message !== 'string') return null;
  const message = body.message.trim();
  return message.length > 0 ? message : null;
}
