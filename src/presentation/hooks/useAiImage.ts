import { useState, useCallback } from "react"
import { fetchAiImageUseCase, recipeRepository } from "../../infrastructure/container.ts"
import type { ImageProvider } from "../../application/recipe/usecases/FetchAiImageUseCase.ts"
import { getIngressBasename } from "../../shared/utils/env.ts"

interface UseAiImageResult {
  fetchAiImage: (recipeName: string, recipeSlug: string, recipeId: string, provider: ImageProvider) => Promise<string | null>
  loading: boolean
  error: string | null
}

/**
 * Hook pour récupérer et uploader une image de recette via IA.
 * Retourne l'URL Mealie avec cache-buster après upload réussi.
 */
export function useAiImage(): UseAiImageResult {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAiImage = useCallback(async (
    recipeName: string,
    recipeSlug: string,
    recipeId: string,
    provider: ImageProvider,
  ): Promise<string | null> => {
    setLoading(true)
    setError(null)

    try {
      // 1. LLM → recherche selon le provider → URL d'image réelle
      const imageUrl = await fetchAiImageUseCase.execute(recipeName, provider)

      // 2. Télécharger l'image
      const response = await fetch(imageUrl)
      if (!response.ok) {
        throw new Error(`Impossible de télécharger l'image (${response.status}) : ${imageUrl}`)
      }
      const contentType = response.headers.get("content-type") ?? "image/jpeg"
      const blob = await response.blob()
      const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg"
      const file = new File([blob], `ai-image.${ext}`, { type: contentType })

      // 3. Uploader directement dans Mealie
      await recipeRepository.uploadImage(recipeSlug, file)

      // 4. URL Mealie avec cache-buster basé sur le timestamp courant (image vient d'être uploadée)
      return `${getIngressBasename()}/api/media/recipes/${recipeId}/images/original.webp?t=${Date.now()}`
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { fetchAiImage, loading, error }
}
