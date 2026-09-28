import { forwardRef } from "react";
import { cx } from "../../utils/cx";
import type { AsProps } from "../../utils/polymorphic";

export interface ContainerProps extends AsProps {
  /** Max content width: `default` 1160px, `prose` 720px (reading width). */
  size?: "default" | "prose";
}

/** Centres content, caps its width and adds the responsive side gutter. */
export const Container = forwardRef<HTMLElement, ContainerProps>(function Container(
  { as: Component = "div", size = "default", className, ...props },
  ref,
) {
  return <Component ref={ref} className={cx("mrd-container", className)} data-size={size} {...props} />;
});
