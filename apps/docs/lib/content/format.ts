import type { Locale } from "@/lib/i18n/config";

const FORMATS: Record<Locale, Intl.DateTimeFormat> = {
  en: new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }),
  tr: new Intl.DateTimeFormat("tr-TR", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }),
};

/** `2026-10-16` as `Oct 16, 2026` (en) or `16 Ekim 2026` (tr). Dates are calendar days, so UTC avoids a shift. */
export function formatDate(iso: string, locale: Locale): string {
  return FORMATS[locale].format(new Date(`${iso}T00:00:00Z`));
}
