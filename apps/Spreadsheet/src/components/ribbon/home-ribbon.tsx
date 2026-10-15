import { ChevronDown } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { cn } from "@workspace/ui/lib/utils"

import { RibbonIcon } from "../../ribbon-icons/ribbon-icon"
import {
  Divider,
  Group,
  LargeSplit,
  Row,
  Stack,
  Tb,
  TbLargeMenu,
  TbMenu,
  TbSplitMenu,
  type MenuItem,
} from "./ribbon-kit"

/**
 * The Home tab, rebuilt to the reference's exact layout
 * (`src/ui/toolbar.js` lines 545-574 + `src/styles/chrome.css` overrides):
 * 86px card, 24px buttons, 32px large commands, 20/18px icons, stacks and
 * rows with hairline dividers — but rounding comes from the design system
 * (`rounded-md`) instead of the reference's literal 3/4px. Icons are the
 * reference's own two-tone drawings (src/ribbon-icons). Controls are visual
 * only: shadcn Select and DropdownMenu open and show their own value; no
 * command is wired yet (docs/spreadsheet-plan.md, Phase 1).
 */

/* ---------- exact option lists from the reference ---------- */

// core/format.js FONTS (display names)
const FONTS = [
  "Default",
  "Arial",
  "Arial Black",
  "Calibri",
  "Cambria",
  "Aharoni",
  "Avenir Next LT Pro",
  "Century Gothic",
  "Constantia",
  "Corbel",
  "Helvetica",
  "Impact",
  "Lato",
  "Lato Light",
]
// toolbar.js POINT_SIZES
const SIZES = [
  "8", "9", "10", "11", "12", "14", "16", "18", "20", "22", "24", "26",
  "28", "36", "48", "72",
]
const FORMATS = [
  "General",
  "Number",
  "Currency",
  "Accounting",
  "Short Date",
  "Long Date",
  "Time",
  "Percentage",
  "Fraction",
  "Scientific",
  "Text",
]
// toolbar.js TEXT_COLORS / FILL_COLORS
const TEXT_COLORS = [
  "#0b0b0b", "#4f4e4b", "#918f88", "#c22a2a", "#b45309", "#8a5a00",
  "#006300", "#0e7490", "#0a63f0", "#4a3aa7", "#9d174d", "#ffffff",
]
const FILL_COLORS = [
  "#fde8e8", "#fdebd3", "#fef3c7", "#e3f5e1", "#dff3f6", "#e0ecff",
  "#ebe6fb", "#fbe4ef", "#f2f1ee", "#e7e6e1", "#c3c2b7", "#0b0b0b",
]
// The workbook theme's colour row (as the reference's theme block draws it)
const THEME_COLORS = [
  "#ffffff", "#000000", "#e7e6e6", "#44546a", "#4472c4",
  "#ed7d31", "#a5a5a5", "#ffc000", "#5b9bd5", "#70ad47",
]

/* ---------- menu contents (labels and glyphs as in the reference) ---------- */

const PASTE: MenuItem[] = [
  { label: "Paste", glyph: "paste" },
  { label: "Paste Values", glyph: "toValues" },
  { label: "Paste Formulas", glyph: "fx" },
  "sep",
  { label: "Transpose", glyph: "swap" },
]
const BORDERS: MenuItem[] = [
  { label: "All borders", glyph: "borders" },
  { label: "Outer borders", glyph: "borderOuter" },
  { label: "Inner borders", glyph: "borderInner" },
  { label: "Horizontal borders", glyph: "rows" },
  { label: "Vertical borders", glyph: "cols" },
  "sep",
  { label: "Top border", glyph: "borderTop" },
  { label: "Bottom border", glyph: "borderBottom" },
  { label: "Left border", glyph: "borderLeft" },
  { label: "Right border", glyph: "borderRight" },
  "sep",
  { label: "Thick outside borders", glyph: "borderOuter" },
  { label: "Bottom double border", glyph: "borderBottom" },
  { label: "Thick bottom border", glyph: "borderBottom" },
  "sep",
  { label: "Border color…", glyph: "textColor" },
  { label: "Border style…", glyph: "borderBottom" },
  "sep",
  { label: "No borders", glyph: "borderNone" },
  { label: "More borders…", glyph: "sliders" },
]
const ORIENTATION: MenuItem[] = [
  { label: "Angle Counterclockwise" },
  { label: "Angle Clockwise" },
  { label: "Rotate Text Up" },
  { label: "Rotate Text Down" },
  "sep",
  { label: "Format Cell Alignment…", glyph: "formatCells" },
]
const MERGE: MenuItem[] = [
  { label: "Merge & Center", glyph: "merge" },
  { label: "Merge Across", glyph: "rows" },
  { label: "Merge Cells", glyph: "merge" },
  "sep",
  { label: "Unmerge Cells", glyph: "unmerge" },
]
const ACCOUNTING: MenuItem[] = [
  { label: "$ English (United States)" },
  { label: "£ English (United Kingdom)" },
  { label: "€ Euro (€ 123)" },
  { label: "¥ Chinese (PRC)" },
  { label: "CHF French (Switzerland)" },
  "sep",
  { label: "More Accounting Formats…", glyph: "formatCells" },
]
const CF: MenuItem[] = [
  { label: "Top 10 Items…" },
  { label: "Bottom 10 Items…" },
  "sep",
  { label: "Data Bars" },
  { label: "Color Scales" },
  "sep",
  { label: "New Rule…" },
  { label: "Clear Rules from All Cells" },
]
const TABLE_STYLE: MenuItem[] = [
  { label: "New Table Style…" },
  { label: "New Cell Style…" },
]
const CELL_STYLES: MenuItem[] = [
  { label: "Normal" },
  { label: "Bad" },
  { label: "Good" },
  { label: "Neutral" },
  { label: "Warning" },
  "sep",
  { label: "Heading 1" },
  { label: "Title" },
  { label: "Total" },
]
const INSERT: MenuItem[] = [
  { label: "Insert Cells…", glyph: "insertCells" },
  { label: "Insert Copied Cells…", glyph: "paste" },
  "sep",
  { label: "Insert Sheet Rows", glyph: "rows" },
  { label: "Insert Sheet Columns", glyph: "cols" },
  "sep",
  { label: "Insert Sheet", glyph: "insertSheet" },
]
const DELETE: MenuItem[] = [
  { label: "Delete Cells…", glyph: "deleteCells" },
  "sep",
  { label: "Delete Sheet Rows", glyph: "deleteRows" },
  { label: "Delete Sheet Columns", glyph: "deleteCols" },
  "sep",
  { label: "Delete Sheet", glyph: "deleteSheet" },
]
const FORMAT_CELLS: MenuItem[] = [
  { label: "Row Height…", glyph: "rowHeight" },
  { label: "Column Width…", glyph: "colWidth" },
  "sep",
  { label: "Hide & Unhide", glyph: "hideEye" },
  { label: "Rename Sheet…" },
  "sep",
  { label: "Format Cells…", glyph: "formatCells" },
]
const AUTOSUM: MenuItem[] = [
  { label: "Sum", glyph: "sigma" },
  { label: "Average", glyph: "math" },
  { label: "Count Numbers", glyph: "stats" },
  { label: "Max" },
  { label: "Min" },
  "sep",
  { label: "More Functions…", glyph: "fx" },
]
const FILL: MenuItem[] = [
  { label: "Down", glyph: "fillDown" },
  { label: "Right", glyph: "fillRight" },
  { label: "Up", glyph: "fillUp" },
  { label: "Left", glyph: "fillLeft" },
  "sep",
  { label: "Across Worksheets" },
  { label: "Series…" },
]
const CLEAR: MenuItem[] = [
  { label: "Clear All", glyph: "eraser" },
  { label: "Clear Formats", glyph: "resetStyle" },
  { label: "Clear Contents" },
  "sep",
  { label: "Clear Comments and Notes", glyph: "deleteNote" },
  { label: "Clear Hyperlinks", glyph: "unlink" },
]
const SORT: MenuItem[] = [
  { label: "Sort A to Z", glyph: "sortAsc" },
  { label: "Sort Z to A", glyph: "sortDesc" },
  "sep",
  { label: "Custom Sort…", glyph: "sliders" },
  "sep",
  { label: "Filter", glyph: "filter" },
  { label: "Subtotals…", glyph: "sigma" },
  { label: "Create table…", glyph: "table" },
  { label: "Remove duplicate rows…", glyph: "dedupe" },
  "sep",
  { label: "Pivot table…", glyph: "pivot" },
  { label: "Goal seek…", glyph: "sliders" },
  { label: "Data analysis…", glyph: "dataAnalysis" },
]
const FIND: MenuItem[] = [
  { label: "Find…", glyph: "find" },
  { label: "Replace…", glyph: "replace" },
  { label: "Go To…", glyph: "goTo" },
  "sep",
  { label: "Go To Special…", glyph: "sliders" },
]

/* ---------- Home-only pieces ---------- */

/** Paste: the large split — a 52px face over a 22px arrow strip. */
function PasteSplit() {
  return <LargeSplit icon="paste" label="Paste" title="Paste (Ctrl+V)" items={PASTE} />
}

/**
 * Colour split: the face shows the icon over the colour it applies (yellow
 * fill, red text — the reference's `lastColor`), the 14px arrow opens the
 * palette as a grid of swatches.
 */
function ColorSplit({
  icon,
  title,
  bar,
  themeLabel,
  colors,
}: {
  icon: string
  title: string
  bar: string
  themeLabel: string
  colors: string[]
}) {
  const Swatch = ({ color, name }: { color: string; name?: string }) => (
    <DropdownMenuItem title={name ?? color} className="p-0!">
      <span
        className="block size-7 rounded-sm border border-input"
        style={{ background: color }}
      />
    </DropdownMenuItem>
  )
  return (
    <span className="flex h-6 shrink-0 items-stretch overflow-hidden rounded-md">
      <button
        type="button"
        title={title}
        aria-label={title}
        className="flex flex-col items-center justify-center px-1.5 outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/40"
      >
        <RibbonIcon name={icon} size={18} />
        <span
          aria-hidden="true"
          className="mt-px h-1 w-4 rounded-[1px]"
          style={{ background: bar }}
        />
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger
          title={`${title} options`}
          aria-label={`${title} options`}
          className="flex w-[14px] items-center justify-center outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/40 data-[popup-open]:bg-muted"
        >
          <ChevronDown
            aria-hidden="true"
            size={10}
            strokeWidth={1.8}
            className="text-muted-foreground"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[232px] p-2">
          <DropdownMenuLabel>{themeLabel}</DropdownMenuLabel>
          <div className="mb-1 grid grid-cols-10 gap-1">
            {THEME_COLORS.map((color) => (
              <Swatch key={color} color={color} />
            ))}
          </div>
          <DropdownMenuLabel>Standard Colors</DropdownMenuLabel>
          <div className="grid grid-cols-6 gap-1.5">
            <DropdownMenuItem title="No fill" className="p-0!">
              <span className="block size-7 rounded-sm border border-dashed border-input bg-background" />
            </DropdownMenuItem>
            {colors.map((color) => (
              <Swatch key={color} color={color} />
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </span>
  )
}

/** A ribbon value field (Font, Font size, Number format) as a real shadcn Select. */
function FieldSelect({
  items,
  defaultValue,
  title,
  className,
  preview = false,
}: {
  items: string[]
  defaultValue: string
  title: string
  className: string
  preview?: boolean
}) {
  return (
    <Select
      defaultValue={defaultValue}
      items={items.map((value) => ({ label: value, value }))}
    >
      <SelectTrigger
        aria-label={title}
        title={title}
        className={cn("h-[26px]! text-[13px]! font-medium", className)}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem
            key={item}
            value={item}
            style={
              preview && item !== "Default" ? { fontFamily: item } : undefined
            }
          >
            {item}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

/* ---------- the Home tab ---------- */

/**
 * Home: Clipboard, Font, Alignment, Number, Styles, Cells, Editing — the
 * reference's assembly in toolbar.js, every glyph and size as it draws them.
 */
export function HomeRibbon() {
  return (
    <>
      <Group label="Clipboard">
        <PasteSplit />
        <Stack>
          <Tb icon="cut" size={20} title="Cut (Ctrl+X)" />
          <Tb icon="copy" size={20} title="Copy (Ctrl+C)" />
          <Tb
            icon="paint"
            title="Format Painter (Ctrl+Shift+C)"
          />
        </Stack>
      </Group>

      <Group label="Font">
        <Stack rows>
          <Row>
            <FieldSelect
              title="Font"
              items={FONTS}
              defaultValue="Default"
              className="w-[132px]!"
              preview
            />
            <FieldSelect
              title="Font size"
              items={SIZES}
              defaultValue="11"
              className="w-[48px]!"
            />
            <Tb icon="fontGrow" title="Increase font size" />
            <Tb icon="fontShrink" title="Decrease font size" />
          </Row>
          <Row>
            <Tb icon="bold" title="Bold (Ctrl+B)" />
            <Tb icon="italic" title="Italic (Ctrl+I)" />
            <Tb icon="underline" title="Underline (Ctrl+U)" />
            <Divider />
            <TbMenu
              icon="borders"
              size={18}
              title="Borders"
              items={BORDERS}
              chev
            />
            <Divider />
            <ColorSplit
              icon="fill"
              title="Fill color"
              bar="#ffff00"
              themeLabel="Theme fill colors"
              colors={FILL_COLORS}
            />
            <ColorSplit
              icon="textColor"
              title="Text color"
              bar="#ff0000"
              themeLabel="Theme text colors"
              colors={TEXT_COLORS}
            />
          </Row>
        </Stack>
      </Group>

      <Group label="Alignment">
        <Stack rows>
          <Row>
            <Tb icon="valignTop" title="Top align" />
            <Tb icon="valignMiddle" title="Middle align" />
            <Tb icon="valignBottom" title="Bottom align" />
            <Divider />
            <TbMenu
              icon="orientation"
              size={18}
              title="Orientation"
              items={ORIENTATION}
              chev
            />
          </Row>
          <Row>
            <Tb icon="alignLeft" title="Align left" />
            <Tb icon="alignCenter" title="Align center" />
            <Tb icon="alignRight" title="Align right" />
            <Divider />
            <Tb icon="indentLess" title="Decrease indent" />
            <Tb icon="indentMore" title="Increase indent" />
          </Row>
        </Stack>
        <Divider tall />
        <Stack>
          <Tb icon="wrap" label="Wrap Text" title="Wrap Text" />
          <TbSplitMenu
            faceIcon="merge"
            faceSize={18}
            faceLabel="Merge & Center"
            arrowSize={10}
            title="Merge & Center"
            items={MERGE}
          />
        </Stack>
      </Group>

      <Group label="Number">
        <Stack rows>
          <Row>
            <FieldSelect
              title="Number format"
              items={FORMATS}
              defaultValue="General"
              className="w-[118px]!"
            />
          </Row>
          <Row>
            <TbSplitMenu
              faceIcon="accounting"
              faceSize={18}
              arrowSize={10}
              title="Accounting Number Format"
              items={ACCOUNTING}
            />
            <Tb icon="percent" title="Percent Style" />
            <Tb icon="comma" title="Comma Style" />
            <Divider />
            <Tb icon="decimalMore" title="Increase Decimal" />
            <Tb icon="decimalLess" title="Decrease Decimal" />
          </Row>
        </Stack>
      </Group>

      <Group label="Styles">
        <TbLargeMenu
          icon="condFormat"
          label="Conditional Formatting"
          title="Conditional Formatting"
          items={CF}
        />
        <TbLargeMenu
          icon="formatTable"
          label="Format as Table"
          title="Format as Table"
          items={TABLE_STYLE}
        />
        <TbLargeMenu
          icon="cellStyles"
          label="Cell Styles"
          title="Cell Styles"
          items={CELL_STYLES}
        />
      </Group>

      <Group label="Cells">
        <Stack>
          <TbMenu
            icon="insertCells"
            label="Insert"
            title="Insert cells"
            items={INSERT}
          />
          <TbMenu
            icon="deleteCells"
            label="Delete"
            title="Delete cells"
            items={DELETE}
          />
          <TbMenu
            icon="formatCells"
            label="Format"
            title="Format cells"
            items={FORMAT_CELLS}
          />
        </Stack>
      </Group>

      <Group label="Editing">
        <Stack>
          <TbSplitMenu
            faceIcon="autosum"
            title="AutoSum (Alt+=)"
            items={AUTOSUM}
          />
          <TbMenu icon="fillDown" title="Fill" items={FILL} />
          <TbMenu icon="eraser" title="Clear" items={CLEAR} />
        </Stack>
        <TbLargeMenu
          icon="sortFilter"
          label="Sort & Filter"
          title="Sort & Filter"
          items={SORT}
        />
        <TbLargeMenu
          icon="find"
          label="Find & Select"
          title="Find & Select (Ctrl+F)"
          items={FIND}
        />
      </Group>
    </>
  )
}
