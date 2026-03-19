import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus, X, Loader2, AlertCircle } from "lucide-react"
import { Button } from "../components/ui/button.tsx"
import { usePlanning } from "../hooks/usePlanning.ts"
import { RecipePickerDialog } from "../components/RecipePickerDialog.tsx"
import type { MealieMealPlan, MealieRecipe } from "../../shared/types/mealie.ts"

const DAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

const MEAL_TYPES = [
  { key: "lunch", label: "Déjeuner", color: "bg-amber-50 border-amber-200" },
  { key: "dinner", label: "Dîner", color: "bg-orange-50 border-orange-200" },
] as const

function formatDayDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
}

function formatWeekRange(weekStart: Date): string {
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)
  return `${weekStart.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} — ${weekEnd.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`
}

function MealCell({
  meals,
  onAdd,
  onDelete,
  colorClass,
}: {
  meals: MealieMealPlan[]
  onAdd: () => void
  onDelete: (id: number) => void
  colorClass: string
}) {
  return (
    <td className={`border border-border p-1.5 align-top ${colorClass} min-w-[100px]`}>
      <div className="flex flex-col gap-1">
        {meals.map((meal) => {
          const name = meal.recipe?.name ?? meal.title ?? "Sans titre"
          return (
            <div
              key={meal.id}
              className="group relative flex items-center gap-1.5 rounded-md bg-white/80 p-1.5 shadow-sm"
            >
              {meal.recipe && (
                <img
                  src={`/api/media/recipes/${meal.recipe.id}/images/min-original.webp`}
                  alt={name}
                  className="h-8 w-8 shrink-0 rounded object-cover"
                />
              )}
              <span className="line-clamp-2 flex-1 text-xs font-medium leading-tight">
                {name}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Supprimer "${name}" du planning ?`)) {
                    onDelete(meal.id)
                  }
                }}
                className="shrink-0 rounded p-0.5 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                aria-label={`Supprimer ${name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )
        })}
        <button
          type="button"
          onClick={onAdd}
          className="flex w-full items-center justify-center rounded-md border border-dashed border-current/20 p-1 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </td>
  )
}

export function PlanningPage() {
  const {
    mealPlans,
    loading,
    error,
    currentWeekStart,
    goToPrevWeek,
    goToNextWeek,
    goToCurrentWeek,
    addMeal,
    deleteMeal,
  } = usePlanning()

  const [pickerOpen, setPickerOpen] = useState(false)
  const [pendingSlot, setPendingSlot] = useState<{ date: string; entryType: string } | null>(null)

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentWeekStart)
    date.setDate(date.getDate() + i)
    return date
  })

  const getMeals = (date: Date, type: string) => {
    const key = date.toISOString().slice(0, 10)
    return mealPlans.filter((m) => m.date === key && m.entryType === type)
  }

  const handleAddMeal = (date: string, entryType: string) => {
    setPendingSlot({ date, entryType })
    setPickerOpen(true)
  }

  const handleRecipeSelect = async (recipe: MealieRecipe) => {
    if (!pendingSlot) return
    await addMeal(pendingSlot.date, pendingSlot.entryType, recipe.id)
    setPendingSlot(null)
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Planning</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPrevWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToCurrentWeek}>
            Aujourd'hui
          </Button>
          <Button variant="outline" size="icon" onClick={goToNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <p className="text-sm font-medium text-muted-foreground">
        {formatWeekRange(currentWeekStart)}
      </p>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {/* Colonne étiquette */}
                <th className="w-24 border border-border bg-secondary px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground" />
                {days.map((date, i) => {
                  const isToday = new Date().toDateString() === date.toDateString()
                  return (
                    <th
                      key={date.toISOString()}
                      className={`border border-border px-2 py-2 text-center font-semibold ${
                        isToday
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground"
                      }`}
                    >
                      <div className="text-xs uppercase tracking-wide opacity-70">
                        {DAY_LABELS[i]}
                      </div>
                      <div className="text-sm">{formatDayDate(date)}</div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {MEAL_TYPES.map(({ key, label, color }) => (
                <tr key={key}>
                  <td className="border border-border bg-secondary px-3 py-2 align-middle">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {label}
                    </span>
                  </td>
                  {days.map((date) => (
                    <MealCell
                      key={date.toISOString()}
                      meals={getMeals(date, key)}
                      onAdd={() => handleAddMeal(date.toISOString().slice(0, 10), key)}
                      onDelete={deleteMeal}
                      colorClass={color}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <RecipePickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={handleRecipeSelect}
      />
    </div>
  )
}
