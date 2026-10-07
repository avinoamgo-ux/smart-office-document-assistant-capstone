/**
 * Server-only client for Workflow A (`POST /webhook/process-document`).
 *
 * Per root `CONTRACT.md`: JSON at both hops with the file as base64 — never
 * multipart (§1, §12); the `x-api-key` header attached server-side (§7); the
 * 90,000 ms timeout (§1); the §3.2 success shape validated before anything
 * reaches the browser; and failures classified so the route can answer with
 * either a documented code or a sanitized message with none (§3.3, §11).
 *
 * Nothing from the upstream body, the URL, the secret or a thrown error is
 * returned or logged — the caller receives only a failure label.
 */

import { getEnv } from './env';
import { buildN8nUrl } from './n8n-url';
import {
  PASSTHROUGH_UPSTREAM_CODES,
  processDocumentResponseSchema,
  type PassthroughUpstreamCode,
  type ProcessDocumentRequest,
  type ProcessDocumentResponse,
} from './process-document-contract';

const REQUEST_TIMEOUT_MS = 90_000;

export type ProcessDocumentFailure =
  | 'misconfigured'
  | 'unauthorized'
  | 'timeout'
  | 'unreachable'
  | 'upstream'
  | 'malformed'
  | PassthroughUpstreamCode;

export type ProcessDocumentResult =
  | { ok: true; document: ProcessDocumentResponse }
  | { ok: false; failure: ProcessDocumentFailure };

function passthroughCodeOf(payload: unknown): PassthroughUpstreamCode | null {
  if (!payload || typeof payload !== 'object') return null;
  const code = (payload as Record<string, unknown>).error_code;
  if (typeof code !== 'string') return null;
  return (PASSTHROUGH_UPSTREAM_CODES as readonly string[]).includes(code)
    ? (code as PassthroughUpstreamCode)
    : null;
}

export async function submitDocument(
  body: ProcessDocumentRequest,
): Promise<ProcessDocumentResult> {
  let url: URL;
  let secret: string;

  try {
    url = buildN8nUrl(getEnv('N8N_BASE_URL'), getEnv('N8N_PROCESS_PATH'));
    secret = getEnv('N8N_SECRET');
  } catch {
    return { ok: false, failure: 'misconfigured' };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': secret,
        accept: 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
      cache: 'no-store',
    });

    // §7: 401 and 403 are both reported to the browser as 401 UNAUTHORIZED.
    if (response.status === 401 || response.status === 403) {
      return { ok: false, failure: 'unauthorized' };
    }

    let payload: unknown = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    if (!response.ok) {
      const code = passthroughCodeOf(payload);
      return { ok: false, failure: code ?? 'upstream' };
    }

    const parsed = processDocumentResponseSchema.safeParse(payload);
    if (!parsed.success) {
      return { ok: false, failure: 'malformed' };
    }

    return { ok: true, document: parsed.data };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return { ok: false, failure: 'timeout' };
    }
    return { ok: false, failure: 'unreachable' };
  } finally {
    clearTimeout(timeout);
  }
}
