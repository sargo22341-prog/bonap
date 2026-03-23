import { Outlet, NavLink } from "react-router-dom"
import { CalendarDays, ShoppingCart, UtensilsCrossed, Sparkles, BarChart2 } from "lucide-react"
import { Sidebar } from "./Sidebar.tsx"
import { AssistantDrawer } from "./AssistantDrawer.tsx"
import { useSidebar } from "../hooks/useSidebar.ts"
import { cn } from "../../lib/utils.ts"

const mobileNavItems = [
  { to: "/planning", label: "Planning", icon: CalendarDays },
  { to: "/shopping", label: "Courses", icon: ShoppingCart },
  { to: "/recipes", label: "Recettes", icon: UtensilsCrossed },
  { to: "/suggestions", label: "IA", icon: Sparkles },
  { to: "/stats", label: "Stats", icon: BarChart2 },
]

export function Layout() {
  const { collapsed, toggleCollapsed } = useSidebar()

  return (
    <div className="min-h-screen bg-background">
      {/* ── Sidebar desktop (hidden on mobile) ── */}
      <div className="hidden md:block">
        <Sidebar collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />
      </div>

      {/* ── Contenu principal ── */}
      <main
        className={cn(
          "transition-[margin-left] duration-300 ease-in-out",
          /* Desktop : marge gauche selon état sidebar */
          "md:ml-64",
          collapsed && "md:ml-16",
          /* Mobile : plein écran */
          "ml-0",
          /* Padding contenu */
          "px-4 py-6 md:px-8 md:py-8",
          /* Extra espace bas pour nav mobile */
          "pb-24 md:pb-8",
        )}
      >
        <Outlet />
      </main>

      {/* ── Navigation basse mobile ── */}
      <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-border/60 bg-card/95 backdrop-blur-md md:hidden">
        <div className="flex h-16 items-stretch">
          {mobileNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "relative flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-primary" />
                  )}
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-transform duration-150",
                      isActive && "scale-110",
                    )}
                  />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      <AssistantDrawer />
    </div>
  )
}
