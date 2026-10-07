import { test, expect, type Page, type Route } from '@playwright/test';

/**
 * Live dashboard (F4, F5, F7) against the application's own `GET /api/documents`,
 * plus the F6 return-after-review reflection.
 *
 * Safety: a catch-all `**\/api/**` guard is registered first and aborts and
 * records anything unexpected; the specific `/api/documents` and `/api/review`
 * handlers are registered after it, so Playwright runs them first. Everything is
 * registered before navigation. Handlers serve synthetic fixtures only and never
 * assert. Nothing reaches a real route handler, n8n or an external service.
 */

const API_GUARD = '**/api/**';
const DOCUMENTS_ROUTE = '**/api/documents';
const REVIEW_ROUTE = '**/api/review';

const rowA = {
  document_id: 'exec-5001',
  received_at: '2026-09-27T09:00:00Z',
  file_name: 'live-invoice-5001.pdf',
  file_link: 'https://example.com/file/d/live5001/view',
  document_type: 'invoice',
  sender_or_company: 'Live Fixture Ltd',
  summary: 'Row served by an intercepted application API response.',
  requested_action: 'Approve and pay invoice 5001',
  deadline: '30 September 2026',
  urgency: 'High',
  department: 'Finance',
  status: 'Needs Review',
};

const rowB = {
  ...rowA,
  document_id: 'exec-5002',
  received_at: '2026-09-27T11:00:00Z',
  file_name: 'live-report-5002.txt',
  file_link: 'https://example.com/file/d/live5002/view',
  document_type: 'report',
  sender_or_company: 'Second Fixture Ltd',
  urgency: 'Low',
  department: 'Management',
  status: 'Processed',
};

type Reply =
  | { kind: 'json'; status: number; body: unknown }
  | { kind: 'text'; status: number; body: string }
  | { kind: 'hold'; until: Promise<void>; next: Reply }
  | { kind: 'never' }
  | { kind: 'network' };

const json = (status: number, body: unknown): Reply => ({ kind: 'json', status, body });

async function fulfill(route: Route, reply: Reply): Promise<void> {
  if (reply.kind === 'never') {
    await new Promise<void>(() => {});
    return;
  }
  if (reply.kind === 'network') {
    // Transport-level failure: the browser receives no HTTP response at all.
    await route.abort('failed').catch(() => {});
    return;
  }
  if (reply.kind === 'hold') {
    await reply.until;
    await fulfill(route, reply.next);
    return;
  }
  await route
    .fulfill({
      status: reply.status,
      contentType: reply.kind === 'json' ? 'application/json' : 'text/html',
      body: reply.kind === 'json' ? JSON.stringify(reply.body) : reply.body,
    })
    .catch(() => {});
}

type Harness = {
  blocked: string[];
  /** `METHOD /path?query` of every documents request the handler received. */
  documentRequests: string[];
  settledDocuments: string[];
  reviewPosts: unknown[];
  setDocuments: (next: Reply) => void;
  setReview: (next: Reply, onDelivered?: () => void) => void;
};

/** Registers the guard, then the documents and review handlers, before navigation. */
async function interceptApi(page: Page, documents: Reply): Promise<Harness> {
  const blocked: string[] = [];
  const documentRequests: string[] = [];
  const settledDocuments: string[] = [];
  const reviewPosts: unknown[] = [];
  let documentsReply = documents;
  let reviewReply: Reply | null = null;
  let afterReviewDelivered: (() => void) | undefined;

  await page.route(API_GUARD, async (route) => {
    const request = route.request();
    blocked.push(`${request.method()} ${new URL(request.url()).pathname}`);
    await route.abort('blockedbyclient').catch(() => {});
  });

  await page.route(DOCUMENTS_ROUTE, async (route) => {
    const request = route.request();
    if (request.method() !== 'GET') {
      await route.fallback();
      return;
    }
    const url = new URL(request.url());
    documentRequests.push(`${request.method()} ${url.pathname}${url.search}`);
    await fulfill(route, documentsReply);
    settledDocuments.push('GET');
  });

  await page.route(REVIEW_ROUTE, async (route) => {
    const request = route.request();
    if (request.method() !== 'POST' || reviewReply === null) {
      await route.fallback();
      return;
    }
    reviewPosts.push(request.postDataJSON());
    await fulfill(route, reviewReply);
    // Synthetic server state changes only after the reply was delivered.
    afterReviewDelivered?.();
  });

  return {
    blocked,
    documentRequests,
    settledDocuments,
    reviewPosts,
    setDocuments: (next) => {
      documentsReply = next;
    },
    setReview: (next, onDelivered) => {
      reviewReply = next;
      afterReviewDelivered = onDelivered;
    },
  };
}

function gate() {
  let release = () => {};
  const until = new Promise<void>((resolve) => {
    release = resolve;
  });
  return { until, release };
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

function main(page: Page) {
  return page.getByRole('main');
}

function apiRows(page: Page) {
  return page.getByRole('list', { name: 'מסמכים', exact: true }).getByRole('listitem');
}

function refreshButton(page: Page) {
  return main(page).getByRole('button', { name: 'רענון' });
}

function retryButton(page: Page) {
  return main(page).getByRole('button', { name: 'נסה שוב' });
}

/** Next.js injects its own role="alert" route announcer outside <main>. */
function dashboardAlert(page: Page) {
  return main(page).getByRole('alert');
}

const GENERIC_MESSAGE = 'רשימת המסמכים חזרה במבנה בלתי צפוי ולכן לא הוצגה.';

test.afterEach(async ({ page }) => {
  await page.unrouteAll({ behavior: 'ignoreErrors' });
});

test('loads on mount with exactly GET /api/documents and no query, with no source switch', async ({
  page,
}) => {
  const api = await interceptApi(page, json(200, [rowA, rowB]));

  await page.goto('/');

  await expect(apiRows(page)).toHaveCount(2);
  expect(api.documentRequests.length).toBeGreaterThanOrEqual(1);
  expect(new Set(api.documentRequests)).toEqual(new Set(['GET /api/documents']));
  await expect(page.getByRole('button', { name: 'טעינת מסמכים מ-API היישום' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'חזרה לנתוני דמה' })).toHaveCount(0);
  expect(api.blocked).toEqual([]);
});

test('a held load shows the loading state with Refresh disabled, then the rows', async ({ page }) => {
  const hold = gate();
  const api = await interceptApi(page, { kind: 'hold', until: hold.until, next: json(200, [rowA]) });

  await page.goto('/');

  await expect(main(page).getByRole('status')).toContainText('טוען מסמכים');
  await expect(refreshButton(page)).toBeDisabled();
  await expect(apiRows(page)).toHaveCount(0);

  hold.release();

  await expect(apiRows(page)).toHaveCount(1);
  await expect(refreshButton(page)).toBeEnabled();
  expect(api.blocked).toEqual([]);
});

test('renders live rows newest first under the live-source notice', async ({ page }) => {
  const api = await interceptApi(page, json(200, [rowA, rowB]));

  await page.goto('/');

  const notice = main(page).getByRole('note');
  await expect(notice).toContainText('הנתונים נטענים מיומן המסמכים');
  await expect(notice).toContainText('/api/documents');
  await expect(main(page)).not.toContainText('דמה');
  await expect(main(page)).not.toContainText('טרם אומת');

  await expect(apiRows(page).getByRole('heading', { level: 3 })).toHaveText([
    'live-report-5002.txt',
    'live-invoice-5001.pdf',
  ]);
  await expect(page.getByText('מוצגים 2 מתוך 2 מסמכים')).toBeVisible();
  expect(api.blocked).toEqual([]);
});

test('each row links to its exact encoded document_id', async ({ page }) => {
  const encodedRow = {
    ...rowB,
    document_id: 'exec-5003 copy',
    file_name: 'live-encoded-5003.pdf',
    received_at: '2026-09-27T07:00:00Z',
  };
  const api = await interceptApi(page, json(200, [rowA, rowB, encodedRow]));

  await page.goto('/');
  await expect(apiRows(page)).toHaveCount(3);

  for (const row of [rowA, rowB, encodedRow]) {
    await expect(main(page).getByRole('link', { name: row.file_name })).toHaveAttribute(
      'href',
      `/documents/${encodeURIComponent(row.document_id)}`,
    );
  }
  await expect(main(page).getByRole('link', { name: 'live-encoded-5003.pdf' })).toHaveAttribute(
    'href',
    '/documents/exec-5003%20copy',
  );
  expect(api.blocked).toEqual([]);
});

test('clicking a row opens the detail screen for the same document_id', async ({ page }) => {
  const api = await interceptApi(page, json(200, [rowA, rowB]));

  await page.goto('/');
  await main(page).getByRole('link', { name: 'live-invoice-5001.pdf' }).click();

  await expect(page).toHaveURL(/\/documents\/exec-5001$/);
  const fields = page.getByRole('region', { name: 'פרטי המסמך' });
  await expect(fields.locator('dl > div').filter({ hasText: '(document_id)' })).toContainText(
    'exec-5001',
  );
  await expect(fields.locator('dl > div').filter({ hasText: '(file_name)' })).toContainText(
    'live-invoice-5001.pdf',
  );
  expect(api.blocked).toEqual([]);
});

test('a valid empty array shows the empty-log state', async ({ page }) => {
  const api = await interceptApi(page, json(200, []));

  await page.goto('/');

  await expect(main(page).getByRole('status')).toContainText('אין מסמכים להצגה');
  await expect(apiRows(page)).toHaveCount(0);
  expect(api.blocked).toEqual([]);
});

test('a sanitized 502 shows the route message, retry and no rows', async ({ page }) => {
  const api = await interceptApi(
    page,
    json(502, {
      status: 'error',
      message: 'מערכת האוטומציה החזירה שגיאה. רשימת המסמכים אינה זמינה כרגע.',
    }),
  );

  await page.goto('/');

  const alert = dashboardAlert(page);
  await expect(alert).toContainText('טעינת המסמכים נכשלה');
  await expect(alert).toContainText('מערכת האוטומציה החזירה שגיאה');
  await expect(retryButton(page)).toBeVisible();
  await expect(apiRows(page)).toHaveCount(0);
  expect(api.blocked).toEqual([]);
});

test('a 401 shows the sanitized message and never renders UNAUTHORIZED', async ({ page }) => {
  const api = await interceptApi(
    page,
    json(401, {
      status: 'error',
      error_code: 'UNAUTHORIZED',
      message: 'השרת לא אושר מול מערכת האוטומציה. זו תקלת תצורה ולא משהו שניתן לתקן מהמסך.',
    }),
  );

  await page.goto('/');

  await expect(dashboardAlert(page)).toContainText('תקלת תצורה');
  await expect(page.locator('body')).not.toContainText('UNAUTHORIZED');
  await expect(apiRows(page)).toHaveCount(0);
  expect(api.blocked).toEqual([]);
});

test('a non-OK non-JSON body gets the generic message and none of the body', async ({ page }) => {
  const marker = 'synthetic-dashboard-marker-html-3b7d';
  const api = await interceptApi(page, {
    kind: 'text',
    status: 502,
    body: `<html><body><h1>Bad gateway</h1><p>${marker}</p></body></html>`,
  });

  await page.goto('/');

  await expect(dashboardAlert(page)).toContainText(GENERIC_MESSAGE);
  await expect(page.locator('body')).not.toContainText(marker);
  await expect(page.locator('body')).not.toContainText('Bad gateway');
  await expect(apiRows(page)).toHaveCount(0);
  expect(api.blocked).toEqual([]);
});

test('a non-OK body outside the error shape gets the generic message', async ({ page }) => {
  const marker = 'synthetic-dashboard-marker-json-9c2e';
  const api = await interceptApi(page, json(500, { error: marker, message: marker }));

  await page.goto('/');

  await expect(dashboardAlert(page)).toContainText(GENERIC_MESSAGE);
  await expect(page.locator('body')).not.toContainText(marker);
  await expect(apiRows(page)).toHaveCount(0);
  expect(api.blocked).toEqual([]);
});

test('a success array with an invalid row is rejected whole, with no partial rows', async ({
  page,
}) => {
  const api = await interceptApi(page, json(200, [rowA, { ...rowB, urgency: 'Urgent' }]));

  await page.goto('/');

  await expect(dashboardAlert(page)).toContainText(GENERIC_MESSAGE);
  await expect(apiRows(page)).toHaveCount(0);
  await expect(main(page)).not.toContainText('live-invoice-5001.pdf');
  expect(api.blocked).toEqual([]);
});

test('a wrapped {items} object is rejected', async ({ page }) => {
  const api = await interceptApi(page, json(200, { items: [rowA] }));

  await page.goto('/');

  await expect(dashboardAlert(page)).toContainText(GENERIC_MESSAGE);
  await expect(apiRows(page)).toHaveCount(0);
  expect(api.blocked).toEqual([]);
});

test('a transport-level failure shows the fixed connection message, retry and no rows', async ({
  page,
}) => {
  const api = await interceptApi(page, { kind: 'network' });

  await page.goto('/');

  const alert = dashboardAlert(page);
  await expect(alert).toContainText('טעינת המסמכים נכשלה');
  await expect(alert).toContainText('לא ניתן היה לפנות לשרת היישום. אפשר לנסות שוב בעוד רגע.');
  await expect(retryButton(page)).toBeVisible();
  await expect(apiRows(page)).toHaveCount(0);
  await expect(page.getByRole('list', { name: 'מסמכי דמה' })).toHaveCount(0);
  await expect(main(page)).not.toContainText('דמה');
  await expect(main(page)).not.toContainText('invoice-4473-urgent.pdf');
  for (const detail of ['Failed to fetch', 'ERR_FAILED', 'TypeError', 'NetworkError', GENERIC_MESSAGE]) {
    await expect(page.locator('body')).not.toContainText(detail);
  }
  expect(api.documentRequests.length).toBeGreaterThanOrEqual(1);
  expect(new Set(api.documentRequests)).toEqual(new Set(['GET /api/documents']));
  expect(api.blocked).toEqual([]);
});

test('retry after a failure loads the rows', async ({ page }) => {
  const api = await interceptApi(page, json(504, { status: 'error', message: 'מערכת האוטומציה לא השיבה בזמן.' }));

  await page.goto('/');
  await expect(dashboardAlert(page)).toContainText('לא השיבה בזמן');
  const before = api.documentRequests.length;

  api.setDocuments(json(200, [rowA]));
  await retryButton(page).click();

  await expect(apiRows(page)).toHaveCount(1);
  await expect(dashboardAlert(page)).toHaveCount(0);
  expect(api.documentRequests.length).toBe(before + 1);
  expect(api.blocked).toEqual([]);
});

test('Refresh makes exactly one new GET and replaces the rows', async ({ page }) => {
  const api = await interceptApi(page, json(200, [rowA]));

  await page.goto('/');
  await expect(apiRows(page)).toHaveCount(1);
  const before = api.documentRequests.length;

  api.setDocuments(json(200, [rowA, rowB]));
  await refreshButton(page).click();

  await expect(apiRows(page)).toHaveCount(2);
  await expect(apiRows(page).first()).toContainText('live-report-5002.txt');
  expect(api.documentRequests.length).toBe(before + 1);
  expect(api.blocked).toEqual([]);
});

test('while idle, no further request is made — no polling', async ({ page }) => {
  await page.clock.install();
  const api = await interceptApi(page, json(200, [rowA, rowB]));

  await page.goto('/');
  await expect(apiRows(page)).toHaveCount(2);
  const before = api.documentRequests.length;

  await page.clock.runFor(5 * 60_000);
  await settle(page);

  await expect(apiRows(page)).toHaveCount(2);
  expect(api.documentRequests.length).toBe(before);
  expect(api.blocked).toEqual([]);
});

test('search and the urgency filter work over live rows, with a no-results state', async ({
  page,
}) => {
  const api = await interceptApi(page, json(200, [rowA, rowB]));

  await page.goto('/');
  await expect(apiRows(page)).toHaveCount(2);

  await page.getByLabel('דחיפות (urgency)').selectOption('High');
  await expect(apiRows(page)).toHaveCount(1);
  await expect(apiRows(page).first()).toContainText('live-invoice-5001.pdf');

  await main(page).getByRole('button', { name: 'ניקוי סינון' }).click();
  await expect(apiRows(page)).toHaveCount(2);

  await page.getByRole('searchbox').fill('report-5002');
  await expect(apiRows(page)).toHaveCount(1);

  await page.getByRole('searchbox').fill('no-such-document-anywhere');
  await expect(apiRows(page)).toHaveCount(0);
  await expect(main(page).getByRole('status')).toContainText('אין תוצאות מתאימות');
  expect(api.blocked).toEqual([]);
});

test('a failure never shows mock rows or mock wording', async ({ page }) => {
  const api = await interceptApi(page, json(502, { status: 'error', message: 'שגיאה מסוננת.' }));

  await page.goto('/');

  await expect(dashboardAlert(page)).toContainText('טעינת המסמכים נכשלה');
  await expect(apiRows(page)).toHaveCount(0);
  await expect(page.getByRole('list', { name: 'מסמכי דמה' })).toHaveCount(0);
  await expect(main(page)).not.toContainText('דמה');
  await expect(main(page)).not.toContainText('invoice-4473-urgent.pdf');
  expect(api.blocked).toEqual([]);
});

test('the load times out at exactly 95,000 ms, not before', async ({ page }) => {
  await page.clock.install();
  const api = await interceptApi(page, json(502, { status: 'error', message: 'שגיאה מסוננת.' }));

  // Strict Mode mounts twice in development, so the timed request is the retry,
  // started at a paused instant.
  await page.goto('/');
  await expect(dashboardAlert(page)).toContainText('שגיאה מסוננת.');
  const before = api.documentRequests.length;

  api.setDocuments({ kind: 'never' });
  await pauseClock(page);
  await retryButton(page).click();

  const loading = main(page).getByRole('status');
  await expect(loading).toContainText('טוען מסמכים');
  await expect.poll(() => api.documentRequests.length).toBe(before + 1);

  await page.clock.runFor(94_999);
  await settle(page);
  await expect(loading).toContainText('טוען מסמכים');
  await expect(dashboardAlert(page)).toHaveCount(0);

  await page.clock.runFor(1);
  await expect(dashboardAlert(page)).toContainText('טעינת המסמכים נכשלה');
  await expect(dashboardAlert(page)).toContainText('טעינת המסמכים לא הסתיימה בזמן');
  await expect(retryButton(page)).toBeVisible();
  expect(api.documentRequests.length).toBe(before + 1);
  expect(api.blocked).toEqual([]);
});

test('leaving the dashboard while the load is held leaves no late state behind', async ({
  page,
}) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  const hold = gate();
  const api = await interceptApi(page, { kind: 'hold', until: hold.until, next: json(200, [rowA]) });

  await page.goto('/');
  await expect(main(page).getByRole('status')).toContainText('טוען מסמכים');
  await expect.poll(() => api.documentRequests.length).toBeGreaterThanOrEqual(1);

  // Client-side navigation unmounts the dashboard inside the same page.
  await page.getByRole('navigation', { name: 'ניווט ראשי' }).getByRole('link', { name: 'העלאת מסמך' }).click();
  await expect(page).toHaveURL(/\/upload$/);

  hold.release();
  await expect.poll(() => api.settledDocuments.length).toBe(api.documentRequests.length);
  await settle(page);

  await expect(page).toHaveURL(/\/upload$/);
  await expect(apiRows(page)).toHaveCount(0);
  await expect(main(page)).not.toContainText('טעינת המסמכים נכשלה');
  await expect(main(page)).not.toContainText('live-invoice-5001.pdf');
  expect(pageErrors).toEqual([]);
  expect(api.blocked).toEqual([]);
});

test('after a review, returning through the in-page link shows Reviewed from a fresh GET', async ({
  page,
}) => {
  const api = await interceptApi(page, json(200, [rowA]));
  const freshList = gate();
  api.setReview(json(200, { status: 'updated', document_id: 'exec-5001' }), () => {
    // Only after the POST reply was delivered does the synthetic log change.
    api.setDocuments({
      kind: 'hold',
      until: freshList.until,
      next: json(200, [{ ...rowA, status: 'Reviewed' }]),
    });
  });

  await page.goto('/');
  await expect(apiRows(page).first()).toContainText('Needs Review');

  await main(page).getByRole('link', { name: 'live-invoice-5001.pdf' }).click();
  const review = page.getByRole('region', { name: 'בדיקה אנושית' });
  await review.getByRole('textbox', { name: /reviewed_by/ }).fill('Dana Example');
  await review.getByRole('button', { name: 'סימון כנבדק' }).click();
  await expect(review.getByRole('status')).toContainText('הבדיקה נשמרה');
  expect(api.reviewPosts).toEqual([
    { document_id: 'exec-5001', status: 'Reviewed', reviewed_by: 'Dana Example' },
  ]);
  const beforeReturn = api.documentRequests.length;

  await main(page).getByRole('link', { name: 'חזרה ללוח המסמכים' }).click();
  await expect(page).toHaveURL(/\/$/);

  // The dashboard remounted and asked again; nothing is shown until it answers.
  await expect.poll(() => api.documentRequests.length).toBeGreaterThan(beforeReturn);
  await expect(main(page).getByRole('status')).toContainText('טוען מסמכים');
  await expect(apiRows(page)).toHaveCount(0);

  freshList.release();

  await expect(apiRows(page)).toHaveCount(1);
  await expect(apiRows(page).first()).toContainText('Reviewed');
  await expect(apiRows(page).first()).not.toContainText('Needs Review');
  expect(api.reviewPosts).toHaveLength(1);
  expect(api.blocked).toEqual([]);
});
