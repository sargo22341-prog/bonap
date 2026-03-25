import type { IUnitRepository } from "../../../domain/organizer/repositories/IUnitRepository.ts"
import type { MealieUnit } from "../../../shared/types/mealie.ts"
import { mealieApiClient } from "../api/index.ts"

interface MealieUnitsResponse {
  items: MealieUnit[]
}

export class UnitRepository implements IUnitRepository {
  async getAll(): Promise<MealieUnit[]> {
    const response = await mealieApiClient.get<MealieUnitsResponse>(
      "/api/units?page=1&perPage=-1&orderBy=name&orderDirection=asc",
    )
    return response.items
  }
}
