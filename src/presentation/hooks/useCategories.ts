import { useCallback, useEffect, useState } from "react"
import type { MealieCategory } from "../../shared/types/mealie.ts"
import { mealieApiClient } from "../../infrastructure/mealie/api/index.ts"

interface RawCategoriesResponse {
  items: MealieCategory[]
}

export function useCategories() {
  const [categories, setCategories] = useState<MealieCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    try {
      const data = await mealieApiClient.get<RawCategoriesResponse>("/api/categories")
      setCategories(data.items)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur chargement catégories")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchCategories()
  }, [fetchCategories])

  return { categories, loading, error }
}
