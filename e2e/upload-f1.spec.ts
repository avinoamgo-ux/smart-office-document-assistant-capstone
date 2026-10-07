import { test, expect, type Page, type Request } from '@playwright/test';
import {
  processDocumentResponseSchema,
  type ProcessDocumentResponse,
} from '../src/lib/process-document-contract';

/**
 * F1 — instructor Part 2 doc §7 F1 — plus the upload screen's F7 transport and
 * timeout failures, against intercepted transport.
 *
 * The form posts to the same-origin `/api/process-document` (`SPEC.md` §16 M5).
 * Every test installs its interceptions before navigation, so no request can
 * reach the real route handler, n8n, Google Sheets or Gmail. Every response here
 * is synthetic.
 */

const TXT_MIME = 'text/plain';
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const PROCESS_DOCUMENT_ROUTE = '**/api/process-document';

const SYNTHETIC_ERROR_MESSAGE_HE = 'הודעת שגיאה סינתטית לבדיקה: מערכת האוטומציה החזירה שגיאה.';

const SYNTHETIC_UPSTREAM_DETAIL = 'SYNTHETIC-UPSTREAM-DETAIL-MUST-NOT-RENDER';

/** What an interception saw. The base64 itself is never kept, only its decoded size. */
type Submission = {
  method: string;
  file_name: unknown;
  mime_type: unknown;
  decodedBytes: number;
  isBareBase64: boolean;
};

type SyntheticReply = { status: number; contentType: string; body: string };

/** `network` fails the request at the transport level; `never` holds it unanswered. */
type HandlerReply = SyntheticReply | 'network' | 'never';

function summarize(request: Request): Submission {
  let body: Record<string, unknown> = {};
  try {
    const parsed: unknown = request.postDataJSON();
    if (parsed && typeof parsed === 'object') body = parsed as Record<string, unknown>;
  } catch {
    body = {};
  }

  const base64 = typeof body.file_base64 === 'string' ? body.file_base64 : '';
  return {
    method: request.method(),
    file_name: body.file_name,
    mime_type: body.mime_type,
    decodedBytes: base64 ? Buffer.from(base64, 'base64').length : 0,
    isBareBase64: base64.length > 0 && !/^data:/i.test(base64),
  };
}

/**
 * Must be called before `page.goto`. The catch-all aborts and records any other
 * `/api/` request. Playwright runs the most recently registered matching route
 * first, so the process-document interception answers before the catch-all.
 */
async function interceptApi(
  page: Page,
  reply: (submission: Submission) => HandlerReply,
): Promise<{ submissions: Submission[]; blocked: string[] }> {
  const submissions: Submission[] = [];
  const blocked: string[] = [];

  await page.route('**/api/**', (route) => {
    blocked.push(new URL(route.request().url()).pathname);
    return route.abort();
  });

  await page.route(PROCESS_DOCUMENT_ROUTE, async (route) => {
    const submission = summarize(route.request());
    submissions.push(submission);
    if (submission.method !== 'POST') {
      return route.fulfill({ status: 405, contentType: 'application/json', body: '{}' });
    }
    const next = reply(submission);
    if (next === 'network') {
      await route.abort('failed').catch(() => {});
      return;
    }
    if (next === 'never') {
      await new Promise<void>(() => {});
      return;
    }
    return route.fulfill(next);
  });

  return { submissions, blocked };
}

/** Pauses the page clock at a known instant; no real time is waited. */
async function pauseClock(page: Page) {
  const now = await page.evaluate(() => Date.now());
  await page.clock.pauseAt(now + 1_000);
}

/** An event-loop flush through MessageChannel, which React uses; not a time wait. */
async function settle(page: Page) {
  for (let round = 0; round < 2; round += 1) {
    await page.evaluate(
      () =>
        new Promise<void>((resolve) => {
          const channel = new MessageChannel();
          channel.port1.onmessage = () => resolve();
          channel.port2.postMessage(null);
        }),
    );
  }
}

function json(status: number, body: unknown): SyntheticReply {
  return { status, contentType: 'application/json', body: JSON.stringify(body) };
}

/** Fully synthetic, and validated against the application's own schema. */
function syntheticProcessed(fileName: string): ProcessDocumentResponse {
  return processDocumentResponseSchema.parse({
    status: 'processed',
    document_id: 'synthetic-exec-0001',
    file_name: fileName,
    file_link: 'https://example.test/synthetic/file/SYN-0001/view',
    received_at: '2026-09-30T09:24:00.000Z',
    fields: {
      document_type: 'complaint',
      sender_or_company: 'Synthetic Retail Ltd',
      summary: 'Synthetic complaint about a late response, used only in tests.',
      requested_action: 'Reply to the synthetic customer',
      deadline: 'Not found',
      urgency: 'Medium',
      department: 'Support',
    },
    notification_sent: true,
  });
}

function fileInput(page: Page) {
  return page.getByLabel('בחרו מסמך אחד, או גררו אותו לאזור הזה');
}

/**
 * Next.js renders its own `role="alert"` route announcer outside `main`, so
 * live regions are scoped to the page's own content.
 */
function mainAlert(page: Page) {
  return page.getByRole('main').getByRole('alert');
}

function sendButton(page: Page) {
  return page.getByRole('button', { name: 'שליחת המסמך לעיבוד' });
}

function resultCard(page: Page) {
  return page.getByRole('region', { name: 'תוצאת העיבוד' });
}

const SEND_FAILED_MESSAGE_HE = 'השליחה לא הושלמה. בדקו את החיבור לרשת ונסו לשלוח שוב.';

const TIMEOUT_MESSAGE_HE = 'עיבוד המסמך לא הסתיים בזמן. אפשר לנסות לשלוח שוב.';

/** A held reply never settles, so its handler is detached without waiting. */
test.afterEach(async ({ page }) => {
  await page.unrouteAll({ behavior: 'ignoreErrors' });
});

test('the upload screen describes the secured server route and starts with nothing selected', async ({
  page,
}) => {
  const { submissions, blocked } = await interceptApi(page, (s) =>
    json(200, syntheticProcessed(String(s.file_name))),
  );
  await page.goto('/upload');

  await expect(page.getByRole('heading', { name: 'העלאת מסמך', level: 2 })).toBeVisible();

  const main = page.getByRole('main');
  await expect(main).toContainText('השרת מעביר אותו בצורה מאובטחת');
  await expect(main).toContainText('רק אחרי שתתקבל תשובה');
  await expect(main.getByText('מצב דמה')).toHaveCount(0);
  await expect(main.getByText('mock')).toHaveCount(0);

  await expect(page.getByText('לא נבחר מסמך.')).toBeVisible();
  await expect(sendButton(page)).toHaveCount(0);
  expect(submissions).toEqual([]);
  expect(blocked).toEqual([]);
});

test('a valid document shows its name and size, and sending posts it once as JSON', async ({
  page,
}) => {
  const { submissions, blocked } = await interceptApi(page, (s) =>
    json(200, syntheticProcessed(String(s.file_name))),
  );
  await page.goto('/upload');

  await fileInput(page).setInputFiles({
    name: 'complaint-late-response.txt',
    mimeType: TXT_MIME,
    buffer: Buffer.alloc(2048, 'a'),
  });

  await expect(page.getByText('complaint-late-response.txt')).toBeVisible();
  await expect(page.getByText('2.0 KB')).toBeVisible();
  await expect(mainAlert(page)).toHaveCount(0);

  await expect(sendButton(page)).toBeEnabled();
  await sendButton(page).click();

  // The result card itself is F3's subject and is asserted in upload-f3.spec.ts.
  await expect(resultCard(page)).toBeVisible();
  await expect(mainAlert(page)).toHaveCount(0);

  // CONTRACT.md §3.1: POST, the three fields, bare base64 of the exact file.
  expect(submissions).toEqual([
    {
      method: 'POST',
      file_name: 'complaint-late-response.txt',
      mime_type: TXT_MIME,
      decodedBytes: 2048,
      isBareBase64: true,
    },
  ]);
  expect(blocked).toEqual([]);
});

test('a sanitized route error is shown as an alert, and the file stays ready to resend', async ({
  page,
}) => {
  const { submissions, blocked } = await interceptApi(page, () =>
    json(502, { status: 'error', message: SYNTHETIC_ERROR_MESSAGE_HE }),
  );
  await page.goto('/upload');

  await fileInput(page).setInputFiles({
    name: 'invoice-4471.txt',
    mimeType: TXT_MIME,
    buffer: Buffer.alloc(1024, 'a'),
  });
  await sendButton(page).click();

  await expect(mainAlert(page)).toHaveText(SYNTHETIC_ERROR_MESSAGE_HE);
  await expect(resultCard(page)).toHaveCount(0);
  await expect(page.getByText('invoice-4471.txt')).toBeVisible();
  await expect(sendButton(page)).toBeEnabled();

  expect(submissions).toHaveLength(1);
  expect(blocked).toEqual([]);
});

test('a non-JSON reply gets the fixed message and never renders the reply body', async ({
  page,
}) => {
  const { submissions, blocked } = await interceptApi(page, () => ({
    status: 502,
    contentType: 'text/html',
    body: `<html><body>${SYNTHETIC_UPSTREAM_DETAIL}</body></html>`,
  }));
  await page.goto('/upload');

  await fileInput(page).setInputFiles({
    name: 'invoice-4471.txt',
    mimeType: TXT_MIME,
    buffer: Buffer.alloc(1024, 'a'),
  });
  await sendButton(page).click();

  await expect(mainAlert(page)).toContainText('במבנה בלתי צפוי');
  await expect(page.getByText(SYNTHETIC_UPSTREAM_DETAIL)).toHaveCount(0);
  await expect(resultCard(page)).toHaveCount(0);
  await expect(sendButton(page)).toBeEnabled();

  expect(submissions).toHaveLength(1);
  expect(blocked).toEqual([]);
});

test('a transport-level failure shows the fixed connection message and keeps the file ready to resend', async ({
  page,
}) => {
  const { submissions, blocked } = await interceptApi(page, () => 'network');
  await page.goto('/upload');

  await fileInput(page).setInputFiles({
    name: 'invoice-4471.txt',
    mimeType: TXT_MIME,
    buffer: Buffer.alloc(1024, 'a'),
  });
  await sendButton(page).click();

  await expect(mainAlert(page)).toHaveText(SEND_FAILED_MESSAGE_HE);
  await expect(resultCard(page)).toHaveCount(0);
  await expect(page.getByText('invoice-4471.txt')).toBeVisible();
  await expect(sendButton(page)).toBeEnabled();
  for (const detail of ['Failed to fetch', 'ERR_FAILED', 'TypeError', 'NetworkError']) {
    await expect(page.locator('body')).not.toContainText(detail);
  }

  expect(submissions).toHaveLength(1);
  expect(blocked).toEqual([]);
});

test('the upload times out at exactly 95,000 ms, not before, without a real wait', async ({
  page,
}) => {
  await page.clock.install();
  const { submissions, blocked } = await interceptApi(page, () => 'never');
  await page.goto('/upload');

  await fileInput(page).setInputFiles({
    name: 'invoice-4471.txt',
    mimeType: TXT_MIME,
    buffer: Buffer.alloc(1024, 'a'),
  });
  // The browser timer starts on click, at a paused instant.
  await pauseClock(page);
  await sendButton(page).click();

  const processing = page.getByRole('main').getByRole('status');
  await expect(processing).toContainText('מעבד את המסמך');
  await expect.poll(() => submissions.length).toBe(1);

  await page.clock.runFor(94_999);
  await settle(page);
  await expect(processing).toContainText('מעבד את המסמך');
  await expect(mainAlert(page)).toHaveCount(0);
  await expect(resultCard(page)).toHaveCount(0);
  await expect(sendButton(page)).toBeDisabled();

  await page.clock.runFor(1);
  await expect(mainAlert(page)).toHaveText(TIMEOUT_MESSAGE_HE);
  await expect(resultCard(page)).toHaveCount(0);
  await expect(page.getByText('invoice-4471.txt')).toBeVisible();
  await expect(sendButton(page)).toBeEnabled();

  expect(submissions).toHaveLength(1);
  expect(blocked).toEqual([]);
});

test('an unsupported file type is refused before anything is sent', async ({ page }) => {
  const { submissions, blocked } = await interceptApi(page, (s) =>
    json(200, syntheticProcessed(String(s.file_name))),
  );
  await page.goto('/upload');

  await fileInput(page).setInputFiles({
    name: 'scanned-page.png',
    mimeType: 'image/png',
    buffer: Buffer.alloc(1024, 'b'),
  });

  await expect(mainAlert(page)).toContainText('PDF, DOCX ו-TXT בלבד');
  await expect(page.getByText('scanned-page.png')).toBeVisible();
  await expect(sendButton(page)).toBeDisabled();
  expect(submissions).toEqual([]);
  expect(blocked).toEqual([]);
});

test('an oversized file is refused before anything is sent', async ({ page }) => {
  const { submissions, blocked } = await interceptApi(page, (s) =>
    json(200, syntheticProcessed(String(s.file_name))),
  );
  await page.goto('/upload');

  await fileInput(page).setInputFiles({
    name: 'huge-report.txt',
    mimeType: TXT_MIME,
    buffer: Buffer.alloc(MAX_UPLOAD_BYTES + 1, 'c'),
  });

  await expect(mainAlert(page)).toContainText('גדול מהמותר (10MB)');
  await expect(sendButton(page)).toBeDisabled();
  expect(submissions).toEqual([]);
  expect(blocked).toEqual([]);
});
