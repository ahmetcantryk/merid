"use client";

import type { AnchorHTMLAttributes, HTMLAttributes, MouseEventHandler, ReactNode, Ref } from "react";
import { cx } from "../../internal/ovl-cx";
import { useControllableState } from "../../internal/ovl-use-controllable-state";
import { withRef } from "../../internal/ovl-with-ref";

export type PageRangeItem = number | "ellipsis-start" | "ellipsis-end";

/**
 * Pages to render: always first and last, `siblings` around the current page,
 * and ellipses for gaps of two or more pages.
 */
export function getPageRange(page: number, pageCount: number, siblings = 1): PageRangeItem[] {
  const total = Math.max(1, Math.floor(pageCount));
  const current = Math.min(Math.max(1, Math.floor(page)), total);
  const seq = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
  // first + last + current + 2 * siblings + two ellipsis slots
  const slots = siblings * 2 + 5;
  if (total <= slots) return seq(1, total);

  const left = Math.max(current - siblings, 1);
  const right = Math.min(current + siblings, total);
  const showStartGap = left > 3;
  const showEndGap = right < total - 2;
  const edgeCount = slots - 2;

  if (!showStartGap) return [...seq(1, edgeCount), "ellipsis-end", total];
  if (!showEndGap) return [1, "ellipsis-start", ...seq(total - edgeCount + 1, total)];
  return [1, "ellipsis-start", ...seq(left, right), "ellipsis-end", total];
}

/** Props handed to `renderLink`: spread them onto your router link (it must render an `<a>`). */
export interface PaginationLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  /** The page this link goes to. Not a DOM prop — do not spread it blindly onto a DOM element. */
  page: number;
  className: string;
  onClick: MouseEventHandler<HTMLAnchorElement>;
  children: ReactNode;
}

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  /** Total number of pages (≥ 1). */
  pageCount: number;
  /** Controlled current page, 1-based. */
  page?: number;
  /** Initial page when uncontrolled. Defaults to 1. */
  defaultPage?: number;
  /** Called with the requested page. */
  onPageChange?: (page: number) => void;
  /** Pages shown on each side of the current one. Defaults to 1. */
  siblingCount?: number;
  /** When given, pages render as links with this href (e.g. for SEO-friendly paging). */
  getHref?: (page: number) => string;
  /**
   * With `getHref`, renders each page link yourself — e.g. `(p) => <NextLink {...p} />` for
   * client-side routing. Spread every prop except `page`. Defaults to a plain `<a>`.
   */
  renderLink?: (props: PaginationLinkProps) => ReactNode;
  /** Accessible name of the landmark. Defaults to `"Pagination"`. */
  "aria-label"?: string;
  /** Label of the previous button. Defaults to `"Previous page"`. */
  previousLabel?: string;
  /** Label of the next button. Defaults to `"Next page"`. */
  nextLabel?: string;
  /** Builds the accessible label for a page button. */
  pageLabel?: (page: number) => string;
  /** Forwarded ref to the nav element. */
  ref?: Ref<HTMLElement>;
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path
        d={direction === "left" ? "M10 4L6 8l4 4" : "M6 4l4 4-4 4"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Page navigation. The current page carries `aria-current="page"`; with `getHref` it renders as
 * plain text (not a link) and other pages as links.
 */
function PaginationImpl({
  pageCount,
  page: pageProp,
  defaultPage = 1,
  onPageChange,
  siblingCount = 1,
  getHref,
  renderLink,
  "aria-label": label = "Pagination",
  previousLabel = "Previous page",
  nextLabel = "Next page",
  pageLabel = (p) => `Page ${p}`,
  className,
  ...rest
}: PaginationProps) {
  const [page, setPage] = useControllableState({ value: pageProp, defaultValue: defaultPage, onChange: onPageChange });
  const total = Math.max(1, Math.floor(pageCount));
  const current = Math.min(Math.max(1, page), total);
  const range = getPageRange(current, total, siblingCount);

  const control = (target: number, content: ReactNode, props: Record<string, unknown>) => {
    const disabled = target < 1 || target > total;
    // Link mode: the current page is not a link to itself.
    if (getHref && props["aria-current"] === "page") {
      // aria-label is not allowed on a generic span, so the label is carried as visually hidden text.
      const { "aria-label": spanLabel, ...spanProps } = props;
      return (
        <span {...spanProps}>
          <span aria-hidden="true">{content}</span>
          <span className="mrd-sr-only">{spanLabel as string}</span>
        </span>
      );
    }
    if (getHref && !disabled) {
      const linkProps = {
        ...(props as Omit<PaginationLinkProps, "href" | "page" | "onClick" | "children">),
        href: getHref(target),
        onClick: () => setPage(target),
        children: content,
      };
      if (renderLink) return renderLink({ ...linkProps, page: target });
      return <a {...linkProps} />;
    }
    return (
      <button type="button" disabled={disabled} onClick={() => setPage(target)} {...props}>
        {content}
      </button>
    );
  };

  return (
    <nav aria-label={label} className={cx("mrd-pagination", className)} {...rest}>
      <ul className="mrd-pagination__list">
        <li>
          {control(current - 1, <Chevron direction="left" />, {
            className: "mrd-pagination__control",
            "aria-label": previousLabel,
            "data-direction": "previous",
          })}
        </li>
        {range.map((item) =>
          typeof item === "number" ? (
            <li key={item}>
              {control(item, item, {
                className: "mrd-pagination__page",
                "aria-label": pageLabel(item),
                "aria-current": item === current ? "page" : undefined,
                "data-state": item === current ? "active" : undefined,
              })}
            </li>
          ) : (
            <li key={item} aria-hidden="true" className="mrd-pagination__ellipsis">
              …
            </li>
          ),
        )}
        <li>
          {control(current + 1, <Chevron direction="right" />, {
            className: "mrd-pagination__control",
            "aria-label": nextLabel,
            "data-direction": "next",
          })}
        </li>
      </ul>
    </nav>
  );
}

export const Pagination = withRef("Pagination", PaginationImpl);
