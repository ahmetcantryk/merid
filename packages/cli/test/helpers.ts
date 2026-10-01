import { cpSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach } from "vitest";
import type { Io } from "../src/io.js";

const fixtures = fileURLToPath(new URL("./fixtures/", import.meta.url));
const temps: string[] = [];

afterEach(() => {
  while (temps.length > 0) rmSync(temps.pop() as string, { recursive: true, force: true });
});

/** Projects exactly as the generators write them (only the files the CLI reads). */
export type TemplateFixture = "templates/vite" | "templates/vite-8" | "templates/next" | "templates/next-css" | "templates/react-router";

/** Copies a fixture project into a fresh temp folder that is removed after the test. */
export function copyFixture(name: "next-app" | "vite-app" | "react-router-app" | TemplateFixture): string {
  const dir = mkdtempSync(path.join(tmpdir(), `merid-cli-${name.replace("/", "-")}-`));
  cpSync(path.join(fixtures, name), dir, { recursive: true });
  temps.push(dir);
  return dir;
}

/** Every file under `dir` with its content, for before/after comparisons. */
export function snapshot(dir: string): Record<string, string> {
  const out: Record<string, string> = {};
  const walk = (d: string) => {
    for (const entry of readdirSync(d)) {
      const full = path.join(d, entry);
      if (statSync(full).isDirectory()) walk(full);
      else out[path.relative(dir, full).replace(/\\/g, "/")] = readFileSync(full, "utf8");
    }
  };
  walk(dir);
  return out;
}

export interface MemoryIo extends Io {
  readonly output: string[];
  readonly questions: string[];
}

/** Captures output; answers every question with `answer` (or the fallback when `answer` is undefined). */
export function memoryIo(answer?: boolean | ((question: string) => boolean), interactive = answer !== undefined): MemoryIo {
  const output: string[] = [];
  const questions: string[] = [];
  return {
    output,
    questions,
    interactive,
    log: (m) => output.push(m),
    warn: (m) => output.push(`WARN ${m}`),
    error: (m) => output.push(`ERROR ${m}`),
    async confirm(q, fallback) {
      questions.push(q);
      if (!interactive) return fallback;
      return typeof answer === "function" ? answer(q) : (answer ?? fallback);
    },
  };
}

export const read = (dir: string, file: string) => readFileSync(path.join(dir, file), "utf8");
