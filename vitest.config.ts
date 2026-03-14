import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    globals: true,
    include: ["src/**/*.test.ts"],
    exclude: ["node_modules", "dist", "ai-devkit-example"],
  },
  resolve: {
    alias: {
      "#lib": resolve(__dirname, "src/lib"),
      "#adapters": resolve(__dirname, "src/adapters"),
      "#commands": resolve(__dirname, "src/commands"),
      "#ui": resolve(__dirname, "src/ui"),
    },
  },
});
