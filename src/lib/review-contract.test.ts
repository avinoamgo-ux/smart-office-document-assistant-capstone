import { describe, expect, it } from 'vitest';
import {
  REVIEW_NOTE_MAX_LENGTH,
  reviewNotFoundSchema,
  reviewRequestSchema,
  reviewResponseSchema,
} from './review-contract';

const validRequest = {
  document_id: 'exec-1043',
  status: 'Reviewed',
  reviewed_by: 'Dana Example',
  review_note: 'Payment approved',
};

describe('review contract — CONTRACT.md §5.1 request', () => {
  it('accepts a valid request with a review_note', () => {
    expect(reviewRequestSchema.safeParse(validRequest).success).toBe(true);
  });

  it('accepts a valid request without a review_note', () => {
    const withoutNote = {
      document_id: validRequest.document_id,
      status: validRequest.status,
      reviewed_by: validRequest.reviewed_by,
    };
    expect(reviewRequestSchema.safeParse(withoutNote).success).toBe(true);
  });

  it('accepts both review statuses the contract allows', () => {
    for (const status of ['Reviewed', 'Needs Review']) {
      expect(reviewRequestSchema.safeParse({ ...validRequest, status }).success).toBe(true);
    }
  });

  it('rejects Processed, because a review never returns a row to it (§2)', () => {
    expect(reviewRequestSchema.safeParse({ ...validRequest, status: 'Processed' }).success).toBe(
      false,
    );
  });

  it('rejects an empty document_id', () => {
    expect(reviewRequestSchema.safeParse({ ...validRequest, document_id: '' }).success).toBe(false);
  });

  it('rejects an empty reviewed_by', () => {
    expect(reviewRequestSchema.safeParse({ ...validRequest, reviewed_by: '' }).success).toBe(false);
  });

  it('rejects a missing reviewed_by', () => {
    const withoutReviewer = {
      document_id: validRequest.document_id,
      status: validRequest.status,
    };
    expect(reviewRequestSchema.safeParse(withoutReviewer).success).toBe(false);
  });

  it('allows a review_note of exactly 200 characters and rejects 201', () => {
    expect(REVIEW_NOTE_MAX_LENGTH).toBe(200);
    expect(
      reviewRequestSchema.safeParse({ ...validRequest, review_note: 'a'.repeat(200) }).success,
    ).toBe(true);
    expect(
      reviewRequestSchema.safeParse({ ...validRequest, review_note: 'a'.repeat(201) }).success,
    ).toBe(false);
  });

  it('sets no maximum length on reviewed_by, since the source defines none', () => {
    expect(
      reviewRequestSchema.safeParse({ ...validRequest, reviewed_by: 'r'.repeat(1000) }).success,
    ).toBe(true);
  });
});

describe('review contract — CONTRACT.md §5.2 success and §5.3 not found', () => {
  it('accepts the success body', () => {
    expect(
      reviewResponseSchema.safeParse({ status: 'updated', document_id: 'exec-1043' }).success,
    ).toBe(true);
  });

  it('rejects any other success status or an empty document_id', () => {
    expect(
      reviewResponseSchema.safeParse({ status: 'processed', document_id: 'exec-1043' }).success,
    ).toBe(false);
    expect(reviewResponseSchema.safeParse({ status: 'updated', document_id: '' }).success).toBe(
      false,
    );
  });

  it('accepts the 404 body, which carries no error_code', () => {
    expect(
      reviewNotFoundSchema.safeParse({ status: 'error', message: 'Document not found.' }).success,
    ).toBe(true);
  });

  it('rejects a 404 body without the contract status or message', () => {
    expect(reviewNotFoundSchema.safeParse({ message: 'Document not found.' }).success).toBe(false);
    expect(reviewNotFoundSchema.safeParse({ status: 'error', message: '' }).success).toBe(false);
  });
});
