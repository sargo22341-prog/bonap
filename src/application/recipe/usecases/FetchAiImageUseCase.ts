import { llmChat } from "../../../infrastructure/llm/LLMService.ts"

const SYSTEM_PROMPT = `Tu es un assistant spécialisé dans la cuisine.
Ta tâche est de trouver une URL d'image haute qualité pour une recette.

Règles strictes :
- Réponds UNIQUEMENT avec une URL d'image directe (finissant par .jpg, .jpeg, .png, .webp ou similaire)
- L'image doit être librement accessible (pas derrière une authentification)
- Préfère Wikimedia Commons (upload.wikimedia.org) car les images sont stables et libres de droits
- Sinon, utilise des sites culinaires reconnus (BBC Good Food, Marmiton, Cuisine AZ, etc.)
- L'image doit montrer le plat fini, appétissant et bien présenté
- Ne donne aucune explication, juste l'URL brute`

/**
 * Use case: demande au LLM de trouver une URL d'image pertinente pour une recette.
 * Retourne l'URL d'image suggérée par le LLM.
 */
export class FetchAiImageUseCase {
  async execute(recipeName: string): Promise<string> {
    const userMessage = `Trouve une URL d'image directe pour la recette : "${recipeName}"`

    const response = await llmChat(SYSTEM_PROMPT, userMessage)

    // Extraire l'URL de la réponse (le LLM peut parfois ajouter des espaces ou sauts de ligne)
    const url = response.trim()

    // Validation basique : doit ressembler à une URL HTTP(S)
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      // Tenter d'extraire une URL depuis une réponse plus verbeuse
      const urlMatch = url.match(/https?:\/\/[^\s"'<>]+/)
      if (!urlMatch) {
        throw new Error("Le LLM n'a pas retourné d'URL valide. Essayez à nouveau.")
      }
      return urlMatch[0]
    }

    return url
  }
}
