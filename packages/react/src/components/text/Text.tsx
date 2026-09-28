import { forwardRef } from "react";
import { cx } from "../../utils/cx";
import type { AsProps } from "../../utils/polymorphic";

export type TextSize = "lg" | "md" | "sm" | "xs" | "2xs" | "3xs";
export type TextTone = "ink" | "body" | "muted" | "accent" | "danger";
export type TextWeight = "regular" | "medium" | "semibold";

export interface TextProps extends AsProps {
  /** Type scale step. `lg` is lead (17px), `md` body (15px, default), down to `3xs` caption (12px). */
  size?: TextSize;
  /** Text tone. Hierarchy comes from tone and weight, not colour. Defaults to `body`. */
  tone?: TextTone;
  /** Font weight. Defaults to `regular`. There is no bold. */
  weight?: TextWeight;
  /** Uses tabular numerals (always on for numbers inside tables and badges). */
  numeric?: boolean;
  /** Caps the line length at the reading width (720px). */
  prose?: boolean;
}

/** Body text. Renders a `p` unless `as` is given (e.g. `span`, `div`, `small`). */
export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { as: Component = "p", size = "md", tone = "body", weight = "regular", numeric = false, prose = false, className, ...props },
  ref,
) {
  return (
    <Component
      ref={ref}
      className={cx("mrd-text", className)}
      data-size={size}
      data-tone={tone}
      data-weight={weight}
      data-numeric={numeric || undefined}
      data-prose={prose || undefined}
      {...props}
    />
  );
});
