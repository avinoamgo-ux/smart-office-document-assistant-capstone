import { describe, expect, it } from 'vitest';
import {
  EMPTY_FILTERS,
  rowsForDisplay,
  selectDocuments,
  type DocumentRecord,
} from './documents-view';

function row(overrides: Partial<DocumentRecord> = {}): DocumentRecord {
  return {
    document_id: 'exec-1000',
    received_at: '2026-09-20T08:00:00Z',
    file_name: 'invoice-1000.pdf',
    file_link: 'https://example.com/file/mock-1000/view',
    document_type: 'invoice',
    sender_or_company: 'Nordic Supplies Ltd',
    summary: 'Invoice for office chairs delivered in February.',
    requested_action: 'Approve and pay invoice 1000',
    deadline: 'Not found',
    urgency: 'Low',
    department: 'Finance',
    status: 'Processed',
    ...overrides,
  };
}

describe('selectDocuments', () => {
  it('orders documents by received_at descending', () => {
    const older = row({ document_id: 'exec-1', received_at: '2026-09-01T10:00:00Z' });
    const newest = row({ document_id: 'exec-3', received_at: '2026-09-22T10:00:00Z' });
    const middle = row({ document_id: 'exec-2', received_at: '2026-09-10T10:00:00Z' });

    const result = selectDocuments([older, newest, middle], EMPTY_FILTERS);

    expect(result.map((item) => item.document_id)).toEqual(['exec-3', 'exec-2', 'exec-1']);
  });

  it('searches file name, sender and summary but not other fields', () => {
    const byFileName = row({ document_id: 'by-file', file_name: 'quote-alpha.txt' });
    const bySender = row({ document_id: 'by-sender', sender_or_company: 'Alpha Logistics' });
    const bySummary = row({ document_id: 'by-summary', summary: 'Delivery for the alpha pilot.' });
    const byAction = row({ document_id: 'by-action', requested_action: 'Contact alpha team' });

    const result = selectDocuments(
      [byFileName, bySender, bySummary, byAction],
      { ...EMPTY_FILTERS, search: 'alpha' },
    );

    expect(result.map((item) => item.document_id).sort()).toEqual([
      'by-file',
      'by-sender',
      'by-summary',
    ]);
  });

  it('ignores case and surrounding whitespace in the search term', () => {
    const match = row({ document_id: 'match', sender_or_company: 'Nordic Supplies Ltd' });

    const result = selectDocuments([match], { ...EMPTY_FILTERS, search: '  NORDIC  ' });

    expect(result.map((item) => item.document_id)).toEqual(['match']);
  });

  it('filters by a single facet without touching the others', () => {
    const high = row({ document_id: 'high', urgency: 'High' });
    const low = row({ document_id: 'low', urgency: 'Low' });

    const result = selectDocuments([high, low], { ...EMPTY_FILTERS, urgency: 'High' });

    expect(result.map((item) => item.document_id)).toEqual(['high']);
  });

  it('combines every filter with AND', () => {
    const wanted = row({
      document_id: 'wanted',
      urgency: 'High',
      document_type: 'complaint',
      department: 'Support',
      status: 'Needs Review',
      summary: 'Customer reported a damaged delivery.',
    });
    const wrongDepartment = row({
      document_id: 'wrong-department',
      urgency: 'High',
      document_type: 'complaint',
      department: 'Sales',
      status: 'Needs Review',
      summary: 'Customer reported a damaged delivery.',
    });

    const result = selectDocuments([wanted, wrongDepartment], {
      search: 'damaged',
      urgency: 'High',
      documentType: 'complaint',
      department: 'Support',
      status: 'Needs Review',
    });

    expect(result.map((item) => item.document_id)).toEqual(['wanted']);
  });

  it('returns an empty list when no document matches', () => {
    const result = selectDocuments([row()], { ...EMPTY_FILTERS, search: 'no-such-document' });

    expect(result).toEqual([]);
  });
});

describe('rowsForDisplay', () => {
  const apiRows = [row({ document_id: 'api-1' }), row({ document_id: 'api-2' })];

  it('shows exactly the loaded rows, unchanged', () => {
    const result = rowsForDisplay({ phase: 'loaded', rows: apiRows });

    expect(result).toBe(apiRows);
    expect(result.map((item) => item.document_id)).toEqual(['api-1', 'api-2']);
  });

  it('shows a loaded empty list as no rows', () => {
    expect(rowsForDisplay({ phase: 'loaded', rows: [] })).toEqual([]);
  });

  it('shows no rows while the request is in flight', () => {
    expect(rowsForDisplay({ phase: 'loading' })).toEqual([]);
  });

  it('shows no rows after a failed request — there is no fallback data', () => {
    expect(rowsForDisplay({ phase: 'error', message: 'שגיאה' })).toEqual([]);
  });
});
