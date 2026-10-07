import { test, expect, type Page, type Route } from '@playwright/test';

/**
 * F6 detail screen — live loading through the application's own
 * `GET /api/documents`, with every API request intercepted in the browser.
 *
 * Safety: a catch-all `**\/api/**` guard is registered first and aborts and
 * records anything unexpected; the specific handler is registered after it, so
 * Playwright runs it first. Handlers serve synthetic fixtures only and never
 * assert. Nothing reaches a real route handler, n8n or an external service.
 */

const API_GUARD = '**/api/**';
const DOCUMENTS_ROUTE = '**/api/documents';

const row = {
  document_id: 'exec-3001',
  received_at: '2026-09-24T08:15:00Z',
  file_name: 'detail-invoice-3001.pdf',
  file_link: 'https://example.com/file/d/detail3001/view',
  document_type: 'invoice',
  sender_or_company: 'Detail Fixture Ltd',
  summary: 'Row served by an intercepted application API response.',
  requested_action: 'Approve and pay invoice 3001',
  deadline: '30 September 2026',
  urgency: 'High',
  department: 'Finance',
  status: 'Needs Review',
};

const TWELVE_FIELDS = [
  'document_id',
  'received_at',
  'file_name',
  'file_link',
  'document_type',
  'sender_or_company',
  'summary',
  'requested_action',
  'deadline',
  'urgency',
  'department',
  'status',
] as const;

type Reply = { status: number; json?: unknown; text?: string } | { network: true };

/** Registers the guard, then the documents handler, before any navigation. */
async function interceptApi(page: Page, reply: () => Reply | Promise<Reply>) {
  const blocked: string[] = [];
  const documentRequests: string[] = [];
  /** One entry per documents handler that has finished its reply attempt. */
  const settled: string[] = [];

  await page.route(API_GUARD, async (route: Route) => {
    const request = route.request();
    blocked.push(`${request.method()} ${new URL(request.url()).pathname}`);
    await route.abort('blockedbyclient').catch(() => {});
  });

  await page.route(DOCUMENTS_ROUTE, async (route: Route) => {
    if (route.request().method() !== 'GET') {
      await route.fallback();
      return;
    }
    documentRequests.push(route.request().method());
    const next = await reply();
    if ('network' in next) {
      await route.abort('failed').catch(() => {});
    } else {
      await route
        .fulfill({
          status: next.status,
          contentType: next.text === undefined ? 'application/json' : 'text/plain',
          body: next.text ?? JSON.stringify(next.json),
        })
        .catch(() => {});
    }
    settled.push('GET');
  });

  return { blocked, documentRequests, settled };
}

function gate() {
  let release = () => {};
  const until = new Promise<void>((resolve) => {
    release = resolve;
  });
  return { until, release };
}

/**
 * Pauses the page clock at a known instant, so a timer started after this call
 * fires only when the test advances the clock. No real time is waited.
 */
async function pauseClock(page: Page) {
  const now = await page.evaluate(() => Date.now());
  await page.clock.pauseAt(now + 1_000);
}

/**
 * Lets the page finish work already queued — React schedules renders through
 * MessageChannel, which the fake clock does not control. An event-loop flush,
 * not a time-based wait.
 */
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

function main(page: Page) {
  return page.getByRole('main');
}

function fieldsRegion(page: Page) {
  return page.getByRole('region', { name: 'פרטי המסמך' });
}

function reviewRegion(page: Page) {
  return page.getByRole('region', { name: 'בדיקה אנושית' });
}

function fieldRow(page: Page, contractFieldName: string) {
  return fieldsRegion(page).locator('dl > div').filter({ hasText: `(${contractFieldName})` });
}

function markReviewedButton(page: Page) {
  return reviewRegion(page).getByRole('button', { name: 'סימון כנבדק' });
}

async function expectNotFound(page: Page, documentId: string) {
  await expect(page.getByRole('heading', { name: 'המסמך לא נמצא', level: 2 })).toBeVisible();
  await expect(main(page).getByRole('alert')).toContainText(documentId);
  await expect(fieldsRegion(page)).toHaveCount(0);
  await expect(reviewRegion(page)).toHaveCount(0);
  await expect(main(page).getByRole('link', { name: 'חזרה ללוח המסמכים' })).toBeVisible();
  await expect(main(page)).not.toContainText('דמה');
}

test.afterEach(async ({ page }) => {
  await page.unrouteAll({ behavior: 'ignoreErrors' });
});

test('loads the record live and shows all twelve contract fields', async ({ page }) => {
  const api = await interceptApi(page, () => ({ status: 200, json: [row] }));

  await page.goto('/documents/exec-3001');

  await expect(page.getByRole('heading', { name: 'פרטי מסמך', level: 2 })).toBeVisible();
  await expect(fieldsRegion(page)).toBeVisible();

  for (const field of TWELVE_FIELDS) {
    await expect(fieldRow(page, field)).toHaveCount(1);
  }

  await expect(fieldRow(page, 'document_id')).toContainText('exec-3001');
  await expect(fieldRow(page, 'file_name')).toContainText('detail-invoice-3001.pdf');
  await expect(fieldRow(page, 'sender_or_company')).toContainText('Detail Fixture Ltd');
  await expect(fieldRow(page, 'department')).toContainText('Finance');
  await expect(fieldRow(page, 'status')).toContainText('Needs Review');
  // received_at is shown in fixed UTC, never converted.
  await expect(fieldRow(page, 'received_at')).toContainText('24.09.2026 08:15');

  const badge = fieldsRegion(page).locator('span.inline-block').filter({ hasText: /^High$/ });
  await expect(badge).toHaveCount(1);
  await expect(badge).toHaveClass(/bg-red-100/);
  await expect(fieldRow(page, 'file_link').getByRole('link', { name: 'פתיחת הקובץ' })).toBeVisible();

  // No mock wording anywhere on the screen, and no local-only notice.
  await expect(main(page)).not.toContainText('דמה');
  await expect(main(page).getByRole('note')).toHaveCount(0);

  expect(api.documentRequests.length).toBeGreaterThanOrEqual(1);
  expect(api.blocked).toEqual([]);
});

test('shows an accessible loading status until the list arrives', async ({ page }) => {
  let release = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const api = await interceptApi(page, async () => {
    await gate;
    return { status: 200, json: [row] };
  });

  await page.goto('/documents/exec-3001');

  await expect(main(page).getByRole('status')).toContainText('טוען את פרטי המסמך');
  await expect(fieldsRegion(page)).toHaveCount(0);
  await expect(reviewRegion(page)).toHaveCount(0);

  release();

  await expect(fieldsRegion(page)).toBeVisible();
  await expect(main(page).getByRole('status')).toHaveCount(0);
  expect(api.blocked).toEqual([]);
});

test('an id that matches no row exactly shows the not-found state', async ({ page }) => {
  const api = await interceptApi(page, () => ({
    status: 200,
    json: [
      row,
      { ...row, document_id: 'exec-30010' },
      { ...row, document_id: 'EXEC-300' },
    ],
  }));

  await page.goto('/documents/exec-300');

  await expectNotFound(page, 'exec-300');
  expect(api.blocked).toEqual([]);
});

test('an empty list shows the not-found state', async ({ page }) => {
  const api = await interceptApi(page, () => ({ status: 200, json: [] }));

  await page.goto('/documents/exec-3001');

  await expectNotFound(page, 'exec-3001');
  expect(api.blocked).toEqual([]);
});

test('a route error shows its sanitized message, a retry action and no fields', async ({ page }) => {
  const api = await interceptApi(page, () => ({
    status: 502,
    json: {
      status: 'error',
      message: 'מערכת האוטומציה החזירה שגיאה. רשימת המסמכים אינה זמינה כרגע.',
    },
  }));

  await page.goto('/documents/exec-3001');

  const alert = main(page).getByRole('alert');
  await expect(alert).toContainText('טעינת המסמך נכשלה');
  await expect(alert).toContainText('מערכת האוטומציה החזירה שגיאה');
  await expect(main(page).getByRole('button', { name: 'נסה שוב' })).toBeVisible();
  await expect(fieldsRegion(page)).toHaveCount(0);
  await expect(main(page)).not.toContainText('דמה');
  expect(api.blocked).toEqual([]);
});

test('a malformed list is rejected with a fixed message, not partial fields', async ({ page }) => {
  const api = await interceptApi(page, () => ({
    status: 200,
    json: [row, { ...row, document_id: 'exec-3002', urgency: 'Urgent' }],
  }));

  await page.goto('/documents/exec-3001');

  await expect(main(page).getByRole('alert')).toContainText('מבנה בלתי צפוי');
  await expect(fieldsRegion(page)).toHaveCount(0);
  expect(api.blocked).toEqual([]);
});

test('a non-JSON reply is rejected with a fixed message', async ({ page }) => {
  const api = await interceptApi(page, () => ({ status: 200, text: 'not json at all' }));

  await page.goto('/documents/exec-3001');

  await expect(main(page).getByRole('alert')).toContainText('מבנה בלתי צפוי');
  await expect(main(page)).not.toContainText('not json at all');
  await expect(fieldsRegion(page)).toHaveCount(0);
  expect(api.blocked).toEqual([]);
});

// CONTRACT.md §11: a non-OK reply that is not {status: "error", message} gets
// the generic fallback, and none of its body reaches the screen.
const NON_ERROR_BODY_CASES: Array<{ name: string; marker: string; reply: Reply }> = [
  {
    name: 'a 502 with a non-JSON HTML body',
    marker: 'synthetic-load-marker-html-5f2e',
    reply: {
      status: 502,
      text: '<html><body><h1>Bad gateway</h1><p>synthetic-load-marker-html-5f2e</p></body></html>',
    },
  },
  {
    name: 'a 500 with a JSON body that is not the error shape',
    marker: 'synthetic-load-marker-json-8a41',
    reply: { status: 500, json: { error: 'synthetic-load-marker-json-8a41' } },
  },
];

for (const failure of NON_ERROR_BODY_CASES) {
  test(`${failure.name} shows the fixed fallback and none of the body`, async ({ page }) => {
    const api = await interceptApi(page, () => failure.reply);

    await page.goto('/documents/exec-3001');

    const alert = main(page).getByRole('alert');
    await expect(alert).toContainText('טעינת המסמך נכשלה');
    await expect(alert).toContainText('רשימת המסמכים חזרה במבנה בלתי צפוי, ולכן המסמך לא הוצג.');
    await expect(page.locator('body')).not.toContainText(failure.marker);
    await expect(page.locator('body')).not.toContainText('Bad gateway');
    await expect(fieldsRegion(page)).toHaveCount(0);
    await expect(reviewRegion(page)).toHaveCount(0);
    await expect(main(page).getByRole('button', { name: 'נסה שוב' })).toBeVisible();
    await expect(main(page)).not.toContainText('דמה');
    await expect(main(page)).not.toContainText('invoice-4473-urgent.pdf');
    expect(api.blocked).toEqual([]);
  });
}

test('retry after a failed load requests the list again and shows the record', async ({ page }) => {
  let mode: 'fail' | 'ok' = 'fail';
  const api = await interceptApi(page, () =>
    mode === 'fail'
      ? { status: 504, json: { status: 'error', message: 'מערכת האוטומציה לא השיבה בזמן.' } }
      : { status: 200, json: [row] },
  );

  await page.goto('/documents/exec-3001');
  await expect(main(page).getByRole('alert')).toContainText('לא השיבה בזמן');
  const requestsBeforeRetry = api.documentRequests.length;

  mode = 'ok';
  await main(page).getByRole('button', { name: 'נסה שוב' }).click();

  await expect(fieldsRegion(page)).toBeVisible();
  await expect(fieldRow(page, 'document_id')).toContainText('exec-3001');
  await expect(main(page).getByRole('alert')).toHaveCount(0);
  expect(api.documentRequests.length).toBe(requestsBeforeRetry + 1);
  expect(api.blocked).toEqual([]);
});

test('the document load times out at exactly 95,000 ms, not before', async ({ page }) => {
  await page.clock.install();
  const hold = gate();
  let mode: 'fail' | 'hold' = 'fail';
  const api = await interceptApi(page, async () => {
    if (mode === 'fail') {
      return { status: 502, json: { status: 'error', message: 'מערכת האוטומציה החזירה שגיאה.' } };
    }
    await hold.until;
    return { status: 200, json: [row] };
  });

  // Strict Mode mounts twice in development, so the initial load may issue two
  // requests. The timed request is the retry, started at a paused instant.
  await page.goto('/documents/exec-3001');
  await expect(main(page).getByRole('alert')).toContainText('מערכת האוטומציה החזירה שגיאה');
  const requestsBeforeTimedLoad = api.documentRequests.length;

  mode = 'hold';
  await pauseClock(page);
  await main(page).getByRole('button', { name: 'נסה שוב' }).click();

  const loading = main(page).getByRole('status');
  await expect(loading).toContainText('טוען את פרטי המסמך');
  await expect.poll(() => api.documentRequests.length).toBe(requestsBeforeTimedLoad + 1);

  await page.clock.runFor(94_999);
  await settle(page);
  await expect(loading).toContainText('טוען את פרטי המסמך');
  await expect(main(page).getByRole('alert')).toHaveCount(0);
  await expect(main(page)).not.toContainText('טעינת המסמך לא הסתיימה בזמן');

  await page.clock.runFor(1);
  const alert = main(page).getByRole('alert');
  await expect(alert).toContainText('טעינת המסמך נכשלה');
  await expect(alert).toContainText('טעינת המסמך לא הסתיימה בזמן');
  await expect(main(page).getByRole('button', { name: 'נסה שוב' })).toBeVisible();
  await expect(loading).toHaveCount(0);
  await expect(fieldsRegion(page)).toHaveCount(0);

  // Exactly one documents request belongs to the timed load.
  expect(api.documentRequests.length).toBe(requestsBeforeTimedLoad + 1);
  hold.release();
  expect(api.blocked).toEqual([]);
});

test('a transport-level load failure shows the fixed connection message', async ({ page }) => {
  const api = await interceptApi(page, () => ({ network: true }));

  await page.goto('/documents/exec-3001');

  const alert = main(page).getByRole('alert');
  await expect(alert).toContainText('טעינת המסמך נכשלה');
  await expect(alert).toContainText('לא ניתן היה לפנות לשרת היישום');
  await expect(main(page).getByRole('button', { name: 'נסה שוב' })).toBeVisible();
  await expect(fieldsRegion(page)).toHaveCount(0);
  await expect(reviewRegion(page)).toHaveCount(0);
  await expect(main(page)).not.toContainText('דמה');
  await expect(main(page)).not.toContainText('invoice-4473-urgent.pdf');
  expect(api.blocked).toEqual([]);
});

test('leaving while the document load is held leaves no late state behind', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  const hold = gate();
  const api = await interceptApi(page, async () => {
    await hold.until;
    return { status: 200, json: [row] };
  });

  await page.goto('/documents/exec-3001');
  await expect(main(page).getByRole('status')).toContainText('טוען את פרטי המסמך');
  await expect.poll(() => api.documentRequests.length).toBeGreaterThanOrEqual(1);

  // Client-side navigation unmounts the detail screen inside the same page.
  await main(page).getByRole('link', { name: 'חזרה ללוח המסמכים' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { name: 'לוח מסמכים', level: 2, exact: true })).toBeVisible();

  hold.release();
  await expect.poll(() => api.settled.length).toBe(api.documentRequests.length);
  await settle(page);

  await expect(page).toHaveURL(/\/$/);
  await expect(fieldsRegion(page)).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'פרטי מסמך' })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'המסמך לא נמצא' })).toHaveCount(0);
  await expect(main(page)).not.toContainText('טעינת המסמך נכשלה');
  await expect(reviewRegion(page)).toHaveCount(0);
  expect(pageErrors).toEqual([]);
  expect(api.blocked).toEqual([]);
});

test('an already-Reviewed record disables the review action', async ({ page }) => {
  const api = await interceptApi(page, () => ({
    status: 200,
    json: [{ ...row, status: 'Reviewed' }],
  }));

  await page.goto('/documents/exec-3001');

  await expect(fieldRow(page, 'status')).toContainText('Reviewed');
  await expect(markReviewedButton(page)).toBeDisabled();
  await expect(reviewRegion(page).getByRole('textbox')).toHaveCount(2);
  for (const box of await reviewRegion(page).getByRole('textbox').all()) {
    await expect(box).toBeDisabled();
  }
  await expect(reviewRegion(page)).toContainText('הסטטוס הנוכחי הוא');
  expect(api.blocked).toEqual([]);
});
