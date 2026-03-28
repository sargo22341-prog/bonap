import { Sun, Moon } from 'lucide-react'
import { type Theme } from '../hooks/useWebsiteTheme'

interface ThemeToggleProps {
  theme: Theme
  onToggle: () => void
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
      style={{
        background: 'none',
        border: '1px solid var(--border)',
        borderRadius: '6px',
        color: 'var(--text-muted)',
        cursor: 'pointer',
        padding: '0.375rem 0.5rem',
        display: 'flex',
        alignItems: 'center',
        transition: 'color 0.2s, border-color 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'var(--text)'
        e.currentTarget.style.borderColor = 'var(--text-muted)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--text-muted)'
        e.currentTarget.style.borderColor = 'var(--border)'
      }}
    >
      {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  )
}
