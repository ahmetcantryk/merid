import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { readWoff2 } from "./woff2";

const root = join(__dirname, "..");
const fontsDir = join(root, "fonts");
const tokens = readFileSync(join(root, "styles", "tokens.css"), "utf8");

interface Face {
  readonly family: string;
  readonly file: string;
  readonly weight: readonly [number, number];
  readonly stretch: readonly [number, number] | undefined;
  readonly ranges: readonly (readonly [number, number])[];
}

function parseFace(body: string): Face {
  const family = /font-family:\s*"?([^";]+?)"?;/.exec(body)?.[1];
  const file = /url\("\.\.\/fonts\/([^"]+)"\)/.exec(body)?.[1];
  const weight = /font-weight:\s*(\d+)\s+(\d+);/.exec(body);
  const stretch = /font-stretch:\s*(\d+)%\s+(\d+)%;/.exec(body);
  const range = /unicode-range:\s*([^;]+);/.exec(body)?.[1];
  if (!family || !file || !weight || !range) throw new Error(`incomplete @font-face: ${body}`);
  const ranges = range.split(",").map((part) => {
    const [from, to] = part.trim().replace(/^U\+/i, "").split("-");
    return [parseInt(from ?? "", 16), parseInt(to ?? from ?? "", 16)] as const;
  });
  return {
    family,
    file,
    weight: [Number(weight[1]), Number(weight[2])],
    stretch: stretch ? [Number(stretch[1]), Number(stretch[2])] : undefined,
    ranges,
  };
}

const faces = [...tokens.matchAll(/@font-face\s*\{([^}]*)\}/g)].map((m) => parseFace(m[1] ?? ""));
const fonts = new Map(faces.map((f) => [f.file, readWoff2(readFileSync(join(fontsDir, f.file)))]));

/** The face a browser uses for a code point: among overlapping unicode-ranges, the last one declared wins. */
function faceFor(family: string, codePoint: number): Face | undefined {
  return faces.filter((f) => f.family === family && f.ranges.some(([a, b]) => codePoint >= a && codePoint <= b)).at(-1);
}

// Turkish letters (with the circumflex vowels of loanwords), the lira sign, and the prime marks used in coordinates.
const MUST_RENDER = [..."ğĞşŞıİçÇöÖüÜâÂîÎûÛ₺′″", ..."AZaz09&@"];
const FAMILIES = ["Archivo", "Chivo Mono"];

describe("bundled fonts", () => {
  it("declares Archivo and Chivo Mono, each as a latin and a latin-ext file", () => {
    expect(faces.map((f) => `${f.family}: ${f.file}`)).toEqual([
      "Archivo: Archivo-latin-ext.woff2",
      "Archivo: Archivo-latin.woff2",
      "Chivo Mono: ChivoMono-latin-ext.woff2",
      "Chivo Mono: ChivoMono-latin.woff2",
    ]);
  });

  it("ships exactly the files the CSS asks for, plus an OFL licence per family", () => {
    const shipped = readdirSync(fontsDir).sort();
    expect(shipped.filter((f) => f.endsWith(".woff2"))).toEqual(faces.map((f) => f.file).sort());
    expect(shipped.filter((f) => f.endsWith(".txt"))).toEqual(["ARCHIVO-OFL.txt", "CHIVO-MONO-OFL.txt"]);
    for (const licence of ["ARCHIVO-OFL.txt", "CHIVO-MONO-OFL.txt"]) {
      expect(readFileSync(join(fontsDir, licence), "utf8")).toContain("SIL Open Font License, Version 1.1");
    }
  });

  it.each(FAMILIES)("%s has a glyph for every Turkish letter and ₺ in the face that unicode-range selects", (family) => {
    const missing = MUST_RENDER.filter((ch) => {
      const cp = ch.codePointAt(0) ?? 0;
      const face = faceFor(family, cp);
      return !face || !fonts.get(face.file)?.hasGlyph(cp);
    });
    expect(missing).toEqual([]);
  });

  it("each file's variation axes match its @font-face descriptors", () => {
    for (const face of faces) {
      const axes = fonts.get(face.file)?.axes ?? [];
      const wght = axes.find((a) => a.tag === "wght");
      const wdth = axes.find((a) => a.tag === "wdth");
      expect([wght?.min, wght?.max], face.file).toEqual([...face.weight]);
      expect(wdth ? [wdth.min, wdth.max] : undefined, face.file).toEqual(face.stretch ? [...face.stretch] : undefined);
    }
  });

  it("covers the weights and widths the tokens use", () => {
    const weights = [...tokens.matchAll(/--mrd-weight-\w+:\s*(\d+);/g)].map((m) => Number(m[1]));
    const widths = [...tokens.matchAll(/--mrd-(?:display|title|label)-stretch:\s*(\d+)%;/g)].map((m) => Number(m[1]));
    expect(weights.length).toBeGreaterThan(0);
    expect(widths.length).toBeGreaterThan(0);
    for (const face of faces) {
      for (const w of weights) expect(w >= face.weight[0] && w <= face.weight[1], `${face.file} weight ${w}`).toBe(true);
    }
    for (const face of faces.filter((f) => f.family === "Archivo")) {
      for (const w of widths) expect(face.stretch && w >= face.stretch[0] && w <= face.stretch[1], `${face.file} width ${w}%`).toBe(true);
    }
  });

  it("stays lighter than the Geist pair it replaced (141 KB)", () => {
    const bytes = faces.reduce((sum, f) => sum + statSync(join(fontsDir, f.file)).size, 0);
    expect(bytes).toBeLessThan(128 * 1024);
  });
});
