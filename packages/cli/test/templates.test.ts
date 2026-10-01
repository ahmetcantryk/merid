// init and doctor against projects exactly as the generators write them. The fixtures under
// test/fixtures/templates are unedited output (only the files the CLI reads were kept):
//   vite        npm create vite@latest (create-vite 9.2.1) -- --template react-ts
//   vite-8      create-vite 8.3.0 --template react-ts (the template most existing Vite apps started from)
//   next        npx create-next-app@latest --yes (16.3.8: App Router, Tailwind)
//   next-css    npx create-next-app@latest --no-tailwind (16.3.8)
//   react-router npx create-react-router@latest (8.4.0, Tailwind)
// To refresh them, generate the projects again and copy the same files over.
import { writeFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { main } from "../src/cli.js";
import { runChecks } from "../src/commands/doctor.js";
import { loadData } from "../src/data.js";
import { copyFixture, memoryIo, read, snapshot, type TemplateFixture } from "./helpers.js";

const data = loadData(new URL("../dist/data.json", import.meta.url));
const run = () => 0;
const init = (dir: string, ...flags: string[]) => main(["init", "--no-install", "--no-rules", "--no-mcp", ...flags], { cwd: dir, io: memoryIo(), run, data });
const LAYERS = "@layer theme, base, merid, components, utilities;";

describe("init on generator templates", () => {
  it("Vite: drops the template's global styles and keeps body margin", async () => {
    const dir = copyFixture("templates/vite");
    const appCss = read(dir, "src/App.css");
    expect(await init(dir, "--yes")).toBe(0);
    expect(read(dir, "src/index.css")).toBe("body {\n  margin: 0;\n}\n");
    expect(read(dir, "src/App.css")).toBe(appCss); // only the demo's own ids and classes
    expect(read(dir, "src/main.tsx")).toContain("import { createRoot } from 'react-dom/client'\nimport '@meridui/react/styles.css'\nimport './index.css'\n");
  });

  it("Vite 8 template: drops the button, link and :root rules and the #root column", async () => {
    const dir = copyFixture("templates/vite-8");
    expect(await init(dir, "--yes")).toBe(0);
    expect(read(dir, "src/index.css")).toBe("body {\n  margin: 0;\n}\n");
    const appCss = read(dir, "src/App.css");
    expect(appCss).not.toContain("#root");
    expect(appCss.startsWith(".logo {\n")).toBe(true);
  });

  it("Next.js with Tailwind: layer order, Merid after globals.css, no Arial body rule", async () => {
    const dir = copyFixture("templates/next");
    expect(await init(dir, "--yes")).toBe(0);
    expect(read(dir, "app/layout.tsx")).toContain('import "./globals.css";\nimport "@meridui/react/styles.css";\n');
    const css = read(dir, "app/globals.css");
    expect(css.startsWith(`${LAYERS}\n\n@import "tailwindcss";\n`)).toBe(true);
    expect(css).not.toContain("font-family: Arial");
    expect(css).toContain("@theme inline {"); // the user's Tailwind theme stays
  });

  it("Next.js without Tailwind: drops the * reset, link and font rules, keeps the layout", async () => {
    const dir = copyFixture("templates/next-css");
    expect(await init(dir, "--yes")).toBe(0);
    expect(read(dir, "app/layout.tsx")).toContain('import "@meridui/react/styles.css";\nimport "./globals.css";\n');
    expect(read(dir, "app/globals.css")).toBe(`:root {
  --background: #ffffff;
  --foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

html {
  height: 100%;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
}

body {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  margin: 0;
}
`);
  });

  it("React Router: layer order, Merid after app.css, no white page background", async () => {
    const dir = copyFixture("templates/react-router");
    expect(await init(dir, "--yes")).toBe(0);
    expect(read(dir, "app/root.tsx")).toContain('import "./app.css";\nimport "@meridui/react/styles.css";\n');
    expect(read(dir, "app/app.css")).toBe(`${LAYERS}

@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}
`);
  });

  it.each(["templates/vite", "templates/vite-8", "templates/next", "templates/next-css", "templates/react-router"] as const)(
    "%s: a second run changes nothing",
    async (fixture: TemplateFixture) => {
      const dir = copyFixture(fixture);
      await init(dir, "--yes");
      const after = snapshot(dir);
      await init(dir, "--yes");
      expect(snapshot(dir)).toEqual(after);
    },
  );

  it("shows what each removed rule did and asks before touching the file", async () => {
    const dir = copyFixture("templates/vite-8");
    const before = snapshot(dir);
    const io = memoryIo((question) => question.includes("Continue?"));
    await main(["init", "--no-install", "--no-rules", "--no-mcp"], { cwd: dir, io, run, data });
    expect(io.questions).toContain("Remove the Vite template rules from src/index.css?");
    expect(io.questions).toContain("Remove the Vite template rules from src/App.css?");
    const out = io.output.join("\n");
    expect(out).toContain("button: button padding, radius, border and background");
    expect(out).toContain("-  background-color: #1a1a1a;");
    expect(snapshot(dir)).toEqual(before);
  });

  it("skips the stylesheets without --yes in a non-interactive shell", async () => {
    const dir = copyFixture("templates/next");
    const css = read(dir, "app/globals.css");
    const io = memoryIo(undefined, false);
    expect(await main(["init", "--no-install", "--no-rules", "--no-mcp"], { cwd: dir, io, run, data })).toBe(0);
    expect(read(dir, "app/globals.css")).toBe(css);
    expect(io.output.join("\n")).toContain("Skipped: app/layout.tsx, app/globals.css.");
  });

  it("--dry-run prints the plan and writes nothing", async () => {
    const dir = copyFixture("templates/react-router");
    const before = snapshot(dir);
    const io = memoryIo();
    expect(await main(["init", "--dry-run"], { cwd: dir, io, run, data })).toBe(0);
    expect(snapshot(dir)).toEqual(before);
    expect(io.output.join("\n")).toContain(`+${LAYERS}`);
  });

  it("keeps rules the user has edited", async () => {
    const dir = copyFixture("templates/vite-8");
    const css = read(dir, "src/index.css").replace("background-color: #1a1a1a;", "background-color: rebeccapurple;");
    writeFileSync(path.join(dir, "src/index.css"), css);
    await init(dir, "--yes");
    expect(read(dir, "src/index.css")).toBe("body {\n  margin: 0;\n}\n\nbutton {\n  border-radius: 8px;\n  border: 1px solid transparent;\n  padding: 0.6em 1.2em;\n  font-size: 1em;\n  font-weight: 500;\n  font-family: inherit;\n  background-color: rebeccapurple;\n  cursor: pointer;\n  transition: border-color 0.25s;\n}\n");
  });

  it("moves a Merid import that sits above the Tailwind stylesheet (CLI 0.1.0 put it there)", async () => {
    const dir = copyFixture("templates/next");
    const layout = read(dir, "app/layout.tsx").replace('import "./globals.css";', 'import "@meridui/react/styles.css";\nimport "./globals.css";');
    writeFileSync(path.join(dir, "app/layout.tsx"), layout);
    await init(dir, "--yes");
    const fixed = read(dir, "app/layout.tsx");
    expect(fixed).toContain('import "./globals.css";\nimport "@meridui/react/styles.css";\n');
    expect(fixed.match(/@meridui\/react\/styles\.css/g)).toHaveLength(1);
  });

  it("leaves the entry alone when a stylesheet already imports Merid with @import", async () => {
    const dir = copyFixture("templates/next");
    const css = `${LAYERS}\n\n@import "tailwindcss";\n@import "@meridui/react/styles.css";\n`;
    writeFileSync(path.join(dir, "app/globals.css"), css);
    const layout = read(dir, "app/layout.tsx");
    await init(dir, "--yes");
    expect(read(dir, "app/layout.tsx")).toBe(layout);
    expect(read(dir, "app/globals.css")).toBe(css);
  });

  it("does not repeat the rules in a CLAUDE.md that imports AGENTS.md", async () => {
    const dir = copyFixture("templates/next");
    const claude = read(dir, "CLAUDE.md");
    await main(["init", "--yes", "--no-install", "--rules", "--no-mcp"], { cwd: dir, io: memoryIo(), run, data });
    expect(read(dir, "CLAUDE.md")).toBe(claude);
    expect(read(dir, "AGENTS.md")).toContain("<!-- END:nextjs-agent-rules -->\n\n<!-- merid:start -->");
  });
});

describe("doctor on generator templates", () => {
  const find = (dir: string, text: string) => runChecks(dir).find((c) => c.label.includes(text));

  it("warns about template styles and stops once init removed them", async () => {
    const dir = copyFixture("templates/vite-8");
    const warning = find(dir, "template styles that override Merid");
    expect(warning?.level).toBe("warn");
    expect(warning?.label).toBe("src/index.css still has Vite template styles that override Merid: `:root`, `a`, `a:hover` and 6 more");
    expect(find(dir, "src/App.css still has")?.label).toContain("`#root`");
    await init(dir, "--yes");
    expect(find(dir, "template styles")).toBeUndefined();
  });

  it("warns when Tailwind's Preflight sits above Merid", async () => {
    const dir = copyFixture("templates/react-router");
    const layout = read(dir, "app/root.tsx").replace('import "./app.css";', 'import "@meridui/react/styles.css";\nimport "./app.css";');
    writeFileSync(path.join(dir, "app/root.tsx"), layout);
    const warning = find(dir, "Preflight overrides");
    expect(warning?.level).toBe("warn");
    expect(warning?.hint).toContain(`add \`${LAYERS}\` at the top of app/app.css`);
    expect(warning?.hint).toContain("import ./app.css before @meridui/react/styles.css in app/root.tsx");
    await init(dir, "--yes");
    expect(find(dir, "Preflight overrides")).toBeUndefined();
    expect(find(dir, "Tailwind layer order")?.level).toBe("ok");
  });

  it("accepts Merid imported with @import after Tailwind", () => {
    const dir = copyFixture("templates/next");
    writeFileSync(path.join(dir, "app/globals.css"), '@import "tailwindcss";\n@import "@meridui/react/styles.css";\n');
    expect(find(dir, "Preflight overrides")).toBeUndefined();
    expect(find(dir, "Stylesheet imported")?.label).toBe("Stylesheet imported in app/globals.css");
  });

  it("does not report the package itself as an old name", async () => {
    const dir = copyFixture("templates/vite");
    await init(dir, "--yes");
    const pkg = JSON.parse(read(dir, "package.json"));
    writeFileSync(path.join(dir, "package.json"), JSON.stringify({ ...pkg, dependencies: { ...pkg.dependencies, "@meridui/react": "^0.2.1" } }));
    expect(runChecks(dir).some((c) => c.label.toLowerCase().includes("old package name"))).toBe(false);
  });
});
