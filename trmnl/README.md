# Bonap — Plugins TRMNL

Deux templates [Liquid](https://shopify.github.io/liquid/) pour afficher le planning repas Mealie sur un écran [TRMNL](https://usetrmnl.com) (BYOS ou cloud).

---

## Templates disponibles

| Fichier | Description |
|---|---|
| `planning-3days.html` | Planning sur 3 jours (aujourd'hui + 2 suivants) |
| `next-meal.html` | Prochain repas avec photo, ingrédients et étapes |

---

## Comment ça marche

TRMNL affiche du HTML généré depuis un template Liquid. Les variables du template (`{{ name }}`, `{{ days[0].lunch }}`, etc.) sont remplies par un **payload JSON** que TRMNL récupère via une URL polling (webhook push ou polling HTTP).

Puisque l'API Mealie nécessite une authentification et renvoie des données brutes qu'il faut transformer (grouper par jour, trouver le prochain repas), **tu dois exposer un endpoint intermédiaire** qui fait ce travail et renvoie le JSON attendu.

---

## Option 1 — Script de push webhook (recommandé)

TRMNL supporte les webhooks push : ton script appelle l'API Mealie, transforme les données, puis les pousse vers l'URL webhook de ton plugin TRMNL.

### Exemple Node.js

```js
// push-trmnl.js
// Variables à configurer :
const MEALIE_URL = "http://mealie.local:9000"
const MEALIE_TOKEN = "ton_token_mealie"
const TRMNL_WEBHOOK_URL = "https://usetrmnl.com/api/custom_plugins/VOTRE_UUID"

async function run() {
  const today = new Date()
  const in3days = new Date(today)
  in3days.setDate(today.getDate() + 3)

  const fmt = (d) => d.toISOString().split("T")[0]

  // Récupère le planning Mealie
  const res = await fetch(
    `${MEALIE_URL}/api/households/mealplans?page=1&perPage=-1&start_date=${fmt(today)}&end_date=${fmt(in3days)}`,
    { headers: { Authorization: `Bearer ${MEALIE_TOKEN}` } }
  )
  const { items } = await res.json()

  // --- Template 1 : planning-3days ---
  const DAYS_FR = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]
  const MONTHS_FR = ["jan.", "fév.", "mars", "avr.", "mai", "juin", "juil.", "août", "sep.", "oct.", "nov.", "déc."]

  const dayMap = {}
  for (const item of items) {
    if (!dayMap[item.date]) dayMap[item.date] = { lunch: null, dinner: null }
    const name = item.recipe?.name ?? item.title ?? null
    if (item.entryType === "lunch") dayMap[item.date].lunch = name
    if (item.entryType === "dinner") dayMap[item.date].dinner = name
  }

  const days = [0, 1, 2].map((offset) => {
    const d = new Date(today)
    d.setDate(today.getDate() + offset)
    const key = fmt(d)
    const label = offset === 0 ? "Aujourd'hui" : offset === 1 ? "Demain" : DAYS_FR[d.getDay()]
    const date = `${DAYS_FR[d.getDay()].slice(0, 3)}. ${d.getDate()} ${MONTHS_FR[d.getMonth()]}`
    return { label, date, ...(dayMap[key] ?? { lunch: null, dinner: null }) }
  })

  const now = new Date()
  const last_update = `${String(now.getDate()).padStart(2,"0")}/${String(now.getMonth()+1).padStart(2,"0")} ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`

  await fetch(TRMNL_WEBHOOK_URL + "/planning", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ merge_variables: { days, last_update } })
  })

  // --- Template 2 : next-meal ---
  const hour = now.getHours()
  // Prochain créneau : déjeuner si avant 12h, dîner si avant 20h, sinon déjeuner demain
  let targetType, targetLabel, targetAt
  if (hour < 12) { targetType = "lunch"; targetLabel = "Déjeuner"; targetAt = "12:00" }
  else if (hour < 20) { targetType = "dinner"; targetLabel = "Dîner"; targetAt = "20:00" }
  else {
    targetType = "lunch"; targetLabel = "Déjeuner"; targetAt = "12:00 (demain)"
    // On cherche dans le jour suivant
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1)
    // Recharge si besoin — simplifié ici
  }

  const todayKey = fmt(today)
  const nextItem = items.find(i => i.date === todayKey && i.entryType === targetType)
    ?? items.find(i => i.entryType === targetType) // fallback : premier dispo

  let meal = { type: targetLabel, at: targetAt, name: "", image_url: "", ingredients: [], instructions: [], last_update }

  if (nextItem?.recipe) {
    const r = nextItem.recipe
    meal.name = r.name ?? ""
    meal.image_url = r.id ? `${MEALIE_URL}/api/media/recipes/${r.id}/images/min-original.webp` : ""
    meal.ingredients = (r.recipeIngredient ?? []).map(i => {
      const qty = i.quantity ? `${i.quantity} ` : ""
      const unit = i.unit?.name ? `${i.unit.name} ` : ""
      const food = i.food?.name ?? i.note ?? ""
      return `${qty}${unit}${food}`.trim()
    }).filter(Boolean)
    meal.instructions = (r.recipeInstructions ?? []).map(s => s.text).filter(Boolean)
  }

  await fetch(TRMNL_WEBHOOK_URL + "/next-meal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ merge_variables: meal })
  })

  console.log("✓ TRMNL mis à jour")
}

run().catch(console.error)
```

Lance ce script via un **cron** (ex: toutes les 30 min) :
```
*/30 * * * * node /chemin/push-trmnl.js
```

Ou via une **automatisation Home Assistant** (appel REST action).

---

## Option 2 — Polling direct depuis TRMNL

Si ton instance Mealie est accessible depuis internet (ou via Cloudflare Tunnel), TRMNL peut poller l'API directement.

> ⚠️ La transformation des données (grouper par jour, etc.) serait à faire entièrement en Liquid, ce qui est limité. Préférer l'Option 1.

---

## Variables à configurer

### `planning-3days.html`

| Variable | Type | Description |
|---|---|---|
| `days[n].label` | string | `"Aujourd'hui"`, `"Demain"`, ou nom du jour |
| `days[n].date` | string | Ex: `"Ven. 28 mars"` |
| `days[n].lunch` | string \| null | Nom de la recette déjeuner, ou `null` |
| `days[n].dinner` | string \| null | Nom de la recette dîner, ou `null` |
| `last_update` | string | Ex: `"28/03 10:30"` |

### `next-meal.html`

| Variable | Type | Description |
|---|---|---|
| `type` | string | `"Déjeuner"` ou `"Dîner"` |
| `at` | string | Heure du repas : `"12:00"` ou `"20:00"` |
| `name` | string | Nom de la recette |
| `image_url` | string | URL complète de l'image recette (auth incluse si nécessaire) |
| `ingredients` | string[] | Liste des ingrédients formatés : `"200 g farine"` |
| `instructions` | string[] | Liste des étapes (texte brut) |
| `last_update` | string | Ex: `"28/03 10:30"` |

> Si `name` est vide, le template affiche un écran "Aucun repas prévu".

---

## Installation dans TRMNL

1. Dans le dashboard TRMNL : **Plugins → Private Plugin → New**
2. Colle le contenu du fichier `.html` dans l'éditeur Liquid
3. Configure la **Strategy** :
   - **Webhook** (Option 1) : copie l'URL webhook générée, utilise-la dans ton script
   - **Polling** (Option 2) : entre l'URL de ton endpoint + header `Authorization: Bearer <token>`
4. Sauvegarde et assigne le plugin à ton device
