// How the app's own stylesheets sit next to Merid's: CSS imported by the entry, Tailwind's layer order and
// the global styles a project generator left behind. Pure functions over file contents, plus one reader.
import path from "node:path";
import { readIfExists } from "./changes.js";
import { hasStylesImport, stylesImportLine } from "./content.js";
import { normalizeCss, topLevelStatements } from "./css.js";
import type { Project } from "./detect.js";
import { TEMPLATE_STYLES, findTemplateRules, type TemplateMatch } from "./templates.js";

/** Tailwind v4 puts Preflight in `base`; Merid has to come after it and before `components` and `utilities`. */
export const LAYER_ORDER = "@layer theme, base, merid, components, utilities;";

const TAILWIND_IMPORT = /@import\s+["']tailwindcss["']/;

export interface Stylesheet {
  /** Path relative to the project root, with forward slashes. */
  readonly file: string;
  /** How the entry imports it, e.g. `./globals.css`; undefined for template files the entry does not import. */
  readonly specifier: string | undefined;
  readonly source: string;
}

export interface Stylesheets {
  readonly entry: string;
  readonly entrySource: string;
  /** Local CSS imported by the entry, in import order, then the generator's stylesheets that it does not import. */
  readonly sheets: readonly Stylesheet[];
  /** The imported stylesheet that loads Tailwind v4, if any. */
  readonly tailwind: Stylesheet | undefined;
  /** True when one of the imported stylesheets pulls in Merid with `@import`. */
  readonly meridInCss: boolean;
}

/** Relative side-effect CSS imports of a module (`import "./globals.css";`), in order. */
export function cssImports(source: string): string[] {
  return [...source.matchAll(/^import\s+["'](\.{1,2}\/[^"']+\.css)["'];?\s*$/gm)].map((m) => m[1] ?? "");
}

export const importsTailwind = (css: string): boolean => TAILWIND_IMPORT.test(css);
export const importsMerid = hasStylesImport;

/** True when a `@layer` statement puts `merid` after Tailwind's `base`. */
export function hasLayerOrder(css: string): boolean {
  return topLevelStatements(css).some((s) => {
    const match = /^@layer\s+([^{;]+);$/.exec(normalizeCss(s.text).replace(/,/g, ", "));
    const names = match?.[1]?.split(",").map((n) => n.trim()) ?? [];
    const merid = names.indexOf("merid");
    return merid !== -1 && names.indexOf("base") !== -1 && names.indexOf("base") < merid;
  });
}

/** Puts the layer order statement first (after `@charset`), so it runs before `@import "tailwindcss"`. */
export function addLayerOrder(css: string): string {
  if (hasLayerOrder(css)) return css;
  const eol = css.includes("\r\n") ? "\r\n" : "\n";
  const charset = /^@charset\s+["'][^"']*["'];[ \t]*(\r?\n)?/.exec(css);
  const at = charset ? charset[0].length : 0;
  return `${css.slice(0, at)}${LAYER_ORDER}${eol}${eol}${css.slice(at)}`;
}

/**
 * Puts `import "@meridui/react/styles.css";` on the line after the import of `specifier`, moving an existing
 * Merid import that sits above it. Tailwind's stylesheet has to load first so its layer order applies.
 */
export function placeStylesAfter(source: string, specifier: string): string {
  const eol = source.includes("\r\n") ? "\r\n" : "\n";
  const lines = source.split(/\r?\n/);
  const isTarget = (l: string) => cssImports(l).includes(specifier);
  const target = lines.findIndex(isTarget);
  if (target === -1) return source;
  const merid = lines.findIndex((l) => /^import\s/.test(l) && importsMerid(l));
  if (merid > target) return source;
  const line = merid === -1 ? stylesImportLine(source) : (lines[merid] ?? "");
  const rest = merid === -1 ? lines : lines.filter((_, i) => i !== merid);
  const at = rest.findIndex(isTarget) + 1;
  return [...rest.slice(0, at), line, ...rest.slice(at)].join(eol);
}

const resolve = (entry: string, specifier: string) => path.posix.normalize(path.posix.join(path.posix.dirname(entry), specifier));

/** Reads the entry's stylesheets and the generator's global stylesheets. */
export function readStylesheets(root: string, project: Project): Stylesheets | undefined {
  if (!project.entry) return undefined;
  const entrySource = readIfExists(root, project.entry) ?? "";
  const sheets: Stylesheet[] = [];
  for (const specifier of cssImports(entrySource)) {
    const file = resolve(project.entry, specifier);
    const source = readIfExists(root, file);
    if (source !== undefined && !sheets.some((s) => s.file === file)) sheets.push({ file, specifier, source });
  }
  for (const file of project.framework ? TEMPLATE_STYLES[project.framework].files : []) {
    const source = readIfExists(root, file);
    if (source !== undefined && !sheets.some((s) => s.file === file)) sheets.push({ file, specifier: undefined, source });
  }
  const imported = sheets.filter((s) => s.specifier !== undefined);
  return {
    entry: project.entry,
    entrySource,
    sheets,
    tailwind: imported.find((s) => importsTailwind(s.source)),
    meridInCss: imported.some((s) => importsMerid(s.source)),
  };
}

export interface TemplateFinding {
  readonly sheet: Stylesheet;
  readonly matches: readonly TemplateMatch[];
}

/** Generator rules still present in the app's stylesheets. */
export function templateFindings(project: Project, styles: Stylesheets): TemplateFinding[] {
  if (!project.framework) return [];
  const framework = project.framework;
  return styles.sheets
    .map((sheet) => ({ sheet, matches: findTemplateRules(sheet.source, framework) }))
    .filter((f) => f.matches.length > 0);
}

export type TailwindProblem = "layer-order" | "import-order";

/** Why Tailwind's Preflight would override Merid here, if it would. */
export function tailwindProblems(styles: Stylesheets): TailwindProblem[] {
  const tailwind = styles.tailwind;
  if (!tailwind?.specifier) return [];
  // `@import "tailwindcss"` followed by `@import "@meridui/react/styles.css"` already declares Tailwind's layers first.
  const tailwindAt = tailwind.source.search(TAILWIND_IMPORT);
  const meridAt = tailwind.source.search(/@import\s+["']@meridui\/react\/(styles|components|tokens)\.css["']/);
  if (meridAt > tailwindAt) return [];
  const problems: TailwindProblem[] = [];
  if (!hasLayerOrder(tailwind.source)) problems.push("layer-order");
  if (!styles.meridInCss && importsMerid(styles.entrySource)) {
    const lines = styles.entrySource.split(/\r?\n/);
    const merid = lines.findIndex((l) => /^import\s/.test(l) && importsMerid(l));
    const css = lines.findIndex((l) => cssImports(l).includes(tailwind.specifier ?? ""));
    if (merid !== -1 && css !== -1 && merid < css) problems.push("import-order");
  }
  return problems;
}
