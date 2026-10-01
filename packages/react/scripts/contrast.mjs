// Prints WCAG contrast ratios for the accent presets and the neutral / status pairs (see DESIGN.md).
// Usage: node scripts/contrast.mjs  — exits 1 if any pair is below 4.5:1.
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = (h) => { const [r, g, b] = hex(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
export const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

const BG = { light: { bg: "#ffffff", surface: "#ffffff", tray: "#f5f6f8" }, dark: { bg: "#0b0d12", surface: "#12151c", tray: "#161a22" } };
export const PRESETS = {
  blue: { light: { accent: "#3f63f5", solid: "#3f63f5", solidHover: "#3355e6", strong: "#2c46b8", soft: "#eef1ff" }, dark: { accent: "#6b8aff", solid: "#3f63f5", solidHover: "#3355e6", strong: "#a9bbff" } },
  violet: { light: { accent: "#6e4ef0", solid: "#6e4ef0", solidHover: "#5f3fdc", strong: "#4a2eb0", soft: "#f3f0ff" }, dark: { accent: "#9d85ff", solid: "#6e4ef0", solidHover: "#5f3fdc", strong: "#c6b8ff" } },
  green: { light: { accent: "#13804d", solid: "#13804d", solidHover: "#0f6e42", strong: "#0c5734", soft: "#e9f8f0" }, dark: { accent: "#3ecf8e", solid: "#13804d", solidHover: "#0f6e42", strong: "#7ee2b0" } },
  graphite: { light: { accent: "#3d4350", solid: "#3d4350", solidHover: "#2e333d", strong: "#22262e", soft: "#eef0f3" }, dark: { accent: "#c9cdd4", solid: "#3d4350", solidHover: "#2e333d", strong: "#e4e6ea" } },
};

let fail = false;
const rows = [];
for (const [name, modes] of Object.entries(PRESETS)) {
  for (const mode of ["light", "dark"]) {
    const p = modes[mode];
    const cells = {
      "white/solid": ratio("#ffffff", p.solid),
      "white/solid-hover": ratio("#ffffff", p.solidHover),
      ...Object.fromEntries(Object.entries(BG[mode]).map(([k, v]) => [`accent/${k}`, ratio(p.accent, v)])),
      ...(p.soft ? { "strong/soft": ratio(p.strong, p.soft) } : { "strong/surface": ratio(p.strong, BG.dark.surface) }),
    };
    for (const v of Object.values(cells)) if (v < 4.5) fail = true;
    rows.push(`| ${name} | ${mode} | ${Object.entries(cells).map(([k, v]) => `${k} ${v.toFixed(2)}`).join(" · ")} |`);
  }
}
// Neutral and status pairs. Translucent dark soft fills are composited over the surface they sit on.
const hexRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const over = (rgb, alpha, bg) =>
  "#" + rgb.map((c, i) => Math.round(c * alpha + hexRgb(bg)[i] * (1 - alpha)).toString(16).padStart(2, "0")).join("");
export const NEUTRALS = {
  light: {
    bg: "#ffffff", surface: "#ffffff", tray: "#f5f6f8", subtle: "#fbfbfc",
    muted: "#646b78", placeholder: "#6e7581", body: "#535a67",
    dangerSolid: "#c92a30", dangerSolidHover: "#b42318",
    danger: ["#b42318", "#fff0f0"], warning: ["#93580a", "#fff8eb"], success: ["#17744a", "#ecf8f1"],
  },
  dark: {
    bg: "#0b0d12", surface: "#12151c", tray: "#161a22", subtle: "#10131a",
    muted: "#858c98", placeholder: "#7c8390", body: "#a3a9b5",
    dangerSolid: "#c92a30", dangerSolidHover: "#b42318",
    danger: ["#ff8a8e", [[229, 72, 77], 0.12]], warning: ["#f5c46b", [[245, 166, 35], 0.12]], success: ["#7ee2b0", [[62, 207, 142], 0.12]],
  },
};
const neutralRows = [];
for (const mode of ["light", "dark"]) {
  const n = NEUTRALS[mode];
  const soft = (v, bg) => (typeof v === "string" ? v : over(v[0], v[1], bg));
  const cells = {
    "placeholder/surface": ratio(n.placeholder, n.surface),
    "muted/bg": ratio(n.muted, n.bg),
    "muted/surface": ratio(n.muted, n.surface),
    "muted/tray": ratio(n.muted, n.tray),
    "muted/subtle": ratio(n.muted, n.subtle),
    "body/tray": ratio(n.body, n.tray),
    "white/danger-solid": ratio("#ffffff", n.dangerSolid),
    "white/danger-solid-hover": ratio("#ffffff", n.dangerSolidHover),
  };
  for (const tone of ["danger", "warning", "success"]) {
    const [fg, softBg] = n[tone];
    for (const base of ["surface", "tray"]) cells[`${tone}-strong/${tone}-soft on ${base}`] = ratio(fg, soft(softBg, n[base]));
  }
  for (const v of Object.values(cells)) if (v < 4.5) fail = true;
  neutralRows.push(`| ${mode} | ${Object.entries(cells).map(([k, v]) => `${k} ${v.toFixed(2)}`).join(" · ")} |`);
}
console.log(rows.join("\n"));
console.log(neutralRows.join("\n"));
if (fail) { console.error("contrast: a pair is below 4.5:1"); process.exit(1); }
