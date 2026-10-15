import type { ReactNode } from "react"
import { ChevronDown } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSubmenu,
  DropdownMenuSubmenuContent,
  DropdownMenuSubmenuTrigger,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { cn } from "@workspace/ui/lib/utils"

import { RibbonIcon } from "../../ribbon-icons/ribbon-icon"

/**
 * The ribbon's shared primitives, ported from the reference's
 * `src/ui/ribbon.js` + `src/styles/chrome.css`: 86px panel card of group
 * columns split by hairlines, 24px small commands (icon 20, 12px label) in a
 * 3-row column-flow grid, and 74px large commands (icon 32 over a two-line
 * label) spanning the group. Rounding comes from the design system
 * (`rounded-md`); icons and sizes are the reference's own. Home and every
 * other tab build on these — see home-ribbon.tsx, insert-ribbon.tsx.
 */

/* ---------- menu model ---------- */

export type Item = { l: string; g?: string }

/**
 * One entry of a command's menu: a plain item, a separator (`"sep"`), a
 * heading, a tile gallery (charts, shapes) or a nested submenu. Labels and
 * glyphs follow the reference's `toMenuItems` output.
 */
export type MenuItem =
  | "sep"
  | { header: string }
  | { label: string; glyph?: string; title?: string; submenu?: MenuItem[] }
  | { tiles: Tile[]; columns?: number; label?: string }

/** A gallery tile: a drawn command icon (`glyph`) or an inline drawing (`svg`). */
export type Tile = {
  label: string
  glyph?: string
  svg?: string
  viewBox?: string
  w?: number
  h?: number
}

/* ---------- metrics ---------- */

/** Small command button: 24px tall, 12px text, `rounded-md` from the tokens. */
export const BTN =
  "inline-flex h-6 min-w-6 shrink-0 items-center justify-center gap-[5px] rounded-md px-1 text-xs text-foreground transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/40 data-[popup-open]:bg-muted"

/** Large command: 74px tall, icon over a two-line 12px label. */
export const LARGE =
  "flex h-[74px] min-w-12 max-w-[74px] shrink-0 flex-col items-center justify-start gap-0.5 rounded-md px-1 pt-0.5 pb-1 text-xs text-foreground transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/40 data-[popup-open]:bg-muted"

/** The panel's fixed height and the group's 3-row command grid (chrome.css). */
export const PANEL_ROWS = "grid-rows-[repeat(3,24px)]"

/* ---------- small pieces ---------- */

/** The reference's 5×5 drop mark (ribbon.css ::after), drawn as a border chevron. */
export function Caret({ large = false }: { large?: boolean }) {
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
export function Chev({
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

/**
 * A ribbon group: a column of commands split from its neighbours by a
 * hairline. Home lays its commands out as stacks and rows (`flex`); every
 * other tab flows them through the reference's 3-row grid (`grid`
 * — chrome.css `grid-template-rows: repeat(3, 24px)`, auto-flow column), a
 * large command spanning all three rows. The caption is not drawn, as on the
 * reference's chrome; the group still names itself for assistive technology.
 */
export function Group({
  label,
  variant = "flex",
  children,
}: {
  label: string
  variant?: "flex" | "grid"
  children: ReactNode
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex flex-none flex-col border-r border-border px-2 last:border-r-0"
    >
      {variant === "grid" ? (
        <div
          className={cn(
            "grid flex-1 content-center justify-items-start gap-x-1 gap-y-[2px]",
            PANEL_ROWS,
            "grid-flow-col"
          )}
        >
          {children}
        </div>
      ) : (
        <div className="flex flex-1 items-center gap-1">{children}</div>
      )}
    </div>
  )
}

export function Stack({
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

export function Row({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-px">{children}</div>
}

export function Divider({ tall = false }: { tall?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn("mx-[3px] w-px shrink-0 bg-border", tall ? "h-14" : "h-5")}
    />
  )
}

/* ---------- commands ---------- */

/** Icon command; `size` matches the reference (btn() draws at 18, makeButton at 20). */
export function Tb({
  icon,
  size = 18,
  label,
  title,
  ariaLabel,
}: {
  icon: string
  size?: number
  label?: string
  title: string
  ariaLabel?: string
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={ariaLabel ?? (label ? undefined : title)}
      className={cn(BTN, label && "justify-start")}
    >
      <RibbonIcon name={icon} size={size} />
      {label && <span className="whitespace-nowrap">{label}</span>}
    </button>
  )
}

/** A gallery tile inside a menu: the drawn icon, or a raw SVG drawing. */
function TileFace({ tile }: { tile: Tile }) {
  if (tile.svg) {
    return (
      <svg
        aria-hidden="true"
        viewBox={tile.viewBox ?? "0 0 100 100"}
        width={tile.w ?? 26}
        height={tile.h ?? 22}
        preserveAspectRatio="xMidYMid meet"
        dangerouslySetInnerHTML={{ __html: tile.svg }}
      />
    )
  }
  return <RibbonIcon name={tile.glyph ?? "info"} size={tile.w ?? 32} />
}

/**
 * A command's menu: plain items, separators, headings, tile galleries and
 * nested submenus, all as the reference's menus read (menubar.js, menu.js).
 */
export function MenuList({
  items,
  className,
}: {
  items: MenuItem[]
  className?: string
}) {
  return (
    <DropdownMenuContent
      align="start"
      className={cn("min-w-[220px]", className)}
    >
      {items.map((item, index) => {
        if (item === "sep") {
          return <DropdownMenuSeparator key={`sep-${index}`} />
        }
        if ("header" in item) {
          return (
            <DropdownMenuLabel key={`h-${item.header}`}>
              {item.header}
            </DropdownMenuLabel>
          )
        }
        if ("tiles" in item) {
          const columns = item.columns ?? 3
          return (
            <div
              key={`tiles-${index}`}
              role="group"
              aria-label={item.label ?? "Gallery"}
              className="grid gap-1 p-1"
              style={{ gridTemplateColumns: `repeat(${columns}, auto)` }}
            >
              {item.tiles.map((tile) => (
                <DropdownMenuItem
                  key={tile.label}
                  title={tile.label}
                  aria-label={tile.label}
                  className="size-9 justify-center p-1"
                >
                  <TileFace tile={tile} />
                </DropdownMenuItem>
              ))}
            </div>
          )
        }
        if (item.submenu) {
          return (
            <DropdownMenuSubmenu key={item.label}>
              <DropdownMenuSubmenuTrigger className="justify-between">
                {item.glyph && <RibbonIcon name={item.glyph} size={16} />}
                <span className="flex-1 truncate">{item.label}</span>
              </DropdownMenuSubmenuTrigger>
              <DropdownMenuSubmenuContent>
                <MenuList items={item.submenu} />
              </DropdownMenuSubmenuContent>
            </DropdownMenuSubmenu>
          )
        }
        return (
          <DropdownMenuItem key={`${item.label}-${index}`} title={item.title}>
            {item.glyph && <RibbonIcon name={item.glyph} size={16} />}
            <span className="truncate">{item.label}</span>
          </DropdownMenuItem>
        )
      })}
    </DropdownMenuContent>
  )
}

/**
 * Menu command: icon (+ optional label) and a drop mark. `chev` uses the
 * explicit 10px chevron (Borders, Orientation); otherwise the 5×5 mark the
 * reference's `ribbon-command[aria-haspopup]` draws.
 */
export function TbMenu({
  icon,
  size = 20,
  label,
  title,
  items,
  chev = false,
  className,
  ariaLabel,
}: {
  icon: string
  size?: number
  label?: string
  title: string
  items: MenuItem[]
  chev?: boolean
  className?: string
  ariaLabel?: string
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        title={title}
        aria-label={ariaLabel ?? (label ? undefined : title)}
        className={cn(BTN, label && "justify-start", className)}
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
export function TbLargeMenu({
  icon,
  label,
  title,
  items,
  ariaLabel,
}: {
  icon: string
  label: string
  title: string
  items: MenuItem[]
  ariaLabel?: string
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        title={title}
        aria-label={ariaLabel ?? title}
        className={LARGE}
      >
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
export function TbSplitMenu({
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
        aria-label={title}
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

/**
 * Large split command: a 52px face (icon over label) over a 22px arrow strip,
 * the whole split opening the menu — the reference's `ribbon-split-large`
 * (ribbon.css lines 121-122), as Paste and Insert ▸ Equation draw it.
 */
export function LargeSplit({
  icon,
  label,
  title,
  items,
  ariaLabel,
}: {
  icon: string
  label: string
  title: string
  items: MenuItem[]
  ariaLabel?: string
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        title={title}
        aria-label={ariaLabel ?? title}
        className="flex h-[74px] min-w-12 max-w-[74px] shrink-0 flex-col overflow-hidden rounded-md text-xs text-foreground transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/40 data-[popup-open]:bg-muted"
      >
        <span className="flex min-h-[52px] flex-1 flex-col items-center justify-start gap-0.5 px-1 pt-0.5">
          <RibbonIcon name={icon} size={32} />
          <span className="line-clamp-2 text-center leading-[15px] whitespace-normal">
            {label}
          </span>
        </span>
        <span className="flex h-[22px] w-full items-center justify-center">
          <Chev size={12} />
        </span>
      </DropdownMenuTrigger>
      <MenuList items={items} />
    </DropdownMenu>
  )
}

/** A large plain command (no menu): the 74px icon-over-label button. */
export function TbLarge({
  icon,
  label,
  title,
  ariaLabel,
}: {
  icon: string
  label: string
  title: string
  ariaLabel?: string
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={ariaLabel ?? title}
      className={LARGE}
    >
      <RibbonIcon name={icon} size={32} />
      <span className="line-clamp-2 text-center leading-[15px] whitespace-normal">
        {label}
      </span>
    </button>
  )
}
