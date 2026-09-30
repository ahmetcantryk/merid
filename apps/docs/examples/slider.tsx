"use client";

import { useState } from "react";
import { Slider } from "@meridui/react";

const stack = { display: "grid", gap: 12, width: 300 } as const;
const labelStyle = { fontSize: 14, fontWeight: 500, color: "var(--mrd-ink)" } as const;
const note = { fontSize: 13, color: "var(--mrd-muted)", fontVariantNumeric: "tabular-nums" } as const;

export function SliderBasic() {
  const [value, setValue] = useState([40]);
  return (
    <div style={stack}>
      <span id="slider-volume" style={labelStyle}>
        Volume
      </span>
      <Slider aria-labelledby="slider-volume" value={value} onValueChange={setValue} />
      <span style={note}>{value[0]}%</span>
    </div>
  );
}

export function SliderRange() {
  const [value, setValue] = useState([200, 800]);
  const price = (v: number) => `$${v}`;
  return (
    <div style={stack}>
      <span style={labelStyle}>Price</span>
      <Slider
        value={value}
        onValueChange={setValue}
        min={0}
        max={1000}
        step={10}
        minStepsBetweenThumbs={5}
        thumbLabels={["Minimum price", "Maximum price"]}
        getValueText={price}
        name="price"
      />
      <span style={note}>
        {price(value[0] ?? 0)} – {price(value[1] ?? 0)}
      </span>
    </div>
  );
}

export function SliderStates() {
  return (
    <div style={stack}>
      <Slider aria-label="Opacity" defaultValue={[0.5]} min={0} max={1} step={0.05} />
      <Slider aria-label="Disabled" defaultValue={[30]} disabled />
      <div dir="rtl">
        <Slider aria-label="RTL" defaultValue={[25]} />
      </div>
    </div>
  );
}
