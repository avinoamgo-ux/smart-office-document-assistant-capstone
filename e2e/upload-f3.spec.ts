import { test, expect, type Page } from '@playwright/test';
import {
  processDocumentResponseSchema,
  type ProcessDocumentResponse,
} from '../src/lib/process-document-contract';

/**
 * F3 only — instructor Part 2 doc §7 F3: "Displays all seven extracted fields
 * plus the file link, with a coloured urgency badge", handling "'Not found' and
 * 'No action found' values shown honestly rather than as empty space".
 *
 * Transport is intercepted: `/api/process-document` is answered with a fully
 * synthetic response, so these tests prove the card renders what the route
 * returns — not what n8n would extract. Every test installs its interceptions
 * before navigation; every other `/api/` request is aborted and recorded.
 */

const TXT_MIME = 'text/plain';

const PROCESS_DOCUMENT_ROUTE = '**/api/process-document';

const SYNTHETIC_FILE_LINK = 'https://example.test/synthetic/file/SYN-0003/view';

type Fields = ProcessDocumentResponse['fields'];

const INVOICE_FIELDS: Fields = {
  document_type: 'invoice',
  sender_or_company: 'Synthetic Supplies Ltd',
  summary: 'Synthetic invoice for office chairs, used only in tests.',
  requested_action: 'Approve synthetic invoice SYN-0003',
  deadline: '12 March 2026',
  urgency: 'High',
  department: 'Finance',
};

const NO_DEADLINE_COMPLAINT_FIELDS: Fields = {
  document_type: 'complaint',
  sender_or_company: 'Synthetic Retail Ltd',
  summary: 'Synthetic complaint about a late delivery, used only in tests.',
  requested_action: 'No action found',
  deadline: 'Not found',
  urgency: 'Low',
  department: 'Support',
};

/** Fully synthetic, and validated against the application's own schema. */
function syntheticProcessed(fileName: string, fields: Fields): ProcessDocumentResponse {
  return processDocumentResponseSchema.parse({
    status: 'processed',
    document_id: 'synthetic-exec-0003',
    file_name: fileName,
    file_link: SYNTHETIC_FILE_LINK,
    received_at: '2026-09-30T09:24:00.000Z',
    fields,
    notification_sent: true,
  });
}

/**
 * Must be called before `page.goto`. The catch-all aborts and records any other
 * `/api/` request; Playwright runs the most recently registered matching route
 * first, so the process-document interception answers before it.
 */
async function interceptApi(
  page: Page,
  fields: Fields,
): Promise<{ posts: string[]; blocked: string[] }> {
  const posts: string[] = [];
  const blocked: string[] = [];

  await page.route('**/api/**', (route) => {
    blocked.push(new URL(route.request().url()).pathname);
    return route.abort();
  });

  await page.route(PROCESS_DOCUMENT_ROUTE, (route) => {
    const request = route.request();
    if (request.method() !== 'POST') {
      return route.fulfill({ status: 405, contentType: 'application/json', body: '{}' });
    }

    let body: { file_name?: unknown } = {};
    try {
      body = (request.postDataJSON() as typeof body) ?? {};
    } catch {
      body = {};
    }
    const fileName = String(body.file_name);
    posts.push(fileName);

    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(syntheticProcessed(fileName, fields)),
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

function resultCard(page: Page) {
  return page.getByRole('region', { name: 'תוצאת העיבוד' });
}

/**
 * One field row inside the card, found by the contract field name in its label.
 * The row holds both the label and the value, so this never matches the nested
 * LTR span twice the way a bare text locator would.
 */
function fieldRow(page: Page, contractFieldName: string) {
  return resultCard(page)
    .locator('dl > div')
    .filter({ hasText: `(${contractFieldName})` });
}

const SEVEN_FIELDS = [
  'document_type',
  'sender_or_company',
  'summary',
  'requested_action',
  'deadline',
  'urgency',
  'department',
] as const;

async function sendValidFile(page: Page) {
  await fileInput(page).setInputFiles({
    name: 'invoice-4471.txt',
    mimeType: TXT_MIME,
    buffer: Buffer.alloc(4096, 'a'),
  });
  await sendButton(page).click();
}

test('the result card shows all seven fields, the file link and the urgency badge', async ({
  page,
}) => {
  const { posts, blocked } = await interceptApi(page, INVOICE_FIELDS);
  await page.goto('/upload');

  // Nothing is shown before a submission.
  await expect(resultCard(page)).toHaveCount(0);

  await sendValidFile(page);

  const card = resultCard(page);
  await expect(card).toBeVisible();

  // All seven field labels carry the contract's own field names.
  for (const key of SEVEN_FIELDS) {
    await expect(card.getByText(key, { exact: false })).toBeVisible();
  }

  // The seven values, exactly as the synthetic response returned them.
  for (const field of SEVEN_FIELDS) {
    await expect(fieldRow(page, field)).toContainText(INVOICE_FIELDS[field]);
  }

  // The uploaded file's name comes back in the response and is shown.
  await expect(fieldRow(page, 'file_name')).toContainText('invoice-4471.txt');

  // The urgency badge carries a text label, not colour alone. The outer span is
  // the badge itself; the inner one only isolates the Latin value as LTR.
  const badge = card.locator('span.inline-block').filter({ hasText: /^High$/ });
  await expect(badge).toHaveCount(1);
  await expect(badge).toHaveClass(/bg-red-100/);

  // The file link is the one the response carried, unchanged.
  const link = card.getByRole('link', { name: 'פתיחת הקובץ' });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('href', SYNTHETIC_FILE_LINK);

  expect(posts).toEqual(['invoice-4471.txt']);
  expect(blocked).toEqual([]);
});

test('the result is cleared when a new file is chosen, so it never outlives its file', async ({
  page,
}) => {
  const { posts, blocked } = await interceptApi(page, INVOICE_FIELDS);
  await page.goto('/upload');
  await sendValidFile(page);
  await expect(resultCard(page)).toBeVisible();

  await fileInput(page).setInputFiles({
    name: 'complaint-late-response.txt',
    mimeType: TXT_MIME,
    buffer: Buffer.alloc(1024, 'b'),
  });

  await expect(resultCard(page)).toHaveCount(0);
  // Choosing a file sends nothing; only the first click did.
  expect(posts).toEqual(['invoice-4471.txt']);
  expect(blocked).toEqual([]);
});

test('a complaint with no deadline still renders a complete result card', async ({ page }) => {
  const { posts, blocked } = await interceptApi(page, NO_DEADLINE_COMPLAINT_FIELDS);

  // The labelled demo route renders the same live form.
  await page.goto('/upload/no-deadline');
  await sendValidFile(page);

  const card = resultCard(page);
  await expect(card).toBeVisible();

  // Complete card: all seven fields are present, each exactly once.
  for (const field of SEVEN_FIELDS) {
    await expect(fieldRow(page, field)).toHaveCount(1);
  }

  // The missing deadline is shown in the contract's own wording, not as a blank
  // and not as a substitute.
  await expect(fieldRow(page, 'deadline')).toContainText('Not found');
  await expect(fieldRow(page, 'requested_action')).toContainText('No action found');

  // The fields that do have values still show them.
  await expect(fieldRow(page, 'document_type')).toContainText('complaint');
  await expect(fieldRow(page, 'sender_or_company')).toContainText('Synthetic Retail Ltd');
  await expect(fieldRow(page, 'department')).toContainText('Support');

  // The urgency badge is still there, with its text label and its colour.
  const badge = card.locator('span.inline-block').filter({ hasText: /^Low$/ });
  await expect(badge).toHaveCount(1);
  await expect(badge).toHaveClass(/bg-slate-100/);

  // The file link is still there.
  const link = card.getByRole('link', { name: 'פתיחת הקובץ' });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('href', SYNTHETIC_FILE_LINK);

  expect(posts).toEqual(['invoice-4471.txt']);
  expect(blocked).toEqual([]);
});
