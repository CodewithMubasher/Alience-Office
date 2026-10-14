import { useEffect, useState } from "react"

/** The loading bar fills for exactly this long. */
const FILL_MS = 2000
/** Fade-out after the bar completes (src/splash.css). */
const FADE_MS = 350

/**
 * Cold-load splash: the icon pops in and floats over a breathing glow while
 * a loading line fills for 2 seconds, then the overlay fades away. Shown on
 * every reload/open of the spreadsheet (docs/spreadsheet-plan.md, Phase 1).
 */
export function SplashScreen() {
  const [exiting, setExiting] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const start = window.setTimeout(() => setExiting(true), FILL_MS)
    const end = window.setTimeout(() => setGone(true), FILL_MS + FADE_MS)
    return () => {
      window.clearTimeout(start)
      window.clearTimeout(end)
    }
  }, [])

  if (gone) return null

  return (
    <div
      role="status"
      className={`splash-screen fixed inset-0 z-50 flex flex-col items-center justify-center gap-7 bg-background${
        exiting ? " is-exiting" : ""
      }`}
    >
      <span className="sr-only">Loading spreadsheet…</span>

      {/* Icon: pop-in, then a gentle float above a breathing glow */}
      <div className="splash-pop relative flex items-center justify-center">
        <span
          aria-hidden="true"
          className="splash-glow absolute size-40 rounded-full bg-primary/30 blur-3xl"
        />
        <div className="splash-float relative">
          <img
            src="/spreadsheet.png"
            alt=""
            aria-hidden="true"
            width={112}
            height={112}
            draggable={false}
            className="size-28 select-none"
          />
        </div>
      </div>

      {/* Loading line: fills left → right over exactly 2s */}
      <div className="h-1 w-64 max-w-[60vw] overflow-hidden rounded-full bg-muted">
        <div className="splash-fill relative h-full rounded-full bg-primary">
          <span aria-hidden="true" className="splash-shimmer absolute inset-0" />
        </div>
      </div>
    </div>
  )
}
