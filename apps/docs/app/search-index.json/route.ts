import { readFile } from "node:fs/promises";
import path from "node:path";
import { docsNav } from "@/lib/nav";
import type { SearchEntry } from "@/lib/search";
import { slugify } from "@/lib/slug";

export const dynamic = "force-static";

const HEADING = /^(#{2,3})\s+(.+?)\s*$/;

async function headingsOf(href: string): Promise<string[]> {
  const file = path.join(process.cwd(), "app", ...href.split("/").filter(Boolean), "page.mdx");
  try {
    const source = await readFile(file, "utf8");
    const withoutCode = source.replace(/```[\s\S]*?```/g, "");
    return withoutCode
      .split(/\r?\n/)
      .map((line) => HEADING.exec(line)?.[2])
      .filter((h): h is string => Boolean(h))
      .map((h) => h.replace(/`/g, ""));
  } catch (error) {
    console.error(`[docs] search index: could not read ${file}`, error);
    return [];
  }
}

export async function GET() {
  const entries: SearchEntry[] = [];
  for (const group of docsNav) {
    for (const item of group.items) {
      entries.push({ title: item.title, href: item.href, page: item.title, group: group.title, section: false });
      for (const heading of await headingsOf(item.href)) {
        entries.push({
          title: heading,
          href: `${item.href}#${slugify(heading)}`,
          page: item.title,
          group: group.title,
          section: true,
        });
      }
    }
  }
  return Response.json(entries);
}
