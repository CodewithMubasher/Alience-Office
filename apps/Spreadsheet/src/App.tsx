import { Table2 } from "lucide-react"

import { SplashScreen } from "@/components/splash-screen"
import { Ribbon } from "@/components/ribbon/ribbon"
import { Topbar } from "@/components/topbar"

export function App() {
  return (
    <div className="flex h-svh flex-col overflow-hidden">
      <SplashScreen />
      <Topbar />
      <Ribbon />
      <main className="flex flex-1 items-center justify-center bg-muted/40 p-6">
        <div className="flex max-w-sm flex-col items-center gap-3 text-center">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Table2 className="size-5" />
          </span>
          <h1 className="text-lg font-semibold">The grid goes here</h1>
          <p className="text-sm text-muted-foreground">
            Next up: the ported engine lands and the virtualized grid, formula
            bar, and sheet tabs take over this space.
          </p>
        </div>
      </main>
    </div>
  )
}
