import { useEffect, useRef, useState } from "react"
import { Search, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog.tsx"
import { Input } from "./ui/input.tsx"
import { useRecipesInfinite } from "../hooks/useRecipesInfinite.ts"
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
  const { recipes, loading, hasMore, loadMore } = useRecipesInfinite(search)
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Réinitialise la recherche à la fermeture
  useEffect(() => {
    if (!open) setSearch("")
  }, [open])

  // IntersectionObserver pour le lazy loading
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          void loadMore()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loading, loadMore])

  const handleSelect = (recipe: MealieRecipe) => {
    onSelect(recipe)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[80vh] flex-col sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Choisir une recette</DialogTitle>
          <DialogDescription>
            Recherchez et sélectionnez une recette pour ce repas.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une recette..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            autoFocus
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {recipes.length === 0 && !loading && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Aucune recette trouvée.
            </div>
          )}

          <div className="grid grid-cols-5 gap-2 p-1">
            {recipes.map((recipe) => (
              <button
                key={recipe.id}
                type="button"
                onClick={() => handleSelect(recipe)}
                className="flex flex-col items-center gap-1 rounded-md p-1.5 text-center transition-colors hover:bg-accent"
              >
                <img
                  src={`/api/media/recipes/${recipe.id}/images/min-original.webp`}
                  alt={recipe.name}
                  className="aspect-square w-full rounded-md object-cover"
                />
                <span className="line-clamp-2 w-full text-[10px] leading-tight">
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
