import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from './route';

const BASE_URL = 'https://n8n.invalid/webhook';
const PROCESS_PATH = '/process-document';
const SECRET = 'test-secret-not-a-real-key';

const PDF_MIME = 'application/pdf';
const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

const smallBase64 = Buffer.from('%PDF-1.4 minimal fixture').toString('base64');

/** Length-only fixture: 13_981_024 base64 chars decode to just over 10 MB. */
const oversizedBase64 = 'A'.repeat(13_981_024);

const validRequest = {
  file_name: 'invoice-4471.pdf',
  mime_type: PDF_MIME,
  file_base64: smallBase64,
  submitted_by: 'dana@office.test',
};

const upstreamSuccess = {
  status: 'processed',
  document_id: 'exec-1043',
  file_name: 'invoice-4471.pdf',
  file_link: 'https://example.com/file/d/1a2b3c/view',
  received_at: '2026-09-24T09:24:00Z',
  fields: {
    document_type: 'invoice',
    sender_or_company: 'Nordic Supplies Ltd',
    summary: 'Invoice for office chairs delivered in February.',
    requested_action: 'Approve and pay invoice 4471',
    deadline: '12 March 2026',
    urgency: 'High',
    department: 'Finance',
  },
  notification_sent: true,
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

function postRequest(body: unknown) {
  return new NextRequest('http://localhost/api/process-document', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/process-document — Smart Office upload', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.unstubAllGlobals();
    process.env = {
      ...originalEnv,
      N8N_BASE_URL: BASE_URL,
      N8N_PROCESS_PATH: PROCESS_PATH,
      N8N_SECRET: SECRET,
    };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('forwards the contract body as JSON with the secret only in x-api-key and returns 200', async () => {
    const fetchSpy = stubFetch(upstreamJson(200, upstreamSuccess));

    const response = await POST(postRequest(validRequest));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual(upstreamSuccess);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, init] = fetchSpy.mock.calls[0];
    expect(String(url)).toBe('https://n8n.invalid/webhook/process-document');
    expect(init?.method).toBe('POST');

    const headers = new Headers(init?.headers);
    expect(headers.get('x-api-key')).toBe(SECRET);
    expect(headers.get('authorization')).toBeNull();
    expect(headers.get('content-type')).toContain('application/json');

    // The forwarded body is the contract JSON, not multipart.
    expect(JSON.parse(String(init?.body))).toEqual(validRequest);
  });

  it('accepts the exact DOCX and TXT mime types', async () => {
    for (const mime of [DOCX_MIME, 'text/plain']) {
      stubFetch(upstreamJson(200, upstreamSuccess));
      const response = await POST(postRequest({ ...validRequest, mime_type: mime }));
      expect(response.status).toBe(200);
    }
  });

  it('rejects an unsupported mime type with UNSUPPORTED_FILE_TYPE and no n8n call', async () => {
    const fetchSpy = stubFetch(upstreamJson(200, upstreamSuccess));

    const response = await POST(postRequest({ ...validRequest, mime_type: 'image/png' }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error_code).toBe('UNSUPPORTED_FILE_TYPE');
    expect(typeof body.message).toBe('string');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('rejects an oversized payload with 413, no error_code and no n8n call', async () => {
    const fetchSpy = stubFetch(upstreamJson(200, upstreamSuccess));

    const response = await POST(
      postRequest({ ...validRequest, file_base64: oversizedBase64 }),
    );
    const body = await response.json();

    expect(response.status).toBe(413);
    expect(body).not.toHaveProperty('error_code');
    expect(typeof body.message).toBe('string');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('rejects a missing required field with 400, no error_code and no n8n call', async () => {
    const fetchSpy = stubFetch(upstreamJson(200, upstreamSuccess));

    const response = await POST(postRequest({ mime_type: PDF_MIME, file_base64: smallBase64 }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).not.toHaveProperty('error_code');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('rejects a data-URL prefix, which the contract forbids', async () => {
    const fetchSpy = stubFetch(upstreamJson(200, upstreamSuccess));

    const response = await POST(
      postRequest({ ...validRequest, file_base64: `data:${PDF_MIME};base64,${smallBase64}` }),
    );

    expect(response.status).toBe(400);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('rejects a body that is not valid base64', async () => {
    const fetchSpy = stubFetch(upstreamJson(200, upstreamSuccess));

    const response = await POST(postRequest({ ...validRequest, file_base64: 'not base64 !!!' }));

    expect(response.status).toBe(400);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('passes through the documented upstream EMPTY_DOCUMENT code as 400', async () => {
    stubFetch(upstreamJson(400, { status: 'error', error_code: 'EMPTY_DOCUMENT', message: 'x' }));

    const response = await POST(postRequest(validRequest));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error_code).toBe('EMPTY_DOCUMENT');
  });

  it('passes through the documented upstream EXTRACTION_FAILED code as 500', async () => {
    stubFetch(
      upstreamJson(500, { status: 'error', error_code: 'EXTRACTION_FAILED', message: 'x' }),
    );

    const response = await POST(postRequest(validRequest));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error_code).toBe('EXTRACTION_FAILED');
  });

  it('normalizes upstream 401 and 403 to 401 UNAUTHORIZED', async () => {
    for (const status of [401, 403]) {
      stubFetch(upstreamJson(status, { message: 'invalid api key for webhook abc' }));

      const response = await POST(postRequest(validRequest));
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.error_code).toBe('UNAUTHORIZED');
      expect(JSON.stringify(body)).not.toContain('webhook abc');
    }
  });

  it('does not echo an undocumented upstream error_code', async () => {
    stubFetch(
      upstreamJson(500, { status: 'error', error_code: 'SHEET_QUOTA_EXCEEDED', message: 'raw' }),
    );

    const response = await POST(postRequest(validRequest));
    const body = await response.json();

    expect(response.status).toBe(502);
    expect(body).not.toHaveProperty('error_code');
    expect(JSON.stringify(body)).not.toContain('SHEET_QUOTA_EXCEEDED');
  });

  it('rejects a success payload that does not match the contract shape', async () => {
    stubFetch(
      upstreamJson(200, {
        ...upstreamSuccess,
        fields: { ...upstreamSuccess.fields, urgency: 'Urgent' },
      }),
    );

    const response = await POST(postRequest(validRequest));
    const body = await response.json();

    expect(response.status).toBe(502);
    expect(body).not.toHaveProperty('error_code');
  });

  it('rejects a success payload that is missing the fields object', async () => {
    const withoutFields: Record<string, unknown> = { ...upstreamSuccess };
    delete withoutFields.fields;
    stubFetch(upstreamJson(200, withoutFields));

    const response = await POST(postRequest(validRequest));

    expect(response.status).toBe(502);
  });

  it('maps an aborted request to 504 and an unreachable upstream to 502', async () => {
    stubFetch(async () => {
      throw Object.assign(new Error('aborted'), { name: 'AbortError' });
    });
    expect((await POST(postRequest(validRequest))).status).toBe(504);

    stubFetch(async () => {
      throw new Error('getaddrinfo ENOTFOUND n8n.invalid');
    });
    const response = await POST(postRequest(validRequest));
    expect(response.status).toBe(502);
    expect(JSON.stringify(await response.json())).not.toContain('n8n.invalid');
  });

  it('times the upstream out at exactly 90,000 ms and returns the fixed 504', async () => {
    // Only the client's timer is faked; setImmediate stays real so the request
    // body can be read and the request can reach fetch before the clock moves.
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    try {
      let signal: AbortSignal | undefined;
      const fetchSpy = stubFetch(
        (_input, init) =>
          new Promise((_resolve, reject) => {
            signal = init?.signal ?? undefined;
            signal?.addEventListener('abort', () => {
              reject(Object.assign(new Error('aborted'), { name: 'AbortError' }));
            });
          }),
      );

      let settled = false;
      const pending = POST(postRequest(validRequest)).finally(() => {
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
        message: 'עיבוד המסמך לא הסתיים בזמן. אפשר לנסות לשלוח שוב.',
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
    const fetchSpy = stubFetch(upstreamJson(200, upstreamSuccess));

    const response = await POST(postRequest(validRequest));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(JSON.stringify(body)).not.toContain('N8N_SECRET');
  });

  it('never leaks the secret or the upstream host to the client', async () => {
    stubFetch(upstreamJson(200, upstreamSuccess));

    const response = await POST(postRequest(validRequest));
    const serialized = JSON.stringify(await response.json());

    expect(serialized).not.toContain(SECRET);
    expect(serialized).not.toContain('n8n.invalid');
  });
});
