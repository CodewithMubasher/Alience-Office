import { useRef, useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { RIBBON_TABS } from "./ribbon-data"

/** An empty command slot: where a real button goes once the engine lands. */
const GHOST_SMALL =
  "h-6 w-[76px] rounded-[3px] border border-dashed border-border bg-muted/50"
const GHOST_LARGE =
  "h-20 w-12 rounded-[3px] border border-dashed border-border bg-muted/50"

/**
 * The ribbon: the tab bar under the topbar and the horizontal card below it.
 * Mirrors the reference (`src/ui/ribbon.js` + `src/styles/ribbon.css`): 36px
 * tabs with a 3px underline on the selected one, a 112px panel of group
 * columns split by hairlines, captions under each group. UI-first milestone:
 * every group shows placeholder slots and the card switches with the tab
 * (docs/spreadsheet-plan.md, Phase 1). The chevron — or a double-click on a
 * tab, as in the reference — collapses the card and brings it back.
 */
export function Ribbon() {
  const [active, setActive] = useState(RIBBON_TABS[0].id)
  const [collapsed, setCollapsed] = useState(false)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const current = RIBBON_TABS.find((tab) => tab.id === active) ?? RIBBON_TABS[0]

  const selectAt = (index: number) => {
    setActive(RIBBON_TABS[index].id)
    tabRefs.current[index]?.focus()
  }

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const last = RIBBON_TABS.length - 1
    const next =
      event.key === "ArrowRight"
        ? (index + 1) % RIBBON_TABS.length
        : event.key === "ArrowLeft"
          ? (index - 1 + RIBBON_TABS.length) % RIBBON_TABS.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null
    if (next === null) return
    event.preventDefault()
    selectAt(next)
  }

  return (
    <div className="flex flex-none flex-col border-b bg-background">
      {/* Tab row */}
      <div className="flex items-center px-2">
        <div
          role="tablist"
          aria-label="Ribbon"
          className="flex min-w-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {RIBBON_TABS.map((tab, index) => {
            const selected = tab.id === active
            return (
              <button
                key={tab.id}
                ref={(node) => {
                  tabRefs.current[index] = node
                }}
                type="button"
                role="tab"
                id={`ribbon-tab-${tab.id}`}
                aria-selected={selected}
                aria-controls={`ribbon-panel-${tab.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(tab.id)}
                onDoubleClick={() => setCollapsed((value) => !value)}
                onKeyDown={(event) => onKeyDown(event, index)}
                className={`relative h-9 flex-none px-3 text-[13px] whitespace-nowrap transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/40 ${
                  selected
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {tab.label}
                {selected && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-3 bottom-0.5 h-[3px] rounded-full bg-primary"
                  />
                )}
              </button>
            )
          })}
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          className="ml-auto"
          aria-label={collapsed ? "Expand ribbon" : "Collapse ribbon"}
          aria-expanded={!collapsed}
          aria-controls={`ribbon-panel-${current.id}`}
          title={
            collapsed
              ? "Expand ribbon (double-click a tab)"
              : "Collapse ribbon (double-click a tab)"
          }
          onClick={() => setCollapsed((value) => !value)}
        >
          {collapsed ? <ChevronDown /> : <ChevronUp />}
        </Button>
      </div>

      {/* Panel: the horizontal card — one per tab, placeholder groups */}
      <div
        role="tabpanel"
        id={`ribbon-panel-${current.id}`}
        aria-labelledby={`ribbon-tab-${current.id}`}
        aria-hidden={collapsed}
        className={`overflow-hidden border-t bg-card transition-[height] duration-200 ease-out ${
          collapsed ? "h-0 border-t-0" : "h-28"
        }`}
      >
        <div className="h-28 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex h-full w-max items-stretch px-2">
            {current.groups.map((group) => (
              <div
                key={group.label}
                role="group"
                aria-label={group.label}
                className="flex flex-none flex-col border-r px-2 last:border-r-0"
              >
                <div className="flex flex-1 items-center gap-1.5">
                  {group.large && (
                    <span aria-hidden="true" className={GHOST_LARGE} />
                  )}
                  <div className="flex flex-col gap-1.5">
                    <span aria-hidden="true" className={GHOST_SMALL} />
                    <span aria-hidden="true" className={GHOST_SMALL} />
                    <span aria-hidden="true" className={GHOST_SMALL} />
                  </div>
                </div>
                <span className="text-center text-[11px] leading-4 whitespace-nowrap text-muted-foreground">
                  {group.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
