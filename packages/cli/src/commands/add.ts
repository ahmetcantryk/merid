import path from "node:path";
import { applyChanges, type Change } from "../changes.js";
import { patternSource } from "../content.js";
import { findPattern, type Pattern } from "../data.js";
import { detectProject, hasDep, installCommand } from "../detect.js";
import { color } from "../io.js";
import { choose, type Context } from "./context.js";

export function listPatterns(ctx: Context): void {
  ctx.io.log("Patterns:");
  for (const p of ctx.data.patterns) ctx.io.log(`  ${p.slug.padEnd(18)} ${p.title}. ${color.dim(p.url)}`);
}

export function patternChanges(pattern: Pattern, dir: string): Change[] {
  const base = pattern.file.replace(/\.tsx$/, "");
  const cssFile = pattern.css ? `${base}.css` : undefined;
  const rel = (f: string) => path.posix.join(dir.replace(/\\/g, "/"), f);
  return [
    { file: rel(pattern.file), after: patternSource(pattern.source, cssFile), reason: `${pattern.title} pattern (${pattern.url})` },
    ...(cssFile ? [{ file: rel(cssFile), after: pattern.css, reason: `styles for ${pattern.title}, tokens only` }] : []),
  ];
}

export async function addCommand(ctx: Context, names: readonly string[]): Promise<number> {
  if (names.length === 0) {
    listPatterns(ctx);
    ctx.io.log("\nUsage: merid add <pattern> [--dir <path>]");
    return 1;
  }
  const patterns: Pattern[] = [];
  for (const name of names) {
    const pattern = findPattern(ctx.data, name);
    if (!pattern) {
      ctx.io.error(`Unknown pattern "${name}".`);
      listPatterns(ctx);
      return 1;
    }
    patterns.push(pattern);
  }
  const project = detectProject(ctx.cwd);
  const dir = ctx.flags.dir ?? project.componentsDir;
  const outcomes = await applyChanges(
    patterns.flatMap((p) => patternChanges(p, dir)),
    { root: ctx.cwd, io: ctx.io, yes: ctx.flags.yes, dryRun: ctx.flags.dryRun },
  );

  const missing = [...new Set(patterns.flatMap((p) => p.dependencies))].filter((d) => !hasDep(project.pkg, d));
  if (missing.length > 0) {
    const { command, args } = installCommand(project.packageManager, missing);
    const line = `${command} ${args.join(" ")}`;
    if (ctx.flags.dryRun || !ctx.flags.install) ctx.io.log(`\n${color.dim("$")} ${line} ${color.dim("(not run)")}`);
    else if (await choose(ctx, undefined, `Install ${missing.join(", ")} with \`${line}\`?`)) {
      const status = ctx.run(command, args, ctx.cwd);
      if (status !== 0) {
        ctx.io.error(`\`${line}\` failed (exit ${status}).`);
        return 1;
      }
    }
  }
  const written = [...outcomes].filter(([, o]) => o === "created" || o === "written").map(([f]) => f);
  if (written.length > 0) ctx.io.log(`\nAdded ${written.join(", ")}. Import the exported component into a page and adapt the sample data.`);
  if (ctx.flags.dryRun) ctx.io.log("\nDry run: nothing was written.");
  return 0;
}
