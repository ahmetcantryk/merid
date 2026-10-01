// Generates /llms.txt, /llms-full.txt, /tr/llms.txt and a Markdown copy of every docs page
// (/docs/components/button.md, /tr/docs/usage.md, …) into public/. Runs before `next dev` and `next build`.
// Format: https://llmstxt.org. Output is gitignored (see apps/docs/.gitignore).
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SITE_URL, readDesignContract, readPages, readRules } from "../../../ai/lib/docs.mjs";
import { publishedNames } from "../../../ai/lib/mdx.mjs";

const publicDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../public");

/** Pages an agent can skip when context is short (llms.txt "Optional" section). */
const OPTIONAL = new Set(["/docs/changelog", "/docs/roadmap", "/docs/contributing", "/docs/versioning", "/docs/brand", "/docs/browser-support"]);

const COPY = {
  en: {
    summary:
      "Merid is an accessible React component library (`@meridui/react`) built on plain CSS, cascade layers and `--mrd-*` design tokens: 1px hairlines and ink rules, one magenta accent, square-cut 2px corners and short motion. React 18 and 19, server components, light and dark themes.",
    intro: [
      "Install with `npm i @meridui/react` and import `@meridui/react/styles.css` once at the app entry, or run `npx @meridui/cli init`. Every component is imported from the package root.",
      "Write Merid code with semantic `--mrd-*` tokens only: no raw hex colours, arbitrary spacing or inline styles. Compose existing components before creating new ones. The full rules are in [Using Merid with AI](" + SITE_URL + "/docs/ai.md) and at the top of [llms-full.txt](" + SITE_URL + "/llms-full.txt).",
      "MCP server for coding agents: `npx -y @meridui/mcp` (tools: list_components, get_component, search_docs, get_tokens, get_design_contract, get_pattern, get_setup).",
    ],
    optional: "Optional",
    contract: "Design contract",
    contractNote: "Binding rules for colour, radius, shadow, typography and naming",
  },
  tr: {
    summary:
      "Merid, düz CSS, cascade layer'lar ve `--mrd-*` design token'ları üzerine kurulu, erişilebilir bir React component kütüphanesi (`@meridui/react`): 1px çizgiler ve koyu mürekkep çizgileri, tek bir magenta accent, 2px köşeler ve kısa hareketler. React 18 ve 19, server component'ler, açık ve koyu tema.",
    intro: [
      "`npm i @meridui/react` ile kur ve `@meridui/react/styles.css` dosyasını uygulamanın girişinde bir kez import et ya da `npx @meridui/cli init` çalıştır. Tüm component'ler paket kökünden import edilir.",
      "Merid kodunu yalnızca semantik `--mrd-*` token'larıyla yaz: ham hex renk, keyfi boşluk ve inline stil yok. Yeni component yazmadan önce var olanları birleştir. Kuralların tamamı [AI ile kullanım](" + SITE_URL + "/tr/docs/ai.md) sayfasında.",
      "Kod yazan agent'lar için MCP server: `npx -y @meridui/mcp`. İngilizce dokümanların tamamı: " + SITE_URL + "/llms-full.txt",
    ],
    optional: "Optional",
    contract: "Tasarım sözleşmesi",
    contractNote: "Renk, köşe yuvarlaklığı, gölge, tipografi ve adlandırma kuralları (İngilizce)",
  },
};

function index(locale, pages) {
  const t = COPY[locale];
  const groups = new Map();
  const optional = [];
  for (const page of pages) {
    const line = `- [${page.navTitle}](${SITE_URL}${page.mdPath})${page.description ? `: ${page.description}` : ""}`;
    if (OPTIONAL.has(page.href)) optional.push(line);
    else groups.set(page.group, [...(groups.get(page.group) ?? []), line]);
  }
  optional.push(`- [${t.contract}](${SITE_URL}/design.md): ${t.contractNote}`);
  const sections = [...groups].map(([group, lines]) => `## ${group}\n\n${lines.join("\n")}`);
  return `# Merid\n\n> ${t.summary}\n\n${t.intro.join("\n\n")}\n\n${sections.join("\n\n")}\n\n## ${t.optional}\n\n${optional.join("\n")}\n`;
}

function full(pages) {
  const parts = [
    `# Merid\n\n> ${COPY.en.summary}\n\nThis file contains the AI rules, the design contract and every page of the English docs at ${SITE_URL}/docs. Each page starts with its source URL.`,
    `<!-- Source: ${SITE_URL}/docs/ai -->\n${readRules().trim()}`,
    `<!-- Source: ${SITE_URL}/design.md -->\n${publishedNames(readDesignContract()).trim()}`,
    ...pages.map((p) => `<!-- Source: ${p.url} -->\n${p.markdown.trim()}`),
  ];
  return parts.join("\n\n---\n\n") + "\n";
}

async function write(rel, text) {
  const file = path.join(publicDir, rel);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, text);
}

const en = readPages("en");
const tr = readPages("tr");

// Clear previous output so removed pages do not linger.
await Promise.all(["docs", "tr/docs", "llms.txt", "llms-full.txt", "tr/llms.txt", "design.md"].map((p) => rm(path.join(publicDir, p), { recursive: true, force: true })));

await write("llms.txt", index("en", en));
await write("llms-full.txt", full(en));
await write("tr/llms.txt", index("tr", tr));
await write("design.md", publishedNames(readDesignContract()));
for (const page of [...en, ...tr]) {
  await write(page.mdPath.slice(1), `${page.markdown.trim()}\n\n---\n\nSource: ${page.url}\n`);
}
console.log(`[docs] llms.txt: ${en.length} en + ${tr.length} tr pages as Markdown`);
