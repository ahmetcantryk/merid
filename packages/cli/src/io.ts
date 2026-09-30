// Terminal I/O behind an interface so commands can be tested without a TTY.
import { createInterface } from "node:readline/promises";
import { spawnSync } from "node:child_process";

export interface Io {
  log(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  /** Asks a yes/no question. Non-interactive sessions get `fallback`. */
  confirm(question: string, fallback: boolean): Promise<boolean>;
  readonly interactive: boolean;
}

const useColor = process.stdout.isTTY && !process.env.NO_COLOR;
const paint = (code: string) => (text: string) => (useColor ? `\u001b[${code}m${text}\u001b[0m` : text);
export const color = { dim: paint("2"), bold: paint("1"), green: paint("32"), red: paint("31"), yellow: paint("33"), cyan: paint("36") };

export function colorDiff(diff: string): string {
  return diff
    .split("\n")
    .map((l) => (l.startsWith("+") ? color.green(l) : l.startsWith("-") ? color.red(l) : l.startsWith("@@") ? color.cyan(l) : color.dim(l)))
    .join("\n");
}

export function terminalIo(): Io {
  const interactive = Boolean(process.stdin.isTTY && process.stdout.isTTY);
  return {
    interactive,
    log: (m) => console.log(m),
    warn: (m) => console.warn(color.yellow(m)),
    error: (m) => console.error(color.red(m)),
    async confirm(question, fallback) {
      if (!interactive) return fallback;
      const rl = createInterface({ input: process.stdin, output: process.stdout });
      try {
        const answer = (await rl.question(`${question} ${fallback ? "(Y/n)" : "(y/N)"} `)).trim().toLowerCase();
        if (answer === "") return fallback;
        return answer === "y" || answer === "yes";
      } finally {
        rl.close();
      }
    },
  };
}

export type Runner = (command: string, args: readonly string[], cwd: string) => number;

/** Runs a package-manager command with inherited stdio. Uses a shell on Windows so `npm.cmd` and friends resolve. */
export const runCommand: Runner = (command, args, cwd) => {
  const result = spawnSync(command, [...args], { cwd, stdio: "inherit", shell: process.platform === "win32" });
  if (result.error) throw result.error;
  return result.status ?? 1;
};
