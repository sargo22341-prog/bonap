/**
 * Formate une date au format YYYY-MM-DD.
 */
export function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

/**
 * Calcule le nombre de semaines (fractionnaire) entre deux dates au format YYYY-MM-DD.
 * Retourne au minimum 1.
 */
export function getWeeksBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffMs = end.getTime() - start.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1
  return Math.max(1, diffDays / 7)
}
