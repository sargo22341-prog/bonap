import { useCallback, useEffect, useState } from "react"
import { getUnitsUseCase } from "../../infrastructure/container.ts"
import type { MealieUnit } from "../../shared/types/mealie.ts"

export function useUnits() {
  const [units, setUnits] = useState<MealieUnit[]>([])
  const [loading, setLoading] = useState(false)

  const fetchUnits = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getUnitsUseCase.execute()
      setUnits(data)
    } catch {
      setUnits([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchUnits()
  }, [fetchUnits])

  return { units, loading }
}
