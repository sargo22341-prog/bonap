import { Link } from "react-router-dom"
import { SeasonBadge } from "./SeasonBadge.tsx"
import type { MealieRecipe } from "../../shared/types/mealie.ts"
import { getRecipeSeasonsFromTags } from "../../shared/utils/season.ts"

interface RecipeCardProps {
  recipe: MealieRecipe
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const imageUrl = `/api/media/recipes/${recipe.id}/images/min-original.webp`
  const seasons = getRecipeSeasonsFromTags(recipe.tags)
  const categories = recipe.recipeCategory ?? []

  return (
    <Link to={`/recipes/${recipe.slug}`} className="group block">
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm transition-all duration-200 hover:shadow-warm-md hover:-translate-y-0.5 hover:border-primary/30">
        {/* Image carrée */}
        <div className="relative aspect-square w-full overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={recipe.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Dégradé bas toujours visible */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Badges saison */}
          {seasons.length > 0 && (
            <div className="absolute top-2 left-2 flex flex-wrap gap-1">
              {seasons.map((season) => (
                <SeasonBadge key={season} season={season} size="sm" />
              ))}
            </div>
          )}

          {/* Badges catégories */}
          {categories.length > 0 && (
            <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
              {categories.slice(0, 3).map((cat) => (
                <span
                  key={cat.id}
                  className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Nom */}
        <div className="px-3 pb-3 pt-2.5">
          <h3 className="truncate text-sm font-semibold leading-snug text-card-foreground group-hover:text-primary transition-colors duration-150">
            {recipe.name}
          </h3>
        </div>
      </div>
    </Link>
  )
}
