import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import "./index.css"
import App from "./App.tsx"
import { themeService } from "./infrastructure/theme/ThemeService.ts"

// Appliquer le thème immédiatement pour éviter le flash
themeService.apply()

// Détecte dynamiquement le basename pour supporter HA ingress
// (/api/hassio_ingress/<token>/) sans casser l'accès direct (basename = "/")
const ingressMatch = window.location.pathname.match(/^(\/api\/hassio_ingress\/[^/]+)/)
const basename = ingressMatch ? ingressMatch[1] : '/'

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
