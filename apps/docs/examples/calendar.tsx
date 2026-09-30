"use client";

import { useState } from "react";
import { Calendar, type DateRange } from "@meridui/react";

const note = { fontSize: 13, color: "var(--mrd-muted)" } as const;
const col = { display: "grid", gap: 8, justifyItems: "center" } as const;

export function CalendarBasic() {
  const [date, setDate] = useState<Date | null>(null);
  return (
    <div style={col}>
      <Calendar value={date} onValueChange={setDate} />
      <span style={note}>{date ? date.toDateString() : "No date selected"}</span>
    </div>
  );
}

export function CalendarRange() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <div style={col}>
      <Calendar mode="range" value={range} onValueChange={setRange} />
      <span style={note}>
        {range.start ? range.start.toDateString() : "…"} – {range.end ? range.end.toDateString() : "…"}
      </span>
    </div>
  );
}

const today = new Date();
const inTwoMonths = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate());
const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;

export function CalendarConstraints() {
  return <Calendar min={today} max={inTwoMonths} isDateDisabled={isWeekend} />;
}

export function CalendarLocale() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
      <Calendar locale="de-DE" previousMonthLabel="Vorheriger Monat" nextMonthLabel="Nächster Monat" />
      <Calendar locale="ar-EG" dir="rtl" />
    </div>
  );
}
