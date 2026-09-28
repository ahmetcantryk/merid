"use client";

import {
  forwardRef,
  type MouseEvent,
  type HTMLAttributes,
  type TableHTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from "react";
import { cx } from "../../utils/cx";

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  /** Row density: `md` (default) 14px 16px cells, `sm` 10px 12px. */
  density?: "sm" | "md";
  /** Highlights rows on hover (tray). Defaults to `true`. */
  hoverable?: boolean;
  /**
   * Makes the scroll wrapper a focusable, labelled region so keyboard users can scroll
   * wide tables. Pass the region's name. Omit for tables that never overflow.
   */
  scrollLabel?: string;
}

/**
 * Styled `<table>` in a hairline-ringed, horizontally scrollable frame.
 * `className` and native props go on the `<table>`.
 */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { density = "md", hoverable = true, scrollLabel, className, ...props },
  ref,
) {
  const region = scrollLabel ? { role: "region", "aria-label": scrollLabel, tabIndex: 0 } : {};
  return (
    <div className="mrd-table-frame" {...region}>
      <table
        ref={ref}
        className={cx("mrd-table", className)}
        data-density={density}
        data-hoverable={hoverable || undefined}
        {...props}
      />
    </div>
  );
});

export type TableHeadProps = HTMLAttributes<HTMLTableSectionElement>;

/** `<thead>` on the subtle surface. */
export const TableHead = forwardRef<HTMLTableSectionElement, TableHeadProps>(function TableHead(
  { className, ...props },
  ref,
) {
  return <thead ref={ref} className={cx("mrd-table__head", className)} {...props} />;
});

export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;

/** `<tbody>`. */
export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(function TableBody(
  { className, ...props },
  ref,
) {
  return <tbody ref={ref} className={cx("mrd-table__body", className)} {...props} />;
});

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /**
   * Selected row: accent-soft fill (`data-selected`). A plain table has no selection semantics, so
   * convey it through the selection control (e.g. a checked checkbox cell); pass `aria-selected`
   * yourself only when the table uses `role="grid"`/`"treegrid"`.
   */
  selected?: boolean;
}

/** `<tr>` with hairline separator. */
export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { selected, className, ...props },
  ref,
) {
  return (
    <tr
      ref={ref}
      className={cx("mrd-table__row", className)}
      data-selected={selected || undefined}
      {...props}
    />
  );
});

export type TableSortDirection = "ascending" | "descending" | "none";

export interface TableHeaderProps extends Omit<ThHTMLAttributes<HTMLTableCellElement>, "align"> {
  /** Text alignment; use `end` for numeric columns. Defaults to `start`. */
  align?: "start" | "center" | "end";
  /**
   * Makes the column sortable: sets `aria-sort` and renders the header text inside a button
   * with a direction icon. Use `"none"` for sortable columns that are not the active sort.
   */
  sortDirection?: TableSortDirection;
  /** Called when the sort button is pressed; you compute the next direction and sort the rows. */
  onSort?: (event: MouseEvent<HTMLButtonElement>) => void;
}

function SortIcon({ direction }: { direction: TableSortDirection }) {
  return (
    <svg className="mrd-table__sort-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false">
      {direction !== "descending" ? (
        <path d="M3.5 5L6 2.5 8.5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity={direction === "ascending" ? 1 : 0.5} />
      ) : null}
      {direction !== "ascending" ? (
        <path d="M3.5 7L6 9.5 8.5 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity={direction === "descending" ? 1 : 0.5} />
      ) : null}
    </svg>
  );
}

/** `<th>`: 12px / 500 / muted. Defaults `scope="col"`. With `sortDirection` / `onSort` it becomes a sortable column header. */
export const TableHeader = forwardRef<HTMLTableCellElement, TableHeaderProps>(function TableHeader(
  { align = "start", scope = "col", sortDirection, onSort, className, children, ...props },
  ref,
) {
  const sortable = sortDirection !== undefined || onSort !== undefined;
  const direction = sortDirection ?? "none";
  return (
    <th
      ref={ref}
      scope={scope}
      className={cx("mrd-table__header", className)}
      data-align={align}
      aria-sort={sortable ? direction : undefined}
      data-sort={sortable ? direction : undefined}
      {...props}
    >
      {sortable ? (
        <button type="button" className="mrd-table__sort" onClick={onSort}>
          {children}
          <SortIcon direction={direction} />
        </button>
      ) : (
        children
      )}
    </th>
  );
});

export interface TableCellProps extends Omit<TdHTMLAttributes<HTMLTableCellElement>, "align"> {
  /** Text alignment; use `end` for numeric columns. Defaults to `start`. */
  align?: "start" | "center" | "end";
}

/** `<td>` with tabular numerals. */
export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { align = "start", className, ...props },
  ref,
) {
  return <td ref={ref} className={cx("mrd-table__cell", className)} data-align={align} {...props} />;
});
