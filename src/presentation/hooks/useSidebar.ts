import { useCallback, useState } from "react"

const STORAGE_KEY = "bonap-sidebar-collapsed"

function getStoredCollapsed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true"
  } catch (_) {
    return false
  }
}

export function useSidebar() {
  // Desktop : sidebar réduite en mode icon-only
  const [collapsed, setCollapsedState] = useState<boolean>(getStoredCollapsed)
  // Mobile : drawer ouvert ou fermé
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleCollapsed = useCallback(() => {
    setCollapsedState((prev) => {
      const next = !prev
      try {
        localStorage.setItem(STORAGE_KEY, String(next))
      } catch (_) {}
      return next
    })
  }, [])

  const openMobile = useCallback(() => setMobileOpen(true), [])
  const closeMobile = useCallback(() => setMobileOpen(false), [])

  return { collapsed, toggleCollapsed, mobileOpen, openMobile, closeMobile }
}
