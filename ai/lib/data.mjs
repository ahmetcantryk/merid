// Compiles the docs MDX, token CSS, patterns and rules into one JSON-serialisable object.
// Used at build time by @meridui/mcp (full data) and @meridui/cli (rules and patterns).
import { readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { SITE_URL, docsRoot, readCatalog, readDesignContract, readPages, readRules, repoRoot } from "./docs.mjs";
import { publishedNames, sections } from "./mdx.mjs";

/** Pattern pages → example source file in apps/docs/examples/patterns, and the CLI slug. */
export const PATTERNS = [
  { slug: "app-shell", href: "/docs/patterns/app-shell", file: "app-shell.tsx", aliases: ["navigation", "shell"] },
  { slug: "settings", href: "/docs/patterns/settings", file: "settings.tsx", aliases: ["settings-page"] },
  { slug: "auth", href: "/docs/patterns/authentication", file: "authentication.tsx", aliases: ["authentication", "sign-in", "login"] },
  { slug: "data-table", href: "/docs/patterns/data-tables", file: "data-table.tsx", aliases: ["data-tables", "table"] },
  { slug: "forms", href: "/docs/patterns/forms", file: "forms.tsx", aliases: ["form"] },
  { slug: "confirmations", href: "/docs/patterns/confirmations", file: "confirmations.tsx", aliases: ["confirm"] },
  { slug: "empty-and-loading", href: "/docs/patterns/empty-and-loading", file: "empty-and-loading.tsx", aliases: ["empty", "loading"] },
];

/** Framework setup guides: the integration page plus the shared installation page. */
export const SETUPS = [
  { framework: "next", title: "Next.js (App Router)", href: "/docs/integrations/nextjs" },
  { framework: "vite", title: "Vite", href: "/docs/integrations/vite" },
  { framework: "react-router", title: "React Router", href: "/docs/integrations/routers" },
];

const firstCodeBlock = (text, lang) => new RegExp("```" + lang + "\\n([\\s\\S]*?)```").exec(text)?.[1]?.trim() ?? "";
const codeBlocks = (text) => [...text.matchAll(/```(\w*)\n([\s\S]*?)```/g)].map((m) => ({ lang: m[1] || "tsx", code: m[2].trim() }));

function sectionText(all, ...names) {
  return all
    .filter((s) => names.some((n) => s.heading.toLowerCase() === n))
    .map((s) => s.text)
    .join("\n\n")
    .trim();
}

/** Keyboard rows are the Markdown table under "Accessibility" whose header starts with "Keys". */
function keyboardTable(text) {
  const match = /\| Keys \| Action \|\n\| --- \| --- \|\n((?:\|.*\|\n?)+)/.exec(text);
  return match ? match[0].trim() : "";
}

function components(pages) {
  const byHref = new Map(pages.map((p) => [p.href, p]));
  return readCatalog().flatMap((group) =>
    group.items.map((item) => {
      const page = byHref.get(`/docs/components/${item.slug}`);
      if (!page) throw new Error(`[ai] catalog entry ${item.name} has no docs page`);
      const parts = sections(page.markdown);
      const accessibility = sectionText(parts, "accessibility");
      return {
        name: item.name,
        slug: item.slug,
        category: group.group,
        status: item.status,
        description: item.description,
        summary: page.description,
        url: page.url,
        import: firstCodeBlock(sectionText(parts, "import"), "tsx") || `import { ${item.name} } from "@meridui/react";`,
        api: sectionText(parts, "api reference", "props"),
        examples: codeBlocks(parts.filter((s) => s.heading !== "API reference" && s.heading !== "Import").map((s) => s.text).join("\n\n")),
        keyboard: keyboardTable(accessibility),
        accessibility: accessibility.replace(keyboardTable(accessibility), "").trim(),
        styling: sectionText(parts, "styling"),
        guidelines: sectionText(parts, "guidelines"),
        markdown: page.markdown,
      };
    }),
  );
}

/** CSS rules from docs.css that a pattern's example needs (its `pattern-*` classes), or "". */
function patternCss(source) {
  const classes = new Set([...source.matchAll(/className="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/)).filter((c) => c.startsWith("pattern-")));
  if (classes.size === 0) return "";
  const lines = readFileSync(path.join(docsRoot, "app/docs.css"), "utf8").replace(/\r\n/g, "\n").split("\n");
  const start = lines.findIndex((l) => [...classes].some((c) => l.includes(`.${c}`)));
  if (start === -1) throw new Error(`[ai] no CSS found for ${[...classes].join(", ")}`);
  const from = lines[start - 1]?.startsWith("/*") ? start - 1 : start;
  let end = start;
  let depth = 0;
  while (end < lines.length) {
    const line = lines[end];
    if (depth === 0 && end > start && (line.trim() === "" || (line.startsWith("/*") && !line.includes("pattern-")))) break;
    if (depth === 0 && end > start && /^\.[\w-]+/.test(line) && !line.includes(".pattern-")) break;
    depth += (line.match(/\{/g) ?? []).length - (line.match(/\}/g) ?? []).length;
    end += 1;
  }
  return lines.slice(from, end).join("\n").trim() + "\n";
}

function patterns(pages) {
  const byHref = new Map(pages.map((p) => [p.href, p]));
  return PATTERNS.map((p) => {
    const page = byHref.get(p.href);
    if (!page) throw new Error(`[ai] pattern page ${p.href} missing`);
    const file = path.join(docsRoot, "examples/patterns", p.file);
    const source = publishedNames(readFileSync(file, "utf8").replace(/\r\n/g, "\n"));
    const dependencies = [...new Set([...source.matchAll(/from "([^".][^"]*)"/g)].map((m) => m[1].split("/").slice(0, m[1].startsWith("@") ? 2 : 1).join("/")))]
      .filter((d) => d !== "react")
      .sort();
    return {
      slug: p.slug,
      aliases: p.aliases,
      title: page.title,
      description: page.description,
      url: page.url,
      file: p.file,
      source,
      css: patternCss(source),
      dependencies,
      markdown: page.markdown,
    };
  });
}

function setups(pages) {
  const byHref = new Map(pages.map((p) => [p.href, p]));
  const installation = byHref.get("/docs/installation");
  return SETUPS.map((s) => {
    const page = byHref.get(s.href);
    if (!page || !installation) throw new Error(`[ai] setup page ${s.href} missing`);
    return { framework: s.framework, title: s.title, url: page.url, markdown: page.markdown, installation: installation.markdown };
  });
}

/** Resolved light and dark values for every `--mrd-*` token, using the @meridui/tokens build pipeline. */
export async function tokens() {
  const parse = await import(pathToFileURL(path.join(repoRoot, "packages/tokens/scripts/parse.mjs")).href);
  const build = await import(pathToFileURL(path.join(repoRoot, "packages/tokens/scripts/build.mjs")).href);
  const css = readFileSync(path.join(repoRoot, "packages/react/styles/tokens.css"), "utf8");
  const scopes = {};
  for (const d of parse.parseDeclarations(css)) {
    const scope = parse.scopeOf(d.context);
    if (!scope) throw new Error(`[ai] unrecognised token scope for ${d.name}`);
    scopes[scope] = { ...scopes[scope], [d.name]: d.value };
  }
  const modes = build.resolveModes(scopes);
  return Object.keys(modes.light)
    .filter((name) => name.startsWith("--mrd-"))
    .sort()
    .map((name) => {
      const light = modes.light[name];
      const type = parse.typeOf(name, light);
      return { name, category: parse.groupOf(name, type)[0], type, light, dark: modes.dark[name] ?? light };
    });
}

/** The full data set. `generatedAt` is left out so builds are reproducible. */
export async function buildAiData() {
  const pages = readPages("en");
  const pkg = JSON.parse(readFileSync(path.join(repoRoot, "packages/react/package.json"), "utf8"));
  return {
    schema: 1,
    site: SITE_URL,
    reactVersion: pkg.version,
    rules: readRules(),
    designContract: publishedNames(readDesignContract()),
    components: components(pages),
    tokens: await tokens(),
    patterns: patterns(pages),
    setups: setups(pages),
    pages: pages.map(({ href, url, group, navTitle, title, description, markdown }) => ({ href, url, group, navTitle, title, description, markdown })),
  };
}

