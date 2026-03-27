/**
 * Lit une variable d'environnement en prenant en priorité window.__ENV__
 * (injection runtime Docker via docker-entrypoint.sh) puis import.meta.env
 * (variables Vite injectées au build).
 *
 * Cela permet d'utiliser une image Docker générique sans rebuild à chaque
 * changement de configuration.
 */
export function getEnv(key: keyof NonNullable<Window["__ENV__"]>): string {
  if (typeof window !== "undefined" && window.__ENV__?.[key]) {
    return window.__ENV__[key]!
  }
  return (import.meta.env[key] as string) ?? ""
}

/**
 * Indique si l'app tourne dans un conteneur Docker (env-config.js chargé).
 * En dev Vite et en prod sans Docker, window.__ENV__ est undefined.
 */
export function isDockerRuntime(): boolean {
  return typeof window !== "undefined" && window.__ENV__ !== undefined
}

/**
 * Retourne le préfixe de path HA ingress si l'app est servie via HA Supervisor
 * (ex: "/api/hassio_ingress/abc123"), sinon "".
 * Permet de préfixer les appels API pour qu'ils passent par le proxy nginx de l'addon.
 */
export function getIngressBasename(): string {
  if (typeof window === "undefined") return ""
  const match = window.location.pathname.match(/^(\/api\/hassio_ingress\/[^/]+)/)
  return match ? match[1] : ""
}
