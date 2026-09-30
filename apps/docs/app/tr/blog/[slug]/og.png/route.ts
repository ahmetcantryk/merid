import { getEntry } from "@/lib/content";
import { entryParams } from "@/lib/content/routes";
import { renderTitleOgImage } from "@/lib/og";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return entryParams("post", "tr");
}

/** Open Graph image at a stable URL (`<page>/og.png`), so metadata and JSON-LD can both point at it. */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const entry = getEntry("post", "tr", (await params).slug);
  if (!entry) return new Response("Not found", { status: 404 });
  return renderTitleOgImage({ title: entry.title, label: "meridui.dev/tr/blog" });
}
