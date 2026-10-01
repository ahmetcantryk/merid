/**
 * Token tables for the landing token studio, mirrored from @meridui/react `styles/tokens.css`
 * (the CSS stays the source of truth; e2e checks that the stage's computed values follow the controls).
 * The studio applies theme, accent and density through the library's own subtree attributes,
 * and radius and type scale as custom-property overrides. The diff shows every `--mrd-*` value
 * the current settings resolve to that differs from the defaults.
 */
export const ACCENTS = [
  { id: "blue", key: "1" },
  { id: "violet", key: "2" },
  { id: "green", key: "3" },
  { id: "graphite", key: "4" },
] as const;
export const DENSITIES = ["compact", "default", "comfortable"] as const;
export const RADII = ["none", "tight", "default", "round"] as const;
export const SCALES = ["90", "100", "110"] as const;
export const THEMES = ["light", "dark", "split"] as const;

export type AccentId = (typeof ACCENTS)[number]["id"];
export type DensityId = (typeof DENSITIES)[number];
export type RadiusId = (typeof RADII)[number];
export type ScaleId = (typeof SCALES)[number];
export type ThemeMode = (typeof THEMES)[number];

export interface StudioTokens {
  readonly theme: ThemeMode;
  readonly accent: AccentId;
  readonly density: DensityId;
  readonly radius: RadiusId;
  readonly scale: ScaleId;
}

export const DEFAULT_TOKENS: StudioTokens = { theme: "light", accent: "blue", density: "default", radius: "default", scale: "100" };

type VarMap = Readonly<Record<string, string>>;

const NEUTRAL_DARK: VarMap = {
  "--mrd-bg": "#0b0d12",
  "--mrd-surface": "#12151c",
  "--mrd-tray": "#161a22",
  "--mrd-tray-2": "#1d222c",
  "--mrd-subtle": "#10131a",
  "--mrd-line": "#262b35",
  "--mrd-line-strong": "#3a404c",
  "--mrd-ink": "#eef0f4",
  "--mrd-body": "#a3a9b5",
  "--mrd-muted": "#858c98",
  "--mrd-placeholder": "#7c8390",
  "--mrd-control-off": "#343a46",
  "--mrd-elevated-ring": "0 0 0 1px var(--mrd-line)",
};
const NEUTRAL_LIGHT: VarMap = {
  "--mrd-bg": "#fff",
  "--mrd-surface": "#fff",
  "--mrd-tray": "#f5f6f8",
  "--mrd-tray-2": "#eceef2",
  "--mrd-subtle": "#fbfbfc",
  "--mrd-line": "#e6e8ec",
  "--mrd-line-strong": "#cfd4dc",
  "--mrd-ink": "#0f1219",
  "--mrd-body": "#535a67",
  "--mrd-muted": "#646b78",
  "--mrd-placeholder": "#6e7581",
  "--mrd-control-off": "#d7dbe2",
  "--mrd-elevated-ring": "0 0 0 0 transparent",
};

/** Resolved `--mrd-accent*` per preset and mode. */
const ACCENT_VALUES: Record<AccentId, { light: VarMap; dark: VarMap }> = {
  blue: {
    light: { "--mrd-accent": "#3f63f5", "--mrd-accent-hover": "#3355e6", "--mrd-accent-strong": "#2c46b8", "--mrd-accent-soft": "#eef1ff", "--mrd-accent-solid": "#3f63f5" },
    dark: { "--mrd-accent": "#6b8aff", "--mrd-accent-hover": "#8aa2ff", "--mrd-accent-strong": "#a9bbff", "--mrd-accent-soft": "rgb(107 138 255 / 14%)", "--mrd-accent-solid": "#3f63f5" },
  },
  violet: {
    light: { "--mrd-accent": "#6e4ef0", "--mrd-accent-hover": "#5f3fdc", "--mrd-accent-strong": "#4a2eb0", "--mrd-accent-soft": "#f3f0ff", "--mrd-accent-solid": "#6e4ef0" },
    dark: { "--mrd-accent": "#9d85ff", "--mrd-accent-hover": "#b09cff", "--mrd-accent-strong": "#c6b8ff", "--mrd-accent-soft": "rgb(157 133 255 / 14%)", "--mrd-accent-solid": "#6e4ef0" },
  },
  green: {
    light: { "--mrd-accent": "#13804d", "--mrd-accent-hover": "#0f6e42", "--mrd-accent-strong": "#0c5734", "--mrd-accent-soft": "#e9f8f0", "--mrd-accent-solid": "#13804d" },
    dark: { "--mrd-accent": "#3ecf8e", "--mrd-accent-hover": "#5ed89d", "--mrd-accent-strong": "#7ee2b0", "--mrd-accent-soft": "rgb(62 207 142 / 12%)", "--mrd-accent-solid": "#13804d" },
  },
  graphite: {
    light: { "--mrd-accent": "#3d4350", "--mrd-accent-hover": "#2e333d", "--mrd-accent-strong": "#22262e", "--mrd-accent-soft": "#eef0f3", "--mrd-accent-solid": "#3d4350" },
    dark: { "--mrd-accent": "#c9cdd4", "--mrd-accent-hover": "#d6d9df", "--mrd-accent-strong": "#e4e6ea", "--mrd-accent-soft": "rgb(201 205 212 / 12%)", "--mrd-accent-solid": "#3d4350" },
  },
};

const DENSITY_VALUES: Record<DensityId, Readonly<Record<string, number>>> = {
  compact: { "--mrd-control-md": 28, "--mrd-input-md": 28, "--mrd-icon-button-md": 24, "--mrd-pill": 24, "--mrd-control-pad-md": 10, "--mrd-input-pad": 8, "--mrd-text-sm": 13, "--mrd-text-xs": 12 },
  default: { "--mrd-control-md": 32, "--mrd-input-md": 32, "--mrd-icon-button-md": 28, "--mrd-pill": 28, "--mrd-control-pad-md": 12, "--mrd-input-pad": 10, "--mrd-text-sm": 14, "--mrd-text-xs": 13 },
  comfortable: { "--mrd-control-md": 36, "--mrd-input-md": 36, "--mrd-icon-button-md": 32, "--mrd-pill": 32, "--mrd-control-pad-md": 14, "--mrd-input-pad": 12, "--mrd-text-sm": 14.5, "--mrd-text-xs": 13.5 },
};

const RADIUS_BASE: Readonly<Record<string, number>> = {
  "--mrd-radius-xs": 4,
  "--mrd-radius-sm": 6,
  "--mrd-radius-md": 6,
  "--mrd-radius-lg": 8,
  "--mrd-radius-xl": 10,
  "--mrd-radius-2xl": 12,
  "--mrd-radius-card": 14,
  "--mrd-radius-3xl": 16,
};
const RADIUS_FACTOR: Record<RadiusId, number> = { none: 0, tight: 0.5, default: 1, round: 1.5 };

/** Sizes the type scale multiplies; `--mrd-text-sm` / `-xs` come from the density table. */
const TEXT_BASE: Readonly<Record<string, number>> = {
  "--mrd-text-h3": 17,
  "--mrd-text-lg": 17,
  "--mrd-text-md": 15,
  "--mrd-text-2xs": 12.5,
  "--mrd-text-3xs": 12,
};

const px = (n: number) => `${Math.round(n * 100) / 100}px`;

/** Overrides set inline on the stage: radius and type scale (theme, accent, density use attributes). */
export function stageStyle(t: StudioTokens): Record<string, string> {
  const style: Record<string, string> = {};
  if (t.radius !== "default") {
    for (const [name, value] of Object.entries(RADIUS_BASE)) style[name] = px(value * RADIUS_FACTOR[t.radius]);
  }
  if (t.scale !== "100") {
    const factor = Number(t.scale) / 100;
    for (const [name, value] of Object.entries(TEXT_BASE)) style[name] = px(value * factor);
    for (const name of ["--mrd-text-sm", "--mrd-text-xs"]) style[name] = px((DENSITY_VALUES[t.density][name] ?? 14) * factor);
  }
  return style;
}

/** Every token value the settings resolve to, for one mode. */
function resolve(t: StudioTokens, mode: "light" | "dark"): Record<string, string> {
  const out: Record<string, string> = {};
  Object.assign(out, mode === "dark" ? NEUTRAL_DARK : NEUTRAL_LIGHT, ACCENT_VALUES[t.accent][mode]);
  for (const [name, value] of Object.entries(DENSITY_VALUES[t.density])) out[name] = px(value);
  for (const [name, value] of Object.entries(RADIUS_BASE)) out[name] = px(value);
  for (const [name, value] of Object.entries(TEXT_BASE)) out[name] = px(value);
  return { ...out, ...stageStyle(t) };
}

export interface DiffLine {
  readonly name: string;
  readonly from: string;
  readonly to: string;
}

/** Tokens whose value differs from the defaults. Split mode keeps both themes, so it diffs the light half. */
export function tokenDiff(t: StudioTokens): readonly DiffLine[] {
  const mode = t.theme === "dark" ? "dark" : "light";
  const base = resolve(DEFAULT_TOKENS, "light");
  const next = resolve(t, mode);
  return Object.keys(next)
    .filter((name) => next[name] !== base[name])
    .map((name) => ({ name, from: base[name] ?? "", to: next[name] ?? "" }));
}

/** Copyable CSS for the current settings. */
export function tokenCss(t: StudioTokens): string {
  const lines = tokenDiff(t).map((l) => `  ${l.name}: ${l.to};`);
  return lines.length ? `:root {\n${lines.join("\n")}\n}\n` : "";
}
