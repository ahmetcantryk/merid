// Minimal parser and resolver for packages/react/styles/tokens.css. No dependencies.

/** Every `--mrd-*` declaration with the selector / at-rule chain it sits in. */
export function parseDeclarations(css) {
  const source = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const decls = [];
  const stack = [];
  let buffer = "";
  for (const ch of source) {
    if (ch === "{") {
      stack.push(buffer.trim().replace(/\s+/g, " "));
      buffer = "";
    } else if (ch === "}") {
      pushDecl(buffer, stack, decls);
      buffer = "";
      stack.pop();
    } else if (ch === ";") {
      pushDecl(buffer, stack, decls);
      buffer = "";
    } else {
      buffer += ch;
    }
  }
  return decls;
}

function pushDecl(text, stack, decls) {
  const match = /^\s*(--mrd-[\w-]+)\s*:([\s\S]*)$/.exec(text);
  if (!match) return;
  decls.push({
    name: match[1],
    value: match[2].trim().replace(/\s+/g, " "),
    context: stack.filter((s) => !s.startsWith("@layer")),
  });
}

const SCOPES = new Map([
  [":root", "root"],
  [':root, [data-theme="light"]', "light"],
  ['[data-theme="dark"]', "dark"],
  ['@media (prefers-color-scheme: dark) | :root:not([data-theme="light"])', "dark-system"],
  [":root, [data-accent]", "accent-base"],
  [':root, [data-accent="magenta"]', "accent-magenta"],
  ['[data-accent="blue"]', "accent-blue"],
  ['[data-accent="violet"]', "accent-violet"],
  ['[data-accent="green"]', "accent-green"],
  ['[data-accent="graphite"]', "accent-graphite"],
  ['[data-accent="petrol"]', "accent-petrol"],
  ['[data-accent="brass"]', "accent-brass"],
  [":root, [data-theme], [data-accent]", "resolve"],
  ['@media not (pointer: coarse) | [data-density="compact"]', "density-compact"],
  ['@media not (pointer: coarse) | [data-density="default"]', "density-default"],
  ['@media not (pointer: coarse) | [data-density="comfortable"]', "density-comfortable"],
  ["@media (width <= 920px) | :root", "viewport-md"],
  ["@media (width <= 640px) | :root", "viewport-sm"],
  ["@media (pointer: coarse) | :root", "pointer-coarse"],
]);

/** Maps a context chain to a scope name, or undefined for an unknown scope. */
export function scopeOf(context) {
  return SCOPES.get(context.join(" | "));
}

/** Internal mode switches (`--mrd-if-light` / `--mrd-if-dark`): implementation detail, not tokens. */
export const isSwitch = (name) => /^--mrd-if-/.test(name);

function splitVar(inner) {
  let depth = 0;
  for (let i = 0; i < inner.length; i += 1) {
    const ch = inner[i];
    if (ch === "(") depth += 1;
    else if (ch === ")") depth -= 1;
    else if (ch === "," && depth === 0) return [inner.slice(0, i).trim(), inner.slice(i + 1).trim()];
  }
  return [inner.trim(), undefined];
}

/**
 * Substitutes var() references against `env` the way a browser would, including
 * the guaranteed-invalid `initial` value used by the mode switches.
 */
export function resolveValue(value, env, depth = 0) {
  if (depth > 20) throw new Error(`var() cycle while resolving "${value}"`);
  let out = "";
  let i = 0;
  while (i < value.length) {
    const start = value.indexOf("var(", i);
    if (start === -1) {
      out += value.slice(i);
      break;
    }
    out += value.slice(i, start);
    let level = 1;
    let j = start + 4;
    while (j < value.length && level > 0) {
      if (value[j] === "(") level += 1;
      else if (value[j] === ")") level -= 1;
      j += 1;
    }
    const [name, fallback] = splitVar(value.slice(start + 4, j - 1));
    const raw = env[name];
    const usable = raw !== undefined && raw !== "initial";
    if (usable) out += resolveValue(raw, env, depth + 1);
    else if (fallback !== undefined) out += resolveValue(fallback, env, depth + 1);
    else throw new Error(`Unresolvable ${name} in "${value}"`);
    i = j;
  }
  return out
    .replace(/\s+/g, " ")
    .replace(/\s+,/g, ",")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .trim();
}

const TYPE_RULES = [
  [/^--mrd-font-(sans|mono|display)$/, "fontFamily"],
  [/^--mrd-weight-/, "fontWeight"],
  [/^--mrd-duration/, "duration"],
  [/^--mrd-ease/, "cubicBezier"],
  [/^--mrd-(shadow|focus-ring|elevated-ring)/, "shadow"],
  [/^--mrd-z-/, "number"],
  [/^--mrd-leading-/, "number"],
  [/^--mrd-tracking-/, "dimension"],
];

export function typeOf(name, value) {
  for (const [re, type] of TYPE_RULES) if (re.test(name)) return type;
  if (/^(#|rgb|hsl|oklch|color-mix)/.test(value)) return "color";
  if (/^-?[\d.]+(px|rem|em)$/.test(value) || value.startsWith("clamp(")) return "dimension";
  return "string";
}

/** Group path for a token, e.g. --mrd-space-4 -> ["space", "4"]. */
export function groupOf(name, type) {
  const bare = name.replace(/^--mrd-/, "");
  const prefixed = [
    ["space-", "space"],
    ["radius-", "radius"],
    ["z-", "z"],
  ];
  for (const [prefix, group] of prefixed) if (bare.startsWith(prefix)) return [group, bare.slice(prefix.length)];
  if (/^(magenta|blue|violet|green|graphite|petrol|brass)-\d+$/.test(bare)) return ["palette", bare];
  if (type === "color") return ["color", bare];
  if (type === "shadow") return ["shadow", bare.replace(/^shadow-/, "")];
  if (type === "duration" || type === "cubicBezier" || bare === "press") return ["motion", bare];
  if (/^(font|text|leading|tracking|weight|display|title|label)-/.test(bare)) return ["typography", bare];
  if (bare.startsWith("focus-")) return ["focus", bare.slice("focus-".length)];
  return ["size", bare];
}
