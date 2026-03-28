import { Clock, Github } from 'lucide-react'
import { DocH1, DocLead, Alert } from '../../components/docs/DocsComponents'

export default function DocsTRMNLPage() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '10px',
          background: 'var(--bg-card)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-muted)', flexShrink: 0,
        }}>
          <Clock size={20} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <DocH1>Template TRMNL</DocH1>
          <span style={{
            padding: '0.2rem 0.625rem',
            borderRadius: '999px',
            fontSize: '0.72rem',
            fontWeight: 700,
            background: 'var(--bg-card-hover)',
            color: 'var(--text-muted)',
            border: '1px solid var(--border)',
            whiteSpace: 'nowrap',
          }}>
            Bientôt disponible
          </span>
        </div>
      </div>

      <DocLead>
        Un template TRMNL est en cours de développement pour afficher votre planning
        repas de la semaine sur votre écran e-ink TRMNL.
      </DocLead>

      <div style={{
        padding: '2rem',
        borderRadius: '12px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        textAlign: 'center',
        marginBottom: '2rem',
      }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '16px',
          background: 'var(--bg-card-hover)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1rem',
        }}>
          <Clock size={32} color="var(--text-muted)" />
        </div>

        <h2 style={{
          fontWeight: 700,
          fontSize: '1.125rem',
          color: 'var(--text)',
          marginBottom: '0.5rem',
        }}>
          En cours de développement
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '400px', margin: '0 auto 1.5rem' }}>
          Le template TRMNL affichera votre planning repas de la semaine (déjeuners et dîners)
          sur votre écran e-ink TRMNL, mis à jour automatiquement.
        </p>

        <a
          href="https://github.com/AymericLeFeyer/bonap"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1.25rem',
            borderRadius: '8px',
            background: 'var(--bg-card-hover)',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: 600,
            transition: 'border-color 0.2s, color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary-glow)'
            e.currentTarget.style.color = 'var(--text)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.color = 'var(--text-muted)'
          }}
        >
          <Github size={15} />
          Suivre l'avancement sur GitHub
        </a>
      </div>

      <Alert type="info">
        Le micro-serveur BFF (Backend for Frontend) pour TRMNL est déjà disponible dans le repo.
        Le template TRMNL côté plugin est en cours de finalisation.
      </Alert>
    </div>
  )
}
