/**
 * Server-only, lazy environment reader for Smart Office Document Assistant.
 *
 * - Do NOT import this from Client Components ("use client").
 * - No value is required at import time; a clear error is thrown only when a
 *   missing value is actually requested.
 * - No NEXT_PUBLIC_ secret variables: nothing here is exposed to the browser.
 *
 * Read only by the server clients for Workflow A (`process-document-client.ts`),
 * Workflow B (`documents-client.ts`) and Workflow C (`review-client.ts`).
 */

// Root CONTRACT.md §7 / instructor Appendix A.
const SERVER_ENV_KEYS = [
  'N8N_BASE_URL',
  'N8N_PROCESS_PATH',
  'N8N_DOCUMENTS_PATH',
  'N8N_REVIEW_PATH',
  'N8N_SECRET',
] as const;

export type ServerEnvKey = (typeof SERVER_ENV_KEYS)[number];

/** The exact set of names documented in .env.example. */
export const SERVER_ENV_KEY_NAMES: readonly ServerEnvKey[] = SERVER_ENV_KEYS;

function assertServer(): void {
  if (typeof window !== 'undefined') {
    throw new Error(
      'src/lib/env.ts is server-only and must not run in browser/client code.',
    );
  }
}

/**
 * Read a required environment variable. Throws a clear, actionable error if it
 * is missing or empty — but only at the moment it is requested.
 */
export function getEnv(key: ServerEnvKey): string {
  assertServer();
  const value = process.env[key];
  if (value === undefined || value === '') {
    throw new Error(
      `Missing required environment variable "${key}". ` +
        'Set it in .env.local (never commit real values). ' +
        'The full list of names is in .env.example.',
    );
  }
  return value;
}
