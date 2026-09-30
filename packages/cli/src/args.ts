import { defaultFlags, type Flags } from "./commands/context.js";

export interface Parsed {
  readonly command: string | undefined;
  readonly positionals: readonly string[];
  readonly flags: Flags;
  readonly cwd: string | undefined;
  readonly help: boolean;
  readonly version: boolean;
}

export class UsageError extends Error {}

/** Tiny argv parser: `--flag`, `--no-flag`, `--key value`, `--key=value`, `-y`, `-h`, `-v`. */
export function parseArgs(argv: readonly string[]): Parsed {
  const positionals: string[] = [];
  let flags: Flags = { ...defaultFlags };
  let cwd: string | undefined;
  let help = false;
  let version = false;
  const clients: string[] = [];
  for (let i = 0; i < argv.length; i += 1) {
    const raw = argv[i] ?? "";
    const [name, inline] = raw.startsWith("--") && raw.includes("=") ? [raw.slice(0, raw.indexOf("=")), raw.slice(raw.indexOf("=") + 1)] : [raw, undefined];
    const value = () => {
      if (inline !== undefined) return inline;
      const next = argv[i + 1];
      if (next === undefined || next.startsWith("-")) throw new UsageError(`${name} needs a value`);
      i += 1;
      return next;
    };
    switch (name) {
      case "-y":
      case "--yes":
        flags = { ...flags, yes: true };
        break;
      case "--dry-run":
        flags = { ...flags, dryRun: true };
        break;
      case "--rules":
      case "--no-rules":
        flags = { ...flags, rules: name === "--rules" };
        break;
      case "--mcp":
      case "--no-mcp":
        flags = { ...flags, mcp: name === "--mcp" };
        break;
      case "--no-install":
        flags = { ...flags, install: false };
        break;
      case "--dir":
        flags = { ...flags, dir: value() };
        break;
      case "--client":
        clients.push(...value().split(","));
        break;
      case "--cwd":
        cwd = value();
        break;
      case "-h":
      case "--help":
        help = true;
        break;
      case "-v":
      case "--version":
        version = true;
        break;
      default:
        if (name.startsWith("-")) throw new UsageError(`Unknown option ${name}`);
        positionals.push(name);
    }
  }
  return {
    command: positionals[0],
    positionals: positionals.slice(1),
    flags: clients.length > 0 ? { ...flags, clients } : flags,
    cwd,
    help,
    version,
  };
}
