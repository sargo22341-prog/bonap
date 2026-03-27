import { useState, useCallback } from "react"
import { fetchAiImageUseCase } from "../../infrastructure/container.ts"
import { recipeRepository } from "../../infrastructure/container.ts"

interface UseAiImageResult {
  fetchAiImage: (recipeName: string, recipeSlug: string) => Promise<string | null>
  loading: boolean
  error: string | null
}

/**
 * Hook pour récupérer et uploader une image de recette via IA.
 * Le LLM suggère une URL d'image, le hook la télécharge et l'uploade via l'API Mealie.
 * Retourne l'URL locale pour prévisualisation (object URL).
 */
export function useAiImage(): UseAiImageResult {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAiImage = useCallback(async (
    recipeName: string,
    recipeSlug: string,
  ): Promise<string | null> => {
    setLoading(true)
    setError(null)

    try {
      // 1. Demander au LLM une URL d'image pertinente
      const imageUrl = await fetchAiImageUseCase.execute(recipeName)

      // 2. Télécharger l'image depuis l'URL suggérée
      let imageFile: File
      try {
        const response = await fetch(imageUrl)
        if (!response.ok) {
          throw new Error(`Impossible de télécharger l'image (${response.status})`)
        }
        const contentType = response.headers.get("content-type") ?? "image/jpeg"
        const blob = await response.blob()

        // Déduire l'extension depuis le content-type ou l'URL
        const ext = contentType.includes("png")
          ? "png"
          : contentType.includes("webp")
          ? "webp"
          : "jpg"
        imageFile = new File([blob], `ai-image.${ext}`, { type: contentType })
      } catch (downloadErr) {
        throw new Error(
          `Impossible de télécharger l'image proposée par l'IA. ` +
          `URL : ${imageUrl}. ` +
          `Détail : ${downloadErr instanceof Error ? downloadErr.message : "Erreur inconnue"}`,
        )
      }

      // 3. Uploader l'image dans Mealie
      await recipeRepository.uploadImage(recipeSlug, imageFile)

      // 4. Retourner une object URL pour la prévisualisation immédiate
      return URL.createObjectURL(imageFile)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Une erreur est survenue"
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { fetchAiImage, loading, error }
}
