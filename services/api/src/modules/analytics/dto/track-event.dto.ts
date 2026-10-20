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
