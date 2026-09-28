/**
 * Playground presets. Colour values live in landing.css under `.pg[data-accent]`;
 * the hex values here only feed the token read-out and must match that file.
 */
export const ACCENTS = [
  { id: "blue", label: "Blue (default)", key: "1", light: "#3f63f5", dark: "#6b8aff" },
  { id: "violet", label: "Violet", key: "2", light: "#6e56cf", dark: "#9d8cf2" },
  { id: "green", label: "Green", key: "3", light: "#14805e", dark: "#3ecf8e" },
  { id: "graphite", label: "Graphite", key: "4", light: "#0f1219", dark: "#eef0f4" },
] as const;

export const DENSITIES = [
  { id: "compact", label: "Compact", control: 28 },
  { id: "default", label: "Default", control: 32 },
  { id: "comfortable", label: "Roomy", control: 36 },
] as const;

export type AccentId = (typeof ACCENTS)[number]["id"];
export type DensityId = (typeof DENSITIES)[number]["id"];
