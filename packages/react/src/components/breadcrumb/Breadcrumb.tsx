import type { AnchorHTMLAttributes, ElementType, HTMLAttributes, LiHTMLAttributes, Ref } from "react";
import { cx } from "../../internal/ovl-cx";
import { withRef } from "../../internal/ovl-with-ref";

export interface BreadcrumbRootProps extends HTMLAttributes<HTMLElement> {
  /** Accessible name of the landmark. Defaults to `"Breadcrumb"`. */
  "aria-label"?: string;
  /** Forwarded ref to the nav element. */
  ref?: Ref<HTMLElement>;
}

function BreadcrumbRoot({ className, children, "aria-label": label = "Breadcrumb", ...rest }: BreadcrumbRootProps) {
  return (
    <nav aria-label={label} className={cx("mrd-breadcrumb", className)} {...rest}>
      <ol className="mrd-breadcrumb__list">{children}</ol>
    </nav>
  );
}

export interface BreadcrumbItemProps extends LiHTMLAttributes<HTMLLIElement> {}

function BreadcrumbItem({ className, ...rest }: BreadcrumbItemProps) {
  return <li className={cx("mrd-breadcrumb__item", className)} {...rest} />;
}

export interface BreadcrumbLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Element or component to render instead of `<a>`, e.g. a router `Link`. */
  as?: ElementType;
  /** Forwarded ref to the anchor. */
  ref?: Ref<HTMLAnchorElement>;
}

/** A crumb link. Pass `as={Link}` plus router props (e.g. `to`) for client-side routing; extra props are forwarded. */
function BreadcrumbLink({ as, className, ...rest }: BreadcrumbLinkProps & Record<string, unknown>) {
  const Component: ElementType = as ?? "a";
  return <Component className={cx("mrd-breadcrumb__link", className as string | undefined)} {...rest} />;
}

export interface BreadcrumbPageProps extends HTMLAttributes<HTMLSpanElement> {}

/** The current page; rendered as text with `aria-current="page"`. */
function BreadcrumbPage({ className, ...rest }: BreadcrumbPageProps) {
  return <span aria-current="page" className={cx("mrd-breadcrumb__page", className)} {...rest} />;
}

/** Breadcrumb trail (WAI-ARIA APG "Breadcrumb"). Separators are drawn in CSS and hidden from assistive tech. */
export const Breadcrumb = {
  Root: withRef("Breadcrumb.Root", BreadcrumbRoot),
  Item: withRef("Breadcrumb.Item", BreadcrumbItem),
  Link: withRef("Breadcrumb.Link", BreadcrumbLink),
  Page: withRef("Breadcrumb.Page", BreadcrumbPage),
};
