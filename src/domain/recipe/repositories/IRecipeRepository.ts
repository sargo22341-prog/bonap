import type {
  MealiePaginatedRecipes,
  MealieRecipe,
} from "../../../shared/types/mealie.ts"

export interface IRecipeRepository {
  getAll(page?: number, perPage?: number): Promise<MealiePaginatedRecipes>
  getBySlug(slug: string): Promise<MealieRecipe>
}
