import {
  ArrowLeft,
  Check,
  Moon,
  Redo2,
  Save,
  Search,
  Share2,
  Sun,
  Table2,
  Undo2,
  User,
} from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Separator } from "@workspace/ui/components/separator"
import { useTheme } from "@/components/theme-provider"

const MENUS = [
  "File",
  "Edit",
  "View",
  "Insert",
  "Format",
  "Data",
  "Tools",
  "Help",
] as const

/** `⌘K` on Apple platforms, `Ctrl+K` elsewhere. */
function paletteHint() {
  if (typeof navigator === "undefined") return "Ctrl+K"
  return /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘K" : "Ctrl+K"
}

/**
 * The editor's title bar: brand + back navigation, quick-access tools, the
 * menu strip, the document name with its save status, and the window actions.
 *
 * UI-first milestone (docs/spreadsheet-plan.md, Phase 1): the full chrome,
 * styled with the shadcn tokens. Commands open their menus in the next
 * step; the theme toggle is live already.
 */
export function Topbar() {
  const { theme, setTheme } = useTheme()
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <header className="flex h-11 shrink-0 items-center gap-1 border-b bg-background px-2">
      {/* Brand + navigation */}
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Back to all spreadsheets"
        title="Back"
      >
        <ArrowLeft />
      </Button>
      <div className="ml-1 flex items-center gap-2">
        <span className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Table2 className="size-3.5" />
        </span>
        <span className="hidden text-sm font-semibold sm:inline">
          Spreadsheet
        </span>
      </div>

      {/* Quick access */}
      <div className="ml-2 flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Undo"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Redo"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Save"
          title="Save (Ctrl+S)"
        >
          <Save />
        </Button>
      </div>

      {/* Menu strip */}
      <Separator orientation="vertical" className="mx-1 h-5" />
      <nav
        aria-label="Main menu"
        className="hidden items-center gap-0 md:flex"
      >
        {MENUS.map((menu) => (
          <Button
            key={menu}
            variant="ghost"
            className="h-7 px-2 text-[13px] font-normal"
          >
            {menu}
          </Button>
        ))}
      </nav>

      {/* Document name + save status */}
      <div className="ml-3 mr-2 flex min-w-0 items-center gap-2">
        <Button
          variant="ghost"
          className="h-7 max-w-48 min-w-0 justify-start px-2 text-[13px] font-normal"
        >
          <span className="truncate">Untitled spreadsheet</span>
        </Button>
        <Badge variant="success" className="hidden lg:inline-flex">
          <Check />
          Saved
        </Badge>
      </div>

      <div className="flex-1" />

      {/* Window actions */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="hidden text-muted-foreground sm:inline-flex"
        >
          <Search />
          <span>Search</span>
          <kbd className="ml-1 rounded border bg-muted px-1 font-sans text-[10px] text-muted-foreground">
            {paletteHint()}
          </kbd>
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Search"
          title="Search (Ctrl+Shift+P)"
          className="sm:hidden"
        >
          <Search />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={
            isDark ? "Switch to light theme" : "Switch to dark theme"
          }
          title={isDark ? "Light mode" : "Dark mode"}
          onClick={() => setTheme(isDark ? "light" : "dark")}
        >
          {isDark ? <Sun /> : <Moon />}
        </Button>
        <Button variant="default" size="sm" className="ml-0.5">
          <Share2 />
          Share
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Account"
          title="Account"
          className="ml-0.5 rounded-full"
        >
          <Avatar className="size-6">
            <AvatarFallback>
              <User className="size-3.5" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </div>
    </header>
  )
}
