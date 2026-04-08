import { CalendarDays } from 'lucide-react'
import { DocH1, DocH2, DocLead, Alert } from '../../components/docs/DocsComponents'

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
        Le planning affiche une fenêtre glissante de jours avec deux créneaux par colonne : <strong style={{ color: 'var(--text)' }}>Déjeuner</strong> et <strong style={{ color: 'var(--text)' }}>Dîner</strong>. Vous pouvez choisir d'afficher <strong style={{ color: 'var(--text)' }}>3, 5 ou 7 jours</strong> simultanément selon votre préférence.
      </p>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
        La navigation utilise les flèches gauche/droite pour avancer ou reculer d'une fenêtre complète. Le planning charge automatiquement les données <strong style={{ color: 'var(--text)' }}>±14 jours</strong> autour de la fenêtre visible — si vous revenez sur une période déjà consultée, aucun appel réseau n'est effectué.
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
