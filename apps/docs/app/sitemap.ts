import type { MetadataRoute } from "next";
import { flatNav } from "@/lib/nav";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(site.releaseDate);
  return [
    { url: site.url, lastModified, priority: 1 },
    ...flatNav.map((item) => ({ url: `${site.url}${item.href}`, lastModified, priority: 0.7 })),
  ];
}
