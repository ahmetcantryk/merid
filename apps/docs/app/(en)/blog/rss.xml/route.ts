import { rssFeed } from "@/lib/content/rss";

export const dynamic = "force-static";

export function GET() {
  return rssFeed("en");
}
