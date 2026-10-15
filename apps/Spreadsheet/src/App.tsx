import { FormulaBar } from "@/components/formula-bar"
import { SplashScreen } from "@/components/splash-screen"
import { Ribbon } from "@/components/ribbon/ribbon"
import { Topbar } from "@/components/topbar"

export function App() {
  return (
    <div className="flex h-svh flex-col overflow-hidden">
      <SplashScreen />
      <Topbar />
      <Ribbon />
      <FormulaBar />
      {/* The sheet area the grid will take over in Phase 1 (docs/spreadsheet-plan.md). */}
      <div aria-hidden="true" className="min-h-0 flex-1 bg-card" />
    </div>
  )
}
