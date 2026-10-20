# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app-shell.spec.ts >> app shell navigation works
- Location: tests/app-shell.spec.ts:3:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('SONORA')
Expected: visible
Error: strict mode violation: getByText('SONORA') resolved to 6 elements:
    1) <p class="font-semibold tracking-wide">SONORA</p> aka getByRole('link', { name: 'SONORA Music Machine' })
    2) <p class="text-xs text-[#B5A69A]">SONORA</p> aka getByText('SONORA').nth(1)
    3) <span class="↵        inline-flex items-center↵        rounded-full↵        border border-white/10↵        bg-white/5↵        px-2.5 py-1↵        text-xs↵        text-[#B5A69A]↵      ">SONORA / HOME</span> aka getByText('SONORA / HOME')
    4) <p class="text-sm text-[#B5A69A]">Your personalized SONORA workspace.</p> aka getByText('Your personalized SONORA')
    5) <div class="mt-1 text-[9px] uppercase tracking-[0.25em] text-[#F2E9DE]/60">Sonora</div> aka getByRole('button', { name: 'Open full player' })
    6) <p class="truncate text-xs text-[#B5A69A]">SONORA Demo</p> aka getByRole('button', { name: 'Open full player' })

Call log:
  - Expect "toBeVisible" getByText('SONORA') with timeout 5000ms
  - waiting for getByText('SONORA')

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
          - button "Start My Session" [ref=e98] [cursor=pointer]
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
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test("app shell navigation works", async ({ page }) => {
  4  |   await page.goto("/");
  5  | 
  6  |   await expect(
  7  |     page.getByText("SONORA"),
> 8  |   ).toBeVisible();
     |     ^ Error: expect(locator).toBeVisible() failed
  9  | 
  10 |   await page.getByText("Search", {
  11 |     exact: true,
  12 |   }).first().click();
  13 | 
  14 |   await expect(
  15 |     page.getByRole("heading", {
  16 |       name: "Search",
  17 |     }),
  18 |   ).toBeVisible();
  19 | });
```