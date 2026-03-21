import type { MealieMealPlan, MealieRecipe } from "../../../shared/types/mealie.ts"
import { formatDate } from "../../../shared/utils/date.ts"

export interface CategoryStat {
  name: string
  count: number
  percentage: number
}

/**
 * Calcule le pourcentage de repas "restes" (même recette sur deux créneaux consécutifs).
 */
export function computeLeftoverPercentage(mealPlans: MealieMealPlan[]): number {
  if (mealPlans.length < 2) return 0

  const sorted = [...mealPlans].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date)
    return a.entryType.localeCompare(b.entryType)
  })

  let leftovers = 0
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1]
    const curr = sorted[i]
    if (
      prev.recipeId &&
      curr.recipeId &&
      prev.recipeId === curr.recipeId
    ) {
      leftovers++
    }
  }

  return Math.round((leftovers / (mealPlans.length - 1)) * 100)
}

/**
 * Calcule le nombre de semaines consécutives avec planning complet (≥1 repas/jour)
 * en remontant depuis la fin de la période.
 */
export function computeStreak(
  mealPlans: MealieMealPlan[],
  startDate: string,
  endDate: string,
): number {
  const datesWithMeal = new Set(mealPlans.map((m) => m.date))

  const start = new Date(startDate)
  const end = new Date(endDate)

  // Ramener au lundi de la semaine de fin
  const current = new Date(end)
  const dayOfWeek = current.getDay() === 0 ? 6 : current.getDay() - 1
  current.setDate(current.getDate() - dayOfWeek)
  current.setHours(0, 0, 0, 0)

  let streak = 0

  while (current >= start) {
    let weekComplete = true
    for (let d = 0; d < 7; d++) {
      const day = new Date(current)
      day.setDate(day.getDate() + d)
      if (day > end) break
      if (day < start) continue
      const dateStr = formatDate(day)
      if (!datesWithMeal.has(dateStr)) {
        weekComplete = false
        break
      }
    }
    if (weekComplete) {
      streak++
    } else {
      break
    }
    current.setDate(current.getDate() - 7)
  }

  return streak
}

/**
 * Calcule la distribution par catégorie sur un ensemble de recettes planifiées.
 */
export function computeCategoryStats(plannedRecipes: MealieRecipe[]): CategoryStat[] {
  const countMap = new Map<string, number>()
  for (const recipe of plannedRecipes) {
    const cats = recipe.recipeCategory ?? []
    if (cats.length === 0) {
      countMap.set("Sans catégorie", (countMap.get("Sans catégorie") ?? 0) + 1)
    } else {
      for (const cat of cats) {
        countMap.set(cat.name, (countMap.get(cat.name) ?? 0) + 1)
      }
    }
  }

  const total = Array.from(countMap.values()).reduce((sum, v) => sum + v, 0)
  if (total === 0) return []

  return Array.from(countMap.entries())
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count)
}
