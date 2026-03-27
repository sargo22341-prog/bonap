#!/bin/sh
set -e

# Génère /usr/share/nginx/html/env-config.js avec les variables d'environnement runtime.
# Ce fichier expose window.__ENV__ et permet de reconfigurer l'app sans rebuild de l'image.
#
# Variables supportées :
#   VITE_MEALIE_URL    — URL Mealie accessible depuis le navigateur (ex: http://mealie:9000)
#   VITE_MEALIE_TOKEN  — Token Bearer Mealie

cat > /usr/share/nginx/html/env-config.js <<EOF
window.__ENV__ = {
  VITE_MEALIE_URL: "${VITE_MEALIE_URL:-}",
  VITE_MEALIE_TOKEN: "${VITE_MEALIE_TOKEN:-}"
};
EOF

# MEALIE_INTERNAL_URL : URL interne pour le proxy nginx /api → mealie.
# Par défaut, on réutilise VITE_MEALIE_URL si MEALIE_INTERNAL_URL n'est pas défini.
export MEALIE_INTERNAL_URL="${MEALIE_INTERNAL_URL:-${VITE_MEALIE_URL:-http://mealie:9000}}"
# Retirer le slash final si présent
MEALIE_INTERNAL_URL="${MEALIE_INTERNAL_URL%/}"
export MEALIE_INTERNAL_URL

# Substituer les variables dans la config nginx
envsubst '${MEALIE_INTERNAL_URL}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

exec nginx -g "daemon off;"
