/** Local-time date helpers for Calendar and DatePicker. Dates are compared by calendar day only. */

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** Adds months, clamping the day to the target month's length (Jan 31 + 1 month → Feb 28/29). */
export function addMonths(date: Date, months: number): Date {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), lastDay));
}

export function isSameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  return (
    !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  );
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

/** Negative when `a` is an earlier day than `b`, 0 on the same day. */
export function compareDays(a: Date, b: Date): number {
  return startOfDay(a).getTime() - startOfDay(b).getTime();
}

export function clampDate(date: Date, min?: Date, max?: Date): Date {
  if (min && compareDays(date, min) < 0) return startOfDay(min);
  if (max && compareDays(date, max) > 0) return startOfDay(max);
  return date;
}

/** Regions whose week starts on Sunday (CLDR); used when `Intl.Locale#getWeekInfo` is unavailable. */
const SUNDAY_REGIONS = new Set([
  "US", "CA", "MX", "BR", "JP", "KR", "TW", "HK", "IL", "IN", "PH", "ZA", "SA", "AR", "CO", "PE", "VE", "AU", "NZ",
]);
const SATURDAY_REGIONS = new Set(["AE", "AF", "BH", "DZ", "EG", "IQ", "IR", "JO", "KW", "LY", "OM", "QA", "SD", "SY"]);

/** First day of the week for a locale: 0 = Sunday … 6 = Saturday. `tr-TR` → 1 (Monday), `en-US` → 0. */
export function getWeekStart(locale: string): Weekday {
  try {
    const intlLocale = new Intl.Locale(locale) as Intl.Locale & {
      getWeekInfo?: () => { firstDay: number };
      weekInfo?: { firstDay: number };
      maximize: () => Intl.Locale;
    };
    const info = intlLocale.getWeekInfo?.() ?? intlLocale.weekInfo;
    if (info) return (info.firstDay % 7) as Weekday;
    const region = intlLocale.maximize().region ?? "";
    if (SUNDAY_REGIONS.has(region)) return 0;
    if (SATURDAY_REGIONS.has(region)) return 6;
    return 1;
  } catch {
    return 0;
  }
}

/** Weeks (arrays of 7 days) covering `month`, always 6 rows so the grid height is stable. */
export function getMonthGrid(month: Date, weekStartsOn: Weekday): Date[][] {
  const first = startOfMonth(month);
  const offset = (first.getDay() - weekStartsOn + 7) % 7;
  const start = addDays(first, -offset);
  return Array.from({ length: 6 }, (_, w) => Array.from({ length: 7 }, (_, d) => addDays(start, w * 7 + d)));
}

/** Numeric date format for a locale, e.g. `30.09.2026` (tr-TR) or `09/30/2026` (en-US). */
export function formatNumericDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

/**
 * Parses a date typed in the locale's numeric order (day/month/year for tr-TR, month/day/year for en-US)
 * with any separator, or ISO `yyyy-mm-dd`. Returns `null` for anything that is not a real date.
 */
export function parseNumericDate(text: string, locale: string): Date | null {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(trimmed);
  let year: number;
  let month: number;
  let day: number;
  if (iso) {
    year = Number(iso[1]);
    month = Number(iso[2]);
    day = Number(iso[3]);
  } else {
    const numbers = trimmed.split(/[^0-9]+/).filter(Boolean).map(Number);
    if (numbers.length !== 3) return null;
    const order = new Intl.DateTimeFormat(locale, { year: "numeric", month: "2-digit", day: "2-digit" })
      .formatToParts(new Date(2000, 0, 2))
      .map((p) => p.type)
      .filter((t): t is "year" | "month" | "day" => t === "year" || t === "month" || t === "day");
    const byType: Record<string, number> = {};
    order.forEach((type, i) => {
      byType[type] = numbers[i] ?? Number.NaN;
    });
    year = byType.year ?? Number.NaN;
    month = byType.month ?? Number.NaN;
    day = byType.day ?? Number.NaN;
    if (year < 100) year += 2000;
  }
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}
