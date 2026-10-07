import { describe, it, expect } from 'vitest';
import { PROJECT_IDENTITY, NAV_LINKS } from './project';
import { getEnv, SERVER_ENV_KEY_NAMES } from './env';

describe('project identity (scaffold rule)', () => {
  it('uses the approved package name', () => {
    expect(PROJECT_IDENTITY.packageName).toBe('intent-gate');
  });

  it('is Hebrew-first and RTL', () => {
    expect(PROJECT_IDENTITY.locale).toBe('he');
    expect(PROJECT_IDENTITY.dir).toBe('rtl');
  });

  it('carries the Smart Office product identity', () => {
    expect(PROJECT_IDENTITY.name).toBe('Smart Office Document Assistant');
    expect(PROJECT_IDENTITY.titleCombined).toBe('Smart Office Document Assistant');
    expect(PROJECT_IDENTITY.subtitleHe).toBe('קליטת מסמכים, חילוץ מידע, תיעדוף ומעקב במקום אחד');
    expect(PROJECT_IDENTITY.subtitleEn).toBe(
      'Document intake, information extraction, prioritization, and tracking in one place',
    );
  });

  it('carries no superseded Intent Gate identity', () => {
    const identity = JSON.stringify(PROJECT_IDENTITY);
    expect(identity).not.toContain('שער הכוונה');
    expect(identity).not.toContain('Intent Gate');
  });

  it('declares a local-only font stack (no external font downloads)', () => {
    expect(PROJECT_IDENTITY.fontStack).toBe('Heebo, Rubik, Arial, sans-serif');
  });

  it('declares the synthetic-data-only policy', () => {
    expect(PROJECT_IDENTITY.dataPolicy).toContain('synthetic-data-only');
  });
});

describe('primary navigation', () => {
  it('links exactly the two Smart Office destinations, in order', () => {
    expect([...NAV_LINKS]).toEqual([
      { href: '/', labelHe: 'לוח מסמכים' },
      { href: '/upload', labelHe: 'העלאת מסמך' },
    ]);
  });

  it('carries none of the superseded meeting labels or routes', () => {
    const labels = NAV_LINKS.map((link) => link.labelHe as string);
    for (const stale of ['לוח מפגשים', 'מפגש חדש', 'תצוגת מבנה (דמו)']) {
      expect(labels).not.toContain(stale);
    }
    expect(NAV_LINKS.some((link) => link.href.startsWith('/sessions'))).toBe(false);
  });
});

describe('server env reader (scaffold rule)', () => {
  it('documents exactly the five Smart Office server-only variable names', () => {
    // Root CONTRACT.md §7.
    expect([...SERVER_ENV_KEY_NAMES]).toEqual([
      'N8N_BASE_URL',
      'N8N_PROCESS_PATH',
      'N8N_DOCUMENTS_PATH',
      'N8N_REVIEW_PATH',
      'N8N_SECRET',
    ]);
  });

  it('throws a clear error only when a missing value is actually requested', () => {
    const key = 'N8N_BASE_URL';
    const previous = process.env[key];
    delete process.env[key];
    try {
      expect(() => getEnv(key)).toThrow(/Missing required environment variable/);
    } finally {
      if (previous !== undefined) process.env[key] = previous;
    }
  });
});
