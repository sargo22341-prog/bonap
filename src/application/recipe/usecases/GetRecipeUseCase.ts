import type { IRecipeRepository } from "../../../domain/recipe/repositories/IRecipeRepository.ts"
import type { MealieRecipe } from "../../../shared/types/mealie.ts"

export class GetRecipeUseCase {
  private recipeRepository: IRecipeRepository

  constructor(recipeRepository: IRecipeRepository) {
    this.recipeRepository = recipeRepository
  }

  async execute(slug: string): Promise<MealieRecipe> {
    return this.recipeRepository.getBySlug(slug)
  }
}
