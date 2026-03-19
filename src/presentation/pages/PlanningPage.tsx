import { CalendarDays } from "lucide-react"

export function PlanningPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-muted-foreground">
      <CalendarDays className="h-12 w-12" />
      <p className="text-lg font-medium">Planning (bientôt disponible)</p>
    </div>
  )
}
