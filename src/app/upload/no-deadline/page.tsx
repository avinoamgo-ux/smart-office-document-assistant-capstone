import Link from 'next/link';
import { DocumentUploadForm } from '@/components/document-upload-form';

/**
 * Demo route for F3's acceptance case: "Processing the Part 1 complaint document
 * with no deadline still renders a complete card" (instructor Part 2 doc §7 F3).
 *
 * Same live screen as `/upload` (`SPEC.md` §16 M5): the chosen document is sent
 * to Workflow A like any other upload. The no-deadline case now depends on the
 * document the user uploads, not on a fixture. Deliberately not in the main
 * navigation: it is a demo and test route.
 */
export default function UploadNoDeadlineDemoPage() {
  return (
    <section aria-labelledby="upload-no-deadline-title" className="flex flex-col gap-6">
      <div>
        <h2 id="upload-no-deadline-title" className="text-lg font-semibold">
          הדגמה: מסמך בלי מועד יעד
        </h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          מסך ההעלאה הרגיל, לבדיקת מסמך שאין בו מועד יעד, למשל מכתב תלונה. המטרה
          היא להראות שכרטיס התוצאה נשאר שלם גם כשחסר מידע: ערך חסר מוצג בנוסח
          של החוזה עצמו, ולא כשדה ריק. השליחה כאן היא עיבוד אמיתי לכל דבר, בדיוק
          כמו במסך ההעלאה. זה עמוד הדגמה ובדיקה בלבד, והוא אינו מופיע בתפריט
          הראשי.
        </p>
      </div>

      <DocumentUploadForm />

      <p className="text-sm">
        <Link href="/upload">חזרה למסך ההעלאה</Link>
      </p>
    </section>
  );
}
