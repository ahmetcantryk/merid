"use client";

import { usePathname } from "next/navigation";
import { localeFromPath, type Locale } from "./config";
import { getDictionary, type Dictionary } from "./index";

/**
 * Locale of the current page, read from the URL. Works during SSR as well, so client
 * components render the right language in the static HTML without a provider.
 */
export function useLocale(): Locale {
  return localeFromPath(usePathname() ?? "/");
}

export function useDictionary(): Dictionary {
  return getDictionary(useLocale());
}
