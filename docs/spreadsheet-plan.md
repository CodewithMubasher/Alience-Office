# Spreadsheet App — Port & Rebuild Plan

**Status:** Draft for review
**Team:** portfolio project (2 people)
**Goal:** Recreate the Excel-class spreadsheet from the reference project in this monorepo, with a
good-looking shadcn/ui interface, full UI surface, and the core engine ported from the reference
(it is MIT licensed — we may reuse it with attribution).

---

## 1. Decisions (agreed)

| Decision | Choice |
|---|---|
| V1 shape | **Full UI surface** (ribbon, dialogs, panes, menus all exist and look good) with **basic core functionality working first** (cells, editing, simple formulas, basic formatting, save/load), then deepen feature-by-feature |
| Engine | **Port the reference's `src/core`** (vanilla ESM, DOM-free) into a workspace package |
| UI | **Rebuild 100% in React 19 + shadcn/ui + Tailwind v4**, Excel-style ribbon |
| Charts | **Port the reference SVG chart engine** (`core/charts.js` + `ui/chartsvg.js`) |
| Backend | **Local-only first**: IndexedDB + file open/save, behind a repository interface so a real backend can slot in later |
| Collaboration | **Deferred**; data model must not block adding it later |
| Tests | **Port the reference vitest suite as a conformance spec** (~2,400 test files, 16.9 MB of Excel-captured fixtures) |
| Deliverable | This doc + phased task breakdown in the repo |

---

## 2. What the reference actually is (findings)

`refference/everything/src/spreadsheet` — Puter's open-source spreadsheet (vanilla JS, Vite, no
framework, Puter.js backend).

**Scale**

| Layer | Files | Size | Notes |
|---|---|---|---|
| `src/core` (engine) | 325 | ~4.6 MB | **DOM-free** (only 5 files touch the DOM, all guarded/injectable) |
| `src/ui` (vanilla DOM UI) | 158 | 2.5 MB | `grid.js` 332 KB, `ribbon.js` 62 KB, `chartsvg.js` 167 KB |
| `src/views/editor.js` | 1 | 387 KB | the "App" controller; one `run(cmd, arg)` dispatcher |
| `src/styles` | 29 | ~400 KB | token-based CSS, light/dark, no Tailwind |
| `src/collab` | 13 | ~130 KB | ordered op-log + WebRTC presence + own server (Puter Worker) |
| `tests` | 2,429 | ~40 MB | ~11,800 `it()` sites, 1,543 run in plain Node |
| `src/vendor` | 8 + licenses | ~1 MB | SheetJS CE (Apache-2.0), POI presets, SCOWL words, Unicode tables |

**Key engine facts (verified)**

- `Workbook extends EventTarget` (720 KB, 12k lines) is one god-object: sheets, cells, styles,
  copy/paste, sort, structure, tables, validation, rules, charts, spills, evaluation, undo/redo.
- Sparse storage: `sheet.cells = Map<"r,c", {v,f,s,…}>`; styles are **partial patches merged at read
  time** through a 4-layer chain (normal → col/row style → styleResets → cell).
- Recalc is **pull-based lazy recursion with a drop-everything cache** on change — no persistent
  dependency graph. Undo = paired cell clones + per-sheet JSON snapshots for structural edits,
  budgeted at 200 steps / 1 M cells.
- Formula engine: tokenizer → recursive-descent parser → tree-walking evaluator; **560 registered
  functions** in one flat `FUNCTIONS` object; array budget, spill/dynamic arrays, LAMBDA, QUERY
  language. 100% DOM-free.
- `io.js` (154 KB): reads/writes `.xlsx` (via vendored SheetJS CE as zip container + ~40 custom
  `xlsx-*` patch modules), `.ods`, CSV/TSV (own parser), HTML. DOM-free except `Blob` in/out.
- Charts: **clean model/renderer split** — `core/charts.js` (pure data) + `ui/chartsvg.js` (pure
  **string** producer, zero DOM, already tested in Node).
- `ui/grid.js`: DOM virtualization (no canvas cells), one oversized absolutely-positioned canvas
  with `transform`-placed rows, windowed axis offsets (scroll window capped at 6 M px), selection +
  editing are overlays on the same canvas.
- Ribbon is **declarative descriptor data** (`RIBBON_TABS`, `groupsFor(tab)`, `core/ribbon-layout.js`
  pure layout model) — close to React props already.
- Menus are plain data trees resolved against one flag set; a ribbon button exists **only** if the
  matching menu command exists — one source of truth for enablement/labels/shortcuts.

**What we will NOT port:** Puter backend glue, collab + collab server, AI (aitools/aipanel, 170 KB),
email worker, scripts/automate sandbox (deferred), ink, Power Query/data-model (Pivot) internals.
Their engine modules stay in the package but unreachable from UI until later phases.

---

## 3. Target architecture

```
alience-office/
├── apps/
│   ├── Spreadsheet/            ← @workspace/spreadsheet   (React 19 + shadcn, port 5177)
│   │   └── src/
│   │       ├── app/            shell: AppShell, Ribbon, navigator
│   │       ├── grid/           virtualized grid, selection, in-cell editor
│   │       ├── ribbon/         tab strip + groups (from ported descriptors)
│   │       ├── dialogs/        shadcn-based versions of every reference dialog
│   │       ├── panels/         find bar, comments later, task panes
│   │       ├── commands/       command registry (run(cmd, arg) equivalent)
│   │       ├── hooks/          useWorkbook, useSelection, useCommands
│   │       └── lib/            local storage (IndexedDB), file open/save
│   └── …(other 4 apps untouched)
├── packages/
│   ├── ui/                     shadcn components shared (add ~20 components)
│   └── spreadsheet-core/       @workspace/spreadsheet-core  ← PORTED ENGINE (JS, verbatim)
│       └── src/core/…          verbatim copy of reference src/core (+ selected lib/)
│           └── tests/          ported conformance suite (node env)
└── docs/
    ├── spreadsheet-plan.md     (this file)
    ├── adr/                    ADR-0001 engine port, ADR-0002 local-first storage, …
    └── THIRD_PARTY_NOTICES.md  vendored licenses + attribution
```

**Data flow (one direction):**

```
User input (grid/ribbon/dialog)
  → commands/ registry  (the only place mutations are allowed)
    → Workbook method (ported engine: setInput, insertRows, setStyle, …)
      → Workbook dispatches 'change' events
        → useSyncExternalStore bridge → React re-render
```

Selection, editing draft, scroll position, dialog state = **React state**.
Everything about the document = **Workbook**. This mirrors the reference's `ctx` design
(`ctx.wb`, `ctx.run`) and keeps the engine as the single source of truth.

**Package rules**

- `packages/spreadsheet-core/src/**` is **verbatim reference code** (keep `.js`, keep relative
  imports). We fix it only when required by tests/typing; every change is documented in
  `docs/PORT-NOTES.md` with the upstream file it came from.
- TypeScript strategy: `allowJs: true` + hand-written `.d.ts` for the ~15 modules the app imports
  directly (`workbook.js`, `io.js`, `charts.js`, `formula/*.js` …). No mass conversion to TS.
- The React app never reaches past the core's public exports; adapters live in `apps/Spreadsheet/src/lib/engine.ts`.

---

## 4. Port map (reference → ours)

| Cluster (files, KB) | Action | Notes |
|---|---|---|
| `core/formula/*` (~40, 560) | **Lift verbatim** | 100% DOM-free; conformance tests come with it |
| `core/workbook.js` (720) + `cell.js`, `selection.js`, `refs.js`, `sparse-range.js`, `sample.js` | **Lift verbatim** | `crypto.randomUUID()` only; EventTarget is a Node global |
| Format/styles: `format.js` 75, `numfmt.js` 96, `cellstyles*`, `border-regions`, `style-*`, `rich-text`, fonts/themes (~64 files, 510) | **Lift verbatim** | `normal-font.js` canvas measure → inject a measurement fn from the app |
| XLSX/ODS io: `io.js` + ~40 `xlsx-*` (~700) | **Lift verbatim** | `Blob` in/out at the app boundary (we pass `Uint8Array`) |
| Clipboard: `clipboard.js` 83 + html/css/integrity (~130) | **Lift verbatim** | `DOMParser` use is guarded; we pass HTML strings from the app |
| Tables/validation/condformat (~130) | **Lift verbatim** | |
| Charts: `core/charts.js` + `chart-*` (~180) + `ui/chartsvg.js` + `chartsvg-special.js` (208) | **Lift verbatim into core** | string-in/string-out; React renders the string |
| Pivots: `pivot.js` + ~60 `native-pivot-*` (~700) | **Lift verbatim (tree-shaken)** | native-pivot cluster is heavy → lazy `import()` behind the pivot dialog so it lands in its own chunk |
| Solver/analysis/forecast (~165) | **Lift verbatim, lazy chunks** | exposed only when UI lands (phase 5) |
| SmartArt/drawings/ink/equation (~130) | **Lift verbatim, lazy** | deferred UI |
| Scripts (`script-*`, ~120) | **Lift verbatim, deferred UI** | sandbox stays Puter-free; run in an iframe/worker |
| `lib/doc.js`, `drafts.js`, `versions.js`, `links.js`, `recent.js`, `session.js`, `user-prefs.js` | **Port with adaptation** | replace Puter-auth bits with our local identity stub |
| `lib/puter.js`, `lib/mail.js`, `src/collab/*`, `src/workers/*`, `core/aiagent.js`, `aitools.js`, `aiformula.js` | **Exclude** | AI/backend-dependent; revisit when a backend exists |
| `vendor/*` (SheetJS, POI presets, SCOWL, Unicode folds, calendars) | **Copy + licenses** | keep `*-LICENSE.txt` beside each; npm-ify `@noble/hashes` → swap to `crypto.subtle` if needed |
| `tests/**` | **Port as conformance spec** | 1,543 node-env files now; 886 jsdom files deferred until a DOM harness exists |
| `ui/*`, `views/*`, `styles/*` | **Do not port** | this is what we rebuild |

---

## 5. UI architecture (React + shadcn)

**Shell layout** (mirrors reference regions):

```
AppShell
├── TitleBar            back · doc name · save status · theme toggle · share (later)
├── Ribbon               tabs Home/Insert/Page Layout/Formulas/Data/Review/View (+ contextual)
│                        descriptors ported as data → <RibbonGroup>/<RibbonButton>
├── FormulaBar           name box + formula input (mirrors in-cell editor state)
├── Grid                 virtualized grid + editors + overlays (see below)
├── SheetTabs            tab strip, add/rename/reorder/color
└── StatusBar            cell mode · address · Sum/Avg/Count · view shortcuts · zoom
+ CommandPalette (Ctrl+Shift+P), FindBar, dialogs, toasts
```

**Grid (the hard part — written fresh in React, not a port):**

- Virtualization: windowed rows/cols (`visibleRange ± BUFFER=2` like the reference), rows positioned
  with `transform: translateY()`, cells absolutely positioned. Default 1,000 × 52, grows on scroll.
- Selection model: **lift `core/selection.js`** (DOM-free) — same rules, ported tests come free.
- Editing: a single `<textarea>` overlay positioned over the active cell (type-to-replace, F2,
  double-click, Esc/Enter/Tab semantics).
- Overlays: selection box, fill handle, ref highlights, marching-ants cut — absolutely positioned
  layers inside the grid viewport.
- Headers: own scroll tracks; header click = select line; drag = resize/reorder.
- A11y: `role="grid"`, `aria-activedescendant`, live-region announcements (reference's exact
  patterns, re-expressed in JSX).
- Charts/pictures later: absolutely-positioned SVG layer (ported `renderChartSvg` string).

**Commands & enablement:** port the reference's command philosophy — one `commands/` registry
(`run(cmd, arg)`), descriptor data resolves label/icon/shortcut/enabled from workbook state, so
ribbon, menus, palette, shortcuts and context menus all agree. `core/ribbon-layout.js` is lifted
verbatim as the layout model.

**Dialogs/panes:** one shadcn `Dialog` wrapper (focus trap, esc, sizes) + each reference dialog
rebuilt from shadcn primitives (`Dialog`, `Select`, `Popover`, `Command`, `Tabs`, `Slider`,
`ToggleGroup`, `ScrollArea`, `Resizable`, `Tooltip`, `ContextMenu`, `Separator`, `Badge`…).
Phase 4 ships **every dialog surface**; features whose engine exists are fully wired, the rest open
a working dialog with an explicit "not yet available" affordance (never a dead button).

**Design system mapping:**

| Reference token | Ours |
|---|---|
| `--page/--surface/--surface-2/--ink/--hairline` | Tailwind theme `background/card/popover/muted/foreground/border` (already in `packages/ui` globals.css) |
| `--accent #356d49` (brand green) | new `--brand` token + spreadsheet-specific tokens in `packages/ui/src/styles` |
| `--grid`, `--series-1..7`, paper/ink for the sheet | new `@theme` block (sheet stays light in dark mode, as the reference does) |
| `--topbar-h`, `--ribbon-h`, … shell metrics | same constants, ported into CSS vars |
| Inter/system font | Inter Variable (already wired) + monospace stack for formulas |

Dark mode uses the existing `ThemeProvider` (`.dark` on `<html>`); the sheet area keeps a light
paper palette via a scoped override — same trick as the reference's `:root, .grid-viewport` scope.

**State management:** React 19 only — `useSyncExternalStore` bridging `Workbook`'s
`change`/`recalc` events; UI state in `useState`/`useReducer`. No new state library (portfolio
clarity). If a dialog graph grows painful, revisit with zustand.

**Storage (local-only):**

```
DocumentRepository (interface)
├── IndexedDbRepository     autosave drafts + saved workbooks (json + xlsx bytes)
└── FileSystemRepository    Open…/Save as… via File System Access + download fallback
```
The reference's `Doc` shape (workbook json + name + dirty state) is kept so a Puter/Supabase
repository can be dropped in later without touching the UI.

---

## 6. Testing strategy

1. **Vitest workspace** at root: `packages/spreadsheet-core` (node env) running the ported
   conformance suite; `apps/Spreadsheet` for component tests (jsdom).
2. **Phase 1 exit criterion: the 1,543 node-env test files pass** in our repo — that is the proof
   the engine port is faithful. Fix by fixing our copy/config, never by deleting oracle cases;
   skipped tests are listed with reasons in `docs/PORT-NOTES.md`.
3. Fixtures (16.9 MB) are copied as-is — they are Excel-captured oracles (provenance JSON included).
4. Keep helpers `tests/helpers/calc.js` + `xlsx-fixture.js` early — they unlock the most tests.
5. **Playwright** (phase 3+) for e2e: type → formula recalc → save → reload → undo/redo, print
   preview smoke, dark mode, keyboard-only edit flow.
6. UI tests only for behavior we invent (React glue); engine behavior is covered by the ported suite.

---

## 7. Phased delivery

Each phase ends with something demoable. "Basic working" per the brief is reached at the end of
phase 2; "full UI" at the end of phase 4.

### Phase 0 — Repo hygiene & scaffolding (½ day)
- Rename the 5 `"web"` package names (`@workspace/spreadsheet`, `@workspace/documents`, …);
  assign dev ports (5177–5181) so apps run side by side.
- Add vitest workspace config + `typecheck` coverage for the new package.
- Create `packages/spreadsheet-core` with `"type": "module"`; copy `LICENSE`,
  `THIRD_PARTY_NOTICES.md`, `docs/adr/` (ADR-0001 verbatim-port, ADR-0002 local-first storage,
  ADR-0003 Tailwind-token mapping).
- **Do not touch** Documents/Notes/Presentation/Whiteboard code.

### Phase 1 — Engine port & conformance (the critical milestone)
- Copy `src/core` verbatim (minus excluded modules), `src/vendor/*`, `src/lib` (adapted later).
- Port `tests/` + `tests/helpers/` + `tests/fixtures/`.
- Wire vitest (node env), get Node tests green; add `.d.ts` for modules the app will import.
- Adapt the 5 DOM-touching core modules behind injection points (`measureText`, `parseHtml`,
  `svgToRaster`).
- Deliverable: `new Workbook()` + `setInput/getValue/toJSON` + `workbookToXlsx/workbookFromFile`
  usable from Node and from a browser; green conformance wall in CI-style `pnpm test`.

### Phase 2 — First real editor (basics working)
- App shell: title bar, formula bar, grid, sheet tabs, status bar; routing `#/` + `#/edit/:id`.
- Grid with virtualization, selection, type/F2 editing, fill handle, clipboard (TSV/HTML),
  keyboard navigation (arrows/Tab/Enter/Ctrl+arrows/PageUp…).
- Formula bar + ported autocomplete/signature hints; recalc via ported engine.
- Local storage: create/autosave/reopen (IndexedDB), open/save `.xlsx` via ported `io.js`.
- Undo/redo wired to engine history (toolbar + Ctrl+Z).
- Deliverable: usable single-sheet spreadsheet with formulas, saved locally. **Demo #1.**

### Phase 3 — Excel-grade interaction layer
- Ribbon (Home/Insert/Data tabs) built from ported descriptors + `core/ribbon-layout.js`;
  formatting toolbar: font, size, B/I/U, colors, borders, alignment, number formats, merge,
  format painter; Format Cells dialog.
- Insert/delete rows & columns (with formula rewriting), sort & filter, find & replace,
  context menus (cell/row/col), command palette, keyboard-shortcut help dialog.
- Conditional formatting manager, data validation dropdowns, tables (structured refs).
- Deliverable: feature parity with a "2010 Excel" for everyday editing. **Demo #2.**

### Phase 4 — Full UI surface (the brief's headline)
- Every remaining reference dialog/panel exists, shadcn-styled and wired where the engine allows:
  Sort dialog, Remove Duplicates, Text to Columns, Subtotal, Name Manager, Conditional Formatting
  manager, Validation manager, Table dialog, Pivot dialog (lazy chunk), Solver (lazy), Data
  Analysis (lazy), Chart dialog + chart rendering (**ported SVG engine**), Print dialog with live
  page preview + PDF export, Themes, Options (ribbon/QAT/keyboard), templates & home screen,
  zoom, freeze panes, outline groups, sheet grouping/copy/move, protection, comments (local),
  version history (local snapshots), Show Changes pane (local change log).
- Deferred-but-visible: Automate/scripts and AI surfaces ship disabled with an honest
  "not available in this build" state.
- Mobile pass: touch select/edit, long-press menus, responsive ribbon.
- Deliverable: visually complete application; every button either works or says why. **Demo #3.**

### Phase 5 — Depth, polish, performance
- Ported jsdom test harness → engine UI tests; Playwright e2e suite.
- Perf budgets: 100k-cell sheets smooth; lazy chunks for pivot/solver/smartart; row-height
  measurement caching; large-paste guards.
- A11y audit (grid ARIA, dialogs, focus order), reduced motion, high contrast.
- Final polish: empty states, toasts, tooltips, onboarding (sample workbook), About with
  third-party credits.

---

## 8. Risks & mitigations

| Risk | Mitigation |
|---|---|
| 4 MB of vanilla JS inside a TS monorepo | Verbatim JS + `allowJs` + hand-written `.d.ts` at the seam; core is its own package so app code stays clean TS |
| `workbook.js` god-object (720 KB) | Treat as a library, never edit casually; all changes listed in `docs/PORT-NOTES.md` |
| Bundle weight (pivots/solver/smartart) | Lazy `import()` behind their dialogs; measure bundle each phase |
| Grid performance in React (reference is imperative DOM) | Fresh implementation using the reference's windowing strategy; perf test at 100k cells in phase 5; drop to canvas cells only if profiling demands |
| Test suite is huge (2,400 files) | Phase 1 gates on node-env tests only; jsdom tests come after a harness exists |
| Vendored licenses (SheetJS/POI/SCOWL/Unicode/.NET calendars) | `THIRD_PARTY_NOTICES.md` + per-file LICENSE copies + About dialog credits (a reference test asserts the credit list — we keep an equivalent) |
| Scope creep toward full parity | This doc is the contract: engine lifted wholesale; UI prioritized by phase; deferred list is explicit |
| Backend later | `DocumentRepository` interface + collab-ready model (op-log shape understood, not implemented) |

## 9. Non-goals (for now)

Puter.js integration, real-time collaboration server, AI assistant, email sending, script
automation UI, ink drawing, Power Query/data model, native `.xls`/BIFF and `.ods` *export* polish
beyond what the ported `io.js` gives us, and any change to the other four suite apps.

## 10. Immediate next actions

1. Review/approve this plan + ADRs.
2. Phase 0 commit: rename packages, ports, vitest workspace, `packages/spreadsheet-core` skeleton,
   `THIRD_PARTY_NOTICES.md`.
3. Phase 1: copy engine + tests, get the conformance wall green.
