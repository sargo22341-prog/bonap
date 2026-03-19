import { useState, useMemo } from "react"
import { Search, CalendarDays } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog.tsx"
import { Input } from "./ui/input.tsx"
import { useRecipes } from "../hooks/useRecipes.ts"
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
  const { recipes, loading } = useRecipes()
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    if (!search.trim()) return recipes
    const lower = search.toLowerCase()
    return recipes.filter((r) => r.name.toLowerCase().includes(lower))
  }, [recipes, search])

  const handleSelect = (recipe: MealieRecipe) => {
    onSelect(recipe)
    onOpenChange(false)
    setSearch("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[80vh] flex-col sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choisir une recette</DialogTitle>
          <DialogDescription>
            Recherchez et selectionnez une recette pour ce repas.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une recette..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Chargement...
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Aucune recette trouvee.
            </div>
          )}

          {!loading && (
            <div className="flex flex-col gap-1">
              {filtered.map((recipe) => {
                const imageUrl = `/api/media/recipes/${recipe.id}/images/min-original.webp`
                return (
                  <button
                    key={recipe.id}
                    type="button"
                    onClick={() => handleSelect(recipe)}
                    className="flex items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-accent"
                  >
                    {recipe.image ? (
                      <img
                        src={imageUrl}
                        alt={recipe.name}
                        className="h-10 w-10 shrink-0 rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-muted">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <span className="line-clamp-2 text-sm font-medium">
                      {recipe.name}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
