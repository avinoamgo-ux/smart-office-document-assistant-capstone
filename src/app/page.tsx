import { DocumentsDashboard } from '@/components/documents-dashboard';

export default function DashboardPage() {
  return (
    <section aria-labelledby="dashboard-title" className="flex flex-col gap-6">
      <div>
        <h2 id="dashboard-title" className="text-lg font-semibold">
          לוח מסמכים
        </h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          המסמכים מוצגים מהחדש לישן לפי מועד הקליטה. ערכי השדות מוצגים במדויק כפי
          שה-workflow מחזיר אותם, בלי תרגום ובלי שינוי שם.
        </p>
      </div>

      {/* The dashboard loads the live list itself and owns its source notice. */}
      <DocumentsDashboard />
    </section>
  );
}
