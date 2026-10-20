DO $$
BEGIN
  CREATE TYPE "ListeningEventType" AS ENUM (
    'PLAY_STARTED',
    'PLAY_COMPLETED',
    'SKIPPED',
    'PAUSED',
    'REPLAYED',
    'SAVED',
    'UNSAVED',
    'SEARCHED',
    'QUEUED',
    'TAPE_ADDED',
    'MEMORY_ADDED',
    'RECOMMENDATION_ACCEPTED',
    'RECOMMENDATION_REJECTED'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "listening_events" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "music_item_id" UUID NOT NULL,
  "event_type" "ListeningEventType" NOT NULL,
  "timestamp" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "session_id" UUID NULL,
  "position_ms" INTEGER NULL,
  "duration_ms" INTEGER NULL,
  "source" TEXT NOT NULL DEFAULT 'WEB',
  "context_json" JSONB NULL,
  "idempotency_key" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE "listening_events"
  ADD COLUMN IF NOT EXISTS "session_id" UUID NULL;

ALTER TABLE "listening_events"
  ADD COLUMN IF NOT EXISTS "position_ms" INTEGER NULL;

ALTER TABLE "listening_events"
  ADD COLUMN IF NOT EXISTS "duration_ms" INTEGER NULL;

ALTER TABLE "listening_events"
  ADD COLUMN IF NOT EXISTS "source" TEXT NOT NULL DEFAULT 'WEB';

ALTER TABLE "listening_events"
  ADD COLUMN IF NOT EXISTS "context_json" JSONB NULL;

ALTER TABLE "listening_events"
  ADD COLUMN IF NOT EXISTS "idempotency_key" TEXT;

ALTER TABLE "listening_events"
  ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW();

UPDATE "listening_events"
SET "idempotency_key" = "id"::text
WHERE "idempotency_key" IS NULL;

ALTER TABLE "listening_events"
  ALTER COLUMN "idempotency_key" SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'listening_events_user_id_fkey'
  ) THEN
    ALTER TABLE "listening_events"
      ADD CONSTRAINT "listening_events_user_id_fkey"
      FOREIGN KEY ("user_id") REFERENCES "users"("id")
      ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'listening_events_music_item_id_fkey'
  ) THEN
    ALTER TABLE "listening_events"
      ADD CONSTRAINT "listening_events_music_item_id_fkey"
      FOREIGN KEY ("music_item_id") REFERENCES "music_items"("id")
      ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'listening_events_session_id_fkey'
  ) THEN
    ALTER TABLE "listening_events"
      ADD CONSTRAINT "listening_events_session_id_fkey"
      FOREIGN KEY ("session_id") REFERENCES "sessions"("id")
      ON DELETE SET NULL;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS
  "listening_events_user_id_idempotency_key_key"
  ON "listening_events" ("user_id", "idempotency_key");

CREATE INDEX IF NOT EXISTS
  "listening_events_user_id_timestamp_idx"
  ON "listening_events" ("user_id", "timestamp");

CREATE INDEX IF NOT EXISTS
  "listening_events_music_item_id_timestamp_idx"
  ON "listening_events" ("music_item_id", "timestamp");

CREATE INDEX IF NOT EXISTS
  "listening_events_user_id_event_type_timestamp_idx"
  ON "listening_events" ("user_id", "event_type", "timestamp");
