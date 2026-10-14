import { useRef, useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { HomeRibbon } from "./home-ribbon"
import { RIBBON_TABS } from "./ribbon-data"

/** An empty command slot: where a real button goes once the engine lands. */
const GHOST_SMALL =
  "h-6 w-[76px] rounded-md border border-dashed border-border bg-muted/50"
const GHOST_LARGE =
  "h-[74px] w-12 rounded-md border border-dashed border-border bg-muted/50"

/**
 * The ribbon: the tab bar under the topbar and the horizontal card below it.
 * Mirrors the reference (`src/ui/ribbon.js` + `src/styles/chrome.css`): 34px
 * tabs with rounded tops and a 3px underline on the selected one, and an 86px
 * panel card (rounded, shadowed, 8px in from the edges) of group columns
 * split by hairlines — group captions are not drawn, as in the reference's
 * chrome, the groups naming themselves to assistive technology. UI-first
 * milestone: the Home tab is filled (home-ribbon.tsx), other tabs show
 * placeholder slots (docs/spreadsheet-plan.md, Phase 1). The chevron — or a
 * double-click on a tab, as in the reference — collapses the card.
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
    <div className="flex flex-none flex-col border-b bg-background pb-1.5">
      {/* Tab row */}
      <div className="flex items-center px-2.5">
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
                className={`relative h-[34px] flex-none rounded-t-[5px] px-[11px] text-[13px] whitespace-nowrap transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/40 ${
                  selected
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {tab.label}
                {selected && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-[11px] bottom-[3px] h-[3px] rounded-[2px] bg-primary"
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
        className={`mx-2 overflow-hidden rounded-md bg-card shadow-sm transition-[height] duration-200 ease-out ${
          collapsed ? "h-0 shadow-none" : "h-[86px]"
        }`}
      >
        <div className="h-[86px] overflow-x-auto py-[5px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex h-full w-max items-stretch">
            {current.id === "home" ? (
              <HomeRibbon />
            ) : (
              current.groups.map((group) => (
                <div
                  key={group.label}
                  role="group"
                  aria-label={group.label}
                  className="flex flex-none flex-col border-r border-border px-2 last:border-r-0"
                >
                  <div className="flex flex-1 items-center gap-1">
                    {group.large && (
                      <span aria-hidden="true" className={GHOST_LARGE} />
                    )}
                    <div className="flex flex-col gap-[2px]">
                      <span aria-hidden="true" className={GHOST_SMALL} />
                      <span aria-hidden="true" className={GHOST_SMALL} />
                      <span aria-hidden="true" className={GHOST_SMALL} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
