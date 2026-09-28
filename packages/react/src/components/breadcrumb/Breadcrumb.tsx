import type { AnchorHTMLAttributes, HTMLAttributes, LiHTMLAttributes, Ref } from "react";
import { cx } from "../../internal/ovl-cx";

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
  /** Forwarded ref to the anchor. */
  ref?: Ref<HTMLAnchorElement>;
}

function BreadcrumbLink({ className, ...rest }: BreadcrumbLinkProps) {
  return <a className={cx("mrd-breadcrumb__link", className)} {...rest} />;
}

export interface BreadcrumbPageProps extends HTMLAttributes<HTMLSpanElement> {}

/** The current page; rendered as text with `aria-current="page"`. */
function BreadcrumbPage({ className, ...rest }: BreadcrumbPageProps) {
  return <span aria-current="page" className={cx("mrd-breadcrumb__page", className)} {...rest} />;
}

/** Breadcrumb trail (WAI-ARIA APG "Breadcrumb"). Separators are drawn in CSS and hidden from assistive tech. */
export const Breadcrumb = {
  Root: BreadcrumbRoot,
  Item: BreadcrumbItem,
  Link: BreadcrumbLink,
  Page: BreadcrumbPage,
};
