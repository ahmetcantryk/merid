import type { Page } from "@playwright/test";

export type Theme = "light" | "dark";
export const THEMES: readonly Theme[] = ["light", "dark"];

/** Loads a page with a fixed theme, set before hydration so there is no flash. */
export async function gotoThemed(page: Page, path: string, theme: Theme): Promise<void> {
  await page.addInitScript((t) => {
    try {
      window.localStorage.setItem("merid-theme", t);
    } catch {
      /* storage unavailable */
    }
    document.documentElement.setAttribute("data-theme", t);
  }, theme);
  await page.goto(path, { waitUntil: "networkidle" });
  await page.evaluate((t) => document.documentElement.setAttribute("data-theme", t), theme);
  await page.evaluate(() => document.fonts.ready);
}

/** The live-preview stage of the nth ComponentPreview on the page. */
export function preview(page: Page, index = 0) {
  return page.locator(".preview__stage").nth(index);
}
