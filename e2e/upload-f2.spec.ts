import { test, expect, type Page } from '@playwright/test';
import {
  processDocumentResponseSchema,
  type ProcessDocumentResponse,
} from '../src/lib/process-document-contract';

/**
 * F2 only — instructor Part 2 doc §7 F2: "Shows an unmistakable in-progress
 * state while n8n works, and disables the Send button", handling "a wait of up
 * to a minute without looking broken or frozen", checked by "Double-clicking
 * Send creates exactly one row in the spreadsheet". `CONTRACT.md` §9 states the
 * same disable-during-flight rule for this application.
 *
 * Transport is intercepted: `/api/process-document` is answered by the test with
 * a synthetic response, held open until the test releases it, so the processing
 * state is observed deterministically without any sleep. One spreadsheet row
 * needs one request, so the application-side equivalent asserted here is exactly
 * one intercepted POST. The spreadsheet itself is not touched, and every other
 * `/api/` request is aborted and recorded.
 */

const TXT_MIME = 'text/plain';

const PROCESS_DOCUMENT_ROUTE = '**/api/process-document';

type Gate = { released: Promise<void>; release: () => void };

function gate(): Gate {
  let release!: () => void;
  const released = new Promise<void>((resolve) => {
    release = resolve;
  });
  return { released, release };
}

/** Fully synthetic, and validated against the application's own schema. */
function syntheticProcessed(fileName: string): ProcessDocumentResponse {
  return processDocumentResponseSchema.parse({
    status: 'processed',
    document_id: 'synthetic-exec-0002',
    file_name: fileName,
    file_link: 'https://example.test/synthetic/file/SYN-0002/view',
    received_at: '2026-09-30T09:24:00.000Z',
    fields: {
      document_type: 'invoice',
      sender_or_company: 'Synthetic Supplies Ltd',
      summary: 'Synthetic invoice used only in tests.',
      requested_action: 'Approve synthetic invoice SYN-0002',
      deadline: '12 March 2026',
      urgency: 'High',
      department: 'Finance',
    },
    notification_sent: true,
  });
}

/**
 * Must be called before `page.goto`. Each POST is counted on arrival, then held
 * until `hold` is released (or answered at once when no gate is given). The
 * catch-all aborts and records any other `/api/` request; Playwright runs the
 * most recently registered matching route first.
 */
async function interceptApi(
  page: Page,
  hold?: Gate,
): Promise<{ posts: string[]; blocked: string[] }> {
  const posts: string[] = [];
  const blocked: string[] = [];

  await page.route('**/api/**', (route) => {
    blocked.push(new URL(route.request().url()).pathname);
    return route.abort();
  });

  await page.route(PROCESS_DOCUMENT_ROUTE, async (route) => {
    const request = route.request();
    if (request.method() !== 'POST') {
      return route.fulfill({ status: 405, contentType: 'application/json', body: '{}' });
    }

    let body: { file_name?: unknown; mime_type?: unknown; file_base64?: unknown } = {};
    try {
      body = (request.postDataJSON() as typeof body) ?? {};
    } catch {
      body = {};
    }
    // Recorded, not asserted here: a throw inside a handler would leave the
    // request hanging instead of failing the test. The base64 is never stored.
    const hasPayload =
      typeof body.file_name === 'string' &&
      typeof body.mime_type === 'string' &&
      typeof body.file_base64 === 'string' &&
      body.file_base64.length > 0;
    posts.push(hasPayload ? String(body.file_name) : 'INVALID_PAYLOAD');

    if (hold) await hold.released;
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(syntheticProcessed(String(body.file_name))),
    });
  });

  return { posts, blocked };
}

function fileInput(page: Page) {
  return page.getByLabel('בחרו מסמך אחד, או גררו אותו לאזור הזה');
}

function sendButton(page: Page) {
  return page.getByRole('button', { name: 'שליחת המסמך לעיבוד' });
}

function clearButton(page: Page) {
  return page.getByRole('button', { name: 'ניקוי הבחירה' });
}

function resultCard(page: Page) {
  return page.getByRole('region', { name: 'תוצאת העיבוד' });
}

/** Next.js renders its own `role="status"`/`role="alert"` regions outside `main`. */
function mainStatus(page: Page) {
  return page.getByRole('main').getByRole('status');
}

async function selectValidFile(page: Page) {
  await fileInput(page).setInputFiles({
    name: 'invoice-4471.txt',
    mimeType: TXT_MIME,
    buffer: Buffer.alloc(4096, 'a'),
  });
}

/** Two clicks in the same tick, before React can re-render and disable. */
async function doubleClickSendInOneTick(page: Page) {
  await page.evaluate(() => {
    const button = Array.from(document.querySelectorAll('button')).find((candidate) =>
      candidate.textContent?.includes('שליחת המסמך'),
    );
    if (!button) throw new Error('send button not found');
    button.click();
    button.click();
  });
}

test('the processing state is visible while the response is pending, and Send is disabled until it ends', async ({
  page,
}) => {
  const hold = gate();
  const { posts, blocked } = await interceptApi(page, hold);
  await page.goto('/upload');
  await selectValidFile(page);

  expect(posts).toEqual([]);
  await expect(sendButton(page)).toBeEnabled();

  await sendButton(page).click();

  // The request has arrived and is being held.
  await expect.poll(() => posts.length).toBe(1);

  // In progress: the state is stated in words, and the controls are locked.
  const processing = mainStatus(page);
  await expect(processing).toContainText('מעבד את המסמך');
  await expect(processing).toContainText('עד דקה');
  await expect(sendButton(page)).toBeDisabled();
  await expect(sendButton(page)).toHaveAttribute('aria-busy', 'true');
  await expect(clearButton(page)).toBeDisabled();
  await expect(fileInput(page)).toBeDisabled();
  await expect(resultCard(page)).toHaveCount(0);

  hold.release();

  // Finished: the processing state gives way to the result.
  await expect(resultCard(page)).toBeVisible();
  await expect(page.getByText('מעבד את המסמך…')).toHaveCount(0);
  await expect(sendButton(page)).toBeEnabled();
  await expect(sendButton(page)).toHaveAttribute('aria-busy', 'false');
  await expect(clearButton(page)).toBeEnabled();

  expect(posts).toEqual(['invoice-4471.txt']);
  expect(blocked).toEqual([]);
});

test('two clicks in the same tick send exactly one request', async ({ page }) => {
  const hold = gate();
  const { posts, blocked } = await interceptApi(page, hold);
  await page.goto('/upload');
  await selectValidFile(page);

  await doubleClickSendInOneTick(page);

  // One submission, one processing cycle.
  await expect(mainStatus(page)).toContainText('מעבד את המסמך');
  await expect(sendButton(page)).toBeDisabled();
  await expect.poll(() => posts.length).toBe(1);

  hold.release();
  await expect(resultCard(page)).toBeVisible();

  // Still one after the cycle closed — the second click never became a send.
  expect(posts).toEqual(['invoice-4471.txt']);
  expect(blocked).toEqual([]);
});

test('a second send after the first one finished sends a second request', async ({ page }) => {
  const { posts, blocked } = await interceptApi(page);
  await page.goto('/upload');
  await selectValidFile(page);

  await sendButton(page).click();
  await expect(resultCard(page)).toBeVisible();
  await expect(sendButton(page)).toBeEnabled();
  expect(posts).toHaveLength(1);

  await sendButton(page).click();
  await expect.poll(() => posts.length).toBe(2);
  await expect(resultCard(page)).toBeVisible();
  await expect(sendButton(page)).toBeEnabled();

  expect(posts).toEqual(['invoice-4471.txt', 'invoice-4471.txt']);
  expect(blocked).toEqual([]);
});
