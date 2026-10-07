/**
 * F3 display rules for one processed document, as pure data.
 *
 * Sources:
 * - Instructor Part 2 doc §7 F3 — what it does: "Displays all seven extracted
 *   fields plus the file link, with a coloured urgency badge"; must handle:
 *   "'Not found' and 'No action found' values shown honestly rather than as
 *   empty space"; checked by: "Processing the Part 1 complaint document with no
 *   deadline still renders a complete card".
 * - Root `CONTRACT.md` §2 — the seven field names, their order, their allowed
 *   enum values, and the absence values `"Not found"` / `"No action found"`.
 *   The application "must never translate, rename, add, or invent a category".
 * - Root `CONTRACT.md` §3.2 — the response that carries them, plus `file_link`,
 *   `received_at`, `document_id` and `notification_sent`.
 * - `CONTRACT.md` §8 — the application may not decide or alter a business field.
 *
 * Every value is passed through exactly as it arrived. Nothing is substituted,
 * defaulted, trimmed, translated, or hidden: an absence already arrives as the
 * contract's own wording, and that wording is what gets displayed. The Hebrew
 * text here is field *labels* only, never field values.
 */

import type { DocumentUrgency } from './documents-contract';
import type { ProcessDocumentResponse } from './process-document-contract';

export type ResultFieldKey = keyof ProcessDocumentResponse['fields'];

export type ResultField = {
  key: ResultFieldKey;
  /** Hebrew label plus the contract's own field name, for traceability. */
  label: string;
  /** The returned value, unmodified. */
  value: string;
  /** `ltr` isolates short Latin values inside the RTL layout. */
  dir: 'ltr' | 'auto';
  /** F3 requires a coloured urgency badge; only `urgency` is one. */
  badge: boolean;
};

/** `CONTRACT.md` §2 order, so "all seven fields" is verifiable in one place. */
export const RESULT_FIELD_ORDER: readonly ResultFieldKey[] = [
  'document_type',
  'sender_or_company',
  'summary',
  'requested_action',
  'deadline',
  'urgency',
  'department',
];

const FIELD_LABELS_HE: Record<ResultFieldKey, string> = {
  document_type: 'סוג מסמך (document_type)',
  sender_or_company: 'שולח / חברה (sender_or_company)',
  summary: 'תקציר (summary)',
  requested_action: 'פעולה נדרשת (requested_action)',
  deadline: 'מועד יעד (deadline)',
  urgency: 'דחיפות (urgency)',
  department: 'מחלקה (department)',
};

/** Sentences keep `auto`; short enum-like values are isolated as `ltr`. */
const FIELD_DIR: Record<ResultFieldKey, 'ltr' | 'auto'> = {
  document_type: 'ltr',
  sender_or_company: 'ltr',
  summary: 'auto',
  requested_action: 'auto',
  deadline: 'ltr',
  urgency: 'ltr',
  department: 'ltr',
};

/** Colour plus an always-visible text label — never colour alone. */
export const URGENCY_BADGE_CLASS: Record<DocumentUrgency, string> = {
  High: 'border-red-400 bg-red-100 text-red-900',
  Medium: 'border-amber-400 bg-amber-100 text-amber-900',
  Low: 'border-slate-400 bg-slate-100 text-slate-800',
};

/**
 * Always returns all seven fields, in contract order, including the ones whose
 * value is an absence marker. A field is never dropped for being `"Not found"`
 * — that is exactly what F3's "rather than as empty space" forbids.
 */
export function resultFields(document: ProcessDocumentResponse): ResultField[] {
  return RESULT_FIELD_ORDER.map((key) => ({
    key,
    label: FIELD_LABELS_HE[key],
    value: document.fields[key],
    dir: FIELD_DIR[key],
    badge: key === 'urgency',
  }));
}

/**
 * ISO 8601 UTC in, fixed display out — no locale or time-zone conversion, so a
 * timestamp is never shifted into another day. An unparseable value is returned
 * unchanged rather than replaced.
 */
export function formatReceivedAtUtc(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(iso);
  if (!match) return iso;

  const [, year, month, day, hour, minute] = match;
  return `${day}.${month}.${year} ${hour}:${minute}`;
}
