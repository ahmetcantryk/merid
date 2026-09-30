import { expect, test, type Page } from "@playwright/test";

const SITE = "https://meridui.dev";

async function jsonLdTypes(page: Page): Promise<string[]> {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  return blocks.flatMap((text) => {
    const data = JSON.parse(text) as Record<string, unknown> | Record<string, unknown>[];
    return (Array.isArray(data) ? data : [data]).map((d) => String(d["@type"]));
  });
}

test.describe("launch content and SEO", () => {
  test("home has Organization, WebSite with SearchAction and SoftwareSourceCode", async ({ page }) => {
    await page.goto("/");
    expect(await jsonLdTypes(page)).toEqual(expect.arrayContaining(["Organization", "WebSite", "SoftwareSourceCode"]));
    const website = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(website).toContain("SearchAction");
  });

  test("blog post: canonical, hreflang, article schema, OG image, single h1", async ({ page }) => {
    const path = "/blog/best-react-component-libraries-ai-coding-2026";
    await page.goto(path);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${SITE}${path}`);
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute("href", `${SITE}${path}`);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", `${SITE}${path}/og.png`);
    expect(await jsonLdTypes(page)).toEqual(expect.arrayContaining(["BlogPosting", "BreadcrumbList"]));
    await expect(page.locator("h1")).toHaveCount(1);
    const og = await page.request.get(`${path}/og.png`);
    expect(og.headers()["content-type"]).toContain("image/png");
  });

  test("docs pages carry a BreadcrumbList", async ({ page }) => {
    await page.goto("/docs/components/button");
    expect(await jsonLdTypes(page)).toContain("BreadcrumbList");
  });

  test("scheduled posts are hidden and links to them are plain text", async ({ page }) => {
    expect((await page.request.get("/blog/mui-alternatives")).status()).toBe(404);
    await page.goto("/blog/best-react-component-libraries-ai-coding-2026");
    await expect(page.locator('a[href="/blog/mui-alternatives"]')).toHaveCount(0);
  });

  test("RSS feeds and sitemap list the published content", async ({ page }) => {
    const rss = await (await page.request.get("/blog/rss.xml")).text();
    expect(rss).toContain("<rss");
    expect(rss).toContain(`${SITE}/blog/best-react-component-libraries-ai-coding-2026`);
    expect((await page.request.get("/tr/blog/rss.xml")).status()).toBe(200);
    const sitemap = await (await page.request.get("/sitemap.xml")).text();
    expect(sitemap).toContain(`${SITE}/compare/shadcn-ui-vs-merid`);
    expect(sitemap).toContain('hreflang="tr" href="https://meridui.dev/tr/compare/shadcn-ui-vs-merid"');
    expect(sitemap).not.toContain("/blog/mui-alternatives");
  });

  test("language switch on an untranslated post goes to the other blog, on privacy to gizlilik", async ({ page }) => {
    await page.goto("/blog/best-react-component-libraries-ai-coding-2026");
    await expect(page.locator(".lang-switch")).toHaveAttribute("href", "/tr/blog");
    await page.goto("/privacy");
    await expect(page.locator(".lang-switch")).toHaveAttribute("href", "/tr/gizlilik");
  });
});
