#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-/workspaces/sonara}"
cd "$ROOT"

STAMP="$(date +%Y%m%d_%H%M%S)"
BACKUP="day21-event-pipeline-backup-$STAMP"
mkdir -p "$BACKUP"

echo "=============================================="
echo "SONORA Day 21 — Event Pipeline"
echo "Root: $ROOT"
echo "Backup: $BACKUP"
echo "=============================================="

backup_file() {
  local file="$1"
  if [ -f "$file" ]; then
    mkdir -p "$BACKUP/$(dirname "$file")"
    cp "$file" "$BACKUP/$file"
    echo "BACKUP  $file"
  fi
}

backup_file database/prisma/schema.prisma
backup_file services/api/src/app.module.ts
backup_file apps/web/stores/player-store.ts

python3 - <<'PY'
from pathlib import Path

path = Path("database/prisma/schema.prisma")
text = path.read_text()

if "enum ListeningEventType {" not in text:
    marker = "enum DiscoveryLevel {\n  LOW\n  BALANCED\n  HIGH\n}\n"
    enum_block = "\n".join([
        "enum ListeningEventType {",
        "  PLAY_STARTED",
        "  PLAY_COMPLETED",
        "  SKIPPED",
        "  PAUSED",
        "  REPLAYED",
        "  SAVED",
        "  UNSAVED",
        "  SEARCHED",
        "  QUEUED",
        "  TAPE_ADDED",
        "  MEMORY_ADDED",
        "  RECOMMENDATION_ACCEPTED",
        "  RECOMMENDATION_REJECTED",
        "}",
        "",
    ])
    if marker not in text:
        raise SystemExit("Could not locate DiscoveryLevel enum in schema.prisma")
    text = text.replace(marker, marker + enum_block, 1)
    print("SCHEMA   ListeningEventType enum added")
else:
    print("SCHEMA   ListeningEventType enum already present")

if "  listeningEvents   ListeningEvent[]" not in text:
    anchor = "  passwordResetTokens PasswordResetToken[]\n"
    if anchor not in text:
        raise SystemExit("Could not locate User relations anchor")
    text = text.replace(anchor, anchor + "  listeningEvents   ListeningEvent[]\n", 1)
    print("SCHEMA   User.listeningEvents added")

if "  listeningEvents ListeningEvent[]" not in text:
    anchor = "  items SessionItem[]\n"
    if anchor not in text:
        raise SystemExit("Could not locate Session.items relation")
    text = text.replace(anchor, anchor + "  listeningEvents ListeningEvent[]\n", 1)
    print("SCHEMA   Session.listeningEvents added")

if "  listeningEvents ListeningEvent[]" not in text:
    anchor = "  queueItems QueueItem[]\n"
    if anchor not in text:
        raise SystemExit("Could not locate MusicItem.queueItems relation")
    text = text.replace(anchor, "  listeningEvents ListeningEvent[]\n" + anchor, 1)
    print("SCHEMA   MusicItem.listeningEvents added")

if "model ListeningEvent {" not in text:
    model = "\n".join([
        "model ListeningEvent {",
        '  id             String             @id @default(uuid()) @db.Uuid',
        '  userId         String             @map("user_id") @db.Uuid',
        '  musicItemId    String             @map("music_item_id") @db.Uuid',
        '  eventType      ListeningEventType @map("event_type")',
        '  timestamp      DateTime           @default(now())',
        '  sessionId      String?            @map("session_id") @db.Uuid',
        '  positionMs     Int?               @map("position_ms")',
        '  durationMs     Int?               @map("duration_ms")',
        '  source         String             @default("WEB")',
        '  contextJson    Json?              @map("context_json")',
        '  idempotencyKey String             @map("idempotency_key")',
        '  createdAt      DateTime           @default(now()) @map("created_at")',
        "",
        '  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)',
        '  musicItem MusicItem @relation(fields: [musicItemId], references: [id], onDelete: Cascade)',
        '  session   Session?  @relation(fields: [sessionId], references: [id], onDelete: SetNull)',
        "",
        "  @@unique([userId, idempotencyKey])",
        '  @@index([userId, timestamp])',
        '  @@index([musicItemId, timestamp])',
        '  @@index([userId, eventType, timestamp])',
        '  @@map("listening_events")',
        "}",
    ])
    text = text.rstrip() + "\n\n" + model + "\n"
    print("SCHEMA   ListeningEvent model added")
else:
    print("SCHEMA   ListeningEvent model already present")

path.write_text(text)
PY

echo "UPDATED database/prisma/schema.prisma"

cat > database/prisma/manual-day21-event-pipeline.sql <<'SQL'
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
SQL

echo "NEW      database/prisma/manual-day21-event-pipeline.sql"

mkdir -p services/api/src/modules/analytics/dto

cat > services/api/src/modules/analytics/dto/track-event.dto.ts <<'EOF'
import { Transform } from "class-transformer";
import {
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from "class-validator";

export const LISTENING_EVENT_TYPES = [
  "PLAY_STARTED",
  "PLAY_COMPLETED",
  "SKIPPED",
  "PAUSED",
  "REPLAYED",
  "SAVED",
  "UNSAVED",
  "SEARCHED",
  "QUEUED",
  "TAPE_ADDED",
  "MEMORY_ADDED",
  "RECOMMENDATION_ACCEPTED",
  "RECOMMENDATION_REJECTED",
] as const;

export type ListeningEventType =
  (typeof LISTENING_EVENT_TYPES)[number];

export class TrackEventDto {
  @IsUUID()
  musicItemId!: string;

  @Transform(({ value }) =>
    typeof value === "string"
      ? value.trim().toUpperCase()
      : value,
  )
  @IsString()
  @IsIn(LISTENING_EVENT_TYPES)
  eventType!: ListeningEventType;

  @IsOptional()
  @IsUUID()
  sessionId?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(86_400_000)
  positionMs?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(86_400_000)
  durationMs?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  source?: string;

  @IsOptional()
  @IsObject()
  contextJson?: Record<string, unknown>;

  @Transform(({ value }) =>
    typeof value === "string"
      ? value.trim()
      : value,
  )
  @IsString()
  @MaxLength(128)
  idempotencyKey!: string;
}
EOF

cat > services/api/src/modules/analytics/analytics.service.ts <<'EOF'
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service.js";
import { TrackEventDto } from "./dto/track-event.dto.js";

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async ingest(
    userId: string,
    dto: TrackEventDto,
  ) {
    const musicItem =
      await this.prisma.musicItem.findUnique({
        where: { id: dto.musicItemId },
        select: { id: true },
      });

    if (!musicItem) {
      throw new NotFoundException(
        "Music item not found.",
      );
    }

    if (
      dto.positionMs !== undefined &&
      dto.durationMs !== undefined &&
      dto.positionMs > dto.durationMs
    ) {
      throw new BadRequestException(
        "positionMs cannot exceed durationMs.",
      );
    }

    if (dto.sessionId) {
      const session =
        await this.prisma.session.findFirst({
          where: {
            id: dto.sessionId,
            userId,
          },
          select: { id: true },
        });

      if (!session) {
        throw new NotFoundException(
          "Listening session not found.",
        );
      }
    }

    const idempotencyKey =
      dto.idempotencyKey.trim();

    if (!idempotencyKey) {
      throw new BadRequestException(
        "idempotencyKey is required.",
      );
    }

    const existing =
      await this.prisma.listeningEvent.findUnique({
        where: {
          userId_idempotencyKey: {
            userId,
            idempotencyKey,
          },
        },
      });

    if (existing) {
      return {
        success: true,
        data: {
          id: existing.id,
          eventType: existing.eventType,
          timestamp: existing.timestamp,
          duplicate: true,
        },
      };
    }

    try {
      const event =
        await this.prisma.listeningEvent.create({
          data: {
            userId,
            musicItemId: dto.musicItemId,
            eventType: dto.eventType,
            sessionId: dto.sessionId ?? null,
            positionMs: dto.positionMs ?? null,
            durationMs: dto.durationMs ?? null,
            source: dto.source?.trim() || "WEB",
            contextJson: dto.contextJson ?? undefined,
            idempotencyKey,
          },
        });

      return {
        success: true,
        data: {
          id: event.id,
          eventType: event.eventType,
          timestamp: event.timestamp,
          duplicate: false,
        },
      };
    } catch (error) {
      const isUniqueViolation =
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2002";

      if (!isUniqueViolation) {
        throw error;
      }

      const duplicate =
        await this.prisma.listeningEvent.findUnique({
          where: {
            userId_idempotencyKey: {
              userId,
              idempotencyKey,
            },
          },
        });

      if (!duplicate) {
        throw error;
      }

      return {
        success: true,
        data: {
          id: duplicate.id,
          eventType: duplicate.eventType,
          timestamp: duplicate.timestamp,
          duplicate: true,
        },
      };
    }
  }

  async recent(
    userId: string,
    limit = 25,
  ) {
    const safeLimit = Math.min(
      Math.max(limit, 1),
      100,
    );

    const items =
      await this.prisma.listeningEvent.findMany({
        where: { userId },
        include: {
          musicItem: {
            include: {
              artist: true,
              album: true,
            },
          },
        },
        orderBy: { timestamp: "desc" },
        take: safeLimit,
      });

    return {
      success: true,
      data: {
        count: items.length,
        items,
      },
    };
  }
}
EOF

cat > services/api/src/modules/analytics/analytics.controller.ts <<'EOF'
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { SessionGuard } from "../auth/guards/session.guard.js";
import { AnalyticsService } from "./analytics.service.js";
import { TrackEventDto } from "./dto/track-event.dto.js";

type AuthenticatedRequest = Request & {
  user?: {
    id: string;
  };
};

@Controller("playback/events")
@UseGuards(SessionGuard)
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
  ) {}

  private getUserId(
    request: AuthenticatedRequest,
  ) {
    const userId = request.user?.id;

    if (!userId) {
      throw new UnauthorizedException(
        "Authenticated user not found.",
      );
    }

    return userId;
  }

  @Post()
  ingest(
    @Req() request: AuthenticatedRequest,
    @Body() dto: TrackEventDto,
  ) {
    return this.analyticsService.ingest(
      this.getUserId(request),
      dto,
    );
  }

  @Get("recent")
  recent(
    @Req() request: AuthenticatedRequest,
    @Query("limit") limit?: string,
  ) {
    const parsed = Number(limit ?? 25);

    return this.analyticsService.recent(
      this.getUserId(request),
      Number.isFinite(parsed)
        ? parsed
        : 25,
    );
  }
}
EOF

cat > services/api/src/modules/analytics/analytics.module.ts <<'EOF'
import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module.js";
import { PrismaModule } from "../../database/prisma.module.js";
import { AnalyticsController } from "./analytics.controller.js";
import { AnalyticsService } from "./analytics.service.js";

@Module({
  imports: [
    AuthModule,
    PrismaModule,
  ],
  controllers: [
    AnalyticsController,
  ],
  providers: [
    AnalyticsService,
  ],
})
export class AnalyticsModule {}
EOF

echo "NEW      services/api/src/modules/analytics/*"

python3 - <<'PY'
from pathlib import Path

path = Path("services/api/src/app.module.ts")
text = path.read_text()

if 'modules/analytics/analytics.module' not in text:
    text = (
        'import { AnalyticsModule } from "./modules/analytics/analytics.module";\n'
        + text
    )

if "    AnalyticsModule," not in text:
    anchor = "    QueueModule,"
    if anchor not in text:
        raise SystemExit("Could not locate QueueModule in app.module.ts")
    text = text.replace(
        anchor,
        "    QueueModule,\n    AnalyticsModule,",
        1,
    )

path.write_text(text)
print("UPDATE   services/api/src/app.module.ts")
PY

cat > apps/web/lib/music/events.ts <<'EOF'
import { apiRequest } from "@/lib/api/client";
import { getTrack } from "@/lib/music/track";

export const EVENT_TYPES = {
  PLAY_STARTED: "PLAY_STARTED",
  PLAY_COMPLETED: "PLAY_COMPLETED",
  SKIPPED: "SKIPPED",
  PAUSED: "PAUSED",
  REPLAYED: "REPLAYED",
  SAVED: "SAVED",
  UNSAVED: "UNSAVED",
  SEARCHED: "SEARCHED",
  QUEUED: "QUEUED",
  TAPE_ADDED: "TAPE_ADDED",
  MEMORY_ADDED: "MEMORY_ADDED",
  RECOMMENDATION_ACCEPTED: "RECOMMENDATION_ACCEPTED",
  RECOMMENDATION_REJECTED: "RECOMMENDATION_REJECTED",
} as const;

export type EventType =
  (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];

export type TrackListeningEventInput = {
  musicItemId?: string;
  providerTrackId?: string;
  eventType: EventType;
  sessionId?: string;
  positionMs?: number;
  durationMs?: number;
  source?: string;
  contextJson?: Record<string, unknown>;
  idempotencyKey?: string;
};

export type TrackListeningEventResponse = {
  id: string;
  eventType: string;
  timestamp: string;
  duplicate: boolean;
};

function createIdempotencyKey() {
  return crypto.randomUUID();
}

export async function trackListeningEvent(
  input: TrackListeningEventInput,
) {
  let musicItemId =
    input.musicItemId;

  if (!musicItemId) {
    if (!input.providerTrackId) {
      throw new Error(
        "Either musicItemId or providerTrackId is required.",
      );
    }

    const detail =
      await getTrack(
        input.providerTrackId,
      );

    musicItemId =
      detail.musicItemId;
  }

  return apiRequest<TrackListeningEventResponse>(
    "/api/v1/playback/events",
    {
      method: "POST",
      body: JSON.stringify({
        musicItemId,
        eventType: input.eventType,
        sessionId: input.sessionId,
        positionMs: input.positionMs,
        durationMs: input.durationMs,
        source: input.source ?? "WEB",
        contextJson: input.contextJson,
        idempotencyKey:
          input.idempotencyKey ??
          createIdempotencyKey(),
      }),
    },
  );
}
EOF

echo "NEW      apps/web/lib/music/events.ts"

if [ -f apps/web/stores/player-store.ts ]; then
  python3 - <<'PY'
from pathlib import Path

path = Path("apps/web/stores/player-store.ts")
text = path.read_text()
changed = False

if 'from "@/lib/music/events"' not in text:
    anchor = 'import { create } from "zustand";'
    if anchor not in text:
        raise SystemExit(
            "PlayerStore patch aborted: Zustand import anchor not found."
        )
    text = text.replace(
        anchor,
        anchor
        + '\nimport { EVENT_TYPES, trackListeningEvent } from "@/lib/music/events";',
        1,
    )
    changed = True

if "const isReplay =" not in text:
    anchor = "        const currentState = get();"
    if anchor not in text:
        raise SystemExit(
            "PlayerStore patch aborted: playTrack anchor not found."
        )
    text = text.replace(
        anchor,
        anchor
        + "\n"
        + "        const isReplay ="
        + "\n"
        + "          currentState.currentTrack?.id === track.id;",
        1,
    )
    changed = True

if "eventType: isReplay" not in text:
    anchor = "        /*\n         * REAL YOUTUBE PLAYBACK\n         */"
    if anchor not in text:
        raise SystemExit(
            "PlayerStore patch aborted: REAL YOUTUBE PLAYBACK anchor not found."
        )

    block = """        if (track.provider === "youtube") {
          void trackListeningEvent({
            providerTrackId: track.id,
            eventType: isReplay
              ? EVENT_TYPES.REPLAYED
              : EVENT_TYPES.PLAY_STARTED,
            positionMs: 0,
            durationMs: Math.max(
              0,
              Math.round(track.duration * 1000),
            ),
            source: "PLAYER",
          }).catch(() => {
            // Analytics must never break playback.
          });
        }

"""
    text = text.replace(
        anchor,
        block + anchor,
        1,
    )
    changed = True

if 'source: "PLAYER_NEXT"' not in text:
    anchor = """        stopTimer();

        set({
          currentTrack:
            nextTrack,"""
    if anchor not in text:
        raise SystemExit(
            "PlayerStore patch aborted: normal next-transition anchor not found."
        )

    block = """        if (state.currentTrack?.provider === "youtube") {
          void trackListeningEvent({
            providerTrackId: state.currentTrack.id,
            eventType: EVENT_TYPES.SKIPPED,
            positionMs: Math.max(
              0,
              Math.round(state.currentTime * 1000),
            ),
            durationMs: Math.max(
              0,
              Math.round(state.duration * 1000),
            ),
            source: "PLAYER_NEXT",
          }).catch(() => {
            // Analytics must never break playback.
          });
        }

"""
    replacement = (
        "        stopTimer();\n\n"
        + block
        + """        set({
          currentTrack:
            nextTrack,"""
    )
    text = text.replace(anchor, replacement, 1)
    changed = True

if changed:
    path.write_text(text)
    print("UPDATE   apps/web/stores/player-store.ts")
else:
    print("SKIP     apps/web/stores/player-store.ts (already patched)")
PY
else
  echo "WARN     apps/web/stores/player-store.ts not found; event client is still ready."
fi

echo
echo "== Prisma format =="
pnpm --dir services/api exec prisma format \
  --schema ../../database/prisma/schema.prisma

echo
echo "== Apply manual Day 21 SQL =="
pnpm --dir services/api exec prisma db execute \
  --schema ../../database/prisma/schema.prisma \
  --file ../../database/prisma/manual-day21-event-pipeline.sql

echo
echo "== Prisma generate =="
pnpm --dir services/api exec prisma generate \
  --schema ../../database/prisma/schema.prisma

echo
echo "== Source verification =="

grep -q 'model ListeningEvent {' database/prisma/schema.prisma
grep -q 'enum ListeningEventType {' database/prisma/schema.prisma
grep -q 'Controller("playback/events")' \
  services/api/src/modules/analytics/analytics.controller.ts
grep -q 'AnalyticsModule' services/api/src/app.module.ts
grep -q 'trackListeningEvent' apps/web/lib/music/events.ts

echo "OK  ListeningEvent model"
echo "OK  AnalyticsController"
echo "OK  AnalyticsModule"
echo "OK  Frontend event client"

echo
echo "=============================================="
echo "DAY 21 BASE IMPLEMENTATION COMPLETE"
echo "=============================================="
echo
echo "API:"
echo "  POST /api/v1/playback/events"
echo "  GET  /api/v1/playback/events/recent?limit=25"
echo
echo "Idempotency:"
echo "  userId + idempotencyKey"
echo
echo "SAVE HOOK:"
echo "  After successful Day 20 Save, call:"
echo "  void trackListeningEvent({"
echo "    musicItemId: detail.musicItemId,"
echo "    eventType: EVENT_TYPES.SAVED,"
echo "    source: \"LIBRARY\","
echo "  }).catch(() => {});"
echo
echo "Backup: $BACKUP"
