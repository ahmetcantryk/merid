import { forwardRef, type AnchorHTMLAttributes } from "react";
import { cx } from "../../utils/cx";

export type LinkTone = "accent" | "ink" | "muted";
export type LinkUnderline = "hover" | "always" | "none";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Text colour. `accent` (default) for inline links, `ink`/`muted` for quieter navigation. */
  tone?: LinkTone;
  /** When the underline shows. Defaults to `hover`. */
  underline?: LinkUnderline;
  /** Opens in a new tab with `rel="noopener noreferrer"` and appends a visually hidden hint. */
  external?: boolean;
}

/**
 * Styled anchor. For client-side routers, style your router's link with the
 * `mrd-link` class and the same data attributes instead.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { tone = "accent", underline = "hover", external = false, className, children, target, rel, ...props },
  ref,
) {
  return (
    <a
      ref={ref}
      className={cx("mrd-link", className)}
      data-tone={tone}
      data-underline={underline}
      target={external ? "_blank" : target}
      rel={external ? "noopener noreferrer" : rel}
      {...props}
    >
      {children}
      {external ? (
        <>
          {" "}
          <span className="mrd-visually-hidden">(opens in a new tab)</span>
        </>
      ) : null}
    </a>
  );
});
