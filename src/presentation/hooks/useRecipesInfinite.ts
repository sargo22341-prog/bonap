import { useCallback, useEffect, useRef, useState } from "react"
import type { MealieRecipe, RecipeFilters } from "../../shared/types/mealie.ts"
import { GetRecipesUseCase } from "../../application/recipe/usecases/GetRecipesUseCase.ts"
import { RecipeRepository } from "../../infrastructure/mealie/repositories/RecipeRepository.ts"

const PER_PAGE = 50
const getRecipesUseCase = new GetRecipesUseCase(new RecipeRepository())

export function useRecipesInfinite(filters: RecipeFilters = {}) {
  const [recipes, setRecipes] = useState<MealieRecipe[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const pageRef = useRef(1)
  const loadingRef = useRef(false)

  // Sérialisation stable des filtres pour détecter les changements
  const filtersKey = JSON.stringify({
    search: filters.search ?? "",
    categories: [...(filters.categories ?? [])].sort(),
    tags: [...(filters.tags ?? [])].sort(),
    maxTotalTime: filters.maxTotalTime ?? null,
  })

  const reset = useCallback(() => {
    setRecipes([])
    setError(null)
    setHasMore(true)
    pageRef.current = 1
  }, [])

  const loadMore = useCallback(
    async (currentFilters: RecipeFilters) => {
      if (loadingRef.current) return
      loadingRef.current = true
      setLoading(true)
      try {
        const data = await getRecipesUseCase.execute(
          pageRef.current,
          PER_PAGE,
          currentFilters,
        )
        setRecipes((prev) => [...prev, ...data.items])
        setHasMore(pageRef.current < data.totalPages)
        pageRef.current += 1
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue")
        setHasMore(false)
      } finally {
        setLoading(false)
        loadingRef.current = false
      }
    },
    [],
  )

  // Filtre ref pour accéder aux filtres courants dans loadMore (évite stale closure)
  const filtersRef = useRef<RecipeFilters>(filters)
  filtersRef.current = filters

  // Reset et rechargement quand les filtres changent
  useEffect(() => {
    reset()
  }, [filtersKey, reset])

  // Charge la première page après reset
  useEffect(() => {
    if (recipes.length === 0 && hasMore && !loadingRef.current) {
      void loadMore(filtersRef.current)
    }
  }, [recipes.length, hasMore, loadMore])

  const stableLoadMore = useCallback(() => {
    if (!loadingRef.current) {
      void loadMore(filtersRef.current)
    }
  }, [loadMore])

  return { recipes, loading, error, hasMore, loadMore: stableLoadMore }
}
