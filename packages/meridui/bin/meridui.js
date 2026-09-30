#!/usr/bin/env node
// Thin alias so `npx meridui <command>` runs the Merid CLI.
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const manifestPath = require.resolve("@meridui/cli/package.json");
const { bin } = require(manifestPath);

await import(pathToFileURL(join(dirname(manifestPath), bin.merid)).href);
