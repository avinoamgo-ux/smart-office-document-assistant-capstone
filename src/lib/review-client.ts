/**
 * Server-only client for Workflow C (`POST /webhook/review`).
 *
 * Per root `CONTRACT.md`: JSON with the `x-api-key` header attached
 * server-side (§7); the 90,000 ms timeout (§1); the §5.1 request validated
 * before anything is sent; the §5.2 success shape validated, including that
 * the echoed `document_id` is the one submitted; and failures classified so a
 * route can answer with a sanitized message and no manufactured `error_code`
 * (§5.3, §11).
 *
 * A 404 counts as `not_found` only when its body is the §5.3 shape. n8n also
 * answers 404 for a webhook that is not registered (for example an inactive
 * workflow), and that must not read as "no such document".
 *
 * Nothing from the upstream body, the URL, the secret or a thrown error is
 * returned or logged — the caller receives only a failure label.
 */

import { getEnv } from './env';
import { buildN8nUrl } from './n8n-url';
import {
  reviewNotFoundSchema,
  reviewRequestSchema,
  reviewResponseSchema,
  type ReviewRequest,
  type ReviewResponse,
} from './review-contract';

const REQUEST_TIMEOUT_MS = 90_000;

export type ReviewFailure =
  | 'invalid_request'
  | 'misconfigured'
  | 'unauthorized'
  | 'not_found'
  | 'timeout'
  | 'unreachable'
  | 'upstream'
  | 'malformed';

export type ReviewResult =
  | { ok: true; review: ReviewResponse }
  | { ok: false; failure: ReviewFailure };

export async function submitReview(body: ReviewRequest): Promise<ReviewResult> {
  const request = reviewRequestSchema.safeParse(body);
  if (!request.success) {
    return { ok: false, failure: 'invalid_request' };
  }

  let url: URL;
  let secret: string;

  try {
    url = buildN8nUrl(getEnv('N8N_BASE_URL'), getEnv('N8N_REVIEW_PATH'));
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
      body: JSON.stringify(request.data),
      signal: controller.signal,
      cache: 'no-store',
    });

    // §7: 401 and 403 are both reported to the browser as 401 UNAUTHORIZED.
    if (response.status === 401 || response.status === 403) {
      return { ok: false, failure: 'unauthorized' };
    }

    let payload: unknown = null;
    let parsedJson = true;
    try {
      payload = await response.json();
    } catch {
      parsedJson = false;
    }

    if (response.status === 404) {
      const notFound = parsedJson && reviewNotFoundSchema.safeParse(payload).success;
      return { ok: false, failure: notFound ? 'not_found' : 'upstream' };
    }

    if (!response.ok) {
      return { ok: false, failure: 'upstream' };
    }

    if (!parsedJson) {
      return { ok: false, failure: 'malformed' };
    }

    const parsed = reviewResponseSchema.safeParse(payload);
    if (!parsed.success || parsed.data.document_id !== request.data.document_id) {
      return { ok: false, failure: 'malformed' };
    }

    return { ok: true, review: parsed.data };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return { ok: false, failure: 'timeout' };
    }
    return { ok: false, failure: 'unreachable' };
  } finally {
    clearTimeout(timeout);
  }
}
