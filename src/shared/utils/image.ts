import type { MealieRecipe } from "../types/mealie.ts"

/**
 * Construit l'URL d'image d'une recette Mealie.
 * Utilise dateUpdated comme cache-buster : quand Mealie met à jour l'image,
 * dateUpdated change et le navigateur charge la nouvelle image.
 */
export function recipeImageUrl(
  recipe: Pick<MealieRecipe, "id" | "dateUpdated">,
  size: "original" | "min-original" = "min-original",
): string {
  const base = `/api/media/recipes/${recipe.id}/images/${size}.webp`
  return recipe.dateUpdated ? `${base}?t=${encodeURIComponent(recipe.dateUpdated)}` : base
}
