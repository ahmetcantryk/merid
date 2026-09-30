"use client";

import { useState } from "react";
import { DatePicker, Field, type DateRange } from "@meridui/react";

const stack = { display: "grid", gap: 8, width: 280 } as const;
const note = { fontSize: 13, color: "var(--mrd-muted)" } as const;

/** Türkçe arayüz metinleri; takvimin ekran okuyucu etiketleri de dahil. */
const tr = {
  locale: "tr-TR",
  placeholder: "GG.AA.YYYY",
  calendarLabel: "Tarih seç",
  previousMonthLabel: "Önceki ay",
  nextMonthLabel: "Sonraki ay",
} as const;

export function DatePickerBasic() {
  const [date, setDate] = useState<Date | null>(null);
  return (
    <div style={stack}>
      <Field label="Son tarih" description="GG.AA.YYYY biçiminde yaz ya da takvimden seç.">
        <DatePicker {...tr} value={date} onValueChange={setDate} name="due" />
      </Field>
      <span style={note}>değer: {date ? date.toLocaleDateString("tr-TR") : "null"}</span>
    </div>
  );
}

export function DatePickerRange() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <div style={{ ...stack, width: 320 }}>
      <Field label="Konaklama">
        <DatePicker {...tr} mode="range" value={range} onValueChange={setRange} startLabel="Giriş tarihi" endLabel="Çıkış tarihi" />
      </Field>
    </div>
  );
}

const today = new Date();
const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;

export function DatePickerConstraints() {
  return (
    <div style={stack}>
      <Field label="Teslimat günü" description="Yalnızca hafta içi, bugünden itibaren.">
        <DatePicker {...tr} min={today} isDateDisabled={isWeekend} />
      </Field>
    </div>
  );
}

export function DatePickerStates() {
  return (
    <div style={stack}>
      <DatePicker {...tr} aria-label="Küçük" size="sm" />
      <DatePicker {...tr} aria-label="Geçersiz" invalid />
      <DatePicker {...tr} aria-label="Devre dışı" disabled defaultValue={today} />
    </div>
  );
}
