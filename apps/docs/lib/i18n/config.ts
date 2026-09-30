/**
 * Locale routing for the docs site.
 *
 * English is the default and keeps the unprefixed URLs (`/`, `/docs/...`); Turkish lives under
 * `/tr` (`/tr`, `/tr/docs/...`). Each locale is its own root layout (`app/(en)/layout.tsx`,
 * `app/tr/layout.tsx`), so `<html lang>` is right in the static HTML and no proxy or rewrite
 * runs on requests.
 */
export const locales = ["en", "tr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

const PREFIX: Record<Locale, string> = { en: "", tr: "/tr" };

/** BCP 47 tag for `<html lang>` and `hreflang`. */
export const htmlLang: Record<Locale, string> = { en: "en", tr: "tr" };

/** Open Graph locale (`og:locale`). */
export const ogLocale: Record<Locale, string> = { en: "en_US", tr: "tr_TR" };

/** Locale implied by a pathname: `/tr` and `/tr/...` are Turkish, everything else is English. */
export function localeFromPath(pathname: string): Locale {
  for (const locale of locales) {
    const prefix = PREFIX[locale];
    if (prefix && (pathname === prefix || pathname.startsWith(`${prefix}/`))) return locale;
  }
  return defaultLocale;
}

/** Removes the locale prefix: `/tr/docs/usage` becomes `/docs/usage`, `/tr` becomes `/`. */
export function stripLocale(pathname: string): string {
  const prefix = PREFIX[localeFromPath(pathname)];
  if (!prefix) return pathname || "/";
  const rest = pathname.slice(prefix.length);
  return rest === "" ? "/" : rest;
}

/** Adds the locale prefix to a locale-neutral path (`/docs/usage`, `/`). Hash-only links are left alone. */
export function localizePath(path: string, locale: Locale): string {
  const prefix = PREFIX[locale];
  if (!prefix || path.startsWith("#")) return path;
  if (path === "/") return prefix;
  return `${prefix}${path}`;
}

/** The same page in another locale. Heading anchors differ per language, so any hash is dropped. */
export function switchLocalePath(pathname: string, target: Locale): string {
  return localizePath(stripLocale(pathname.split("#")[0] ?? "/"), target);
}
