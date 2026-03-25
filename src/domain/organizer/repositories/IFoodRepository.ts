import type { MealieFood } from "../../../shared/types/mealie.ts"

export interface IFoodRepository {
  getAll(): Promise<MealieFood[]>
  create(name: string): Promise<MealieFood>
}
