import { TableHeader } from "@merid/react";
import type { Sort, SortKey } from "./useTableState";

interface SortHeaderProps {
  column: SortKey;
  label: string;
  sort: Sort;
  onSort: (key: SortKey) => void;
  align?: "start" | "end";
  className?: string;
}

/** Binds the table's sort state to Merid's sortable TableHeader (aria-sort on the <th>, a real button inside). */
export function SortHeader({ column, label, sort, onSort, align, className }: SortHeaderProps) {
  return (
    <TableHeader
      align={align}
      className={className}
      sortDirection={sort.key === column ? sort.direction : "none"}
      onSort={() => onSort(column)}
    >
      {label}
    </TableHeader>
  );
}
