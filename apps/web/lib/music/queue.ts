import { apiRequest } from "@/lib/api/client";

export type QueueMusicItem = {
  id: string;
  provider: string;
  providerTrackId: string;
  title: string;
  durationMs: number;
  artworkUrl: string | null;

  artist: {
    id?: string;
    providerArtistId?: string;
    name: string;
    imageUrl?: string | null;
  } | null;

  album: {
    id?: string;
    providerAlbumId?: string;
    title: string;
    artworkUrl?: string | null;
  } | null;
};

export type QueueItem = {
  id: string;
  userId: string;
  musicItemId: string;
  position: number;
  createdAt: string;
  updatedAt: string;
  musicItem: QueueMusicItem;
};

type QueueListResponse = {
  count: number;
  items: QueueItem[];
};

export async function getQueue(): Promise<QueueItem[]> {
  const response =
    await apiRequest<QueueListResponse>(
      "/api/v1/queue",
    );

  return response.items;
}

export async function addQueueItem(
  musicItemId: string,
): Promise<QueueItem | null> {
  return apiRequest<QueueItem | null>(
    "/api/v1/queue",
    {
      method: "POST",
      body: JSON.stringify({
        musicItemId,
      }),
    },
  );
}

export async function reorderQueueItem(
  id: string,
  position: number,
): Promise<QueueItem | null> {
  return apiRequest<QueueItem | null>(
    `/api/v1/queue/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        position,
      }),
    },
  );
}

export async function removeQueueItem(
  id: string,
): Promise<void> {
  await apiRequest<null>(
    `/api/v1/queue/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    },
  );
}

export async function clearQueue(): Promise<void> {
  await apiRequest<null>(
    "/api/v1/queue",
    {
      method: "DELETE",
    },
  );
}