import { Children, forwardRef, isValidElement, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "../../utils/cx";
import type { AvatarSize } from "./Avatar";

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Maximum avatars shown; the rest collapse into a “+N” chip. */
  max?: number;
  /** Size of the overflow chip; match the avatars' `size`. Defaults to `md`. */
  size?: AvatarSize;
  /** `Avatar` elements. */
  children?: ReactNode;
}

/** Overlapping row of avatars with an optional overflow count. Exposed as a labelled group. */
export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup(
  { max, size = "md", className, children, ...props },
  ref,
) {
  const items = Children.toArray(children).filter(isValidElement);
  const visible = max !== undefined ? items.slice(0, max) : items;
  const hidden = items.length - visible.length;
  return (
    <div ref={ref} role="group" className={cx("mrd-avatar-group", className)} data-size={size} {...props}>
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
