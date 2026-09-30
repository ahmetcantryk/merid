"use client";

import { useState } from "react";
import { Slider } from "@meridui/react";

const stack = { display: "grid", gap: 12, width: 300 } as const;
const labelStyle = { fontSize: 14, fontWeight: 500, color: "var(--mrd-ink)" } as const;
const note = { fontSize: 13, color: "var(--mrd-muted)", fontVariantNumeric: "tabular-nums" } as const;
const lira = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 });

export function SliderBasic() {
  const [value, setValue] = useState([40]);
  return (
    <div style={stack}>
      <span id="slider-volume-tr" style={labelStyle}>
        Ses
      </span>
      <Slider aria-labelledby="slider-volume-tr" value={value} onValueChange={setValue} getValueText={(v) => `%${v}`} />
      <span style={note}>%{value[0]}</span>
    </div>
  );
}

export function SliderRange() {
  const [value, setValue] = useState([200, 800]);
  const price = (v: number) => lira.format(v);
  return (
    <div style={stack}>
      <span style={labelStyle}>Fiyat</span>
      <Slider
        value={value}
        onValueChange={setValue}
        min={0}
        max={1000}
        step={10}
        minStepsBetweenThumbs={5}
        thumbLabels={["En düşük fiyat", "En yüksek fiyat"]}
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
      <Slider aria-label="Opaklık" defaultValue={[0.5]} min={0} max={1} step={0.05} />
      <Slider aria-label="Devre dışı" defaultValue={[30]} disabled />
      <div dir="rtl">
        <Slider aria-label="Sağdan sola" defaultValue={[25]} />
      </div>
    </div>
  );
}
