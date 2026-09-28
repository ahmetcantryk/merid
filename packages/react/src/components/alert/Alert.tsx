import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "../../utils/cx";

export type AlertTone = "info" | "success" | "warning" | "danger";

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Colour tone. Defaults to `info`. */
  tone?: AlertTone;
  /** Bold-ish (500) first line. */
  title?: ReactNode;
  /** Leading icon. Defaults to a tone-appropriate glyph; pass `null` to hide it. */
  icon?: ReactNode | null;
  /** Trailing slot, e.g. an action button or dismiss `IconButton`. */
  action?: ReactNode;
  /**
   * Live-region behaviour. `polite` (default for info/success) uses `role="status"`,
   * `assertive` (default for warning/danger) uses `role="alert"`, `off` renders a plain note.
   */
  live?: "polite" | "assertive" | "off";
}

const ICON_PATHS: Record<AlertTone, string> = {
  info: "M10 9v5M10 6.5v.01",
  success: "M6.5 10.2l2.3 2.3 4.7-5",
  warning: "M10 6.5v4.5M10 13.5v.01",
  danger: "M7.5 7.5l5 5M12.5 7.5l-5 5",
};

function ToneIcon({ tone }: { tone: AlertTone }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <path d={ICON_PATHS[tone]} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Inline notice on a tinted surface. Tones: info, success, warning, danger. */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { tone = "info", title, icon, action, live, className, children, ...props },
  ref,
) {
  const mode = live ?? (tone === "warning" || tone === "danger" ? "assertive" : "polite");
  const role = mode === "assertive" ? "alert" : mode === "polite" ? "status" : undefined;
  const iconNode = icon === undefined ? <ToneIcon tone={tone} /> : icon;
  return (
    <div ref={ref} role={role} className={cx("mrd-alert", className)} data-tone={tone} {...props}>
      {iconNode !== null ? (
        <span className="mrd-alert__icon" aria-hidden="true">
          {iconNode}
        </span>
      ) : null}
      <div className="mrd-alert__content">
        {title ? <div className="mrd-alert__title">{title}</div> : null}
        {children ? <div className="mrd-alert__body">{children}</div> : null}
      </div>
      {action ? <div className="mrd-alert__action">{action}</div> : null}
    </div>
  );
});
