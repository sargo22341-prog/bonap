import { NavLink } from "react-router-dom"
import { UtensilsCrossed, CalendarDays, BarChart2, ShoppingCart, ChevronLeft, ChevronRight, ExternalLink, Settings, Sparkles } from "lucide-react"
import { cn } from "../../lib/utils.ts"

const navItems = [
  { to: "/planning", label: "Planning", icon: CalendarDays },
  { to: "/shopping", label: "Courses", icon: ShoppingCart },
  { to: "/recipes", label: "Recettes", icon: UtensilsCrossed },
  { to: "/suggestions", label: "Suggestions", icon: Sparkles },
  { to: "/stats", label: "Statistiques", icon: BarChart2 },
]

interface SidebarProps {
  collapsed: boolean
  onToggleCollapsed: () => void
  onClose?: () => void
  /** Rendered as a mobile drawer (fixed positioning handled by the parent) */
  variant?: "desktop" | "mobile"
}

export function Sidebar({ collapsed, onToggleCollapsed, onClose, variant = "desktop" }: SidebarProps) {
  const isMobile = variant === "mobile"
  // On mobile the drawer is always in "expanded" mode
  const isCollapsed = isMobile ? false : collapsed

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-card/80 backdrop-blur-sm transition-all duration-300 ease-in-out",
        // Desktop: fixed position + variable width
        !isMobile && "fixed inset-y-0 left-0 z-30 shadow-md",
        !isMobile && (isCollapsed ? "w-16" : "w-60"),
        // Mobile: full height, fixed width (parent handles positioning)
        isMobile && "w-72 h-full",
      )}
    >
      {/* Logo / title */}
      <div
        className={cn(
          "flex h-14 items-center border-b shrink-0",
          isCollapsed ? "justify-center px-2" : "justify-between px-4",
        )}
      >
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary shadow-sm">
              <UtensilsCrossed className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-foreground">
              Bon<span className="text-primary">ap</span>
            </span>
          </div>
        )}
        {isCollapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
            <UtensilsCrossed className="h-4 w-4 text-primary-foreground" />
          </div>
        )}

        {/* Close drawer button (mobile) */}
        {isMobile && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Fermer le menu"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        {/* Collapse button (desktop only) */}
        {!isMobile && (
          <button
            type="button"
            onClick={onToggleCollapsed}
            className={cn(
              "rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
              isCollapsed && "mx-auto",
            )}
            aria-label={isCollapsed ? "Déplier la sidebar" : "Replier la sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-2 py-4 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={isMobile ? onClose : undefined}
            className={({ isActive }) =>
              cn(
                "flex items-center rounded-lg transition-all duration-150",
                isCollapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5",
                "text-sm font-medium",
                isActive
                  ? "bg-primary/12 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-accent/70 hover:text-foreground",
              )
            }
            title={isCollapsed ? item.label : undefined}
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn("h-4 w-4 shrink-0", isActive && "text-primary")} />
                {!isCollapsed && <span>{item.label}</span>}
                {!isCollapsed && isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer: Settings + Mealie link */}
      <div className={cn("border-t px-2 py-3 space-y-0.5", isCollapsed && "flex flex-col items-center space-y-0.5")}>
        <NavLink
          to="/settings"
          onClick={isMobile ? onClose : undefined}
          className={({ isActive }) =>
            cn(
              "flex items-center rounded-lg text-sm font-medium transition-colors",
              isCollapsed ? "p-2.5" : "w-full gap-3 px-3 py-2.5",
              isActive
                ? "bg-primary/12 text-primary font-semibold"
                : "text-muted-foreground hover:bg-accent/70 hover:text-foreground",
            )
          }
          title={isCollapsed ? "Paramètres" : undefined}
        >
          <Settings className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>Paramètres</span>}
        </NavLink>

        <a
          href={import.meta.env.VITE_MEALIE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex items-center rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/70 hover:text-foreground",
            isCollapsed ? "p-2.5" : "w-full gap-3 px-3 py-2.5",
          )}
          title="Ouvrir Mealie"
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>Mealie</span>}
        </a>
      </div>
    </aside>
  )
}
