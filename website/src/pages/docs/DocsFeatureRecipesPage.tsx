import { UtensilsCrossed } from 'lucide-react'
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
