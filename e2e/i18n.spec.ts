import { expect, test } from "@playwright/test";
import { toTurkish } from "./routes";

const SITE = "https://meridui.dev";
const abs = (p: string) => (p === "/" ? SITE : `${SITE}${p}`);
const SAMPLES = ["/", "/docs/introduction", "/docs/components/button", "/docs/foundations/color"] as const;

for (const route of SAMPLES) {
  const tr = toTurkish(route);

  test(`lang, canonical and hreflang: ${route}`, async ({ page }) => {
    for (const [path, lang] of [[route, "en"], [tr, "tr"]] as const) {
      await page.goto(path);
      await expect(page.locator("html")).toHaveAttribute("lang", lang);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", abs(path));
      await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute("href", abs(route));
      await expect(page.locator('link[rel="alternate"][hreflang="tr"]')).toHaveAttribute("href", abs(tr));
      await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute("href", abs(route));
    }
  });

  test(`language switcher keeps the page: ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.locator(".lang-switch").click();
    await expect(page).toHaveURL(new RegExp(`${tr.replace(/\//g, "\\/")}$`));
    await expect(page.locator("html")).toHaveAttribute("lang", "tr");
    await page.locator(".lang-switch").click();
    await expect(page).toHaveURL(new RegExp(`${route === "/" ? "\\/" : route.replace(/\//g, "\\/")}$`));
  });
}

test("Turkish chrome is localized", async ({ page }) => {
  await page.goto("/tr/docs/components/button");
  await expect(page.getByRole("navigation", { name: "Ana menü" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Önizleme" }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Değişiklikleri kaydet" }).first()).toBeVisible();
});
