export type LLMProvider = "anthropic" | "openai" | "google" | "ollama"

export interface LLMConfig {
  provider: LLMProvider
  apiKey: string
  model: string
  ollamaBaseUrl: string
}

export const DEFAULT_LLM_CONFIG: LLMConfig = {
  provider: "anthropic",
  apiKey: "",
  model: "claude-sonnet-4-6",
  ollamaBaseUrl: "http://localhost:11434",
}

export const LLM_PROVIDERS: Record<LLMProvider, { label: string; models: string[]; needsKey: boolean }> = {
  anthropic: {
    label: "Anthropic",
    models: ["claude-opus-4-6", "claude-sonnet-4-6", "claude-haiku-4-5-20251001"],
    needsKey: true,
  },
  openai: {
    label: "OpenAI",
    models: ["gpt-4o", "gpt-4o-mini", "o1-mini"],
    needsKey: true,
  },
  google: {
    label: "Google",
    models: ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"],
    needsKey: true,
  },
  ollama: {
    label: "Ollama (local)",
    models: [],
    needsKey: false,
  },
}
