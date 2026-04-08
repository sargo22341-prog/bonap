# Design — Pages Fonctionnalités (website)

**Date** : 2026-04-08  
**Branche** : `feat/website-features-docs`  
**PR** : séparée, vers `main`

---

## Objectif

Ajouter une section "Fonctionnalités" au site de documentation Bonap (`website/`), avec une page dédiée par feature. Chaque page documente ce que l'utilisateur peut faire, les comportements non-évidents, et les points techniques utiles. Les GIFs de démo existants dans `public/demo/` sont intégrés en tête de chaque page.

---

## Structure

### Sidebar — nouvelle section

Positionnée entre "Configuration" et "Extras" dans `DocsSidebar.tsx` :

```
Fonctionnalités (icône: Sparkles ou LayoutGrid)
  ├── Recettes              → /docs/features/recipes
  ├── Planning              → /docs/features/planning
  ├── Liste de courses      → /docs/features/shopping
  ├── Statistiques          → /docs/features/stats
  ├── Suggestions IA        → /docs/features/suggestions
  ├── Assistant IA          → /docs/features/assistant
  └── Thème & personnalisation → /docs/features/theme
```

### Routes — App.tsx

7 nouvelles routes sous `/docs/features/*`, ajoutées dans `DocsLayout`.

### Fichiers créés

```
website/src/pages/docs/
  DocsFeatureRecipesPage.tsx
  DocsFeaturePlanningPage.tsx
  DocsFeatureShoppingPage.tsx
  DocsFeatureStatsPage.tsx
  DocsFeatureSuggestionsPage.tsx
  DocsFeatureAssistantPage.tsx
  DocsFeatureThemePage.tsx
```

---

## Template de page

Chaque page suit cette structure :

1. **Header** : icône Lucide + `DocH1` + `DocLead` (1 phrase d'accroche)
2. **GIF démo** : `<img>` pleine largeur, `border-radius: 10px`, `border: 1px solid var(--border)`, caption en dessous
3. **Sections fonctionnelles** (`DocH2`) : description détaillée des flux et comportements
4. **`Alert`** (warning/info) : comportements non-évidents ou pièges
5. **Points techniques** (si utiles à l'utilisateur final) : `InlineCode` pour les noms techniques

---

## Contenu par page

### Recettes (`recettes.gif`)
- Grille avec scroll infini (50 recettes/page, chargement auto au scroll)
- Filtres : recherche textuelle, catégories (multi-select), tags, durée max, saisons
- Saisons = tags Mealie avec préfixe `saison-` (printemps, été, automne, hiver) — filtrés côté client
- Détail recette : ingrédients résolus, instructions, saisons, catégories, bouton "Ajouter au planning" et "Ajouter à la liste de courses"
- Création/édition : formulaire complet (nom, description, durées en minutes, ingrédients avec autocomplete, instructions, saisons, catégories/tags, image)
- Résolution des ingrédients : les aliments sont créés automatiquement dans Mealie si absents ; les unités sont lookup only

### Planning (`planning.gif`)
- Fenêtre glissante configurable : 3, 5 ou 7 jours
- Deux créneaux par jour : déjeuner (lunch) et dîner (dinner)
- Ajout via RecipePicker (recherche + sélection)
- Navigation avec préchargement ±14j en cache mémoire (pas de re-fetch si déjà chargé)
- Suppression d'un repas par clic sur la croix
- Depuis la page Planning, bouton "Ajouter à la liste de courses" pour envoyer les ingrédients de la semaine

### Liste de courses (`courses.gif`)
- Deux listes gérées en parallèle : **Bonap** (liste principale) et **Habituels** (items permanents)
- Les listes sont auto-créées dans Mealie au premier accès si elles n'existent pas
- Items groupés par **étiquette (label)** dans l'affichage
- **FoodLabelStore** : mémorisation automatique du label par aliment (`food_key → labelId` en localStorage). Quand on ajoute un aliment déjà connu, son label est pré-assigné automatiquement
- Ajout manuel : note libre, quantité optionnelle, label optionnel
- Ajout depuis le planning : bouton qui envoie tous les ingrédients des recettes de la semaine (bulk)
- Incrémentation de quantité si un aliment identique est déjà présent (pas de doublon)
- Cocher/décocher un item (synchronisé avec Mealie)
- Vider les cochés ou tout vider
- Onglet Habituels : mêmes actions, pour gérer des items récurrents

### Statistiques (`stats.gif`)
- Sélecteur de période : 30 jours, 90 jours, 12 mois
- **Top recettes** : classement par fréquence d'apparition dans le planning
- **Top ingrédients** : agrégation des ingrédients sur la période
- **Streak** : nombre de semaines consécutives avec un planning complet
- **% de restes** : détection automatique — même recette sur 2 créneaux consécutifs = "restes"
- **Couverture catalogue** : % de recettes utilisées au moins une fois sur la période

### Suggestions IA (`suggestions.gif`)
- Génère 5 suggestions de recettes selon des critères
- Critères prédéfinis : saison courante, durée max, catégorie préférée, etc.
- Champ texte libre pour des critères custom ("recettes végétariennes rapides")
- Retourne des suggestions avec nom + description + justification
- Providers supportés : Anthropic, OpenAI, Google Gemini, Ollama (local)
- Ajout direct d'une suggestion au planning depuis l'interface

### Assistant IA (`ia.gif`)
- Drawer flottant (bouton Sparkles en bas à droite, accessible depuis toutes les pages)
- Chat conversationnel multi-turn avec historique de session
- **Streaming** : réponse affichée en temps réel (Anthropic uniquement)
- **Tool use** (Anthropic uniquement) :
  - `search_recipe` : recherche de recettes par mots-clés
  - `add_to_planning` : ajoute une recette à une date/créneau
  - `create_recipe` : crée une recette dans Mealie
- Autres providers (OpenAI, Google, Ollama) : fallback sans streaming ni tools

### Thème & personnalisation (placeholder — pas de GIF)
- Mode **light / dark / system** (suit les préférences OS)
- **8 couleurs d'accent** prédéfinies en oklch (rouge, orange, jaune, vert, cyan, bleu, violet, rose)
- Persistance dans localStorage (`bonap_theme`, `bonap_accent`)
- La couleur est appliquée via la CSS custom property `--color-primary`
- Accessible depuis la page Paramètres (`/settings`)

---

## Fichiers modifiés

- `website/src/App.tsx` — ajout de 7 routes
- `website/src/components/docs/DocsSidebar.tsx` — ajout du groupe "Fonctionnalités"

---

## Branche & PR

- Branche : `feat/website-features-docs`
- PR vers : `main`
- Aucune dépendance avec les autres branches en cours
