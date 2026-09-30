"use client";

import { useState } from "react";
import { Field, NativeSelect } from "@meridui/react";

const wrap = { width: "100%", maxWidth: 320 };

export function NativeSelectDemo() {
  return (
    <div style={wrap}>
      <NativeSelect aria-label="Ülke" placeholder="Bir ülke seç">
        <option value="tr">Türkiye</option>
        <option value="de">Almanya</option>
        <option value="nl">Hollanda</option>
      </NativeSelect>
    </div>
  );
}

export function NativeSelectSizes() {
  return (
    <div style={{ ...wrap, display: "grid", gap: 12 }}>
      <NativeSelect aria-label="Küçük" size="sm" defaultValue="a">
        <option value="a">Küçük</option>
      </NativeSelect>
      <NativeSelect aria-label="Orta" size="md" defaultValue="a">
        <option value="a">Orta</option>
      </NativeSelect>
      <NativeSelect aria-label="Büyük" size="lg" defaultValue="a">
        <option value="a">Büyük</option>
      </NativeSelect>
    </div>
  );
}

export function NativeSelectField() {
  return (
    <div style={wrap}>
      <Field label="Plan" description="Planını istediğin zaman değiştirebilirsin." required>
        <NativeSelect placeholder="Bir plan seç">
          <option value="free">Ücretsiz</option>
          <option value="team">Ekip</option>
          <option value="business">Kurumsal</option>
        </NativeSelect>
      </Field>
    </div>
  );
}

export function NativeSelectStates() {
  return (
    <div style={{ ...wrap, display: "grid", gap: 16 }}>
      <Field label="Bölge" error="Devam etmek için bir bölge seç.">
        <NativeSelect placeholder="Bir bölge seç">
          <option value="eu">Avrupa</option>
          <option value="us">Amerika Birleşik Devletleri</option>
        </NativeSelect>
      </Field>
      <Field label="Para birimi" disabled>
        <NativeSelect defaultValue="eur">
          <option value="eur">EUR</option>
        </NativeSelect>
      </Field>
    </div>
  );
}

export function NativeSelectControlled() {
  const [value, setValue] = useState("weekly");
  return (
    <div style={wrap}>
      <Field label="Özet sıklığı" description={`Geçerli değer: ${value}`}>
        <NativeSelect value={value} onChange={(e) => setValue(e.target.value)}>
          <option value="daily">Günlük</option>
          <option value="weekly">Haftalık</option>
          <option value="monthly">Aylık</option>
        </NativeSelect>
      </Field>
    </div>
  );
}
