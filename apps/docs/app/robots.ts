import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Production allows everything except machine endpoints; AI crawlers are welcome (the audience
 * builds with AI tools). Preview and local builds disallow all crawling, and `next.config.ts`
 * adds `X-Robots-Tag: noindex` to preview responses as a second guard.
 */
export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/search-index.json", "/tr/search-index.json"] }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
