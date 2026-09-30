// Builds @meridui/tokens from packages/react/styles/tokens.css. Node only, no dependencies.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { groupOf, isSwitch, parseDeclarations, resolveValue, scopeOf, typeOf } from "./parse.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const source = path.resolve(root, "../react/styles/tokens.css");
const dist = path.join(root, "dist");

export const ACCENTS = ["blue", "violet", "green", "graphite"];
const DENSITIES = ["compact", "comfortable"];

/** Groups declarations by scope. Throws on a scope the build does not understand. */
function collectScopes(decls) {
  let scopes = {};
  for (const d of decls) {
    const scope = scopeOf(d.context);
    if (!scope) throw new Error(`Unrecognised token scope for ${d.name}: ${d.context.join(" | ")}`);
    scopes = { ...scopes, [scope]: { ...scopes[scope], [d.name]: d.value } };
  }
  return scopes;
}

function assertDarkMirror(scopes) {
  for (const [name, value] of Object.entries(scopes.dark)) {
    const system = scopes["dark-system"][name];
    if (system !== value) {
      throw new Error(`Dark tokens drifted: ${name} is "${value}" under [data-theme=dark] but "${system}" under prefers-color-scheme`);
    }
  }
}

/** The declared environment for a theme + accent (+ optional extra overrides), as the browser would cascade it. */
function envFor(scopes, { theme = "light", accent = "blue", extra = [] }) {
  return {
    ...scopes.root,
    ...scopes.light,
    ...(theme === "dark" ? scopes.dark : {}),
    ...scopes["accent-blue"],
    ...(accent === "blue" ? {} : scopes[`accent-${accent}`]),
    ...scopes.resolve,
    ...Object.assign({}, ...extra.map((s) => scopes[s])),
  };
}

function resolveEnv(env) {
  return Object.fromEntries(
    Object.keys(env)
      .filter((name) => !isSwitch(name))
      .map((name) => [name, resolveValue(env[name], env)]),
  );
}

/** Every mode as a complete, resolved token set. `light` is the default. */
export function resolveModes(scopes) {
  const variants = {
    light: {},
    dark: { theme: "dark" },
    ...Object.fromEntries(
      ACCENTS.filter((a) => a !== "blue").flatMap((a) => [
        [a, { accent: a }],
        [`${a}-dark`, { accent: a, theme: "dark" }],
      ]),
    ),
    ...Object.fromEntries(DENSITIES.map((d) => [d, { extra: [`density-${d}`] }])),
    "viewport-md": { extra: ["viewport-md"] },
    "viewport-sm": { extra: ["viewport-md", "viewport-sm"] },
    "pointer-coarse": { extra: ["pointer-coarse"] },
  };
  return Object.fromEntries(Object.entries(variants).map(([mode, opts]) => [mode, resolveEnv(envFor(scopes, opts))]));
}

export async function build() {
  const css = await readFile(source, "utf8");
  const decls = parseDeclarations(css);
  const scopes = collectScopes(decls);
  assertDarkMirror(scopes);
  const modes = resolveModes(scopes);
  const raw = Object.assign({}, ...Object.values(scopes));

  await mkdir(dist, { recursive: true });
  await writeFile(path.join(dist, "tokens.json"), JSON.stringify(toDtcg(modes, raw), null, 2) + "\n");
  await writeFile(path.join(dist, "figma-tokens.json"), JSON.stringify(toTokensStudio(modes), null, 2) + "\n");
  await writeFile(path.join(dist, "tokens.css"), css);
  await writeFile(path.join(dist, "index.js"), toJs(modes));
  await writeFile(path.join(dist, "index.d.ts"), toDts(modes));
  return { modes, count: Object.keys(modes.light).length };
}

function setPath(target, keys, leaf) {
  const [head, ...rest] = keys;
  if (rest.length === 0) return { ...target, [head]: leaf };
  return { ...target, [head]: setPath(target[head] ?? {}, rest, leaf) };
}

function diff(set, base) {
  return Object.fromEntries(Object.entries(set).filter(([name, value]) => base[name] !== value));
}

function toDtcg(modes, raw) {
  const base = modes.light;
  let out = {
    $description:
      "Merid design tokens (W3C DTCG format). $value is the resolved default (light theme, blue accent, default density). " +
      "Other modes are in $extensions['com.merid'].modes; `css` holds the source expression when it references other tokens.",
  };
  for (const [name, value] of Object.entries(base)) {
    const $type = typeOf(name, value);
    const overrides = Object.fromEntries(
      Object.entries(modes)
        .filter(([mode, set]) => mode !== "light" && set[name] !== value)
        .map(([mode, set]) => [mode, set[name]]),
    );
    const meta = {
      cssVariable: name,
      ...(raw[name]?.includes("var(") ? { css: raw[name] } : {}),
      ...(Object.keys(overrides).length > 0 ? { modes: overrides } : {}),
    };
    out = setPath(out, groupOf(name, $type), { $value: value, $type, $extensions: { "com.merid": meta } });
  }
  return out;
}

const STUDIO_TYPE = {
  color: "color",
  dimension: "dimension",
  fontFamily: "fontFamilies",
  fontWeight: "fontWeights",
  shadow: "boxShadow",
  duration: "other",
  cubicBezier: "other",
  number: "other",
  string: "other",
};

function studioSet(values, base) {
  let out = {};
  for (const [name, value] of Object.entries(values)) {
    const type = typeOf(name, base[name] ?? value);
    out = setPath(out, groupOf(name, type), { value, type: STUDIO_TYPE[type] });
  }
  return out;
}

function toTokensStudio(modes) {
  const base = modes.light;
  const accentSets = Object.fromEntries(
    ACCENTS.filter((a) => a !== "blue").flatMap((a) => [
      [`accent-${a}`, studioSet(diff(modes[a], base), base)],
      [`accent-${a}-dark`, studioSet(diff(modes[`${a}-dark`], modes.dark), base)],
    ]),
  );
  const sets = {
    core: studioSet(base, base),
    dark: studioSet(diff(modes.dark, base), base),
    ...accentSets,
    compact: studioSet(diff(modes.compact, base), base),
    comfortable: studioSet(diff(modes.comfortable, base), base),
    "pointer-coarse": studioSet(diff(modes["pointer-coarse"], base), base),
  };
  const themes = ACCENTS.flatMap((a) => {
    const accent = a === "blue" ? {} : { [`accent-${a}`]: "enabled" };
    const accentDark = a === "blue" ? {} : { [`accent-${a}-dark`]: "enabled" };
    const label = a[0].toUpperCase() + a.slice(1);
    return [
      { id: `${a}-light`, name: `${label} / Light`, group: "Theme", selectedTokenSets: { core: "enabled", ...accent } },
      { id: `${a}-dark`, name: `${label} / Dark`, group: "Theme", selectedTokenSets: { core: "source", dark: "enabled", ...accentDark } },
    ];
  });
  return { ...sets, $themes: themes, $metadata: { tokenSetOrder: Object.keys(sets) } };
}

function camel(name) {
  return name.replace(/^--mrd-/, "").replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
}

function toJs(modes) {
  const byMode = Object.fromEntries(
    Object.entries(modes).map(([mode, set]) => [mode, Object.fromEntries(Object.entries(set).map(([k, v]) => [camel(k), v]))]),
  );
  const vars = Object.fromEntries(Object.keys(modes.light).map((k) => [camel(k), `var(${k})`]));
  return [
    "// Generated by scripts/build.mjs. Do not edit.",
    `export const tokens = ${JSON.stringify(byMode, null, 2)};`,
    `export const cssVar = ${JSON.stringify(vars, null, 2)};`,
    "export default tokens;",
    "",
  ].join("\n");
}

function toDts(modes) {
  const names = Object.keys(modes.light).map(camel);
  return [
    "// Generated by scripts/build.mjs. Do not edit.",
    `export type TokenName = ${names.map((n) => JSON.stringify(n)).join(" | ")};`,
    `export type TokenMode = ${Object.keys(modes).map((m) => JSON.stringify(m)).join(" | ")};`,
    "/** Fully resolved values per mode (theme × accent, density, viewport and pointer variants). */",
    "export declare const tokens: { readonly [M in TokenMode]: { readonly [K in TokenName]: string } };",
    "/** `var(--mrd-*)` references, for CSS-in-JS and Tailwind themes. */",
    "export declare const cssVar: { readonly [K in TokenName]: string };",
    "export default tokens;",
    "",
  ].join("\n");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { count, modes } = await build();
  console.log(`@meridui/tokens: ${count} tokens, modes: ${Object.keys(modes).join(", ")}`);
}
