"use client";

import { useState } from "react";
import { Toggle, ToggleGroup, ToggleGroupItem } from "@meridui/react";

const note = { fontSize: 13, color: "var(--mrd-muted)" } as const;
const col = { display: "grid", gap: 12, justifyItems: "start" } as const;

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const ALIGN_LEFT = "M2.5 4h11M2.5 8h7M2.5 12h9";
const ALIGN_CENTER = "M2.5 4h11M4.5 8h7M3.5 12h9";
const ALIGN_RIGHT = "M2.5 4h11M6.5 8h7M4.5 12h9";

export function ToggleGroupBasic() {
  const [align, setAlign] = useState("left");
  return (
    <div style={col}>
      <ToggleGroup type="single" aria-label="Text alignment" value={align} onValueChange={setAlign}>
        <ToggleGroupItem value="left" aria-label="Align left">
          <Icon d={ALIGN_LEFT} />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center">
          <Icon d={ALIGN_CENTER} />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right">
          <Icon d={ALIGN_RIGHT} />
        </ToggleGroupItem>
      </ToggleGroup>
      <span style={note}>value: {JSON.stringify(align)}</span>
    </div>
  );
}

export function ToggleGroupMultiple() {
  const [format, setFormat] = useState<string[]>(["bold"]);
  return (
    <div style={col}>
      <ToggleGroup type="multiple" aria-label="Formatting" value={format} onValueChange={setFormat}>
        <ToggleGroupItem value="bold" style={{ fontWeight: 600 }}>
          Bold
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" style={{ fontStyle: "italic" }}>
          Italic
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" style={{ textDecoration: "underline" }}>
          Underline
        </ToggleGroupItem>
      </ToggleGroup>
      <span style={note}>value: {JSON.stringify(format)}</span>
    </div>
  );
}

export function ToggleDemo() {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Toggle defaultPressed>Show grid</Toggle>
      <Toggle size="sm">Snap</Toggle>
      <Toggle disabled>Rulers</Toggle>
    </div>
  );
}
