import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],

  resolve: {
    alias: {
      "server-only": fileURLToPath(
        new URL(
          "./node_modules/next/dist/compiled/server-only/empty.js",
          import.meta.url,
        ),
      ),
    },
  },

  test: {
    environment: "jsdom",

    setupFiles: ["./test/setup/vitest.setup.ts"],

    include: ["test/unit/**/*.test.ts", "test/components/**/*.test.tsx"],

    clearMocks: true,
  },
});
