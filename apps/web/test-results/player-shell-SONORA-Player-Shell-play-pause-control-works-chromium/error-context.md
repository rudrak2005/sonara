# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: player-shell.spec.ts >> SONORA Player Shell >> play pause control works
- Location: tests/player-shell.spec.ts:42:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: 'Pause' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('button', { name: 'Pause' }) with timeout 5000ms
  - waiting for getByRole('button', { name: 'Pause' })

```

```yaml
- complementary:
  - link "SONORA Music Machine":
    - /url: /
    - paragraph: SONORA
    - paragraph: Music Machine
  - navigation "Primary navigation":
    - link "Home":
      - /url: /
    - link "Search":
      - /url: /search
    - link "Library":
      - /url: /library
    - link "Pulse":
      - /url: /pulse
    - link "Music DNA":
      - /url: /music-dna
    - link "Tapes":
      - /url: /tapes
    - link "Memories":
      - /url: /memories
    - link "AI DJ":
      - /url: /ai
    - link "Together":
      - /url: /together
    - link "Settings":
      - /url: /settings
  - paragraph: SONORA
  - paragraph: Your music. Your memories. Your AI.
- banner:
  - button "Search your music... /"
  - button "Notifications"
  - button "Open profile menu": R
- main:
  - text: SONORA / HOME
  - heading "Your music, your rhythm." [level=1]
  - paragraph: Start a listening session built around your context, taste, and rhythm.
  - button "Start My Session"
  - heading "Your space" [level=2]
  - paragraph: Your personalized SONORA workspace.
  - paragraph: Pulse
  - paragraph: Getting to know your rhythm
  - paragraph: Music DNA
  - paragraph: Your taste profile
  - paragraph: Memories
  - paragraph: Songs that mean something
- region "Mini player":
  - button "Open full player":
    - text: S Sonora
    - paragraph: Night Drive
    - paragraph: SONORA Demo
  - slider "Playback progress": "0"
  - text: 0:00 0:00 0 percent played
  - button "Toggle shuffle"
  - button "Previous track"
  - button "Play"
  - button "Next track"
  - button "Toggle repeat"
  - button "Expand player"
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | 
  3  | test.describe("SONORA Player Shell", () => {
  4  |   test("mini player opens from Start My Session", async ({
  5  |     page,
  6  |   }) => {
  7  |     await page.goto("/");
  8  | 
  9  |     await page.getByRole("button", {
  10 |       name: "Start My Session",
  11 |     }).click();
  12 | 
  13 |     await expect(
  14 |       page.getByRole("region", {
  15 |         name: "Mini player",
  16 |       }),
  17 |     ).toBeVisible();
  18 | 
  19 |     await expect(
  20 |       page.getByText("Night Drive"),
  21 |     ).toBeVisible();
  22 |   });
  23 | 
  24 |   test("full player opens", async ({ page }) => {
  25 |     await page.goto("/");
  26 | 
  27 |     await page.getByRole("button", {
  28 |       name: "Start My Session",
  29 |     }).click();
  30 | 
  31 |     await page.getByRole("button", {
  32 |       name: "Open full player",
  33 |     }).click();
  34 | 
  35 |     await expect(
  36 |       page.getByRole("dialog", {
  37 |         name: "Now playing",
  38 |       }),
  39 |     ).toBeVisible();
  40 |   });
  41 | 
  42 |   test("play pause control works", async ({ page }) => {
  43 |     await page.goto("/");
  44 | 
  45 |     await page.getByRole("button", {
  46 |       name: "Start My Session",
  47 |     }).click();
  48 | 
  49 |     const pauseButton = page.getByRole("button", {
  50 |       name: "Pause",
  51 |     });
  52 | 
> 53 |     await expect(pauseButton).toBeVisible();
     |                               ^ Error: expect(locator).toBeVisible() failed
  54 | 
  55 |     await pauseButton.click();
  56 | 
  57 |     await expect(
  58 |       page.getByRole("button", {
  59 |         name: "Play",
  60 |       }),
  61 |     ).toBeVisible();
  62 |   });
  63 | 
  64 |   test("keyboard space toggles playback", async ({
  65 |     page,
  66 |   }) => {
  67 |     await page.goto("/");
  68 | 
  69 |     await page.getByRole("button", {
  70 |       name: "Start My Session",
  71 |     }).click();
  72 | 
  73 |     await page.keyboard.press("Space");
  74 | 
  75 |     await expect(
  76 |       page.getByRole("button", {
  77 |         name: "Play",
  78 |       }),
  79 |     ).toBeVisible();
  80 |   });
  81 | });
```