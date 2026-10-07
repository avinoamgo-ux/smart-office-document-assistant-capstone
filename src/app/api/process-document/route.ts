import { NextResponse, type NextRequest } from 'next/server';
import {
  submitDocument,
  type ProcessDocumentFailure,
} from '../../../lib/process-document-client';
import {
  decodedByteLength,
  isAcceptedMimeType,
  isDataUrl,
  isPlainBase64,
  MAX_UPLOAD_BYTES,
  processDocumentRequestSchema,
} from '../../../lib/process-document-contract';

/**
 * `POST /api/process-document` — the browser-facing half of Workflow A.
 *
 * Validates the transport shape, the MIME type and the payload size, attaches
 * the secret server-side, then returns either the validated §3.2 response or a
 * sanitized error. It performs no extraction, no urgency decision and no
 * Google call (§8).
 */

export const dynamic = 'force-dynamic';

const BAD_BODY_MESSAGE =
  'הבקשה אינה תקינה. יש לשלוח שם קובץ, סוג קובץ ותוכן מקודד base64.';

const BAD_BASE64_MESSAGE =
  'תוכן הקובץ לא הגיע כ-base64 תקין. יש לשלוח את הקובץ בלי תחילית data:.';

const TOO_LARGE_MESSAGE = 'הקובץ גדול מהמותר (10MB). בחרו קובץ קטן יותר.';

const UNSUPPORTED_MESSAGE = 'ניתן לעבד קובצי PDF, DOCX ו-TXT בלבד.';

const FAILURE_RESPONSES: Record<
  ProcessDocumentFailure,
  { status: number; error_code?: string; message: string }
> = {
  misconfigured: {
    status: 500,
    message: 'תקלת תצורה בשרת. יש לפנות למי שמתחזק את המערכת.',
  },
  unauthorized: {
    status: 401,
    error_code: 'UNAUTHORIZED',
    message: 'השרת לא אושר מול מערכת האוטומציה. זו תקלת תצורה ולא משהו שניתן לתקן מהמסך.',
  },
  EMPTY_DOCUMENT: {
    status: 400,
    error_code: 'EMPTY_DOCUMENT',
    message: 'לא נמצא טקסט קריא במסמך. נסו קובץ אחר, למשל מסמך שאינו סרוק כתמונה.',
  },
  EXTRACTION_FAILED: {
    status: 500,
    error_code: 'EXTRACTION_FAILED',
    message: 'חילוץ המידע מהמסמך נכשל. אפשר לנסות לשלוח שוב.',
  },
  timeout: {
    status: 504,
    message: 'עיבוד המסמך לא הסתיים בזמן. אפשר לנסות לשלוח שוב.',
  },
  unreachable: {
    status: 502,
    message: 'אין כרגע קשר עם מערכת האוטומציה. אפשר לנסות לשלוח שוב בעוד רגע.',
  },
  upstream: {
    status: 502,
    message: 'מערכת האוטומציה החזירה שגיאה. המסמך לא עובד.',
  },
  malformed: {
    status: 502,
    message: 'תשובת העיבוד חזרה במבנה בלתי צפוי ולכן לא הוצגה.',
  },
};

function errorJson(status: number, message: string, error_code?: string) {
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
    return errorJson(400, BAD_BODY_MESSAGE);
  }

  const parsed = processDocumentRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return errorJson(400, BAD_BODY_MESSAGE);
  }

  const { mime_type, file_base64 } = parsed.data;

  // F1 / §3.3: an unsupported type is refused here, so no n8n execution runs.
  if (!isAcceptedMimeType(mime_type)) {
    return errorJson(400, UNSUPPORTED_MESSAGE, 'UNSUPPORTED_FILE_TYPE');
  }

  if (isDataUrl(file_base64) || !isPlainBase64(file_base64)) {
    return errorJson(400, BAD_BASE64_MESSAGE);
  }

  // §6 defines the 10 MB limit as a pre-request check. This is the server-side
  // backstop for a request that reaches the API anyway; it carries no
  // error_code, because the contract defines none for size.
  if (decodedByteLength(file_base64) > MAX_UPLOAD_BYTES) {
    return errorJson(413, TOO_LARGE_MESSAGE);
  }

  const result = await submitDocument(parsed.data);

  if (result.ok) {
    return NextResponse.json(result.document, { status: 200 });
  }

  const { status, error_code, message } = FAILURE_RESPONSES[result.failure];
  return errorJson(status, message, error_code);
}
