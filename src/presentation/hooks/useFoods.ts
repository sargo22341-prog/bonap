import { useCallback, useEffect, useState } from "react"
import { getFoodsUseCase } from "../../infrastructure/container.ts"
import type { MealieFood } from "../../shared/types/mealie.ts"

export function useFoods() {
  const [foods, setFoods] = useState<MealieFood[]>([])
  const [loading, setLoading] = useState(false)

  const fetchFoods = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getFoodsUseCase.execute()
      setFoods(data)
    } catch {
      setFoods([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchFoods()
  }, [fetchFoods])

  return { foods, loading }
}
