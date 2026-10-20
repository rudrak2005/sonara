import { apiRequest } from "@/lib/api/client";

export type DailyListeningFeature = {
  featureDate: string;
  playStartedCount: number;
  playCompletedCount: number;
  skippedCount: number;
  pausedCount: number;
  replayedCount: number;
  savedCount: number;
  unsavedCount: number;
  queuedCount: number;
  uniqueTrackCount: number;
  uniqueArtistCount: number;
  totalPlayedMs: number | string;
  firstEventAt: string | null;
  lastEventAt: string | null;
};

export type TrackListeningFeature = {
  musicItemId: string;
  title: string;
  artistName: string | null;
  playCount: number;
  completionCount: number;
  skipCount: number;
  replayCount: number;
  saveCount: number;
  totalPlayedMs: number | string;
  lastPlayedAt: string | null;
};

export type HourListeningFeature = {
  hourOfWeek: number;
  eventCount: number;
  playStartedCount: number;
  playCompletedCount: number;
  skippedCount: number;
  replayedCount: number;
};

type AnalyticsResponse<T> = {
  success: boolean;
  data?: {
    items: T[];
  };
  error?: {
    message?: string;
  };
};

async function requestAnalytics<T>(
  path: string,
): Promise<T[]> {
  const response =
    await apiRequest<AnalyticsResponse<T>>(path);

  if (!response.success) {
    throw new Error(
      response.error?.message ??
        "Unable to load listening analytics.",
    );
  }

  return response.data?.items ?? [];
}

export function getDailyListeningFeatures(
  days = 30,
) {
  return requestAnalytics<DailyListeningFeature>(
    `/api/v1/analytics/daily?days=${days}`,
  );
}

export function getTopListeningTracks(
  limit = 20,
) {
  return requestAnalytics<TrackListeningFeature>(
    `/api/v1/analytics/tracks?limit=${limit}`,
  );
}

export function getListeningHourFeatures() {
  return requestAnalytics<HourListeningFeature>(
    "/api/v1/analytics/hours",
  );
}
