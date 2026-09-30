import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export type Framework = "next" | "vite" | "react-router";
export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

export const FRAMEWORK_NAMES: Readonly<Record<Framework, string>> = {
  next: "Next.js (App Router)",
  vite: "Vite",
  "react-router": "React Router (framework mode)",
};

export interface PackageJson {
  readonly name?: string;
  readonly packageManager?: string;
  readonly dependencies?: Readonly<Record<string, string>>;
  readonly devDependencies?: Readonly<Record<string, string>>;
}

export interface Project {
  readonly root: string;
  readonly pkg: PackageJson;
  readonly framework: Framework | undefined;
  readonly packageManager: PackageManager;
  /** File that should import the stylesheet (root layout, main entry or root route), relative to root. */
  readonly entry: string | undefined;
  /** Where `merid add` puts patterns, relative to root. */
  readonly componentsDir: string;
}

export function readPackageJson(root: string): PackageJson {
  const file = path.join(root, "package.json");
  if (!existsSync(file)) throw new Error(`No package.json in ${root}. Run this inside a React project.`);
  try {
    return JSON.parse(readFileSync(file, "utf8")) as PackageJson;
  } catch (error) {
    throw new Error(`package.json in ${root} is not valid JSON`, { cause: error });
  }
}

export const hasDep = (pkg: PackageJson, name: string): boolean => Boolean(pkg.dependencies?.[name] ?? pkg.devDependencies?.[name]);

const firstExisting = (root: string, candidates: readonly string[]): string | undefined =>
  candidates.find((c) => existsSync(path.join(root, c)));

const withExts = (base: string) => ["tsx", "jsx", "ts", "js"].map((ext) => `${base}.${ext}`);

export function detectFramework(root: string, pkg: PackageJson): Framework | undefined {
  if (hasDep(pkg, "next")) return "next";
  if (hasDep(pkg, "@react-router/dev") || firstExisting(root, ["react-router.config.ts", "react-router.config.js"])) return "react-router";
  if (hasDep(pkg, "vite") || firstExisting(root, withExts("vite.config").concat(["vite.config.mts", "vite.config.mjs"]))) return "vite";
  return undefined;
}

const LOCKFILES: readonly [string, PackageManager][] = [
  ["pnpm-lock.yaml", "pnpm"],
  ["yarn.lock", "yarn"],
  ["bun.lock", "bun"],
  ["bun.lockb", "bun"],
  ["package-lock.json", "npm"],
];

/** `packageManager` field first, then the nearest lockfile (walking up for monorepos), then npm. */
export function detectPackageManager(root: string, pkg: PackageJson): PackageManager {
  const declared = /^(npm|pnpm|yarn|bun)@/.exec(pkg.packageManager ?? "")?.[1] as PackageManager | undefined;
  if (declared) return declared;
  let dir = path.resolve(root);
  for (;;) {
    for (const [file, pm] of LOCKFILES) if (existsSync(path.join(dir, file))) return pm;
    const parent = path.dirname(dir);
    if (parent === dir) return "npm";
    dir = parent;
  }
}

export function detectEntry(root: string, framework: Framework | undefined): string | undefined {
  switch (framework) {
    case "next":
      return firstExisting(root, [...withExts("app/layout"), ...withExts("src/app/layout")]);
    case "react-router":
      return firstExisting(root, [...withExts("app/root"), ...withExts("src/root")]);
    case "vite":
      return firstExisting(root, [...withExts("src/main"), ...withExts("src/index"), ...withExts("main")]);
    default:
      return undefined;
  }
}

function componentsDirFor(root: string, framework: Framework | undefined): string {
  if (framework === "react-router") return "app/components/merid";
  if (framework === "next" && !existsSync(path.join(root, "src"))) return "components/merid";
  return "src/components/merid";
}

export function detectProject(root: string): Project {
  const pkg = readPackageJson(root);
  const framework = detectFramework(root, pkg);
  return {
    root,
    pkg,
    framework,
    packageManager: detectPackageManager(root, pkg),
    entry: detectEntry(root, framework),
    componentsDir: componentsDirFor(root, framework),
  };
}

/** The command that adds runtime dependencies with this package manager. */
export function installCommand(pm: PackageManager, packages: readonly string[]): { command: string; args: string[] } {
  const verb = pm === "npm" ? "install" : "add";
  return { command: pm, args: [verb, ...packages] };
}
