import { ChevronDown } from "lucide-react"

import { RibbonIcon } from "../ribbon-icons/ribbon-icon"

/**
 * The bar under the ribbon — an exact copy of the reference's idle formula
 * bar: `createFormulaBar(ctx, { fixedActions: true })` (src/ui/formulabar.js
 * line 68) laid out name box → named-ranges arrow → Insert function → input →
 * expand chevron, at its metrics from src/styles/editor.css lines 271-393
 * and tokens.css: 40px tall, 92/24/36/30px segments, hairline separators
 * (rgba ink 10%), hairline-strong base (18%), 13px semibold tabular name at
 * ink-2, 13.5px input at ink, accent-wash hover on the named-ranges arrow,
 * accent-green inset underline on focus. The reference's ink/hairline/accent
 * values map onto our tokens (foreground at 70/60/10/18%, primary wash) so
 * the light look is identical and theming still works. Static UI: fields
 * take text, no command is wired (docs/spreadsheet-plan.md, Phase 1).
 */
export function FormulaBar() {
  return (
    <div
      role="group"
      aria-label="Formula bar"
      className="flex h-10 shrink-0 border-b border-foreground/[0.18] bg-card"
    >
      {/* name-box: 92px, centered semibold reference, accent wash on focus */}
      <input
        type="text"
        dir="auto"
        spellCheck={false}
        autoComplete="off"
        defaultValue="A1"
        aria-label="Cell reference"
        title="Go to cell or range"
        className="w-[92px] shrink-0 border-r border-foreground/10 px-2.5 text-center text-[13px] font-semibold tabular-nums text-foreground/70 outline-none focus:bg-primary/12 focus:text-foreground focus:shadow-[inset_0_-2px_0_var(--primary)]"
      />
      {/* name-menu-btn: 24px, chevD 14/2, hover and focus take the accent wash */}
      <button
        type="button"
        title="Named ranges"
        aria-label="Named ranges"
        className="grid w-6 shrink-0 place-items-center border-r border-foreground/10 text-foreground/60 outline-none hover:bg-primary/12 hover:text-foreground focus-visible:bg-primary/12 focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
      >
        <ChevronDown aria-hidden="true" size={14} strokeWidth={2} />
      </button>
      {/* fx-btn: 36px, the reference's own fx drawing, green on hover */}
      <button
        type="button"
        title="Insert function"
        aria-label="Insert function"
        className="grid w-9 shrink-0 place-items-center border-r border-foreground/10 text-foreground/60 outline-none hover:bg-secondary hover:text-primary focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
      >
        <RibbonIcon name="fx" size={18} />
      </button>
      {/* formula-input: flexes to the bar, inset accent underline on focus */}
      <input
        type="text"
        dir="auto"
        spellCheck={false}
        autoComplete="off"
        aria-label="Formula or value"
        className="min-w-0 flex-1 bg-transparent px-3 text-[13.5px] text-foreground outline-none focus:shadow-[inset_0_-2px_0_var(--primary)]"
      />
      {/* fx-expand: 30px, border-left, chevD 16/2 at rest (bar collapsed) */}
      <button
        type="button"
        aria-expanded="false"
        title="Expand the formula bar"
        aria-label="Expand the formula bar"
        className="grid w-[30px] shrink-0 place-items-center border-l border-foreground/10 text-foreground/60 outline-none hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
      >
        <ChevronDown aria-hidden="true" size={16} strokeWidth={2} />
      </button>
    </div>
  )
}
