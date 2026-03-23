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
import { Loader2, AlertCircle, UtensilsCrossed, Search, X, RotateCcw, Plus, PenLine, LayoutGrid, Table2, Clock, RefreshCw } from "lucide-react"
import type { MealieRecipe, Season } from "../../shared/types/mealie.ts"
import { SEASONS, SEASON_LABELS } from "../../shared/types/mealie.ts"
import { getCurrentSeason, getRecipeSeasonsFromTags, isSeasonTag } from "../../shared/utils/season.ts"
import { getRecipesUseCase, getRecipeUseCase } from "../../infrastructure/container.ts"
import { cn } from "../../lib/utils.ts"

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
      const first = await getRecipesUseCase.execute(1, 100)
      const allItems = [...first.items]
      for (let page = 2; page <= first.totalPages; page++) {
        const data = await getRecipesUseCase.execute(page, 100)
        allItems.push(...data.items)
      }
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
      {/* ── En-tête sticky ── */}
      <div className="sticky top-0 z-10 -mx-4 -mt-4 md:-mx-8 md:-mt-8 bg-background/95 backdrop-blur px-4 pt-4 md:px-8 md:pt-8 pb-4 border-b border-border/60">

        {/* Ligne titre */}
        <div className="flex items-center justify-between mb-4 gap-3">
          <div className="flex items-baseline gap-2.5">
            <h1 className="font-heading text-2xl font-bold tracking-tight">Mes recettes</h1>
            {filteredRecipes.length > 0 && (
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                {filteredRecipes.length}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Bascule vue */}
            <div className="flex rounded-xl border border-border overflow-hidden">
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                aria-label="Vue cartes"
                className={cn(
                  "flex items-center px-2.5 py-1.5 text-sm transition-colors",
                  viewMode === "cards"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted/50",
                )}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                aria-label="Vue tableau"
                className={cn(
                  "flex items-center px-2.5 py-1.5 text-sm transition-colors",
                  viewMode === "table"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted/50",
                )}
              >
                <Table2 className="h-4 w-4" />
              </button>
            </div>

            {/* Importer depuis Mealie */}
            <a
              href={`${(import.meta.env.VITE_MEALIE_URL as string ?? "").replace(/\/+$/, "")}/g/home/r/create/url`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Importer</span>
            </a>

            {/* Nouvelle recette */}
            <Button
              size="sm"
              onClick={() => setNewRecipeDialogOpen(true)}
              className="gap-1.5 rounded-xl"
            >
              <PenLine className="h-4 w-4" />
              <span className="hidden sm:inline">Nouvelle recette</span>
            </Button>
          </div>
        </div>

        {/* Barre de filtres */}
        <div className="space-y-2">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher une recette..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-9 rounded-xl"
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

          {/* Filtres pills */}
          <div className="relative flex items-center gap-2">
            <div className="flex gap-1.5 overflow-x-auto flex-nowrap scrollbar-hide pb-0.5">
              {/* Saisons */}
              {SEASONS.map((season: Season) => {
                const active = selectedSeasons.includes(season)
                return (
                  <Badge
                    key={season}
                    variant={active ? "default" : "outline"}
                    className="cursor-pointer select-none transition-all whitespace-nowrap shrink-0 rounded-full"
                    onClick={() => toggleSeason(season)}
                  >
                    {SEASON_LABELS[season]}
                  </Badge>
                )
              })}

              <span className="flex items-center px-0.5 text-border select-none shrink-0">·</span>

              {/* Temps */}
              {TIME_OPTIONS.filter((opt) => opt.value !== undefined).map((opt) => {
                const active = maxTotalTime === opt.value
                return (
                  <Badge
                    key={opt.label}
                    variant={active ? "default" : "outline"}
                    className="cursor-pointer select-none transition-all whitespace-nowrap shrink-0 rounded-full"
                    onClick={() => handleTimeFilter(opt.value)}
                  >
                    {opt.label}
                  </Badge>
                )
              })}

              {/* Sans ingrédients */}
              <Badge
                variant={noIngredients ? "default" : "outline"}
                className="cursor-pointer select-none transition-all whitespace-nowrap shrink-0 rounded-full"
                onClick={() => setNoIngredients((prev) => !prev)}
              >
                Sans ingrédients
              </Badge>

              {/* Catégories */}
              {categories.length > 0 && (
                <>
                  <span className="flex items-center px-0.5 text-border select-none shrink-0">·</span>
                  {categories.map((cat) => {
                    const active = selectedCategories.includes(cat.slug)
                    return (
                      <Badge
                        key={cat.id}
                        variant={active ? "default" : "outline"}
                        className="cursor-pointer select-none transition-all whitespace-nowrap shrink-0 rounded-full"
                        onClick={() => toggleCategory(cat.slug)}
                      >
                        {cat.name}
                      </Badge>
                    )
                  })}
                </>
              )}

              {/* Tags */}
              {tags.filter((t) => !isSeasonTag(t)).length > 0 && (
                <>
                  <span className="flex items-center px-0.5 text-border select-none shrink-0">·</span>
                  {tags.filter((t) => !isSeasonTag(t)).map((tag) => {
                    const active = selectedTags.includes(tag.slug)
                    return (
                      <Badge
                        key={tag.id}
                        variant={active ? "secondary" : "outline"}
                        className="cursor-pointer select-none transition-all whitespace-nowrap shrink-0 rounded-full"
                        onClick={() => toggleTag(tag.slug)}
                      >
                        {tag.name}
                      </Badge>
                    )
                  })}
                </>
              )}
            </div>

            {/* Effacer les filtres */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="shrink-0 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors border-l border-border pl-2 ml-1"
              >
                <RotateCcw className="h-3 w-3" />
                <span className="hidden sm:inline">Effacer</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <div className="flex flex-col items-center gap-2 py-24 text-destructive">
          <AlertCircle className="h-8 w-8" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* État vide */}
      {!loading && !error && filteredRecipes.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-24 text-muted-foreground">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
            <UtensilsCrossed className="h-7 w-7" />
          </div>
          <p className="text-sm font-medium">Aucune recette trouvée</p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="mt-1 text-sm text-primary underline underline-offset-2 hover:opacity-80"
            >
              Effacer les filtres
            </button>
          )}
        </div>
      )}

      {/* Vue cartes */}
      {viewMode === "cards" && filteredRecipes.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}

      {/* Vue tableau */}
      {viewMode === "table" && filteredRecipes.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => loadDetails(filteredRecipes)}
              disabled={detailsLoading}
              className="gap-1.5 rounded-xl"
            >
              {detailsLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
              Charger les détails
            </Button>
          </div>

          {/* En-têtes colonnes */}
          <div className="grid grid-cols-[2fr_72px_72px_1fr_auto] items-center gap-3 border-b border-border px-4 pb-2">
            <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Nom</span>
            <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground text-right">Prép.</span>
            <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground text-right">Cuisson</span>
            <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Tags</span>
            <span className="w-8" />
          </div>

          {/* Lignes */}
          <div className="rounded-2xl border border-border/60 overflow-hidden">
            {filteredRecipes.map((recipe, index) => {
              const detail = detailedRecipes.get(recipe.slug)
              const ingredients = detail?.recipeIngredient
              const nonSeasonTags = (recipe.tags ?? []).filter((t) => !isSeasonTag(t))
              const prepTime = formatDuration(recipe.prepTime)
              const cookTime = formatDuration(recipe.cookTime)

              return (
                <div
                  key={recipe.id}
                  className={cn(
                    "grid grid-cols-[2fr_72px_72px_1fr_auto] items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors",
                    index > 0 && "border-t border-border/40",
                  )}
                >
                  <div className="min-w-0">
                    <Link
                      to={`/recipes/${recipe.slug}`}
                      className="text-sm font-semibold text-foreground hover:text-primary transition-colors truncate block"
                    >
                      {recipe.name}
                    </Link>
                    {ingredients !== undefined && (
                      <span className="text-xs text-muted-foreground/70">
                        {ingredients.length > 0
                          ? `${ingredients.length} ingrédient${ingredients.length > 1 ? "s" : ""}`
                          : "Aucun ingrédient"}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-1 text-sm text-muted-foreground whitespace-nowrap">
                    {prepTime !== "—" && <Clock className="h-3 w-3 shrink-0" />}
                    <span>{prepTime}</span>
                  </div>

                  <div className="flex items-center justify-end gap-1 text-sm text-muted-foreground whitespace-nowrap">
                    {cookTime !== "—" && <Clock className="h-3 w-3 shrink-0" />}
                    <span>{cookTime}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 min-w-0">
                    {nonSeasonTags.map((t) => (
                      <Badge key={t.id} variant="secondary" className="text-xs py-0 px-1.5 rounded-full">
                        {t.name}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-end">
                    <Link
                      to={`/recipes/${recipe.slug}`}
                      className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                      Voir
                    </Link>
                  </div>
                </div>
              )
            })}
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
