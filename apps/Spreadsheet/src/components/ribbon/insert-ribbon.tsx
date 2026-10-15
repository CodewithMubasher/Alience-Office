import type { ReactNode } from "react"

import {
  Group,
  LargeSplit,
  Tb,
  TbLarge,
  TbLargeMenu,
  TbMenu,
  type MenuItem,
} from "./ribbon-kit"
import {
  BUILTIN_EQUATIONS,
  CHART_GALLERIES,
  SHAPE_GROUPS,
} from "./insert-data"

/**
 * The Insert tab, rebuilt to the reference's exact layout
 * (`src/ui/ribbon.js` `Insert` groups + `src/styles/chrome.css`): the same
 * 86px card and group grid as every other tab — 24px commands (icon 20 over a
 * 12px label), 74px large commands (icon 32 over a two-line label), groups
 * split by hairlines with no drawn captions. Unlike Home, a tab's groups flow
 * their commands through the reference's 3-row grid (`Group variant="grid"`),
 * a large command spanning all three rows.
 *
 * Every glyph and size is the reference's own (src/ribbon-icons). Controls are
 * visual only: menus open and list their items; no command is wired yet
 * (docs/spreadsheet-plan.md, Phase 1).
 */

/** A large command spanning the group's three rows (ribbon.css grid-row: 1 / -1). */
function Large({ children }: { children: ReactNode }) {
  return <span className="row-span-3 self-stretch">{children}</span>
}

/* ---------- menu contents (labels and glyphs as in the reference) ---------- */

/** Insert ▸ Illustrations ▸ Pictures: the Insert ▸ Image menu (menubar.js). */
const PICTURES: MenuItem[] = [
  { label: "From this device…", glyph: "image" },
  { label: "From a URL…", glyph: "external" },
  "sep",
  {
    label: "Place in Cell",
    glyph: "placeInCell",
    submenu: [
      { label: "From this device…", glyph: "image" },
      { label: "From a URL…", glyph: "external" },
    ],
  },
]

/** Insert ▸ Illustrations ▸ Shapes: the gallery, a section per kind (shapes.js). */
const SHAPES: MenuItem[] = SHAPE_GROUPS.flatMap((group) => [
  { header: group.name },
  {
    tiles: group.shapes.map((shape) => ({
      label: shape.label,
      svg: shape.svg,
      viewBox: shape.viewBox,
      w: 26,
      h: 22,
    })),
    label: group.name,
  },
])

/** A chart family's menu: a tile gallery per subtype group, then its All Charts page. */
const chartMenu = (gallery: (typeof CHART_GALLERIES)[number]): MenuItem[] => [
  ...gallery.groups.flatMap((group) => [
    { header: group.header },
    {
      tiles: group.items.map((item) => ({ label: item.label, glyph: item.glyph })),
      label: group.header,
      // The reference fits 3 columns for a short row, 4 for a long one.
      columns: Math.min(4, Math.max(3, group.items.length)),
    },
  ]),
  "sep",
  { label: gallery.more, glyph: gallery.glyph },
]

/** Insert ▸ Symbols ▸ Equation's arrow: the built-in equations, drawn in the reference. */
const EQUATIONS: MenuItem[] = [
  ...BUILTIN_EQUATIONS.map((equation) => ({ label: equation.label })),
  "sep",
  { label: "Insert New Equation", glyph: "math" },
]

/* ---------- the Insert tab ---------- */

/**
 * Insert: Tables, Illustrations, Charts, Sparklines, Filters, Links,
 * Comments, Text, Cells, Symbols, Sheets — the reference's assembly in
 * ribbon.js, every glyph and size as it draws them.
 */
export function InsertRibbon() {
  return (
    <>
      <Group label="Tables" variant="grid">
        <Large>
          <TbLarge
            icon="pivot"
            label="PivotTable"
            title="PivotTable"
            ariaLabel="PivotTable"
          />
        </Large>
        <Large>
          <TbLarge
            icon="pivotRecommend"
            label="Recommended PivotTables"
            title="Recommended PivotTables"
            ariaLabel="Recommended PivotTables"
          />
        </Large>
        <Large>
          <TbLarge
            icon="table"
            label="Table"
            title="Table"
            ariaLabel="Table"
          />
        </Large>
      </Group>

      <Group label="Illustrations" variant="grid">
        <Large>
          <TbLargeMenu
            icon="pictures"
            label="Pictures"
            title="Pictures"
            items={PICTURES}
          />
        </Large>
        <TbMenu icon="shapes" label="Shapes" title="Shapes" items={SHAPES} />
        <Tb icon="icons" label="Icons" title="Icons" />
        <Tb
          icon="smartArt"
          label="SmartArt"
          title="Insert SmartArt graphic"
          ariaLabel="Insert SmartArt graphic"
        />
      </Group>

      <Group label="Charts" variant="grid">
        <Large>
          <TbLarge
            icon="recommendedCharts"
            label="Recommended Charts"
            title="Recommended Charts"
            ariaLabel="Recommended Charts"
          />
        </Large>
        {CHART_GALLERIES.map((gallery) => (
          <TbMenu
            key={gallery.label}
            icon={gallery.glyph}
            label={gallery.label}
            title={`Insert ${gallery.label.toLowerCase()} chart`}
            ariaLabel={`Insert ${gallery.label.toLowerCase()} chart`}
            items={chartMenu(gallery)}
          />
        ))}
      </Group>

      <Group label="Sparklines" variant="grid">
        <Tb
          icon="sparkLine"
          label="Line"
          title="Insert line sparklines"
          ariaLabel="Insert line sparklines"
        />
        <Tb
          icon="sparkColumn"
          label="Column"
          title="Insert column sparklines"
          ariaLabel="Insert column sparklines"
        />
        <Tb
          icon="sparkWinLoss"
          label="Win/Loss"
          title="Insert win/loss sparklines"
          ariaLabel="Insert win/loss sparklines"
        />
      </Group>

      <Group label="Filters" variant="grid">
        <Large>
          <TbLarge icon="slicer" label="Slicer" title="Slicer" ariaLabel="Slicer" />
        </Large>
        <Large>
          <TbLarge
            icon="timeline"
            label="Timeline"
            title="Timeline"
            ariaLabel="Timeline"
          />
        </Large>
      </Group>

      <Group label="Links" variant="grid">
        <Large>
          <TbLarge icon="link" label="Link" title="Link (Ctrl+K)" ariaLabel="Link" />
        </Large>
      </Group>

      <Group label="Comments" variant="grid">
        <Large>
          <TbLarge icon="note" label="Note" title="Note (Shift+F2)" ariaLabel="Note" />
        </Large>
        <Large>
          <TbLarge
            icon="comment"
            label="Comment"
            title="Comment (Ctrl+Shift+F2)"
            ariaLabel="Comment"
          />
        </Large>
      </Group>

      <Group label="Text" variant="grid">
        <Tb icon="textBox" label="Text Box" title="Text Box" />
        <Tb
          icon="headerFooter"
          label="Header & Footer"
          title="Header & Footer"
          ariaLabel="Header & Footer"
        />
        <Tb icon="wordArt" label="WordArt" title="WordArt" />
      </Group>

      <Group label="Cells" variant="grid">
        <Tb icon="checkbox" label="Checkbox" title="Checkbox" />
        <Tb icon="dropdown" label="Dropdown" title="Dropdown" />
        <Tb icon="calendar" label="Date Picker" title="Date Picker" />
      </Group>

      <Group label="Symbols" variant="grid">
        <Large>
          <LargeSplit
            icon="math"
            label="Equation"
            title="Equation"
            items={EQUATIONS}
          />
        </Large>
        <Large>
          <TbLarge icon="symbol" label="Symbol" title="Symbol" ariaLabel="Symbol" />
        </Large>
      </Group>

      <Group label="Sheets" variant="grid">
        <Tb icon="newSheet" label="New Sheet" title="New Sheet (Shift+F11)" />
      </Group>
    </>
  )
}
