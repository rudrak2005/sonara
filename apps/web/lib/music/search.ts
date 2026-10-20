import { apiRequest } from "@/lib/api/client";

export type MusicSearchItem = {
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
    artworkUrl: string | null;
  } | null;

  durationMs: number;
  artworkUrl: string | null;
  genres: string[];
};

export type MusicSearchResponse = {
  provider: string;
  cached: boolean;
  total: number;
  items: MusicSearchItem[];
};

export async function searchMusic(
  query: string,
  limit = 20,
) {
  const params = new URLSearchParams({
    q: query,
    limit: String(limit),
  });

  return apiRequest<MusicSearchResponse>(
    `/api/v1/music/search?${params.toString()}`,
  );
}