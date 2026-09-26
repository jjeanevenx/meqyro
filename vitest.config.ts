import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    testTimeout: 10000,
    include: ["tests/**/*.test.ts"],
    setupFiles: ["./tests/setup.ts"],
    alias: {
      "server-only": path.resolve(__dirname, "./tests/mocks/server-only.ts"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
