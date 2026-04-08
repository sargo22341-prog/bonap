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
        Bonap détecte automatiquement les "restes" : quand la même recette apparaît sur deux créneaux consécutifs (ex : dîner lundi + déjeuner mardi), le second créneau est comptabilisé comme un reste. Ce pourcentage vous indique quelle part de vos repas sont issus de la veille.
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
