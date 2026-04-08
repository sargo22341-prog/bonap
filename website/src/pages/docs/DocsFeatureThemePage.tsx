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
