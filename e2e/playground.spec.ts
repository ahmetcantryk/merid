import { expect, test, type Locator, type Page } from "@playwright/test";
import { gotoThemed } from "./helpers";

// The playground scopes theme, accent and density to its stage via data attributes;
// each control must change the computed custom properties inside that subtree.

function cssVar(node: Locator, name: string): Promise<string> {
  return node.evaluate((el, prop) => getComputedStyle(el).getPropertyValue(prop).trim().toLowerCase(), name);
}

async function openPlayground(page: Page) {
  await gotoThemed(page, "/", "light");
  const pg = page.locator(".pg");
  await pg.scrollIntoViewIfNeeded();
  return { pg, stage: pg.locator(".pg__stage[data-layer=\"main\"]") };
}

test.describe("landing playground", () => {
  test("theme control switches the stage surface tokens", async ({ page }) => {
    const { pg, stage } = await openPlayground(page);
    const theme = pg.getByRole("radiogroup", { name: "Theme" });
    const lightBg = await cssVar(stage, "--mrd-bg");
    const lightInk = await cssVar(stage, "--mrd-ink");

    await theme.getByRole("radio", { name: "Dark" }).click();
    await expect(stage).toHaveAttribute("data-theme", "dark");
    await expect.poll(() => cssVar(stage, "--mrd-bg")).not.toBe(lightBg);
    await expect.poll(() => cssVar(stage, "--mrd-ink")).not.toBe(lightInk);

    await theme.getByRole("radio", { name: "Light" }).click();
    await expect(stage).toHaveAttribute("data-theme", "light");
    await expect.poll(() => cssVar(stage, "--mrd-bg")).toBe(lightBg);
  });

  test("accent swatches change --mrd-accent on the stage", async ({ page }) => {
    const { pg, stage } = await openPlayground(page);
    const swatches = pg.locator(".studio-swatches").getByRole("radio");
    const count = await swatches.count();
    expect(count).toBeGreaterThan(1);
    const seen = new Set([await cssVar(stage, "--mrd-accent")]);
    for (let i = 1; i < count; i += 1) {
      const swatch = swatches.nth(i);
      await swatch.click();
      await expect(swatch).toHaveAttribute("aria-checked", "true");
      await expect(stage).toHaveAttribute("data-accent", (await swatch.getAttribute("data-accent")) ?? "");
      const value = await cssVar(stage, "--mrd-accent");
      expect(seen.has(value), `accent ${i} should produce a new --mrd-accent (got ${value})`).toBe(false);
      seen.add(value);
    }
  });

  test("density control changes control height tokens and rendered size", async ({ page }, testInfo) => {
    // tokens.css applies density on fine pointers only; coarse pointers keep 40px+ touch targets.
    const coarse = testInfo.project.use.hasTouch === true;
    const { pg, stage } = await openPlayground(page);
    const density = pg.getByRole("radiogroup", { name: "Density" });
    const options = density.getByRole("radio");
    const heights = new Set<string>();
    for (let i = 0; i < (await options.count()); i += 1) {
      await options.nth(i).click();
      await expect(options.nth(i)).toBeChecked();
      const token = await cssVar(stage, "--mrd-control-md");
      heights.add(token);
      const button = stage.getByRole("button", { name: "Save changes" });
      const rendered = await button.evaluate((el) => el.getBoundingClientRect().height);
      expect(rendered).toBeCloseTo(Number.parseFloat(token), 0);
    }
    if (coarse) {
      expect(heights.size).toBe(1);
      expect(Number.parseFloat([...heights][0] ?? "0")).toBeGreaterThanOrEqual(40);
    } else {
      expect(heights.size).toBe(await options.count());
    }
  });

  test("radius and type scale write token overrides and the CSS diff", async ({ page }) => {
    const { pg, stage } = await openPlayground(page);
    await expect(pg.getByText(/Defaults./)).toBeVisible();
    await pg.getByRole("radiogroup", { name: "Radius" }).getByRole("radio", { name: "None" }).click();
    await expect.poll(() => cssVar(stage, "--mrd-radius-lg")).toBe("0px");
    await pg.getByRole("radiogroup", { name: "Type scale" }).getByRole("radio", { name: "110%" }).click();
    await expect.poll(() => cssVar(stage, "--mrd-text-md")).toBe("16.5px");
    const diff = pg.locator(".studio-diff");
    await expect(diff.locator('[data-sign="+"]', { hasText: "--mrd-radius-lg: 0px;" })).toBeVisible();
    await expect(diff.getByRole("button", { name: "Copy CSS" })).toBeVisible();
  });

  test("split mode renders a dark copy behind a meridian and hides it from assistive tech", async ({ page }) => {
    const { pg } = await openPlayground(page);
    await pg.getByRole("radiogroup", { name: "Theme" }).getByRole("radio", { name: "Split" }).click();
    const mirror = pg.locator('.pg__stage[data-layer="mirror"]');
    await expect(mirror).toHaveAttribute("data-theme", "dark");
    await expect(mirror.locator(".studio-app")).toHaveAttribute("aria-hidden", "true");
    await expect(pg.locator(".studio-meridian")).toBeVisible();
    const slider = pg.getByRole("slider", { name: /Meridian/ });
    await slider.fill("30");
    await expect.poll(() => pg.locator(".studio-window__viewport").evaluate((el) => (el as HTMLElement).style.getPropertyValue("--split"))).toBe("30%");
  });
});

