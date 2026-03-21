import { useState } from "react"
import { createRecipeFromUrlUseCase } from "../../infrastructure/container.ts"

export function useCreateRecipeFromUrl() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createFromUrl = async (url: string): Promise<string | null> => {
    setLoading(true)
    setError(null)
    try {
      const slug = await createRecipeFromUrlUseCase.execute(url)
      return slug
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible d'importer la recette. Vérifiez l'URL et réessayez.",
      )
      return null
    } finally {
      setLoading(false)
    }
  }

  return { createFromUrl, loading, error }
}
