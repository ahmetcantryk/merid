import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const here = dirname(fileURLToPath(import.meta.url));
const local = (id: string) => join(here, "node_modules", id);

// @merid/react is a file: symlink into the monorepo, whose root installs React 19.
// Pin every React import, including those inside the built package and its
// @floating-ui dependency, to this folder's React 18.
export default defineConfig({
  esbuild: { jsx: "automatic" },
  resolve: {
    alias: [
      { find: /^react$/, replacement: local("react/index.js") },
      { find: /^react\/jsx-runtime$/, replacement: local("react/jsx-runtime.js") },
      { find: /^react\/jsx-dev-runtime$/, replacement: local("react/jsx-dev-runtime.js") },
      { find: /^react-dom$/, replacement: local("react-dom/index.js") },
      { find: /^react-dom\/client$/, replacement: local("react-dom/client.js") },
      { find: /^react-dom\/test-utils$/, replacement: local("react-dom/test-utils.js") },
    ],
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["*.test.tsx"],
    server: { deps: { inline: [/@merid\/react/, /@floating-ui/, /@testing-library/] } },
  },
});
