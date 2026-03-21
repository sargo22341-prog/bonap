import { useCallback, useEffect, useState } from "react"
import type { MealieMealPlan, MealieRecipe } from "../../shared/types/mealie.ts"
import {
  getPlanningRangeUseCase,
  getRecipesByIdsUseCase,
  getRecipesUseCase,
} from "../../infrastructure/container.ts"

export type StatsPeriod = "30d" | "90d" | "12m"

export interface TopRecipe {
  recipe: MealieRecipe
  count: number
}

export interface TopIngredient {
  name: string
  count: number
}

export interface CategoryStat {
  name: string
  count: number
  percentage: number
}

export interface StatsData {
  /** Top recettes les plus planifiées */
  topRecipes: TopRecipe[]
  /** Top ingrédients les plus utilisés */
  topIngredients: TopIngredient[]
  /** % de repas "restes" (même recette sur deux créneaux consécutifs) */
  leftoverPercentage: number
  /** Nombre de repas déjeuner */
  lunchCount: number
  /** Nombre de repas dîner */
  dinnerCount: number
  /** Ratio déjeuner (0-1) */
  lunchRatio: number
  /** Moyenne de repas planifiés par semaine */
  avgMealsPerWeek: number
  /** Recettes du catalogue jamais planifiées sur la période */
  neverPlannedRecipes: MealieRecipe[]
  /** Distribution par catégorie */
  categoryStats: CategoryStat[]
  /** Nombre de semaines consécutives avec planning complet (≥1 repas/jour) */
  streak: number
  /** Nombre total de repas planifiés sur la période */
  totalMeals: number
}

const MAX_INGREDIENT_RECIPES = 20

function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function getPeriodDates(period: StatsPeriod): { startDate: string; endDate: string } {
  const end = new Date()
  end.setHours(23, 59, 59, 999)
  const start = new Date()
  start.setHours(0, 0, 0, 0)

  if (period === "30d") {
    start.setDate(start.getDate() - 29)
  } else if (period === "90d") {
    start.setDate(start.getDate() - 89)
  } else {
    start.setFullYear(start.getFullYear() - 1)
    start.setDate(start.getDate() + 1)
  }

  return { startDate: formatDate(start), endDate: formatDate(end) }
}

function getWeeksBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffMs = end.getTime() - start.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1
  return Math.max(1, diffDays / 7)
}

function computeLeftoverPercentage(mealPlans: MealieMealPlan[]): number {
  if (mealPlans.length < 2) return 0

  // Trier par date puis par entryType
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

function computeStreak(mealPlans: MealieMealPlan[], startDate: string, endDate: string): number {
  // Construire un Set de dates avec au moins un repas
  const datesWithMeal = new Set(mealPlans.map((m) => m.date))

  // Parcourir les semaines de la période (de la plus récente vers la plus ancienne)
  const start = new Date(startDate)
  const end = new Date(endDate)

  // Trouver le lundi de la semaine courante (ou de la dernière semaine de la période)
  const current = new Date(end)
  // Ramener au lundi de cette semaine
  const dayOfWeek = current.getDay() === 0 ? 6 : current.getDay() - 1
  current.setDate(current.getDate() - dayOfWeek)
  current.setHours(0, 0, 0, 0)

  let streak = 0

  while (current >= start) {
    // Vérifier que chaque jour de la semaine (lun-dim) a au moins un repas
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
    // Semaine précédente
    current.setDate(current.getDate() - 7)
  }

  return streak
}

function computeCategoryStats(plannedRecipes: MealieRecipe[]): CategoryStat[] {
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

export function useStats() {
  const [period, setPeriod] = useState<StatsPeriod>("30d")
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const computeStats = useCallback(async (selectedPeriod: StatsPeriod) => {
    setLoading(true)
    setError(null)
    try {
      const { startDate, endDate } = getPeriodDates(selectedPeriod)

      // 1. Récupérer le planning de la période
      const mealPlans = await getPlanningRangeUseCase.execute(startDate, endDate)

      // 2. Compter les recettes planifiées
      const recipeCounts = new Map<string, number>()
      for (const meal of mealPlans) {
        if (meal.recipe?.slug) {
          recipeCounts.set(meal.recipe.slug, (recipeCounts.get(meal.recipe.slug) ?? 0) + 1)
        }
      }

      // 3. Top recettes (triées par fréquence)
      const sortedSlugs = Array.from(recipeCounts.entries())
        .sort((a, b) => b[1] - a[1])

      // Les recettes sont déjà dans meal.recipe, les extraire
      const recipeMap = new Map<string, MealieRecipe>()
      for (const meal of mealPlans) {
        if (meal.recipe?.slug && !recipeMap.has(meal.recipe.slug)) {
          recipeMap.set(meal.recipe.slug, meal.recipe)
        }
      }

      const topRecipes: TopRecipe[] = sortedSlugs
        .slice(0, 10)
        .filter(([slug]) => recipeMap.has(slug))
        .map(([slug, count]) => ({ recipe: recipeMap.get(slug)!, count }))

      // 4. Récupérer les détails des top 20 recettes pour les ingrédients
      const top20Slugs = sortedSlugs.slice(0, MAX_INGREDIENT_RECIPES).map(([slug]) => slug)
      // Certaines recettes dans meal.recipe peuvent déjà avoir les ingrédients,
      // mais pour garantir les données complètes, on fetche les top 20
      const detailedRecipes = await getRecipesByIdsUseCase.execute(top20Slugs)

      // 5. Agréger les ingrédients (pondéré par le nombre de fois planifiée)
      const ingredientCounts = new Map<string, number>()
      for (const recipe of detailedRecipes) {
        const count = recipeCounts.get(recipe.slug) ?? 1
        for (const ing of recipe.recipeIngredient ?? []) {
          const name = ing.food?.name?.trim()
          if (name) {
            ingredientCounts.set(name, (ingredientCounts.get(name) ?? 0) + count)
          }
        }
      }
      const topIngredients: TopIngredient[] = Array.from(ingredientCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .map(([name, count]) => ({ name, count }))

      // 6. % restes
      const leftoverPercentage = computeLeftoverPercentage(mealPlans)

      // 7. Répartition déjeuner / dîner
      const lunchCount = mealPlans.filter((m) =>
        m.entryType?.toLowerCase().includes("lunch") ||
        m.entryType?.toLowerCase().includes("déjeuner") ||
        m.entryType?.toLowerCase().includes("dejeuner"),
      ).length
      const dinnerCount = mealPlans.filter((m) =>
        m.entryType?.toLowerCase().includes("dinner") ||
        m.entryType?.toLowerCase().includes("dîner") ||
        m.entryType?.toLowerCase().includes("diner") ||
        m.entryType?.toLowerCase().includes("supper"),
      ).length
      const totalTyped = lunchCount + dinnerCount
      const lunchRatio = totalTyped > 0 ? lunchCount / totalTyped : 0.5

      // 8. Moyenne par semaine
      const weeks = getWeeksBetween(startDate, endDate)
      const avgMealsPerWeek = Math.round((mealPlans.length / weeks) * 10) / 10

      // 9. Recettes jamais planifiées (catalogue complet)
      const allRecipesResult = await getRecipesUseCase.execute(1, -1)
      const allRecipes = allRecipesResult.items
      const plannedSlugsSet = new Set(recipeCounts.keys())
      const neverPlannedRecipes = allRecipes
        .filter((r) => !plannedSlugsSet.has(r.slug))
        .slice(0, 50)

      // 10. Distribution par catégorie (sur toutes les recettes planifiées uniques)
      const uniquePlannedRecipes = Array.from(recipeMap.values())
      const categoryStats = computeCategoryStats(uniquePlannedRecipes)

      // 11. Streak
      const streak = computeStreak(mealPlans, startDate, endDate)

      setStats({
        topRecipes,
        topIngredients,
        leftoverPercentage,
        lunchCount,
        dinnerCount,
        lunchRatio,
        avgMealsPerWeek,
        neverPlannedRecipes,
        categoryStats,
        streak,
        totalMeals: mealPlans.length,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void computeStats(period)
  }, [period, computeStats])

  const setPeriodAndRefresh = useCallback((newPeriod: StatsPeriod) => {
    setPeriod(newPeriod)
  }, [])

  return {
    period,
    setPeriod: setPeriodAndRefresh,
    stats,
    loading,
    error,
  }
}
