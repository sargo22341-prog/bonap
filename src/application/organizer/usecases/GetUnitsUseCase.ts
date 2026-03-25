import type { IUnitRepository } from "../../../domain/organizer/repositories/IUnitRepository.ts"
import type { MealieUnit } from "../../../shared/types/mealie.ts"

export class GetUnitsUseCase {
  private unitRepository: IUnitRepository

  constructor(unitRepository: IUnitRepository) {
    this.unitRepository = unitRepository
  }

  async execute(): Promise<MealieUnit[]> {
    return this.unitRepository.getAll()
  }
}
