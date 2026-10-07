/**
 * F1 client-side file rules for the upload screen.
 *
 * Pure functions only — no File API, no network — so the rules can be unit
 * tested directly. Exactly two rules are enforced, and both come from the
 * sources:
 *
 * - Accepted types: PDF, DOCX, TXT. Instructor Part 2 doc §7 F1 ("Only PDF,
 *   DOCX, and TXT accepted") and root `CONTRACT.md` §6. The three exact MIME
 *   strings are reused from `process-document-contract.ts`, so the browser
 *   check and the route check cannot drift apart.
 * - Maximum size: 10 MB. `CONTRACT.md` §6 defines it as a local, pre-request
 *   check — an oversized file is never sent and has no `error_code`.
 *
 * Nothing else is enforced here, and nothing is extracted, classified, or
 * decided (`CONTRACT.md` §8).
 */

import {
  ACCEPTED_MIME_TYPES,
  isAcceptedMimeType,
  MAX_UPLOAD_BYTES,
} from './process-document-contract';

export { ACCEPTED_MIME_TYPES, MAX_UPLOAD_BYTES };

/** The file input's `accept` value — the same three types, nothing wider. */
export const FILE_INPUT_ACCEPT = ACCEPTED_MIME_TYPES.join(',');

export const UNSUPPORTED_TYPE_MESSAGE_HE =
  'ניתן לעבד קובצי PDF, DOCX ו-TXT בלבד. הקובץ לא נשלח.';

export const TOO_LARGE_MESSAGE_HE =
  'הקובץ גדול מהמותר (10MB). בחרו קובץ קטן יותר. הקובץ לא נשלח.';

/** F1 accepts one document, so a multi-file drop is refused, not truncated. */
export const SINGLE_FILE_MESSAGE_HE = 'ניתן לבחור מסמך אחד בלבד.';

export type UploadSelection = { name: string; type: string; size: number };

export type UploadRejectionReason = 'unsupported_type' | 'too_large';

export type UploadValidation =
  | { ok: true }
  | { ok: false; reason: UploadRejectionReason; message: string };

/**
 * Type first, then size — the same order as the route, so a file that is both
 * unsupported and oversized reports the type problem in both places.
 *
 * A browser that reports an empty or unrecognized `type` is refused as an
 * unsupported type. That is the honest outcome of a MIME-only rule: the
 * sources name the three accepted types and no extension fallback, so none is
 * invented here.
 */
export function validateUploadSelection(file: UploadSelection): UploadValidation {
  if (!isAcceptedMimeType(file.type)) {
    return { ok: false, reason: 'unsupported_type', message: UNSUPPORTED_TYPE_MESSAGE_HE };
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, reason: 'too_large', message: TOO_LARGE_MESSAGE_HE };
  }

  return { ok: true };
}

/** F1 requires the size on screen. Binary steps, one decimal from KB up. */
export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '—';
  if (bytes < 1024) return `${bytes} B`;

  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;

  return `${(kb / 1024).toFixed(1)} MB`;
}
