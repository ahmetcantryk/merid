/**
 * Platform-aware key combinations. Pure helpers shared by `Shortcut`, `Command` and anything
 * that wants to both show and match a combination like `["mod", "k"]`.
 */

export type ShortcutPlatform = "mac" | "other";

/** Screen-reader names for keys. Override any entry (e.g. for another language). */
export type ShortcutKeyLabels = Readonly<Record<string, string>>;

const MAC_SYMBOLS: Readonly<Record<string, string>> = {
  mod: "⌘",
  meta: "⌘",
  ctrl: "⌃",
  alt: "⌥",
  shift: "⇧",
  enter: "↵",
  backspace: "⌫",
  delete: "⌦",
  escape: "Esc",
  tab: "⇥",
};

const OTHER_SYMBOLS: Readonly<Record<string, string>> = {
  mod: "Ctrl",
  meta: "Win",
  ctrl: "Ctrl",
  alt: "Alt",
  shift: "Shift",
  enter: "Enter",
  backspace: "Backspace",
  delete: "Del",
  escape: "Esc",
  tab: "Tab",
};

const SHARED_SYMBOLS: Readonly<Record<string, string>> = {
  arrowup: "↑",
  arrowdown: "↓",
  arrowleft: "←",
  arrowright: "→",
  space: "Space",
};

/** Default (English) spoken names. `mod` resolves per platform. */
export const DEFAULT_SHORTCUT_LABELS: ShortcutKeyLabels = {
  "mod.mac": "Command",
  "mod.other": "Control",
  meta: "Command",
  ctrl: "Control",
  "alt.mac": "Option",
  "alt.other": "Alt",
  shift: "Shift",
  enter: "Enter",
  backspace: "Backspace",
  delete: "Delete",
  escape: "Escape",
  tab: "Tab",
  arrowup: "Up arrow",
  arrowdown: "Down arrow",
  arrowleft: "Left arrow",
  arrowright: "Right arrow",
  space: "Space",
};

const MODIFIERS = new Set(["mod", "meta", "ctrl", "alt", "shift"]);

/** Best guess of the user's platform. Returns `"other"` outside the browser. */
export function detectPlatform(): ShortcutPlatform {
  if (typeof navigator === "undefined") return "other";
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const platform = nav.userAgentData?.platform ?? nav.platform ?? "";
  return /mac|iphone|ipad|ipod/i.test(platform) ? "mac" : "other";
}

const normalize = (key: string) => (key === " " ? " " : key.trim().toLowerCase());

/** The visible symbol for one key, e.g. `"mod"` → `"⌘"` on macOS, `"Ctrl"` elsewhere. */
export function keySymbol(key: string, platform: ShortcutPlatform): string {
  const k = normalize(key);
  const table = platform === "mac" ? MAC_SYMBOLS : OTHER_SYMBOLS;
  const symbol = table[k] ?? SHARED_SYMBOLS[k];
  if (symbol) return symbol;
  return key.length === 1 ? key.toUpperCase() : key;
}

/** The spoken name for one key. */
export function keyLabel(key: string, platform: ShortcutPlatform, labels: ShortcutKeyLabels = {}): string {
  const k = normalize(key);
  const merged = { ...DEFAULT_SHORTCUT_LABELS, ...labels };
  const label = merged[`${k}.${platform}`] ?? merged[k];
  if (label) return label;
  return key.length === 1 ? key.toUpperCase() : key;
}

/** A readable string such as `"⌘K"` (macOS) or `"Ctrl+K"`. */
export function formatShortcut(keys: readonly string[], platform: ShortcutPlatform = detectPlatform()): string {
  return keys.map((key) => keySymbol(key, platform)).join(platform === "mac" ? "" : "+");
}

/** True when `event` presses exactly `keys` (modifiers must match; `mod` is ⌘ on macOS, Ctrl elsewhere). */
export function matchesShortcut(
  event: Pick<KeyboardEvent, "key" | "metaKey" | "ctrlKey" | "altKey" | "shiftKey">,
  keys: readonly string[],
  platform: ShortcutPlatform = detectPlatform(),
): boolean {
  const wanted = keys.map(normalize);
  const main = wanted.filter((k) => !MODIFIERS.has(k));
  if (main.length !== 1) return false;
  const has = (k: string) => wanted.includes(k);
  const wantMeta = has("meta") || (has("mod") && platform === "mac");
  const wantCtrl = has("ctrl") || (has("mod") && platform !== "mac");
  if (event.metaKey !== wantMeta || event.ctrlKey !== wantCtrl) return false;
  if (event.altKey !== has("alt")) return false;
  const key = normalize(event.key);
  const target = main[0] === "space" ? " " : (main[0] ?? "");
  if (has("shift") && !event.shiftKey) return false;
  // Shift is part of typing symbols ("?" is Shift+/), so an unrequested Shift only blocks letters and named keys.
  if (!has("shift") && event.shiftKey && /^[a-z]$|^.{2,}$/.test(target)) return false;
  return key === target;
}
