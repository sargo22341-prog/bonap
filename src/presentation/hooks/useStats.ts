import { useCallback, useEffect, useState } from "react"
import type { MealieRecipe } from "../../shared/types/mealie.ts"
import {
  getPlanningRangeUseCase,
  getRecipesByIdsUseCase,
  getRecipesUseCase,
} from "../../infrastructure/container.ts"
import { getPeriodDates } from "../../application/planning/usecases/GetStatsUseCase.ts"
import type { StatsPeriod } from "../../application/planning/usecases/GetStatsUseCase.ts"
import {
  computeLeftoverPercentage,
  computeStreak,
  computeCategoryStats,
} from "../../domain/planning/services/PlanningStatsService.ts"
import type { CategoryStat } from "../../domain/planning/services/PlanningStatsService.ts"
import { getWeeksBetween } from "../../shared/utils/date.ts"

export type { StatsPeriod }

export interface TopRecipe {
  recipe: MealieRecipe
  count: number
}

export interface TopIngredient {
  name: string
  count: number
}

export type { CategoryStat }

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
