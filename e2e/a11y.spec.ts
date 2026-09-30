import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { THEMES, gotoThemed } from "./helpers";
import { a11yRoutes, a11yRoutesTr } from "./routes";

const BLOCKING = new Set(["serious", "critical"]);
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

interface Finding {
  readonly id: string;
  readonly impact: string;
  readonly target: string;
  readonly detail: string;
}

/** A node belongs to the library when it, or a selector segment, carries an mrd- class. */
function isComponentNode(html: string, target: string): boolean {
  return /class="[^"]*\bmrd-/.test(html) || target.includes("mrd-");
}

for (const theme of THEMES) {
  test.describe(`axe (${theme})`, () => {
    for (const route of [...a11yRoutes, ...a11yRoutesTr]) {
      test(route, async ({ page }) => {
        await gotoThemed(page, route, theme);
        const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
        const component: Finding[] = [];
        const chrome: Finding[] = [];
        for (const violation of results.violations) {
          if (!BLOCKING.has(violation.impact ?? "")) continue;
          for (const node of violation.nodes) {
            const target = node.target.join(" ");
            const finding = {
              id: violation.id,
              impact: violation.impact ?? "",
              target,
              detail: node.any[0]?.message ?? violation.help,
            };
            (isComponentNode(node.html, target) ? component : chrome).push(finding);
          }
        }
        expect.soft(component, `@merid/react component violations on ${route} (${theme})`).toEqual([]);
        expect.soft(chrome, `docs-site chrome violations on ${route} (${theme})`).toEqual([]);
      });
    }
  });
}
