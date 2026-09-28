import { forwardRef } from "react";
import { cx } from "../../utils/cx";
import type { AsProps } from "../../utils/polymorphic";

export type VisuallyHiddenProps = AsProps;

/** Hides content visually while keeping it available to assistive tech. Renders a `span` by default. */
export const VisuallyHidden = forwardRef<HTMLElement, VisuallyHiddenProps>(function VisuallyHidden(
  { as: Component = "span", className, ...props },
  ref,
) {
  return <Component ref={ref} className={cx("mrd-visually-hidden", className)} {...props} />;
});
