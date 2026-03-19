import type { IRecipeRepository } from "../../../domain/recipe/repositories/IRecipeRepository.ts"
import type {
  MealiePaginatedRecipes,
  RecipeFilters,
} from "../../../shared/types/mealie.ts"

export class GetRecipesUseCase {
  private recipeRepository: IRecipeRepository

  constructor(recipeRepository: IRecipeRepository) {
    this.recipeRepository = recipeRepository
  }

  async execute(
    page?: number,
    perPage?: number,
    filters?: RecipeFilters,
  ): Promise<MealiePaginatedRecipes> {
    return this.recipeRepository.getAll(page, perPage, filters)
  }
}
