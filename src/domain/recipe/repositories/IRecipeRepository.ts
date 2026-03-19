import type { MealiePaginatedRecipes } from "../../../shared/types/mealie.ts"

export interface IRecipeRepository {
  getAll(page?: number, perPage?: number): Promise<MealiePaginatedRecipes>
}
