// @vitest-environment node
import { renderToString } from "react-dom/server";
import { componentCases, nonComponentExports } from "../fixtures";

const caseNames = Object.keys(componentCases).map((name) => name.split(" ")[0]);

describe("server rendering (node, no DOM)", () => {
  it("runs without a DOM", () => {
    expect(typeof window).toBe("undefined");
    expect(typeof document).toBe("undefined");
  });

  it("importing the package touches no browser globals", async () => {
    const mod = await import("../../src");
    expect(Object.keys(mod).length).toBeGreaterThan(40);
  });

  it("every exported component has an SSR case", async () => {
    const mod = await import("../../src");
    const missing = Object.keys(mod).filter((name) => !nonComponentExports.has(name) && !caseNames.includes(name));
    expect(missing).toEqual([]);
  });

  for (const [name, make] of Object.entries(componentCases)) {
    it(`renderToString <${name}>`, () => {
      expect(typeof renderToString(make())).toBe("string");
    });
  }
});
