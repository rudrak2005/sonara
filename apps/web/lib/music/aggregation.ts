import { apiRequest } from "@/lib/api/client";

export type DailyAggregate = {
  id: string;
  userId: string;
  day: string;
  playStartedCount: number;
  completedCount: number;
  skippedCount: number;
  replayedCount: number;
  savedCount: number;
  totalListenMs: string | number;
  uniqueTrackCount: number;
};

export type TrackAggregate = {
  id: string;
  userId: string;
  musicItemId: string;
  playCount: number;
  completedCount: number;
  skippedCount: number;
  replayedCount: number;
  savedCount: number;
  totalListenMs: string | number;
  lastPlayedAt: string | null;
  musicItem: {
    id: string;
    title: string;
    artworkUrl: string | null;
    durationMs: number;
    artist: {
      name: string;
    } | null;
    album: {
      title: string;
    } | null;
  };
};

type DailyResponse = {
  success: boolean;
  data?: {
    days: number;
    count: number;
    items: DailyAggregate[];
  };
  error?: {
    message?: string;
  };
};

type TrackResponse = {
  success: boolean;
  data?: {
    days: number;
    count: number;
    items: TrackAggregate[];
  };
  error?: {
    message?: string;
  };
};

export async function getDailyAggregation(
  days = 30,
) {
  const response =
    await apiRequest<DailyResponse>(
      `/api/v1/analytics/aggregation/daily?days=${days}`,
    );

  if (
    !response.success ||
    !response.data
  ) {
    throw new Error(
      response.error?.message ??
        "Unable to load listening history.",
    );
  }

  return response.data;
}

export async function getTopTrackAggregation(
  days = 30,
  limit = 20,
) {
  const response =
    await apiRequest<TrackResponse>(
      `/api/v1/analytics/aggregation/tracks?days=${days}&limit=${limit}`,
    );

  if (
    !response.success ||
    !response.data
  ) {
    throw new Error(
      response.error?.message ??
        "Unable to load top tracks.",
    );
  }

  return response.data;
}
