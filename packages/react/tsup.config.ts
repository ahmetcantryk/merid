import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  // tsup injects `baseUrl`, deprecated in TS 6 (the version tsup resolves for dts).
  dts: { compilerOptions: { ignoreDeprecations: "6.0" } },
  sourcemap: true,
  clean: true,
  target: "es2022",
  external: ["react", "react-dom", "react/jsx-runtime"],
  // esbuild drops module-level directives when bundling; re-add it on the entry
  // so every export is usable across a React Server Components client boundary.
  banner: { js: '"use client";' },
});
