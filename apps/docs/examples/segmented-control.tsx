"use client";

import { useState } from "react";
import { SegmentedControl } from "@meridui/react";
import { GridIcon, ListIcon } from "./icons";

const RANGE = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

export function SegmentedControlDemo() {
  return <SegmentedControl aria-label="Range" options={RANGE} defaultValue="week" />;
}

export function SegmentedControlControlled() {
  const [value, setValue] = useState("month");
  return (
    <div style={{ display: "grid", gap: 12, justifyItems: "center" }}>
      <SegmentedControl aria-label="Range" options={RANGE} value={value} onValueChange={setValue} />
      <span style={{ fontSize: 13, color: "var(--mrd-muted)" }}>value: {value}</span>
    </div>
  );
}

export function SegmentedControlIcons() {
  return (
    <SegmentedControl
      aria-label="View"
      options={[
        { value: "list", label: <ListIcon />, ariaLabel: "List view" },
        { value: "grid", label: <GridIcon />, ariaLabel: "Grid view" },
      ]}
    />
  );
}

export function SegmentedControlStates() {
  return (
    <div style={{ display: "grid", gap: 16, width: "100%", maxWidth: 400 }}>
      <SegmentedControl
        aria-label="Plan"
        options={[
          { value: "monthly", label: "Monthly" },
          { value: "yearly", label: "Yearly" },
          { value: "lifetime", label: "Lifetime", disabled: true },
        ]}
      />
      <SegmentedControl aria-label="Range (disabled)" options={RANGE} disabled />
      <SegmentedControl aria-label="Range (full width)" options={RANGE} fullWidth />
    </div>
  );
}
