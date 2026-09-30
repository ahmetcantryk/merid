// Runs the built bin as a real process against temp copies of the fixtures.
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { copyFixture, snapshot } from "./helpers.js";

const bin = fileURLToPath(new URL("../dist/index.js", import.meta.url));
const run = (args: string[], cwd: string) =>
  spawnSync(process.execPath, [bin, ...args], { cwd, encoding: "utf8", env: { ...process.env, NO_COLOR: "1" }, timeout: 20_000 });

describe("merid bin", () => {
  it.each(["next-app", "vite-app", "react-router-app"] as const)("init --dry-run in %s changes nothing", (fixture) => {
    const dir = copyFixture(fixture);
    const before = snapshot(dir);
    const res = run(["init", "--dry-run"], dir);
    expect(res.status, res.stderr).toBe(0);
    expect(res.stdout).toContain("Dry run: nothing was installed or written.");
    expect(snapshot(dir)).toEqual(before);
  });

  it("init --yes --no-install writes files", () => {
    const dir = copyFixture("vite-app");
    const res = run(["init", "--yes", "--no-install"], dir);
    expect(res.status, res.stderr).toBe(0);
    expect(snapshot(dir)["src/main.tsx"]).toContain('import "@meridui/react/styles.css";');
  });

  it("prints help", () => {
    const res = run(["--help"], copyFixture("vite-app"));
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("npx @meridui/cli <command>");
  });
});
