/**
 * Persistent "academic prototype / synthetic data only" notice.
 * Server component. Static text only.
 */
export function PrototypeNotice() {
  return (
    <div
      role="note"
      className="w-full border-b border-[var(--color-line)] bg-[var(--color-notice-bg)] px-4 py-2 text-center text-sm text-[var(--color-notice-fg)]"
    >
      אב-טיפוס אקדמי — נתונים סינתטיים או אנונימיים בלבד. אין להזין מסמכי לקוח
      אמיתיים, מידע מזהה או מידע עסקי חסוי.
      <span className="mx-2 opacity-60">·</span>
      <span dir="ltr">Academic prototype — synthetic / anonymized data only.</span>
    </div>
  );
}
