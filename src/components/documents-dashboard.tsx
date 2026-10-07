'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { documentsResponseSchema } from '@/lib/documents-contract';
import {
  EMPTY_FILTERS,
  rowsForDisplay,
  selectDocuments,
  type ApiRequestState,
  type DocumentDepartment,
  type DocumentFilters,
  type DocumentStatus,
  type DocumentType,
  type DocumentUrgency,
} from '@/lib/documents-view';

/**
 * F4 + F5 + F7 dashboard, on live data.
 *
 * On mount it reads the application's own same-origin `GET /api/documents`
 * (`CONTRACT.md` §4), validates the whole payload with the contract schema, and
 * shows only that result — there is no other data source and no fallback.
 * Returning to this page remounts it, so every visit asks again; "רענון" asks
 * again on demand. There is no polling.
 *
 * Each request carries a 95,000 ms browser timeout, just above the server's
 * 90,000 ms upstream timeout, and a latest-request guard: unmounting or a newer
 * request aborts the old one, and a superseded reply never updates the screen.
 *
 * Presentation only: no business field is derived or altered, and enum values
 * are rendered exactly as `CONTRACT.md` §2 spells them.
 */

const CLIENT_TIMEOUT_MS = 95_000;

const URGENCY_VALUES: readonly DocumentUrgency[] = ['High', 'Medium', 'Low'];

const DOCUMENT_TYPE_VALUES: readonly DocumentType[] = [
  'invoice',
  'request',
  'report',
  'complaint',
  'contract',
  'quote',
  'other',
];

const DEPARTMENT_VALUES: readonly DocumentDepartment[] = [
  'Sales',
  'Finance',
  'Support',
  'HR',
  'Management',
  'General',
];

const STATUS_VALUES: readonly DocumentStatus[] = ['Processed', 'Needs Review', 'Reviewed'];

/** Colour plus an always-visible text label — never colour alone (§7.1). */
const URGENCY_BADGE_CLASS: Record<DocumentUrgency, string> = {
  High: 'border-red-400 bg-red-100 text-red-900',
  Medium: 'border-amber-400 bg-amber-100 text-amber-900',
  Low: 'border-slate-400 bg-slate-100 text-slate-800',
};

const SELECT_CLASS =
  'w-full rounded border border-[var(--color-line)] bg-white px-2 py-1.5 text-sm sm:w-auto';

const BUTTON_CLASS =
  'rounded border border-[var(--color-line)] px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50';

const SOURCE_NOTICE_HE = 'הנתונים נטענים מיומן המסמכים דרך \u200E/api/documents\u200E של היישום.';

const UNIT_LABEL_HE = 'מסמכים';

const UNEXPECTED_SHAPE_MESSAGE =
  'רשימת המסמכים חזרה במבנה בלתי צפוי ולכן לא הוצגה.';

const NETWORK_MESSAGE = 'לא ניתן היה לפנות לשרת היישום. אפשר לנסות שוב בעוד רגע.';

const TIMEOUT_MESSAGE = 'טעינת המסמכים לא הסתיימה בזמן. אפשר לנסות שוב.';

/** ISO 8601 UTC in, fixed display out. No locale or time-zone conversion. */
function formatReceivedAtUtc(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(iso);
  if (!match) return iso;
  const [, year, month, day, hour, minute] = match;
  return `${day}.${month}.${year} ${hour}:${minute}`;
}

/** Isolates Latin-script and numeric values inside the Hebrew RTL layout. */
function Ltr({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span dir="ltr" className={className}>
      {children}
    </span>
  );
}

/**
 * The route's sanitized sentence, only when the body is exactly
 * `{status: "error", message: string}`. Any other body yields `null`, so the
 * screen falls back to its own fixed message and never shows foreign content.
 */
function routeMessageFrom(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;
  const body = payload as Record<string, unknown>;
  if (body.status !== 'error' || typeof body.message !== 'string') return null;
  const message = body.message.trim();
  return message.length > 0 ? message : null;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-[var(--color-muted)]">{label}</dt>
      <dd className="break-words text-sm">{children}</dd>
    </div>
  );
}

function FilterSelect<T extends string>({
  label,
  value,
  values,
  onChange,
}: {
  label: string;
  value: T | 'all';
  values: readonly T[];
  onChange: (next: T | 'all') => void;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1 text-sm sm:w-auto">
      <span className="text-xs text-[var(--color-muted)]">{label}</span>
      <select
        className={SELECT_CLASS}
        value={value}
        onChange={(event) => onChange(event.target.value as T | 'all')}
      >
        <option value="all">הכול</option>
        {values.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
  );
}

function StateBlock({ heading, detail, children }: { heading: string; detail: string; children?: ReactNode }) {
  return (
    <div className="rounded border border-dashed border-[var(--color-line)] p-8 text-center">
      <p className="font-medium">{heading}</p>
      <p className="mt-1 text-sm text-[var(--color-muted)]">{detail}</p>
      {children ? <p className="mt-4">{children}</p> : null}
    </div>
  );
}

export function DocumentsDashboard() {
  const [filters, setFilters] = useState<DocumentFilters>(EMPTY_FILTERS);
  const [api, setApi] = useState<ApiRequestState>({ phase: 'loading' });
  const requestIdRef = useRef(0);
  const controllerRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, CLIENT_TIMEOUT_MS);

    let next: ApiRequestState;
    try {
      const response = await fetch('/api/documents', {
        headers: { accept: 'application/json' },
        cache: 'no-store',
        signal: controller.signal,
      });

      let payload: unknown = null;
      let isJson = true;
      try {
        payload = await response.json();
      } catch (error) {
        // An abort while the body is read is a timeout or an unmount, not bad JSON.
        if (controller.signal.aborted) throw error;
        isJson = false;
      }

      if (!response.ok) {
        next = { phase: 'error', message: routeMessageFrom(payload) ?? UNEXPECTED_SHAPE_MESSAGE };
      } else {
        const parsed = isJson ? documentsResponseSchema.safeParse(payload) : null;
        next = parsed?.success
          ? { phase: 'loaded', rows: parsed.data }
          : { phase: 'error', message: UNEXPECTED_SHAPE_MESSAGE };
      }
    } catch {
      next = { phase: 'error', message: timedOut ? TIMEOUT_MESSAGE : NETWORK_MESSAGE };
    } finally {
      clearTimeout(timer);
    }

    // A superseded or unmounted request must never overwrite the screen.
    if (requestId !== requestIdRef.current) return;
    controllerRef.current = null;
    setApi(next);
  }, []);

  useEffect(() => {
    void load();
    return () => {
      requestIdRef.current += 1;
      controllerRef.current?.abort();
    };
  }, [load]);

  function reload() {
    setApi({ phase: 'loading' });
    void load();
  }

  const rows = rowsForDisplay(api);
  const visible = useMemo(() => selectDocuments(rows, filters), [rows, filters]);

  const isLoading = api.phase === 'loading';
  const isError = api.phase === 'error';

  const filtersActive =
    filters.search.trim().length > 0 ||
    filters.urgency !== 'all' ||
    filters.documentType !== 'all' ||
    filters.department !== 'all' ||
    filters.status !== 'all';

  return (
    <div className="flex flex-col gap-4">
      <p
        role="note"
        className="rounded border border-[var(--color-line)] bg-[var(--color-notice-bg)] p-3 text-sm text-[var(--color-notice-fg)]"
      >
        {SOURCE_NOTICE_HE}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={reload} disabled={isLoading} className={BUTTON_CLASS}>
          רענון
        </button>
      </div>

      <form
        role="search"
        aria-labelledby="documents-filters-title"
        className="flex flex-col gap-3 rounded border border-[var(--color-line)] p-4"
        onSubmit={(event) => event.preventDefault()}
      >
        <h3 id="documents-filters-title" className="text-sm font-semibold">
          חיפוש וסינון
        </h3>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-xs text-[var(--color-muted)]">
            חיפוש חופשי בשם הקובץ, בשולח ובסיכום
          </span>
          <input
            type="search"
            value={filters.search}
            onChange={(event) =>
              setFilters((current) => ({ ...current, search: event.target.value }))
            }
            placeholder="חיפוש לפי שם קובץ, שולח או תקציר"
            className="w-full rounded border border-[var(--color-line)] px-2 py-1.5 text-sm"
          />
        </label>

        <div className="flex flex-wrap gap-3">
          <FilterSelect
            label="דחיפות (urgency)"
            value={filters.urgency}
            values={URGENCY_VALUES}
            onChange={(next) => setFilters((current) => ({ ...current, urgency: next }))}
          />
          <FilterSelect
            label="סוג מסמך (document_type)"
            value={filters.documentType}
            values={DOCUMENT_TYPE_VALUES}
            onChange={(next) => setFilters((current) => ({ ...current, documentType: next }))}
          />
          <FilterSelect
            label="מחלקה (department)"
            value={filters.department}
            values={DEPARTMENT_VALUES}
            onChange={(next) => setFilters((current) => ({ ...current, department: next }))}
          />
          <FilterSelect
            label="סטטוס (status)"
            value={filters.status}
            values={STATUS_VALUES}
            onChange={(next) => setFilters((current) => ({ ...current, status: next }))}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <p aria-live="polite" className="text-sm text-[var(--color-muted)]">
            מוצגים {visible.length} מתוך {rows.length} {UNIT_LABEL_HE}
          </p>
          <button
            type="button"
            onClick={() => setFilters(EMPTY_FILTERS)}
            disabled={!filtersActive}
            className={BUTTON_CLASS}
          >
            ניקוי סינון
          </button>
        </div>
      </form>

      {isLoading ? (
        <div role="status">
          <StateBlock heading="טוען מסמכים…" detail="הבקשה נשלחה ל-API היישום וממתינה לתשובה." />
        </div>
      ) : isError ? (
        <div role="alert">
          <StateBlock
            heading="טעינת המסמכים נכשלה"
            detail={api.phase === 'error' ? api.message : UNEXPECTED_SHAPE_MESSAGE}
          >
            <button type="button" onClick={reload} className={BUTTON_CLASS}>
              נסה שוב
            </button>
          </StateBlock>
        </div>
      ) : rows.length === 0 ? (
        <div role="status">
          <StateBlock
            heading="אין מסמכים להצגה"
            detail="יומן המסמכים ריק. מסמך שיעובד יופיע כאן."
          />
        </div>
      ) : visible.length === 0 ? (
        <div role="status">
          <StateBlock
            heading="אין תוצאות מתאימות"
            detail="אף מסמך אינו עונה על החיפוש והסינון הנוכחיים. נסו לנקות את הסינון."
          />
        </div>
      ) : (
        <ul aria-label={UNIT_LABEL_HE} className="flex list-none flex-col gap-3 p-0">
          {visible.map((document) => (
            <li
              key={document.document_id}
              className="rounded border border-[var(--color-line)] p-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                {/* F6: the row title opens the detail screen for this document. */}
                <h3 className="min-w-0 break-words text-base font-semibold">
                  <Link href={`/documents/${encodeURIComponent(document.document_id)}`}>
                    <Ltr>{document.file_name}</Ltr>
                  </Link>
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded border px-2 py-0.5 text-xs font-semibold ${URGENCY_BADGE_CLASS[document.urgency]}`}
                  >
                    <Ltr>{document.urgency}</Ltr>
                  </span>
                  <span className="rounded border border-[var(--color-line)] px-2 py-0.5 text-xs">
                    <Ltr>{document.status}</Ltr>
                  </span>
                </div>
              </div>

              <p className="mt-2 break-words text-sm">{document.summary}</p>

              <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="נקלט (UTC)">
                  <Ltr>{formatReceivedAtUtc(document.received_at)}</Ltr>
                </Field>
                <Field label="שולח / חברה">
                  <Ltr>{document.sender_or_company}</Ltr>
                </Field>
                <Field label="סוג מסמך">
                  <Ltr>{document.document_type}</Ltr>
                </Field>
                <Field label="מחלקה">
                  <Ltr>{document.department}</Ltr>
                </Field>
                <Field label="מועד יעד">
                  <Ltr>{document.deadline}</Ltr>
                </Field>
                <Field label="מזהה מסמך">
                  <Ltr>{document.document_id}</Ltr>
                </Field>
                <Field label="פעולה נדרשת">{document.requested_action}</Field>
                <Field label="קובץ">
                  <a href={document.file_link} title={document.file_link}>
                    פתיחת הקובץ
                  </a>
                </Field>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
