import type { AnchorHTMLAttributes, ElementType, HTMLAttributes, ReactNode, Ref } from "react";
import { cx } from "../../internal/ovl-cx";
import { useId } from "../../internal/ovl-use-id";

export interface SidebarNavProps extends HTMLAttributes<HTMLElement> {
  /** Accessible name of the landmark (required when a page has several navs). */
  "aria-label"?: string;
  /** Forwarded ref to the nav element. */
  ref?: Ref<HTMLElement>;
}

function SidebarNavRoot({ className, children, ...rest }: SidebarNavProps) {
  return (
    <nav className={cx("mrd-sidebar-nav", className)} {...rest}>
      <ul className="mrd-sidebar-nav__list">{children}</ul>
    </nav>
  );
}

export interface SidebarNavGroupProps extends Omit<HTMLAttributes<HTMLLIElement>, "title"> {
  /** Visible group heading; also labels the nested list. */
  label: ReactNode;
}

function SidebarNavGroup({ label, className, children, ...rest }: SidebarNavGroupProps) {
  const id = useId(undefined, "mrd-sidebar-group");
  return (
    <li className={cx("mrd-sidebar-nav__group", className)} {...rest}>
      <span id={id} className="mrd-sidebar-nav__group-label">
        {label}
      </span>
      <ul aria-labelledby={id} className="mrd-sidebar-nav__list">
        {children}
      </ul>
    </li>
  );
}

export interface SidebarNavItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Marks the current page: sets `aria-current="page"` and the selected style. */
  active?: boolean;
  /** Icon shown before the label (decorative). */
  icon?: ReactNode;
  /** Trailing element such as a count Badge. */
  trailing?: ReactNode;
  /** Element or component to render instead of `<a>`, e.g. a router `Link`. */
  as?: ElementType;
  /** Forwarded ref to the link. */
  ref?: Ref<HTMLAnchorElement>;
}

/**
 * A link inside `SidebarNav`. Pass `as={Link}` plus router props (e.g. `to`) for client-side routing;
 * extra props are forwarded to the rendered element.
 */
export function SidebarNavItem({
  active = false,
  icon,
  trailing,
  as,
  className,
  children,
  ...rest
}: SidebarNavItemProps & Record<string, unknown>) {
  const Component: ElementType = as ?? "a";
  return (
    <li className="mrd-sidebar-nav__entry">
      <Component
        aria-current={active ? "page" : undefined}
        data-state={active ? "active" : undefined}
        className={cx("mrd-sidebar-nav__item", className as string | undefined)}
        {...rest}
      >
        {icon ? (
          <span className="mrd-sidebar-nav__icon" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <span className="mrd-sidebar-nav__label">{children as ReactNode}</span>
        {trailing ? <span className="mrd-sidebar-nav__trailing">{trailing as ReactNode}</span> : null}
      </Component>
    </li>
  );
}

/** Vertical navigation for app sidebars. `SidebarNav` is the root; use `SidebarNav.Item` / `SidebarNav.Group`. */
export const SidebarNav = Object.assign(SidebarNavRoot, {
  Root: SidebarNavRoot,
  Group: SidebarNavGroup,
  Item: SidebarNavItem,
});
