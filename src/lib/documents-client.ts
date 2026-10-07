/**
 * Server-only client for Workflow B (`GET /webhook/documents`).
 *
 * Per root `CONTRACT.md`: sends GET with the `x-api-key` header (§7), enforces
 * the 90,000 ms timeout (§1), validates the flat array of rows (§4), and
 * classifies failures so the route can answer with a sanitized message and no
 * manufactured `error_code` (§11).
 *
 * Nothing from the upstream response, the URL, the secret, or the thrown error
 * is returned or logged — the caller receives only a failure label.
 */

import { getEnv } from './env';
import { buildN8nUrl } from './n8n-url';
import { documentsResponseSchema, type DocumentRecord } from './documents-contract';

const REQUEST_TIMEOUT_MS = 90_000;

export type DocumentsFetchFailure =
  | 'misconfigured'
  | 'unauthorized'
  | 'timeout'
  | 'unreachable'
  | 'upstream'
  | 'malformed';

export type DocumentsFetchResult =
  | { ok: true; documents: DocumentRecord[] }
  | { ok: false; failure: DocumentsFetchFailure };

export async function fetchDocuments(): Promise<DocumentsFetchResult> {
  let url: URL;
  let secret: string;

  try {
    url = buildN8nUrl(getEnv('N8N_BASE_URL'), getEnv('N8N_DOCUMENTS_PATH'));
    secret = getEnv('N8N_SECRET');
  } catch {
    return { ok: false, failure: 'misconfigured' };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'x-api-key': secret, accept: 'application/json' },
      signal: controller.signal,
      cache: 'no-store',
    });

    // §7: 401 and 403 are both reported to the browser as 401 UNAUTHORIZED.
    if (response.status === 401 || response.status === 403) {
      return { ok: false, failure: 'unauthorized' };
    }

    if (!response.ok) {
      return { ok: false, failure: 'upstream' };
    }

    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      return { ok: false, failure: 'malformed' };
    }

    const parsed = documentsResponseSchema.safeParse(payload);
    if (!parsed.success) {
      return { ok: false, failure: 'malformed' };
    }

    return { ok: true, documents: parsed.data };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return { ok: false, failure: 'timeout' };
    }
    return { ok: false, failure: 'unreachable' };
  } finally {
    clearTimeout(timeout);
  }
}
