import type { IRecipeRepository } from "../../../domain/recipe/repositories/IRecipeRepository.ts"
import type { MealieRecipe, MealieCategory } from "../../../shared/types/mealie.ts"

export class UpdateCategoriesUseCase {
  private recipeRepository: IRecipeRepository

  constructor(recipeRepository: IRecipeRepository) {
    this.recipeRepository = recipeRepository
  }

  async execute(slug: string, categories: MealieCategory[]): Promise<MealieRecipe> {
    return this.recipeRepository.updateCategories(slug, categories)
  }
}
