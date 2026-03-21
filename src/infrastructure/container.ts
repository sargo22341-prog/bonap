/**
 * Conteneur de dépendances — module singleton.
 *
 * Toutes les instances de repositories et use cases sont créées une seule fois
 * et partagées à travers toute l'application. Les hooks importent directement
 * depuis ce fichier au lieu d'instancier eux-mêmes leurs dépendances.
 */

// Repositories
import { RecipeRepository } from "./mealie/repositories/RecipeRepository.ts"
import { PlanningRepository } from "./mealie/repositories/PlanningRepository.ts"
import { ShoppingRepository } from "./mealie/repositories/ShoppingRepository.ts"
import { CategoryRepository } from "./mealie/repositories/CategoryRepository.ts"
import { TagRepository } from "./mealie/repositories/TagRepository.ts"
import { CustomItemRepository } from "./shopping/CustomItemRepository.ts"

// Use cases — recipe
import { GetRecipesUseCase } from "../application/recipe/usecases/GetRecipesUseCase.ts"
import { GetRecipeUseCase } from "../application/recipe/usecases/GetRecipeUseCase.ts"
import { GetRecipesByIdsUseCase } from "../application/recipe/usecases/GetRecipesByIdsUseCase.ts"
import { CreateRecipeUseCase } from "../application/recipe/usecases/CreateRecipeUseCase.ts"
import { UpdateRecipeUseCase } from "../application/recipe/usecases/UpdateRecipeUseCase.ts"
import { CreateRecipeFromUrlUseCase } from "../application/recipe/usecases/CreateRecipeFromUrlUseCase.ts"
import { UpdateSeasonsUseCase } from "../application/recipe/usecases/UpdateSeasonsUseCase.ts"

// Use cases — planning
import { GetWeekPlanningUseCase } from "../application/planning/usecases/GetWeekPlanningUseCase.ts"
import { GetPlanningRangeUseCase } from "../application/planning/usecases/GetPlanningRangeUseCase.ts"
import { AddMealUseCase } from "../application/planning/usecases/AddMealUseCase.ts"
import { DeleteMealUseCase } from "../application/planning/usecases/DeleteMealUseCase.ts"

// Use cases — shopping
import { GetShoppingItemsUseCase } from "../application/shopping/usecases/GetShoppingItemsUseCase.ts"
import { AddItemUseCase } from "../application/shopping/usecases/AddItemUseCase.ts"
import { AddRecipesToListUseCase } from "../application/shopping/usecases/AddRecipesToListUseCase.ts"
import { ToggleItemUseCase } from "../application/shopping/usecases/ToggleItemUseCase.ts"
import { DeleteItemUseCase } from "../application/shopping/usecases/DeleteItemUseCase.ts"
import { ClearListUseCase } from "../application/shopping/usecases/ClearListUseCase.ts"

// Use cases — organizer
import { GetCategoriesUseCase } from "../application/organizer/usecases/GetCategoriesUseCase.ts"
import { GetTagsUseCase } from "../application/organizer/usecases/GetTagsUseCase.ts"

// --- Instances singleton des repositories ---

export const recipeRepository = new RecipeRepository()
export const planningRepository = new PlanningRepository()
export const shoppingRepository = new ShoppingRepository()
export const categoryRepository = new CategoryRepository()
export const tagRepository = new TagRepository()
export const customItemRepository = new CustomItemRepository()

// --- Instances singleton des use cases — recipe ---

export const getRecipesUseCase = new GetRecipesUseCase(recipeRepository)
export const getRecipeUseCase = new GetRecipeUseCase(recipeRepository)
export const getRecipesByIdsUseCase = new GetRecipesByIdsUseCase(recipeRepository)
export const createRecipeUseCase = new CreateRecipeUseCase(recipeRepository)
export const updateRecipeUseCase = new UpdateRecipeUseCase(recipeRepository)
export const createRecipeFromUrlUseCase = new CreateRecipeFromUrlUseCase(recipeRepository)
export const updateSeasonsUseCase = new UpdateSeasonsUseCase(recipeRepository)

// --- Instances singleton des use cases — planning ---

export const getWeekPlanningUseCase = new GetWeekPlanningUseCase(planningRepository)
export const getPlanningRangeUseCase = new GetPlanningRangeUseCase(planningRepository)
export const addMealUseCase = new AddMealUseCase(planningRepository)
export const deleteMealUseCase = new DeleteMealUseCase(planningRepository)

// --- Instances singleton des use cases — shopping ---

export const getShoppingItemsUseCase = new GetShoppingItemsUseCase(shoppingRepository)
export const addItemUseCase = new AddItemUseCase(shoppingRepository)
export const addRecipesToListUseCase = new AddRecipesToListUseCase(shoppingRepository)
export const toggleItemUseCase = new ToggleItemUseCase(shoppingRepository)
export const deleteItemUseCase = new DeleteItemUseCase(shoppingRepository)
export const clearListUseCase = new ClearListUseCase(shoppingRepository)

// --- Instances singleton des use cases — organizer ---

export const getCategoriesUseCase = new GetCategoriesUseCase(categoryRepository)
export const getTagsUseCase = new GetTagsUseCase(tagRepository)
