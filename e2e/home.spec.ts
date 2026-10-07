import { test, expect, type Page, type Route } from '@playwright/test';

/**
 * Home page: the product shell and the live dashboard.
 *
 * Safety: the dashboard loads `GET /api/documents` on mount, so every test
 * registers a catch-all `**\/api/**` guard first (it aborts and records anything
 * unexpected) and the specific documents handler after it, before any
 * navigation. Handlers serve synthetic fixtures only and never assert. Nothing
 * reaches a real route handler, n8n or an external service.
 */

const API_GUARD = '**/api/**';
const DOCUMENTS_ROUTE = '**/api/documents';

const baseRow = {
  received_at: '2026-09-26T09:00:00Z',
  file_link: 'https://example.com/file/d/home/view',
  document_type: 'invoice',
  sender_or_company: 'Home Fixture Ltd',
  summary: 'Row served by an intercepted application API response.',
  requested_action: 'Approve the fixture invoice',
  deadline: '30 September 2026',
  urgency: 'Low',
  department: 'Finance',
  status: 'Processed',
};

const rows = [
  { ...baseRow, document_id: 'exec-6001', file_name: 'home-oldest-6001.pdf', received_at: '2026-09-24T08:00:00Z' },
  {
    ...baseRow,
    document_id: 'exec-6002',
    file_name: 'home-newest-6002.pdf',
    received_at: '2026-09-26T12:30:00Z',
    urgency: 'High',
  },
  {
    ...baseRow,
    document_id: 'exec-6003',
    file_name: 'home-middle-6003.txt',
    received_at: '2026-09-25T10:15:00Z',
    document_type: 'complaint',
    sender_or_company: 'Searchable Partner Ltd',
    urgency: 'High',
    department: 'Support',
  },
];

/** Registers the guard, then the documents handler, before any navigation. */
async function interceptApi(page: Page, body: unknown = rows) {
  const blocked: string[] = [];

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
    await route
      .fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) })
      .catch(() => {});
  });

  return { blocked };
}

/** Scoped to the named documents list — the site nav is also a list. */
function documentRows(page: Page) {
  return page.getByRole('list', { name: 'מסמכים', exact: true }).getByRole('listitem');
}

test.afterEach(async ({ page }) => {
  await page.unrouteAll({ behavior: 'ignoreErrors' });
});

test('home page loads with the Smart Office identity in a Hebrew RTL shell', async ({ page }) => {
  const api = await interceptApi(page, []);
  await page.goto('/');

  // Exact product title, in the browser tab and as the site heading.
  await expect(page).toHaveTitle('Smart Office Document Assistant');
  await expect(
    page.getByRole('heading', { name: 'Smart Office Document Assistant', level: 1, exact: true }),
  ).toBeVisible();

  const header = page.getByRole('banner');
  await expect(header).toContainText('קליטת מסמכים, חילוץ מידע, תיעדוף ומעקב במקום אחד');
  await expect(header).not.toContainText('שער הכוונה');
  await expect(header).not.toContainText('Intent Gate');

  await expect(page.getByRole('contentinfo')).toHaveText(
    'אב־טיפוס אקדמי · נתונים סינתטיים או אנונימיים בלבד',
  );

  // Document is Hebrew + RTL.
  const html = page.locator('html');
  await expect(html).toHaveAttribute('lang', 'he');
  await expect(html).toHaveAttribute('dir', 'rtl');
  expect(api.blocked).toEqual([]);
});

test('primary navigation links exactly the dashboard and the upload screen', async ({ page }) => {
  const api = await interceptApi(page, []);
  await page.goto('/');

  const links = page.getByRole('navigation', { name: 'ניווט ראשי' }).getByRole('link');
  await expect(links).toHaveCount(2);
  await expect(links.nth(0)).toHaveText('לוח מסמכים');
  await expect(links.nth(0)).toHaveAttribute('href', '/');
  await expect(links.nth(1)).toHaveText('העלאת מסמך');
  await expect(links.nth(1)).toHaveAttribute('href', '/upload');

  for (const stale of ['לוח מפגשים', 'מפגש חדש', 'תצוגת מבנה (דמו)']) {
    await expect(page.getByRole('link', { name: stale })).toHaveCount(0);
  }
  expect(api.blocked).toEqual([]);
});

test('the dashboard states its live source and lists the returned rows newest first', async ({
  page,
}) => {
  const api = await interceptApi(page);
  await page.goto('/');

  // The layout's prototype notice is also role="note"; scope to main.
  const notice = page.getByRole('main').getByRole('note');
  await expect(notice).toContainText('הנתונים נטענים מיומן המסמכים');
  await expect(notice).toContainText('/api/documents');
  await expect(page.getByRole('main')).not.toContainText('דמה');

  await expect(documentRows(page)).toHaveCount(3);
  await expect(page.getByText('מוצגים 3 מתוך 3 מסמכים')).toBeVisible();

  const titles = documentRows(page).getByRole('heading', { level: 3 });
  await expect(titles).toHaveText([
    'home-newest-6002.pdf',
    'home-middle-6003.txt',
    'home-oldest-6001.pdf',
  ]);
  expect(api.blocked).toEqual([]);
});

test('filtering by urgency High returns only the urgent live documents', async ({ page }) => {
  const api = await interceptApi(page);
  await page.goto('/');
  await expect(documentRows(page)).toHaveCount(3);

  await page.getByLabel('דחיפות (urgency)').selectOption('High');

  await expect(documentRows(page)).toHaveCount(2);
  const badges = documentRows(page).locator('span').filter({ hasText: /^(High|Medium|Low)$/ });
  expect(new Set(await badges.allTextContents())).toEqual(new Set(['High']));
  expect(api.blocked).toEqual([]);
});

test('search narrows by sender and shows a clear no-results state', async ({ page }) => {
  const api = await interceptApi(page);
  await page.goto('/');
  await expect(documentRows(page)).toHaveCount(3);

  const search = page.getByRole('searchbox');
  await search.fill('searchable partner');
  await expect(documentRows(page)).toHaveCount(1);
  await expect(documentRows(page).first()).toContainText('Searchable Partner Ltd');

  await search.fill('no-such-document-anywhere');
  await expect(documentRows(page)).toHaveCount(0);
  await expect(page.getByRole('main').getByRole('status')).toContainText('אין תוצאות מתאימות');
  expect(api.blocked).toEqual([]);
});
