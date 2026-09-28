import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Portal } from "../../internal/ovl-portal";

export type ToastTone = "neutral" | "info" | "success" | "warning" | "danger";

export interface ToastOptions {
  /** Short headline. */
  title: ReactNode;
  /** Optional supporting text. */
  description?: ReactNode;
  /** Status dot colour. Defaults to `"neutral"`. */
  tone?: ToastTone;
  /** Auto-dismiss after this many ms; `Infinity` keeps it until closed. Defaults to the provider's `duration`. */
  duration?: number;
  /** Optional action button. */
  action?: { label: string; onClick: () => void };
  /** Reuse an id to replace an existing toast. */
  id?: string;
}

interface ToastRecord extends ToastOptions {
  id: string;
}

export interface ToastApi {
  /** Shows a toast and returns its id. */
  toast: (options: ToastOptions) => string;
  /** Removes a toast by id, or all toasts when omitted. */
  dismiss: (id?: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

/** Access `toast()` and `dismiss()`. Must be called under `<ToastProvider>`. */
export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>.");
  return ctx;
}

export interface ToastProviderProps {
  /** App content. */
  children?: ReactNode;
  /** Default auto-dismiss delay in ms. Defaults to 5000. */
  duration?: number;
  /** Maximum toasts visible at once; oldest are dropped. Defaults to 3. */
  limit?: number;
  /** Accessible name of the notification region. Defaults to `"Notifications"`. */
  label?: string;
}

let counter = 0;

/** Hosts a polite live region (bottom-right stack) and exposes `useToast`. */
export function ToastProvider({ children, duration = 5000, limit = 3, label = "Notifications" }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);

  const dismiss = useCallback((id?: string) => {
    setToasts((prev) => (id === undefined ? [] : prev.filter((t) => t.id !== id)));
  }, []);

  const toast = useCallback(
    (options: ToastOptions) => {
      counter += 1;
      const id = options.id ?? `mrd-toast-${counter}`;
      setToasts((prev) => [...prev.filter((t) => t.id !== id), { ...options, id }].slice(-limit));
      return id;
    },
    [limit],
  );

  const api = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <Portal>
        <section className="mrd-toast-region" aria-label={label}>
          <ol className="mrd-toast-region__list" aria-live="polite" aria-relevant="additions text">
            {toasts.map((t) => (
              <ToastItem key={t.id} toast={t} duration={t.duration ?? duration} onDismiss={dismiss} />
            ))}
          </ol>
        </section>
      </Portal>
    </ToastContext.Provider>
  );
}

function ToastItem({
  toast,
  duration,
  onDismiss,
}: {
  toast: ToastRecord;
  duration: number;
  onDismiss: (id: string) => void;
}) {
  const [paused, setPaused] = useState(false);
  const remaining = useRef(duration);
  const startedAt = useRef(0);

  useEffect(() => {
    if (paused || !Number.isFinite(duration)) return;
    startedAt.current = Date.now();
    const timer = setTimeout(() => onDismiss(toast.id), remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current -= Date.now() - startedAt.current;
    };
  }, [paused, duration, onDismiss, toast.id]);

  const tone = toast.tone ?? "neutral";
  return (
    <li
      className="mrd-toast"
      data-tone={tone}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      <span className="mrd-toast__dot" aria-hidden="true" />
      <div className="mrd-toast__body">
        <div className="mrd-toast__title">{toast.title}</div>
        {toast.description ? <div className="mrd-toast__description">{toast.description}</div> : null}
      </div>
      {toast.action ? (
        <button
          type="button"
          className="mrd-toast__action"
          onClick={() => {
            toast.action?.onClick();
            onDismiss(toast.id);
          }}
        >
          {toast.action.label}
        </button>
      ) : null}
      <button type="button" className="mrd-toast__close" aria-label="Dismiss notification" onClick={() => onDismiss(toast.id)}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
    </li>
  );
}
