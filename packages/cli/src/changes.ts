// Planned file changes: show a diff first, never overwrite without consent, honour --dry-run.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { unifiedDiff } from "./diff.js";
import { color, colorDiff, type Io } from "./io.js";

export interface Change {
  /** Path relative to the project root, with forward slashes. */
  readonly file: string;
  readonly after: string;
  readonly reason: string;
  /** Extra lines printed under the file name, e.g. what each removed rule did. */
  readonly details?: readonly string[];
  /** Asked before an existing file is changed. Defaults to "Update <file>?". */
  readonly question?: string;
}

export interface ApplyOptions {
  readonly root: string;
  readonly io: Io;
  readonly yes: boolean;
  readonly dryRun: boolean;
}

export type Outcome = "written" | "created" | "unchanged" | "skipped" | "planned";

export function readIfExists(root: string, file: string): string | undefined {
  const full = path.join(root, file);
  return existsSync(full) ? readFileSync(full, "utf8") : undefined;
}

/**
 * Shows each change as a diff, then writes it. Existing files are only overwritten after an explicit
 * yes (or `--yes`); in a non-interactive session without `--yes` they are skipped. New files are created
 * after the command-level confirmation the caller already asked for.
 */
export async function applyChanges(changes: readonly Change[], opts: ApplyOptions): Promise<Map<string, Outcome>> {
  const outcomes = new Map<string, Outcome>();
  for (const change of changes) {
    const before = readIfExists(opts.root, change.file);
    if (before === change.after) {
      opts.io.log(`${color.dim("=")} ${change.file} ${color.dim("(already up to date)")}`);
      outcomes.set(change.file, "unchanged");
      continue;
    }
    const exists = before !== undefined;
    opts.io.log(`\n${color.bold(exists ? "~" : "+")} ${color.bold(change.file)} ${color.dim(`— ${change.reason}`)}`);
    for (const detail of change.details ?? []) opts.io.log(color.dim(`    ${detail}`));
    opts.io.log(colorDiff(unifiedDiff(before ?? "", change.after, change.file)));
    if (opts.dryRun) {
      outcomes.set(change.file, "planned");
      continue;
    }
    if (exists && !opts.yes) {
      const ok = await opts.io.confirm(change.question ?? `Update ${change.file}?`, false);
      if (!ok) {
        opts.io.log(color.dim(`  skipped ${change.file}${opts.io.interactive ? "" : " (non-interactive; pass --yes to apply)"}`));
        outcomes.set(change.file, "skipped");
        continue;
      }
    }
    const full = path.join(opts.root, change.file);
    mkdirSync(path.dirname(full), { recursive: true });
    writeFileSync(full, change.after);
    outcomes.set(change.file, exists ? "written" : "created");
  }
  return outcomes;
}
