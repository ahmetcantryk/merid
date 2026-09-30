"use client";

import { useState } from "react";
import { SegmentedControl } from "@meridui/react";
import { GridIcon, ListIcon } from "../icons";

const RANGE = [
  { value: "day", label: "Gün" },
  { value: "week", label: "Hafta" },
  { value: "month", label: "Ay" },
];

export function SegmentedControlDemo() {
  return <SegmentedControl aria-label="Zaman aralığı" options={RANGE} defaultValue="week" />;
}

export function SegmentedControlControlled() {
  const [value, setValue] = useState("month");
  return (
    <div style={{ display: "grid", gap: 12, justifyItems: "center" }}>
      <SegmentedControl aria-label="Zaman aralığı" options={RANGE} value={value} onValueChange={setValue} />
      <span style={{ fontSize: 13, color: "var(--mrd-muted)" }}>value: {value}</span>
    </div>
  );
}

export function SegmentedControlIcons() {
  return (
    <SegmentedControl
      aria-label="Görünüm"
      options={[
        { value: "list", label: <ListIcon />, ariaLabel: "Liste görünümü" },
        { value: "grid", label: <GridIcon />, ariaLabel: "Grid görünümü" },
      ]}
    />
  );
}

export function SegmentedControlStates() {
  return (
    <div style={{ display: "grid", gap: 16, width: "100%", maxWidth: 400 }}>
      <SegmentedControl
        aria-label="Paket"
        options={[
          { value: "monthly", label: "Aylık" },
          { value: "yearly", label: "Yıllık" },
          { value: "lifetime", label: "Ömür boyu", disabled: true },
        ]}
      />
      <SegmentedControl aria-label="Zaman aralığı (devre dışı)" options={RANGE} disabled />
      <SegmentedControl aria-label="Zaman aralığı (tam genişlik)" options={RANGE} fullWidth />
    </div>
  );
}
