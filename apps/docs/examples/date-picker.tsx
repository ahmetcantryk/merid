"use client";

import { useState } from "react";
import { DatePicker, Field, type DateRange } from "@meridui/react";

const stack = { display: "grid", gap: 8, width: 280 } as const;
const note = { fontSize: 13, color: "var(--mrd-muted)" } as const;

export function DatePickerBasic() {
  const [date, setDate] = useState<Date | null>(null);
  return (
    <div style={stack}>
      <Field label="Due date" description="Type MM/DD/YYYY or pick from the calendar.">
        <DatePicker value={date} onValueChange={setDate} name="due" />
      </Field>
      <span style={note}>value: {date ? date.toDateString() : "null"}</span>
    </div>
  );
}

export function DatePickerRange() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <div style={{ ...stack, width: 320 }}>
      <Field label="Stay">
        <DatePicker mode="range" value={range} onValueChange={setRange} startLabel="Check-in" endLabel="Check-out" />
      </Field>
    </div>
  );
}

const today = new Date();
const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;

export function DatePickerConstraints() {
  return (
    <div style={stack}>
      <Field label="Delivery day" description="Weekdays only, from today.">
        <DatePicker min={today} isDateDisabled={isWeekend} />
      </Field>
    </div>
  );
}

export function DatePickerStates() {
  return (
    <div style={stack}>
      <DatePicker aria-label="Small" size="sm" />
      <DatePicker aria-label="Invalid" invalid />
      <DatePicker aria-label="Disabled" disabled defaultValue={today} />
    </div>
  );
}
