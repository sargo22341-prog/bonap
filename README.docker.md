# Déploiement Docker — Bonap

Ce document explique comment déployer Bonap avec Docker.

---

## Prérequis

- Docker 24+ et Docker Compose v2

---

## Variables d'environnement

| Variable | Description | Exemple |
|---|---|---|
| `VITE_MEALIE_URL` | URL de Mealie **accessible depuis le navigateur** | `http://192.168.1.21:9000` |
| `VITE_MEALIE_TOKEN` | Token Bearer API Mealie (Profil → API Tokens) | `eyJ...` |
| `MEALIE_INTERNAL_URL` | *(optionnel)* URL interne pour le proxy nginx. Par défaut : `VITE_MEALIE_URL`. Utile en stack Docker où Mealie est joignable par son nom de service. | `http://mealie:9000` |

> Les variables `VITE_*` sont injectées au **démarrage du conteneur** (pas au build), ce qui permet d'utiliser la même image Docker pour différentes configurations sans rebuild.

---

## Mode 1 — Bonap seul (Mealie déjà installé ailleurs)

```bash
# Copier et adapter le fichier docker-compose.yml
cp docker-compose.yml docker-compose.override.yml

# Éditer les variables d'environnement
nano docker-compose.yml

# Lancer
docker compose up -d
```

L'application est disponible sur [http://localhost:3000](http://localhost:3000).

Exemple minimal :

```yaml
services:
  bonap:
    image: ghcr.io/votre-user/bonap:latest
    ports:
      - "3000:80"
    environment:
      - VITE_MEALIE_URL=http://192.168.1.21:9000
      - VITE_MEALIE_TOKEN=votre_token_api
```

---

## Mode 2 — Bonap + Mealie ensemble (stack complète)

```bash
docker compose -f docker-compose.full.yml up -d
```

**Étapes post-démarrage :**

1. Aller sur Mealie : [http://localhost:9000](http://localhost:9000)
2. Créer un compte administrateur
3. Aller dans **Profil → API Tokens** et générer un token
4. Mettre à jour `VITE_MEALIE_TOKEN` dans `docker-compose.full.yml`
5. Redémarrer Bonap : `docker compose -f docker-compose.full.yml restart bonap`

Bonap est disponible sur [http://localhost:3000](http://localhost:3000).

---

## Build de l'image localement

```bash
docker build -t bonap:local .

# Tester l'image
docker run -p 3000:80 \
  -e VITE_MEALIE_URL=http://192.168.1.21:9000 \
  -e VITE_MEALIE_TOKEN=votre_token \
  bonap:local
```

---

## Architecture nginx en production

En production Docker, nginx gère deux responsabilités :

1. **Servir les fichiers statiques** : `dist/` issu du build Vite
2. **Proxy `/api`** : redirige vers Mealie (via `MEALIE_INTERNAL_URL`) — évite les problèmes CORS

Cela remplace le proxy Vite qui n'existe qu'en développement.

```
Navigateur → :3000/api/* → nginx → Mealie (réseau Docker interne)
Navigateur → :3000/*    → nginx → dist/ (fichiers statiques)
```

---

## GitHub Actions — Publication sur GHCR

Une image est automatiquement publiée sur GitHub Container Registry à chaque push sur `main` :

```
ghcr.io/votre-user/bonap:latest
ghcr.io/votre-user/bonap:<sha>
```

Pour utiliser l'image publiée, remplacer `votre-user` par le nom d'utilisateur GitHub dans les fichiers `docker-compose*.yml`.
