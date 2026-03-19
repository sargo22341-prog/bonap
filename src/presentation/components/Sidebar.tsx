import { NavLink } from "react-router-dom"
import { UtensilsCrossed, CalendarDays } from "lucide-react"
import { cn } from "../../lib/utils.ts"

const navItems = [
  { to: "/recipes", label: "Recettes", icon: UtensilsCrossed },
  { to: "/planning", label: "Planning", icon: CalendarDays },
]

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-60 flex-col border-r bg-card shadow-sm">
      <div className="flex h-14 items-center border-b px-6">
        <span className="bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-lg font-extrabold tracking-tight text-transparent">
          Bonap 🍽️
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
