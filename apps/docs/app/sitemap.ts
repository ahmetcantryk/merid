import type { MetadataRoute } from "next";
import { defaultLocale, htmlLang, localizePath, locales } from "@/lib/i18n/config";
import { flatNav } from "@/lib/nav";
import { site } from "@/lib/site";

/** Every page in every locale, each listing its translations so crawlers can pair them. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(site.releaseDate);
  const paths = ["/", ...flatNav.map((item) => item.href)];
  return paths.flatMap((path) => {
    const languages: Record<string, string> = {};
    for (const locale of locales) languages[htmlLang[locale]] = `${site.url}${localizePath(path, locale)}`;
    languages["x-default"] = `${site.url}${localizePath(path, defaultLocale)}`;
    return locales.map((locale) => ({
      url: `${site.url}${localizePath(path, locale)}`,
      lastModified,
      priority: path === "/" ? 1 : 0.7,
      alternates: { languages },
    }));
  });
}
