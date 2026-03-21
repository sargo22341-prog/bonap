import { useCallback, useState } from "react"
import {
  getShoppingItemsUseCase,
  addRecipesToListUseCase,
} from "../../infrastructure/container.ts"

export function useAddRecipesToCart() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const addRecipes = useCallback(async (recipeIds: string[]) => {
    if (recipeIds.length === 0) return
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      const { list } = await getShoppingItemsUseCase.execute()
      await addRecipesToListUseCase.execute(list.id, recipeIds)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'ajout au panier")
    } finally {
      setLoading(false)
    }
  }, [])

  return { addRecipes, loading, error, success }
}
