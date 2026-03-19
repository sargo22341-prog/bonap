import type { IRecipeRepository } from "../../../domain/recipe/repositories/IRecipeRepository.ts"
import type { MealiePaginatedRecipes } from "../../../shared/types/mealie.ts"
import { mealieApiClient } from "../api/index.ts"

export class RecipeRepository implements IRecipeRepository {
  async getAll(page = 1, perPage = 30): Promise<MealiePaginatedRecipes> {
    return mealieApiClient.get<MealiePaginatedRecipes>(
      `/api/recipes?page=${page}&perPage=${perPage}`,
    )
  }
}
