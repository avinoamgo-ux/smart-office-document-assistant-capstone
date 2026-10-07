import { readFileSync } from 'node:fs';
import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from './route';
import { submitReview, type ReviewFailure } from '../../../lib/review-client';

vi.mock('../../../lib/review-client', () => ({
  submitReview: vi.fn(),
}));

// Synthetic values only; none of them is a configured value.
const UPSTREAM_MARKER = 'synthetic-upstream-marker-7f3a';
const UPSTREAM_URL = 'https://n8n.invalid/webhook/review';
const SECRET = 'test-secret-not-a-real-key';

const validRequest = {
  document_id: 'exec-1043',
  status: 'Reviewed',
  reviewed_by: 'Dana Example',
  review_note: 'Payment approved',
};

const success = { status: 'updated', document_id: 'exec-1043' };

function postRequest(body: unknown) {
  return new NextRequest('http://localhost/api/review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function rawPostRequest(rawBody: string) {
  return new NextRequest('http://localhost/api/review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: rawBody,
  });
}

function without(key: keyof typeof validRequest) {
  const copy: Record<string, string> = { ...validRequest };
  delete copy[key];
  return copy;
}

function failWith(failure: ReviewFailure) {
  vi.mocked(submitReview).mockResolvedValue({ ok: false, failure });
}

async function expectBadRequest(body: unknown) {
  const response = await POST(postRequest(body));
  expect(response.status).toBe(400);
  expect(await response.json()).toEqual({ status: 'error', message: expect.any(String) });
}

describe('POST /api/review — CONTRACT.md §5', () => {
  let consoleSpies: Array<ReturnType<typeof vi.spyOn>>;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleSpies = [
      vi.spyOn(console, 'log').mockImplementation(() => {}),
      vi.spyOn(console, 'info').mockImplementation(() => {}),
      vi.spyOn(console, 'warn').mockImplementation(() => {}),
      vi.spyOn(console, 'error').mockImplementation(() => {}),
    ];
  });

  afterEach(() => {
    for (const spy of consoleSpies) {
      expect(spy).not.toHaveBeenCalled();
    }
    vi.restoreAllMocks();
  });

  describe('request validation — 400 before any upstream call', () => {
    it('rejects malformed JSON', async () => {
      const response = await POST(rawPostRequest('{not valid json'));
      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ status: 'error', message: expect.any(String) });
      expect(submitReview).not.toHaveBeenCalled();
    });

    it('rejects a missing or empty document_id', async () => {
      await expectBadRequest(without('document_id'));
      await expectBadRequest({ ...validRequest, document_id: '' });
      expect(submitReview).not.toHaveBeenCalled();
    });

    it('rejects an invalid status, including Processed', async () => {
      await expectBadRequest(without('status'));
      for (const status of ['Processed', 'reviewed', 'APPROVED', '']) {
        await expectBadRequest({ ...validRequest, status });
      }
      expect(submitReview).not.toHaveBeenCalled();
    });

    it('rejects a missing or empty reviewed_by', async () => {
      await expectBadRequest(without('reviewed_by'));
      await expectBadRequest({ ...validRequest, reviewed_by: '' });
      expect(submitReview).not.toHaveBeenCalled();
    });

    it('rejects a review_note over 200 characters', async () => {
      await expectBadRequest({ ...validRequest, review_note: 'a'.repeat(201) });
      expect(submitReview).not.toHaveBeenCalled();
    });
  });

  describe('success — 200', () => {
    it('calls submitReview exactly once with the validated request', async () => {
      vi.mocked(submitReview).mockResolvedValue({ ok: true, review: success } as never);

      const response = await POST(postRequest(validRequest));

      expect(response.status).toBe(200);
      expect(submitReview).toHaveBeenCalledTimes(1);
      expect(submitReview).toHaveBeenCalledWith(validRequest);
    });

    it('forwards a request without review_note unchanged', async () => {
      vi.mocked(submitReview).mockResolvedValue({ ok: true, review: success } as never);
      const withoutNote = without('review_note');

      const response = await POST(postRequest(withoutNote));

      expect(response.status).toBe(200);
      expect(submitReview).toHaveBeenCalledTimes(1);
      expect(submitReview).toHaveBeenCalledWith(withoutNote);
    });

    it('returns exactly the §5.2 body', async () => {
      vi.mocked(submitReview).mockResolvedValue({ ok: true, review: success } as never);

      const response = await POST(postRequest(validRequest));

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ status: 'updated', document_id: 'exec-1043' });
    });
  });

  describe('client failures — approved statuses and bodies', () => {
    it('invalid_request → 400 without error_code', async () => {
      failWith('invalid_request');
      const response = await POST(postRequest(validRequest));
      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ status: 'error', message: expect.any(String) });
    });

    it('unauthorized → 401 with UNAUTHORIZED', async () => {
      failWith('unauthorized');
      const response = await POST(postRequest(validRequest));
      expect(response.status).toBe(401);
      expect(await response.json()).toEqual({
        status: 'error',
        error_code: 'UNAUTHORIZED',
        message: expect.any(String),
      });
    });

    it('not_found → 404 with the exact contract body', async () => {
      failWith('not_found');
      const response = await POST(postRequest(validRequest));
      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({ status: 'error', message: 'Document not found.' });
    });

    const statusByFailure: Array<[ReviewFailure, number]> = [
      ['misconfigured', 500],
      ['timeout', 504],
      ['unreachable', 502],
      ['upstream', 502],
      ['malformed', 502],
    ];

    for (const [failure, expectedStatus] of statusByFailure) {
      it(`${failure} → ${expectedStatus} without error_code`, async () => {
        failWith(failure);
        const response = await POST(postRequest(validRequest));
        expect(response.status).toBe(expectedStatus);
        expect(await response.json()).toEqual({ status: 'error', message: expect.any(String) });
      });
    }

    it('returns error_code on no failure other than unauthorized, and never 503', async () => {
      const failures: ReviewFailure[] = [
        'invalid_request',
        'misconfigured',
        'not_found',
        'timeout',
        'unreachable',
        'upstream',
        'malformed',
      ];

      for (const failure of failures) {
        failWith(failure);
        const response = await POST(postRequest(validRequest));
        const body = await response.json();
        expect(body).not.toHaveProperty('error_code');
        expect(response.status).not.toBe(503);
      }
    });
  });

  describe('sanitization', () => {
    it('exposes no upstream marker, URL or secret, even if the client result carried one', async () => {
      const leaky = { detail: UPSTREAM_MARKER, url: UPSTREAM_URL, secret: SECRET };
      const failures: ReviewFailure[] = [
        'invalid_request',
        'misconfigured',
        'unauthorized',
        'not_found',
        'timeout',
        'unreachable',
        'upstream',
        'malformed',
      ];

      for (const failure of failures) {
        vi.mocked(submitReview).mockResolvedValue({ ok: false, failure, ...leaky } as never);
        const text = await (await POST(postRequest(validRequest))).text();
        expect(text).not.toContain(UPSTREAM_MARKER);
        expect(text).not.toContain('n8n.invalid');
        expect(text).not.toContain(SECRET);
      }

      vi.mocked(submitReview).mockResolvedValue({
        ok: true,
        review: { ...success, ...leaky },
        ...leaky,
      } as never);
      const response = await POST(postRequest(validRequest));
      expect(await response.json()).toEqual(success);
    });

    it('route.ts carries no legacy field, error code, proxy or env access', () => {
      const source = readFileSync(new URL('./route.ts', import.meta.url), 'utf8');
      const forbidden = [
        'mapping_id',
        'reviewer_id',
        'reviewer_name',
        'decision',
        'correction',
        'intent_seal',
        'IntentSeal',
        'APPROVED',
        'INVALID_REVIEW_REQUEST',
        'MISSING_REVIEWER_IDENTITY',
        'MISSING_DECISION',
        'CONFIGURATION_ERROR',
        'UPSTREAM_TIMEOUT',
        'UPSTREAM_UNAVAILABLE',
        'INVALID_UPSTREAM_RESPONSE',
        'proxyToN8n',
        'mapReviewResponse',
        'n8n-client',
        'map-response',
        "lib/contracts'",
        'process.env',
        'getEnv',
        '503',
      ];

      for (const token of forbidden) {
        expect(source, `route.ts must not contain ${token}`).not.toContain(token);
      }
    });
  });
});
