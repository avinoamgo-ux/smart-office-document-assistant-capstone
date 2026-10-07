'use client';

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type ReactNode,
} from 'react';
import {
  processDocumentResponseSchema,
  type ProcessDocumentRequest,
  type ProcessDocumentResponse,
} from '@/lib/process-document-contract';
import { formatReceivedAtUtc, resultFields, URGENCY_BADGE_CLASS } from '@/lib/result-view';
import {
  FILE_INPUT_ACCEPT,
  formatFileSize,
  SINGLE_FILE_MESSAGE_HE,
  validateUploadSelection,
} from '@/lib/upload-file-rules';

/**
 * F1 + F2 + F3 — upload screen, connected to Workflow A (`SPEC.md` §16 M5).
 *
 * F1 (instructor Part 2 doc §7): choose or drag one document, show its name and
 * size, refuse an unsupported type or an oversized file with a clear message
 * before anything is sent, and send the accepted file.
 *
 * The send target is the same-origin `POST /api/process-document`. That route
 * attaches the secret and calls n8n server-side (`CONTRACT.md` §7, §8); this
 * screen never sees the n8n URL or the secret, and never calls n8n directly.
 *
 * F2 (same source): "Shows an unmistakable in-progress state while n8n works,
 * and disables the Send button", checked by "Double-clicking Send creates exactly
 * one row in the spreadsheet". `CONTRACT.md` §9: the Send button is disabled for
 * the duration of an in-flight request, and responses from a superseded request
 * are ignored.
 *
 * F3 (same source): "Displays all seven extracted fields plus the file link,
 * with a coloured urgency badge", handling "'Not found' and 'No action found'
 * values shown honestly rather than as empty space". The rows come from
 * `result-view.ts`, which passes every value through untouched; the labels here
 * are Hebrew, the values never are.
 *
 * Presentation only. No extraction, no urgency decision, no Google call
 * (`CONTRACT.md` §8).
 */

const BUTTON_CLASS =
  'rounded border border-[var(--color-line)] px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50';

const BASE64_CHUNK = 0x8000;

const PROCESS_DOCUMENT_ENDPOINT = '/api/process-document';

/**
 * Slightly above the route's own 90,000 ms upstream timeout (`CONTRACT.md` §1),
 * so the route normally answers with its sanitized 504 before this fires.
 */
const CLIENT_TIMEOUT_MS = 95_000;

/** F2 copy. Text carries the state — never colour or motion alone. */
const PROCESSING_HEADING_HE = 'מעבד את המסמך…';

const PROCESSING_DETAIL_HE =
  'המסמך נשלח לעיבוד דרך השרת המאובטח של היישום. העיבוד עשוי להימשך עד דקה. אין לרענן את הדף ואין ללחוץ שוב — הכפתור מושבת עד סיום העיבוד.';

/** Fixed messages for failures the route itself could not describe. */
const TIMEOUT_MESSAGE_HE = 'עיבוד המסמך לא הסתיים בזמן. אפשר לנסות לשלוח שוב.';

const SEND_FAILED_MESSAGE_HE = 'השליחה לא הושלמה. בדקו את החיבור לרשת ונסו לשלוח שוב.';

const UNEXPECTED_RESPONSE_MESSAGE_HE =
  'התשובה מהשרת חזרה במבנה בלתי צפוי ולכן לא הוצגה. אפשר לנסות לשלוח שוב.';

/** Isolates Latin-script and numeric values inside the Hebrew RTL layout. */
function Ltr({ children }: { children: ReactNode }) {
  return <span dir="ltr">{children}</span>;
}

/** `CONTRACT.md` §3.1: bare base64, never a `data:` URL prefix. */
async function fileToBase64(file: File): Promise<string> {
  const bytes = new Uint8Array(await file.arrayBuffer());

  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += BASE64_CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + BASE64_CHUNK));
  }

  return btoa(binary);
}

type SendOutcome =
  | { ok: true; document: ProcessDocumentResponse }
  | { ok: false; message: string };

/**
 * The route's sanitized error body is `{ status: 'error', error_code?, message }`
 * (`CONTRACT.md` §3.3). Its messages are fixed Hebrew strings written by the
 * route, so they are safe to show. Anything else gets a fixed message instead.
 */
function routeErrorMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null;
  const { status, message } = payload as Record<string, unknown>;
  return status === 'error' && typeof message === 'string' && message.length > 0
    ? message
    : null;
}

async function postDocument(
  request: ProcessDocumentRequest,
  signal: AbortSignal,
): Promise<SendOutcome> {
  const response = await fetch(PROCESS_DOCUMENT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
    signal,
  });

  let payload: unknown;
  try {
    payload = await response.json();
  } catch (error) {
    // An abort while reading the body is a timeout, not a malformed response.
    if (signal.aborted) throw error;
    return { ok: false, message: UNEXPECTED_RESPONSE_MESSAGE_HE };
  }

  if (!response.ok) {
    return { ok: false, message: routeErrorMessage(payload) ?? UNEXPECTED_RESPONSE_MESSAGE_HE };
  }

  const parsed = processDocumentResponseSchema.safeParse(payload);
  return parsed.success
    ? { ok: true, document: parsed.data }
    : { ok: false, message: UNEXPECTED_RESPONSE_MESSAGE_HE };
}

type Selection = { file: File; rejection: string | null };

export function DocumentUploadForm() {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [dropMessage, setDropMessage] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [result, setResult] = useState<ProcessDocumentResponse | null>(null);
  const [isSending, setIsSending] = useState(false);

  /**
   * The disabled button is the visible guard; this ref is the reliable one.
   * Two clicks dispatched in the same tick both run before React re-renders and
   * before `isSending` is readable, so the state flag alone would let the second
   * one through.
   */
  const sendingRef = useRef(false);

  /**
   * `CONTRACT.md` §9 superseded-response guard. Every submission takes the next
   * id; only the submission whose id is still current may update the screen.
   * Unmounting advances the id too, so a late response is dropped.
   */
  const requestIdRef = useRef(0);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(
    () => () => {
      requestIdRef.current += 1;
      controllerRef.current?.abort();
    },
    [],
  );

  function accept(files: FileList | null) {
    setSendError(null);
    // A new selection invalidates the result on screen: a shown result must
    // always belong to the file that produced it.
    setResult(null);
    setDropMessage(null);

    if (!files || files.length === 0) {
      setSelection(null);
      return;
    }

    if (files.length > 1) {
      setSelection(null);
      setDropMessage(SINGLE_FILE_MESSAGE_HE);
      return;
    }

    const file = files[0];
    const validation = validateUploadSelection({
      name: file.name,
      type: file.type,
      size: file.size,
    });

    setSelection({ file, rejection: validation.ok ? null : validation.message });
  }

  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    accept(event.target.files);
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    // The file input is disabled while sending; a drop must not swap the file
    // under an in-flight request either.
    if (sendingRef.current) return;
    accept(event.dataTransfer.files);
  }

  function clearSelection() {
    setSelection(null);
    setDropMessage(null);
    setSendError(null);
    setResult(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  async function onSend() {
    if (!selection || selection.rejection || sendingRef.current) return;

    const requestId = ++requestIdRef.current;
    const controller = new AbortController();
    controllerRef.current = controller;
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, CLIENT_TIMEOUT_MS);

    sendingRef.current = true;
    setIsSending(true);
    setSendError(null);
    setResult(null);

    let outcome: SendOutcome;
    try {
      const file = selection.file;
      const request: ProcessDocumentRequest = {
        file_name: file.name,
        mime_type: file.type,
        file_base64: await fileToBase64(file),
      };

      outcome = await postDocument(request, controller.signal);
    } catch {
      outcome = {
        ok: false,
        message: timedOut ? TIMEOUT_MESSAGE_HE : SEND_FAILED_MESSAGE_HE,
      };
    } finally {
      clearTimeout(timer);
    }

    if (requestId !== requestIdRef.current) return;

    controllerRef.current = null;
    sendingRef.current = false;
    setIsSending(false);
    setSendError(outcome.ok ? null : outcome.message);
    setResult(outcome.ok ? outcome.document : null);
  }

  const canSend = Boolean(selection) && !selection?.rejection && !isSending;

  return (
    <div className="flex flex-col gap-4">
      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={onDrop}
        className="flex flex-col gap-3 rounded border border-dashed border-[var(--color-line)] p-6"
      >
        <label htmlFor={inputId} className="text-sm font-medium">
          בחרו מסמך אחד, או גררו אותו לאזור הזה
        </label>
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          multiple={false}
          accept={FILE_INPUT_ACCEPT}
          onChange={onInputChange}
          disabled={isSending}
          className="text-sm"
        />
        <p className="text-xs text-[var(--color-muted)]">
          סוגי קבצים מותרים: PDF, DOCX, TXT. גודל מרבי: 10MB. קובץ שאינו עומד
          בתנאים האלה נדחה כאן ואינו נשלח.
        </p>
      </div>

      {dropMessage ? (
        <p role="alert" className="text-sm font-medium text-red-800">
          {dropMessage}
        </p>
      ) : null}

      {selection ? (
        <div className="flex flex-col gap-3 rounded border border-[var(--color-line)] p-4">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
            <div className="min-w-0">
              <dt className="text-xs text-[var(--color-muted)]">שם הקובץ</dt>
              <dd className="break-words text-sm">
                <Ltr>{selection.file.name}</Ltr>
              </dd>
            </div>
            <div className="min-w-0">
              <dt className="text-xs text-[var(--color-muted)]">גודל</dt>
              <dd className="text-sm">
                <Ltr>{formatFileSize(selection.file.size)}</Ltr>
              </dd>
            </div>
          </dl>

          {selection.rejection ? (
            <p role="alert" className="text-sm font-medium text-red-800">
              {selection.rejection}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void onSend()}
              disabled={!canSend}
              aria-busy={isSending}
              className={BUTTON_CLASS}
            >
              שליחת המסמך לעיבוד
            </button>
            <button
              type="button"
              onClick={clearSelection}
              disabled={isSending}
              className={BUTTON_CLASS}
            >
              ניקוי הבחירה
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-[var(--color-muted)]">לא נבחר מסמך.</p>
      )}

      {isSending ? (
        <div
          role="status"
          className="flex flex-col gap-1 rounded border border-[var(--color-line)] p-4"
        >
          <p className="flex items-center gap-2 font-medium">
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-[var(--color-notice-fg)]"
            />
            {PROCESSING_HEADING_HE}
          </p>
          <p className="text-sm text-[var(--color-muted)]">{PROCESSING_DETAIL_HE}</p>
        </div>
      ) : null}

      {!isSending && sendError ? (
        <p
          role="alert"
          className="rounded border border-[var(--color-line)] p-3 text-sm font-medium text-red-800"
        >
          {sendError}
        </p>
      ) : null}

      {!isSending && result ? (
        <section
          aria-labelledby="result-title"
          className="flex flex-col gap-4 rounded border border-[var(--color-line)] p-4"
        >
          <h3 id="result-title" className="text-base font-semibold">
            תוצאת העיבוד
          </h3>

          {/* All seven fields, in CONTRACT.md §2 order, values untouched. */}
          <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
            {resultFields(result).map((field) => (
              <div key={field.key} className="min-w-0">
                <dt className="text-xs text-[var(--color-muted)]">{field.label}</dt>
                <dd className="break-words text-sm">
                  {field.badge ? (
                    <span
                      className={`inline-block rounded border px-2 py-0.5 text-xs font-semibold ${URGENCY_BADGE_CLASS[result.fields.urgency]}`}
                    >
                      <Ltr>{field.value}</Ltr>
                    </span>
                  ) : field.dir === 'ltr' ? (
                    <Ltr>{field.value}</Ltr>
                  ) : (
                    <span dir="auto">{field.value}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <dl className="grid grid-cols-1 gap-x-4 gap-y-3 border-t border-[var(--color-line)] pt-3 sm:grid-cols-2">
            <div className="min-w-0">
              <dt className="text-xs text-[var(--color-muted)]">שם הקובץ (file_name)</dt>
              <dd className="break-words text-sm">
                <Ltr>{result.file_name}</Ltr>
              </dd>
            </div>
            <div className="min-w-0">
              <dt className="text-xs text-[var(--color-muted)]">נקלט, UTC (received_at)</dt>
              <dd className="text-sm">
                <Ltr>{formatReceivedAtUtc(result.received_at)}</Ltr>
              </dd>
            </div>
            <div className="min-w-0">
              <dt className="text-xs text-[var(--color-muted)]">מזהה מסמך (document_id)</dt>
              <dd className="break-words text-sm">
                <Ltr>{result.document_id}</Ltr>
              </dd>
            </div>
            <div className="min-w-0">
              <dt className="text-xs text-[var(--color-muted)]">
                התראה נשלחה (notification_sent)
              </dt>
              <dd className="text-sm">{result.notification_sent ? 'כן' : 'לא'}</dd>
            </div>
          </dl>

          <p className="text-sm">
            <a href={result.file_link}>פתיחת הקובץ</a>
          </p>
        </section>
      ) : null}
    </div>
  );
}
