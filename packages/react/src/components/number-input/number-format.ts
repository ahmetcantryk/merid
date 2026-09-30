/** Locale-aware formatting and parsing helpers for NumberInput. Pure; no DOM. */

export interface NumberParser {
  format: (value: number) => string;
  parse: (text: string) => number | null;
}

/** Builds a formatter/parser pair for a locale and `Intl.NumberFormat` options. */
export function createNumberParser(locale: string | undefined, options: Intl.NumberFormatOptions = {}): NumberParser {
  const formatter = new Intl.NumberFormat(locale, options);
  const parts = new Intl.NumberFormat(locale).formatToParts(-12345.6);
  const group = parts.find((p) => p.type === "group")?.value ?? ",";
  const decimal = parts.find((p) => p.type === "decimal")?.value ?? ".";
  const minus = parts.find((p) => p.type === "minusSign")?.value ?? "-";
  const percent = options.style === "percent";

  const parse = (text: string): number | null => {
    let s = text.trim();
    if (s === "") return null;
    // Group separators are often non-breaking spaces; treat any space as a group separator too.
    s = s.split(group).join("").replace(/\s/g, "");
    s = s.split(decimal).join(".");
    s = s.split(minus).join("-").replace(/[−]/g, "-");
    s = s.replace(/[^0-9.-]/g, "");
    const negative = s.startsWith("-");
    s = s.replace(/-/g, "");
    if (s === "" || s === ".") return null;
    const n = Number.parseFloat(s);
    if (!Number.isFinite(n)) return null;
    const signed = negative ? -n : n;
    return percent ? signed / 100 : signed;
  };

  return { format: (value) => formatter.format(value), parse };
}

/** Number of decimals in `n` (`0.25` → 2). */
export function decimalsOf(n: number): number {
  if (!Number.isFinite(n)) return 0;
  const text = String(n);
  const e = /e-(\d+)$/.exec(text);
  if (e) return Number(e[1]);
  const dot = text.indexOf(".");
  return dot === -1 ? 0 : text.length - dot - 1;
}

/** Clamps to [min, max] and removes floating-point noise at the step's precision. */
export function clampValue(value: number, min: number, max: number, precision: number): number {
  const clamped = Math.min(max, Math.max(min, value));
  return Number(clamped.toFixed(Math.min(precision, 20)));
}
