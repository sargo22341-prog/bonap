import { NavLink } from "react-router-dom"
import { UtensilsCrossed, CalendarDays, BarChart2, ShoppingCart, ChevronLeft, ChevronRight, ExternalLink, Settings, Sparkles } from "lucide-react"
import { cn } from "../../lib/utils.ts"

const navItems = [
  { to: "/planning", label: "Planning", icon: CalendarDays },
  { to: "/shopping", label: "Courses", icon: ShoppingCart },
  { to: "/recipes", label: "Recettes", icon: UtensilsCrossed },
  { to: "/suggestions", label: "Suggestions IA", icon: Sparkles },
  { to: "/stats", label: "Statistiques", icon: BarChart2 },
]

interface SidebarProps {
  collapsed: boolean
  onToggleCollapsed: () => void
}

export function Sidebar({ collapsed, onToggleCollapsed }: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex flex-col",
        "border-r border-border/50 bg-card",
        "transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64",
        "shadow-sm",
      )}
    >
      {/* ── Logo ── */}
      <div
        className={cn(
          "flex h-16 items-center border-b border-border/50 shrink-0",
          collapsed ? "justify-center px-2" : "justify-between px-5",
        )}
      >
        {!collapsed ? (
          <>
            <img src="/logo_bonap.png" alt="bonap" className="h-10 object-contain" />
            <button
              type="button"
              onClick={onToggleCollapsed}
              className="rounded-xl p-1.5 text-muted-foreground transition-colors hover:bg-primary/8 hover:text-foreground"
              aria-label="Replier la sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </>
        ) : (
          <img src="/bonap.png" alt="bonap" className="h-8 w-8 object-contain" />
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-0.5">
        {!collapsed && (
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
            Menu
          </p>
        )}

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "relative flex items-center rounded-xl text-sm font-medium transition-all duration-150",
                collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
                isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-primary/8 hover:text-foreground",
              )
            }
            title={collapsed ? item.label : undefined}
          >
            {({ isActive }) => (
              <>
                {isActive && !collapsed && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-primary" />
                )}
                <item.icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-transform",
                    isActive && "text-primary scale-110",
                  )}
                />
                {!collapsed && <span>{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Footer ── */}
      <div className="border-t border-border/50 px-2 py-3 space-y-0.5">
        {collapsed && (
          <button
            type="button"
            onClick={onToggleCollapsed}
            className="flex w-full items-center justify-center rounded-xl p-2.5 text-muted-foreground transition-colors hover:bg-primary/8 hover:text-foreground"
            aria-label="Déplier la sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "flex items-center rounded-xl text-sm font-medium transition-colors",
              collapsed ? "justify-center p-2.5 w-full" : "gap-3 px-3 py-2.5 w-full",
              isActive
                ? "bg-primary/10 text-primary font-semibold"
                : "text-muted-foreground hover:bg-primary/8 hover:text-foreground",
            )
          }
          title={collapsed ? "Paramètres" : undefined}
        >
          <Settings className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Paramètres</span>}
        </NavLink>

        <a
          href={import.meta.env.VITE_MEALIE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex items-center rounded-xl text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/8 hover:text-foreground",
            collapsed ? "justify-center p-2.5 w-full" : "gap-3 px-3 py-2.5 w-full",
          )}
          title="Ouvrir Mealie"
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Mealie</span>}
        </a>
      </div>
    </aside>
  )
}
