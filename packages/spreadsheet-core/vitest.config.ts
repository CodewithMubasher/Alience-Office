import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    name: "spreadsheet-core",
    // The ported engine is DOM-free; the conformance suite runs in Node.
    environment: "node",
    include: ["tests/**/*.test.js"],
    // Phase 0 ships the skeleton only; the suite arrives in Phase 1.
    passWithNoTests: true,
    testTimeout: 30_000,
  },
})
