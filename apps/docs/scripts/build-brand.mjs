// Builds the Merid brand assets from the clean sources in public/brand/src/:
//   wave-21/mark-{light,dark,mono}.svg, wave-21/icon{,-dark}.svg  (the wave mark and app icon)
//   wordmark.svg                                                 ("merid" outlined, baseline y = 0 in its path space)
// Writes public/brand/{mark,logo}-*.svg, app/icon.svg and lib/brand-paths.ts.
// Usage: node apps/docs/scripts/build-brand.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const docs = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(docs, "public/brand/src");
const out = join(docs, "public/brand");

const read = (p) => readFileSync(p, "utf8");
const paths = (svg) => [...svg.matchAll(/<path\b([^>]*)\/>/g)].map((m) => ({
  d: m[1].match(/\sd="([^"]*)"/)[1],
  fill: m[1].match(/fill="([^"]*)"/)?.[1],
  transform: m[1].match(/transform="([^"]*)"/)?.[1],
}));

const light = paths(read(join(src, "wave-21/mark-light.svg")));
const mono = paths(read(join(src, "wave-21/mark-mono.svg")));
const word = paths(read(join(src, "wordmark.svg")))[0];
const WAVE_VIEWBOX = "-24 622 2096 804";
const wave = light[0].d;
const shadows = light.slice(1).map((p) => p.d);
const silhouette = mono[0].d;

// Measured geometry (chromium getBBox): wave artwork spans x 0…2047.4, y 646.4…1401.7;
// the wordmark spans x 7…251.3, ascender -71.9, x-height -54.6, baseline 0 (overshoot 1.2).
const WAVE = { x: 0, y: 646.4, w: 2047.4, h: 755.3 };
const WORD = { left: 7, right: 251.3, ascender: 71.9, xHeight: 54.6 };

// Lockup: the wave sits on the x-height band (10% taller than x-height, centred on it, so its crests
// overshoot like round letters do), then a gap of ~0.37 × its height before the wordmark.
const markH = WORD.xHeight * 1.1;
const scale = markH / WAVE.h;
const markW = WAVE.w * scale;
const gap = markH * 0.37;
const baseline = Math.ceil(WORD.ascender);
const markTop = baseline - WORD.xHeight / 2 - markH / 2;
const wordX = markW + gap - WORD.left;
const width = Math.ceil(wordX + WORD.right);
const height = Math.ceil(markTop + markH);
const r = (n) => Number(n.toFixed(3));
const markTransform = `translate(0 ${r(markTop)}) scale(${Number(scale.toFixed(6))}) translate(${-WAVE.x} ${-WAVE.y})`;
const wordTransform = `translate(${r(wordX)} ${baseline})`;
const LOCKUP_VIEWBOX = `0 0 ${width} ${height}`;

const svg = (viewBox, body, size = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"${size} role="img" aria-label="Merid">${body}</svg>\n`;
const pathEl = (d, fill, transform) => `<path fill="${fill}"${transform ? ` transform="${transform}"` : ""} d="${d}"/>`;
const markBody = (waveFill, shadowFill) => pathEl(wave, waveFill) + shadows.map((d) => pathEl(d, shadowFill)).join("");

// Pafta: the wave is the map magenta; where the line passes under itself it is ink (light)
// or a deep magenta (dark). The wordmark is ink. Values match the --mrd-magenta-* and ink tokens.
const BRAND = {
  accent: "#b20965",
  accentStrong: "#830549",
  ink: "#121417",
  body: "#474b51",
  line: "#dde0e3",
  lineStrong: "#babec3",
  paper: "#ffffff",
};
const THEMES = {
  light: { wave: BRAND.accent, shadow: BRAND.ink, ink: BRAND.ink, tile: BRAND.accent, tileWave: "#ffffff", tileShadow: BRAND.accentStrong },
  dark: { wave: "#ef86ae", shadow: "#671d3e", ink: "#eef0f3", tile: "#0d0e10", tileWave: "#ef86ae", tileShadow: "#671d3e" },
};

// The app icon sources carry their own fills; recolour them from the table above.
const recolourIcon = (file, t) => {
  const svg = read(join(src, file));
  const [first, ...rest] = svg.split(/(?=<path\b)/);
  const tile = first.replace(/(<rect[^>]*fill=")[^"]*(")/, `$1${t.tile}$2`);
  const body = rest.map((p, i) => p.replace(/fill="[^"]*"/, `fill="${i === 0 ? t.tileWave : t.tileShadow}"`));
  writeFileSync(join(src, file), tile + body.join(""));
};
recolourIcon("wave-21/icon.svg", THEMES.light);
recolourIcon("wave-21/icon-dark.svg", THEMES.dark);
for (const [name, t] of Object.entries(THEMES)) {
  const file = join(src, `wave-21/mark-${name}.svg`);
  const [first, ...rest] = read(file).split(/(?=<path\b)/);
  writeFileSync(file, first + rest.map((p, i) => p.replace(/fill="[^"]*"/, `fill="${i === 0 ? t.wave : t.shadow}"`)).join(""));
}

for (const [name, t] of Object.entries(THEMES)) {
  writeFileSync(join(out, `mark-${name}.svg`), svg(WAVE_VIEWBOX, markBody(t.wave, t.shadow)));
  writeFileSync(
    join(out, `logo-${name}.svg`),
    svg(LOCKUP_VIEWBOX, `<g transform="${markTransform}">${markBody(t.wave, t.shadow)}</g>${pathEl(word.d, t.ink, wordTransform)}`, ` width="${width}" height="${height}"`),
  );
}
writeFileSync(join(out, "mark-mono.svg"), svg(WAVE_VIEWBOX, pathEl(silhouette, "currentColor")));
for (const [file, fill] of [["logo-mono.svg", "currentColor"], ["logo-mono-white.svg", "#ffffff"]]) {
  writeFileSync(
    join(out, file),
    svg(LOCKUP_VIEWBOX, `<g transform="${markTransform}">${pathEl(silhouette, fill)}</g>${pathEl(word.d, fill, wordTransform)}`, ` width="${width}" height="${height}"`),
  );
}
writeFileSync(join(docs, "app/icon.svg"), read(join(src, "wave-21/icon.svg")));

const ts = `// Generated by scripts/build-brand.mjs from public/brand/src/. Do not edit by hand.
export const waveViewBox = ${JSON.stringify(WAVE_VIEWBOX)};
/** The wave: two crests forming an M. */
export const wave = ${JSON.stringify(wave)};
/** Ink shadows where the line passes under itself. */
export const waveShadows: readonly string[] = ${JSON.stringify(shadows)};
/** One-colour silhouette of the mark. */
export const waveMono = ${JSON.stringify(silhouette)};
/** "merid" outlined (Geist SemiBold, -0.035em), baseline at y = 0. */
export const wordmark = ${JSON.stringify(word.d)};
export const lockup = {
  viewBox: ${JSON.stringify(LOCKUP_VIEWBOX)},
  width: ${width},
  height: ${height},
  markTransform: ${JSON.stringify(markTransform)},
  wordTransform: ${JSON.stringify(wordTransform)},
} as const;
/** App icon (512 × 512): white wave with accent-strong shadows on the accent tile. */
export const icon = { tile: ${JSON.stringify(THEMES.light.tile)}, wave: ${JSON.stringify(THEMES.light.tileWave)}, shadow: ${JSON.stringify(THEMES.light.tileShadow)}, transform: "translate(70.4 70.4) scale(0.1813)" } as const;
/** Fixed brand colours for images rendered outside the page (Open Graph, app icons), where tokens do not reach. */
export const brandColors = ${JSON.stringify(BRAND)} as const;
`;
writeFileSync(join(docs, "lib/brand-paths.ts"), ts);
console.log(`build-brand: lockup ${LOCKUP_VIEWBOX}, mark ${r(markW)}×${r(markH)}, gap ${r(gap)}`);
