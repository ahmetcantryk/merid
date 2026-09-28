import { expect, test } from "@playwright/test";
import { THEMES, gotoThemed, preview } from "./helpers";

// First live preview of each key component page. Baselines live in e2e/__screenshots__.
// Regenerate after an intended visual change: npm run test:visual -- --update-snapshots
const KEY_PREVIEWS = [
  "button",
  "badge",
  "alert",
  "card",
  "input",
  "field",
  "checkbox",
  "radio",
  "switch",
  "segmented-control",
  "select",
  "tabs",
  "accordion",
  "avatar",
  "progress",
  "table",
  "pagination",
  "stepper",
  "breadcrumb",
  "empty-state",
] as const;

for (const theme of THEMES) {
  test.describe(`visual (${theme})`, () => {
    for (const name of KEY_PREVIEWS) {
      test(name, async ({ page }) => {
        await gotoThemed(page, `/docs/components/${name}`, theme);
        const stage = preview(page);
        await stage.scrollIntoViewIfNeeded();
        await page.mouse.move(0, 0);
        await expect(stage).toHaveScreenshot(`${name}-${theme}.png`);
      });
    }

    test("dialog open", async ({ page }) => {
      await gotoThemed(page, "/docs/components/dialog", theme);
      await preview(page).getByRole("button", { name: "Edit profile" }).click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveScreenshot(`dialog-open-${theme}.png`);
    });
  });
}
