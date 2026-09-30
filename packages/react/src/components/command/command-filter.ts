/** Decides whether an item matches the search. `keywords` are extra terms that also match. */
export type CommandFilter = (value: string, search: string, keywords: readonly string[]) => boolean;

const fold = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/**
 * Default filter: every whitespace-separated word of the search must appear in the value or a
 * keyword. Case- and accent-insensitive ("cafe" finds "Café").
 */
export const defaultCommandFilter: CommandFilter = (value, search, keywords) => {
  const words = fold(search).split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const haystack = fold([value, ...keywords].join(" "));
  return words.every((word) => haystack.includes(word));
};
