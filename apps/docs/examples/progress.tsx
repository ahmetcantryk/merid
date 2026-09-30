"use client";

import { useEffect, useState } from "react";
import { Progress } from "@meridui/react";

const wrap = { width: "100%", maxWidth: 360, display: "grid", gap: 16 } as const;

export function ProgressDemo() {
  return (
    <div style={wrap}>
      <Progress aria-label="Upload" value={64} />
    </div>
  );
}

export function ProgressSizes() {
  return (
    <div style={wrap}>
      <Progress aria-label="Small" size="sm" value={40} />
      <Progress aria-label="Medium" size="md" value={60} />
      <Progress aria-label="Large" size="lg" value={80} />
    </div>
  );
}

export function ProgressIndeterminate() {
  return (
    <div style={wrap}>
      <Progress aria-label="Preparing export" />
    </div>
  );
}

export function ProgressValueText() {
  return (
    <div style={wrap}>
      <Progress aria-label="Onboarding" value={3} max={5} valueText="3 of 5 steps" />
    </div>
  );
}

export function ProgressLive() {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setValue((v) => (v >= 100 ? 0 : v + 10)), 600);
    return () => window.clearInterval(id);
  }, []);
  return (
    <div style={wrap}>
      <Progress aria-label="Syncing" value={value} />
    </div>
  );
}
