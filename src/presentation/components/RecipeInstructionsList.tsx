import type { MealieInstruction } from "../../shared/types/mealie.ts"

interface RecipeInstructionsListProps {
  instructions: MealieInstruction[]
  /** Heading size class — defaults to "text-lg" */
  headingSize?: "text-lg" | "text-base"
  renderHtml?: boolean
}

export function RecipeInstructionsList({
  instructions,
  headingSize = "text-lg",
  renderHtml = true,
}: RecipeInstructionsListProps) {
  if (instructions.length === 0) return null

  // helper pour supprimer le HTML
  const stripHtml = (html: string) =>
    html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim()


  const sanitizeInstructionHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, "text/html")

    // supprimer tous les éléments sauf img
    const all = doc.body.querySelectorAll("*")

    all.forEach((el) => {
      if (el.tagName.toLowerCase() !== "img") {
        el.replaceWith(...Array.from(el.childNodes))
      }
    })

    return doc.body.innerHTML
  }

  return (
    <section className="space-y-4">
      <h2 className={`font-heading ${headingSize} font-bold tracking-tight`}>Instructions</h2>
      <ol className="space-y-5">
        {instructions.map((step, i) => (
          <li key={step.id} className="flex gap-3">
            {/* Numéro d'étape */}
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/8 text-[11px] font-bold text-primary mt-0.5">
              {i + 1}
            </span>
            <div className="space-y-0.5 flex-1">
              {step.title && (
                <p className="text-sm font-semibold">{step.title}</p>
              )}
              {renderHtml ? (
                <div
                  className="text-sm text-muted-foreground leading-relaxed space-y-2 [&_img]:rounded-lg [&_img]:mt-2 [&_img]:max-w-full"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeInstructionHtml(step.text),
                  }}
                />
              ) : (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {stripHtml(step.text)}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
