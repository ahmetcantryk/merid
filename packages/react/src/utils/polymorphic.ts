import type { AllHTMLAttributes, ElementType } from "react";

/**
 * Props for components that accept an `as` element override. Uses the union of
 * all HTML attributes so e.g. `href` works with `as="a"` and `htmlFor` with `as="label"`.
 */
export interface AsProps extends Omit<AllHTMLAttributes<HTMLElement>, "as" | "size" | "wrap"> {
  /** Element (or component) to render instead of the default. */
  as?: ElementType;
}
