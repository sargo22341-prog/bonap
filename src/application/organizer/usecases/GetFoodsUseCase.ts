import type { IFoodRepository } from "../../../domain/organizer/repositories/IFoodRepository.ts"
import type { MealieFood } from "../../../shared/types/mealie.ts"

export class GetFoodsUseCase {
  private foodRepository: IFoodRepository

  constructor(foodRepository: IFoodRepository) {
    this.foodRepository = foodRepository
  }

  async execute(): Promise<MealieFood[]> {
    return this.foodRepository.getAll()
  }
}
