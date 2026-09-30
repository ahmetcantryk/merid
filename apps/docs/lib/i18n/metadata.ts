import type { Metadata } from "next";
import { site } from "@/lib/site";
import { defaultLocale, htmlLang, localizePath, locales, ogLocale, type Locale } from "./config";
import { getDictionary } from "./index";

/**
 * canonical + hreflang for a locale-neutral path (`/`, `/docs/usage`). Relative URLs resolve
 * against `metadataBase` in the root layouts.
 */
export function alternatesFor(path: string, locale: Locale): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[htmlLang[l]] = localizePath(path, l);
  languages["x-default"] = localizePath(path, defaultLocale);
  return { canonical: localizePath(path, locale), languages };
}

interface PageMeta {
  readonly title: string;
  readonly description?: string;
}

/**
 * Metadata for a docs page: title, description, canonical, hreflang and Open Graph.
 * Every MDX page exports `metadata = docMetadata(locale, path, { title, description })`.
 */
export function docMetadata(locale: Locale, path: string, meta: PageMeta): Metadata {
  const dict = getDictionary(locale);
  const description = meta.description ?? dict.meta.description;
  return {
    title: meta.title,
    description,
    alternates: alternatesFor(path, locale),
    openGraph: {
      type: "article",
      siteName: site.name,
      locale: ogLocale[locale],
      title: `${meta.title} — ${site.name}`,
      description,
      url: localizePath(path, locale),
    },
  };
}

/** Root-layout metadata shared by every page of a locale. */
export function rootMetadata(locale: Locale): Metadata {
  const dict = getDictionary(locale);
  const title = `${site.name} — ${dict.meta.tagline}`;
  return {
    metadataBase: new URL(site.url),
    title: { default: title, template: `%s — ${site.name}` },
    description: dict.meta.description,
    applicationName: site.name,
    // No `alternates` here: they would be inherited by pages that forget their own (and by 404s).
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      title,
      description: dict.meta.description,
      url: localizePath("/", locale),
    },
    twitter: { card: "summary_large_image" },
  };
}
