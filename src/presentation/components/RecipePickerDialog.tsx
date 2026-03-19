import { useEffect, useRef, useState } from "react"
import { Search, Loader2, UtensilsCrossed, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog.tsx"
import { Input } from "./ui/input.tsx"
import { Badge } from "./ui/badge.tsx"
import { useRecipesInfinite } from "../hooks/useRecipesInfinite.ts"
import { useCategories } from "../hooks/useCategories.ts"
import type { MealieRecipe } from "../../shared/types/mealie.ts"

interface RecipePickerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (recipe: MealieRecipe) => void
}

export function RecipePickerDialog({
  open,
  onOpenChange,
  onSelect,
}: RecipePickerDialogProps) {
  const [search, setSearch] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const sentinelRef = useRef<HTMLDivElement>(null)

  const { categories } = useCategories()

  const { recipes, loading, hasMore, loadMore } = useRecipesInfinite({
    search,
    categories: selectedCategories,
  })

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      setSearch("")
      setSelectedCategories([])
    }
    onOpenChange(value)
  }

  // IntersectionObserver pour le lazy loading
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

  const handleSelect = (recipe: MealieRecipe) => {
    onSelect(recipe)
    handleOpenChange(false)
  }

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    )
  }

  const hasActiveFilters = search.trim() !== "" || selectedCategories.length > 0

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Choisir une recette</DialogTitle>
          <DialogDescription>
            Recherchez et sélectionnez une recette pour ce repas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher une recette..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-9"
              autoFocus
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

          {/* Filtres catégories */}
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

          {/* Bouton réinitialiser */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setSearch("")
                setSelectedCategories([])
              }}
              className="text-xs text-muted-foreground underline-offset-2 hover:underline"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {recipes.length === 0 && !loading && (
            <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
              <UtensilsCrossed className="h-8 w-8" />
              <p className="text-sm">Aucune recette trouvée.</p>
            </div>
          )}

          <div className="grid grid-cols-5 gap-2 p-1">
            {recipes.map((recipe) => (
              <button
                key={recipe.id}
                type="button"
                onClick={() => handleSelect(recipe)}
                className="group flex flex-col gap-1.5 rounded-lg p-1.5 text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-md bg-muted">
                  <img
                    src={`/api/media/recipes/${recipe.id}/images/min-original.webp`}
                    alt={recipe.name}
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <span className="line-clamp-2 w-full text-[11px] font-medium leading-tight">
                  {recipe.name}
                </span>
              </button>
            ))}
          </div>

          {/* Sentinel pour le lazy loading */}
          <div ref={sentinelRef} className="h-4" />

          {loading && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
