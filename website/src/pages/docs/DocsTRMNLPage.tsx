import { Monitor, Github } from 'lucide-react'
import { DocH1, DocH2, DocLead, CodeBlock, Alert, Step } from '../../components/docs/DocsComponents'

const bffPort = '3001'
const templatesUrl = 'https://github.com/AymericLeFeyer/bonap/tree/main/trmnl'

export default function DocsTRMNLPage() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
          <Monitor size={20} />
        </div>
        <DocH1>Template TRMNL</DocH1>
      </div>

      <DocLead>
        Bonap fournit un micro-serveur BFF (Backend for Frontend) et deux templates TRMNL
        pour afficher votre planning repas et le prochain repas sur un écran e-ink TRMNL.
      </DocLead>

      {/* Screenshots */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)' }}>
          <img src="/trmnl.jpeg" alt="Aperçu TRMNL" style={{ width: '100%', display: 'block' }} />
          <div style={{ padding: '0.625rem 0.875rem', background: 'var(--bg-card)', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Aperçu général</div>
        </div>
        <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)' }}>
          <img src="/planning.png" alt="Planning 3 jours" style={{ width: '100%', display: 'block' }} />
          <div style={{ padding: '0.625rem 0.875rem', background: 'var(--bg-card)', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Planning 3 jours</div>
        </div>
        <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)' }}>
          <img src="/next_meal.png" alt="Prochain repas" style={{ width: '100%', display: 'block' }} />
          <div style={{ padding: '0.625rem 0.875rem', background: 'var(--bg-card)', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Prochain repas</div>
        </div>
      </div>

      <DocH2>Comment ça marche</DocH2>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
        Bonap embarque un serveur <strong style={{ color: 'var(--text)' }}>BFF</strong> (port {bffPort}) qui interroge l'API Mealie
        et expose des endpoints JSON simplifiés, directement consommables par les templates TRMNL via
        leur système de plugins. Les templates sont des fichiers HTML utilisant la syntaxe Liquid.
      </p>

      <DocH2>Endpoints disponibles</DocH2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1rem 1.25rem', borderRadius: '10px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <code style={{ background: 'var(--primary-subtle)', color: 'var(--primary)', padding: '0.2em 0.5em', borderRadius: '5px', fontSize: '0.85rem', fontWeight: 700 }}>GET /planning?days=3</code>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Planning sur N jours (1–14, défaut 3)</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
            Retourne les repas groupés par jour avec image, nom et créneau (déjeuner / dîner).
          </p>
        </div>
        <div style={{ padding: '1rem 1.25rem', borderRadius: '10px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <code style={{ background: 'var(--primary-subtle)', color: 'var(--primary)', padding: '0.2em 0.5em', borderRadius: '5px', fontSize: '0.85rem', fontWeight: 700 }}>GET /next_meal</code>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Prochain repas prévu</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
            Retourne le prochain repas à venir (aujourd'hui ou demain) avec image, ingrédients et instructions.
          </p>
        </div>
      </div>

      <DocH2>Installation</DocH2>

      <Step number={1} title="Démarrer le BFF">
        Le BFF est inclus dans l'addon Home Assistant Bonap — il démarre automatiquement.
        En dehors de HA, lancez-le manuellement :
        <CodeBlock code={`docker run -d -p ${bffPort}:${bffPort} \\\n  -e MEALIE_URL=http://votre-mealie:9000 \\\n  -e MEALIE_TOKEN=votre_token \\\n  ghcr.io/aymericlefeyer/bonap-bff:latest`} language="bash" />
      </Step>

      <Step number={2} title="Créer un plugin TRMNL">
        Dans TRMNL : <strong style={{ color: 'var(--text)' }}>Plugins</strong> →{' '}
        <strong style={{ color: 'var(--text)' }}>Private Plugin</strong> → renseignez l'URL du BFF :
        <CodeBlock code={`http://VOTRE_IP:${bffPort}/planning?days=3\n# ou\nhttp://VOTRE_IP:${bffPort}/next_meal`} language="text" />
      </Step>

      <Step number={3} title="Coller le template HTML">
        Récupérez le template correspondant sur GitHub et collez-le dans le champ{' '}
        <strong style={{ color: 'var(--text)' }}>Template HTML</strong> du plugin TRMNL.
      </Step>

      <Alert type="tip">
        Le BFF sur l'addon HA écoute sur le port <strong>{bffPort}</strong>.
        Votre TRMNL doit pouvoir atteindre votre instance HA sur ce port — vérifiez que le port est exposé dans la configuration réseau de l'addon.
      </Alert>

      <DocH2>Templates</DocH2>

      <a
        href={templatesUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, transition: 'border-color 0.2s' }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}>
        <Github size={16} color="var(--primary)" />
        Voir les templates sur GitHub
      </a>
    </div>
  )
}
