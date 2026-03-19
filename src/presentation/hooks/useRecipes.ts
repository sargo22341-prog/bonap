import { useCallback, useEffect, useState } from "react"
import type { MealieRecipe } from "../../shared/types/mealie.ts"
import { GetRecipesUseCase } from "../../application/recipe/usecases/GetRecipesUseCase.ts"
import { RecipeRepository } from "../../infrastructure/mealie/repositories/RecipeRepository.ts"

const PER_PAGE = 30
const getRecipesUseCase = new GetRecipesUseCase(new RecipeRepository())

export function useRecipes() {
  const [recipes, setRecipes] = useState<MealieRecipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchRecipes = useCallback(async (p: number) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getRecipesUseCase.execute(p, PER_PAGE)
      setRecipes(data.items)
      setTotalPages(Math.max(1, data.totalPages))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchRecipes(page)
  }, [page, fetchRecipes])

  const goToNextPage = () => setPage((p) => Math.min(p + 1, totalPages))
  const goToPreviousPage = () => setPage((p) => Math.max(p - 1, 1))

  return {
    recipes,
    loading,
    error,
    page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    goToNextPage,
    goToPreviousPage,
  }
}
