import { DocumentUploadForm } from '@/components/document-upload-form';

/**
 * F1 upload screen. `SPEC.md` §16 M5: the form sends the document to the
 * same-origin `POST /api/process-document`, which calls Workflow A server-side.
 */
export default function UploadPage() {
  return (
    <section aria-labelledby="upload-title" className="flex flex-col gap-6">
      <div>
        <h2 id="upload-title" className="text-lg font-semibold">
          העלאת מסמך
        </h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          בחרו מסמך אחד לעיבוד. המסמך נשלח לשרת של היישום, והשרת מעביר אותו
          בצורה מאובטחת למערכת האוטומציה. התוצאה תוצג כאן רק אחרי שתתקבל תשובה.
        </p>
      </div>

      <DocumentUploadForm />
    </section>
  );
}
