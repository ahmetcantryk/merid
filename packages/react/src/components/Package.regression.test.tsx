import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(__dirname, "..", "..");
const src = join(root, "src");

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

describe("package regressions", () => {
  it('every source file using hooks, context or event handlers starts with "use client"', () => {
    const offenders = walk(src)
      .filter((f) => /\.tsx?$/.test(f) && !/\.test\.tsx?$/.test(f))
      .filter((f) => {
        const code = readFileSync(f, "utf8");
        const interactive = /\buse[A-Z]\w*\(|\bon[A-Z]\w*=\{|createContext|useContext/.test(code);
        return interactive && !code.startsWith('"use client";');
      });
    expect(offenders).toEqual([]);
  });

  it("the built entry keeps the directive as its first line", () => {
    for (const file of ["index.js", "index.cjs"]) {
      const path = join(root, "dist", file);
      if (!existsSync(path)) continue; // built by `npm run build`
      expect(readFileSync(path, "utf8").startsWith('"use client";')).toBe(true);
    }
  });

  it("shared overlay keyframes live only in _motion.css", () => {
    const dir = join(root, "styles", "components");
    const shared = ["mrd-overlay-fade", "mrd-overlay-enter", "mrd-sheet-up", "mrd-floating-in"];
    const motion = readFileSync(join(dir, "_motion.css"), "utf8");
    for (const name of shared) {
      expect(motion).toContain(`@keyframes ${name}`);
      for (const file of readdirSync(dir).filter((f) => f !== "_motion.css")) {
        expect(readFileSync(join(dir, file), "utf8")).not.toContain(`@keyframes ${name}`);
      }
    }
  });
});
