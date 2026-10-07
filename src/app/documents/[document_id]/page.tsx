import { DocumentDetail } from '@/components/document-detail';
import { decodeDocumentId } from '@/lib/document-detail-view';

/**
 * F6 detail screen. The route is an approved engineering decision — the sources
 * define API endpoints and screen names, not application routes.
 *
 * This server page only resolves the requested `document_id` and hands it to
 * the client component, which loads the live record through the same-origin
 * `GET /api/documents` and owns every loading, error, not-found and review
 * state. No mock record is read here. A segment that cannot be decoded becomes
 * `null` and renders the not-found state without echoing it.
 *
 * `params` is a Promise in this Next version (see
 * `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`).
 */
export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ document_id: string }>;
}) {
  const { document_id } = await params;
  const documentId = decodeDocumentId(document_id);

  // A new id starts from a fresh component, so no state leaks between records.
  return <DocumentDetail key={documentId ?? ''} documentId={documentId} />;
}
