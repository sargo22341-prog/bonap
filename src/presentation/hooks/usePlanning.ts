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

function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  result.setHours(0, 0, 0, 0)
  return result
}

function today(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

export function usePlanning() {
  const [centerDate, setCenterDate] = useState<Date>(() => today())
  const [nbDays, setNbDays] = useState<3 | 5 | 7>(7)
  const [mealPlans, setMealPlans] = useState<MealieMealPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch avec une marge de 1 jour de chaque côté pour couvrir tous les cas
  const fetchPlanning = useCallback(async (center: Date, days: number) => {
    setLoading(true)
    setError(null)
    try {
      const halfWindow = Math.floor(days / 2)
      const startDate = formatDate(addDays(center, -halfWindow - 1))
      const endDate = formatDate(addDays(center, halfWindow + 1))
      const data = await getWeekPlanningUseCase.execute(startDate, endDate)
      setMealPlans(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchPlanning(centerDate, nbDays)
  }, [centerDate, nbDays, fetchPlanning])

  const goToPrevDay = () => setCenterDate((prev) => addDays(prev, -1))
  const goToNextDay = () => setCenterDate((prev) => addDays(prev, 1))
  const goToToday = () => setCenterDate(today())

  const addMeal = useCallback(
    async (date: string, entryType: string, recipeId: string) => {
      await addMealUseCase.execute(date, entryType, recipeId)
      await fetchPlanning(centerDate, nbDays)
    },
    [centerDate, nbDays, fetchPlanning],
  )

  const deleteMeal = useCallback(
    async (id: number) => {
      await deleteMealUseCase.execute(id)
      await fetchPlanning(centerDate, nbDays)
    },
    [centerDate, nbDays, fetchPlanning],
  )

  return {
    mealPlans,
    loading,
    error,
    centerDate,
    nbDays,
    setNbDays,
    goToPrevDay,
    goToNextDay,
    goToToday,
    addMeal,
    deleteMeal,
  }
}
