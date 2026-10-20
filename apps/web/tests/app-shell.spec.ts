import { test, expect } from "@playwright/test";

test("app shell navigation works", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByText("SONORA"),
  ).toBeVisible();

  await page.getByText("Search", {
    exact: true,
  }).first().click();

  await expect(
    page.getByRole("heading", {
      name: "Search",
    }),
  ).toBeVisible();
});