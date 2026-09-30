import { readFileSync } from "node:fs";
import path from "node:path";
import { UsageError, parseArgs } from "./args.js";
import { addCommand } from "./commands/add.js";
import type { Context } from "./commands/context.js";
import { doctorCommand } from "./commands/doctor.js";
import { initCommand } from "./commands/init.js";
import { mcpCommand } from "./commands/mcp.js";
import { loadData, type CliData } from "./data.js";
import { runCommand, terminalIo, type Io, type Runner } from "./io.js";

export const HELP = `merid — set up Merid (@meridui/react) and its AI tooling

Usage
  npx @meridui/cli <command> [options]

Commands
  init              Install @meridui/react, import the stylesheet, add AI rules and MCP config
  add <pattern>     Copy a docs pattern into the project (app-shell, settings, auth, data-table, …)
  mcp               Write the Merid MCP server config (.mcp.json, .cursor/mcp.json, .vscode/mcp.json)
  doctor            Check the setup

Options
  -y, --yes         Accept every prompt, including overwriting files (diffs are still printed)
  --dry-run         Print the diffs and commands; write and run nothing
  --rules, --no-rules   init: add (or skip) AGENTS.md, .cursor/rules/merid.mdc and CLAUDE.md
  --mcp, --no-mcp       init: add (or skip) MCP config
  --client <list>   init, mcp: claude, cursor, vscode or all (default all)
  --dir <path>      add: target folder (default components/merid or src/components/merid)
  --no-install      Do not run the package manager
  --cwd <path>      Project folder (default: current directory)
  -h, --help        Show this help
  -v, --version     Show the version

Docs: https://meridui.dev/docs/cli`;

export interface RunOptions {
  readonly io?: Io;
  readonly run?: Runner;
  readonly data?: CliData;
  readonly cwd?: string;
}

function version(): string {
  return (JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as { version: string }).version;
}

/** Entry used by the bin and by tests. Returns the exit code; never calls process.exit. */
export async function main(argv: readonly string[], opts: RunOptions = {}): Promise<number> {
  const io = opts.io ?? terminalIo();
  try {
    const parsed = parseArgs(argv);
    if (parsed.version) {
      io.log(version());
      return 0;
    }
    if (parsed.help || !parsed.command) {
      io.log(HELP);
      return parsed.command || parsed.help ? 0 : 1;
    }
    const ctx: Context = {
      cwd: path.resolve(opts.cwd ?? process.cwd(), parsed.cwd ?? "."),
      io,
      flags: parsed.flags,
      data: opts.data ?? loadData(),
      run: opts.run ?? runCommand,
    };
    switch (parsed.command) {
      case "init":
        return await initCommand(ctx);
      case "add":
        return await addCommand(ctx, parsed.positionals);
      case "mcp":
        return await mcpCommand(ctx);
      case "doctor":
        return await doctorCommand(ctx);
      default:
        throw new UsageError(`Unknown command "${parsed.command}".`);
    }
  } catch (error) {
    if (error instanceof UsageError) {
      io.error(error.message);
      io.log("Run `npx @meridui/cli --help` for usage.");
      return 2;
    }
    io.error(error instanceof Error ? error.message : String(error));
    return 1;
  }
}
