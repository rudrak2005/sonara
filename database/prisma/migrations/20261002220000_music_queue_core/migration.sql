CREATE TABLE IF NOT EXISTS "artists" (
    "id" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_artist_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT,
    "metadata_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artists_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "albums" (
    "id" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_album_id" TEXT NOT NULL,
    "artist_id" UUID,
    "title" TEXT NOT NULL,
    "release_date" TIMESTAMP(3),
    "artwork_url" TEXT,
    "metadata_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "albums_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "music_items" (
    "id" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_track_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist_id" UUID,
    "album_id" UUID,
    "duration_ms" INTEGER NOT NULL,
    "release_date" TIMESTAMP(3),
    "genre_data" JSONB,
    "audio_features_json" JSONB,
    "artwork_url" TEXT,
    "metadata_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "music_items_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "queue_items" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "musicItemId" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "queue_items_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "artists_provider_provider_artist_id_key"
    ON "artists"("provider", "provider_artist_id");

CREATE INDEX IF NOT EXISTS "artists_provider_idx"
    ON "artists"("provider");

CREATE INDEX IF NOT EXISTS "artists_name_idx"
    ON "artists"("name");

CREATE UNIQUE INDEX IF NOT EXISTS "albums_provider_provider_album_id_key"
    ON "albums"("provider", "provider_album_id");

CREATE INDEX IF NOT EXISTS "albums_provider_idx"
    ON "albums"("provider");

CREATE INDEX IF NOT EXISTS "albums_artist_id_idx"
    ON "albums"("artist_id");

CREATE UNIQUE INDEX IF NOT EXISTS "music_items_provider_provider_track_id_key"
    ON "music_items"("provider", "provider_track_id");

CREATE INDEX IF NOT EXISTS "music_items_provider_idx"
    ON "music_items"("provider");

CREATE INDEX IF NOT EXISTS "music_items_artist_id_idx"
    ON "music_items"("artist_id");

CREATE INDEX IF NOT EXISTS "music_items_album_id_idx"
    ON "music_items"("album_id");

CREATE INDEX IF NOT EXISTS "music_items_title_idx"
    ON "music_items"("title");

CREATE INDEX IF NOT EXISTS "queue_items_userId_position_idx"
    ON "queue_items"("userId", "position");

CREATE INDEX IF NOT EXISTS "queue_items_userId_created_at_idx"
    ON "queue_items"("userId", "created_at");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'albums_artist_id_fkey'
    ) THEN
        ALTER TABLE "albums"
            ADD CONSTRAINT "albums_artist_id_fkey"
            FOREIGN KEY ("artist_id")
            REFERENCES "artists"("id")
            ON DELETE SET NULL
            ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'music_items_artist_id_fkey'
    ) THEN
        ALTER TABLE "music_items"
            ADD CONSTRAINT "music_items_artist_id_fkey"
            FOREIGN KEY ("artist_id")
            REFERENCES "artists"("id")
            ON DELETE SET NULL
            ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'music_items_album_id_fkey'
    ) THEN
        ALTER TABLE "music_items"
            ADD CONSTRAINT "music_items_album_id_fkey"
            FOREIGN KEY ("album_id")
            REFERENCES "albums"("id")
            ON DELETE SET NULL
            ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'queue_items_userId_fkey'
    ) THEN
        ALTER TABLE "queue_items"
            ADD CONSTRAINT "queue_items_userId_fkey"
            FOREIGN KEY ("userId")
            REFERENCES "users"("id")
            ON DELETE CASCADE
            ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'queue_items_musicItemId_fkey'
    ) THEN
        ALTER TABLE "queue_items"
            ADD CONSTRAINT "queue_items_musicItemId_fkey"
            FOREIGN KEY ("musicItemId")
            REFERENCES "music_items"("id")
            ON DELETE CASCADE
            ON UPDATE CASCADE;
    END IF;
END $$;
