import { apiRequest } from "@/lib/api/client";

export type TrackDetail = {
  musicItemId: string;

  provider: string;

  providerTrackId: string;

  title: string;

  artist: {
    providerArtistId: string;
    name: string;
    imageUrl: string | null;
  } | null;

  album: {
    providerAlbumId: string;
    title: string;
    releaseDate: string | null;
    artworkUrl: string | null;
  } | null;

  durationMs: number;

  releaseDate: string | null;

  genres: string[];

  artworkUrl: string | null;

  metadata: Record<string, unknown>;

  playback:
    | {
        type: "youtube-iframe";
        videoId: string;
      }
    | {
        type: "demo";
      };
};

type TrackDetailResponse = {
  success: boolean;

  data?: TrackDetail;

  error?: {
    code?: string;
    message?: string;
  };
};

export async function getTrack(
  providerTrackId: string,
): Promise<TrackDetail> {
  const response =
    await apiRequest<TrackDetailResponse>(
      `/api/v1/music/tracks/${encodeURIComponent(
        providerTrackId,
      )}`,
    );

  if (
    !response.success ||
    !response.data
  ) {
    throw new Error(
      response.error?.message ??
        "Track not found.",
    );
  }

  return response.data;
}