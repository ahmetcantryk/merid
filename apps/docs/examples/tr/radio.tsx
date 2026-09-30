"use client";

import { useState } from "react";
import { Radio, RadioGroup } from "@merid/react";

export function RadioDemo() {
  return (
    <RadioGroup aria-label="Paket" defaultValue="team">
      <Radio value="free">Ücretsiz</Radio>
      <Radio value="team">Ekip</Radio>
      <Radio value="business">İşletme</Radio>
    </RadioGroup>
  );
}

export function RadioControlled() {
  const [value, setValue] = useState("standard");
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <RadioGroup aria-label="Kargo" value={value} onValueChange={setValue}>
        <Radio value="standard" description="3–5 iş günü">
          Standart
        </Radio>
        <Radio value="express" description="Sonraki iş günü">
          Hızlı
        </Radio>
      </RadioGroup>
      <span style={{ fontSize: 13, color: "var(--mrd-muted)" }}>value: {value}</span>
    </div>
  );
}

export function RadioHorizontal() {
  return (
    <RadioGroup aria-label="Fatura dönemi" orientation="horizontal" defaultValue="monthly">
      <Radio value="monthly">Aylık</Radio>
      <Radio value="yearly">Yıllık</Radio>
    </RadioGroup>
  );
}

export function RadioStates() {
  return (
    <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
      <RadioGroup aria-label="Devre dışı grup" disabled defaultValue="a">
        <Radio value="a">Devre dışı grup</Radio>
        <Radio value="b">Bu da devre dışı</Radio>
      </RadioGroup>
      <RadioGroup aria-label="Beden" defaultValue="m">
        <Radio value="s">Küçük</Radio>
        <Radio value="m">Orta</Radio>
        <Radio value="l" disabled>
          Büyük (tükendi)
        </Radio>
      </RadioGroup>
      <RadioGroup aria-label="Geçersiz grup" invalid required>
        <Radio value="yes">Evet</Radio>
        <Radio value="no">Hayır</Radio>
      </RadioGroup>
    </div>
  );
}
