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

type QueueResponse = {
  success: boolean;

  data?: {
    count: number;
    items: QueueItem[];
  };

  error?: {
    code?: string;
    message?: string;
  };
};

type QueueMutationResponse = {
  success: boolean;

  data?: QueueItem | null;

  error?: {
    code?: string;
    message?: string;
  };
};

export async function getQueue(): Promise<QueueItem[]> {
  const response =
    await apiRequest<QueueResponse>(
      "/api/v1/queue",
    );

  if (
    !response.success ||
    !response.data
  ) {
    throw new Error(
      response.error?.message ??
        "Unable to load queue.",
    );
  }

  return response.data.items;
}

export async function addQueueItem(
  musicItemId: string,
): Promise<QueueItem | null> {
  const response =
    await apiRequest<QueueMutationResponse>(
      "/api/v1/queue",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          musicItemId,
        }),
      },
    );

  if (!response.success) {
    throw new Error(
      response.error?.message ??
        "Unable to add track to queue.",
    );
  }

  return response.data ?? null;
}

export async function reorderQueueItem(
  id: string,
  position: number,
): Promise<QueueItem | null> {
  const response =
    await apiRequest<QueueMutationResponse>(
      `/api/v1/queue/${encodeURIComponent(id)}`,
      {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          position,
        }),
      },
    );

  if (!response.success) {
    throw new Error(
      response.error?.message ??
        "Unable to reorder queue item.",
    );
  }

  return response.data ?? null;
}

export async function removeQueueItem(
  id: string,
): Promise<void> {
  const response =
    await apiRequest<QueueMutationResponse>(
      `/api/v1/queue/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
      },
    );

  if (!response.success) {
    throw new Error(
      response.error?.message ??
        "Unable to remove queue item.",
    );
  }
}

export async function clearQueue(): Promise<void> {
  const response =
    await apiRequest<QueueMutationResponse>(
      "/api/v1/queue",
      {
        method: "DELETE",
      },
    );

  if (!response.success) {
    throw new Error(
      response.error?.message ??
        "Unable to clear queue.",
    );
  }
}