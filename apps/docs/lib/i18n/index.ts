import type { Locale } from "./config";
import { en, type Dictionary } from "./dictionaries/en";
import { tr } from "./dictionaries/tr";

export type { Dictionary } from "./dictionaries/en";
export * from "./config";

const DICTIONARIES: Record<Locale, Dictionary> = { en, tr };

/** UI strings for a locale. Dictionaries are small and static, so they are bundled rather than loaded lazily. */
export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}
