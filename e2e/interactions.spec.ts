import { expect, test } from "@playwright/test";
import { gotoThemed, preview } from "./helpers";

test.describe("live preview interactions", () => {
  test("Dialog: opens, traps focus, closes on Escape, returns focus", async ({ page }) => {
    await gotoThemed(page, "/docs/components/dialog", "light");
    const trigger = preview(page).getByRole("button", { name: "Edit profile" });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Edit profile" });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("aria-modal", "true");

    for (let i = 0; i < 8; i += 1) {
      await page.keyboard.press("Tab");
      expect(await dialog.evaluate((node) => node.contains(document.activeElement))).toBe(true);
    }
    for (let i = 0; i < 4; i += 1) {
      await page.keyboard.press("Shift+Tab");
      expect(await dialog.evaluate((node) => node.contains(document.activeElement))).toBe(true);
    }

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("Select inside an open Dialog: list layers above the backdrop and an option is clickable", async ({ page }) => {
    await gotoThemed(page, "/docs/components/dialog", "light");
    await preview(page).getByRole("button", { name: "Edit profile" }).click();
    const dialog = page.getByRole("dialog", { name: "Edit profile" });
    await expect(dialog).toBeVisible();
    const trigger = dialog.getByRole("combobox", { name: "Role" });
    await expect(trigger).toContainText("Editor");
    await trigger.click();
    const listbox = page.getByRole("listbox");
    await expect(listbox).toBeVisible();
    // A real pointer click: fails if the backdrop (or anything else) covers the option.
    await page.getByRole("option", { name: "Admin" }).click();
    await expect(listbox).toBeHidden();
    await expect(trigger).toContainText("Admin");
    await expect(dialog).toBeVisible();
    await expect(trigger).toBeFocused();
  });

  test("DropdownMenu: keyboard open, arrow navigation skips disabled, Enter selects", async ({ page }) => {
    await gotoThemed(page, "/docs/components/dropdown-menu", "light");
    const stage = preview(page);
    const trigger = stage.getByRole("button", { name: "Actions" });
    await trigger.focus();
    await page.keyboard.press("Enter");
    const menu = page.getByRole("menu");
    await expect(menu).toBeVisible();
    await expect(page.getByRole("menuitem", { name: /Edit/ })).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("menuitem", { name: /Duplicate/ })).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("menuitem", { name: /Archive/ })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(menu).toBeHidden();
    await expect(stage.getByText("Last action: Archive")).toBeVisible();
    await expect(trigger).toBeFocused();

    await page.keyboard.press("ArrowDown");
    await expect(menu).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("Select: keyboard choose updates trigger and form value", async ({ page }) => {
    await gotoThemed(page, "/docs/components/select", "light");
    const stage = preview(page);
    const trigger = stage.getByRole("combobox");
    await expect(trigger).toContainText("EU West");
    const hidden = stage.locator('input[name="region"]');
    await expect(hidden).toHaveValue("eu-west");

    await trigger.focus();
    await page.keyboard.press("Enter");
    const listbox = page.getByRole("listbox");
    await expect(listbox).toBeVisible();
    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("Enter");
    await expect(listbox).toBeHidden();
    await expect(trigger).toContainText("US West");
    await expect(hidden).toHaveValue("us-west");
    await expect(trigger).toBeFocused();
  });

  test("Tabs: arrow keys move selection and skip disabled", async ({ page }) => {
    await gotoThemed(page, "/docs/components/tabs", "light");
    const stage = preview(page);
    const overview = stage.getByRole("tab", { name: "Overview" });
    await overview.click();
    await page.keyboard.press("ArrowRight");
    const activity = stage.getByRole("tab", { name: "Activity" });
    await expect(activity).toBeFocused();
    await expect(activity).toHaveAttribute("aria-selected", "true");
    await expect(stage.getByRole("tabpanel")).toContainText("pull requests");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await expect(overview).toBeFocused();
    await page.keyboard.press("End");
    await expect(stage.getByRole("tab", { name: "Settings" })).toBeFocused();
  });

  test("Accordion: toggles with click and keyboard", async ({ page }) => {
    await gotoThemed(page, "/docs/components/accordion", "light");
    const stage = preview(page);
    const billing = stage.getByRole("button", { name: "How does billing work?" });
    const exportBtn = stage.getByRole("button", { name: "Can I export my data?" });
    await expect(billing).toHaveAttribute("aria-expanded", "true");
    await exportBtn.click();
    await expect(exportBtn).toHaveAttribute("aria-expanded", "true");
    await expect(billing).toHaveAttribute("aria-expanded", "false");
    await expect(stage.getByText("Export any workspace")).toBeVisible();
    await exportBtn.focus();
    await page.keyboard.press("Enter");
    await expect(exportBtn).toHaveAttribute("aria-expanded", "false");
  });

  test("Tooltip: shows on hover and on keyboard focus, hides on Escape", async ({ page }) => {
    await gotoThemed(page, "/docs/components/tooltip", "light");
    const trigger = preview(page).getByRole("button", { name: "Copy link" });
    const tip = page.getByRole("tooltip");
    await trigger.hover();
    await expect(tip).toHaveText("Copies the link to your clipboard");
    await page.mouse.move(0, 0);
    await expect(tip).toBeHidden();

    await trigger.focus();
    await expect(tip).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-describedby", /.+/);
    await page.keyboard.press("Escape");
    await expect(tip).toBeHidden();
  });

  test("Toast: announces and dismisses", async ({ page }) => {
    await gotoThemed(page, "/docs/components/toast", "light");
    await preview(page).getByRole("button", { name: "Save changes" }).click();
    const region = page.locator(".mrd-toast-region [aria-live=polite]");
    const toast = region.locator(".mrd-toast").filter({ hasText: "Changes saved" });
    await expect(toast).toBeVisible();
    await toast.getByRole("button", { name: "Dismiss notification" }).click();
    await expect(toast).toBeHidden();
  });

  test("Switch, Checkbox, Radio respond to keyboard", async ({ page }) => {
    await gotoThemed(page, "/docs/components/switch", "light");
    const sw = preview(page).getByRole("switch", { name: "Dark mode" });
    await expect(sw).toBeChecked();
    await sw.focus();
    await page.keyboard.press("Space");
    await expect(sw).not.toBeChecked();

    await gotoThemed(page, "/docs/components/checkbox", "light");
    const cb = preview(page).getByRole("checkbox", { name: /product updates/ });
    await expect(cb).toBeChecked();
    await cb.focus();
    await page.keyboard.press("Space");
    await expect(cb).not.toBeChecked();

    await gotoThemed(page, "/docs/components/radio", "light");
    const stage = preview(page);
    await stage.getByRole("radio", { name: "Team" }).focus();
    await page.keyboard.press("ArrowDown");
    await expect(stage.getByRole("radio", { name: "Business" })).toBeChecked();
    await expect(stage.getByRole("radio", { name: "Business" })).toBeFocused();
  });

  test("SegmentedControl: click and arrow keys change the value", async ({ page }) => {
    await gotoThemed(page, "/docs/components/segmented-control", "light");
    const stage = preview(page);
    const week = stage.getByRole("radio", { name: "Week" });
    await expect(week).toBeChecked();
    await stage.getByRole("radio", { name: "Day" }).click();
    await expect(stage.getByRole("radio", { name: "Day" })).toBeChecked();
    await page.keyboard.press("ArrowRight");
    await expect(week).toBeChecked();
    await expect(week).toBeFocused();
  });

  test("Command: filter, arrow keys and Enter run a command; the dialog opens from its shortcut", async ({ page }) => {
    await gotoThemed(page, "/docs/components/command", "light");
    const stage = preview(page);
    const input = stage.getByRole("combobox", { name: "Command menu" });
    await input.fill("proj");
    await expect(stage.getByRole("option")).toHaveCount(2);
    await page.keyboard.press("ArrowDown");
    await expect(stage.getByRole("option", { name: /New project/ })).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("Enter");
    await expect(stage.getByText("Last command: New project")).toBeVisible();

    await preview(page, 1).getByRole("button", { name: /Open command menu/ }).click();
    const dialog = page.getByRole("dialog", { name: "Command menu" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("combobox")).toBeFocused();
    await page.keyboard.type("dark");
    await page.keyboard.press("Enter");
    await expect(dialog).toBeHidden();
    await expect(preview(page, 1).getByText("Last command: Dark theme")).toBeVisible();
    await page.keyboard.press("ControlOrMeta+j");
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("ContextMenu: right-click opens at the pointer; Escape closes and restores focus", async ({ page }) => {
    await gotoThemed(page, "/docs/components/context-menu", "light");
    const stage = preview(page);
    await stage.getByText("Right-click here").click({ button: "right" });
    const menu = page.getByRole("menu", { name: "File actions" });
    await expect(menu).toBeVisible();
    await expect(page.getByRole("menuitem", { name: /Open/ })).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(menu).toBeHidden();
    await expect(stage.getByText("Last action: Rename")).toBeVisible();

    const file = stage.getByRole("button", { name: "quarterly-report.pdf" });
    await file.click({ button: "right" });
    await expect(menu).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    // Focus returns to what had it before the menu opened: the right-clicked button.
    await expect(file).toBeFocused();
  });

  test("NavigationMenu: ArrowDown opens a panel on its first link; Escape returns to the trigger", async ({ page }) => {
    await gotoThemed(page, "/docs/components/navigation-menu", "light");
    const stage = preview(page);
    const trigger = stage.getByRole("button", { name: "Products" });
    await trigger.focus();
    await page.keyboard.press("ArrowDown");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(stage.getByRole("link", { name: /Analytics/ })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(stage.getByRole("button", { name: "Resources" })).toBeFocused();
  });

  test("Toolbar: one Tab stop, arrow keys move between controls", async ({ page }) => {
    await gotoThemed(page, "/docs/components/toolbar", "light");
    const stage = preview(page);
    await stage.getByRole("button", { name: "Bold" }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(stage.getByRole("button", { name: "Italic" })).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(stage.getByRole("button", { name: /Align/ })).toBeFocused();
    await page.keyboard.press("End");
    await expect(stage.getByRole("link", { name: "Help" })).toBeFocused();
    await expect(stage.locator('[role="toolbar"] [tabindex="0"]')).toHaveCount(1);
  });

  test("DataTable: sort, search and select rows", async ({ page }) => {
    await gotoThemed(page, "/docs/components/data-table", "light");
    const stage = preview(page);
    const header = stage.getByRole("columnheader", { name: "Projects" });
    await header.getByRole("button").click();
    await expect(header).toHaveAttribute("aria-sort", "ascending");
    await stage.getByRole("searchbox", { name: "Search" }).fill("admin");
    await expect(stage.getByRole("status")).toHaveText("2 results");
    await stage.getByRole("checkbox", { name: "Select all rows on this page" }).check();
    await expect(stage.getByRole("status")).toHaveText("2 of 9 selected");
  });
});
