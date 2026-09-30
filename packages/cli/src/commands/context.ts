import type { CliData } from "../data.js";
import type { Io, Runner } from "../io.js";

export interface Flags {
  readonly yes: boolean;
  readonly dryRun: boolean;
  /** undefined = ask (or default yes with --yes). */
  readonly rules: boolean | undefined;
  readonly mcp: boolean | undefined;
  readonly install: boolean;
  readonly dir: string | undefined;
  readonly clients: readonly string[] | undefined;
}

export interface Context {
  readonly cwd: string;
  readonly io: Io;
  readonly flags: Flags;
  readonly data: CliData;
  readonly run: Runner;
}

export const defaultFlags: Flags = {
  yes: false,
  dryRun: false,
  rules: undefined,
  mcp: undefined,
  install: true,
  dir: undefined,
  clients: undefined,
};

/** A yes/no choice: an explicit flag wins, then --yes (or --dry-run, to preview everything) means yes, otherwise ask. */
export async function choose(ctx: Context, flag: boolean | undefined, question: string): Promise<boolean> {
  if (flag !== undefined) return flag;
  if (ctx.flags.yes || ctx.flags.dryRun) return true;
  return ctx.io.confirm(question, true);
}
