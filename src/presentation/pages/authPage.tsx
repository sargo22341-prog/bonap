import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button.tsx'
import { Input } from '../components/ui/input.tsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card.tsx'
import { Loader2, AlertCircle, UtensilsCrossed } from 'lucide-react'
import { cn } from '../../lib/utils.ts'

const STORAGE_KEYS = {
  MEALIE_URL: 'bonap-mealie-url',
  MEALIE_TOKEN: 'bonap-mealie-token',
}

export function AuthPage() {
  const [mealieUrl, setMealieUrl] = useState(
    () => localStorage.getItem(STORAGE_KEYS.MEALIE_URL) ?? '',
  )
  const [token, setToken] = useState(
    () => localStorage.getItem(STORAGE_KEYS.MEALIE_TOKEN) ?? '',
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const normalizedUrl = mealieUrl.replace(/\/+$/, '')

    try {
      const response = await fetch(`${normalizedUrl}/api/health`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error(
          response.status === 401
            ? 'Token invalide'
            : `Erreur serveur (${response.status})`,
        )
      }

      localStorage.setItem(STORAGE_KEYS.MEALIE_URL, normalizedUrl)
      localStorage.setItem(STORAGE_KEYS.MEALIE_TOKEN, token)

      window.__ENV__ = {
        VITE_MEALIE_URL: normalizedUrl,
        VITE_MEALIE_TOKEN: token,
      }

      navigate('/recipes')
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Impossible de se connecter',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[var(--radius-xl)] bg-primary/10">
            <UtensilsCrossed className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-1.5">
            <CardTitle className="text-2xl">Connexion Ã Mealie</CardTitle>
            <CardDescription>
              Entrez l'URL de votre instance Mealie et votre jeton d'accÃ¨s
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="mealie-url" className="text-sm font-medium">
                URL Mealie
              </label>
              <Input
                id="mealie-url"
                type="url"
                placeholder="https://mealie.example.com"
                value={mealieUrl}
                onChange={(e) => setMealieUrl(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="token" className="text-sm font-medium">
                Jeton d'accÃ¨s
              </label>
              <Input
                id="token"
                type="password"
                placeholder="Votre jeton API Mealie"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-[var(--radius-lg)] border border-destructive/20 bg-destructive/8 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>

          <p className={cn('mt-4 text-center text-xs text-muted-foreground')}>
            Le jeton est stockÃ© localement dans votre navigateur
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
