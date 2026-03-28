import { Link } from 'react-router-dom'
import { CheckCircle, ChefHat, ArrowRight } from 'lucide-react'
import { DocH1, DocH2, DocLead, Alert, InlineCode } from '../../components/docs/DocsComponents'

const features = [
  'Grille de recettes avec recherche, filtres et scroll infini',
  'Planning hebdomadaire (déjeuner + dîner) avec navigation',
  'Liste de courses auto-remplie depuis le planning',
  'Suggestions IA (Anthropic, OpenAI, Google, Ollama)',
  'Assistant IA flottant avec tool use',
  'Statistiques : top recettes, streak, % restes',
  'Thème sombre, couleur d\'accent personnalisable',
]

export default function DocsIntroPage() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'var(--primary-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--primary)',
          flexShrink: 0,
        }}>
          <ChefHat size={20} />
        </div>
        <DocH1>Qu'est-ce que Bonap ?</DocH1>
      </div>

      <DocLead>
        Bonap est une interface React moderne pour <a href="https://mealie.io" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Mealie</a>,
        le gestionnaire de recettes self-hosted. Il remplace l'interface native de Mealie par une
        expérience plus ergonomique et enrichie.
      </DocLead>

      <Alert type="warning">
        Bonap ne remplace pas Mealie — il s'y connecte. Vous devez avoir une instance Mealie
        fonctionnelle avant d'installer Bonap.
      </Alert>

      <DocH2>Fonctionnalités</DocH2>
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {features.map((f) => (
          <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <CheckCircle size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            {f}
          </li>
        ))}
      </ul>

      <DocH2>Prérequis</DocH2>
      <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 2 }}>
        <li>Une instance <strong style={{ color: 'var(--text)' }}>Mealie</strong> en fonctionnement (v1.x ou supérieur)</li>
        <li>Un <strong style={{ color: 'var(--text)' }}>token API Mealie</strong> (Profil → API Tokens)</li>
        <li>Docker, Home Assistant, ou Node.js 18+ pour l'installation</li>
      </ul>

      <DocH2>Quick start</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
        La méthode la plus rapide selon votre configuration :
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
        {[
          { label: 'Vous avez Home Assistant', to: '/docs/installation/homeassistant', desc: 'Recommandé — addon intégré avec ingress' },
          { label: 'Vous avez Docker', to: '/docs/installation/docker', desc: 'Un conteneur, une commande' },
          { label: 'Développement local', to: '/docs/installation/dev', desc: 'Clone + npm run dev' },
        ].map((opt) => (
          <Link
            key={opt.to}
            to={opt.to}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.875rem 1rem',
              borderRadius: '8px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              textDecoration: 'none',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary-glow)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.9rem' }}>{opt.label}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>{opt.desc}</div>
            </div>
            <ArrowRight size={16} color="var(--text-muted)" />
          </Link>
        ))}
      </div>

      <DocH2>Générer un token Mealie</DocH2>
      <ol style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 2 }}>
        <li>Connectez-vous à votre instance Mealie</li>
        <li>Cliquez sur votre avatar (en bas à gauche) → <strong style={{ color: 'var(--text)' }}>Profil</strong></li>
        <li>Section <strong style={{ color: 'var(--text)' }}>API Tokens</strong> → Créer un token</li>
        <li>Copiez le token — il ne sera affiché qu'une seule fois</li>
        <li>Utilisez-le comme valeur de <InlineCode>VITE_MEALIE_TOKEN</InlineCode></li>
      </ol>
    </div>
  )
}
