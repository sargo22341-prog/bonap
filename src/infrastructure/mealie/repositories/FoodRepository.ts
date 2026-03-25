import type { IFoodRepository } from "../../../domain/organizer/repositories/IFoodRepository.ts"
import type { MealieFood } from "../../../shared/types/mealie.ts"
import { mealieApiClient } from "../api/index.ts"

interface MealieFoodsResponse {
  items: MealieFood[]
}

export class FoodRepository implements IFoodRepository {
  async getAll(): Promise<MealieFood[]> {
    const response = await mealieApiClient.get<MealieFoodsResponse>(
      "/api/foods?page=1&perPage=-1&orderBy=name&orderDirection=asc",
    )
    return response.items
  }

  async create(name: string): Promise<MealieFood> {
    return mealieApiClient.post<MealieFood>("/api/foods", {
      id: "",
      name,
      description: "",
    })
  }
}
