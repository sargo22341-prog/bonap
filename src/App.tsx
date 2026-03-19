import { Routes, Route, Navigate } from "react-router-dom"
import { Layout } from "./presentation/components/Layout.tsx"
import { RecipesPage } from "./presentation/pages/RecipesPage.tsx"
import { PlanningPage } from "./presentation/pages/PlanningPage.tsx"

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/recipes" replace />} />
        <Route path="recipes" element={<RecipesPage />} />
        <Route path="planning" element={<PlanningPage />} />
      </Route>
    </Routes>
  )
}

export default App
