import Link from 'next/link';
import { PROJECT_IDENTITY, NAV_LINKS } from '@/lib/project';

/**
 * Project identity + primary navigation. Server component, static.
 */
export function SiteHeader() {
  return (
    <header className="border-b border-[var(--color-line)]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">
            {PROJECT_IDENTITY.titleCombined}
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            {PROJECT_IDENTITY.subtitleHe}
          </p>
        </div>
        <nav aria-label="ניווט ראשי">
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:underline">
                  {link.labelHe}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
