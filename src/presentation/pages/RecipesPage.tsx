import { useRecipes } from "../hooks/useRecipes.ts"
import { RecipeCard } from "../components/RecipeCard.tsx"
import { Button } from "../components/ui/button.tsx"
import { Loader2, AlertCircle, UtensilsCrossed } from "lucide-react"

export function RecipesPage() {
  const {
    recipes,
    loading,
    error,
    page,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
  } = useRecipes()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mes recettes</h1>

      {loading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center gap-2 py-24 text-destructive">
          <AlertCircle className="h-8 w-8" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && recipes.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-24 text-muted-foreground">
          <UtensilsCrossed className="h-8 w-8" />
          <p className="text-sm">Aucune recette trouvée</p>
        </div>
      )}

      {!loading && !error && recipes.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              disabled={!hasPreviousPage}
              onClick={goToPreviousPage}
            >
              Précédent
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasNextPage}
              onClick={goToNextPage}
            >
              Suivant
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
