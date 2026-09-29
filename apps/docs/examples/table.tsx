"use client";

import { useState } from "react";
import {
  Badge,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@merid/react";

const wrap = { width: "100%" } as const;

const INVOICES = [
  { id: "INV-1042", customer: "Northwind", status: "Paid", amount: "1,240.00" },
  { id: "INV-1043", customer: "Globex", status: "Due", amount: "860.50" },
  { id: "INV-1044", customer: "Initech", status: "Overdue", amount: "3,120.00" },
];

const TONE = { Paid: "success", Due: "neutral", Overdue: "danger" } as const;

export function TableDemo() {
  return (
    <div style={wrap}>
      <Table scrollLabel="Invoices">
        <TableHead>
          <TableRow>
            <TableHeader>Invoice</TableHeader>
            <TableHeader>Customer</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader align="end">Amount</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {INVOICES.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.customer}</TableCell>
              <TableCell>
                <Badge tone={TONE[row.status as keyof typeof TONE]}>{row.status}</Badge>
              </TableCell>
              <TableCell align="end">{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function TableDense() {
  return (
    <div style={wrap}>
      <Table density="sm" hoverable={false} scrollLabel="API keys">
        <TableHead>
          <TableRow>
            <TableHeader>Key</TableHeader>
            <TableHeader align="end">Requests</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>api/search</TableCell>
            <TableCell align="end">12,480</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>api/users</TableCell>
            <TableCell align="end">3,904</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export function TableSelectable() {
  const [selected, setSelected] = useState<string[]>(["INV-1043"]);
  const toggle = (id: string) =>
    setSelected(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  return (
    <div style={wrap}>
      <Table scrollLabel="Invoices">
        <TableHead>
          <TableRow>
            <TableHeader style={{ width: 40 }}>
              <Checkbox
                aria-label="Select all"
                checked={selected.length === INVOICES.length}
                indeterminate={selected.length > 0 && selected.length < INVOICES.length}
                onChange={() => setSelected(selected.length === INVOICES.length ? [] : INVOICES.map((r) => r.id))}
              />
            </TableHeader>
            <TableHeader>Invoice</TableHeader>
            <TableHeader align="end">Amount</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {INVOICES.map((row) => (
            <TableRow key={row.id} selected={selected.includes(row.id)}>
              <TableCell>
                <Checkbox
                  aria-label={`Select ${row.id}`}
                  checked={selected.includes(row.id)}
                  onChange={() => toggle(row.id)}
                />
              </TableCell>
              <TableCell>{row.id}</TableCell>
              <TableCell align="end">{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
