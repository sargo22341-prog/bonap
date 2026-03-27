/**
 * Variables d'environnement injectées au runtime via Docker (window.__ENV__).
 * Générées par docker-entrypoint.sh dans /usr/share/nginx/html/env-config.js.
 * En développement sans Docker, window.__ENV__ est undefined et l'app
 * retombe sur import.meta.env (variables Vite injectées au build).
 */
interface Window {
  __ENV__?: {
    VITE_MEALIE_URL?: string
    VITE_MEALIE_TOKEN?: string
  }
}
