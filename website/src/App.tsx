import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}
import LandingPage from './pages/LandingPage'
import DocsLayout from './pages/docs/DocsLayout'
import DocsIntroPage from './pages/docs/DocsIntroPage'
import DocsDockerPage from './pages/docs/DocsDockerPage'
import DocsHAPage from './pages/docs/DocsHAPage'
import DocsDevPage from './pages/docs/DocsDevPage'
import DocsConfigPage from './pages/docs/DocsConfigPage'
import DocsMealieAddonPage from './pages/docs/DocsMealieAddonPage'
import DocsTRMNLPage from './pages/docs/DocsTRMNLPage'
import DocsLLMPage from './pages/docs/DocsLLMPage'
import DocsFeatureRecipesPage from './pages/docs/DocsFeatureRecipesPage'
import DocsFeaturePlanningPage from './pages/docs/DocsFeaturePlanningPage'
import DocsFeatureShoppingPage from './pages/docs/DocsFeatureShoppingPage'
import DocsFeatureStatsPage from './pages/docs/DocsFeatureStatsPage'
import DocsFeatureSuggestionsPage from './pages/docs/DocsFeatureSuggestionsPage'
import DocsFeatureAssistantPage from './pages/docs/DocsFeatureAssistantPage'
import DocsFeatureThemePage from './pages/docs/DocsFeatureThemePage'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/docs" element={<Navigate to="/docs/introduction" replace />} />
        <Route path="/docs" element={<DocsLayout />}>
          <Route path="introduction" element={<DocsIntroPage />} />
          <Route path="installation/docker" element={<DocsDockerPage />} />
          <Route path="installation/homeassistant" element={<DocsHAPage />} />
          <Route path="installation/dev" element={<DocsDevPage />} />
          <Route path="configuration" element={<DocsConfigPage />} />
          <Route path="configuration/llm" element={<DocsLLMPage />} />
          <Route path="features/recipes" element={<DocsFeatureRecipesPage />} />
          <Route path="features/planning" element={<DocsFeaturePlanningPage />} />
          <Route path="features/shopping" element={<DocsFeatureShoppingPage />} />
          <Route path="features/stats" element={<DocsFeatureStatsPage />} />
          <Route path="features/suggestions" element={<DocsFeatureSuggestionsPage />} />
          <Route path="features/assistant" element={<DocsFeatureAssistantPage />} />
          <Route path="features/theme" element={<DocsFeatureThemePage />} />
          <Route path="extras/mealie-addon" element={<DocsMealieAddonPage />} />
          <Route path="extras/trmnl" element={<DocsTRMNLPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
