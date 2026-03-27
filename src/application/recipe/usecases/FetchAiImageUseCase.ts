import { llmChat } from "../../../infrastructure/llm/LLMService.ts"

export type ImageProvider = "wikipedia-en" | "wikipedia-fr" | "themealdb" | "auto"

export const IMAGE_PROVIDERS: { value: ImageProvider; label: string }[] = [
  { value: "wikipedia-en", label: "Wikipedia EN" },
  { value: "wikipedia-fr", label: "Wikipedia FR" },
  { value: "themealdb", label: "TheMealDB" },
  { value: "auto", label: "Auto (tous)" },
]

const PROMPT_SEARCH_EN = `Tu es un assistant spécialisé dans la cuisine.
Traduis le nom de la recette en anglais tel qu'il apparaîtrait dans un titre d'article culinaire.
Réponds UNIQUEMENT avec le nom complet du plat en anglais, sans explication.
Exemples : "Bœuf bourguignon aux champignons" → "Beef bourguignon", "Tarte tatin" → "Tarte Tatin"`

const PROMPT_SEARCH_FR = `Tu es un assistant spécialisé dans la cuisine.
Donne le nom canonique de ce plat en français tel qu'il apparaîtrait dans un article Wikipedia français.
Réponds UNIQUEMENT avec le nom complet du plat en français, sans explication.
Exemples : "Beef bourguignon" → "Bœuf bourguignon", "Chicken tikka masala" → "Tikka masala"`

interface WikiResult {
  pageid: number
  title: string
  snippet: string
}

/**
 * Cherche des résultats Wikipedia et demande au LLM lequel correspond vraiment au plat.
 * Retourne le thumbnail du résultat sélectionné, ou null.
 */
async function fetchFromWikipedia(
  recipeName: string,
  query: string,
  lang: "en" | "fr",
): Promise<string | null> {
  const base = `https://${lang}.wikipedia.org/w/api.php`

  // 1. Récupérer les 8 premiers résultats avec titre + extrait
  const searchRes = await fetch(
    `${base}?action=query&list=search&srlimit=8&srprop=snippet` +
    `&srsearch=${encodeURIComponent(query)}&format=json&origin=*`,
  )
  if (!searchRes.ok) return null
  const searchData = await searchRes.json()

  const results: WikiResult[] = searchData?.query?.search ?? []
  if (results.length === 0) return null

  // 2. Demander au LLM quel résultat correspond le mieux au plat
  const candidatesList = results
    .map((r, i) => `${i + 1}. "${r.title}" — ${r.snippet.replace(/<[^>]+>/g, "")}`)
    .join("\n")

  const pickPrompt = `Tu dois trouver une image pour la recette : "${recipeName}".
Voici les résultats Wikipedia disponibles :
${candidatesList}

Réponds UNIQUEMENT avec le numéro (1-${results.length}) du résultat qui correspond à ce plat.
Si aucun ne correspond à un plat de cuisine, réponds "0".`

  const pick = (await llmChat("Tu es un assistant cuisine.", pickPrompt)).trim()
  const idx = parseInt(pick, 10) - 1

  if (isNaN(idx) || idx < 0 || idx >= results.length) return null

  // 3. Récupérer les images des résultats qui ont un thumbnail (en batch)
  const pageIds = results.map((r) => r.pageid).join("|")
  const imageRes = await fetch(
    `${base}?action=query&pageids=${pageIds}` +
    `&prop=pageimages&format=json&pithumbsize=800&origin=*`,
  )
  if (!imageRes.ok) return null
  const imageData = await imageRes.json()
  const pages = imageData?.query?.pages ?? {}

  // Retourner le thumbnail du résultat choisi par le LLM, sinon parcourir les suivants
  const ordered = [results[idx], ...results.filter((_, i) => i !== idx)]
  for (const result of ordered) {
    const thumb: string | undefined = pages[result.pageid]?.thumbnail?.source
    if (thumb) return thumb
  }

  return null
}

/**
 * Cherche une image sur TheMealDB (API gratuite, sans auth, spécialisée cuisine).
 */
async function fetchFromMealDB(query: string): Promise<string | null> {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`,
  )
  if (!res.ok) return null
  const data = await res.json()
  return (data?.meals?.[0]?.strMealThumb as string | undefined) ?? null
}

/**
 * Use case: utilise le LLM pour obtenir le terme de recherche,
 * puis sélectionne intelligemment le bon résultat via le LLM.
 */
export class FetchAiImageUseCase {
  async execute(recipeName: string, provider: ImageProvider = "wikipedia-en"): Promise<string> {
    let imageUrl: string | null = null

    if (provider === "wikipedia-en" || provider === "auto") {
      const query = (await llmChat(PROMPT_SEARCH_EN, recipeName)).trim()
      imageUrl = await fetchFromWikipedia(recipeName, query, "en")
    }

    if (!imageUrl && (provider === "wikipedia-fr" || provider === "auto")) {
      const query = provider === "auto"
        ? recipeName
        : (await llmChat(PROMPT_SEARCH_FR, recipeName)).trim()
      imageUrl = await fetchFromWikipedia(recipeName, query, "fr")
    }

    if (!imageUrl && (provider === "themealdb" || provider === "auto")) {
      const query = provider === "themealdb"
        ? (await llmChat(PROMPT_SEARCH_EN, recipeName)).trim()
        : recipeName
      imageUrl = await fetchFromMealDB(query)
    }

    if (!imageUrl) {
      throw new Error(`Aucune image trouvée pour "${recipeName}" via ${provider}.`)
    }

    return imageUrl
  }
}
