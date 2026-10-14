/**
 * The ribbon's shape, ported from the reference project:
 * `RIBBON_TABS` matches its `src/ui/ribbon.js` list, and each tab's group
 * captions match its `groupsFor()` / `createToolbar` group labels.
 *
 * Only the structure lives here for now — commands and controls arrive when
 * the engine lands (docs/spreadsheet-plan.md, Phase 1). `large` marks groups
 * whose primary command is a big icon-over-label button, so placeholder
 * slots echo the real ribbon's proportions.
 *
 * Contextual tabs (Table, Chart Design, Picture Format, …) are omitted:
 * they only appear once a selection offers them.
 */
export type RibbonGroup = {
  label: string
  large?: boolean
}

export type RibbonTab = {
  id: string
  label: string
  groups: RibbonGroup[]
}

export const RIBBON_TABS: RibbonTab[] = [
  {
    id: "home",
    label: "Home",
    groups: [
      { label: "Clipboard", large: true },
      { label: "Font" },
      { label: "Alignment" },
      { label: "Number" },
      { label: "Styles", large: true },
      { label: "Cells" },
      { label: "Editing", large: true },
    ],
  },
  {
    id: "insert",
    label: "Insert",
    groups: [
      { label: "Tables", large: true },
      { label: "Illustrations", large: true },
      { label: "Charts", large: true },
      { label: "Sparklines" },
      { label: "Filters", large: true },
      { label: "Links", large: true },
      { label: "Comments", large: true },
      { label: "Text" },
      { label: "Cells" },
      { label: "Symbols", large: true },
      { label: "Sheets" },
    ],
  },
  {
    id: "draw",
    label: "Draw",
    groups: [
      { label: "Drawing Tools" },
      { label: "Touch" },
      { label: "Convert", large: true },
    ],
  },
  {
    id: "page-layout",
    label: "Page Layout",
    groups: [
      { label: "Themes", large: true },
      { label: "Page Setup", large: true },
      { label: "Scale to Fit" },
      { label: "Sheet Options" },
      { label: "Arrange", large: true },
    ],
  },
  {
    id: "formulas",
    label: "Formulas",
    groups: [
      { label: "Function Library", large: true },
      { label: "Defined Names", large: true },
      { label: "Formula Auditing" },
      { label: "Calculation", large: true },
    ],
  },
  {
    id: "data",
    label: "Data",
    groups: [
      { label: "Get & Transform Data", large: true },
      { label: "Queries & Connections", large: true },
      { label: "Sort & Filter", large: true },
      { label: "Data Tools" },
      { label: "Forecast", large: true },
      { label: "Analyze", large: true },
      { label: "Outline" },
    ],
  },
  {
    id: "review",
    label: "Review",
    groups: [
      { label: "Proofing", large: true },
      { label: "Language", large: true },
      { label: "Accessibility", large: true },
      { label: "Comments", large: true },
      { label: "Notes", large: true },
      { label: "Changes", large: true },
      { label: "Protection", large: true },
      { label: "Collaboration" },
    ],
  },
  {
    id: "view",
    label: "View",
    groups: [
      { label: "Workbook Views", large: true },
      { label: "Sheet View", large: true },
      { label: "Show" },
      { label: "Zoom", large: true },
      { label: "Window", large: true },
      { label: "Assistant" },
    ],
  },
  {
    id: "automate",
    label: "Automate",
    groups: [
      { label: "Scripting Tools", large: true },
      { label: "Controls", large: true },
      { label: "Sample Scripts" },
      { label: "Help", large: true },
    ],
  },
]
