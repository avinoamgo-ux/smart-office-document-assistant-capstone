import { NextResponse, type NextRequest } from 'next/server';
import { submitReview, type ReviewFailure } from '../../../lib/review-client';
import { reviewRequestSchema } from '../../../lib/review-contract';

/**
 * `POST /api/review` — the browser-facing half of Workflow C.
 *
 * Validates the §5.1 request, hands it to the server-only review client (which
 * attaches the secret and enforces the 90,000 ms timeout), then returns either
 * the validated §5.2 response or a sanitized error. `UNAUTHORIZED` is the only
 * `error_code` this endpoint may return (§5.3, §7, §11). It performs no
 * business logic and no Google call (§8).
 */

export const dynamic = 'force-dynamic';

const BAD_REQUEST_MESSAGE =
  'הבקשה אינה תקינה. יש לשלוח מזהה מסמך, סטטוס (Reviewed או Needs Review), שם הבודק, והערה של עד 200 תווים.';

/** §5.3 — the contract literal, returned unchanged. */
const NOT_FOUND_MESSAGE = 'Document not found.';

const FAILURE_RESPONSES: Record<
  ReviewFailure,
  { status: number; error_code?: 'UNAUTHORIZED'; message: string }
> = {
  invalid_request: {
    status: 400,
    message: BAD_REQUEST_MESSAGE,
  },
  misconfigured: {
    status: 500,
    message: 'תקלת תצורה בשרת. יש לפנות למי שמתחזק את המערכת.',
  },
  unauthorized: {
    status: 401,
    error_code: 'UNAUTHORIZED',
    message: 'השרת לא אושר מול מערכת האוטומציה. זו תקלת תצורה ולא משהו שניתן לתקן מהמסך.',
  },
  not_found: {
    status: 404,
    message: NOT_FOUND_MESSAGE,
  },
  timeout: {
    status: 504,
    message: 'עדכון הבדיקה לא הסתיים בזמן. אפשר לנסות שוב.',
  },
  unreachable: {
    status: 502,
    message: 'אין כרגע קשר עם מערכת האוטומציה. אפשר לנסות שוב בעוד רגע.',
  },
  upstream: {
    status: 502,
    message: 'מערכת האוטומציה החזירה שגיאה. הבדיקה לא נשמרה.',
  },
  malformed: {
    status: 502,
    message: 'תשובת העדכון חזרה במבנה בלתי צפוי ולכן לא הוצגה.',
  },
};

function errorJson(status: number, message: string, error_code?: 'UNAUTHORIZED') {
  return NextResponse.json(
    error_code ? { status: 'error', error_code, message } : { status: 'error', message },
    { status },
  );
}

export async function POST(request: NextRequest) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return errorJson(400, BAD_REQUEST_MESSAGE);
  }

  const parsed = reviewRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return errorJson(400, BAD_REQUEST_MESSAGE);
  }

  const result = await submitReview(parsed.data);

  if (result.ok) {
    return NextResponse.json(
      { status: result.review.status, document_id: result.review.document_id },
      { status: 200 },
    );
  }

  const { status, error_code, message } = FAILURE_RESPONSES[result.failure];
  return errorJson(status, message, error_code);
}
