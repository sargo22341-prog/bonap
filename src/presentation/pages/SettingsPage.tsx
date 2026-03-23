import { useState, useEffect } from "react"
import { Eye, EyeOff, CheckCircle2, XCircle, Loader2, Check, Sun, Moon, Monitor, Palette, Bot, Server } from "lucide-react"
import { Button } from "../components/ui/button.tsx"
import { Input } from "../components/ui/input.tsx"
import { Label } from "../components/ui/label.tsx"
import { llmConfigService } from "../../infrastructure/llm/LLMConfigService.ts"
import type { LLMConfig, LLMProvider } from "../../shared/types/llm.ts"
import { LLM_PROVIDERS } from "../../shared/types/llm.ts"
import { useTheme } from "../hooks/useTheme.ts"
import { ACCENT_COLORS } from "../../infrastructure/theme/ThemeService.ts"
import type { Theme } from "../../infrastructure/theme/ThemeService.ts"
import { cn } from "../../lib/utils.ts"

type TestStatus = { state: "idle" } | { state: "loading" } | { state: "ok"; message: string } | { state: "error"; message: string }

const THEME_OPTIONS: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Clair", icon: Sun },
  { value: "dark", label: "Sombre", icon: Moon },
  { value: "system", label: "Système", icon: Monitor },
]

export function SettingsPage() {
  const { theme, setTheme, accentColor, setAccentColor } = useTheme()
  const [config, setConfig] = useState<LLMConfig>(() => llmConfigService.load())
  const [showKey, setShowKey] = useState(false)
  const [testStatus, setTestStatus] = useState<TestStatus>({ state: "idle" })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    llmConfigService.save(config)
    setSaved(true)
    const t = setTimeout(() => setSaved(false), 1500)
    return () => clearTimeout(t)
  }, [config])

  const providerInfo = LLM_PROVIDERS[config.provider]

  const handleProviderChange = (provider: LLMProvider) => {
    const info = LLM_PROVIDERS[provider]
    setConfig((prev) => ({
      ...prev,
      provider,
      model: info.models[0] ?? "",
    }))
    setTestStatus({ state: "idle" })
    setShowKey(false)
  }

  const handleTest = async () => {
    setTestStatus({ state: "loading" })
    const result = await llmConfigService.testConnection(config)
    setTestStatus(result.ok ? { state: "ok", message: result.message } : { state: "error", message: result.message })
  }

  return (
    <div className="max-w-2xl space-y-2">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold tracking-tight">Paramètres</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">Configuration de l'apparence et des connexions.</p>
      </div>

      {/* ── Section Apparence ── */}
      <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <Palette className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-bold">Apparence</h2>
            <p className="text-xs text-muted-foreground">Personnalisez l'aspect visuel de l'application.</p>
          </div>
        </div>

        {/* Sélecteur de thème */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Thème</Label>
          <div className="flex gap-2">
            {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setTheme(value)}
                className={cn(
                  "flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all",
                  theme === value
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-background text-foreground hover:bg-secondary",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Sélecteur de couleur principale */}
        <div className="space-y-3">
          <div>
            <Label className="text-sm font-semibold">Couleur principale</Label>
            <p className="text-xs text-muted-foreground mt-0.5">Couleur sélectionnée : <span className="font-medium">{accentColor.name}</span></p>
          </div>
          <div className="flex flex-wrap gap-3">
            {ACCENT_COLORS.map((color) => (
              <button
                key={color.id}
                type="button"
                onClick={() => setAccentColor(color)}
                title={color.name}
                aria-label={color.name}
                className={cn(
                  "relative h-9 w-9 rounded-full transition-all hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  accentColor.id === color.id && "ring-2 ring-offset-2 ring-foreground/30 scale-110",
                )}
                style={{ backgroundColor: `oklch(${color.oklch})` }}
              >
                {accentColor.id === color.id && (
                  <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow" />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section IA ── */}
      <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/30">
            <Bot className="h-4 w-4 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h2 className="text-base font-bold">Fournisseur IA</h2>
            <p className="text-xs text-muted-foreground">Utilisé pour l'assistant, les suggestions et la vision. La clé est stockée localement.</p>
          </div>
        </div>

        {/* Sélecteur de fournisseur */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Fournisseur</Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(Object.keys(LLM_PROVIDERS) as LLMProvider[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handleProviderChange(p)}
                className={cn(
                  "rounded-xl border px-3 py-2 text-sm font-semibold transition-all",
                  config.provider === p
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-background text-foreground hover:bg-secondary",
                )}
              >
                {LLM_PROVIDERS[p].label}
              </button>
            ))}
          </div>
        </div>

        {/* Clé API */}
        {providerInfo.needsKey && (
          <div className="space-y-2">
            <Label htmlFor="api-key" className="text-sm font-semibold">Clé API</Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showKey ? "text" : "password"}
                placeholder={`Clé ${providerInfo.label}`}
                value={config.apiKey}
                onChange={(e) => setConfig((prev) => ({ ...prev, apiKey: e.target.value }))}
                className="pr-10 rounded-xl"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showKey ? "Masquer la clé" : "Afficher la clé"}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}

        {/* Champs Ollama */}
        {config.provider === "ollama" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ollama-url" className="text-sm font-semibold">URL de l'instance Ollama</Label>
              <Input
                id="ollama-url"
                type="text"
                placeholder="http://localhost:11434"
                value={config.ollamaBaseUrl}
                onChange={(e) => setConfig((prev) => ({ ...prev, ollamaBaseUrl: e.target.value }))}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ollama-model" className="text-sm font-semibold">Modèle</Label>
              <Input
                id="ollama-model"
                type="text"
                placeholder="llama3.2, mistral, …"
                value={config.model}
                onChange={(e) => setConfig((prev) => ({ ...prev, model: e.target.value }))}
                className="rounded-xl"
              />
            </div>
          </div>
        )}

        {/* Sélecteur de modèle */}
        {config.provider !== "ollama" && providerInfo.models.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Modèle</Label>
            <div className="flex flex-wrap gap-2">
              {providerInfo.models.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setConfig((prev) => ({ ...prev, model: m }))}
                  className={cn(
                    "rounded-xl border px-3 py-1.5 text-xs font-mono font-semibold transition-all",
                    config.model === m
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Test de connexion */}
        <div className="flex items-center gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleTest}
            disabled={testStatus.state === "loading" || (!config.apiKey && providerInfo.needsKey) || (config.provider === "ollama" && !config.ollamaBaseUrl)}
            className="gap-1.5 rounded-xl"
          >
            {testStatus.state === "loading" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Tester la connexion
          </Button>
          {testStatus.state === "ok" && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              {testStatus.message}
            </span>
          )}
          {testStatus.state === "error" && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-destructive">
              <XCircle className="h-4 w-4" />
              {testStatus.message}
            </span>
          )}
          {saved && testStatus.state === "idle" && (
            <span className="text-xs text-muted-foreground">Sauvegardé</span>
          )}
        </div>
      </section>

      {/* ── Section Connexion Mealie ── */}
      <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
            <Server className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-bold">Connexion Mealie</h2>
            <p className="text-xs text-muted-foreground">Variables d'environnement (lecture seule).</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">VITE_MEALIE_URL</Label>
            <Input
              readOnly
              value={(import.meta.env.VITE_MEALIE_URL as string) || "Non défini"}
              className="bg-secondary/50 font-mono text-xs rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">VITE_MEALIE_TOKEN</Label>
            <Input
              readOnly
              type="password"
              value={(import.meta.env.VITE_MEALIE_TOKEN as string) || "Non défini"}
              className="bg-secondary/50 font-mono text-xs rounded-xl"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
