CREATE TABLE IF NOT EXISTS "saved_music_items" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "music_item_id" UUID NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "saved_music_items_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "saved_music_items_user_id_music_item_id_key"
    UNIQUE ("user_id", "music_item_id"),
  CONSTRAINT "saved_music_items_user_id_fkey"
    FOREIGN KEY ("user_id")
    REFERENCES "users"("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT "saved_music_items_music_item_id_fkey"
    FOREIGN KEY ("music_item_id")
    REFERENCES "music_items"("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "saved_music_items_user_id_created_at_idx"
  ON "saved_music_items" ("user_id", "created_at");

CREATE INDEX IF NOT EXISTS "saved_music_items_music_item_id_idx"
  ON "saved_music_items" ("music_item_id");
