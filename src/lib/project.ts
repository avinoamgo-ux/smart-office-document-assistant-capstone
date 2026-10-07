/**
 * Approved, stable project identity and vocabulary.
 *
 * Pure data only — safe to import from server or client code. No business
 * logic, no diagnosis, no intention inference.
 */

export const PROJECT_IDENTITY = {
  packageName: 'intent-gate',
  name: 'Smart Office Document Assistant',
  titleCombined: 'Smart Office Document Assistant',
  subtitleHe: 'קליטת מסמכים, חילוץ מידע, תיעדוף ומעקב במקום אחד',
  subtitleEn: 'Document intake, information extraction, prioritization, and tracking in one place',
  locale: 'he',
  dir: 'rtl',
  fontStack: 'Heebo, Rubik, Arial, sans-serif',
  dataPolicy: 'academic-prototype-synthetic-data-only',
} as const;

/**
 * Primary navigation: the Smart Office dashboard (F4/F5) and upload screen
 * (F1–F3).
 */
export const NAV_LINKS = [
  { href: '/', labelHe: 'לוח מסמכים' },
  { href: '/upload', labelHe: 'העלאת מסמך' },
] as const;
