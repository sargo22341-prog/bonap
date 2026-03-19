import { useCallback, useEffect, useState } from "react"
import type { MealieMealPlan } from "../../shared/types/mealie.ts"
import { GetWeekPlanningUseCase } from "../../application/planning/usecases/GetWeekPlanningUseCase.ts"
import { AddMealUseCase } from "../../application/planning/usecases/AddMealUseCase.ts"
import { DeleteMealUseCase } from "../../application/planning/usecases/DeleteMealUseCase.ts"
import { PlanningRepository } from "../../infrastructure/mealie/repositories/PlanningRepository.ts"

const planningRepository = new PlanningRepository()
const getWeekPlanningUseCase = new GetWeekPlanningUseCase(planningRepository)
const addMealUseCase = new AddMealUseCase(planningRepository)
const deleteMealUseCase = new DeleteMealUseCase(planningRepository)

function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function usePlanning() {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() =>
    getMonday(new Date()),
  )
  const [mealPlans, setMealPlans] = useState<MealieMealPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPlanning = useCallback(async (weekStart: Date) => {
    setLoading(true)
    setError(null)
    try {
      const startDate = formatDate(weekStart)
      const endDate = formatDate(addDays(weekStart, 6))
      const data = await getWeekPlanningUseCase.execute(startDate, endDate)
      setMealPlans(data)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur est survenue",
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchPlanning(currentWeekStart)
  }, [currentWeekStart, fetchPlanning])

  const goToPrevWeek = () =>
    setCurrentWeekStart((prev) => addDays(prev, -7))

  const goToNextWeek = () =>
    setCurrentWeekStart((prev) => addDays(prev, 7))

  const goToCurrentWeek = () => setCurrentWeekStart(getMonday(new Date()))

  const addMeal = useCallback(
    async (date: string, entryType: string, recipeId: string) => {
      await addMealUseCase.execute(date, entryType, recipeId)
      await fetchPlanning(currentWeekStart)
    },
    [currentWeekStart, fetchPlanning],
  )

  const deleteMeal = useCallback(
    async (id: number) => {
      await deleteMealUseCase.execute(id)
      await fetchPlanning(currentWeekStart)
    },
    [currentWeekStart, fetchPlanning],
  )

  return {
    mealPlans,
    loading,
    error,
    currentWeekStart,
    goToPrevWeek,
    goToNextWeek,
    goToCurrentWeek,
    addMeal,
    deleteMeal,
  }
}
