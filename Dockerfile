# =============================================================================
# Stage 1 — Build
# =============================================================================
FROM node:24-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances en premier (meilleur cache Docker)
COPY package.json package-lock.json ./
RUN npm ci

# Copier le reste du code source
COPY . .

# Build Vite
# Les VITE_* sont des placeholders — l'injection runtime via window.__ENV__ les remplace.
# On ne passe pas les vraies valeurs ici pour que l'image soit générique et réutilisable.
RUN npm run build

# =============================================================================
# Stage 2 — Serve
# =============================================================================
FROM nginx:1.27-alpine AS runner

# Installer gettext pour envsubst (substitution de variables dans la config nginx)
RUN apk add --no-cache gettext

# Config nginx (template avec substitution de variables)
COPY nginx.conf /etc/nginx/templates/default.conf.template

# App statique issue du build
COPY --from=builder /app/dist /usr/share/nginx/html

# Script d'entrypoint : génère env-config.js et lance nginx
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
