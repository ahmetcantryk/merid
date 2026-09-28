import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "../../utils/cx";
import type { HeadingLevel } from "../heading/Heading";

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Icon shown in a soft accent tile. Decorative. */
  icon?: ReactNode;
  /** Short headline, e.g. "No invoices yet". */
  title: ReactNode;
  /** One or two sentences explaining what to do next. */
  description?: ReactNode;
  /** Primary action(s), usually a `Button`. */
  action?: ReactNode;
  /** Heading level for `title`. Defaults to `3`. */
  titleLevel?: HeadingLevel;
  /** Surface. `tray` (default) is a recessed panel, `plain` has no background. */
  variant?: "tray" | "plain";
}

/** Centred placeholder for empty lists, searches and first-run screens. */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { icon, title, description, action, titleLevel = 3, variant = "tray", className, ...props },
  ref,
) {
  const Title = `h${titleLevel}` as const;
  return (
    <div ref={ref} className={cx("mrd-empty-state", className)} data-variant={variant} {...props}>
      {icon ? (
        <span className="mrd-empty-state__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <Title className="mrd-empty-state__title">{title}</Title>
      {description ? <p className="mrd-empty-state__description">{description}</p> : null}
      {action ? <div className="mrd-empty-state__action">{action}</div> : null}
    </div>
  );
});
