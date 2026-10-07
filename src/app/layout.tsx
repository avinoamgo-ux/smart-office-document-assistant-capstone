import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { PROJECT_IDENTITY } from '@/lib/project';
import { PrototypeNotice } from '@/components/prototype-notice';
import { SiteHeader } from '@/components/site-header';

export const metadata: Metadata = {
  title: 'Smart Office Document Assistant',
  description:
    'אב־טיפוס אקדמי לקליטת מסמכים, חילוץ מידע, תיעדוף ומעקב. נתונים סינתטיים או אנונימיים בלבד.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={PROJECT_IDENTITY.locale} dir={PROJECT_IDENTITY.dir}>
      <body className="flex min-h-screen flex-col antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only absolute right-2 top-2 rounded bg-white px-3 py-1 shadow"
        >
          דלג לתוכן
        </a>
        <PrototypeNotice />
        <SiteHeader />
        <main id="main" className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-[var(--color-line)] px-4 py-4 text-center text-xs text-[var(--color-muted)]">
          אב־טיפוס אקדמי · נתונים סינתטיים או אנונימיים בלבד
        </footer>
      </body>
    </html>
  );
}
