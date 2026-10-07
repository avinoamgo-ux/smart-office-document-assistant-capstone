/**
 * Hardened n8n webhook URL construction, shared by the server clients for
 * Workflow A (`process-document-client.ts`), Workflow B (`documents-client.ts`)
 * and Workflow C (`review-client.ts`).
 *
 * Protections: no credentials in the base URL, no scheme or query in the path,
 * no traversal, no host swap. Error message prefixes are kept stable, because
 * callers classify configuration failures by them.
 */

export function parseBaseUrl(baseUrl: string): URL {
  const url = new URL(baseUrl);
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('Invalid base URL protocol');
  }
  if (url.username || url.password) {
    throw new Error('Invalid base URL credentials');
  }
  return url;
}

export function validateWebhookPath(path: string): string {
  if (!path || path.length === 0) throw new Error('Invalid webhook path');
  if (path.startsWith('//')) throw new Error('Invalid webhook path');
  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(path)) throw new Error('Invalid webhook path');
  if (path.includes('?') || path.includes('#')) throw new Error('Invalid webhook path');

  const decoded = decodeURIComponent(path);
  if (decoded.includes('..')) throw new Error('Invalid webhook path');

  const normalized = path.replace(/%2e%2e/gi, '');
  if (normalized.includes('../') || normalized.includes('..\\')) throw new Error('Invalid webhook path');

  return path;
}

export function buildN8nUrl(baseUrl: string, path: string): URL {
  const parsedBase = parseBaseUrl(baseUrl);
  const safePath = validateWebhookPath(path);

  const prefix = parsedBase.pathname === '/' ? '' : parsedBase.pathname.replace(/\/+$/, '');
  const trimmedPath = safePath.replace(/^\/+/, '');
  const relativePath = `${prefix}/${trimmedPath}`.replace(/\/+/g, '/');

  const target = new URL(relativePath, parsedBase.origin);
  if (target.host !== parsedBase.host) {
    throw new Error('Invalid webhook URL');
  }
  if (target.pathname.includes('/../') || target.pathname.includes('/..')) {
    throw new Error('Invalid webhook URL');
  }

  return target;
}
