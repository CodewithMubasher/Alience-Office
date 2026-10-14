import type { ComponentType } from "react"
import { ChevronDown, Info } from "lucide-react"

import { commandIcon } from "./command-icons.js"
// The two-tone command-icon drawings and their stylesheet are ported verbatim
// from the reference project (MIT — docs/adr and LICENSE attribution).
import "./icons.css"

/**
 * Interface glyphs (chevrons, plain arrows) stay Lucide line icons, as in the
 * reference's `src/ui/icons.js`; everything else draws from the app's own
 * two-tone command icons on a 20-unit grid.
 */
const LUCIDE: Record<
  string,
  ComponentType<{ className?: string; size?: number; strokeWidth?: number }>
> = {
  chevD: ChevronDown,
}

/**
 * One ribbon/menu icon: the reference's `icon(name, size)` — a drawn command
 * icon when the name has one, a Lucide glyph otherwise. The drawn SVG string
 * is inserted exactly as the reference inserts it, so the `svg.ico` styles in
 * icons.css apply unchanged.
 */
export function RibbonIcon({
  name,
  size = 20,
  className,
}: {
  name: string
  size?: number
  className?: string
}) {
  const drawn = commandIcon(name, size)
  if (drawn) {
    return (
      <span
        aria-hidden="true"
        className={`inline-flex shrink-0 ${className ?? ""}`}
        style={{ width: size, height: size }}
        dangerouslySetInnerHTML={{ __html: drawn }}
      />
    )
  }
  const Glyph = LUCIDE[name] ?? Info
  return (
    <Glyph
      aria-hidden="true"
      size={size}
      strokeWidth={1.8}
      className={`shrink-0 ${className ?? ""}`}
    />
  )
}
