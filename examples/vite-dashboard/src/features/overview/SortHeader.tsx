import { TableHeader } from "@merid/react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { Sort, SortKey } from "./useTableState";

interface SortHeaderProps {
  column: SortKey;
  label: string;
  sort: Sort;
  onSort: (key: SortKey) => void;
  align?: "start" | "end";
  className?: string;
}

/** A column header with a real button inside and aria-sort on the <th>. */
export function SortHeader({ column, label, sort, onSort, align, className }: SortHeaderProps) {
  const active = sort.key === column;
  const Icon = !active ? ArrowUpDown : sort.direction === "ascending" ? ArrowUp : ArrowDown;
  return (
    <TableHeader align={align} className={className} aria-sort={active ? sort.direction : "none"}>
      <button type="button" className="sort-button" onClick={() => onSort(column)}>
        {label}
        <Icon size={14} aria-hidden="true" className="sort-button__icon" data-active={active || undefined} />
      </button>
    </TableHeader>
  );
}
