import { defineWorkspace } from "vitest/config"

// Packages first; apps join as their suites land (Playwright for e2e in Phase 5).
export default defineWorkspace(["packages/*"])
