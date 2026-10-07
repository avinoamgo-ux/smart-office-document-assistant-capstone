import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from './route';

const BASE_URL = 'https://n8n.invalid/webhook';
const DOCUMENTS_PATH = '/documents';
const SECRET = 'test-secret-not-a-real-key';

const validRow = {
  document_id: 'exec-1044',
  received_at: '2026-09-23T07:05:00Z',
  file_name: 'invoice-4471.pdf',
  file_link: 'https://example.com/file/d/1a2b3c/view',
  document_type: 'invoice',
  sender_or_company: 'Nordic Supplies Ltd',
  summary: 'Invoice for office chairs delivered in February.',
  requested_action: 'Approve and pay invoice 4471',
  deadline: '24 September 2026',
  urgency: 'High',
  department: 'Finance',
  status: 'Needs Review',
};

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

describe('GET /api/documents — Smart Office documents list', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.unstubAllGlobals();
    process.env = {
      ...originalEnv,
      N8N_BASE_URL: BASE_URL,
      N8N_DOCUMENTS_PATH: DOCUMENTS_PATH,
      N8N_SECRET: SECRET,
    };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('returns the validated rows and sends the secret only as an x-api-key request header', async () => {
    const fetchSpy = stubFetch(upstreamJson(200, [validRow]));

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual([validRow]);

    // Outgoing request: GET, correct URL, secret in x-api-key, no Bearer scheme.
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, init] = fetchSpy.mock.calls[0];
    expect(String(url)).toBe('https://n8n.invalid/webhook/documents');
    expect(init?.method).toBe('GET');
    const headers = new Headers(init?.headers);
    expect(headers.get('x-api-key')).toBe(SECRET);
    expect(headers.get('authorization')).toBeNull();
  });

  it('never leaks the upstream URL or the secret to the client', async () => {
    stubFetch(upstreamJson(200, [validRow]));

    const response = await GET();
    const serialized = JSON.stringify(await response.json());

    expect(serialized).not.toContain(SECRET);
    expect(serialized).not.toContain('n8n.invalid');
    expect(response.headers.get('x-api-key')).toBeNull();
  });

  it('rejects a payload that is not an array with 502 and no error_code', async () => {
    stubFetch(upstreamJson(200, { items: [validRow], page: 1, total: 1 }));

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(502);
    expect(body.status).toBe('error');
    expect(body).not.toHaveProperty('error_code');
    expect(typeof body.message).toBe('string');
  });

  it('rejects a row with an out-of-contract enum value', async () => {
    stubFetch(upstreamJson(200, [{ ...validRow, urgency: 'Urgent' }]));

    const response = await GET();

    expect(response.status).toBe(502);
  });

  it('rejects a row that is missing a required document field', async () => {
    const incomplete: Record<string, unknown> = { ...validRow };
    delete incomplete.department;
    stubFetch(upstreamJson(200, [incomplete]));

    const response = await GET();

    expect(response.status).toBe(502);
  });

  it('normalizes an upstream 401 to 401 UNAUTHORIZED', async () => {
    stubFetch(upstreamJson(401, { message: 'n8n says: invalid api key for webhook abc' }));

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error_code).toBe('UNAUTHORIZED');
    expect(JSON.stringify(body)).not.toContain('webhook abc');
  });

  it('normalizes an upstream 403 to the same 401 UNAUTHORIZED', async () => {
    stubFetch(upstreamJson(403, { message: 'forbidden' }));

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error_code).toBe('UNAUTHORIZED');
  });

  it('maps an upstream 500 to a sanitized 502 without the upstream body', async () => {
    stubFetch(upstreamJson(500, { stack: 'Error: at /root/n8n/nodes/GoogleSheets.js:42' }));

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(502);
    expect(body).not.toHaveProperty('error_code');
    expect(JSON.stringify(body)).not.toContain('GoogleSheets');
  });

  it('maps an unreachable upstream to 502', async () => {
    stubFetch(async () => {
      throw new Error('getaddrinfo ENOTFOUND n8n.invalid');
    });

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(502);
    expect(JSON.stringify(body)).not.toContain('n8n.invalid');
  });

  it('maps an aborted request to 504', async () => {
    stubFetch(async () => {
      throw Object.assign(new Error('The operation was aborted'), { name: 'AbortError' });
    });

    const response = await GET();

    expect(response.status).toBe(504);
  });

  it('times the upstream out at exactly 90,000 ms and returns the fixed 504', async () => {
    // Only the client's timer is faked; setImmediate stays real so the request
    // can reach fetch before the clock moves.
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    try {
      let signal: AbortSignal | undefined;
      const fetchSpy = stubFetch(
        (_input, init) =>
          new Promise((_resolve, reject) => {
            signal = init?.signal ?? undefined;
            signal?.addEventListener('abort', () => {
              reject(Object.assign(new Error('The operation was aborted'), { name: 'AbortError' }));
            });
          }),
      );

      let settled = false;
      const pending = GET().finally(() => {
        settled = true;
      });
      for (let turn = 0; turn < 50 && fetchSpy.mock.calls.length === 0; turn += 1) {
        await new Promise<void>((resolve) => setImmediate(resolve));
      }
      expect(fetchSpy).toHaveBeenCalledTimes(1);

      await vi.advanceTimersByTimeAsync(89_999);
      expect(signal?.aborted).toBe(false);
      expect(settled).toBe(false);

      await vi.advanceTimersByTimeAsync(1);
      expect(signal?.aborted).toBe(true);

      const response = await pending;
      const body = await response.json();
      expect(response.status).toBe(504);
      expect(body).toEqual({
        status: 'error',
        message: 'מערכת האוטומציה לא השיבה בזמן. נסו לרענן בעוד רגע.',
      });
      const serialized = JSON.stringify(body);
      for (const leak of [SECRET, 'n8n.invalid', 'AbortError', 'aborted', 'signal']) {
        expect(serialized).not.toContain(leak);
      }
    } finally {
      vi.useRealTimers();
    }
  });

  it('returns 500 without configuration detail when the secret is not set', async () => {
    delete process.env.N8N_SECRET;
    const fetchSpy = stubFetch(upstreamJson(200, [validRow]));

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(JSON.stringify(body)).not.toContain('N8N_SECRET');
  });
});
