import { useCallback, useState } from "react"
import type { ShoppingItem, ShoppingLabel } from "../../domain/shopping/entities/ShoppingItem.ts"
import { llmChat } from "../../infrastructure/llm/LLMService.ts"
import { foodLabelStore } from "../../infrastructure/shopping/FoodLabelStore.ts"
import { extractFoodKey } from "../../shared/utils/food.ts"

function extractJson(text: string): Record<string, string> {
  try {
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) return {}
    return JSON.parse(match[0]) as Record<string, string>
  } catch {
    return {}
  }
}

function itemDisplayName(item: ShoppingItem): string {
  const raw = item.foodName ?? (item.note?.split(" — ")[0] ?? "")
  return raw.trim()
}

export function useCategorizeItems() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const categorize = useCallback(async (
    items: ShoppingItem[],
    labels: ShoppingLabel[],
    onUpdate: (item: ShoppingItem, labelId: string) => Promise<void>,
  ) => {
    if (!items.length || !labels.length) return
    setLoading(true)
    setError(null)

    try {
      // First apply already-known labels from the reference (no LLM call needed)
      const stillUncategorized: ShoppingItem[] = []
      for (const item of items) {
        const foodKey = extractFoodKey(itemDisplayName(item))
        const savedLabelId = foodKey ? foodLabelStore.lookup(foodKey) : undefined
        if (savedLabelId && labels.find((l) => l.id === savedLabelId)) {
          await onUpdate(item, savedLabelId)
        } else {
          stillUncategorized.push(item)
        }
      }

      if (!stillUncategorized.length) return

      // Deduplicate by display name for the LLM call
      const uniqueNames = [...new Set(stillUncategorized.map(itemDisplayName))].filter(Boolean)
      const labelNames = labels.map((l) => l.name).join(", ")

      const system = `Tu es un assistant de catégorisation pour une liste de courses.
Associe chaque article à la catégorie la plus appropriée parmi celles fournies.
Réponds UNIQUEMENT avec un objet JSON valide sans aucun texte autour : {"nom_article": "nom_catégorie"}.
Si aucune catégorie ne correspond à un article, omets-le du résultat.`

      const user = `Catégories disponibles : ${labelNames}\n\nArticles à catégoriser : ${uniqueNames.join(", ")}`

      const response = await llmChat(system, user)
      const json = extractJson(response)

      for (const item of stillUncategorized) {
        const name = itemDisplayName(item)
        const labelName = json[name]
        if (!labelName) continue
        const label = labels.find((l) => l.name.toLowerCase() === labelName.toLowerCase())
        if (label) {
          await onUpdate(item, label.id)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la catégorisation")
    } finally {
      setLoading(false)
    }
  }, [])

  return { categorize, loading, error }
}
