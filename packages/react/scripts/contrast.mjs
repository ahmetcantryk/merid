// WCAG contrast ratios for the accent presets and the neutral / status pairs (see DESIGN.md).
// Usage: node scripts/contrast.mjs  — prints the tables and exits 1 if any pair is below 4.5:1.
// The colours mirror styles/tokens.css; src/components/Contrast.css.test.tsx fails when the two drift.
import { fileURLToPath } from "node:url";

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = (h) => { const [r, g, b] = hex(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
export const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

// Translucent dark fills ([rgb, alpha]) are composited over the surface they sit on.
const hexRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const over = (rgb, alpha, bg) =>
  "#" + rgb.map((c, i) => Math.round(c * alpha + hexRgb(bg)[i] * (1 - alpha)).toString(16).padStart(2, "0")).join("");
const fill = (v, bg) => (typeof v === "string" ? v : over(v[0], v[1], bg));

export const AA = 4.5;

export const PRESETS = {
  magenta: {
    light: { accent: "#b20965", solid: "#b20965", solidHover: "#990155", strong: "#830549", soft: "#fef0f4" },
    dark: { accent: "#ef86ae", solid: "#b20965", solidHover: "#990155", strong: "#fcbfd3", soft: [[239, 134, 174], 0.16] },
  },
  blue: {
    light: { accent: "#3d61f2", solid: "#3d61f2", solidHover: "#3355e6", strong: "#2c46b8", soft: "#eef1ff" },
    dark: { accent: "#6b8aff", solid: "#3d61f2", solidHover: "#3355e6", strong: "#a9bbff", soft: [[107, 138, 255], 0.14] },
  },
  violet: {
    light: { accent: "#6e4ef0", solid: "#6e4ef0", solidHover: "#5f3fdc", strong: "#4a2eb0", soft: "#f3f0ff" },
    dark: { accent: "#9d85ff", solid: "#6e4ef0", solidHover: "#5f3fdc", strong: "#c6b8ff", soft: [[157, 133, 255], 0.14] },
  },
  green: {
    light: { accent: "#13804d", solid: "#13804d", solidHover: "#0f6e42", strong: "#0c5734", soft: "#e9f8f0" },
    dark: { accent: "#3ecf8e", solid: "#13804d", solidHover: "#0f6e42", strong: "#7ee2b0", soft: [[62, 207, 142], 0.12] },
  },
  graphite: {
    light: { accent: "#3d4350", solid: "#3d4350", solidHover: "#2e333d", strong: "#22262e", soft: "#eef0f3" },
    dark: { accent: "#c9cdd4", solid: "#3d4350", solidHover: "#2e333d", strong: "#e4e6ea", soft: [[201, 205, 212], 0.12] },
  },
  petrol: {
    light: { accent: "#035f73", solid: "#035f73", solidHover: "#025061", strong: "#044553", soft: "#e9f6f9" },
    dark: { accent: "#75c4d2", solid: "#035f73", solidHover: "#025061", strong: "#b6e0e8", soft: [[117, 196, 210], 0.14] },
  },
  brass: {
    light: { accent: "#855c01", solid: "#855c01", solidHover: "#744e01", strong: "#624003", soft: "#f9f5eb", warning: ["#9e4500", "#fff3e9"] },
    dark: { accent: "#d9b165", solid: "#855c01", solidHover: "#744e01", strong: "#ecd9ae", soft: [[217, 177, 101], 0.14], warning: ["#f9a870", [[239, 121, 38], 0.13]] },
  },
};

export const NEUTRALS = {
  light: {
    bg: "#ffffff", surface: "#ffffff", tray: "#f4f6f8", subtle: "#f9fafc",
    ink: "#121417", muted: "#5f636a", placeholder: "#64686d", body: "#474b51",
    dangerSolid: "#c12b09", dangerSolidHover: "#a52205",
    danger: ["#a52205", "#fef2ee"], warning: ["#93580a", "#fff8eb"], success: ["#17744a", "#ecf8f1"],
  },
  dark: {
    bg: "#0d0e10", surface: "#141518", tray: "#181a1d", subtle: "#111214",
    ink: "#eef0f3", muted: "#9a9fa6", placeholder: "#989ca2", body: "#b7bbc1",
    dangerSolid: "#c12b09", dangerSolidHover: "#a52205",
    danger: ["#fea387", [[222, 63, 32], 0.14]], warning: ["#f5c46b", [[245, 166, 35], 0.12]], success: ["#7ee2b0", [[62, 207, 142], 0.12]],
  },
};

const MODES = ["light", "dark"];

/** Ratios for one preset in one mode: white on the fills, the accent on each page surface, strong text on its tint. */
function presetCells(p, n) {
  return {
    "white/solid": ratio("#ffffff", p.solid),
    "white/solid-hover": ratio("#ffffff", p.solidHover),
    ...Object.fromEntries(["bg", "surface", "tray"].map((k) => [`accent/${k}`, ratio(p.accent, n[k])])),
    "strong/soft": ratio(p.strong, fill(p.soft, n.surface)),
    // A preset that moves the warning tone (brass) is checked against its own warning pair.
    ...(p.warning
      ? Object.fromEntries(["surface", "tray"].map((base) => [`warning-strong/warning-soft on ${base}`, ratio(p.warning[0], fill(p.warning[1], n[base]))]))
      : {}),
  };
}

/** Ratios for the neutral text tones and the status notices in one mode. */
function neutralCells(n) {
  const cells = {
    "ink/bg": ratio(n.ink, n.bg),
    "body/bg": ratio(n.body, n.bg),
    "body/tray": ratio(n.body, n.tray),
    "placeholder/surface": ratio(n.placeholder, n.surface),
    "muted/bg": ratio(n.muted, n.bg),
    "muted/surface": ratio(n.muted, n.surface),
    "muted/tray": ratio(n.muted, n.tray),
    "muted/subtle": ratio(n.muted, n.subtle),
    "white/danger-solid": ratio("#ffffff", n.dangerSolid),
    "white/danger-solid-hover": ratio("#ffffff", n.dangerSolidHover),
  };
  for (const tone of ["danger", "warning", "success"]) {
    const [fg, softBg] = n[tone];
    for (const base of ["surface", "tray"]) cells[`${tone}-strong/${tone}-soft on ${base}`] = ratio(fg, fill(softBg, n[base]));
  }
  return cells;
}

/** Every measured pair: `{ group, mode, cells }` rows, presets first, then neutrals. */
export function measure() {
  const presets = Object.entries(PRESETS).flatMap(([name, modes]) =>
    MODES.map((mode) => ({ group: name, mode, cells: presetCells(modes[mode], NEUTRALS[mode]) })),
  );
  const neutrals = MODES.map((mode) => ({ group: "neutral", mode, cells: neutralCells(NEUTRALS[mode]) }));
  return [...presets, ...neutrals];
}

/** The rows that have at least one pair below AA, with only the failing pairs kept. */
export function failures(rows = measure()) {
  return rows
    .map((row) => ({ ...row, cells: Object.fromEntries(Object.entries(row.cells).filter(([, v]) => v < AA)) }))
    .filter((row) => Object.keys(row.cells).length > 0);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const rows = measure();
  for (const { group, mode, cells } of rows) {
    console.log(`| ${group} | ${mode} | ${Object.entries(cells).map(([k, v]) => `${k} ${v.toFixed(2)}`).join(" · ")} |`);
  }
  if (failures(rows).length > 0) {
    console.error("contrast: a pair is below 4.5:1");
    process.exit(1);
  }
}
