import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
    include: ["src/**/*.test.tsx", "test/**/*.test.tsx"],
    // Used by `vitest run --coverage`; needs the @vitest/coverage-v8 dev dependency.
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.test.tsx", "src/**/index.ts"],
      reporter: ["text-summary", "html", "lcov"],
    },
  },
});
