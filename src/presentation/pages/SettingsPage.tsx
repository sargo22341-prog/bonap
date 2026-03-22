import { useState, useEffect } from "react"
import { Eye, EyeOff, CheckCircle2, XCircle, Loader2, Check, Sun, Moon, Monitor } from "lucide-react"
import { Button } from "../components/ui/button.tsx"
import { Input } from "../components/ui/input.tsx"
import { Label } from "../components/ui/label.tsx"
import { llmConfigService } from "../../infrastructure/llm/LLMConfigService.ts"
import type { LLMConfig, LLMProvider } from "../../shared/types/llm.ts"
import { LLM_PROVIDERS } from "../../shared/types/llm.ts"
import { useTheme } from "../hooks/useTheme.ts"
import { ACCENT_COLORS } from "../../infrastructure/theme/ThemeService.ts"
import type { Theme } from "../../infrastructure/theme/ThemeService.ts"

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

  // Auto-save on change
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
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="mt-1 text-sm text-muted-foreground">Configuration du fournisseur IA et des connexions.</p>
      </div>

      {/* Apparence Section */}
      <section className="space-y-6 rounded-lg border p-6">
        <div>
          <h2 className="text-base font-semibold">Apparence</h2>
          <p className="text-sm text-muted-foreground">Personnalisez l'aspect visuel de l'application.</p>
        </div>

        {/* Sélecteur de thème */}
        <div className="space-y-2">
          <Label>Thème</Label>
          <div className="flex gap-2">
            {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setTheme(value)}
                className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                  theme === value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input bg-background text-foreground hover:bg-accent"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Sélecteur de couleur principale */}
        <div className="space-y-2">
          <Label>Couleur principale</Label>
          <div className="flex flex-wrap gap-3">
            {ACCENT_COLORS.map((color) => (
              <button
                key={color.id}
                type="button"
                onClick={() => setAccentColor(color)}
                title={color.name}
                aria-label={color.name}
                className="relative h-8 w-8 rounded-full transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                style={{ backgroundColor: `oklch(${color.oklch})` }}
              >
                {accentColor.id === color.id && (
                  <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow" />
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Couleur sélectionnée : {accentColor.name}</p>
        </div>
      </section>

      {/* LLM Section */}
      <section className="space-y-6 rounded-lg border p-6">
        <div>
          <h2 className="text-base font-semibold">Fournisseur IA</h2>
          <p className="text-sm text-muted-foreground">Utilisé pour l'assistant, les suggestions et la vision. La clé est stockée localement dans votre navigateur.</p>
        </div>

        {/* Provider selector */}
        <div className="space-y-2">
          <Label>Fournisseur</Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(Object.keys(LLM_PROVIDERS) as LLMProvider[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handleProviderChange(p)}
                className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                  config.provider === p
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input bg-background text-foreground hover:bg-accent"
                }`}
              >
                {LLM_PROVIDERS[p].label}
              </button>
            ))}
          </div>
        </div>

        {/* API Key */}
        {providerInfo.needsKey && (
          <div className="space-y-2">
            <Label htmlFor="api-key">Clé API</Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showKey ? "text" : "password"}
                placeholder={`Clé ${providerInfo.label}`}
                value={config.apiKey}
                onChange={(e) => setConfig((prev) => ({ ...prev, apiKey: e.target.value }))}
                className="pr-10"
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

        {/* Ollama fields */}
        {config.provider === "ollama" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ollama-url">URL de l'instance Ollama</Label>
              <Input
                id="ollama-url"
                type="text"
                placeholder="http://localhost:11434"
                value={config.ollamaBaseUrl}
                onChange={(e) => setConfig((prev) => ({ ...prev, ollamaBaseUrl: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ollama-model">Modèle</Label>
              <Input
                id="ollama-model"
                type="text"
                placeholder="llama3.2, mistral, …"
                value={config.model}
                onChange={(e) => setConfig((prev) => ({ ...prev, model: e.target.value }))}
              />
            </div>
          </div>
        )}

        {/* Model selector */}
        {config.provider !== "ollama" && providerInfo.models.length > 0 && (
          <div className="space-y-2">
            <Label>Modèle</Label>
            <div className="flex flex-wrap gap-2">
              {providerInfo.models.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setConfig((prev) => ({ ...prev, model: m }))}
                  className={`rounded-md border px-3 py-1.5 text-xs font-mono transition-colors ${
                    config.model === m
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-input bg-background text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Test connection */}
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleTest}
            disabled={testStatus.state === "loading" || (!config.apiKey && providerInfo.needsKey) || (config.provider === "ollama" && !config.ollamaBaseUrl)}
            className="gap-1.5"
          >
            {testStatus.state === "loading" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Tester la connexion
          </Button>
          {testStatus.state === "ok" && (
            <span className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              {testStatus.message}
            </span>
          )}
          {testStatus.state === "error" && (
            <span className="flex items-center gap-1.5 text-sm text-destructive">
              <XCircle className="h-4 w-4" />
              {testStatus.message}
            </span>
          )}
          {saved && testStatus.state === "idle" && (
            <span className="text-xs text-muted-foreground">Sauvegardé</span>
          )}
        </div>
      </section>

      {/* Mealie section */}
      <section className="space-y-4 rounded-lg border p-6">
        <div>
          <h2 className="text-base font-semibold">Connexion Mealie</h2>
          <p className="text-sm text-muted-foreground">Variables d'environnement définies au démarrage de l'application (lecture seule).</p>
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">VITE_MEALIE_URL</Label>
            <Input
              readOnly
              value={(import.meta.env.VITE_MEALIE_URL as string) || "Non défini"}
              className="bg-muted font-mono text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">VITE_MEALIE_TOKEN</Label>
            <Input
              readOnly
              type="password"
              value={(import.meta.env.VITE_MEALIE_TOKEN as string) || "Non défini"}
              className="bg-muted font-mono text-xs"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
