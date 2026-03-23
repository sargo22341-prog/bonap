import { useState } from "react"
import { updateCategoriesUseCase } from "../../infrastructure/container.ts"
import type { MealieRecipe, MealieCategory } from "../../shared/types/mealie.ts"

export function useUpdateCategories() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateCategories = async (
    slug: string,
    categories: MealieCategory[],
  ): Promise<MealieRecipe | null> => {
    setLoading(true)
    setError(null)
    try {
      return await updateCategoriesUseCase.execute(slug, categories)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de mettre à jour les catégories.",
      )
      return null
    } finally {
      setLoading(false)
    }
  }

  return { updateCategories, loading, error }
}
