import { describe, expect, it } from 'vitest';
import type { ProcessDocumentResponse } from './process-document-contract';
import { processDocumentResponseSchema } from './process-document-contract';
import {
  formatReceivedAtUtc,
  RESULT_FIELD_ORDER,
  resultFields,
  URGENCY_BADGE_CLASS,
} from './result-view';

/** A complete §3.2 response; every fixture below starts from this one. */
function response(
  fields: Partial<ProcessDocumentResponse['fields']> = {},
): ProcessDocumentResponse {
  const candidate = {
    status: 'processed',
    document_id: 'mock-exec-1043',
    file_name: 'invoice-4471.pdf',
    file_link: 'https://example.com/file/mock-upload/view',
    received_at: '2026-09-22T09:24:00Z',
    fields: {
      document_type: 'invoice',
      sender_or_company: 'Nordic Supplies Ltd',
      summary: 'Invoice for office chairs delivered in February.',
      requested_action: 'Approve and pay invoice 4471',
      deadline: '12 March 2026',
      urgency: 'High',
      department: 'Finance',
      ...fields,
    },
    notification_sent: false,
  };

  // Guards the fixture itself: a test must not assert over a shape n8n could
  // never send.
  return processDocumentResponseSchema.parse(candidate);
}

describe('resultFields — F3 complete result', () => {
  it('returns all seven fields in CONTRACT.md §2 order', () => {
    const rows = resultFields(response());

    expect(rows).toHaveLength(7);
    expect(rows.map((row) => row.key)).toEqual([
      'document_type',
      'sender_or_company',
      'summary',
      'requested_action',
      'deadline',
      'urgency',
      'department',
    ]);
    expect(rows.map((row) => row.key)).toEqual([...RESULT_FIELD_ORDER]);
  });

  it('passes every returned value through unchanged', () => {
    const document = response();
    const byKey = Object.fromEntries(resultFields(document).map((row) => [row.key, row.value]));

    expect(byKey).toEqual(document.fields);
  });

  it('marks only urgency as the badge field', () => {
    const rows = resultFields(response());

    expect(rows.filter((row) => row.badge).map((row) => row.key)).toEqual(['urgency']);
  });

  it('labels every field with its contract name, and never translates a value', () => {
    for (const row of resultFields(response())) {
      expect(row.label).toContain(row.key);
      expect(row.value).not.toMatch(/[֐-׿]/);
    }
  });
});

describe('resultFields — a result with no deadline still renders a complete card', () => {
  const noDeadline = response({
    document_type: 'complaint',
    deadline: 'Not found',
    requested_action: 'No action found',
    sender_or_company: 'Not found',
    urgency: 'Low',
  });

  it('keeps all seven fields when the absence values arrive', () => {
    const rows = resultFields(noDeadline);

    expect(rows).toHaveLength(7);
    expect(rows.every((row) => row.value.length > 0)).toBe(true);
  });

  it('shows the contract absence wording as the value, not blank and not a substitute', () => {
    const byKey = Object.fromEntries(resultFields(noDeadline).map((row) => [row.key, row.value]));

    expect(byKey.deadline).toBe('Not found');
    expect(byKey.requested_action).toBe('No action found');
    expect(byKey.sender_or_company).toBe('Not found');
  });

  it('still produces the urgency badge for the low-urgency complaint', () => {
    const urgencyRow = resultFields(noDeadline).find((row) => row.key === 'urgency');

    expect(urgencyRow?.badge).toBe(true);
    expect(urgencyRow?.value).toBe('Low');
  });
});

describe('urgency badge', () => {
  it('has a distinct class for each of the three contract levels', () => {
    const classes = [
      URGENCY_BADGE_CLASS.High,
      URGENCY_BADGE_CLASS.Medium,
      URGENCY_BADGE_CLASS.Low,
    ];

    expect(new Set(classes).size).toBe(3);
    expect(classes.every((value) => value.length > 0)).toBe(true);
  });
});

describe('formatReceivedAtUtc', () => {
  it('formats the UTC prefix without shifting the date', () => {
    expect(formatReceivedAtUtc('2026-09-22T09:24:00Z')).toBe('22.09.2026 09:24');
  });

  it('returns an unparseable value unchanged rather than replacing it', () => {
    expect(formatReceivedAtUtc('not-a-timestamp')).toBe('not-a-timestamp');
  });
});
