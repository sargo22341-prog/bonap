import type { IRecipeRepository } from "../../../domain/recipe/repositories/IRecipeRepository.ts"
import type { MealiePaginatedRecipes } from "../../../shared/types/mealie.ts"

export class GetRecipesUseCase {
  private recipeRepository: IRecipeRepository

  constructor(recipeRepository: IRecipeRepository) {
    this.recipeRepository = recipeRepository
  }

  async execute(page?: number, perPage?: number): Promise<MealiePaginatedRecipes> {
    return this.recipeRepository.getAll(page, perPage)
  }
}
