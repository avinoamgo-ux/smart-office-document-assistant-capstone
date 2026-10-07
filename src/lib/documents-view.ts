import type {
  DocumentDepartment,
  DocumentRecord,
  DocumentStatus,
  DocumentType,
  DocumentUrgency,
} from './documents-contract';

/** Row shape and enums live in `documents-contract.ts`; re-exported for callers. */
export type {
  DocumentDepartment,
  DocumentRecord,
  DocumentStatus,
  DocumentType,
  DocumentUrgency,
} from './documents-contract';

export type DocumentFilters = {
  search: string;
  urgency: DocumentUrgency | 'all';
  documentType: DocumentType | 'all';
  department: DocumentDepartment | 'all';
  status: DocumentStatus | 'all';
};

export const EMPTY_FILTERS: DocumentFilters = {
  search: '',
  urgency: 'all',
  documentType: 'all',
  department: 'all',
  status: 'all',
};

/** The live `GET /api/documents` request, from mount onwards. */
export type ApiRequestState =
  | { phase: 'loading' }
  | { phase: 'loaded'; rows: readonly DocumentRecord[] }
  | { phase: 'error'; message: string };

const NO_ROWS: readonly DocumentRecord[] = [];

/**
 * Rows the dashboard is allowed to render: only a validated, loaded payload.
 * A pending or failed request yields no rows — there is no fallback data.
 */
export function rowsForDisplay(api: ApiRequestState): readonly DocumentRecord[] {
  return api.phase === 'loaded' ? api.rows : NO_ROWS;
}

/** Free-text search covers file name, sender and summary only (F5). */
function matchesSearch(row: DocumentRecord, term: string): boolean {
  const needle = term.trim().toLowerCase();
  if (needle.length === 0) return true;

  return [row.file_name, row.sender_or_company, row.summary].some((value) =>
    value.toLowerCase().includes(needle),
  );
}

function matchesFacets(row: DocumentRecord, filters: DocumentFilters): boolean {
  if (filters.urgency !== 'all' && row.urgency !== filters.urgency) return false;
  if (filters.documentType !== 'all' && row.document_type !== filters.documentType) return false;
  if (filters.department !== 'all' && row.department !== filters.department) return false;
  if (filters.status !== 'all' && row.status !== filters.status) return false;
  return true;
}

/**
 * Applies the F5 search and facet filters, then orders newest first (F4).
 * `received_at` is an ISO 8601 UTC string, so lexicographic comparison is a
 * correct chronological comparison and needs no Date parsing.
 */
export function selectDocuments(
  rows: readonly DocumentRecord[],
  filters: DocumentFilters,
): DocumentRecord[] {
  return rows
    .filter((row) => matchesSearch(row, filters.search) && matchesFacets(row, filters))
    .sort((a, b) => b.received_at.localeCompare(a.received_at));
}
