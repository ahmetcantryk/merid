import { readFileSync } from "node:fs";
import path from "node:path";
import { CodeBlock } from "./CodeBlock";

/**
 * The official AI rules file, read at build time from `ai/rules.md` at the repository root: the same
 * source `@meridui/cli init` writes into AGENTS.md, CLAUDE.md and .cursor/rules/merid.mdc.
 */
export function AiRules({ title = "AGENTS.md" }: { readonly title?: string }) {
  const rules = readFileSync(path.join(process.cwd(), "..", "..", "ai", "rules.md"), "utf8");
  return <CodeBlock code={rules} lang="mdx" title={title} />;
}
