// Pure, read-only query functions over the bundled data. Each returns Markdown for the agent.
import type { ComponentDoc, MeridData, PatternDoc, TokenDoc } from "./data.js";

export interface ToolText {
  readonly text: string;
  readonly isError?: boolean;
}

const norm = (s: string) => s.toLowerCase().replace(/[\s_.-]+/g, "");

function closest(query: string, names: readonly string[], max = 5): string[] {
  const q = norm(query);
  return names.filter((n) => norm(n).includes(q) || q.includes(norm(n))).slice(0, max);
}

const notFound = (kind: string, query: string, names: readonly string[]): ToolText => {
  const near = closest(query, names);
  const hint = near.length > 0 ? `Did you mean: ${near.join(", ")}?` : `Available: ${names.join(", ")}.`;
  return { text: `No ${kind} named "${query}". ${hint}`, isError: true };
};

export function componentCategories(data: MeridData): string[] {
  return [...new Set(data.components.map((c) => c.category))];
}

export function listComponents(data: MeridData, category?: string): ToolText {
  const categories = componentCategories(data);
  const wanted = category ? categories.filter((c) => norm(c) === norm(category)) : categories;
  if (category && wanted.length === 0) return notFound("category", category, categories);
  const blocks = wanted.map((cat) => {
    const rows = data.components
      .filter((c) => c.category === cat)
      .map((c) => `- **${c.name}** (\`${c.slug}\`): ${c.description}`);
    return `## ${cat}\n\n${rows.join("\n")}`;
  });
  const total = data.components.filter((c) => wanted.includes(c.category)).length;
  return {
    text: `# Merid components (${total})\n\nAll are exported from \`@meridui/react\`. Call \`get_component\` with a name for props, examples, keyboard and accessibility.\n\n${blocks.join("\n\n")}\n`,
  };
}

export function findComponent(data: MeridData, name: string): ComponentDoc | undefined {
  const key = norm(name.replace(/^<|\/?>$/g, "").split(".")[0] ?? name);
  return data.components.find((c) => norm(c.name) === key || norm(c.slug) === key);
}

export type ComponentSection = "all" | "props" | "examples" | "accessibility";

export function getComponent(data: MeridData, name: string, section: ComponentSection = "all"): ToolText {
  const c = findComponent(data, name);
  if (!c) return notFound("component", name, data.components.map((x) => x.name));
  const parts: string[] = [`# ${c.name}`, `${c.summary || c.description}`, `Category: ${c.category} · Status: ${c.status} · Docs: ${c.url}`];
  parts.push(`## Import\n\n\`\`\`tsx\n${c.import}\n\`\`\``);
  if (section === "all" || section === "examples") {
    const examples = c.examples.map((e) => `\`\`\`${e.lang}\n${e.code}\n\`\`\``).join("\n\n");
    if (examples) parts.push(`## Examples\n\n${examples}`);
  }
  if ((section === "all" || section === "props") && c.api) parts.push(`## Props\n\n${c.api}`);
  if (section === "all" || section === "accessibility") {
    if (c.keyboard) parts.push(`## Keyboard\n\n${c.keyboard}`);
    if (c.accessibility) parts.push(`## Accessibility\n\n${c.accessibility}`);
  }
  if (section === "all") {
    if (c.styling) parts.push(`## Styling hooks\n\n${c.styling}`);
    if (c.guidelines) parts.push(`## Guidelines\n\n${c.guidelines}`);
  }
  return { text: parts.join("\n\n") + "\n" };
}

interface Hit {
  readonly score: number;
  readonly title: string;
  readonly url: string;
  readonly snippet: string;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/`/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");

function count(haystack: string, term: string): number {
  let n = 0;
  let i = haystack.indexOf(term);
  while (i !== -1) {
    n += 1;
    i = haystack.indexOf(term, i + term.length);
  }
  return n;
}

function snippetOf(text: string, terms: readonly string[]): string {
  const flat = text.replace(/```[\s\S]*?```/g, " ").replace(/\s+/g, " ").trim();
  const lower = flat.toLowerCase();
  const at = Math.max(0, Math.min(...terms.map((t) => lower.indexOf(t)).filter((i) => i >= 0), flat.length));
  const start = Math.max(0, at - 80);
  const cut = flat.slice(start, start + 240);
  return (start > 0 ? "…" : "") + cut + (start + 240 < flat.length ? "…" : "");
}

export function searchDocs(data: MeridData, query: string, limit = 8): ToolText {
  const terms = query
    .toLowerCase()
    .split(/[^\p{L}\p{N}-]+/u)
    .filter((t) => t.length > 1);
  if (terms.length === 0) return { text: "Query is empty. Pass one or more words, e.g. \"dialog focus\".", isError: true };
  const hits: Hit[] = [];
  for (const page of data.pages) {
    const chunks = page.markdown.split(/\n(?=## )/);
    for (const chunk of chunks) {
      const heading = /^## (.+)$/m.exec(chunk)?.[1]?.trim();
      const body = chunk.toLowerCase();
      const title = page.title.toLowerCase();
      const head = (heading ?? "").toLowerCase();
      let score = 0;
      let matched = 0;
      for (const term of terms) {
        const inBody = count(body, term);
        const titleScore = norm(title) === norm(term) ? 10 : title.includes(term) ? 4 : 0;
        const s = titleScore + (head.includes(term) ? 3 : 0) + Math.min(inBody, 5);
        if (s > 0) matched += 1;
        score += s;
      }
      if (score === 0) continue;
      score *= matched / terms.length; // favour sections that match every term
      hits.push({
        score,
        title: heading ? `${page.title} › ${heading}` : page.title,
        url: heading ? `${page.url}#${slugify(heading)}` : page.url,
        snippet: snippetOf(chunk.replace(/^#{1,2} .+$/gm, ""), terms),
      });
    }
  }
  const top = hits.sort((a, b) => b.score - a.score).slice(0, limit);
  if (top.length === 0) return { text: `No results for "${query}". Try a component name or a broader word.` };
  const lines = top.map((h, i) => `${i + 1}. **${h.title}**, ${h.url}\n   ${h.snippet}`);
  return { text: `# Search: ${query}\n\n${lines.join("\n\n")}\n\nMarkdown for any page: append \`.md\` to its URL.\n` };
}

export type Theme = "light" | "dark" | "both";

export function tokenCategories(data: MeridData): string[] {
  return [...new Set(data.tokens.map((t) => t.category))];
}

export function getTokens(data: MeridData, category?: string, theme: Theme = "both"): ToolText {
  const categories = tokenCategories(data);
  if (category && !categories.includes(category)) return notFound("token category", category, categories);
  const wanted = category ? [category] : categories;
  const row = (t: TokenDoc) => {
    if (theme === "light") return `| \`${t.name}\` | \`${t.light}\` |`;
    if (theme === "dark") return `| \`${t.name}\` | \`${t.dark}\` |`;
    return `| \`${t.name}\` | \`${t.light}\` | ${t.dark === t.light ? "same" : `\`${t.dark}\``} |`;
  };
  const header = theme === "both" ? "| Token | Light | Dark |\n| --- | --- | --- |" : `| Token | ${theme === "light" ? "Light" : "Dark"} |\n| --- | --- |`;
  const blocks = wanted.map((cat) => `## ${cat}\n\n${header}\n${data.tokens.filter((t) => t.category === cat).map(row).join("\n")}`);
  const note =
    "Use these as CSS variables, e.g. `color: var(--mrd-ink)`. Values resolve per theme (`data-theme`) and accent (`data-accent`). Components and app CSS should read semantic tokens, never the raw values or the `palette` primitives.";
  return { text: `# Merid tokens${category ? `: ${category}` : ""}\n\n${note}\n\n${blocks.join("\n\n")}\n` };
}

export function getDesignContract(data: MeridData, section?: string): ToolText {
  if (!section) return { text: `${data.designContract.trim()}\n\n---\n\n${data.rules.trim()}\n` };
  const parts = data.designContract.split(/\n(?=## )/);
  const headings = parts.map((p) => /^## (.+)$/m.exec(p)?.[1]?.trim()).filter((h): h is string => Boolean(h));
  const match = parts.find((p) => norm(/^## (.+)$/m.exec(p)?.[1] ?? "") === norm(section));
  if (norm(section) === "rules" || norm(section) === "airules") return { text: data.rules };
  if (!match) return notFound("design contract section", section, [...headings, "rules"]);
  return { text: match.trim() + "\n" };
}

export function findPattern(data: MeridData, name: string): PatternDoc | undefined {
  const key = norm(name);
  return data.patterns.find((p) => norm(p.slug) === key || p.aliases.some((a) => norm(a) === key) || norm(p.title) === key);
}

export function getPattern(data: MeridData, name?: string): ToolText {
  if (!name) {
    const rows = data.patterns.map((p) => `- **${p.slug}**: ${p.title}. ${p.description}`);
    return { text: `# Merid patterns\n\nCall \`get_pattern\` with a name for the guide and full source. Or copy one into a project with \`npx @meridui/cli add <name>\`.\n\n${rows.join("\n")}\n` };
  }
  const p = findPattern(data, name);
  if (!p) return notFound("pattern", name, data.patterns.map((x) => x.slug));
  const deps = p.dependencies.length > 0 ? `Dependencies: ${p.dependencies.map((d) => `\`${d}\``).join(", ")}` : "";
  const css = p.css ? `\n\n## CSS (${p.slug}.css)\n\n\`\`\`css\n${p.css.trim()}\n\`\`\`` : "";
  return {
    text: `${p.markdown.trim()}\n\n---\n\n## Full source (${p.file})\n\nCopy with \`npx @meridui/cli add ${p.slug}\`. ${deps}\n\n\`\`\`tsx\n${p.source.trim()}\n\`\`\`${css}\n`,
  };
}

export const FRAMEWORKS = ["next", "vite", "react-router"] as const;
export type Framework = (typeof FRAMEWORKS)[number];

export function getSetup(data: MeridData, framework: Framework): ToolText {
  const s = data.setups.find((x) => x.framework === framework);
  if (!s) return notFound("framework", framework, data.setups.map((x) => x.framework));
  const quick = [
    "## Quick start",
    "",
    "```bash",
    "npx @meridui/cli init",
    "```",
    "",
    "Detects the framework and package manager, installs `@meridui/react`, adds the stylesheet import and (optionally) the AI rules and MCP config. Or do it by hand, below.",
  ].join("\n");
  return { text: `# Set up Merid with ${s.title}\n\n${quick}\n\n${s.markdown.trim()}\n\n---\n\n${s.installation.trim()}\n` };
}
