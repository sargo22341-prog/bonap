import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar.tsx"

export function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-60 p-6">
        <Outlet />
      </main>
    </div>
  )
}
