import { apiRequest } from "@/lib/api/client";

export type DailyListeningAggregate = {
  userId: string;
  bucketDate: string;
  totalEvents: number;
  playStarted: number;
  playCompleted: number;
  skipped: number;
  paused: number;
  replayed: number;
  saved: number;
  unsaved: number;
  searched: number;
  queued: number;
  listeningMs: number;
  uniqueTracks: number;
  updatedAt: string;
};

export type ListeningSummary = {
  days: number;
  totalEvents: number;
  playStarted: number;
  playCompleted: number;
  skipped: number;
  paused: number;
  replayed: number;
  saved: number;
  unsaved: number;
  searched: number;
  queued: number;
  listeningMs: number;
  listeningMinutes: number;
  uniqueTracks: number;
  completionRate: number;
  skipRate: number;
};

type DailyResponse = {
  count: number;
  items: DailyListeningAggregate[];
};

export async function getListeningDaily(
  days = 30,
) {
  return apiRequest<DailyResponse>(
    "/api/v1/analytics/aggregation/daily",
    {
      method: "GET",
      query: {
        days,
      },
    },
  );
}

export async function getListeningSummary(
  days = 30,
) {
  return apiRequest<ListeningSummary>(
    "/api/v1/analytics/aggregation/summary",
    {
      method: "GET",
      query: {
        days,
      },
    },
  );
}

export async function rebuildListeningAggregates(
  days = 30,
) {
  return apiRequest<{
    days: number;
    rawEvents: number;
    aggregateDays: number;
    invalidTimingEvents: number;
  }>(
    "/api/v1/analytics/aggregation/rebuild",
    {
      method: "POST",
      query: {
        days,
      },
    },
  );
}
