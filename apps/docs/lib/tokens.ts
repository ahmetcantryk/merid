/** Token values mirrored from DESIGN.md for documentation tables. The CSS in @meridui/react is the source of truth. */

export interface ColorToken {
  readonly name: string;
  readonly light: string;
  readonly dark: string;
  readonly role: string;
}

export const colorGroups: readonly { readonly title: string; readonly tokens: readonly ColorToken[] }[] = [
  {
    title: "Accent",
    tokens: [
      { name: "--mrd-accent", light: "#3f63f5", dark: "#6b8aff", role: "Interactive elements, selection, focus" },
      { name: "--mrd-accent-hover", light: "#3355e6", dark: "#8aa2ff", role: "Hover state of accent and links" },
      { name: "--mrd-accent-soft", light: "#eef1ff", dark: "rgba(107,138,255,.14)", role: "Selected row, icon tile, info tint" },
      { name: "--mrd-accent-strong", light: "#2c46b8", dark: "#a9bbff", role: "Text on accent-soft" },
      { name: "--mrd-on-accent", light: "#ffffff", dark: "#ffffff", role: "Text on accent fill" },
    ],
  },
  {
    title: "Surfaces",
    tokens: [
      { name: "--mrd-bg", light: "#ffffff", dark: "#0b0d12", role: "Page background" },
      { name: "--mrd-surface", light: "#ffffff", dark: "#12151c", role: "Cards on a tray, dialogs, inputs, menus" },
      { name: "--mrd-tray", light: "#f5f6f8", dark: "#161a22", role: "Recessed sections, cards on page, hover" },
      { name: "--mrd-tray-2", light: "#eceef2", dark: "#1d222c", role: "Track on a tray, shimmer" },
      { name: "--mrd-subtle", light: "#fbfbfc", dark: "#10131a", role: "Table header, window bar, detail pane" },
    ],
  },
  {
    title: "Lines",
    tokens: [
      { name: "--mrd-line", light: "#e6e8ec", dark: "#262b35", role: "Every hairline" },
      { name: "--mrd-line-strong", light: "#cfd4dc", dark: "#3a404c", role: "Dashed dropzone, switch-off border" },
    ],
  },
  {
    title: "Text",
    tokens: [
      { name: "--mrd-ink", light: "#0f1219", dark: "#eef0f4", role: "Headings, strong text" },
      { name: "--mrd-body", light: "#535a67", dark: "#a3a9b5", role: "Body text" },
      { name: "--mrd-muted", light: "#646b78", dark: "#858c98", role: "Meta, icons" },
      { name: "--mrd-placeholder", light: "#6e7581", dark: "#7c8390", role: "Input placeholder" },
    ],
  },
  {
    title: "Status",
    tokens: [
      { name: "--mrd-danger", light: "#e5484d", dark: "#ff6369", role: "Invalid border, status dot" },
      { name: "--mrd-danger-solid", light: "#c92a30", dark: "#c92a30", role: "Danger button fill (white text, AA)" },
      { name: "--mrd-danger-solid-hover", light: "#b42318", dark: "#b42318", role: "Danger button hover" },
      { name: "--mrd-danger-soft", light: "#fff0f0", dark: "rgba(229,72,77,.12)", role: "Error notice background" },
      { name: "--mrd-danger-strong", light: "#b42318", dark: "#ff8a8e", role: "Error notice text" },
      { name: "--mrd-warning-soft", light: "#fff8eb", dark: "rgba(245,166,35,.12)", role: "Warning notice background" },
      { name: "--mrd-warning-strong", light: "#93580a", dark: "#f5c46b", role: "Warning notice text" },
      { name: "--mrd-success", light: "#1f9d63", dark: "#3ecf8e", role: "Success icon or dot only" },
      { name: "--mrd-success-soft", light: "#ecf8f1", dark: "rgba(62,207,142,.12)", role: "Success notice background" },
      { name: "--mrd-success-strong", light: "#17744a", dark: "#7ee2b0", role: "Success notice text" },
      { name: "--mrd-control-off", light: "#d7dbe2", dark: "#343a46", role: "Switch off track" },
      { name: "--mrd-tooltip-bg", light: "#0f1219", dark: "#eef0f4", role: "Tooltip background" },
      { name: "--mrd-tooltip-fg", light: "#ffffff", dark: "#0f1219", role: "Tooltip text" },
    ],
  },
];

export const typeScale = [
  { name: "--mrd-text-display", spec: "clamp(40px, 6vw, 72px) / 1.05 / -0.04em", use: "Hero heading", size: "56px", lh: 1.05, track: "-0.04em", weight: 600 },
  { name: "--mrd-text-h2", spec: "clamp(30px, 3.6vw, 40px) / 1.1 / -0.03em", use: "Section title", size: "36px", lh: 1.1, track: "-0.03em", weight: 600 },
  { name: "--mrd-text-h3", spec: "20px / 1.3 / -0.015em", use: "Card title", size: "20px", lh: 1.3, track: "-0.015em", weight: 600 },
  { name: "--mrd-text-lg", spec: "18px / 1.6", use: "Lead paragraph", size: "18px", lh: 1.6, track: "0", weight: 400 },
  { name: "--mrd-text-md", spec: "16px / 1.6", use: "Body", size: "16px", lh: 1.6, track: "0", weight: 400 },
  { name: "--mrd-text-sm", spec: "15px / 1.5", use: "Button, input, nav, list", size: "15px", lh: 1.5, track: "0", weight: 500 },
  { name: "--mrd-text-xs", spec: "14px / 1.45", use: "Small button, label, pill", size: "14px", lh: 1.45, track: "0", weight: 500 },
  { name: "--mrd-text-2xs", spec: "13px / 1.4", use: "Meta, helper, notes", size: "13px", lh: 1.4, track: "0", weight: 400 },
  { name: "--mrd-text-3xs", spec: "12px / 1.3", use: "Badge, caption", size: "12px", lh: 1.3, track: "0", weight: 500 },
] as const;

export const spacing = [
  ["--mrd-space-1", 4], ["--mrd-space-2", 8], ["--mrd-space-3", 12], ["--mrd-space-4", 16],
  ["--mrd-space-5", 20], ["--mrd-space-6", 24], ["--mrd-space-7", 28], ["--mrd-space-8", 32],
  ["--mrd-space-10", 40], ["--mrd-space-14", 56], ["--mrd-space-16", 64], ["--mrd-space-18", 72],
  ["--mrd-space-28", 112],
] as const;

export const radii = [
  { name: "--mrd-radius-xs", value: "6px", use: "Focus ring, skeleton, inline code" },
  { name: "--mrd-radius-sm", value: "8px", use: "Tooltip, small tiles" },
  { name: "--mrd-radius-md", value: "10px", use: "Icon button, menu item, nav link" },
  { name: "--mrd-radius-lg", value: "12px", use: "Button, input, alert, row" },
  { name: "--mrd-radius-xl", value: "14px", use: "Window frame, popover" },
  { name: "--mrd-radius-2xl", value: "16px", use: "Menu, mobile card" },
  { name: "--mrd-radius-card", value: "20px", use: "Card, panel, dialog" },
  { name: "--mrd-radius-3xl", value: "24px", use: "Call-to-action block" },
  { name: "--mrd-radius-full", value: "999px", use: "Pill, badge, switch, avatar" },
] as const;

export const shadows = [
  { name: "--mrd-shadow-xs", value: "0 1px 3px rgba(15,18,25,.10)", use: "Selected pill chip" },
  { name: "--mrd-shadow-sm", value: "0 2px 6px rgba(15,18,25,.05)", use: "Icon tile" },
  { name: "--mrd-shadow-md", value: "0 12px 32px rgba(15,18,25,.06)", use: "Card lift" },
  { name: "--mrd-shadow-lg", value: "0 10px 28px rgba(15,18,25,.10)", use: "Popover, toast, tooltip" },
  { name: "--mrd-shadow-xl", value: "0 16px 40px rgba(15,18,25,.10)", use: "Menu" },
  { name: "--mrd-shadow-2xl", value: "0 24px 64px rgba(15,18,25,.18)", use: "Dialog" },
  { name: "--mrd-shadow-accent", value: "0 8px 20px rgba(71,108,255,.28)", use: "Primary button only" },
] as const;

export const motion = [
  { name: "--mrd-duration-fast", value: "100ms", use: "Press feedback" },
  { name: "--mrd-duration", value: "150ms", use: "Colour, border and shadow changes" },
  { name: "--mrd-duration-slow", value: "200ms", use: "Lift, rotate, overlay" },
  { name: "--mrd-ease", value: "cubic-bezier(.2, 0, 0, 1)", use: "Every transition" },
] as const;
