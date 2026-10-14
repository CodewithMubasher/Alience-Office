import type { ReactNode } from "react"
import { ChevronDown } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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

type Item = { l: string; g?: string }
/** `"sep"` draws a divider, as the reference's menu items do. */
type MenuItem = Item | "sep"

/* ---------- menu contents (labels and glyphs as in the reference) ---------- */

const PASTE: MenuItem[] = [
  { l: "Paste", g: "paste" },
  { l: "Paste Values", g: "toValues" },
  { l: "Paste Formulas", g: "fx" },
  "sep",
  { l: "Transpose", g: "swap" },
]
const BORDERS: MenuItem[] = [
  { l: "All borders", g: "borders" },
  { l: "Outer borders", g: "borderOuter" },
  { l: "Inner borders", g: "borderInner" },
  { l: "Horizontal borders", g: "rows" },
  { l: "Vertical borders", g: "cols" },
  "sep",
  { l: "Top border", g: "borderTop" },
  { l: "Bottom border", g: "borderBottom" },
  { l: "Left border", g: "borderLeft" },
  { l: "Right border", g: "borderRight" },
  "sep",
  { l: "Thick outside borders", g: "borderOuter" },
  { l: "Bottom double border", g: "borderBottom" },
  { l: "Thick bottom border", g: "borderBottom" },
  "sep",
  { l: "Border color…", g: "textColor" },
  { l: "Border style…", g: "borderBottom" },
  "sep",
  { l: "No borders", g: "borderNone" },
  { l: "More borders…", g: "sliders" },
]
const ORIENTATION: MenuItem[] = [
  { l: "Angle Counterclockwise" },
  { l: "Angle Clockwise" },
  { l: "Rotate Text Up" },
  { l: "Rotate Text Down" },
  "sep",
  { l: "Format Cell Alignment…", g: "formatCells" },
]
const MERGE: MenuItem[] = [
  { l: "Merge & Center", g: "merge" },
  { l: "Merge Across", g: "rows" },
  { l: "Merge Cells", g: "merge" },
  "sep",
  { l: "Unmerge Cells", g: "unmerge" },
]
const ACCOUNTING: MenuItem[] = [
  { l: "$ English (United States)" },
  { l: "£ English (United Kingdom)" },
  { l: "€ Euro (€ 123)" },
  { l: "¥ Chinese (PRC)" },
  { l: "CHF French (Switzerland)" },
  "sep",
  { l: "More Accounting Formats…", g: "formatCells" },
]
const CF: MenuItem[] = [
  { l: "Top 10 Items…" },
  { l: "Bottom 10 Items…" },
  "sep",
  { l: "Data Bars" },
  { l: "Color Scales" },
  "sep",
  { l: "New Rule…" },
  { l: "Clear Rules from All Cells" },
]
const TABLE_STYLE: MenuItem[] = [
  { l: "New Table Style…" },
  { l: "New Cell Style…" },
]
const CELL_STYLES: MenuItem[] = [
  { l: "Normal" },
  { l: "Bad" },
  { l: "Good" },
  { l: "Neutral" },
  { l: "Warning" },
  "sep",
  { l: "Heading 1" },
  { l: "Title" },
  { l: "Total" },
]
const INSERT: MenuItem[] = [
  { l: "Insert Cells…", g: "insertCells" },
  { l: "Insert Copied Cells…", g: "paste" },
  "sep",
  { l: "Insert Sheet Rows", g: "rows" },
  { l: "Insert Sheet Columns", g: "cols" },
  "sep",
  { l: "Insert Sheet", g: "insertSheet" },
]
const DELETE: MenuItem[] = [
  { l: "Delete Cells…", g: "deleteCells" },
  "sep",
  { l: "Delete Sheet Rows", g: "deleteRows" },
  { l: "Delete Sheet Columns", g: "deleteCols" },
  "sep",
  { l: "Delete Sheet", g: "deleteSheet" },
]
const FORMAT_CELLS: MenuItem[] = [
  { l: "Row Height…", g: "rowHeight" },
  { l: "Column Width…", g: "colWidth" },
  "sep",
  { l: "Hide & Unhide", g: "hideEye" },
  { l: "Rename Sheet…" },
  "sep",
  { l: "Format Cells…", g: "formatCells" },
]
const AUTOSUM: MenuItem[] = [
  { l: "Sum", g: "sigma" },
  { l: "Average", g: "math" },
  { l: "Count Numbers", g: "stats" },
  { l: "Max" },
  { l: "Min" },
  "sep",
  { l: "More Functions…", g: "fx" },
]
const FILL: MenuItem[] = [
  { l: "Down", g: "fillDown" },
  { l: "Right", g: "fillRight" },
  { l: "Up", g: "fillUp" },
  { l: "Left", g: "fillLeft" },
  "sep",
  { l: "Across Worksheets" },
  { l: "Series…" },
]
const CLEAR: MenuItem[] = [
  { l: "Clear All", g: "eraser" },
  { l: "Clear Formats", g: "resetStyle" },
  { l: "Clear Contents" },
  "sep",
  { l: "Clear Comments and Notes", g: "deleteNote" },
  { l: "Clear Hyperlinks", g: "unlink" },
]
const SORT: MenuItem[] = [
  { l: "Sort A to Z", g: "sortAsc" },
  { l: "Sort Z to A", g: "sortDesc" },
  "sep",
  { l: "Custom Sort…", g: "sliders" },
  "sep",
  { l: "Filter", g: "filter" },
  { l: "Subtotals…", g: "sigma" },
  { l: "Create table…", g: "table" },
  { l: "Remove duplicate rows…", g: "dedupe" },
  "sep",
  { l: "Pivot table…", g: "pivot" },
  { l: "Goal seek…", g: "sliders" },
  { l: "Data analysis…", g: "dataAnalysis" },
]
const FIND: MenuItem[] = [
  { l: "Find…", g: "find" },
  { l: "Replace…", g: "replace" },
  { l: "Go To…", g: "goTo" },
  "sep",
  { l: "Go To Special…", g: "sliders" },
]

/* ---------- ribbon primitives (chrome.css metrics, design-system rounding) ---------- */

/** Small command button: 24px tall, 12px text, `rounded-md` from the tokens. */
const BTN =
  "inline-flex h-6 min-w-6 shrink-0 items-center justify-center gap-[5px] rounded-md px-1 text-xs text-foreground transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/40 data-[popup-open]:bg-muted"

/** Large command: 74px tall, icon over a two-line 12px label. */
const LARGE =
  "flex h-[74px] min-w-12 max-w-[74px] shrink-0 flex-col items-center justify-start gap-0.5 rounded-md px-1 pt-0.5 pb-1 text-xs text-foreground transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/40 data-[popup-open]:bg-muted"

/** The reference's 5×5 drop mark (ribbon.css ::after), drawn as a border chevron. */
function Caret({ large = false }: { large?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "size-[5px] shrink-0 rotate-45 border-r-[1.4px] border-b-[1.4px] border-current opacity-70",
        large ? "-mt-px" : "-mt-[3px] mr-[2px] ml-px"
      )}
    />
  )
}

/** The explicit chevrons the reference places beside pickers and split arrows. */
function Chev({
  size,
  className,
}: {
  size: 10 | 12 | 14
  className?: string
}) {
  return (
    <ChevronDown
      aria-hidden="true"
      size={size}
      strokeWidth={size === 14 ? 2 : 1.8}
      className={cn("shrink-0 opacity-60", className)}
    />
  )
}

function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    // As on the reference's Mac-style chrome, the caption is not drawn — the
    // group still names itself for assistive technology (chrome.css line 47).
    <div
      role="group"
      aria-label={label}
      className="flex flex-none flex-col border-r border-border px-2 last:border-r-0"
    >
      <div className="flex flex-1 items-center gap-1">{children}</div>
    </div>
  )
}

function Stack({
  rows = false,
  children,
}: {
  rows?: boolean
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-start justify-center",
        rows ? "gap-2.5" : "gap-[3px]"
      )}
    >
      {children}
    </div>
  )
}

function Row({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-px">{children}</div>
}

function Divider({ tall = false }: { tall?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "mx-[3px] w-px shrink-0 bg-border",
        tall ? "h-14" : "h-5"
      )}
    />
  )
}

/** Icon command; `size` matches the reference (btn() draws at 18, makeButton at 20). */
function Tb({
  icon,
  size = 18,
  label,
  title,
}: {
  icon: string
  size?: number
  label?: string
  title: string
}) {
  return (
    <button
      type="button"
      title={title}
      className={cn(BTN, label && "justify-start")}
    >
      <RibbonIcon name={icon} size={size} />
      {label && <span className="whitespace-nowrap">{label}</span>}
    </button>
  )
}

function MenuList({ items }: { items: MenuItem[] }) {
  return (
    <DropdownMenuContent align="start" className="min-w-[220px]">
      {items.map((item, index) =>
        item === "sep" ? (
          <DropdownMenuSeparator key={`sep-${index}`} />
        ) : (
          <DropdownMenuItem key={`${item.l}-${index}`}>
            {item.g && <RibbonIcon name={item.g} size={16} />}
            <span className="truncate">{item.l}</span>
          </DropdownMenuItem>
        )
      )}
    </DropdownMenuContent>
  )
}

/**
 * Menu command: icon (+ optional label) and a drop mark. `chev` uses the
 * explicit 10px chevron (Borders, Orientation); otherwise the 5×5 mark the
 * reference's `ribbon-command[aria-haspopup]` draws.
 */
function TbMenu({
  icon,
  size = 20,
  label,
  title,
  items,
  chev = false,
}: {
  icon: string
  size?: number
  label?: string
  title: string
  items: MenuItem[]
  chev?: boolean
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        title={title}
        className={cn(BTN, label && "justify-start")}
      >
        <RibbonIcon name={icon} size={size} />
        {label && <span className="whitespace-nowrap">{label}</span>}
        {chev ? <Chev size={10} /> : <Caret />}
      </DropdownMenuTrigger>
      <MenuList items={items} />
    </DropdownMenu>
  )
}

/** Primary command of Styles/Editing: the 74px large button with its menu. */
function TbLargeMenu({
  icon,
  label,
  title,
  items,
}: {
  icon: string
  label: string
  title: string
  items: MenuItem[]
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger title={title} className={LARGE}>
        <RibbonIcon name={icon} size={32} />
        <span className="line-clamp-2 text-center leading-[15px] whitespace-normal">
          {label}
        </span>
        <Caret large />
      </DropdownMenuTrigger>
      <MenuList items={items} />
    </DropdownMenu>
  )
}

/** Split command: face and arrow in one 24px button (the whole split opens the menu). */
function TbSplitMenu({
  faceIcon,
  faceSize = 20,
  faceLabel,
  arrowSize = 12,
  title,
  items,
}: {
  faceIcon: string
  faceSize?: number
  faceLabel?: string
  arrowSize?: 10 | 12
  title: string
  items: MenuItem[]
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        title={title}
        className="flex h-6 shrink-0 items-stretch overflow-hidden rounded-md text-xs text-foreground transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/40 data-[popup-open]:bg-muted"
      >
        <span className="flex items-center justify-center gap-[5px] px-1">
          <RibbonIcon name={faceIcon} size={faceSize} />
          {faceLabel && <span className="whitespace-nowrap">{faceLabel}</span>}
        </span>
        <span className="flex w-4 items-center justify-center">
          <Chev size={arrowSize} />
        </span>
      </DropdownMenuTrigger>
      <MenuList items={items} />
    </DropdownMenu>
  )
}

/** Paste: the large split — a 52px face over a 22px arrow strip. */
function PasteSplit() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        title="Paste (Ctrl+V)"
        className="flex h-[74px] min-w-12 max-w-[74px] shrink-0 flex-col overflow-hidden rounded-md text-xs text-foreground transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/40 data-[popup-open]:bg-muted"
      >
        <span className="flex flex-1 flex-col items-center justify-start gap-0.5 px-1 pt-0.5">
          <RibbonIcon name="paste" size={32} />
          <span className="line-clamp-2 text-center leading-[15px] whitespace-normal">
            Paste
          </span>
          <Caret large />
        </span>
        <span className="flex h-[22px] w-full items-center justify-center">
          <Chev size={12} />
        </span>
      </DropdownMenuTrigger>
      <MenuList items={PASTE} />
    </DropdownMenu>
  )
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
