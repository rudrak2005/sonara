import { expect, test } from "@playwright/test";

test.describe("SONORA Player Shell", () => {
  test("mini player opens from Start My Session", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByRole("button", {
      name: "Start My Session",
    }).click();

    await expect(
      page.getByRole("region", {
        name: "Mini player",
      }),
    ).toBeVisible();

    await expect(
      page.getByText("Night Drive"),
    ).toBeVisible();
  });

  test("full player opens", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", {
      name: "Start My Session",
    }).click();

    await page.getByRole("button", {
      name: "Open full player",
    }).click();

    await expect(
      page.getByRole("dialog", {
        name: "Now playing",
      }),
    ).toBeVisible();
  });

  test("play pause control works", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", {
      name: "Start My Session",
    }).click();

    const pauseButton = page.getByRole("button", {
      name: "Pause",
    });

    await expect(pauseButton).toBeVisible();

    await pauseButton.click();

    await expect(
      page.getByRole("button", {
        name: "Play",
      }),
    ).toBeVisible();
  });

  test("keyboard space toggles playback", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByRole("button", {
      name: "Start My Session",
    }).click();

    await page.keyboard.press("Space");

    await expect(
      page.getByRole("button", {
        name: "Play",
      }),
    ).toBeVisible();
  });
});