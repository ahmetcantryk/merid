"use client";

import { useEffect, useState } from "react";
import { Progress } from "@meridui/react";

const wrap = { width: "100%", maxWidth: 360, display: "grid", gap: 16 } as const;

export function ProgressDemo() {
  return (
    <div style={wrap}>
      <Progress aria-label="Yükleme" value={64} />
    </div>
  );
}

export function ProgressSizes() {
  return (
    <div style={wrap}>
      <Progress aria-label="Küçük" size="sm" value={40} />
      <Progress aria-label="Orta" size="md" value={60} />
      <Progress aria-label="Büyük" size="lg" value={80} />
    </div>
  );
}

export function ProgressIndeterminate() {
  return (
    <div style={wrap}>
      <Progress aria-label="Dışa aktarma hazırlanıyor" />
    </div>
  );
}

export function ProgressValueText() {
  return (
    <div style={wrap}>
      <Progress aria-label="İlk kurulum" value={3} max={5} valueText="5 adımdan 3’ü" />
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
      <Progress aria-label="Eşitleniyor" value={value} />
    </div>
  );
}
