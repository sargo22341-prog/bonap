import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ChevronDown, ChevronRight, BookOpen, Package, Settings, Puzzle, Menu, X } from 'lucide-react'

interface NavItem {
  label: string
  to: string
}

interface NavGroup {
  label: string
  icon: React.ReactNode
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: 'Introduction',
    icon: <BookOpen size={14} />,
    items: [
      { label: "Qu'est-ce que Bonap ?", to: '/docs/introduction' },
    ],
  },
  {
    label: 'Installation',
    icon: <Package size={14} />,
    items: [
      { label: 'Docker', to: '/docs/installation/docker' },
      { label: 'Home Assistant', to: '/docs/installation/homeassistant' },
      { label: 'Dev local', to: '/docs/installation/dev' },
    ],
  },
  {
    label: 'Configuration',
    icon: <Settings size={14} />,
    items: [
      { label: "Variables d'environnement", to: '/docs/configuration' },
      { label: 'IA / LLM', to: '/docs/configuration/llm' },
    ],
  },
  {
    label: 'Extras',
    icon: <Puzzle size={14} />,
    items: [
      { label: 'Addon Mealie pour HA', to: '/docs/extras/mealie-addon' },
      { label: 'Template TRMNL', to: '/docs/extras/trmnl' },
    ],
  },
]

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    new Set(navGroups.map((g) => g.label))
  )

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev)
      if (next.has(label)) {
        next.delete(label)
      } else {
        next.add(label)
      }
      return next
    })
  }

  return (
    <nav style={{ padding: '1.5rem 0' }}>
      {navGroups.map((group) => {
        const isOpen = openGroups.has(group.label)
        return (
          <div key={group.label} style={{ marginBottom: '0.25rem' }}>
            <button
              onClick={() => toggleGroup(group.label)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.4rem 1rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                {group.icon}
                {group.label}
              </span>
              {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </button>

            {isOpen && (
              <div style={{ marginBottom: '0.5rem' }}>
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    style={({ isActive }) => ({
                      display: 'block',
                      padding: '0.45rem 1rem 0.45rem 2rem',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                      borderLeft: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                      transition: 'color 0.15s, border-color 0.15s',
                    })}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget
                      if (!el.getAttribute('aria-current')) {
                        el.style.color = 'var(--text)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget
                      if (!el.getAttribute('aria-current')) {
                        el.style.color = 'var(--text-muted)'
                      }
                    }}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}

export default function DocsSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="docs-mobile-toggle"
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          left: '1.5rem',
          zIndex: 40,
          background: 'var(--primary)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px var(--primary-glow)',
        }}
        aria-label="Menu docs"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 45,
            background: 'oklch(0.05 0.01 260 / 0.8)',
            backdropFilter: 'blur(4px)',
          }}
          className="docs-mobile-overlay"
        />
      )}

      {/* Mobile sidebar */}
      {mobileOpen && (
        <aside
          className="docs-mobile-sidebar"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: 46,
            width: '280px',
            background: 'var(--bg-card)',
            borderRight: '1px solid var(--border)',
            overflowY: 'auto',
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1rem 0',
          }}>
            <span style={{ fontWeight: 700, color: 'var(--text)' }}>Navigation</span>
            <button
              onClick={() => setMobileOpen(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>
          <SidebarContent onClose={() => setMobileOpen(false)} />
        </aside>
      )}

      {/* Desktop sidebar */}
      <aside
        className="docs-desktop-sidebar"
        style={{
          width: '260px',
          flexShrink: 0,
          borderRight: '1px solid var(--border)',
          overflowY: 'auto',
          position: 'sticky',
          top: '64px',
          height: 'calc(100vh - 64px)',
        }}
      >
        <SidebarContent />
      </aside>

      <style>{`
        @media (max-width: 767px) {
          .docs-desktop-sidebar { display: none !important; }
          .docs-mobile-toggle { display: flex !important; }
        }
        @media (min-width: 768px) {
          .docs-desktop-sidebar { display: block !important; }
          .docs-mobile-toggle { display: none !important; }
          .docs-mobile-overlay { display: none !important; }
          .docs-mobile-sidebar { display: none !important; }
        }
      `}</style>
    </>
  )
}
