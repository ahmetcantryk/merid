// Prints WCAG contrast ratios for the accent presets (see DESIGN.md "Accent presets").
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
console.log(rows.join("\n"));
if (fail) { console.error("contrast: a pair is below 4.5:1"); process.exit(1); }
