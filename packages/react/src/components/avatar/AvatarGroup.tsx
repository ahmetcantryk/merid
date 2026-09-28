import { Children, forwardRef, isValidElement, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "../../utils/cx";
import { devWarn } from "../../utils/dev-warn";
import type { AvatarSize } from "./Avatar";

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Maximum avatars shown; the rest collapse into a “+N” chip. */
  max?: number;
  /** Size of the overflow chip; match the avatars' `size`. Defaults to `md`. */
  size?: AvatarSize;
  /** Accessible name of the group (e.g. "Project members"). Required unless you pass `aria-label`/`aria-labelledby`. */
  label?: string;
  /** `Avatar` elements. */
  children?: ReactNode;
}

/** Overlapping row of avatars with an optional overflow count. Exposed as a labelled group. */
export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup(
  { max, size = "md", label, className, children, ...props },
  ref,
) {
  if (!label && !props["aria-label"] && !props["aria-labelledby"]) {
    devWarn("avatar-group-label", "AvatarGroup renders role=\"group\" and needs a name: pass `label` (or aria-label/aria-labelledby).");
  }
  const items = Children.toArray(children).filter(isValidElement);
  const visible = max !== undefined ? items.slice(0, max) : items;
  const hidden = items.length - visible.length;
  return (
    <div ref={ref} role="group" aria-label={label} className={cx("mrd-avatar-group", className)} data-size={size} {...props}>
      {visible}
      {hidden > 0 ? (
        <span
          role="img"
          aria-label={`${hidden} more`}
          className="mrd-avatar mrd-avatar-group__overflow"
          data-size={size}
          data-status="fallback"
        >
          <span className="mrd-avatar__fallback" aria-hidden="true">
            +{hidden}
          </span>
        </span>
      ) : null}
    </div>
  );
});
