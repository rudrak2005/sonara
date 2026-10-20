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
