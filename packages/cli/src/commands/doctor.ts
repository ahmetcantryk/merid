import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { readIfExists } from "../changes.js";
import { MARK_START, MCP_CLIENTS, MCP_CLIENT_NAMES, MCP_FILES, hasMcpServer, hasStylesImport } from "../content.js";
import { REACT_PACKAGE } from "../data.js";
import { FRAMEWORK_NAMES, detectProject, hasDep } from "../detect.js";
import { color } from "../io.js";
import type { Context } from "./context.js";

export type Level = "ok" | "warn" | "fail";

export interface Check {
  readonly level: Level;
  readonly label: string;
  readonly hint?: string;
}

function installedVersion(root: string, name: string): string | undefined {
  let dir = path.resolve(root);
  for (;;) {
    const file = path.join(dir, "node_modules", name, "package.json");
    if (existsSync(file)) {
      try {
        return (JSON.parse(readFileSync(file, "utf8")) as { version?: string }).version;
      } catch {
        return undefined;
      }
    }
    const parent = path.dirname(dir);
    if (parent === dir) return undefined;
    dir = parent;
  }
}

export function runChecks(root: string): Check[] {
  const checks: Check[] = [];
  const project = detectProject(root);
  checks.push(
    project.framework
      ? { level: "ok", label: `Framework: ${FRAMEWORK_NAMES[project.framework]}` }
      : { level: "warn", label: "Framework not detected", hint: "Merid works anywhere React does; init only automates Next.js, Vite and React Router." },
  );

  if (hasDep(project.pkg, "@meridui/react")) {
    checks.push({ level: "warn", label: "Old package name @meridui/react in package.json", hint: `The package is now ${REACT_PACKAGE}. Replace the dependency and imports.` });
  }
  if (!hasDep(project.pkg, REACT_PACKAGE)) {
    checks.push({ level: "fail", label: `${REACT_PACKAGE} is not a dependency`, hint: "Run `npx @meridui/cli init`." });
  } else {
    const version = installedVersion(root, REACT_PACKAGE);
    checks.push(
      version
        ? { level: "ok", label: `${REACT_PACKAGE} ${version} installed` }
        : { level: "fail", label: `${REACT_PACKAGE} is listed but not installed`, hint: `Run ${project.packageManager} install.` },
    );
  }

  const react = installedVersion(root, "react");
  const major = Number(react?.split(".")[0]);
  if (!react) checks.push({ level: "fail", label: "react is not installed" });
  else if (major < 18) checks.push({ level: "fail", label: `react ${react} is too old`, hint: "Merid needs React 18 or 19." });
  else checks.push({ level: "ok", label: `react ${react}` });

  if (!project.entry) checks.push({ level: "warn", label: "App entry not found", hint: "Could not check the stylesheet import." });
  else if (hasStylesImport(readIfExists(root, project.entry) ?? "")) checks.push({ level: "ok", label: `Stylesheet imported in ${project.entry}` });
  else checks.push({ level: "fail", label: `${project.entry} does not import ${REACT_PACKAGE}/styles.css`, hint: "Run `npx @meridui/cli init` or add the import." });

  const rules = ["AGENTS.md", "CLAUDE.md"].filter((f) => readIfExists(root, f)?.includes(MARK_START));
  if (existsSync(path.join(root, ".cursor/rules/merid.mdc"))) rules.push(".cursor/rules/merid.mdc");
  checks.push(
    rules.length > 0
      ? { level: "ok", label: `AI rules: ${rules.join(", ")}` }
      : { level: "warn", label: "No Merid AI rules file", hint: "Run `npx @meridui/cli init --rules` so agents follow the design contract." },
  );

  const mcp = MCP_CLIENTS.filter((c) => hasMcpServer(readIfExists(root, MCP_FILES[c]), c)).map((c) => MCP_CLIENT_NAMES[c]);
  checks.push(
    mcp.length > 0
      ? { level: "ok", label: `MCP server configured for ${mcp.join(", ")}` }
      : { level: "warn", label: "No Merid MCP server configured", hint: "Run `npx @meridui/cli mcp`." },
  );
  return checks;
}

const ICON: Record<Level, string> = { ok: color.green("✓"), warn: color.yellow("!"), fail: color.red("✗") };

export async function doctorCommand(ctx: Context): Promise<number> {
  const checks = runChecks(ctx.cwd);
  ctx.io.log(color.bold("Merid doctor"));
  for (const c of checks) ctx.io.log(`${ICON[c.level]} ${c.label}${c.hint ? color.dim(`\n    ${c.hint}`) : ""}`);
  const failed = checks.filter((c) => c.level === "fail").length;
  ctx.io.log(failed > 0 ? `\n${failed} problem(s) found.` : "\nAll required checks passed.");
  return failed > 0 ? 1 : 0;
}
