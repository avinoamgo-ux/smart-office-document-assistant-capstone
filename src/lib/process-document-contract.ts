/**
 * Runtime schema and file rules for the Smart Office upload endpoint.
 *
 * Mirrors root `CONTRACT.md` §3.1 (request), §3.2 (success response),
 * §3.3 (error codes) and §6 (file rules), which in turn follow the instructor
 * Part 2 doc §5.1–§5.3. The seven business fields reuse the enum schemas in
 * `documents-contract.ts` so the allowed values have a single definition.
 */

import { z } from 'zod';
import { departmentSchema, documentTypeSchema, urgencySchema } from './documents-contract';

/** §3.1 / §6 — the only three accepted MIME types. */
export const ACCEPTED_MIME_TYPES = [
  'application/pdf',
  'text/plain',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

/** §6 — 10 MB. */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

/**
 * §3.3 — the only upstream `error_code` values this proxy forwards. Anything
 * else from n8n is reported as a generic upstream failure, so an upstream
 * cannot inject an undocumented code into our response.
 */
export const PASSTHROUGH_UPSTREAM_CODES = ['EMPTY_DOCUMENT', 'EXTRACTION_FAILED'] as const;

export type PassthroughUpstreamCode = (typeof PASSTHROUGH_UPSTREAM_CODES)[number];

export const processDocumentRequestSchema = z.object({
  file_name: z.string().min(1),
  // Membership is checked separately so a wrong type can answer
  // UNSUPPORTED_FILE_TYPE instead of a generic shape error.
  mime_type: z.string().min(1),
  file_base64: z.string().min(1),
  submitted_by: z.string().min(1).optional(),
});

export type ProcessDocumentRequest = z.infer<typeof processDocumentRequestSchema>;

export const processDocumentResponseSchema = z.object({
  status: z.literal('processed'),
  document_id: z.string().min(1),
  file_name: z.string().min(1),
  file_link: z.string().min(1),
  received_at: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/),
  fields: z.object({
    document_type: documentTypeSchema,
    sender_or_company: z.string().min(1),
    summary: z.string(),
    requested_action: z.string(),
    deadline: z.string().min(1),
    urgency: urgencySchema,
    department: departmentSchema,
  }),
  notification_sent: z.boolean(),
});

export type ProcessDocumentResponse = z.infer<typeof processDocumentResponseSchema>;

export function isAcceptedMimeType(value: string): boolean {
  return (ACCEPTED_MIME_TYPES as readonly string[]).includes(value);
}

/** §3.1 — the payload must be bare base64, never a data URL. */
export function isDataUrl(value: string): boolean {
  return /^data:/i.test(value);
}

export function isPlainBase64(value: string): boolean {
  return value.length % 4 === 0 && /^[A-Za-z0-9+/]+={0,2}$/.test(value);
}

/** Decoded size from the encoded length — avoids allocating the buffer. */
export function decodedByteLength(base64: string): number {
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  return (base64.length / 4) * 3 - padding;
}
