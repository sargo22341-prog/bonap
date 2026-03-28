import { Terminal } from 'lucide-react'
import { DocH1, DocH2, DocLead, CodeBlock, Alert, InlineCode } from '../../components/docs/DocsComponents'

const cloneCmd = `git clone https://github.com/AymericLeFeyer/bonap
cd bonap
npm install`

const envFile = `VITE_MEALIE_URL=http://your-mealie-host:9000
VITE_MEALIE_TOKEN=your_api_token`

const devCmd = `npm run dev
# → Local:   http://localhost:5173`

const buildCmd = `npm run build
# Output: dist/`

export default function DocsDevPage() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '10px',
          background: 'var(--primary-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--primary)', flexShrink: 0,
        }}>
          <Terminal size={20} />
        </div>
        <DocH1>Dev local</DocH1>
      </div>

      <DocLead>
        Pour contribuer ou tester des modifications, clonez le repo et lancez le serveur de développement Vite.
        Le proxy intégré gère automatiquement le CORS avec Mealie.
      </DocLead>

      <Alert type="info">
        Prérequis : Node.js 18+ et npm 9+. Une instance Mealie accessible en réseau est nécessaire.
      </Alert>

      <DocH2>1. Cloner et installer</DocH2>
      <CodeBlock code={cloneCmd} language="bash" />

      <DocH2>2. Configurer les variables d'environnement</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '0.5rem' }}>
        Créez un fichier <InlineCode>.env</InlineCode> à la racine du projet :
      </p>
      <CodeBlock code={envFile} language="bash" />

      <Alert type="tip">
        En développement, Vite proxie automatiquement <InlineCode>/api/*</InlineCode> vers{' '}
        <InlineCode>VITE_MEALIE_URL</InlineCode>. Vous n'avez pas à configurer CORS côté Mealie.
        Le proxy est configuré dans <InlineCode>vite.config.ts</InlineCode>.
      </Alert>

      <DocH2>3. Lancer le serveur de développement</DocH2>
      <CodeBlock code={devCmd} language="bash" />

      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
        Ouvrez <InlineCode>http://localhost:5173</InlineCode>. Le hot-reload est actif — toute
        modification de fichier source se reflète instantanément dans le navigateur.
      </p>

      <DocH2>Scripts disponibles</DocH2>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        padding: '1rem',
        borderRadius: '8px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        fontSize: '0.875rem',
      }}>
        {[
          { cmd: 'npm run dev', desc: 'Serveur de développement avec HMR (port 5173)' },
          { cmd: 'npm run build', desc: 'Compilation TypeScript + build Vite (output: dist/)' },
          { cmd: 'npm run preview', desc: 'Prévisualisation du build de production' },
          { cmd: 'npm run lint', desc: 'Vérification ESLint' },
        ].map((item) => (
          <div key={item.cmd} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flexWrap: 'wrap' }}>
            <code style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.8rem',
              color: 'var(--primary-light)',
              background: 'var(--primary-subtle)',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              whiteSpace: 'nowrap',
            }}>
              {item.cmd}
            </code>
            <span style={{ color: 'var(--text-muted)' }}>{item.desc}</span>
          </div>
        ))}
      </div>

      <DocH2>Builder pour la production</DocH2>
      <CodeBlock code={buildCmd} language="bash" />
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
        Le dossier <InlineCode>dist/</InlineCode> contient les assets statiques. Déployez-les sur
        n'importe quel serveur HTTP (nginx, Caddy, etc.) ou via Docker avec l'image officielle.
      </p>

      <Alert type="warning">
        En production, <InlineCode>VITE_MEALIE_URL</InlineCode> doit être directement accessible
        depuis le navigateur des utilisateurs (pas depuis le serveur). Les variables{' '}
        <InlineCode>VITE_*</InlineCode> sont injectées au moment du build dans le JavaScript client.
      </Alert>
    </div>
  )
}
