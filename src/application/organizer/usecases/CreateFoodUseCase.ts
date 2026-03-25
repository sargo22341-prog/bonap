import type { IFoodRepository } from "../../../domain/organizer/repositories/IFoodRepository.ts"
import type { MealieFood } from "../../../shared/types/mealie.ts"

export class CreateFoodUseCase {
  private foodRepository: IFoodRepository

  constructor(foodRepository: IFoodRepository) {
    this.foodRepository = foodRepository
  }

  async execute(name: string): Promise<MealieFood> {
    return this.foodRepository.create(name)
  }
}
