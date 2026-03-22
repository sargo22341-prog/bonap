import { useCallback, useEffect, useRef, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useRecipesInfinite } from "../hooks/useRecipesInfinite.ts"
import { useCategories } from "../hooks/useCategories.ts"
import { useTags } from "../hooks/useTags.ts"
import { RecipeCard } from "../components/RecipeCard.tsx"
import { RecipeFormDialog } from "../components/RecipeFormDialog.tsx"
import { Badge } from "../components/ui/badge.tsx"
import { Button } from "../components/ui/button.tsx"
import { Input } from "../components/ui/input.tsx"
import { Loader2, AlertCircle, UtensilsCrossed, Search, X, RotateCcw, Plus, PenLine, LayoutGrid, Table2, RefreshCw } from "lucide-react"
import type { MealieRecipe, Season } from "../../shared/types/mealie.ts"
import { SEASONS, SEASON_LABELS } from "../../shared/types/mealie.ts"
import { getCurrentSeason, getRecipeSeasonsFromTags, isSeasonTag } from "../../shared/utils/season.ts"
import { getRecipesUseCase, getRecipeUseCase } from "../../infrastructure/container.ts"

type ViewMode = "cards" | "table"

function formatDuration(iso?: string): string {
  if (!iso) return "—"
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
  if (!match) return "—"
  const h = parseInt(match[1] ?? "0")
  const m = parseInt(match[2] ?? "0")
  if (h > 0 && m > 0) return `${h}h${m}`
  if (h > 0) return `${h}h`
  if (m > 0) return `${m} min`
  return "—"
}

const TIME_OPTIONS = [
  { label: "< 30 min", value: 30 },
  { label: "< 1h", value: 60 },
  { label: "1h+", value: undefined },
] as const

export function RecipesPage() {
  const [search, setSearch] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [maxTotalTime, setMaxTotalTime] = useState<number | undefined>(undefined)
  const [selectedSeasons, setSelectedSeasons] = useState<Season[]>([getCurrentSeason()])
  const [noIngredients, setNoIngredients] = useState(false)
  const [noIngredientRecipes, setNoIngredientRecipes] = useState<MealieRecipe[] | null>(null)
  const [noIngredientsLoading, setNoIngredientsLoading] = useState(false)
  const [newRecipeDialogOpen, setNewRecipeDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("cards")
  const [detailedRecipes, setDetailedRecipes] = useState<Map<string, MealieRecipe>>(new Map())
  const [detailsLoading, setDetailsLoading] = useState(false)
  const navigate = useNavigate()

  const sentinelRef = useRef<HTMLDivElement>(null)

  const { categories } = useCategories()
  const { tags } = useTags()

  const { recipes, loading, error, hasMore, loadMore } = useRecipesInfinite({
    search,
    categories: selectedCategories,
    tags: selectedTags,
    maxTotalTime,
  })

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loading, loadMore])

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    )
  }

  const toggleTag = (slug: string) => {
    setSelectedTags((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    )
  }

  const toggleSeason = (season: Season) => {
    setSelectedSeasons((prev) =>
      prev.includes(season) ? prev.filter((s) => s !== season) : [...prev, season],
    )
  }

  const handleTimeFilter = (value: number | undefined) => {
    setMaxTotalTime((prev) => (prev === value ? undefined : value))
  }

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedCategories.length > 0 ||
    selectedTags.length > 0 ||
    maxTotalTime !== undefined ||
    selectedSeasons.length > 0 ||
    noIngredients

  const resetFilters = () => {
    setSearch("")
    setSelectedCategories([])
    setSelectedTags([])
    setMaxTotalTime(undefined)
    setSelectedSeasons([])
    setNoIngredients(false)
    setNoIngredientRecipes(null)
  }

  const loadRecipesWithoutIngredients = useCallback(async () => {
    setNoIngredientsLoading(true)
    setNoIngredientRecipes(null)
    try {
      // Fetch all pages to collect every recipe slug
      const first = await getRecipesUseCase.execute(1, 100)
      const allItems = [...first.items]
      for (let page = 2; page <= first.totalPages; page++) {
        const data = await getRecipesUseCase.execute(page, 100)
        allItems.push(...data.items)
      }
      // Fetch details in parallel (ingredient data only in detail endpoint)
      const details = await Promise.all(allItems.map((r) => getRecipeUseCase.execute(r.slug)))
      setNoIngredientRecipes(details.filter((r) => !r.recipeIngredient?.length))
    } catch {
      setNoIngredientRecipes([])
    } finally {
      setNoIngredientsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (noIngredients) {
      void loadRecipesWithoutIngredients()
    } else {
      setNoIngredientRecipes(null)
    }
  }, [noIngredients, loadRecipesWithoutIngredients])

  const loadDetails = useCallback(async (recipesToLoad: MealieRecipe[]) => {
    setDetailsLoading(true)
    try {
      const details = await Promise.all(recipesToLoad.map((r) => getRecipeUseCase.execute(r.slug)))
      setDetailedRecipes((prev) => {
        const next = new Map(prev)
        details.forEach((d) => next.set(d.slug, d))
        return next
      })
    } finally {
      setDetailsLoading(false)
    }
  }, [])

  // Client-side season filter (only applies when noIngredients is off)
  const filteredRecipes = noIngredients
    ? (noIngredientRecipes ?? [])
    : recipes.filter((recipe) => {
        if (selectedSeasons.length > 0) {
          const recipeSeasons = getRecipeSeasonsFromTags(recipe.tags)
          if (recipeSeasons.length > 0 && !selectedSeasons.some((s) => recipeSeasons.includes(s))) {
            return false
          }
        }
        return true
      })

  return (
    <div className="space-y-6">
      {/* Header sticky */}
      <div className="sticky top-0 z-10 -mx-4 -mt-4 md:-mx-6 md:-mt-6 bg-background px-4 pt-4 md:px-6 md:pt-6 pb-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold">Mes recettes</h1>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Réinitialiser
              </button>
            )}
            {/* View toggle */}
            <div className="flex rounded-md border border-input overflow-hidden">
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`flex items-center px-2 py-1.5 text-sm transition-colors ${viewMode === "cards" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-accent"}`}
                aria-label="Vue cartes"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`flex items-center px-2 py-1.5 text-sm transition-colors ${viewMode === "table" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-accent"}`}
                aria-label="Vue tableau"
              >
                <Table2 className="h-4 w-4" />
              </button>
            </div>
            <a
              href={`${(import.meta.env.VITE_MEALIE_URL as string ?? "").replace(/\/+$/, "")}/g/home/r/create/url`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Importer</span>
            </a>
            <Button
              size="sm"
              onClick={() => setNewRecipeDialogOpen(true)}
              className="gap-1.5"
            >
              <PenLine className="h-4 w-4" />
              <span className="hidden sm:inline">Nouvelle recette</span>
            </Button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher une recette..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-9"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Season filter */}
          <div className="flex flex-wrap gap-1.5">
            {SEASONS.map((season: Season) => {
              const active = selectedSeasons.includes(season)
              return (
                <Badge
                  key={season}
                  variant={active ? "default" : "outline"}
                  className="cursor-pointer select-none transition-colors"
                  onClick={() => toggleSeason(season)}
                >
                  {SEASON_LABELS[season]}
                </Badge>
              )
            })}
          </div>

          {/* Time filter */}
          <div className="flex flex-wrap gap-1.5">
            {TIME_OPTIONS.filter((opt) => opt.value !== undefined).map((opt) => {
              const active = maxTotalTime === opt.value
              return (
                <Badge
                  key={opt.label}
                  variant={active ? "default" : "outline"}
                  className="cursor-pointer select-none transition-colors"
                  onClick={() => handleTimeFilter(opt.value)}
                >
                  {opt.label}
                </Badge>
              )
            })}
          </div>

          {/* No ingredients filter */}
          <div className="flex flex-wrap gap-1.5">
            <Badge
              variant={noIngredients ? "default" : "outline"}
              className="cursor-pointer select-none transition-colors"
              onClick={() => setNoIngredients((prev) => !prev)}
            >
              Sans ingrédients
            </Badge>
          </div>

          {/* Category filters */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => {
                const active = selectedCategories.includes(cat.slug)
                return (
                  <Badge
                    key={cat.id}
                    variant={active ? "default" : "outline"}
                    className="cursor-pointer select-none transition-colors"
                    onClick={() => toggleCategory(cat.slug)}
                  >
                    {cat.name}
                  </Badge>
                )
              })}
            </div>
          )}

          {/* Tag filters */}
          {tags.filter((t) => !isSeasonTag(t)).length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.filter((t) => !isSeasonTag(t)).map((tag) => {
                const active = selectedTags.includes(tag.slug)
                return (
                  <Badge
                    key={tag.id}
                    variant={active ? "secondary" : "outline"}
                    className="cursor-pointer select-none transition-colors"
                    onClick={() => toggleTag(tag.slug)}
                  >
                    {tag.name}
                  </Badge>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex flex-col items-center gap-2 py-24 text-destructive">
          <AlertCircle className="h-8 w-8" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredRecipes.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-24 text-muted-foreground">
          <UtensilsCrossed className="h-8 w-8" />
          <p className="text-sm">Aucune recette trouvée</p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="mt-1 text-sm underline underline-offset-2"
            >
              Effacer les filtres
            </button>
          )}
        </div>
      )}

      {/* Recipe cards */}
      {viewMode === "cards" && filteredRecipes.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}

      {/* Recipe table */}
      {viewMode === "table" && filteredRecipes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{filteredRecipes.length} recette{filteredRecipes.length > 1 ? "s" : ""}</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => loadDetails(filteredRecipes)}
              disabled={detailsLoading}
              className="gap-1.5"
            >
              {detailsLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
              Charger les détails
            </Button>
          </div>
          <div className="rounded-md border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-3 py-2 text-left font-medium">Nom</th>
                  <th className="px-3 py-2 text-left font-medium whitespace-nowrap">Prép.</th>
                  <th className="px-3 py-2 text-left font-medium whitespace-nowrap">Cuisson</th>
                  <th className="px-3 py-2 text-left font-medium">Ingrédients</th>
                  <th className="px-3 py-2 text-left font-medium">Instructions</th>
                  <th className="px-3 py-2 text-left font-medium">Tags</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecipes.map((recipe) => {
                  const detail = detailedRecipes.get(recipe.slug)
                  const ingredients = detail?.recipeIngredient
                  const instructions = detail?.recipeInstructions
                  const nonSeasonTags = (recipe.tags ?? []).filter((t) => !isSeasonTag(t))
                  return (
                    <tr key={recipe.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-3 py-2 font-medium">
                        <Link to={`/recipes/${recipe.slug}`} className="hover:underline text-foreground">
                          {recipe.name}
                        </Link>
                      </td>
                      <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">{formatDuration(recipe.prepTime)}</td>
                      <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">{formatDuration(recipe.cookTime)}</td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {ingredients
                          ? ingredients.length > 0
                            ? <span title={ingredients.map((i) => i.note ?? i.food?.name ?? "").filter(Boolean).join(", ")}>{ingredients.length} ingrédient{ingredients.length > 1 ? "s" : ""}</span>
                            : <span className="italic">Aucun</span>
                          : <span className="text-muted-foreground/50">—</span>
                        }
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {instructions
                          ? instructions.length > 0
                            ? `${instructions.length} étape${instructions.length > 1 ? "s" : ""}`
                            : <span className="italic">Aucune</span>
                          : <span className="text-muted-foreground/50">—</span>
                        }
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap gap-1">
                          {nonSeasonTags.map((t) => (
                            <Badge key={t.id} variant="secondary" className="text-xs py-0">{t.name}</Badge>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div ref={sentinelRef} className="h-4" />

      {(loading || noIngredientsLoading) && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}


      <RecipeFormDialog
        open={newRecipeDialogOpen}
        onOpenChange={setNewRecipeDialogOpen}
        onSuccess={(recipe: MealieRecipe) => navigate(`/recipes/${recipe.slug}`)}
      />
    </div>
  )
}
