export interface SearchEntry {
  /** Result label: a page title or a section heading. */
  readonly title: string;
  readonly href: string;
  /** Page the entry belongs to. */
  readonly page: string;
  /** Sidebar group, e.g. "Foundations". */
  readonly group: string;
  /** True when the entry is a heading inside a page. */
  readonly section: boolean;
}

const MAX_RESULTS = 12;
const DEFAULT_RESULTS = 8;

function score(entry: SearchEntry, terms: readonly string[]): number {
  const title = entry.title.toLowerCase();
  const haystack = `${title} ${entry.page.toLowerCase()} ${entry.group.toLowerCase()}`;
  let total = 0;
  for (const term of terms) {
    if (!haystack.includes(term)) return 0;
    if (title.startsWith(term)) total += 6;
    else if (title.includes(term)) total += 3;
    else total += 1;
  }
  return entry.section ? total : total + 2;
}

export function searchIndex(entries: readonly SearchEntry[], query: string): readonly SearchEntry[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return entries.filter((e) => !e.section).slice(0, DEFAULT_RESULTS);
  return entries
    .map((entry) => ({ entry, value: score(entry, terms) }))
    .filter((r) => r.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, MAX_RESULTS)
    .map((r) => r.entry);
}
