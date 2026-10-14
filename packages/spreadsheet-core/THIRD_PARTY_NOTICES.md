# Third-Party Notices

`@workspace/spreadsheet-core` ports code and data from the
[HeyPuter "everything" monorepo](https://github.com/HeyPuter/everything)
(`src/spreadsheet`, MIT License, © 2026 Puter Technologies Inc.) — see `LICENSE`
for the full upstream text.

Vendored components that arrive with the engine in Phase 1, and their licenses:

| Component | License | Notes |
|---|---|---|
| `xlsx.mjs` (SheetJS Community Edition) | Apache-2.0 | zip container + number-format table for `.xlsx`/`.ods`/`.xls` IO |
| `drawingml-presets.js` | Apache-2.0 | preset shape geometry, adapted from Apache POI |
| `pivot-style-presets.js` | Apache-2.0 | PivotTable styles, adapted from Apache POI |
| `words-en.js` | SCOWL | English word lists for spell checking |
| `unicode-case-folds.js` | Unicode-3.0 | Unicode default full case folds |
| `lunisolar-data.js`, `hebrew-data.js`, `persian-calendar.js`, `umalqura-data.js` | MIT | calendar tables, adapted from .NET |

Each `*-LICENSE.txt` shipped upstream is copied into the package alongside its
file. An updated credits list is maintained in the app's About dialog, and a test
asserts the list stays in sync (ported with the suite in Phase 1).
