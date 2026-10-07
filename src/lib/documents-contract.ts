/**
 * Runtime schema for one Smart Office document row.
 *
 * Mirrors root `CONTRACT.md` §2 (field names and allowed enum values) and §4
 * (the flat array returned by `GET /webhook/documents`). This is the single
 * source of truth for the row shape; `documents-view.ts` re-exports the types.
 */

import { z } from 'zod';

export const documentTypeSchema = z.enum([
  'invoice',
  'request',
  'report',
  'complaint',
  'contract',
  'quote',
  'other',
]);

export const urgencySchema = z.enum(['Low', 'Medium', 'High']);

export const departmentSchema = z.enum([
  'Sales',
  'Finance',
  'Support',
  'HR',
  'Management',
  'General',
]);

export const documentStatusSchema = z.enum(['Processed', 'Needs Review', 'Reviewed']);

/**
 * `received_at` must keep an ISO 8601 UTC prefix: the dashboard sorts rows by
 * comparing these strings directly (see `selectDocuments`), so a different
 * format would silently break "newest first" ordering rather than fail loudly.
 */
const receivedAtSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/);

export const documentRecordSchema = z.object({
  document_id: z.string().min(1),
  received_at: receivedAtSchema,
  file_name: z.string().min(1),
  file_link: z.string().min(1),
  document_type: documentTypeSchema,
  sender_or_company: z.string().min(1),
  summary: z.string(),
  requested_action: z.string(),
  deadline: z.string().min(1),
  urgency: urgencySchema,
  department: departmentSchema,
  status: documentStatusSchema,
});

/** §4: a flat array — never wrapped in `items`/`page`/`total`. */
export const documentsResponseSchema = z.array(documentRecordSchema);

export type DocumentType = z.infer<typeof documentTypeSchema>;
export type DocumentUrgency = z.infer<typeof urgencySchema>;
export type DocumentDepartment = z.infer<typeof departmentSchema>;
export type DocumentStatus = z.infer<typeof documentStatusSchema>;
export type DocumentRecord = z.infer<typeof documentRecordSchema>;
