import type { MealieRecipe } from "../types/mealie.ts"
import { getIngressBasename } from "./env.ts"

/**
 * Construit l'URL d'image d'une recette Mealie.
 * Utilise dateUpdated comme cache-buster : quand Mealie met à jour l'image,
 * dateUpdated change et le navigateur charge la nouvelle image.
 * Préfixe automatiquement avec le basename HA ingress si nécessaire.
 */
export function recipeImageUrl(
  recipe: Pick<MealieRecipe, "id" | "dateUpdated">,
  size: "original" | "min-original" = "min-original",
): string {
  const base = `${getIngressBasename()}/api/media/recipes/${recipe.id}/images/${size}.webp`
  return recipe.dateUpdated ? `${base}?t=${encodeURIComponent(recipe.dateUpdated)}` : base
}
