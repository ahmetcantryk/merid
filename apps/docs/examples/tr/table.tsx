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
} from "@meridui/react";

const wrap = { width: "100%" } as const;

const INVOICES = [
  { id: "INV-1042", customer: "Northwind", status: "Ödendi", amount: "1.240,00" },
  { id: "INV-1043", customer: "Globex", status: "Bekliyor", amount: "860,50" },
  { id: "INV-1044", customer: "Initech", status: "Gecikmiş", amount: "3.120,00" },
];

const TONE = { Ödendi: "success", Bekliyor: "neutral", Gecikmiş: "danger" } as const;

export function TableDemo() {
  return (
    <div style={wrap}>
      <Table scrollLabel="Faturalar">
        <TableHead>
          <TableRow>
            <TableHeader>Fatura</TableHeader>
            <TableHeader>Müşteri</TableHeader>
            <TableHeader>Durum</TableHeader>
            <TableHeader align="end">Tutar</TableHeader>
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
      <Table density="sm" hoverable={false} scrollLabel="API anahtarları">
        <TableHead>
          <TableRow>
            <TableHeader>Anahtar</TableHeader>
            <TableHeader align="end">İstek</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>api/search</TableCell>
            <TableCell align="end">12.480</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>api/users</TableCell>
            <TableCell align="end">3.904</TableCell>
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
      <Table scrollLabel="Faturalar">
        <TableHead>
          <TableRow>
            <TableHeader style={{ width: 40 }}>
              <Checkbox
                aria-label="Tümünü seç"
                checked={selected.length === INVOICES.length}
                indeterminate={selected.length > 0 && selected.length < INVOICES.length}
                onChange={() => setSelected(selected.length === INVOICES.length ? [] : INVOICES.map((r) => r.id))}
              />
            </TableHeader>
            <TableHeader>Fatura</TableHeader>
            <TableHeader align="end">Tutar</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {INVOICES.map((row) => (
            <TableRow key={row.id} selected={selected.includes(row.id)}>
              <TableCell>
                <Checkbox
                  aria-label={`${row.id} faturasını seç`}
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
