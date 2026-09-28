import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "../../utils/cx";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = "display" | "h2" | "h3" | "lg" | "md" | "sm";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Semantic level (`h1`–`h6`). Defaults to `2`. */
  level?: HeadingLevel;
  /**
   * Visual size, independent of level. Defaults to `display` for level 1,
   * `h2` for level 2, `h3` for level 3 and `lg`/`md`/`sm` below.
   */
  size?: HeadingSize;
}

const DEFAULT_SIZE: Record<HeadingLevel, HeadingSize> = { 1: "display", 2: "h2", 3: "h3", 4: "lg", 5: "md", 6: "sm" };

/** Semibold, tightly tracked, balanced heading. Weight 700 is never used. */
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  { level = 2, size, className, ...props },
  ref,
) {
  const Tag = `h${level}` as const;
  return <Tag ref={ref} className={cx("mrd-heading", className)} data-size={size ?? DEFAULT_SIZE[level]} {...props} />;
});
