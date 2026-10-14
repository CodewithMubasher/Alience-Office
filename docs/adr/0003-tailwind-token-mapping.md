# ADR-0003 — Map the reference design tokens onto Tailwind/shadcn theme tokens

- **Status:** Accepted
- **Date:** 2026-10-14

## Context

The reference UI is styled with ~400 KB of hand-written CSS driven by a
`tokens.css` custom-property system (light + dark). We are rebuilding the UI in
shadcn/ui + Tailwind v4, whose theme tokens already live in
`packages/ui/src/styles/globals.css` (`--background`, `--foreground`,
`--card`, `--popover`, `--muted`, `--accent`, `--border`, `--ring`, `--radius`,
`--chart-1..5`, …) and are shared by all five suite apps.

## Decision

- shadcn/Tailwind tokens are the **only** source for chrome (ribbon, dialogs,
  panes). New app-specific tokens (brand accent, sheet grid lines, spreadsheet
  series colors, shell metrics like `--ribbon-h`) are added to the same
  `@theme inline`/`:root` blocks in `packages/ui`, not scattered per app.
- The spreadsheet canvas keeps a light "paper" palette in dark mode (as the
  reference does) via a scoped override on the grid surfaces.
- The reference's forest-green brand (`#356d49`) becomes a `--brand` token so
  the Spreadsheet app can differ from the other apps without forks.
- Chart series colors map to the existing `--chart-*` scale, extended if the
  ported chart engine needs more series than the five available.
- Dark mode uses the existing `ThemeProvider` (`.dark` on `<html>`); no second
  theming system.

## Consequences

- One token vocabulary for the whole suite; components stay portable between
  apps.
- The reference's CSS is not ported wholesale; each visual decision is
  re-expressed with Tailwind utilities + tokens, which is where the "good
  shadcn UI" comes from.
