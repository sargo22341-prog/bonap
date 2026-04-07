import { test, expect } from "@playwright/test"
import { setAuthToken, mockAllApiRoutes } from "./helpers/mockApi.ts"
import { MEALPLANS_RESPONSE, RECIPE_PIZZA } from "./fixtures/mealie.ts"

test.describe("Planning", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await setAuthToken(page)
    await mockAllApiRoutes(page)
  })

  test.describe("Affichage du planning", () => {
    test("affiche le titre Planning", async ({ page }) => {
      await page.goto("/planning")
      await expect(page.getByRole("heading", { name: "Planning" })).toBeVisible()
    })

    test("affiche les boutons de navigation temporelle", async ({ page }) => {
      await page.goto("/planning")
      await expect(page.getByRole("button", { name: /aujourd'hui/i })).toBeVisible()
    })

    test("affiche le sélecteur de nombre de jours (3j, 5j, 7j)", async ({ page }) => {
      await page.goto("/planning")
      await expect(page.getByRole("button", { name: "3j" })).toBeVisible()
      await expect(page.getByRole("button", { name: "5j" })).toBeVisible()
      await expect(page.getByRole("button", { name: "7j" })).toBeVisible()
    })

    test("affiche les repas du planning (vue desktop)", async ({ page }) => {
      await page.goto("/planning")
      // Attendre que le loading soit terminé
      await expect(page.locator(".animate-spin")).not.toBeVisible({ timeout: 5000 })
      // La recette du mealplan doit apparaître dans la vue desktop (tableau)
      await expect(page.getByText("Pizza maison")).toBeVisible()
    })

    test("affiche les labels Déjeuner et Dîner (vue desktop)", async ({ page }) => {
      await page.goto("/planning")
      await expect(page.locator(".animate-spin")).not.toBeVisible({ timeout: 5000 })
      // Les labels de types de repas dans le tableau
      await expect(page.getByText(/déjeuner/i).first()).toBeVisible()
      await expect(page.getByText(/dîner/i).first()).toBeVisible()
    })

    test("peut changer le nombre de jours affichés", async ({ page }) => {
      await page.goto("/planning")
      // Cliquer sur 7j
      await page.getByRole("button", { name: "7j" }).click()
      // Le bouton 7j doit être actif (classe bg-primary)
      const btn7j = page.getByRole("button", { name: "7j" })
      await expect(btn7j).toHaveClass(/bg-primary/)
    })

    test("le bouton 'Ajouter au panier' est présent", async ({ page }) => {
      await page.goto("/planning")
      await expect(page.getByRole("button", { name: /ajouter au panier/i })).toBeVisible()
    })
  })

  test.describe("Ajout d'un repas", () => {
    test("cliquer sur + ouvre le sélecteur de recette", async ({ page }) => {
      await page.goto("/planning")
      await expect(page.locator(".animate-spin")).not.toBeVisible({ timeout: 5000 })

      // Cliquer sur un bouton + dans le tableau (il y en a plusieurs)
      const addButtons = page.locator("button").filter({ hasText: "" }).locator("svg.lucide-plus").locator("..")
      const firstAddButton = addButtons.first()
      await firstAddButton.click()

      // Le RecipePickerDialog doit s'ouvrir
      await expect(page.getByRole("dialog")).toBeVisible()
    })

    test("peut sélectionner une recette dans le picker et l'ajouter au planning", async ({ page }) => {
      let addMealCalled = false
      let addMealPayload: Record<string, unknown> = {}

      await page.route("**/api/households/mealplans", async (route) => {
        if (route.request().method() === "POST") {
          addMealCalled = true
          addMealPayload = await route.request().json()
          await route.fulfill({
            json: {
              id: 99,
              date: addMealPayload.date ?? "2026-04-07",
              entryType: addMealPayload.entryType ?? "dinner",
              recipeId: "abc123",
              recipe: RECIPE_PIZZA,
            },
          })
        } else if (route.request().method() === "GET") {
          await route.fulfill({ json: MEALPLANS_RESPONSE })
        } else {
          await route.continue()
        }
      })

      await page.goto("/planning")
      await expect(page.locator(".animate-spin")).not.toBeVisible({ timeout: 5000 })

      // Ouvrir le picker via un bouton +
      const addButtons = page.locator("button svg.lucide-plus").locator("..")
      await addButtons.first().click()

      // Le dialog s'ouvre
      const dialog = page.getByRole("dialog")
      await expect(dialog).toBeVisible()

      // Le dialog contient une recherche et des recettes
      await expect(dialog.getByText("Pizza maison")).toBeVisible()

      // Cliquer sur la recette pour la sélectionner
      await dialog.getByText("Pizza maison").click()

      // L'API d'ajout doit avoir été appelée
      await page.waitForTimeout(500)
      expect(addMealCalled).toBe(true)
    })
  })

  test.describe("Suppression d'un repas", () => {
    test("cliquer sur supprimer appelle l'API de suppression", async ({ page }) => {
      let deleteCalled = false
      let deletedId: string | null = null

      await page.route("**/api/households/mealplans/**", async (route) => {
        if (route.request().method() === "DELETE") {
          deleteCalled = true
          deletedId = route.request().url().split("/").pop() ?? null
          await route.fulfill({ status: 200, body: "" })
        } else {
          await route.continue()
        }
      })

      await page.goto("/planning")
      await expect(page.locator(".animate-spin")).not.toBeVisible({ timeout: 5000 })
      await expect(page.getByText("Pizza maison")).toBeVisible()

      // Cliquer sur le bouton supprimer (icône Trash2)
      const deleteButtons = page.locator("button[title='Supprimer du planning']")
      await deleteButtons.first().click()

      await page.waitForTimeout(300)
      expect(deleteCalled).toBe(true)
      expect(deletedId).toBe("1")
    })
  })

  test.describe("Navigation dans le planning", () => {
    test("les boutons de navigation avant/arrière sont présents et cliquables", async ({ page }) => {
      await page.goto("/planning")

      // Les boutons de navigation (chevrons) doivent être présents
      const chevronButtons = page.locator("button svg.lucide-chevron-left, button svg.lucide-chevron-right").locator("..")
      await expect(chevronButtons.first()).toBeVisible()
    })

    test("cliquer sur Aujourd'hui recentre le planning", async ({ page }) => {
      await page.goto("/planning")
      const todayBtn = page.getByRole("button", { name: /aujourd'hui/i })
      await todayBtn.click()
      // Pas d'erreur, le planning reste visible
      await expect(page.getByRole("heading", { name: "Planning" })).toBeVisible()
    })
  })
})
