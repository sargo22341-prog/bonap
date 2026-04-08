import { ShoppingCart } from 'lucide-react'
import { DocH1, DocH2, DocLead, Alert } from '../../components/docs/DocsComponents'

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
