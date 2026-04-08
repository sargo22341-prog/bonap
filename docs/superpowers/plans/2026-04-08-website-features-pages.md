# Website Features Pages — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter une section "Fonctionnalités" au site de documentation Bonap avec 7 pages détaillées (une par feature), chacune avec son GIF de démo et une documentation fonctionnelle complète.

**Architecture:** Pages React statiques suivant exactement le pattern des pages docs existantes. Chaque page utilise les composants de `DocsComponents.tsx` (DocH1, DocH2, DocLead, Alert, InlineCode). La sidebar et les routes sont étendues pour inclure la nouvelle section.

**Tech Stack:** React 18, TypeScript strict, React Router v6, composants DocsComponents existants, GIFs dans `public/demo/`

---

## Fichiers

**Créés :**
- `website/src/pages/docs/DocsFeatureRecipesPage.tsx`
- `website/src/pages/docs/DocsFeaturePlanningPage.tsx`
- `website/src/pages/docs/DocsFeatureShoppingPage.tsx`
- `website/src/pages/docs/DocsFeatureStatsPage.tsx`
- `website/src/pages/docs/DocsFeatureSuggestionsPage.tsx`
- `website/src/pages/docs/DocsFeatureAssistantPage.tsx`
- `website/src/pages/docs/DocsFeatureThemePage.tsx`

**Modifiés :**
- `website/src/App.tsx` — 7 nouvelles routes sous `/docs/features/*`
- `website/src/components/docs/DocsSidebar.tsx` — groupe "Fonctionnalités"

---

## Composant réutilisable : DemoGif

Un composant inline dans chaque page (pas de fichier séparé — c'est 5 lignes) :

```tsx
function DemoGif({ src, alt }: { src: string; alt: string }) {
  return (
    <div style={{ margin: '1.5rem 0' }}>
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          borderRadius: '10px',
          border: '1px solid var(--border)',
          display: 'block',
        }}
      />
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
        {alt}
      </p>
    </div>
  )
}
```

---

## Task 1 — Sidebar + Routes

**Files:**
- Modify: `website/src/components/docs/DocsSidebar.tsx`
- Modify: `website/src/App.tsx`

- [ ] **Étape 1 : Ajouter le groupe "Fonctionnalités" dans DocsSidebar.tsx**

Dans le tableau `navGroups`, insérer après le groupe "Configuration" et avant "Extras" :

```tsx
import { BookOpen, Package, Settings, Puzzle, LayoutGrid, Menu, X } from 'lucide-react'

// Dans navGroups :
{
  label: 'Fonctionnalités',
  icon: <LayoutGrid size={14} />,
  items: [
    { label: 'Recettes', to: '/docs/features/recipes' },
    { label: 'Planning', to: '/docs/features/planning' },
    { label: 'Liste de courses', to: '/docs/features/shopping' },
    { label: 'Statistiques', to: '/docs/features/stats' },
    { label: 'Suggestions IA', to: '/docs/features/suggestions' },
    { label: 'Assistant IA', to: '/docs/features/assistant' },
    { label: 'Thème & personnalisation', to: '/docs/features/theme' },
  ],
},
```

- [ ] **Étape 2 : Ajouter les 7 routes dans App.tsx**

Importer les 7 pages en haut du fichier, puis ajouter les routes dans le bloc `<Route path="/docs" element={<DocsLayout />}>` :

```tsx
import DocsFeatureRecipesPage from './pages/docs/DocsFeatureRecipesPage'
import DocsFeaturePlanningPage from './pages/docs/DocsFeaturePlanningPage'
import DocsFeatureShoppingPage from './pages/docs/DocsFeatureShoppingPage'
import DocsFeatureStatsPage from './pages/docs/DocsFeatureStatsPage'
import DocsFeatureSuggestionsPage from './pages/docs/DocsFeatureSuggestionsPage'
import DocsFeatureAssistantPage from './pages/docs/DocsFeatureAssistantPage'
import DocsFeatureThemePage from './pages/docs/DocsFeatureThemePage'

// Dans <Route path="/docs" element={<DocsLayout />}> :
<Route path="features/recipes" element={<DocsFeatureRecipesPage />} />
<Route path="features/planning" element={<DocsFeaturePlanningPage />} />
<Route path="features/shopping" element={<DocsFeatureShoppingPage />} />
<Route path="features/stats" element={<DocsFeatureStatsPage />} />
<Route path="features/suggestions" element={<DocsFeatureSuggestionsPage />} />
<Route path="features/assistant" element={<DocsFeatureAssistantPage />} />
<Route path="features/theme" element={<DocsFeatureThemePage />} />
```

- [ ] **Étape 3 : Créer les 7 fichiers pages vides (stubs) pour que le build ne casse pas**

Chaque fichier retourne juste `<div>À venir</div>` — ils seront remplis dans les tâches suivantes.

- [ ] **Étape 4 : Vérifier que le build ne casse pas**

```bash
cd website && npm run build
```
Attendu : pas d'erreur TypeScript.

- [ ] **Étape 5 : Commit**

```bash
git add website/src/App.tsx website/src/components/docs/DocsSidebar.tsx website/src/pages/docs/DocsFeature*.tsx
git commit -m "feat(website): ajouter la section Fonctionnalités dans la sidebar et les routes"
```

---

## Task 2 — Page Recettes

**Files:**
- Modify: `website/src/pages/docs/DocsFeatureRecipesPage.tsx`

- [ ] **Étape 1 : Implémenter la page complète**

```tsx
import { UtensilsCrossed, Search, Filter, Plus, Edit } from 'lucide-react'
import { DocH1, DocH2, DocLead, Alert, InlineCode } from '../../components/docs/DocsComponents'

function DemoGif({ src, alt }: { src: string; alt: string }) {
  return (
    <div style={{ margin: '1.5rem 0' }}>
      <img src={src} alt={alt} style={{ width: '100%', borderRadius: '10px', border: '1px solid var(--border)', display: 'block' }} />
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>{alt}</p>
    </div>
  )
}

export default function DocsFeatureRecipesPage() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
          <UtensilsCrossed size={20} />
        </div>
        <DocH1>Recettes</DocH1>
      </div>

      <DocLead>
        Naviguez, filtrez et gérez l'intégralité de votre catalogue Mealie — avec recherche instantanée, filtres combinés et scroll infini.
      </DocLead>

      <DemoGif src="/demo/recettes.gif" alt="Navigation et filtrage des recettes dans Bonap" />

      <DocH2>Navigation et filtres</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
        La page Recettes affiche votre catalogue sous forme de grille. Le chargement est progressif : 50 recettes s'affichent au départ, et la page suivante se charge automatiquement quand vous approchez du bas (scroll infini).
      </p>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
        Les filtres disponibles :
      </p>
      <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 2 }}>
        <li><strong style={{ color: 'var(--text)' }}>Recherche textuelle</strong> — filtre sur le nom de la recette en temps réel</li>
        <li><strong style={{ color: 'var(--text)' }}>Catégories</strong> — sélection multiple, cumulative</li>
        <li><strong style={{ color: 'var(--text)' }}>Tags</strong> — sélection multiple</li>
        <li><strong style={{ color: 'var(--text)' }}>Durée maximale</strong> — filtre sur le temps total (préparation + cuisson)</li>
        <li><strong style={{ color: 'var(--text)' }}>Saison</strong> — printemps, été, automne, hiver</li>
      </ul>
      <Alert type="info">
        Le filtrage par saison se fait côté client : Bonap cherche les recettes qui ont un tag <InlineCode>saison-printemps</InlineCode>, <InlineCode>saison-ete</InlineCode>, <InlineCode>saison-automne</InlineCode> ou <InlineCode>saison-hiver</InlineCode>. Ces tags sont gérés automatiquement depuis le formulaire de recette.
      </Alert>

      <DocH2>Détail d'une recette</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
        Un clic sur une carte ouvre le détail complet : ingrédients avec quantités et unités résolues, instructions étape par étape, saisons, catégories et durées. Depuis cette vue, vous pouvez :
      </p>
      <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 2 }}>
        <li>Ajouter la recette au planning (choix de la date et du créneau)</li>
        <li>Ajouter les ingrédients à la liste de courses</li>
        <li>Accéder au formulaire d'édition</li>
      </ul>

      <DocH2>Créer ou modifier une recette</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
        Le formulaire recette couvre tous les champs Mealie :
      </p>
      <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 2 }}>
        <li><strong style={{ color: 'var(--text)' }}>Nom, description</strong></li>
        <li><strong style={{ color: 'var(--text)' }}>Durées</strong> — saisies en minutes, converties automatiquement en ISO 8601 pour Mealie</li>
        <li><strong style={{ color: 'var(--text)' }}>Ingrédients</strong> — avec autocomplete sur les aliments et unités existants dans Mealie</li>
        <li><strong style={{ color: 'var(--text)' }}>Instructions</strong> — étape par étape</li>
        <li><strong style={{ color: 'var(--text)' }}>Saisons</strong> — sélecteur multi-saisons</li>
        <li><strong style={{ color: 'var(--text)' }}>Catégories et tags</strong></li>
        <li><strong style={{ color: 'var(--text)' }}>Image</strong> — upload direct</li>
      </ul>
      <Alert type="tip">
        Si vous saisissez un aliment qui n'existe pas encore dans Mealie, Bonap le crée automatiquement au moment de la sauvegarde. Les unités, en revanche, doivent déjà exister — si une unité est inconnue, l'ingrédient est enregistré sans unité.
      </Alert>
    </div>
  )
}
```

- [ ] **Étape 2 : Commit**

```bash
git add website/src/pages/docs/DocsFeatureRecipesPage.tsx
git commit -m "feat(website): ajouter la page documentation Recettes"
```

---

## Task 3 — Page Planning

**Files:**
- Modify: `website/src/pages/docs/DocsFeaturePlanningPage.tsx`

- [ ] **Étape 1 : Implémenter la page complète**

```tsx
import { CalendarDays } from 'lucide-react'
import { DocH1, DocH2, DocLead, Alert, InlineCode } from '../../components/docs/DocsComponents'

function DemoGif({ src, alt }: { src: string; alt: string }) {
  return (
    <div style={{ margin: '1.5rem 0' }}>
      <img src={src} alt={alt} style={{ width: '100%', borderRadius: '10px', border: '1px solid var(--border)', display: 'block' }} />
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>{alt}</p>
    </div>
  )
}

export default function DocsFeaturePlanningPage() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
          <CalendarDays size={20} />
        </div>
        <DocH1>Planning</DocH1>
      </div>

      <DocLead>
        Organisez vos repas de la semaine avec un calendrier déjeuner/dîner, navigable et préchargé.
      </DocLead>

      <DemoGif src="/demo/planning.gif" alt="Planning hebdomadaire avec ajout et suppression de repas" />

      <DocH2>Vue calendrier</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
        Le planning affiche une fenêtre glissante de jours avec deux créneaux par colonne : <strong style={{ color: 'var(--text)' }}>Déjeuner</strong> et <strong style={{ color: 'var(--text)' }}>Dîner</strong>. Vous pouvez choisir d'afficher 3, 5 ou 7 jours simultanément selon votre préférence.
      </p>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
        La navigation utilise les flèches gauche/droite pour avancer ou reculer d'une fenêtre complète. Le planning charge automatiquement les données ±14 jours autour de la fenêtre visible — si vous revenez sur une période déjà consultée, aucun appel réseau n'est effectué.
      </p>

      <DocH2>Ajouter un repas</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
        Cliquez sur le bouton <strong style={{ color: 'var(--text)' }}>+</strong> dans n'importe quelle case pour ouvrir le sélecteur de recette. Vous pouvez rechercher par nom parmi toutes vos recettes Mealie, puis confirmer l'ajout. La case se met à jour immédiatement.
      </p>

      <DocH2>Supprimer un repas</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
        Survolez un repas planifié pour faire apparaître la croix de suppression. La suppression est immédiate et synchronisée avec Mealie.
      </p>

      <DocH2>Envoyer à la liste de courses</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
        Le bouton <strong style={{ color: 'var(--text)' }}>Ajouter à la liste</strong> (en haut de la page) envoie les ingrédients de toutes les recettes visibles dans la fenêtre courante vers votre liste de courses Bonap. Les quantités sont cumulées si un même aliment apparaît dans plusieurs recettes.
      </p>

      <Alert type="info">
        Le planning est synchronisé avec Mealie en temps réel. Toute modification faite dans Bonap est immédiatement visible dans l'interface native Mealie, et vice-versa.
      </Alert>
    </div>
  )
}
```

- [ ] **Étape 2 : Commit**

```bash
git add website/src/pages/docs/DocsFeaturePlanningPage.tsx
git commit -m "feat(website): ajouter la page documentation Planning"
```

---

## Task 4 — Page Liste de courses

**Files:**
- Modify: `website/src/pages/docs/DocsFeatureShoppingPage.tsx`

- [ ] **Étape 1 : Implémenter la page complète**

```tsx
import { ShoppingCart } from 'lucide-react'
import { DocH1, DocH2, DocLead, Alert, InlineCode } from '../../components/docs/DocsComponents'

function DemoGif({ src, alt }: { src: string; alt: string }) {
  return (
    <div style={{ margin: '1.5rem 0' }}>
      <img src={src} alt={alt} style={{ width: '100%', borderRadius: '10px', border: '1px solid var(--border)', display: 'block' }} />
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>{alt}</p>
    </div>
  )
}

export default function DocsFeatureShoppingPage() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
          <ShoppingCart size={20} />
        </div>
        <DocH1>Liste de courses</DocH1>
      </div>

      <DocLead>
        Une liste de courses intelligente, auto-remplie depuis votre planning, avec mémorisation des étiquettes par aliment.
      </DocLead>

      <DemoGif src="/demo/courses.gif" alt="Liste de courses avec étiquettes et liste Habituels" />

      <DocH2>Deux listes</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
        Bonap gère deux listes simultanément, accessibles par onglets :
      </p>
      <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 2 }}>
        <li><strong style={{ color: 'var(--text)' }}>Bonap</strong> — votre liste principale, remplie depuis le planning ou manuellement</li>
        <li><strong style={{ color: 'var(--text)' }}>Habituels</strong> — items permanents à ne jamais oublier (sel, huile, etc.)</li>
      </ul>
      <Alert type="info">
        Les deux listes sont créées automatiquement dans Mealie au premier accès si elles n'existent pas encore. Vous les retrouvez aussi dans l'interface native Mealie.
      </Alert>

      <DocH2>Étiquettes (labels)</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
        Les items sont regroupés par <strong style={{ color: 'var(--text)' }}>étiquette</strong> (label Mealie) dans l'affichage : Fruits & Légumes, Épicerie, Produits frais, etc. Les étiquettes sont définies dans Mealie et synchronisées automatiquement.
      </p>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
        <strong style={{ color: 'var(--text)' }}>Mémorisation automatique :</strong> quand vous assignez une étiquette à un aliment, Bonap mémorise cette association localement. La prochaine fois que cet aliment est ajouté (depuis le planning ou manuellement), son étiquette est pré-assignée automatiquement — sans intervention de votre part.
      </p>

      <DocH2>Ajouter des items</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
        Deux façons d'ajouter des items :
      </p>
      <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 2 }}>
        <li><strong style={{ color: 'var(--text)' }}>Depuis le planning</strong> — bouton "Ajouter à la liste" sur la page Planning. Tous les ingrédients des recettes de la semaine sont ajoutés en masse, avec cumul des quantités si un aliment est présent dans plusieurs recettes.</li>
        <li><strong style={{ color: 'var(--text)' }}>Manuellement</strong> — champ de saisie libre avec quantité et étiquette optionnelles. Si l'aliment est déjà dans la liste, sa quantité est incrémentée plutôt que d'ajouter un doublon.</li>
      </ul>

      <DocH2>Cocher et vider</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
        Cochez les items au fur et à mesure de vos achats — l'état est synchronisé avec Mealie en temps réel. Une fois vos courses terminées :
      </p>
      <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 2 }}>
        <li><strong style={{ color: 'var(--text)' }}>Vider les cochés</strong> — supprime uniquement les items cochés</li>
        <li><strong style={{ color: 'var(--text)' }}>Tout vider</strong> — remet la liste à zéro</li>
      </ul>
    </div>
  )
}
```

- [ ] **Étape 2 : Commit**

```bash
git add website/src/pages/docs/DocsFeatureShoppingPage.tsx
git commit -m "feat(website): ajouter la page documentation Liste de courses"
```

---

## Task 5 — Page Statistiques

**Files:**
- Modify: `website/src/pages/docs/DocsFeatureStatsPage.tsx`

- [ ] **Étape 1 : Implémenter la page complète**

```tsx
import { BarChart3 } from 'lucide-react'
import { DocH1, DocH2, DocLead, Alert } from '../../components/docs/DocsComponents'

function DemoGif({ src, alt }: { src: string; alt: string }) {
  return (
    <div style={{ margin: '1.5rem 0' }}>
      <img src={src} alt={alt} style={{ width: '100%', borderRadius: '10px', border: '1px solid var(--border)', display: 'block' }} />
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>{alt}</p>
    </div>
  )
}

export default function DocsFeatureStatsPage() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
          <BarChart3 size={20} />
        </div>
        <DocH1>Statistiques</DocH1>
      </div>

      <DocLead>
        Analysez vos habitudes alimentaires : top recettes, streak de planification, pourcentage de restes et couverture de votre catalogue.
      </DocLead>

      <DemoGif src="/demo/stats.gif" alt="Tableau de bord des statistiques de planning" />

      <DocH2>Sélecteur de période</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
        Toutes les statistiques sont calculées sur la période choisie : <strong style={{ color: 'var(--text)' }}>30 jours</strong>, <strong style={{ color: 'var(--text)' }}>90 jours</strong> ou <strong style={{ color: 'var(--text)' }}>12 mois</strong> glissants à partir d'aujourd'hui.
      </p>

      <DocH2>Top recettes</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
        Classement des recettes par fréquence d'apparition dans votre planning sur la période. Utile pour identifier vos plats fétiches — et ceux que vous avez peut-être oubliés.
      </p>

      <DocH2>Top ingrédients</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
        Agrégation de tous les ingrédients des recettes planifiées sur la période. Pratique pour anticiper vos achats récurrents ou identifier les aliments à toujours avoir en stock.
      </p>

      <DocH2>Streak</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
        Nombre de <strong style={{ color: 'var(--text)' }}>semaines consécutives</strong> avec au moins un repas planifié chaque jour. La streak se réinitialise à la première semaine incomplète.
      </p>

      <DocH2>Pourcentage de restes</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
        Bonap détecte automatiquement les "restes" : quand la même recette apparaît sur deux créneaux consécutifs (ex: dîner lundi + déjeuner mardi), le second créneau est comptabilisé comme un reste. Ce pourcentage vous indique quelle part de vos repas sont issus de la veille.
      </p>

      <DocH2>Couverture catalogue</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
        Pourcentage de recettes de votre catalogue Mealie qui ont été planifiées au moins une fois sur la période. Un faible pourcentage signifie que vous avez beaucoup de recettes inexploitées — les Suggestions IA peuvent vous aider à les redécouvrir.
      </p>

      <Alert type="tip">
        Utilisez les statistiques conjointement avec la page Suggestions IA pour trouver des recettes que vous n'avez pas cuisinées depuis longtemps.
      </Alert>
    </div>
  )
}
```

- [ ] **Étape 2 : Commit**

```bash
git add website/src/pages/docs/DocsFeatureStatsPage.tsx
git commit -m "feat(website): ajouter la page documentation Statistiques"
```

---

## Task 6 — Page Suggestions IA

**Files:**
- Modify: `website/src/pages/docs/DocsFeatureSuggestionsPage.tsx`

- [ ] **Étape 1 : Implémenter la page complète**

```tsx
import { Lightbulb } from 'lucide-react'
import { DocH1, DocH2, DocLead, Alert, InlineCode } from '../../components/docs/DocsComponents'
import { Link } from 'react-router-dom'

function DemoGif({ src, alt }: { src: string; alt: string }) {
  return (
    <div style={{ margin: '1.5rem 0' }}>
      <img src={src} alt={alt} style={{ width: '100%', borderRadius: '10px', border: '1px solid var(--border)', display: 'block' }} />
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>{alt}</p>
    </div>
  )
}

export default function DocsFeatureSuggestionsPage() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
          <Lightbulb size={20} />
        </div>
        <DocH1>Suggestions IA</DocH1>
      </div>

      <DocLead>
        Laissez l'IA parcourir votre catalogue et proposer 5 recettes adaptées à vos critères du moment.
      </DocLead>

      <DemoGif src="/demo/suggestions.gif" alt="Génération de suggestions IA depuis le catalogue Mealie" />

      <DocH2>Comment ça fonctionne</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
        Bonap envoie votre catalogue complet au modèle IA configuré, accompagné des critères que vous avez définis. Le modèle sélectionne 5 recettes parmi les vôtres et fournit pour chacune un nom, une courte description et une justification (pourquoi cette recette correspond à vos critères).
      </p>
      <Alert type="warning">
        Les suggestions sont toujours choisies parmi vos recettes existantes dans Mealie — l'IA ne crée pas de nouvelles recettes. Si votre catalogue est vide ou très limité, les suggestions seront peu variées.
      </Alert>

      <DocH2>Critères de sélection</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
        Deux types de critères sont combinés :
      </p>
      <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 2 }}>
        <li><strong style={{ color: 'var(--text)' }}>Critères prédéfinis</strong> — saison actuelle, durée maximale, catégories préférées. Ces critères sont cochables rapidement sans saisie.</li>
        <li><strong style={{ color: 'var(--text)' }}>Texte libre</strong> — un champ pour exprimer des contraintes spécifiques : "recettes sans gluten", "plats à préparer à l'avance", "cuisine asiatique légère", etc.</li>
      </ul>

      <DocH2>Ajouter au planning</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
        Chaque suggestion affiche un bouton <strong style={{ color: 'var(--text)' }}>Ajouter au planning</strong> qui ouvre un sélecteur de date et créneau (déjeuner/dîner). La recette est planifiée en un clic, sans quitter la page.
      </p>

      <DocH2>Providers IA supportés</DocH2>
      <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 2 }}>
        <li><strong style={{ color: 'var(--text)' }}>Anthropic</strong> (Claude) — recommandé</li>
        <li><strong style={{ color: 'var(--text)' }}>OpenAI</strong> (GPT-4o, etc.)</li>
        <li><strong style={{ color: 'var(--text)' }}>Google Gemini</strong></li>
        <li><strong style={{ color: 'var(--text)' }}>Ollama</strong> — modèles locaux, aucune donnée envoyée sur internet</li>
      </ul>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginTop: '0.75rem' }}>
        La configuration du provider se fait dans{' '}
        <Link to="/docs/configuration/llm" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
          Configuration → IA / LLM
        </Link>.
      </p>
    </div>
  )
}
```

- [ ] **Étape 2 : Commit**

```bash
git add website/src/pages/docs/DocsFeatureSuggestionsPage.tsx
git commit -m "feat(website): ajouter la page documentation Suggestions IA"
```

---

## Task 7 — Page Assistant IA

**Files:**
- Modify: `website/src/pages/docs/DocsFeatureAssistantPage.tsx`

- [ ] **Étape 1 : Implémenter la page complète**

```tsx
import { Sparkles } from 'lucide-react'
import { DocH1, DocH2, DocLead, Alert, InlineCode } from '../../components/docs/DocsComponents'
import { Link } from 'react-router-dom'

function DemoGif({ src, alt }: { src: string; alt: string }) {
  return (
    <div style={{ margin: '1.5rem 0' }}>
      <img src={src} alt={alt} style={{ width: '100%', borderRadius: '10px', border: '1px solid var(--border)', display: 'block' }} />
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>{alt}</p>
    </div>
  )
}

export default function DocsFeatureAssistantPage() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
          <Sparkles size={20} />
        </div>
        <DocH1>Assistant IA</DocH1>
      </div>

      <DocLead>
        Un assistant conversationnel flottant qui peut chercher, planifier et créer des recettes directement depuis le chat.
      </DocLead>

      <DemoGif src="/demo/ia.gif" alt="Assistant IA avec streaming et tool use" />

      <DocH2>Accès</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
        Le bouton <strong style={{ color: 'var(--text)' }}>✦</strong> (Sparkles) en bas à droite de l'écran ouvre le drawer de l'assistant. Il est accessible depuis toutes les pages de Bonap — vous n'avez pas besoin de quitter ce que vous faites pour interagir avec lui.
      </p>

      <DocH2>Conversation et streaming</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
        L'assistant maintient un historique de la conversation pendant votre session. Avec Anthropic, les réponses s'affichent <strong style={{ color: 'var(--text)' }}>en streaming</strong> — les mots apparaissent au fur et à mesure, sans attente. L'historique est conservé tant que le drawer reste ouvert.
      </p>

      <DocH2>Actions disponibles (tool use)</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
        Avec Anthropic, l'assistant peut effectuer des actions réelles dans Bonap :
      </p>
      <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 2 }}>
        <li>
          <strong style={{ color: 'var(--text)' }}>Chercher une recette</strong> — "trouve-moi une recette avec des courgettes". L'assistant interroge votre catalogue Mealie et affiche les résultats dans le chat.
        </li>
        <li>
          <strong style={{ color: 'var(--text)' }}>Ajouter au planning</strong> — "planifie des pâtes carbonara mercredi soir". L'assistant cherche la recette et l'ajoute directement à la date et au créneau demandés.
        </li>
        <li>
          <strong style={{ color: 'var(--text)' }}>Créer une recette</strong> — "crée une recette de tarte aux pommes avec les ingrédients suivants…". L'assistant crée la recette dans Mealie avec les informations fournies.
        </li>
      </ul>
      <Alert type="warning">
        Le tool use (actions réelles) est disponible uniquement avec le provider <strong>Anthropic</strong>. Avec OpenAI, Google ou Ollama, l'assistant répond en texte mais ne peut pas interagir avec vos données.
      </Alert>

      <DocH2>Configuration</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
        Le provider et le modèle utilisés sont ceux configurés dans{' '}
        <Link to="/docs/configuration/llm" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
          Configuration → IA / LLM
        </Link>. L'assistant et les Suggestions IA partagent la même configuration.
      </p>
    </div>
  )
}
```

- [ ] **Étape 2 : Commit**

```bash
git add website/src/pages/docs/DocsFeatureAssistantPage.tsx
git commit -m "feat(website): ajouter la page documentation Assistant IA"
```

---

## Task 8 — Page Thème & personnalisation

**Files:**
- Modify: `website/src/pages/docs/DocsFeatureThemePage.tsx`

- [ ] **Étape 1 : Implémenter la page complète**

```tsx
import { Palette } from 'lucide-react'
import { DocH1, DocH2, DocLead, Alert, InlineCode } from '../../components/docs/DocsComponents'

const accentColors = [
  { name: 'Rouge', value: 'oklch(0.62 0.22 22)' },
  { name: 'Orange', value: 'oklch(0.72 0.18 55)' },
  { name: 'Jaune', value: 'oklch(0.80 0.16 85)' },
  { name: 'Vert', value: 'oklch(0.65 0.18 145)' },
  { name: 'Cyan', value: 'oklch(0.68 0.15 195)' },
  { name: 'Bleu', value: 'oklch(0.60 0.20 240)' },
  { name: 'Violet', value: 'oklch(0.58 0.22 290)' },
  { name: 'Rose', value: 'oklch(0.65 0.20 345)' },
]

export default function DocsFeatureThemePage() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
          <Palette size={20} />
        </div>
        <DocH1>Thème & personnalisation</DocH1>
      </div>

      <DocLead>
        Choisissez entre mode clair, sombre ou système, et personnalisez la couleur d'accent de l'interface.
      </DocLead>

      <DocH2>Mode d'affichage</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
        Trois modes disponibles dans <strong style={{ color: 'var(--text)' }}>Paramètres → Thème</strong> :
      </p>
      <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 2 }}>
        <li><strong style={{ color: 'var(--text)' }}>Clair</strong> — interface toujours claire</li>
        <li><strong style={{ color: 'var(--text)' }}>Sombre</strong> — interface toujours sombre</li>
        <li><strong style={{ color: 'var(--text)' }}>Système</strong> — suit automatiquement les préférences de votre OS (par défaut)</li>
      </ul>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
        Le mode est persisté dans le navigateur (<InlineCode>localStorage</InlineCode>) et s'applique immédiatement sans rechargement.
      </p>

      <DocH2>Couleur d'accent</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1rem' }}>
        8 couleurs d'accent prédéfinies, visibles dans les boutons, liens actifs, badges et indicateurs de l'interface :
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {accentColors.map((c) => (
          <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: c.value, border: '1px solid var(--border)', flexShrink: 0 }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{c.name}</span>
          </div>
        ))}
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
        La couleur choisie est appliquée via la propriété CSS <InlineCode>--color-primary</InlineCode> et persiste entre les sessions.
      </p>

      <DocH2>Où configurer</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
        Accédez à <strong style={{ color: 'var(--text)' }}>Paramètres</strong> (icône engrenage dans la sidebar) pour changer le thème et la couleur d'accent. Les modifications sont appliquées en temps réel sur toute l'interface.
      </p>

      <Alert type="info">
        Les préférences de thème et de couleur sont stockées localement dans votre navigateur. Elles ne sont pas synchronisées entre appareils.
      </Alert>
    </div>
  )
}
```

- [ ] **Étape 2 : Commit**

```bash
git add website/src/pages/docs/DocsFeatureThemePage.tsx
git commit -m "feat(website): ajouter la page documentation Thème et personnalisation"
```

---

## Task 9 — Build final + PR

- [ ] **Étape 1 : Vérifier le build complet**

```bash
cd website && npm run build
```
Attendu : aucune erreur TypeScript, aucun warning bloquant.

- [ ] **Étape 2 : Pusher la branche et créer la PR**

```bash
git push -u origin feat/website-features-docs
gh pr create --title "feat(website): ajouter la section Fonctionnalités dans la doc" --body "..."
```

---

## Self-review

- ✅ Spec coverage : 7 pages + sidebar + routes = tout couvert
- ✅ Pas de placeholder : tout le contenu est rédigé dans le plan
- ✅ Cohérence des noms : `DemoGif` défini localement dans chaque page (même signature partout)
- ✅ Imports : tous les composants utilisés (`DocH1`, `DocH2`, `DocLead`, `Alert`, `InlineCode`) sont dans `DocsComponents.tsx`
- ✅ Routes dans App.tsx correspondent exactement aux `to:` dans DocsSidebar
