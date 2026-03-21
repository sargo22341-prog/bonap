import type { IRecipeRepository } from "../../../domain/recipe/repositories/IRecipeRepository.ts"
import type {
  MealiePaginatedRecipes,
  MealieRawPaginatedRecipes,
  MealieRecipe,
  MealieTag,
  RecipeFilters,
  RecipeFormData,
  Season,
} from "../../../shared/types/mealie.ts"
import { isSeasonTag } from "../../../shared/utils/season.ts"
import { mealieApiClient } from "../api/index.ts"

interface MealieTagObject { id?: string; name: string; slug: string }

export class RecipeRepository implements IRecipeRepository {
  /** Resolves season tags by including their id if they already exist in Mealie. */
  private async resolveSeasonTags(seasons: Season[]): Promise<MealieTagObject[]> {
    const response = await mealieApiClient.get<{ items: MealieTag[] }>("/api/organizers/tags")
    const existing = response.items
    return seasons.map((s) => {
      const tagName = `saison-${s}`
      const found = existing.find((t) => t.slug === tagName)
      return found
        ? { id: found.id, name: found.name, slug: found.slug }
        : { name: tagName, slug: tagName }
    })
  }
  async getAll(
    page = 1,
    perPage = 30,
    filters: RecipeFilters = {},
  ): Promise<MealiePaginatedRecipes> {
    const params = new URLSearchParams({
      page: String(page),
      perPage: String(perPage),
    })
    if (filters.search?.trim()) {
      params.set("search", filters.search.trim())
    }
    if (filters.categories?.length) {
      params.set("categories", filters.categories.join(","))
    }
    if (filters.tags?.length) {
      params.set("tags", filters.tags.join(","))
    }
    if (filters.maxTotalTime !== undefined) {
      params.set("maxTotalTime", String(filters.maxTotalTime))
    }
    const raw = await mealieApiClient.get<MealieRawPaginatedRecipes>(
      `/api/recipes?${params.toString()}`,
    )
    return {
      items: raw.items,
      total: raw.total,
      page: raw.page,
      perPage: raw.per_page,
      totalPages: raw.total_pages,
    }
  }

  async getBySlug(slug: string): Promise<MealieRecipe> {
    return mealieApiClient.get<MealieRecipe>(`/api/recipes/${slug}`)
  }

  private ingredientText(ing: MealieIngredient): string | null {
    if (ing.originalText) return ing.originalText
    if (ing.display) return ing.display
    const parts = [
      ing.quantity != null ? String(ing.quantity) : "",
      ing.unit?.name ?? "",
      ing.food?.name ?? "",
      ing.note ?? "",
    ].filter(Boolean)
    return parts.length ? parts.join(" ") : null
  }

  private async parseAndUpdateIngredients(slug: string, recipe: MealieRecipe): Promise<void> {
    const ingredients = recipe.recipeIngredient ?? []
    const texts = ingredients.map((ing) => this.ingredientText(ing)).filter(Boolean) as string[]
    if (!texts.length) return

    const parsed = await mealieApiClient.post<MealieIngredient[]>(
      "/api/parser/ingredients",
      texts.map((t) => ({ ingredient: t })),
    )

    await mealieApiClient.patch(`/api/recipes/${slug}`, {
      name: recipe.name,
      recipeIngredient: parsed,
    })
  }

  async createFromUrl(url: string): Promise<string> {
    const response = await mealieApiClient.postSse<{ message: string; slug: string | null }>(
      "/api/recipes/create/url/stream",
      { url },
    )
    if (!response.slug) throw new Error("Recipe import failed: no slug returned")
    const slug = response.slug
    const recipe = await this.getBySlug(slug)
    await this.parseAndUpdateIngredients(slug, recipe)
    return slug
  }

  async create(name: string): Promise<string> {
    const response = await mealieApiClient.post<string | { slug: string }>("/api/recipes", { name })
    return typeof response === "string" ? response : response.slug
  }

  private minutesToIso(minutes: string): string | undefined {
    const m = parseInt(minutes)
    if (!m || m <= 0) return undefined
    const h = Math.floor(m / 60)
    const rem = m % 60
    return h > 0 ? `PT${h}H${rem > 0 ? `${rem}M` : ""}` : `PT${rem}M`
  }

  async update(slug: string, data: RecipeFormData): Promise<MealieRecipe> {
    const seasonTags = await this.resolveSeasonTags(data.seasons)
    const payload = {
      name: data.name,
      description: data.description || undefined,
      prepTime: this.minutesToIso(data.prepTime),
      recipeCategory: data.categories,
      recipeIngredient: data.recipeIngredient.map((ing) => ({
        quantity: ing.quantity ? parseFloat(ing.quantity) : undefined,
        unit: ing.unit ? { name: ing.unit } : undefined,
        food: ing.food ? { name: ing.food } : undefined,
        note: ing.note || undefined,
      })),
      recipeInstructions: data.recipeInstructions
        .filter((step) => step.text.trim())
        .map((step, i) => ({
          id: String(i),
          text: step.text,
        })),
      tags: [...data.tags, ...seasonTags],
    }
    return mealieApiClient.patch<MealieRecipe>(`/api/recipes/${slug}`, payload)
  }

  async updateSeasons(slug: string, seasons: Season[]): Promise<MealieRecipe> {
    const [current, seasonTags] = await Promise.all([
      this.getBySlug(slug),
      this.resolveSeasonTags(seasons),
    ])
    const nonSeasonTags = (current.tags ?? [])
      .filter((t) => !isSeasonTag(t))
      .map((t) => ({ id: t.id, name: t.name, slug: t.slug }))
    return mealieApiClient.patch<MealieRecipe>(`/api/recipes/${slug}`, {
      name: current.name,
      tags: [...nonSeasonTags, ...seasonTags],
    })
  }
}
