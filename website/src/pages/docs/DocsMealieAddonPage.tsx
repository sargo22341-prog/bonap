import { Server, ExternalLink } from 'lucide-react'
import { DocH1, DocH2, DocLead, CodeBlock, Alert, Step } from '../../components/docs/DocsComponents'

const repoUrl = 'https://github.com/AyLabsCode/aylabs-ha-addons'

export default function DocsMealieAddonPage() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
          <Server size={20} />
        </div>
        <DocH1>Addon Mealie pour Home Assistant</DocH1>
      </div>

      <DocLead>
        Le dépôt AyLabs contient deux addons Home Assistant : <strong>Bonap</strong> et <strong>Mealie</strong>.
        Si vous n'avez pas encore Mealie sur votre HA, vous pouvez l'installer en un clic
        depuis le même dépôt — puis lancer Bonap pour une stack 100% HA.
      </DocLead>

      <Alert type="info">
        Cet addon Mealie est maintenu par AyLabs et n'est pas un projet officiel de Mealie.
        Compatible avec Home Assistant OS et Supervised.
      </Alert>

      <DocH2>Installation</DocH2>

      <Step number={1} title="Ajouter le dépôt AyLabs">
        Dans Home Assistant : <strong style={{ color: 'var(--text)' }}>Paramètres</strong> →{' '}
        <strong style={{ color: 'var(--text)' }}>Modules complémentaires</strong> →{' '}
        <strong style={{ color: 'var(--text)' }}>Boutique</strong> → menu 3 points →{' '}
        <strong style={{ color: 'var(--text)' }}>Dépôts</strong> → ajoutez :
        <CodeBlock code={repoUrl} language="text" />
        Rechargez la page. Les deux addons <strong style={{ color: 'var(--text)' }}>Mealie</strong> et <strong style={{ color: 'var(--text)' }}>Bonap</strong> apparaissent dans la boutique.
      </Step>

      <Step number={2} title="Installer Mealie">
        Cherchez <strong style={{ color: 'var(--text)' }}>"Mealie"</strong> dans la boutique →
        Installer. L'addon démarre sur le port <strong style={{ color: 'var(--text)' }}>9000</strong> par défaut.
      </Step>

      <Step number={3} title="Premier démarrage">
        Démarrez l'addon → <strong style={{ color: 'var(--text)' }}>OPEN WEB UI</strong> pour
        accéder à Mealie et créer votre compte administrateur.
      </Step>

      <Step number={4} title="Générer un token API">
        Dans Mealie : Profil (avatar en bas à gauche) → <strong style={{ color: 'var(--text)' }}>API Tokens</strong> →
        Créer un token. Copiez-le, vous en aurez besoin pour Bonap.
      </Step>

      <Step number={5} title="Installer Bonap">
        Depuis la même boutique, installez l'addon <strong style={{ color: 'var(--text)' }}>Bonap</strong>.
        Dans sa configuration, l'URL Mealie sera :{' '}
        <code style={{ background: 'var(--bg-card)', padding: '0.1em 0.4em', borderRadius: '4px', fontSize: '0.85em' }}>
          http://localhost:9000
        </code>{' '}
        (les deux addons tournant sur le même HA, ils communiquent en local).
        Suivez le <a href="/docs/installation/homeassistant" style={{ color: 'var(--primary)', textDecoration: 'none' }}>guide d'installation Bonap HA</a> pour la suite.
      </Step>

      <Alert type="tip">
        Avec les deux addons actifs, vous pouvez épingler Bonap <em>et</em> Mealie dans la barre latérale HA —
        accès en un clic sans aucune configuration réseau supplémentaire.
      </Alert>

      <DocH2>Lien du dépôt</DocH2>
      <a
        href={repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, transition: 'border-color 0.2s' }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}>
        <ExternalLink size={16} color="var(--primary)" />
        AyLabsCode/aylabs-ha-addons
      </a>
    </div>
  )
}
