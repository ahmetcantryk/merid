import { forwardRef, type HTMLAttributes, type Ref } from "react";
import { cx } from "../../utils/cx";

export interface CodeProps extends HTMLAttributes<HTMLElement> {
  /** `inline` (default) renders `<code>` in a tray chip; `block` renders `<pre><code>` for multi-line snippets. */
  variant?: "inline" | "block";
}

/** Monospace code, inline or as a block. Syntax highlighting is left to the consumer. */
export const Code = forwardRef<HTMLElement, CodeProps>(function Code(
  { variant = "inline", className, children, ...props },
  ref,
) {
  if (variant === "block") {
    return (
      <pre ref={ref as Ref<HTMLPreElement>} className={cx("mrd-code", className)} data-variant="block" {...props}>
        <code>{children}</code>
      </pre>
    );
  }
  return (
    <code ref={ref} className={cx("mrd-code", className)} data-variant="inline" {...props}>
      {children}
    </code>
  );
});
