import type { MealieUnit } from "../../../shared/types/mealie.ts"

export interface IUnitRepository {
  getAll(): Promise<MealieUnit[]>
}
