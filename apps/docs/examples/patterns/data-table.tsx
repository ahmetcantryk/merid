"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Checkbox,
  Input,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
  type BadgeTone,
} from "@merid/react";

type Status = "Paid" | "Pending" | "Overdue";
interface Invoice {
  readonly id: string;
  readonly customer: string;
  readonly amount: number;
  readonly status: Status;
}
type SortKey = "customer" | "amount";
type SortDir = "ascending" | "descending";

const CUSTOMERS = ["Northwind", "Contoso", "Fabrikam", "Tailspin", "Wingtip", "Litware", "Adatum"];
const STATUSES: readonly Status[] = ["Paid", "Pending", "Overdue"];
const INVOICES: readonly Invoice[] = Array.from({ length: 23 }, (_, i) => ({
  id: `INV-${String(1040 + i)}`,
  customer: CUSTOMERS[(i * 3) % CUSTOMERS.length]!,
  amount: 120 + ((i * 7919) % 4200),
  status: STATUSES[(i * 5) % 3]!,
}));
const TONE: Record<Status, BadgeTone> = { Paid: "success", Pending: "neutral", Overdue: "danger" };
const PAGE_SIZE = 6;
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

function SortHeader({
  label,
  column,
  sort,
  onSort,
  align,
}: {
  readonly label: string;
  readonly column: SortKey;
  readonly sort: { key: SortKey; dir: SortDir };
  readonly onSort: (key: SortKey) => void;
  readonly align?: "start" | "end";
}) {
  const active = sort.key === column;
  return (
    <TableHeader align={align} aria-sort={active ? sort.dir : "none"}>
      <Button variant="ghost" size="sm" onClick={() => onSort(column)} style={{ marginInline: -8 }}>
        {label}
        <span aria-hidden="true" style={{ opacity: active ? 1 : 0.35 }}>
          {active && sort.dir === "descending" ? "↓" : "↑"}
        </span>
      </Button>
    </TableHeader>
  );
}

export function DataTableExample() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: "amount", dir: "descending" });
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = INVOICES.filter((r) => !q || r.customer.toLowerCase().includes(q) || r.id.toLowerCase().includes(q));
    const factor = sort.dir === "ascending" ? 1 : -1;
    return [...filtered].sort((a, b) =>
      sort.key === "amount" ? (a.amount - b.amount) * factor : a.customer.localeCompare(b.customer) * factor,
    );
  }, [query, sort]);

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const visible = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const allOnPage = visible.length > 0 && visible.every((r) => selected.has(r.id));
  const someOnPage = visible.some((r) => selected.has(r.id));

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const togglePage = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      for (const r of visible) {
        if (allOnPage) next.delete(r.id);
        else next.add(r.id);
      }
      return next;
    });
  const onSort = (key: SortKey) =>
    setSort((prev) => ({ key, dir: prev.key === key && prev.dir === "ascending" ? "descending" : "ascending" }));

  return (
    <Stack gap={4} style={{ width: "100%" }}>
      <Stack direction="row" gap={3} align="center" justify="between" wrap>
        <Input
          aria-label="Filter invoices"
          placeholder="Filter by customer or number"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          style={{ maxWidth: 280 }}
        />
        <Stack direction="row" gap={2} align="center">
          <Text size="sm" tone="muted" aria-live="polite">
            {selected.size > 0 ? `${selected.size} selected` : `${rows.length} invoices`}
          </Text>
          <Button size="sm" disabled={selected.size === 0} onClick={() => setSelected(new Set())}>
            Clear
          </Button>
          <Button size="sm" variant="primary" disabled={selected.size === 0}>
            Send reminders
          </Button>
        </Stack>
      </Stack>
      <Table hoverable scrollLabel="Invoices">
        <TableHead>
          <TableRow>
            <TableHeader style={{ width: 40 }}>
              <Checkbox
                aria-label="Select all on this page"
                checked={allOnPage}
                indeterminate={someOnPage && !allOnPage}
                onChange={togglePage}
              />
            </TableHeader>
            <TableHeader>Invoice</TableHeader>
            <SortHeader label="Customer" column="customer" sort={sort} onSort={onSort} />
            <TableHeader>Status</TableHeader>
            <SortHeader label="Amount" column="amount" sort={sort} onSort={onSort} align="end" />
          </TableRow>
        </TableHead>
        <TableBody>
          {visible.map((r) => (
            <TableRow key={r.id} selected={selected.has(r.id)}>
              <TableCell>
                <Checkbox aria-label={`Select ${r.id}`} checked={selected.has(r.id)} onChange={() => toggle(r.id)} />
              </TableCell>
              <TableCell>
                <Text as="span" size="sm" numeric>
                  {r.id}
                </Text>
              </TableCell>
              <TableCell>{r.customer}</TableCell>
              <TableCell>
                <Badge tone={TONE[r.status]}>{r.status}</Badge>
              </TableCell>
              <TableCell align="end">
                <Text as="span" size="sm" numeric tone="ink">
                  {money.format(r.amount)}
                </Text>
              </TableCell>
            </TableRow>
          ))}
          {visible.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <Text size="sm" tone="muted">
                  No invoices match “{query}”.
                </Text>
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
      <Stack direction="row" justify="between" align="center" wrap gap={3}>
        <Text size="xs" tone="muted">
          Page {current} of {pageCount}
        </Text>
        <Pagination pageCount={pageCount} page={current} onPageChange={setPage} aria-label="Invoice pages" />
      </Stack>
    </Stack>
  );
}
