import { Children, cloneElement, forwardRef, isValidElement, type AnchorHTMLAttributes, type ReactElement, type ReactNode, type Ref } from "react";
import { Slot } from "../../internal/ovl-slot";
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
  /**
   * Render the single child element (e.g. a router `<Link>`) with Merid link styling instead of an `<a>`.
   * Props, ref, handlers and className merge onto the child.
   */
  asChild?: boolean;
}

const EXTERNAL_HINT = (
  <>
    {" "}
    <span className="mrd-visually-hidden">(opens in a new tab)</span>
  </>
);

/** Styled anchor. Pass `asChild` to style a client-side router's link. */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { tone = "accent", underline = "hover", external = false, asChild = false, className, children, target, rel, ...props },
  ref,
) {
  const shared = {
    className: cx("mrd-link", className),
    "data-tone": tone,
    "data-underline": underline,
    target: external ? "_blank" : target,
    rel: external ? "noopener noreferrer" : rel,
  };

  if (asChild) {
    const child = Children.only(children);
    if (!isValidElement(child)) throw new Error("<Link asChild> expects a single React element child.");
    const element = child as ReactElement<{ children?: ReactNode }>;
    return (
      <Slot ref={ref as unknown as Ref<HTMLElement>} {...shared} {...(props as Record<string, unknown>)}>
        {external
          ? cloneElement(
              element,
              undefined,
              <>
                {element.props.children}
                {EXTERNAL_HINT}
              </>,
            )
          : element}
      </Slot>
    );
  }

  return (
    <a ref={ref} {...shared} {...props}>
      {children}
      {external ? EXTERNAL_HINT : null}
    </a>
  );
});
