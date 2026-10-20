# SONORA Day 20 — Save Library

Scope from the master plan: **Save/unsave UX, Library APIs, Saved tracks, persistence end-to-end, ownership checks.**

## Files added

- `services/api/src/modules/library/library.service.ts`
- `services/api/src/modules/library/library.controller.ts`
- `services/api/src/modules/library/library.module.ts`
- `apps/web/lib/music/library.ts`
- `apps/web/app/(app)/sonora/library/page.tsx`
- `database/prisma/manual-day20-save-library.sql`

## Files changed

- `database/prisma/schema.prisma`
- `services/api/src/app.module.ts`
- `apps/web/app/(app)/sonora/track/[trackId]/page.tsx`
- `apps/web/app/(app)/sonora/page.tsx`

## Apply in Codespace

From `/workspaces/sonara`:

```bash
unzip -o sonora-day20-implementation.zip
```

Then:

```bash
pnpm --dir services/api exec prisma db execute \
  --schema ../../database/prisma/schema.prisma \
  --file ../../database/prisma/manual-day20-save-library.sql
```

```bash
pnpm --dir services/api exec prisma generate \
  --schema ../../database/prisma/schema.prisma
```

Start the API and web app using the repo's normal commands.

## Manual smoke test

1. Open `/sonora/search` and open any real track.
2. On the track detail page click **Save**.
3. Confirm it changes to **Saved**.
4. Open `/sonora/library`.
5. Confirm the track appears.
6. Refresh `/sonora/library` and confirm it remains.
7. Remove it from the library and confirm it disappears.
8. Open the same track again and confirm the button is **Save**.
9. Save the same track again; it must stay a single library item.

## Ownership behavior

All read/write queries are scoped by the authenticated `userId`. A user can only see, save, or unsave their own saved-library records.

The database unique constraint on `(user_id, music_item_id)` makes save idempotent and prevents duplicate saved rows.
