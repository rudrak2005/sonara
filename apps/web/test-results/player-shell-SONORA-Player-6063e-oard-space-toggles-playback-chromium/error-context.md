# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: player-shell.spec.ts >> SONORA Player Shell >> keyboard space toggles playback
- Location: tests/player-shell.spec.ts:64:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: 'Play' })
Expected: visible
Error: strict mode violation: getByRole('button', { name: 'Play' }) resolved to 3 elements:
    1) <button type="button" aria-label="Open full player" class="flex min-w-0 flex-1 items-center gap-3 text-left">…</button> aka getByRole('button', { name: 'Open full player' })
    2) <button type="button" aria-label="Play" class="flex h-14 w-14 items-center justify-center rounded-full bg-[#D18A4D] text-[#0B0908] transition hover:brightness-110">…</button> aka getByRole('button', { name: 'Play', exact: true })
    3) <button type="button" aria-label="Expand player" class="rounded-full p-2 text-[#B5A69A] hover:bg-white/5 hover:text-[#F2E9DE]">…</button> aka getByRole('button', { name: 'Expand player' })

Call log:
  - Expect "toBeVisible" getByRole('button', { name: 'Play' }) with timeout 5000ms
  - waiting for getByRole('button', { name: 'Play' })

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - complementary [ref=e4]:
    - link [ref=e6] [cursor=pointer]:
      - /url: /
      - generic [ref=e13]:
        - paragraph [ref=e14]: SONORA
        - paragraph [ref=e15]: Music Machine
    - navigation "Primary navigation" [ref=e16]:
      - link "Home" [ref=e17] [cursor=pointer]:
        - /url: /
      - link "Search" [ref=e22] [cursor=pointer]:
        - /url: /search
      - link "Library" [ref=e27] [cursor=pointer]:
        - /url: /library
      - link "Pulse" [ref=e31] [cursor=pointer]:
        - /url: /pulse
      - link "Music DNA" [ref=e35] [cursor=pointer]:
        - /url: /music-dna
      - link "Tapes" [ref=e45] [cursor=pointer]:
        - /url: /tapes
      - link "Memories" [ref=e52] [cursor=pointer]:
        - /url: /memories
      - link "AI DJ" [ref=e56] [cursor=pointer]:
        - /url: /ai
      - link "Together" [ref=e61] [cursor=pointer]:
        - /url: /together
      - link "Settings" [ref=e68] [cursor=pointer]:
        - /url: /settings
    - generic [ref=e73]:
      - paragraph [ref=e74]: SONORA
      - paragraph [ref=e75]: Your music. Your memories. Your AI.
  - generic [ref=e76]:
    - banner [ref=e77]:
      - button "Search your music... /" [ref=e79] [cursor=pointer]:
        - generic [ref=e83]: Search your music...
        - generic [ref=e84]: /
      - generic [ref=e85]:
        - button "Notifications" [ref=e86] [cursor=pointer]
        - button "Open profile menu" [ref=e90] [cursor=pointer]: R
    - main [ref=e91]:
      - generic [ref=e92]:
        - generic [ref=e95]:
          - text: SONORA / HOME
          - heading "Your music, your rhythm." [level=1] [ref=e96]: Your music,your rhythm.
          - paragraph [ref=e97]: Start a listening session built around your context, taste, and rhythm.
          - button "Start My Session" [active] [ref=e98] [cursor=pointer]
        - generic [ref=e99]:
          - generic [ref=e100]:
            - heading "Your space" [level=2] [ref=e101]
            - paragraph [ref=e102]: Your personalized SONORA workspace.
          - generic [ref=e103]:
            - generic [ref=e104]:
              - paragraph [ref=e105]: Pulse
              - paragraph [ref=e106]: Getting to know your rhythm
            - generic [ref=e107]:
              - paragraph [ref=e108]: Music DNA
              - paragraph [ref=e109]: Your taste profile
            - generic [ref=e110]:
              - paragraph [ref=e111]: Memories
              - paragraph [ref=e112]: Songs that mean something
    - region "Mini player" [ref=e113]:
      - generic [ref=e114]:
        - button "Open full player" [ref=e115] [cursor=pointer]:
          - generic "Night Drive artwork" [ref=e116]:
            - generic [ref=e117]:
              - generic [ref=e118]: S
              - generic [ref=e119]: Sonora
          - generic [ref=e120]:
            - paragraph [ref=e121]: Night Drive
            - paragraph [ref=e122]: SONORA Demo
        - generic [ref=e124]:
          - slider "Playback progress" [ref=e125] [cursor=pointer]: "0"
          - generic [ref=e126]:
            - generic [ref=e127]: 0:00
            - generic [ref=e128]: 0:00
          - generic [ref=e129]: 0 percent played
        - generic [ref=e131]:
          - button "Toggle shuffle" [ref=e132] [cursor=pointer]
          - button "Previous track" [ref=e139] [cursor=pointer]
          - button "Play" [ref=e142] [cursor=pointer]
          - button "Next track" [ref=e145] [cursor=pointer]
          - button "Toggle repeat" [ref=e148] [cursor=pointer]
        - button "Expand player" [ref=e154] [cursor=pointer]
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
  53 |     await expect(pauseButton).toBeVisible();
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
> 79 |     ).toBeVisible();
     |       ^ Error: expect(locator).toBeVisible() failed
  80 |   });
  81 | });
```