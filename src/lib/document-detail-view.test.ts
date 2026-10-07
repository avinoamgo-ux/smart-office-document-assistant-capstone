import { describe, expect, it } from 'vitest';
import {
  buildReviewRequest,
  decodeDocumentId,
  DETAIL_FIELD_ORDER,
  detailFields,
  findDocument,
  isAlreadyReviewed,
  isReviewNoteWithinLimit,
  isReviewSuccessFor,
  normalizeReviewer,
  normalizeReviewNote,
  parseDocumentsResponse,
  REVIEW_NOTE_MAX_LENGTH,
  REVIEWED_STATUS,
  routeErrorMessage,
} from './document-detail-view';
import { documentRecordSchema, type DocumentRecord } from './documents-contract';
import { REVIEW_NOTE_MAX_LENGTH as CONTRACT_NOTE_MAX_LENGTH } from './review-contract';

function record(overrides: Partial<DocumentRecord> = {}): DocumentRecord {
  return documentRecordSchema.parse({
    document_id: 'exec-1044',
    received_at: '2026-09-23T07:05:00Z',
    file_name: 'invoice-4471.pdf',
    file_link: 'https://example.com/file/mock-1044/view',
    document_type: 'invoice',
    sender_or_company: 'Nordic Supplies Ltd',
    summary: 'Invoice for office chairs delivered in February.',
    requested_action: 'Approve and pay invoice 4471',
    deadline: '24 September 2026',
    urgency: 'High',
    department: 'Finance',
    status: 'Needs Review',
    ...overrides,
  });
}

describe('detailFields — F6 "shows every field"', () => {
  it('returns all twelve contract fields in CONTRACT.md §4 order', () => {
    const fields = detailFields(record());

    expect(fields).toHaveLength(12);
    expect(fields.map((field) => field.key)).toEqual([...DETAIL_FIELD_ORDER]);
  });

  it('passes values through unchanged, except the UTC display of received_at', () => {
    const row = record();
    const byKey = Object.fromEntries(detailFields(row).map((field) => [field.key, field.value]));

    expect(byKey).toEqual({ ...row, received_at: '23.09.2026 07:05' });
  });

  it('keeps absence markers as their contract wording', () => {
    const byKey = Object.fromEntries(
      detailFields(record({ deadline: 'Not found', requested_action: 'No action found' })).map(
        (field) => [field.key, field.value],
      ),
    );

    expect(byKey.deadline).toBe('Not found');
    expect(byKey.requested_action).toBe('No action found');
  });

  it('renders urgency as the badge and file_link as a link', () => {
    const byKey = Object.fromEntries(detailFields(record()).map((field) => [field.key, field.kind]));

    expect(byKey.urgency).toBe('badge');
    expect(byKey.file_link).toBe('link');
  });

  it('labels every field with its contract name and never translates a value', () => {
    for (const field of detailFields(record())) {
      expect(field.label).toContain(field.key);
      expect(field.value).not.toMatch(/[֐-׿]/);
    }
  });
});

describe('decodeDocumentId', () => {
  it('decodes an encoded segment', () => {
    expect(decodeDocumentId('exec-1044')).toBe('exec-1044');
    expect(decodeDocumentId('exec%201044')).toBe('exec 1044');
  });

  it('returns null for a malformed or empty segment instead of throwing', () => {
    expect(decodeDocumentId('%E0%A4%A')).toBeNull();
    expect(decodeDocumentId('%')).toBeNull();
    expect(decodeDocumentId('')).toBeNull();
  });
});

describe('findDocument — exact document_id equality', () => {
  const rows = [
    record({ document_id: 'exec-1' }),
    record({ document_id: 'exec-10' }),
    record({ document_id: 'EXEC-2' }),
  ];

  it('finds a row by its exact document_id', () => {
    expect(findDocument(rows, 'exec-10')?.document_id).toBe('exec-10');
    expect(findDocument(rows, 'exec-1')?.document_id).toBe('exec-1');
  });

  it('matches no prefix, case variant or padded id', () => {
    expect(findDocument(rows, 'exec-')).toBeNull();
    expect(findDocument(rows, 'exec-2')).toBeNull();
    expect(findDocument(rows, ' exec-1')).toBeNull();
    expect(findDocument(rows, 'exec-1 ')).toBeNull();
  });

  it('returns null for an unknown id or an empty list, which drives the not-found state', () => {
    expect(findDocument(rows, 'exec-does-not-exist')).toBeNull();
    expect(findDocument([], 'exec-1')).toBeNull();
  });
});

describe('parseDocumentsResponse — CONTRACT.md §4', () => {
  it('accepts a valid flat array, including an empty one', () => {
    expect(parseDocumentsResponse([record()])).toEqual([record()]);
    expect(parseDocumentsResponse([])).toEqual([]);
  });

  it('rejects the whole payload when any row or the wrapper breaks the contract', () => {
    expect(parseDocumentsResponse([record(), { ...record(), urgency: 'Urgent' }])).toBeNull();
    expect(parseDocumentsResponse({ items: [record()] })).toBeNull();
    expect(parseDocumentsResponse(null)).toBeNull();
  });
});

describe('reviewer and note normalization', () => {
  it('rejects a blank or whitespace-only reviewer', () => {
    expect(normalizeReviewer('')).toBeNull();
    expect(normalizeReviewer('   ')).toBeNull();
    expect(normalizeReviewer('\t\n ')).toBeNull();
  });

  it('trims the reviewer', () => {
    expect(normalizeReviewer('  Dana Example  ')).toBe('Dana Example');
  });

  it('trims the note and omits an empty one', () => {
    expect(normalizeReviewNote('  Payment approved  ')).toBe('Payment approved');
    expect(normalizeReviewNote('')).toBeUndefined();
    expect(normalizeReviewNote('    ')).toBeUndefined();
  });

  it('accepts a 200-character note and rejects 201, using the review contract limit', () => {
    expect(REVIEW_NOTE_MAX_LENGTH).toBe(CONTRACT_NOTE_MAX_LENGTH);
    expect(REVIEW_NOTE_MAX_LENGTH).toBe(200);
    expect(isReviewNoteWithinLimit('')).toBe(true);
    expect(isReviewNoteWithinLimit('a'.repeat(200))).toBe(true);
    expect(isReviewNoteWithinLimit('a'.repeat(201))).toBe(false);
  });
});

describe('buildReviewRequest — CONTRACT.md §5.1', () => {
  it('builds a Reviewed request with trimmed fields', () => {
    expect(buildReviewRequest('exec-1044', '  Dana Example ', '  Payment approved  ')).toEqual({
      document_id: 'exec-1044',
      status: 'Reviewed',
      reviewed_by: 'Dana Example',
      review_note: 'Payment approved',
    });
  });

  it('omits review_note entirely when the note is empty after trimming', () => {
    const request = buildReviewRequest('exec-1044', 'Dana Example', '   ');

    expect(request).toEqual({
      document_id: 'exec-1044',
      status: 'Reviewed',
      reviewed_by: 'Dana Example',
    });
    expect(request).not.toHaveProperty('review_note');
  });

  it('accepts a 200-character note and refuses 201', () => {
    expect(buildReviewRequest('exec-1044', 'Dana', 'a'.repeat(200))?.review_note).toHaveLength(200);
    expect(buildReviewRequest('exec-1044', 'Dana', 'a'.repeat(201))).toBeNull();
  });

  it('refuses a blank reviewer or an empty document_id', () => {
    expect(buildReviewRequest('exec-1044', '', 'note')).toBeNull();
    expect(buildReviewRequest('exec-1044', '   ', 'note')).toBeNull();
    expect(buildReviewRequest('', 'Dana', 'note')).toBeNull();
  });

  it('never produces Processed or Needs Review', () => {
    const inputs: Array<[string, string]> = [
      ['Dana', ''],
      ['Dana', 'Processed'],
      ['Needs Review', 'Needs Review'],
    ];
    for (const [reviewer, note] of inputs) {
      expect(buildReviewRequest('exec-1044', reviewer, note)?.status).toBe('Reviewed');
    }
    expect(REVIEWED_STATUS).toBe('Reviewed');
  });
});

describe('isAlreadyReviewed', () => {
  it('is true only for Reviewed', () => {
    expect(isAlreadyReviewed('Reviewed')).toBe(true);
    expect(isAlreadyReviewed('Needs Review')).toBe(false);
    expect(isAlreadyReviewed('Processed')).toBe(false);
  });
});

describe('isReviewSuccessFor — CONTRACT.md §5.2', () => {
  it('accepts the exact success body that echoes the sent document_id', () => {
    expect(isReviewSuccessFor({ status: 'updated', document_id: 'exec-1044' }, 'exec-1044')).toBe(
      true,
    );
  });

  it('rejects a mismatched document_id, another status or a wrong shape', () => {
    expect(isReviewSuccessFor({ status: 'updated', document_id: 'exec-9999' }, 'exec-1044')).toBe(
      false,
    );
    expect(isReviewSuccessFor({ status: 'processed', document_id: 'exec-1044' }, 'exec-1044')).toBe(
      false,
    );
    expect(isReviewSuccessFor(null, 'exec-1044')).toBe(false);
    expect(isReviewSuccessFor('updated', 'exec-1044')).toBe(false);
  });
});

describe('routeErrorMessage', () => {
  it('returns the message of a {status: "error", message} body', () => {
    expect(routeErrorMessage({ status: 'error', message: 'הודעה מסוננת.' })).toBe('הודעה מסוננת.');
    expect(
      routeErrorMessage({ status: 'error', error_code: 'UNAUTHORIZED', message: 'תקלת תצורה.' }),
    ).toBe('תקלת תצורה.');
  });

  it('returns null for any other body', () => {
    expect(routeErrorMessage({ message: 'no status' })).toBeNull();
    expect(routeErrorMessage({ status: 'error', message: 42 })).toBeNull();
    expect(routeErrorMessage({ status: 'error', message: '   ' })).toBeNull();
    expect(routeErrorMessage(['error'])).toBeNull();
    expect(routeErrorMessage(null)).toBeNull();
    expect(routeErrorMessage('error')).toBeNull();
  });
});
