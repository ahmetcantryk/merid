import { createHighlighter, type Highlighter } from "shiki";

const LANGS = ["tsx", "ts", "jsx", "js", "bash", "css", "json", "html", "yaml", "mdx"] as const;
export type CodeLang = (typeof LANGS)[number];

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-light", "github-dark-dimmed"],
      langs: [...LANGS],
    });
  }
  return highlighterPromise;
}

function normaliseLang(lang: string | undefined): CodeLang {
  const value = (lang ?? "").toLowerCase();
  if (value === "sh" || value === "shell" || value === "zsh") return "bash";
  if (value === "typescript") return "ts";
  if (value === "javascript") return "js";
  return (LANGS as readonly string[]).includes(value) ? (value as CodeLang) : "tsx";
}

export async function highlight(code: string, lang?: string): Promise<string> {
  try {
    const highlighter = await getHighlighter();
    return highlighter.codeToHtml(code.replace(/\n$/, ""), {
      lang: normaliseLang(lang),
      themes: { light: "github-light", dark: "github-dark-dimmed" },
      defaultColor: false,
    });
  } catch (error) {
    console.error("[docs] shiki highlight failed", error);
    const escaped = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `<pre class="shiki"><code>${escaped}</code></pre>`;
  }
}
