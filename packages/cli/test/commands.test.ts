import { existsSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { main } from "../src/cli.js";
import { loadData } from "../src/data.js";
import { detectProject } from "../src/detect.js";
import { runChecks } from "../src/commands/doctor.js";
import { copyFixture, memoryIo, read, snapshot } from "./helpers.js";

const data = loadData(new URL("../dist/data.json", import.meta.url));

function recorder() {
  const calls: string[] = [];
  const run = (command: string, args: readonly string[]) => {
    calls.push(`${command} ${args.join(" ")}`);
    return 0;
  };
  return { calls, run };
}

describe("detect", () => {
  it("detects Next.js with pnpm", () => {
    const p = detectProject(copyFixture("next-app"));
    expect(p).toMatchObject({ framework: "next", packageManager: "pnpm", entry: "app/layout.tsx", componentsDir: "components/merid" });
  });

  it("detects Vite with npm", () => {
    const p = detectProject(copyFixture("vite-app"));
    expect(p).toMatchObject({ framework: "vite", packageManager: "npm", entry: "src/main.tsx", componentsDir: "src/components/merid" });
  });

  it("detects React Router before Vite, and yarn from packageManager", () => {
    const p = detectProject(copyFixture("react-router-app"));
    expect(p).toMatchObject({ framework: "react-router", packageManager: "yarn", entry: "app/root.tsx", componentsDir: "app/components/merid" });
  });
});

describe("merid init", () => {
  it("--dry-run writes and runs nothing", async () => {
    const dir = copyFixture("next-app");
    const before = snapshot(dir);
    const { calls, run } = recorder();
    const io = memoryIo();
    expect(await main(["init", "--dry-run"], { cwd: dir, io, run, data })).toBe(0);
    expect(snapshot(dir)).toEqual(before);
    expect(calls).toEqual([]);
    const out = io.output.join("\n");
    expect(out).toContain("pnpm add @meridui/react");
    expect(out).toContain('+import "@meridui/react/styles.css";');
    expect(out).toContain(".mcp.json");
    expect(out).toContain("Dry run");
  });

  it("--yes installs with the detected package manager and writes every file", async () => {
    const dir = copyFixture("next-app");
    const { calls, run } = recorder();
    expect(await main(["init", "--yes"], { cwd: dir, io: memoryIo(), run, data })).toBe(0);
    expect(calls).toEqual(["pnpm add @meridui/react"]);
    expect(read(dir, "app/layout.tsx")).toContain('import "@meridui/react/styles.css";\nimport "./globals.css";');
    expect(read(dir, "AGENTS.md")).toMatch(/^# Fixture\n\nExisting agent notes.\n\n<!-- merid:start -->\n# Merid UI rules/);
    expect(read(dir, "CLAUDE.md")).toContain("# Merid UI rules");
    expect(read(dir, ".cursor/rules/merid.mdc")).toContain("alwaysApply: false");
    expect(JSON.parse(read(dir, ".mcp.json")).mcpServers.merid.args).toEqual(["-y", "@meridui/mcp"]);
    expect(JSON.parse(read(dir, ".cursor/mcp.json")).mcpServers.merid.command).toBe("npx");
    expect(JSON.parse(read(dir, ".vscode/mcp.json")).servers.merid.type).toBe("stdio");
  });

  it("is idempotent", async () => {
    const dir = copyFixture("vite-app");
    const { run } = recorder();
    await main(["init", "--yes", "--no-install"], { cwd: dir, io: memoryIo(), run, data });
    const after = snapshot(dir);
    const io = memoryIo();
    await main(["init", "--yes", "--no-install"], { cwd: dir, io, run, data });
    expect(snapshot(dir)).toEqual(after);
    expect(io.output.filter((l) => l.includes("already up to date")).length).toBeGreaterThanOrEqual(7);
  });

  it("keeps other MCP servers in an existing config", async () => {
    const dir = copyFixture("vite-app");
    await main(["init", "--yes", "--no-install", "--no-rules"], { cwd: dir, io: memoryIo(), run: recorder().run, data });
    const config = JSON.parse(read(dir, ".vscode/mcp.json"));
    expect(Object.keys(config.servers)).toEqual(["github", "merid"]);
    expect(existsSync(path.join(dir, "AGENTS.md"))).toBe(false);
  });

  it("never overwrites an existing file when the answer is no", async () => {
    const dir = copyFixture("next-app");
    const before = read(dir, "AGENTS.md");
    const io = memoryIo(false);
    // Continue? -> no stops everything.
    expect(await main(["init"], { cwd: dir, io, run: recorder().run, data })).toBe(1);
    expect(read(dir, "AGENTS.md")).toBe(before);
    expect(read(dir, "app/layout.tsx")).not.toContain("@meridui/react/styles.css");
  });

  it("asks per existing file and skips it without --yes in a non-interactive shell", async () => {
    const dir = copyFixture("next-app");
    const before = read(dir, "AGENTS.md");
    const io = memoryIo(undefined, false);
    const { calls, run } = recorder();
    expect(await main(["init"], { cwd: dir, io, run, data })).toBe(0);
    expect(read(dir, "AGENTS.md")).toBe(before);
    expect(read(dir, "app/layout.tsx")).not.toContain("@meridui/react/styles.css");
    expect(existsSync(path.join(dir, "CLAUDE.md"))).toBe(true); // new files are created
    expect(io.output.join("\n")).toContain("Skipped: app/layout.tsx, AGENTS.md");
    expect(calls).toEqual(["pnpm add @meridui/react"]);
  });

  it("does not reinstall an existing dependency and fails when install fails", async () => {
    const dir = copyFixture("react-router-app");
    const io = memoryIo();
    const status = await main(["init", "--yes", "--no-rules", "--no-mcp"], { cwd: dir, io, run: () => 1, data });
    expect(status).toBe(1);
    expect(io.output.join("\n")).toContain("yarn add @meridui/react` failed");
  });
});

describe("merid add", () => {
  it("copies a pattern with its CSS and installs missing dependencies", async () => {
    const dir = copyFixture("vite-app");
    const { calls, run } = recorder();
    expect(await main(["add", "app-shell", "--yes"], { cwd: dir, io: memoryIo(), run, data })).toBe(0);
    const tsx = read(dir, "src/components/merid/app-shell.tsx");
    expect(tsx).toContain('import "./app-shell.css";');
    expect(tsx).toContain("@meridui/react");
    expect(read(dir, "src/components/merid/app-shell.css")).toContain(".pattern-shell");
    expect(calls).toEqual(["npm install @meridui/react lucide-react"]);
  });

  it("accepts aliases and --dir", async () => {
    const dir = copyFixture("next-app");
    expect(await main(["add", "authentication", "--dir", "ui", "--yes"], { cwd: dir, io: memoryIo(), run: recorder().run, data })).toBe(0);
    expect(existsSync(path.join(dir, "ui/authentication.tsx"))).toBe(true);
  });

  it("shows a diff and keeps a changed local copy unless confirmed", async () => {
    const dir = copyFixture("next-app");
    mkdirSync(path.join(dir, "components/merid"), { recursive: true });
    writeFileSync(path.join(dir, "components/merid/settings.tsx"), "// my edits\n");
    const io = memoryIo(false);
    await main(["add", "settings"], { cwd: dir, io, run: recorder().run, data });
    expect(read(dir, "components/merid/settings.tsx")).toBe("// my edits\n");
    expect(io.questions).toContain("Update components/merid/settings.tsx?");
    expect(io.output.join("\n")).toContain("-// my edits");
  });

  it("lists patterns for an unknown name", async () => {
    const io = memoryIo();
    expect(await main(["add", "carousel"], { cwd: copyFixture("vite-app"), io, run: recorder().run, data })).toBe(1);
    expect(io.output.join("\n")).toContain("data-table");
  });
});

describe("merid mcp", () => {
  it("writes only the chosen clients", async () => {
    const dir = copyFixture("vite-app");
    expect(await main(["mcp", "--client", "claude", "--yes"], { cwd: dir, io: memoryIo(), run: recorder().run, data })).toBe(0);
    expect(existsSync(path.join(dir, ".mcp.json"))).toBe(true);
    expect(existsSync(path.join(dir, ".cursor/mcp.json"))).toBe(false);
  });

  it("rejects unknown clients", async () => {
    const io = memoryIo();
    expect(await main(["mcp", "--client", "emacs"], { cwd: copyFixture("vite-app"), io, run: recorder().run, data })).toBe(1);
  });
});

describe("merid doctor", () => {
  it("fails before init and passes the file checks after", async () => {
    const dir = copyFixture("next-app");
    const before = runChecks(dir);
    expect(before.find((c) => c.label.includes("is not a dependency"))?.level).toBe("fail");
    expect(before.find((c) => c.label.includes("does not import"))?.level).toBe("fail");

    await main(["init", "--yes", "--no-install"], { cwd: dir, io: memoryIo(), run: recorder().run, data });
    const pkg = JSON.parse(read(dir, "package.json"));
    writeFileSync(path.join(dir, "package.json"), JSON.stringify({ ...pkg, dependencies: { ...pkg.dependencies, "@meridui/react": "^0.1.0" } }));
    const after = runChecks(dir);
    expect(after.find((c) => c.label.startsWith("Stylesheet imported"))?.level).toBe("ok");
    expect(after.find((c) => c.label.startsWith("AI rules"))?.level).toBe("ok");
    expect(after.find((c) => c.label.startsWith("MCP server configured"))?.label).toContain("Claude Code, Cursor, VS Code");
  });

  it("exits non-zero when something required is missing", async () => {
    const io = memoryIo();
    expect(await main(["doctor"], { cwd: copyFixture("vite-app"), io, run: recorder().run, data })).toBe(1);
    expect(io.output.join("\n")).toContain("problem(s) found");
  });
});

describe("usage", () => {
  it("prints help and version, rejects unknown commands", async () => {
    const io = memoryIo();
    expect(await main(["--help"], { io, data })).toBe(0);
    expect(io.output[0]).toContain("add <pattern>");
    expect(await main(["--version"], { io, data })).toBe(0);
    expect(io.output[1]).toMatch(/^\d+\.\d+\.\d+/);
    expect(await main(["deploy"], { io, data })).toBe(2);
  });

  it("errors outside a project", async () => {
    const io = memoryIo();
    const dir = path.join(copyFixture("vite-app"), "src");
    expect(await main(["init", "--yes"], { cwd: dir, io, data })).toBe(1);
    expect(io.output.join("\n")).toContain("No package.json");
  });
});
