import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { submitReview } from './review-client';
import type { ReviewRequest } from './review-contract';

const BASE_URL = 'https://n8n.invalid/webhook';
const REVIEW_PATH = '/review';
const SECRET = 'test-secret-not-a-real-key';

const validRequest: ReviewRequest = {
  document_id: 'exec-1043',
  status: 'Reviewed',
  reviewed_by: 'Dana Example',
  review_note: 'Payment approved',
};

const upstreamSuccess = { status: 'updated', document_id: 'exec-1043' };

type FetchImpl = (input: RequestInfo | URL, init?: RequestInit) => Promise<unknown>;

function stubFetch(impl: FetchImpl) {
  const spy = vi.fn(impl);
  vi.stubGlobal('fetch', spy);
  return spy;
}

function upstreamJson(status: number, body: unknown) {
  return async () => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  });
}

function upstreamNotJson(status: number) {
  return async () => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => {
      throw new SyntaxError('Unexpected token');
    },
  });
}

describe('submitReview — Workflow C client', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.unstubAllGlobals();
    process.env = {
      ...originalEnv,
      N8N_BASE_URL: BASE_URL,
      N8N_REVIEW_PATH: REVIEW_PATH,
      N8N_SECRET: SECRET,
    };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('posts the contract body as JSON with the secret only in x-api-key', async () => {
    const fetchSpy = stubFetch(upstreamJson(200, upstreamSuccess));

    const result = await submitReview(validRequest);

    expect(result).toEqual({ ok: true, review: upstreamSuccess });
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    const [url, init] = fetchSpy.mock.calls[0];
    // Synthetic fixture host; the assertion never prints a configured value.
    expect(String(url)).toBe('https://n8n.invalid/webhook/review');
    expect(init?.method).toBe('POST');

    const headers = new Headers(init?.headers);
    expect(headers.get('x-api-key')).toBe(SECRET);
    expect(headers.get('authorization')).toBeNull();
    expect(headers.get('content-type')).toBe('application/json');

    expect(JSON.parse(String(init?.body))).toEqual(validRequest);
  });

  it('sends a request without review_note unchanged', async () => {
    const fetchSpy = stubFetch(upstreamJson(200, upstreamSuccess));
    const withoutNote: ReviewRequest = {
      document_id: validRequest.document_id,
      status: validRequest.status,
      reviewed_by: validRequest.reviewed_by,
    };

    const result = await submitReview(withoutNote);

    expect(result.ok).toBe(true);
    expect(JSON.parse(String(fetchSpy.mock.calls[0][1]?.body))).toEqual(withoutNote);
  });

  it('refuses an invalid request before any network call', async () => {
    const fetchSpy = stubFetch(upstreamJson(200, upstreamSuccess));

    const invalid = [
      { ...validRequest, document_id: '' },
      { ...validRequest, reviewed_by: '' },
      { ...validRequest, status: 'Processed' },
      { ...validRequest, review_note: 'a'.repeat(201) },
    ];

    for (const body of invalid) {
      expect(await submitReview(body as ReviewRequest)).toEqual({
        ok: false,
        failure: 'invalid_request',
      });
    }
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('treats a mismatched echoed document_id as malformed', async () => {
    stubFetch(upstreamJson(200, { status: 'updated', document_id: 'exec-9999' }));
    expect(await submitReview(validRequest)).toEqual({ ok: false, failure: 'malformed' });
  });

  it('treats a non-JSON or wrong-shape success as malformed', async () => {
    stubFetch(upstreamNotJson(200));
    expect(await submitReview(validRequest)).toEqual({ ok: false, failure: 'malformed' });

    stubFetch(upstreamJson(200, { status: 'processed', document_id: 'exec-1043' }));
    expect(await submitReview(validRequest)).toEqual({ ok: false, failure: 'malformed' });

    stubFetch(upstreamJson(200, [upstreamSuccess]));
    expect(await submitReview(validRequest)).toEqual({ ok: false, failure: 'malformed' });
  });

  it('maps both 401 and 403 to unauthorized', async () => {
    for (const status of [401, 403]) {
      stubFetch(upstreamJson(status, { message: 'Authorization data is wrong!' }));
      expect(await submitReview(validRequest)).toEqual({ ok: false, failure: 'unauthorized' });
    }
  });

  it('maps a 404 with the contract body to not_found', async () => {
    stubFetch(upstreamJson(404, { status: 'error', message: 'Document not found.' }));
    expect(await submitReview(validRequest)).toEqual({ ok: false, failure: 'not_found' });
  });

  it('does not read an unregistered-webhook 404 as a missing document', async () => {
    stubFetch(upstreamJson(404, { code: 404, message: 'The requested webhook is not registered.' }));
    expect(await submitReview(validRequest)).toEqual({ ok: false, failure: 'upstream' });

    stubFetch(upstreamNotJson(404));
    expect(await submitReview(validRequest)).toEqual({ ok: false, failure: 'upstream' });
  });

  it('maps any other non-2xx response to upstream', async () => {
    for (const status of [400, 500, 502]) {
      stubFetch(upstreamJson(status, { status: 'error', message: 'internal detail' }));
      expect(await submitReview(validRequest)).toEqual({ ok: false, failure: 'upstream' });
    }
  });

  it('aborts after exactly 90,000 ms and reports a timeout', async () => {
    vi.useFakeTimers();
    let signal: AbortSignal | undefined;
    stubFetch(
      (_input, init) =>
        new Promise((_resolve, reject) => {
          signal = init?.signal ?? undefined;
          signal?.addEventListener('abort', () => {
            reject(Object.assign(new Error('aborted'), { name: 'AbortError' }));
          });
        }),
    );

    const pending = submitReview(validRequest);

    await vi.advanceTimersByTimeAsync(89_999);
    expect(signal?.aborted).toBe(false);

    await vi.advanceTimersByTimeAsync(1);
    expect(await pending).toEqual({ ok: false, failure: 'timeout' });
  });

  it('maps a network failure to unreachable', async () => {
    stubFetch(async () => {
      throw new TypeError('fetch failed');
    });
    expect(await submitReview(validRequest)).toEqual({ ok: false, failure: 'unreachable' });
  });

  it('reports missing configuration without a network call', async () => {
    for (const key of ['N8N_BASE_URL', 'N8N_REVIEW_PATH', 'N8N_SECRET']) {
      const fetchSpy = stubFetch(upstreamJson(200, upstreamSuccess));
      process.env = {
        ...originalEnv,
        N8N_BASE_URL: BASE_URL,
        N8N_REVIEW_PATH: REVIEW_PATH,
        N8N_SECRET: SECRET,
      };
      delete process.env[key];

      expect(await submitReview(validRequest)).toEqual({ ok: false, failure: 'misconfigured' });
      expect(fetchSpy).not.toHaveBeenCalled();
    }
  });

  it('reports an unsafe review path as misconfigured', async () => {
    const fetchSpy = stubFetch(upstreamJson(200, upstreamSuccess));
    process.env.N8N_REVIEW_PATH = '../review';

    expect(await submitReview(validRequest)).toEqual({ ok: false, failure: 'misconfigured' });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('never returns the upstream body, URL or secret in a failure', async () => {
    stubFetch(upstreamJson(500, { status: 'error', message: 'internal detail' }));

    const serialized = JSON.stringify(await submitReview(validRequest));

    expect(serialized).not.toContain('internal detail');
    expect(serialized).not.toContain('n8n.invalid');
    expect(serialized).not.toContain(SECRET);
  });
});
