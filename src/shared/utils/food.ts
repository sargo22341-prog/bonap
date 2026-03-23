/**
 * Extracts the core food name from an ingredient note by stripping
 * leading quantities, units, and prepositions.
 *
 * Examples:
 *   "200g de gruyère" → "gruyère"
 *   "1 oignon rouge"  → "oignon rouge"
 *   "2 cuillères à soupe de crème" → "crème"
 *   "sel" → "sel"
 */
export function extractFoodKey(note: string): string {
  let s = note.trim()

  // Strip leading numbers (integers, decimals, fractions like 1/2)
  s = s.replace(/^\d+([.,/]\d+)?\s*/, "")

  // Strip unicode fractions
  s = s.replace(/^[½⅓⅔¼¾⅛⅜⅝⅞]\s*/, "")

  // Strip common units (order: longest first to avoid partial matches)
  const units = [
    "cuillères? à soupe",
    "cuillères? à café",
    "cuillères?",
    "litres?",
    "sachets?",
    "tranches?",
    "feuilles?",
    "gousses?",
    "pincées?",
    "bottes?",
    "verres?",
    "tasses?",
    "bols?",
    "cas",
    "cac",
    "kg",
    "mg",
    "dl",
    "cl",
    "ml",
    "cs",
    "cc",
    "g",
    "l",
  ]
  // L'unité doit être suivie d'un espace ou d'un chiffre pour ne pas croquer le début d'un mot
  const unitPattern = new RegExp(`^(${units.join("|")})s?(?=\\s|\\d|$)\\s*`, "i")
  s = s.replace(unitPattern, "")

  // Strip "de " ou "d'" (préposition) mais pas un "d" seul collé à un mot
  s = s.replace(/^d(?:e\s+|')/i, "")

  return s.trim().toLowerCase()
}
