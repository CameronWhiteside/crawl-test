import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["webBotAuth/validation/tests/**/*.test.ts"],
    setupFiles: [],
    env: {
      NODE_ENV: "test",
    },
  },
});
