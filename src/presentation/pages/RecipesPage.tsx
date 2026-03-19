import { useEffect, useRef } from "react"
import { useRecipesInfinite } from "../hooks/useRecipesInfinite.ts"
import { RecipeCard } from "../components/RecipeCard.tsx"
import { Loader2, AlertCircle, UtensilsCrossed } from "lucide-react"

export function RecipesPage() {
  const { recipes, loading, error, hasMore, loadMore } = useRecipesInfinite("")
  const sentinelRef = useRef<HTMLDivElement>(null)

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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mes recettes</h1>

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

      {recipes.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}

      <div ref={sentinelRef} className="h-4" />

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  )
}
