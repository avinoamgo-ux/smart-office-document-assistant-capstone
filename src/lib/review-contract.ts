/**
 * Runtime schema for the Smart Office review endpoint.
 *
 * Mirrors root `CONTRACT.md` §5.1 (request), §5.2 (success response) and §5.3
 * (the 404 body), which follow the instructor Part 2 doc §4.3 and §5.5. The
 * status values reuse `documentStatusSchema` from `documents-contract.ts` so the
 * Sheet `Status` values keep a single definition.
 */

import { z } from 'zod';
import { documentStatusSchema } from './documents-contract';

/** §5.1 — `review_note` is optional, up to 200 characters. */
export const REVIEW_NOTE_MAX_LENGTH = 200;

/**
 * §2 / §5.1 — a review may set `Reviewed` or `Needs Review`, never back to
 * `Processed`.
 */
export const reviewStatusSchema = documentStatusSchema.extract(['Reviewed', 'Needs Review']);

export const reviewRequestSchema = z.object({
  document_id: z.string().min(1),
  status: reviewStatusSchema,
  // §5.1 defines a required string ("Name or email") and no maximum length.
  reviewed_by: z.string().min(1),
  review_note: z.string().max(REVIEW_NOTE_MAX_LENGTH).optional(),
});

export const reviewResponseSchema = z.object({
  status: z.literal('updated'),
  document_id: z.string().min(1),
});

/** §5.3 — the 404 body. No `error_code` is defined for this case. */
export const reviewNotFoundSchema = z.object({
  status: z.literal('error'),
  message: z.string().min(1),
});

export type ReviewStatus = z.infer<typeof reviewStatusSchema>;
export type ReviewRequest = z.infer<typeof reviewRequestSchema>;
export type ReviewResponse = z.infer<typeof reviewResponseSchema>;
export type ReviewNotFound = z.infer<typeof reviewNotFoundSchema>;
