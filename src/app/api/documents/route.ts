import { NextResponse } from 'next/server';
import { fetchDocuments, type DocumentsFetchFailure } from '../../../lib/documents-client';

/**
 * `GET /api/documents` — the browser-facing half of Workflow B.
 *
 * Presentation-layer proxy only: it attaches the secret server-side, validates
 * the rows against root `CONTRACT.md` §4, and returns either the validated
 * array or a sanitized error. It takes no query parameters (§4 — search and
 * filtering happen in the application over the returned array) and performs no
 * business logic (§8).
 */

export const dynamic = 'force-dynamic';

const FAILURE_RESPONSES: Record<DocumentsFetchFailure, { status: number; message: string }> = {
  misconfigured: {
    status: 500,
    message: 'תקלת תצורה בשרת. יש לפנות למי שמתחזק את המערכת.',
  },
  unauthorized: {
    status: 401,
    message: 'השרת לא אושר מול מערכת האוטומציה. זו תקלת תצורה ולא משהו שניתן לתקן מהמסך.',
  },
  timeout: {
    status: 504,
    message: 'מערכת האוטומציה לא השיבה בזמן. נסו לרענן בעוד רגע.',
  },
  unreachable: {
    status: 502,
    message: 'אין כרגע קשר עם מערכת האוטומציה. נסו לרענן בעוד רגע.',
  },
  upstream: {
    status: 502,
    message: 'מערכת האוטומציה החזירה שגיאה. רשימת המסמכים אינה זמינה כרגע.',
  },
  malformed: {
    status: 502,
    message: 'רשימת המסמכים חזרה במבנה בלתי צפוי ולכן לא הוצגה.',
  },
};

export async function GET() {
  const result = await fetchDocuments();

  if (result.ok) {
    return NextResponse.json(result.documents, { status: 200 });
  }

  const { status, message } = FAILURE_RESPONSES[result.failure];

  // §7: the only error_code this route reports is UNAUTHORIZED.
  if (result.failure === 'unauthorized') {
    return NextResponse.json(
      { status: 'error', error_code: 'UNAUTHORIZED', message },
      { status },
    );
  }

  // §11: every other failure is a sanitized message with no invented code.
  return NextResponse.json({ status: 'error', message }, { status });
}
