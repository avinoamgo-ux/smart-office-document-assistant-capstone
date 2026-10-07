import { test, expect, type Page, type Route } from '@playwright/test';

/**
 * F6 "Mark as reviewed" — the same-origin `POST /api/review` from the detail
 * screen, with every API request intercepted in the browser.
 *
 * Safety: a catch-all `**\/api/**` guard is registered first and aborts and
 * records anything unexpected; the specific `/api/documents` and `/api/review`
 * handlers are registered after it, so Playwright runs them first. Handlers
 * serve synthetic fixtures only and never assert. Nothing reaches a real route
 * handler, n8n or an external service.
 */

const API_GUARD = '**/api/**';
const DOCUMENTS_ROUTE = '**/api/documents';
const REVIEW_ROUTE = '**/api/review';

// Synthetic values only.
const UPSTREAM_MARKER = 'synthetic-upstream-marker-6d1c';
const UPSTREAM_URL = 'https://n8n.invalid/webhook/review';

const row = {
  document_id: 'exec-4001',
  received_at: '2026-09-25T10:40:00Z',
  file_name: 'review-request-4001.txt',
  file_link: 'https://example.com/file/d/review4001/view',
  document_type: 'request',
  sender_or_company: 'Review Fixture Ltd',
  summary: 'Row served by an intercepted application API response.',
  requested_action: 'Approve the equipment request',
  deadline: 'Not found',
  urgency: 'Medium',
  department: 'Management',
  status: 'Needs Review',
};

type Reply =
  | { kind: 'json'; status: number; body: unknown }
  | { kind: 'text'; status: number; body: string }
  | { kind: 'network' }
  | { kind: 'hold'; until: Promise<void>; next: Reply }
  | { kind: 'never' };

const success: Reply = {
  kind: 'json',
  status: 200,
  body: { status: 'updated', document_id: 'exec-4001' },
};

type Harness = {
  blocked: string[];
  posts: Array<{ body: unknown; contentType: string | undefined }>;
  /** One entry per review handler that has finished its reply attempt. */
  settledPosts: string[];
  setReply: (next: Reply) => void;
};

async function fulfill(route: Route, reply: Reply): Promise<void> {
  if (reply.kind === 'never') {
    await new Promise<void>(() => {});
    return;
  }
  if (reply.kind === 'hold') {
    await reply.until;
    await fulfill(route, reply.next);
    return;
  }
  if (reply.kind === 'network') {
    await route.abort('failed').catch(() => {});
    return;
  }
  await route
    .fulfill({
      status: reply.status,
      contentType: reply.kind === 'json' ? 'application/json' : 'text/plain',
      body: reply.kind === 'json' ? JSON.stringify(reply.body) : reply.body,
    })
    .catch(() => {});
}

/** Registers the guard, then both handlers, before any navigation. */
async function interceptApi(
  page: Page,
  options: { rows?: unknown[]; review?: Reply } = {},
): Promise<Harness> {
  const blocked: string[] = [];
  const posts: Harness['posts'] = [];
  const settledPosts: string[] = [];
  let reviewReply: Reply = options.review ?? success;

  await page.route(API_GUARD, async (route) => {
    const request = route.request();
    blocked.push(`${request.method()} ${new URL(request.url()).pathname}`);
    await route.abort('blockedbyclient').catch(() => {});
  });

  await page.route(DOCUMENTS_ROUTE, async (route) => {
    if (route.request().method() !== 'GET') {
      await route.fallback();
      return;
    }
    await fulfill(route, { kind: 'json', status: 200, body: options.rows ?? [row] });
  });

  await page.route(REVIEW_ROUTE, async (route) => {
    const request = route.request();
    if (request.method() !== 'POST') {
      await route.fallback();
      return;
    }
    posts.push({ body: request.postDataJSON(), contentType: request.headers()['content-type'] });
    await fulfill(route, reviewReply);
    settledPosts.push('POST');
  });

  return {
    blocked,
    posts,
    settledPosts,
    setReply: (next) => {
      reviewReply = next;
    },
  };
}

function main(page: Page) {
  return page.getByRole('main');
}

function reviewRegion(page: Page) {
  return page.getByRole('region', { name: 'בדיקה אנושית' });
}

function statusField(page: Page) {
  return page
    .getByRole('region', { name: 'פרטי המסמך' })
    .locator('dl > div')
    .filter({ hasText: '(status)' });
}

function reviewerInput(page: Page) {
  return reviewRegion(page).getByRole('textbox', { name: /reviewed_by/ });
}

function noteInput(page: Page) {
  return reviewRegion(page).getByRole('textbox', { name: /review_note/ });
}

function markReviewedButton(page: Page) {
  return reviewRegion(page).getByRole('button', { name: 'סימון כנבדק' });
}

async function openDocument(page: Page) {
  await page.goto('/documents/exec-4001');
  await expect(statusField(page)).toContainText('Needs Review');
}

/**
 * One review attempt: click, wait until this attempt's POST was routed (so it
 * received the reply set before it), then wait until the screen has settled.
 */
async function attempt(page: Page, api: Harness, expectedPosts: number) {
  await markReviewedButton(page).click();
  await expect.poll(() => api.posts.length).toBe(expectedPosts);
  await expect(markReviewedButton(page)).toBeEnabled();
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

function gate() {
  let release = () => {};
  const until = new Promise<void>((resolve) => {
    release = resolve;
  });
  return { until, release };
}

test.afterEach(async ({ page }) => {
  await page.unrouteAll({ behavior: 'ignoreErrors' });
});

test('the reviewer name is required; blank or whitespace-only blocks the action', async ({ page }) => {
  const api = await interceptApi(page);
  await openDocument(page);

  await expect(reviewerInput(page)).toHaveAttribute('required', '');
  await expect(markReviewedButton(page)).toBeDisabled();
  await expect(reviewRegion(page)).toContainText('יש למלא את שם הבודק');

  await reviewerInput(page).fill('    ');
  await noteInput(page).fill('A note without a reviewer.');
  await expect(markReviewedButton(page)).toBeDisabled();
  await markReviewedButton(page).evaluate((button: HTMLButtonElement) => button.click());

  await reviewerInput(page).fill('Dana Example');
  await expect(markReviewedButton(page)).toBeEnabled();

  expect(api.posts).toHaveLength(0);
  expect(api.blocked).toEqual([]);
});

test('success sends exactly one POST with the exact trimmed payload', async ({ page }) => {
  const api = await interceptApi(page);
  await openDocument(page);

  await reviewerInput(page).fill('  Dana Example  ');
  await noteInput(page).fill('  Payment approved  ');
  await markReviewedButton(page).click();

  const confirmation = reviewRegion(page).getByRole('status');
  await expect(confirmation).toContainText('הבדיקה נשמרה');
  await expect(confirmation).toContainText('Dana Example');
  await expect(confirmation).toContainText('Payment approved');
  await expect(statusField(page)).toContainText('Reviewed');
  await expect(markReviewedButton(page)).toBeDisabled();

  expect(api.posts).toHaveLength(1);
  expect(api.posts[0].body).toEqual({
    document_id: 'exec-4001',
    status: 'Reviewed',
    reviewed_by: 'Dana Example',
    review_note: 'Payment approved',
  });
  expect(api.posts[0].contentType).toContain('application/json');
  expect(api.blocked).toEqual([]);
});

test('an empty note is omitted from the request', async ({ page }) => {
  const api = await interceptApi(page);
  await openDocument(page);

  await reviewerInput(page).fill('Dana Example');
  await noteInput(page).fill('    ');
  await markReviewedButton(page).click();

  await expect(statusField(page)).toContainText('Reviewed');
  await expect(reviewRegion(page).getByRole('status')).toContainText('לא נשלחה הערה');

  expect(api.posts).toHaveLength(1);
  expect(api.posts[0].body).toEqual({
    document_id: 'exec-4001',
    status: 'Reviewed',
    reviewed_by: 'Dana Example',
  });
  expect(Object.keys(api.posts[0].body as object)).not.toContain('review_note');
  expect(api.blocked).toEqual([]);
});

test('while the reply is held, controls are disabled and the status is unchanged', async ({
  page,
}) => {
  const hold = gate();
  const api = await interceptApi(page, {
    review: { kind: 'hold', until: hold.until, next: success },
  });
  await openDocument(page);

  await reviewerInput(page).fill('Dana Example');
  await markReviewedButton(page).click();

  await expect(reviewRegion(page).getByRole('status')).toContainText('שולח את הבדיקה');
  await expect(markReviewedButton(page)).toBeDisabled();
  await expect(reviewerInput(page)).toBeDisabled();
  await expect(noteInput(page)).toBeDisabled();
  await expect(statusField(page)).toContainText('Needs Review');
  await expect(statusField(page)).not.toContainText('Reviewed');
  expect(api.posts).toHaveLength(1);

  hold.release();

  await expect(statusField(page)).toContainText('Reviewed');
  await expect(reviewRegion(page).getByRole('status')).toContainText('הבדיקה נשמרה');
  expect(api.posts).toHaveLength(1);
  expect(api.blocked).toEqual([]);
});

test('a double click and two same-tick clicks create exactly one POST', async ({ page }) => {
  const hold = gate();
  const api = await interceptApi(page, {
    review: { kind: 'hold', until: hold.until, next: success },
  });
  await openDocument(page);

  await reviewerInput(page).fill('Dana Example');
  // Two clicks in the same tick, before React can re-render the button.
  await markReviewedButton(page).evaluate((button: HTMLButtonElement) => {
    button.click();
    button.click();
  });
  await markReviewedButton(page).dblclick({ force: true });

  await expect(reviewRegion(page).getByRole('status')).toContainText('שולח את הבדיקה');
  hold.release();
  await expect(statusField(page)).toContainText('Reviewed');

  expect(api.posts).toHaveLength(1);
  expect(api.blocked).toEqual([]);
});

test('route failures show only the sanitized message and keep status, inputs and retry', async ({
  page,
}) => {
  const api = await interceptApi(page);
  await openDocument(page);

  await reviewerInput(page).fill('Dana Example');
  await noteInput(page).fill('Checked with finance.');

  const cases: Array<{ status: number; message: string; extra?: Record<string, unknown> }> = [
    { status: 400, message: 'הבקשה אינה תקינה. בדיקת שדות.' },
    {
      status: 401,
      message: 'השרת לא אושר מול מערכת האוטומציה. זו תקלת תצורה.',
      extra: { error_code: 'UNAUTHORIZED' },
    },
    { status: 500, message: 'תקלת תצורה בשרת. יש לפנות למי שמתחזק את המערכת.' },
    { status: 502, message: 'מערכת האוטומציה החזירה שגיאה. הבדיקה לא נשמרה.' },
    { status: 504, message: 'עדכון הבדיקה לא הסתיים בזמן. אפשר לנסות שוב.' },
  ];

  for (const [index, failure] of cases.entries()) {
    api.setReply({
      kind: 'json',
      status: failure.status,
      body: {
        status: 'error',
        message: failure.message,
        ...failure.extra,
        detail: UPSTREAM_MARKER,
        url: UPSTREAM_URL,
      },
    });

    await attempt(page, api, index + 1);

    const alert = reviewRegion(page).getByRole('alert');
    await expect(alert).toHaveText(failure.message);
    await expect(statusField(page)).toContainText('Needs Review');
    await expect(reviewerInput(page)).toHaveValue('Dana Example');
    await expect(noteInput(page)).toHaveValue('Checked with finance.');
    await expect(main(page)).not.toContainText(UPSTREAM_MARKER);
    await expect(main(page)).not.toContainText('n8n.invalid');
    await expect(main(page)).not.toContainText('UNAUTHORIZED');
  }

  // The same button retries; this time the reply succeeds.
  api.setReply(success);
  await markReviewedButton(page).click();

  await expect(statusField(page)).toContainText('Reviewed');
  await expect(reviewRegion(page).getByRole('alert')).toHaveCount(0);
  expect(api.posts).toHaveLength(cases.length + 1);
  expect(api.posts.at(-1)?.body).toEqual({
    document_id: 'exec-4001',
    status: 'Reviewed',
    reviewed_by: 'Dana Example',
    review_note: 'Checked with finance.',
  });
  expect(api.blocked).toEqual([]);
});

test('a 404 shows the fixed Hebrew message, not the English contract literal', async ({ page }) => {
  const api = await interceptApi(page, {
    review: { kind: 'json', status: 404, body: { status: 'error', message: 'Document not found.' } },
  });
  await openDocument(page);

  await reviewerInput(page).fill('Dana Example');
  await markReviewedButton(page).click();

  const alert = reviewRegion(page).getByRole('alert');
  await expect(alert).toContainText('המסמך לא נמצא ביומן המסמכים');
  await expect(alert).toContainText('לרענן את הדף');
  await expect(main(page)).not.toContainText('Document not found.');
  await expect(statusField(page)).toContainText('Needs Review');
  expect(api.posts).toHaveLength(1);
  expect(api.blocked).toEqual([]);
});

test('non-JSON, malformed and network failures show fixed messages and no upstream content', async ({
  page,
}) => {
  const api = await interceptApi(page);
  await openDocument(page);
  await reviewerInput(page).fill('Dana Example');

  const alert = reviewRegion(page).getByRole('alert');

  api.setReply({ kind: 'text', status: 502, body: `Bad gateway ${UPSTREAM_MARKER}` });
  await attempt(page, api, 1);
  await expect(alert).toContainText('מבנה בלתי צפוי');

  api.setReply({ kind: 'text', status: 200, body: `ok ${UPSTREAM_MARKER}` });
  await attempt(page, api, 2);
  await expect(alert).toContainText('מבנה בלתי צפוי');

  api.setReply({
    kind: 'json',
    status: 200,
    body: { status: 'processed', document_id: 'exec-4001', detail: UPSTREAM_MARKER },
  });
  await attempt(page, api, 3);
  await expect(alert).toContainText('מבנה בלתי צפוי');

  api.setReply({ kind: 'json', status: 500, body: { error: UPSTREAM_MARKER, url: UPSTREAM_URL } });
  await attempt(page, api, 4);
  await expect(alert).toContainText('מבנה בלתי צפוי');

  api.setReply({ kind: 'network' });
  await attempt(page, api, 5);
  await expect(alert).toContainText('לא ניתן היה לפנות לשרת היישום');

  await expect(statusField(page)).toContainText('Needs Review');
  await expect(main(page)).not.toContainText(UPSTREAM_MARKER);
  await expect(main(page)).not.toContainText('n8n.invalid');
  expect(api.posts).toHaveLength(5);
  expect(api.blocked).toEqual([]);
});

test('the review times out at exactly 95,000 ms, not before, without a real wait', async ({
  page,
}) => {
  await page.clock.install();
  const api = await interceptApi(page, { review: { kind: 'never' } });
  await openDocument(page);

  await reviewerInput(page).fill('Dana Example');
  await noteInput(page).fill('Timed out note.');
  await pauseClock(page);
  await markReviewedButton(page).click();

  const sending = reviewRegion(page).getByRole('status');
  await expect(sending).toContainText('שולח את הבדיקה');
  await expect.poll(() => api.posts.length).toBe(1);

  await page.clock.runFor(94_999);
  await settle(page);
  await expect(sending).toContainText('שולח את הבדיקה');
  await expect(markReviewedButton(page)).toBeDisabled();
  await expect(reviewRegion(page).getByRole('alert')).toHaveCount(0);
  await expect(main(page)).not.toContainText('לא הסתיים בזמן');
  await expect(statusField(page)).toContainText('Needs Review');

  await page.clock.runFor(1);
  await expect(reviewRegion(page).getByRole('alert')).toHaveText(
    'עדכון הבדיקה לא הסתיים בזמן, ולכן הסטטוס לא שונה. אפשר לנסות שוב.',
  );
  await expect(statusField(page)).toContainText('Needs Review');
  await expect(reviewerInput(page)).toHaveValue('Dana Example');
  await expect(noteInput(page)).toHaveValue('Timed out note.');
  await expect(markReviewedButton(page)).toBeEnabled();
  expect(api.posts).toHaveLength(1);
  expect(api.blocked).toEqual([]);
});

test('leaving while the review reply is held leaves no late state behind', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  const hold = gate();
  const api = await interceptApi(page, {
    review: { kind: 'hold', until: hold.until, next: success },
  });
  await openDocument(page);

  await reviewerInput(page).fill('Dana Example');
  await noteInput(page).fill('Left before the reply.');
  await markReviewedButton(page).click();
  await expect(reviewRegion(page).getByRole('status')).toContainText('שולח את הבדיקה');
  await expect.poll(() => api.posts.length).toBe(1);

  // Client-side navigation unmounts the detail screen inside the same page.
  await main(page).getByRole('link', { name: 'חזרה ללוח המסמכים' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { name: 'לוח מסמכים', level: 2, exact: true })).toBeVisible();

  hold.release();
  await expect.poll(() => api.settledPosts.length).toBe(1);
  await settle(page);

  await expect(page).toHaveURL(/\/$/);
  await expect(reviewRegion(page)).toHaveCount(0);
  await expect(main(page)).not.toContainText('הבדיקה נשמרה');
  await expect(main(page)).not.toContainText('עדכון הבדיקה');
  await expect(main(page)).not.toContainText('שולח את הבדיקה');
  expect(api.posts).toHaveLength(1);
  expect(pageErrors).toEqual([]);
  expect(api.blocked).toEqual([]);
});

test('a reply with a mismatched document_id never marks the record Reviewed', async ({ page }) => {
  const api = await interceptApi(page, {
    review: { kind: 'json', status: 200, body: { status: 'updated', document_id: 'exec-9999' } },
  });
  await openDocument(page);

  await reviewerInput(page).fill('Dana Example');
  await markReviewedButton(page).click();

  await expect(reviewRegion(page).getByRole('alert')).toContainText('מבנה בלתי צפוי');
  await expect(statusField(page)).toContainText('Needs Review');
  await expect(reviewRegion(page).getByText('הבדיקה נשמרה')).toHaveCount(0);
  await expect(markReviewedButton(page)).toBeEnabled();
  expect(api.posts).toHaveLength(1);
  expect(api.blocked).toEqual([]);
});

test('an already-Reviewed record sends zero review requests', async ({ page }) => {
  const api = await interceptApi(page, { rows: [{ ...row, status: 'Reviewed' }] });

  await page.goto('/documents/exec-4001');
  await expect(statusField(page)).toContainText('Reviewed');

  await expect(markReviewedButton(page)).toBeDisabled();
  await expect(reviewerInput(page)).toBeDisabled();
  await markReviewedButton(page).evaluate((button: HTMLButtonElement) => button.click());
  await markReviewedButton(page).click({ force: true });

  await expect(reviewRegion(page).getByRole('alert')).toHaveCount(0);
  expect(api.posts).toHaveLength(0);
  expect(api.blocked).toEqual([]);
});
