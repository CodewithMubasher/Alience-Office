# ADR-0001 — Port the spreadsheet engine verbatim from the MIT-licensed reference

- **Status:** Accepted
- **Date:** 2026-10-14

## Context

The reference project (HeyPuter "everything", `src/spreadsheet`) is a complete
Excel-class spreadsheet: ~4.6 MB of DOM-free engine code (`src/core`), a formula
engine with 560 functions, `.xlsx`/`.ods` read-write, and roughly 2,400 vitest
files whose fixtures were captured from Microsoft Excel itself. It is MIT licensed.

Rebuilding that engine from scratch would be years of work and would diverge from
Excel's documented semantics (date serials, spill rules, currency formats, native
OOXML parts) in ways that only a large oracle test corpus can catch.

## Decision

- `packages/spreadsheet-core` holds the engine **copied verbatim** from
  `src/core` (plus the vendored data files and `src/lib` host adapters), keeping
  the upstream file layout and relative imports.
- The UI layer (`src/ui`, `src/views`, `src/styles` — the "bad UI" we are
  replacing) is **not** ported; it is rebuilt in React + shadcn.
- The upstream `LICENSE` is copied into the package, vendored component licenses
  into `THIRD_PARTY_NOTICES.md`, and the About dialog keeps a credits list that a
  test keeps in sync.
- Any change we make to ported files is recorded in `docs/PORT-NOTES.md` with the
  upstream file it came from, so the diff against upstream stays reviewable.
- TypeScript: the package stays plain JS with `allowJs`; hand-written `.d.ts`
  files are added only for the modules the React app imports.

## Consequences

- Correctness is inherited (and proven by the ported conformance suite) instead of
  re-derived.
- We carry ~4.6 MB of code we did not write; heavy clusters (native pivots,
  solver, SmartArt) are lazily `import()`-ed so they land in separate chunks.
- Every engine bug fix must eventually be reconciled against upstream.
