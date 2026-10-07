'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  buildReviewRequest,
  detailFields,
  findDocument,
  isAlreadyReviewed,
  isReviewNoteWithinLimit,
  isReviewSuccessFor,
  normalizeReviewer,
  parseDocumentsResponse,
  REVIEW_NOTE_MAX_LENGTH,
  REVIEWED_STATUS,
  routeErrorMessage,
} from '@/lib/document-detail-view';
import type { DocumentRecord, DocumentStatus } from '@/lib/documents-view';
import { URGENCY_BADGE_CLASS } from '@/lib/result-view';

/**
 * F6 — detail view with human review (instructor Part 2 doc §7 F6).
 *
 * The record is loaded through the application's own same-origin
 * `GET /api/documents` and matched by exact `document_id`. "Mark as reviewed"
 * sends a same-origin `POST /api/review` (`CONTRACT.md` §5); the shown status
 * changes to `Reviewed` only after a validated success reply that echoes the
 * same `document_id`. There is no mock fallback.
 *
 * Both requests carry a 95,000 ms browser timeout, just above the server's
 * 90,000 ms upstream timeout, and a latest-request guard: unmounting or a newer
 * request aborts the old one, and a superseded reply never updates the screen.
 *
 * Presentation only: no field is derived or altered (`CONTRACT.md` §8), and enum
 * values are rendered exactly as `CONTRACT.md` §2 spells them.
 */

const CLIENT_TIMEOUT_MS = 95_000;

const BUTTON_CLASS =
  'rounded border border-[var(--color-line)] px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50';

const INPUT_CLASS =
  'w-full rounded border border-[var(--color-line)] px-2 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-60';

const LOADING_HE = 'טוען את פרטי המסמך…';
const LOAD_FAILED_HE = 'טעינת המסמך נכשלה.';
const LOAD_UNEXPECTED_HE = 'רשימת המסמכים חזרה במבנה בלתי צפוי, ולכן המסמך לא הוצג.';
const LOAD_NETWORK_HE = 'לא ניתן היה לפנות לשרת היישום. אפשר לנסות שוב בעוד רגע.';
const LOAD_TIMEOUT_HE = 'טעינת המסמך לא הסתיימה בזמן. אפשר לנסות שוב.';

const REVIEWER_HINT_HE = 'יש למלא את שם הבודק כדי לסמן את המסמך כנבדק.';
const NOTE_TOO_LONG_HE = `ההערה ארוכה מהמותר (עד ${REVIEW_NOTE_MAX_LENGTH} תווים).`;
const SENDING_HE = 'שולח את הבדיקה…';
const REVIEW_NOT_FOUND_HE =
  'המסמך לא נמצא ביומן המסמכים, ולכן הבדיקה לא נשמרה. כדאי לרענן את הדף ולבדוק שהמסמך עדיין קיים.';
const REVIEW_UNEXPECTED_HE = 'התשובה לעדכון הבדיקה חזרה במבנה בלתי צפוי, ולכן הסטטוס לא שונה.';
const REVIEW_NETWORK_HE =
  'לא ניתן היה לפנות לשרת היישום, ולכן הבדיקה לא נשמרה. אפשר לנסות שוב בעוד רגע.';
const REVIEW_TIMEOUT_HE = 'עדכון הבדיקה לא הסתיים בזמן, ולכן הסטטוס לא שונה. אפשר לנסות שוב.';

type LoadState =
  | { phase: 'loading' }
  | { phase: 'error'; message: string }
  | { phase: 'not_found' }
  | { phase: 'loaded'; record: DocumentRecord };

type ReviewOutcome = { ok: true } | { ok: false; message: string };

type JsonReply = { ok: boolean; status: number; payload: unknown; isJson: boolean };

/** One same-origin request. A body that is not JSON is reported, not thrown. */
async function fetchJson(url: string, init: RequestInit): Promise<JsonReply> {
  const response = await fetch(url, init);
  try {
    return { ok: response.ok, status: response.status, payload: await response.json(), isJson: true };
  } catch (error) {
    // An abort while the body is read is a timeout or an unmount, not bad JSON.
    if (init.signal?.aborted) throw error;
    return { ok: response.ok, status: response.status, payload: null, isJson: false };
  }
}

function loadStateFrom(reply: JsonReply, documentId: string): LoadState {
  if (!reply.ok) {
    return { phase: 'error', message: routeErrorMessage(reply.payload) ?? LOAD_UNEXPECTED_HE };
  }

  const rows = reply.isJson ? parseDocumentsResponse(reply.payload) : null;
  if (rows === null) return { phase: 'error', message: LOAD_UNEXPECTED_HE };

  const record = findDocument(rows, documentId);
  return record ? { phase: 'loaded', record } : { phase: 'not_found' };
}

function reviewOutcomeFrom(reply: JsonReply, documentId: string): ReviewOutcome {
  if (reply.status === 404) return { ok: false, message: REVIEW_NOT_FOUND_HE };

  if (!reply.ok) {
    return { ok: false, message: routeErrorMessage(reply.payload) ?? REVIEW_UNEXPECTED_HE };
  }

  return reply.isJson && isReviewSuccessFor(reply.payload, documentId)
    ? { ok: true }
    : { ok: false, message: REVIEW_UNEXPECTED_HE };
}

/** Isolates Latin-script and numeric values inside the Hebrew RTL layout. */
function Ltr({ children }: { children: ReactNode }) {
  return <span dir="ltr">{children}</span>;
}

function BackLink() {
  return (
    <p className="text-sm">
      <Link href="/">חזרה ללוח המסמכים</Link>
    </p>
  );
}

function NotFound({ documentId }: { documentId: string | null }) {
  return (
    <section aria-labelledby="detail-not-found-title" className="flex flex-col gap-6">
      <div>
        <h2 id="detail-not-found-title" className="text-lg font-semibold">
          המסמך לא נמצא
        </h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          אין ביומן המסמכים מסמך עם המזהה שהתבקש. אפשר לחזור ללוח המסמכים ולבחור מסמך
          מהרשימה.
        </p>
      </div>

      <p role="alert" className="text-sm">
        {documentId === null ? (
          'כתובת הדף אינה מכילה מזהה מסמך תקין.'
        ) : (
          <>
            מזהה שאינו קיים: <Ltr>{documentId}</Ltr>
          </>
        )}
      </p>

      <BackLink />
    </section>
  );
}

export function DocumentDetail({ documentId }: { documentId: string | null }) {
  if (documentId === null) return <NotFound documentId={null} />;
  return <LiveDocumentDetail documentId={documentId} />;
}

function LiveDocumentDetail({ documentId }: { documentId: string }) {
  const [load, setLoad] = useState<LoadState>({ phase: 'loading' });
  const loadIdRef = useRef(0);
  const loadControllerRef = useRef<AbortController | null>(null);

  const runLoad = useCallback(async () => {
    const requestId = ++loadIdRef.current;
    loadControllerRef.current?.abort();
    const controller = new AbortController();
    loadControllerRef.current = controller;
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, CLIENT_TIMEOUT_MS);

    let next: LoadState;
    try {
      const reply = await fetchJson('/api/documents', {
        headers: { accept: 'application/json' },
        cache: 'no-store',
        signal: controller.signal,
      });
      next = loadStateFrom(reply, documentId);
    } catch {
      next = { phase: 'error', message: timedOut ? LOAD_TIMEOUT_HE : LOAD_NETWORK_HE };
    } finally {
      clearTimeout(timer);
    }

    // A superseded or unmounted request must never overwrite the screen.
    if (requestId !== loadIdRef.current) return;
    loadControllerRef.current = null;
    setLoad(next);
  }, [documentId]);

  useEffect(() => {
    void runLoad();
    return () => {
      loadIdRef.current += 1;
      loadControllerRef.current?.abort();
    };
  }, [runLoad]);

  function retryLoad() {
    setLoad({ phase: 'loading' });
    void runLoad();
  }

  if (load.phase === 'not_found') return <NotFound documentId={documentId} />;

  return (
    <section aria-labelledby="detail-title" className="flex flex-col gap-6">
      <div>
        <h2 id="detail-title" className="text-lg font-semibold">
          פרטי מסמך
        </h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          הרשומה נטענת מיומן המסמכים דרך <Ltr>/api/documents</Ltr> של היישום. כל שדה מוצג
          כפי שהחוזה מגדיר אותו, בלי תרגום ובלי שינוי שם.
        </p>
      </div>

      {load.phase === 'loading' ? (
        <p role="status" className="text-sm">
          {LOADING_HE}
        </p>
      ) : null}

      {load.phase === 'error' ? (
        <div className="flex flex-col items-start gap-3">
          <div role="alert" className="flex flex-col gap-1 text-sm">
            <p className="font-medium">{LOAD_FAILED_HE}</p>
            <p>{load.message}</p>
          </div>
          <button type="button" onClick={retryLoad} className={BUTTON_CLASS}>
            נסה שוב
          </button>
        </div>
      ) : null}

      {load.phase === 'loaded' ? <LoadedDocument record={load.record} /> : null}

      <BackLink />
    </section>
  );
}

function LoadedDocument({ record }: { record: DocumentRecord }) {
  const [status, setStatus] = useState<DocumentStatus>(record.status);
  const [reviewer, setReviewer] = useState('');
  const [note, setNote] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<{ reviewedBy: string; note?: string } | null>(null);

  /**
   * The disabled controls are the visible guard; this ref is the reliable one.
   * Two clicks dispatched in the same tick both run before React re-renders.
   */
  const sendingRef = useRef(false);
  const reviewIdRef = useRef(0);
  const reviewControllerRef = useRef<AbortController | null>(null);

  useEffect(
    () => () => {
      reviewIdRef.current += 1;
      reviewControllerRef.current?.abort();
    },
    [],
  );

  const alreadyReviewed = isAlreadyReviewed(status);
  const reviewerMissing = normalizeReviewer(reviewer) === null;
  const noteWithinLimit = isReviewNoteWithinLimit(note);
  const canReview =
    !alreadyReviewed && !isSending && buildReviewRequest(record.document_id, reviewer, note) !== null;

  async function sendReview() {
    if (sendingRef.current || alreadyReviewed) return;
    const body = buildReviewRequest(record.document_id, reviewer, note);
    if (body === null) return;

    const requestId = ++reviewIdRef.current;
    const controller = new AbortController();
    reviewControllerRef.current = controller;
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, CLIENT_TIMEOUT_MS);

    sendingRef.current = true;
    setIsSending(true);
    setReviewError(null);

    let outcome: ReviewOutcome;
    try {
      const reply = await fetchJson('/api/review', {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify(body),
        cache: 'no-store',
        signal: controller.signal,
      });
      outcome = reviewOutcomeFrom(reply, body.document_id);
    } catch {
      outcome = { ok: false, message: timedOut ? REVIEW_TIMEOUT_HE : REVIEW_NETWORK_HE };
    } finally {
      clearTimeout(timer);
    }

    if (requestId !== reviewIdRef.current) return;

    reviewControllerRef.current = null;
    sendingRef.current = false;
    setIsSending(false);

    if (outcome.ok) {
      setStatus(REVIEWED_STATUS);
      setConfirmed({ reviewedBy: body.reviewed_by, note: body.review_note });
    } else {
      // The previous status, the reviewer and the note all stay as they were.
      setReviewError(outcome.message);
    }
  }

  // The status row shows what the screen currently holds.
  const fields = detailFields({ ...record, status });
  const controlsLocked = alreadyReviewed || isSending;

  return (
    <div className="flex flex-col gap-4">
      <section
        aria-labelledby="detail-fields-title"
        className="flex flex-col gap-4 rounded border border-[var(--color-line)] p-4"
      >
        <h3 id="detail-fields-title" className="text-base font-semibold">
          פרטי המסמך
        </h3>

        <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.key} className="min-w-0">
              <dt className="text-xs text-[var(--color-muted)]">{field.label}</dt>
              <dd className="break-words text-sm">
                {field.kind === 'badge' ? (
                  <span
                    className={`inline-block rounded border px-2 py-0.5 text-xs font-semibold ${URGENCY_BADGE_CLASS[record.urgency]}`}
                  >
                    <Ltr>{field.value}</Ltr>
                  </span>
                ) : field.kind === 'link' ? (
                  <a href={field.value}>פתיחת הקובץ</a>
                ) : field.kind === 'ltr' ? (
                  <Ltr>{field.value}</Ltr>
                ) : (
                  <span dir="auto">{field.value}</span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section
        aria-labelledby="detail-review-title"
        className="flex flex-col gap-3 rounded border border-[var(--color-line)] p-4"
      >
        <h3 id="detail-review-title" className="text-base font-semibold">
          בדיקה אנושית
        </h3>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-xs text-[var(--color-muted)]">
            שם הבודק (reviewed_by) — חובה
          </span>
          <input
            type="text"
            value={reviewer}
            onChange={(event) => setReviewer(event.target.value)}
            required
            aria-required="true"
            aria-describedby={reviewerMissing && !alreadyReviewed ? 'reviewer-hint' : undefined}
            disabled={controlsLocked}
            autoComplete="name"
            className={INPUT_CLASS}
          />
        </label>

        {reviewerMissing && !alreadyReviewed ? (
          <p id="reviewer-hint" className="text-xs text-[var(--color-muted)]">
            {REVIEWER_HINT_HE}
          </p>
        ) : null}

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-xs text-[var(--color-muted)]">
            הערת בדיקה (review_note) — לא חובה, עד {REVIEW_NOTE_MAX_LENGTH} תווים
          </span>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            maxLength={REVIEW_NOTE_MAX_LENGTH}
            rows={3}
            disabled={controlsLocked}
            className={INPUT_CLASS}
          />
        </label>

        {!noteWithinLimit ? (
          <p role="alert" className="text-sm font-medium text-red-800">
            {NOTE_TOO_LONG_HE}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void sendReview()}
            disabled={!canReview}
            className={BUTTON_CLASS}
          >
            סימון כנבדק
          </button>
          {alreadyReviewed ? (
            <span className="text-xs text-[var(--color-muted)]">
              הסטטוס הנוכחי הוא <Ltr>Reviewed</Ltr>.
            </span>
          ) : null}
        </div>

        {isSending ? (
          <p role="status" className="text-sm">
            {SENDING_HE}
          </p>
        ) : null}

        {reviewError !== null ? (
          <p role="alert" className="text-sm font-medium text-red-800">
            {reviewError}
          </p>
        ) : null}

        {confirmed !== null ? (
          <div role="status" className="flex flex-col gap-1 rounded border border-[var(--color-line)] p-3 text-sm">
            <p>
              הבדיקה נשמרה, והסטטוס עודכן ל-<Ltr>Reviewed</Ltr>.
            </p>
            <p>
              <span className="text-xs text-[var(--color-muted)]">בודק: </span>
              <span dir="auto">{confirmed.reviewedBy}</span>
            </p>
            {confirmed.note !== undefined ? (
              <p>
                <span className="text-xs text-[var(--color-muted)]">הערה: </span>
                <span dir="auto">{confirmed.note}</span>
              </p>
            ) : (
              <p className="text-xs text-[var(--color-muted)]">לא נשלחה הערה.</p>
            )}
          </div>
        ) : null}
      </section>
    </div>
  );
}
