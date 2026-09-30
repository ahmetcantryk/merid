"use client";

import { useState } from "react";
import { Calendar, type DateRange } from "@meridui/react";

const note = { fontSize: 13, color: "var(--mrd-muted)" } as const;
const col = { display: "grid", gap: 8, justifyItems: "center" } as const;

/** Türkçe takvim: ay ve gün adları Intl'den gelir, hafta pazartesi başlar. */
const tr = { locale: "tr-TR", previousMonthLabel: "Önceki ay", nextMonthLabel: "Sonraki ay" } as const;
const long = new Intl.DateTimeFormat("tr-TR", { dateStyle: "long" });

export function CalendarBasic() {
  const [date, setDate] = useState<Date | null>(null);
  return (
    <div style={col}>
      <Calendar {...tr} value={date} onValueChange={setDate} />
      <span style={note}>{date ? long.format(date) : "Tarih seçilmedi"}</span>
    </div>
  );
}

export function CalendarRange() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <div style={col}>
      <Calendar {...tr} mode="range" value={range} onValueChange={setRange} />
      <span style={note}>
        {range.start ? long.format(range.start) : "…"} – {range.end ? long.format(range.end) : "…"}
      </span>
    </div>
  );
}

const today = new Date();
const inTwoMonths = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate());
const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;

export function CalendarConstraints() {
  return <Calendar {...tr} min={today} max={inTwoMonths} isDateDisabled={isWeekend} />;
}

export function CalendarLocale() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
      <Calendar locale="en-US" />
      <Calendar locale="ar-EG" dir="rtl" previousMonthLabel="الشهر السابق" nextMonthLabel="الشهر التالي" />
    </div>
  );
}
