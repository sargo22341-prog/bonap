import type { IRecipeRepository } from "../../../domain/recipe/repositories/IRecipeRepository.ts"
import type {
  MealiePaginatedRecipes,
  MealieRawPaginatedRecipes,
} from "../../../shared/types/mealie.ts"
import { mealieApiClient } from "../api/index.ts"

export class RecipeRepository implements IRecipeRepository {
  async getAll(page = 1, perPage = 30): Promise<MealiePaginatedRecipes> {
    const raw = await mealieApiClient.get<MealieRawPaginatedRecipes>(
      `/api/recipes?page=${page}&perPage=${perPage}`,
    )
    return {
      items: raw.items,
      total: raw.total,
      page: raw.page,
      perPage: raw.per_page,
      totalPages: raw.total_pages,
    }
  }
}
