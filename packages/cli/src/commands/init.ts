import { applyChanges, readIfExists, type Change } from "../changes.js";
import { addStylesImport, cursorRule, upsertSection } from "../content.js";
import { REACT_PACKAGE, STYLES_IMPORT } from "../data.js";
import { FRAMEWORK_NAMES, detectProject, hasDep, installCommand, type Project } from "../detect.js";
import { color } from "../io.js";
import { choose, type Context } from "./context.js";
import { mcpChanges, parseClients, printOtherClients } from "./mcp.js";

export const RULE_FILES = ["AGENTS.md", ".cursor/rules/merid.mdc", "CLAUDE.md"] as const;

export function rulesChanges(ctx: Context): Change[] {
  const rules = ctx.data.rules;
  return [
    { file: "AGENTS.md", after: upsertSection(readIfExists(ctx.cwd, "AGENTS.md"), rules), reason: "Merid rules for AI agents (Codex, Cursor, Copilot, …)" },
    { file: ".cursor/rules/merid.mdc", after: cursorRule(rules), reason: "Cursor project rule" },
    { file: "CLAUDE.md", after: upsertSection(readIfExists(ctx.cwd, "CLAUDE.md"), rules), reason: "Merid section for Claude Code" },
  ];
}

function stylesChange(ctx: Context, project: Project): Change | undefined {
  if (!project.entry) {
    ctx.io.warn(`Could not find the app entry. Add \`import "${STYLES_IMPORT}";\` to your root layout or main file.`);
    return undefined;
  }
  const before = readIfExists(ctx.cwd, project.entry) ?? "";
  return { file: project.entry, after: addStylesImport(before), reason: "import Merid's stylesheet once, at the app entry" };
}

function describe(ctx: Context, project: Project): void {
  ctx.io.log(color.bold("Merid init"));
  ctx.io.log(`  project:          ${project.pkg.name ?? ctx.cwd}`);
  ctx.io.log(`  framework:        ${project.framework ? FRAMEWORK_NAMES[project.framework] : color.yellow("not detected")}`);
  ctx.io.log(`  package manager:  ${project.packageManager}`);
  ctx.io.log(`  entry:            ${project.entry ?? color.yellow("not found")}`);
}

async function install(ctx: Context, project: Project): Promise<boolean> {
  if (hasDep(project.pkg, REACT_PACKAGE)) {
    ctx.io.log(`${color.dim("=")} ${REACT_PACKAGE} is already a dependency`);
    return true;
  }
  const { command, args } = installCommand(project.packageManager, [REACT_PACKAGE]);
  const line = `${command} ${args.join(" ")}`;
  if (ctx.flags.dryRun || !ctx.flags.install) {
    ctx.io.log(`${color.dim("$")} ${line} ${color.dim(ctx.flags.dryRun ? "(dry run, not run)" : "(--no-install, run it yourself)")}`);
    return true;
  }
  if (!(await choose(ctx, undefined, `Run \`${line}\`?`))) {
    ctx.io.log(color.dim(`  skipped; run \`${line}\` yourself`));
    return true;
  }
  const status = ctx.run(command, args, ctx.cwd);
  if (status !== 0) {
    ctx.io.error(`\`${line}\` failed (exit ${status}).`);
    return false;
  }
  return true;
}

export async function initCommand(ctx: Context): Promise<number> {
  const project = detectProject(ctx.cwd);
  describe(ctx, project);
  if (!project.framework) {
    ctx.io.warn("\nNo Next.js, Vite or React Router project found here. Merid still works; see https://meridui.dev/docs/installation.");
  }
  if (!ctx.flags.yes && !ctx.flags.dryRun && !(await ctx.io.confirm("\nContinue?", true))) return 1;

  const withRules = await choose(ctx, ctx.flags.rules, "Add AI rules (AGENTS.md, .cursor/rules/merid.mdc, CLAUDE.md)?");
  const withMcp = await choose(ctx, ctx.flags.mcp, "Add the Merid MCP server for Claude Code, Cursor and VS Code?");

  const ok = await install(ctx, project);
  const styles = stylesChange(ctx, project);
  const changes = [
    ...(styles ? [styles] : []),
    ...(withRules ? rulesChanges(ctx) : []),
    ...(withMcp ? mcpChanges(ctx, parseClients(ctx.flags.clients)) : []),
  ];
  const outcomes = await applyChanges(changes, { root: ctx.cwd, io: ctx.io, yes: ctx.flags.yes, dryRun: ctx.flags.dryRun });
  if (withMcp) printOtherClients(ctx);

  const skipped = [...outcomes].filter(([, o]) => o === "skipped").map(([f]) => f);
  ctx.io.log("");
  if (ctx.flags.dryRun) ctx.io.log("Dry run: nothing was installed or written.");
  else if (skipped.length > 0) ctx.io.warn(`Skipped: ${skipped.join(", ")}.`);
  ctx.io.log(`Next: \`npx @meridui/cli add app-shell\` for a page layout, \`npx @meridui/cli doctor\` to check the setup. Docs: https://meridui.dev/docs`);
  return ok ? 0 : 1;
}
