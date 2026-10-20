import { apiRequest } from "@/lib/api/client";

export type LibraryMusicItem = {
  id: string;
  provider: string;
  providerTrackId: string;
  title: string;
  durationMs: number;
  releaseDate: string | null;
  artworkUrl: string | null;
  genreData?: unknown;
  artist: {
    id: string;
    providerArtistId: string;
    name: string;
    imageUrl: string | null;
  } | null;
  album: {
    id: string;
    providerAlbumId: string;
    title: string;
    releaseDate: string | null;
    artworkUrl: string | null;
  } | null;
};

export type SavedLibraryItem = {
  id: string;
  userId: string;
  musicItemId: string;
  createdAt: string;
  updatedAt: string;
  musicItem: LibraryMusicItem;
};

type LibraryListResponse = {
  count: number;
  items: SavedLibraryItem[];
};

type LibraryStatusResponse = {
  saved: boolean;
  item: SavedLibraryItem | null;
};

export async function getLibrary(): Promise<SavedLibraryItem[]> {
  const response =
    await apiRequest<LibraryListResponse>(
      "/api/v1/library",
    );

  return response.items;
}

export async function getSavedTrackStatus(
  musicItemId: string,
): Promise<LibraryStatusResponse> {
  return apiRequest<LibraryStatusResponse>(
    `/api/v1/library/tracks/${encodeURIComponent(
      musicItemId,
    )}`,
  );
}

export async function saveTrack(
  musicItemId: string,
): Promise<SavedLibraryItem> {
  return apiRequest<SavedLibraryItem>(
    `/api/v1/library/tracks/${encodeURIComponent(
      musicItemId,
    )}`,
    {
      method: "POST",
    },
  );
}

export async function unsaveTrack(
  musicItemId: string,
): Promise<void> {
  await apiRequest<null>(
    `/api/v1/library/tracks/${encodeURIComponent(
      musicItemId,
    )}`,
    {
      method: "DELETE",
    },
  );
}
