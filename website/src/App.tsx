import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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

export default function App() {
  return (
    <BrowserRouter>
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
          <Route path="extras/mealie-addon" element={<DocsMealieAddonPage />} />
          <Route path="extras/trmnl" element={<DocsTRMNLPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
