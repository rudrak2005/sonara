"use client";

import {
  Check,
  ChevronDown,
  ChevronUp,
  ListMusic,
  Loader2,
  Play,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  type PlayerTrack,
  usePlayerStore,
} from "@/stores/player-store";

import {
  clearQueue,
  getQueue,
  removeQueueItem,
  reorderQueueItem,
  type QueueItem,
} from "@/lib/music/queue";

function toPlayerTrack(item: QueueItem): PlayerTrack {
  const musicItem = item.musicItem;

  const isYouTube =
    musicItem.provider.toLowerCase() === "youtube";

  return {
    id: musicItem.providerTrackId,
    title: musicItem.title,
    artist: musicItem.artist?.name ?? "Unknown artist",
    album: musicItem.album?.title ?? "Unknown album",
    duration: Math.floor(
      musicItem.durationMs / 1000,
    ),
    artwork:
      musicItem.artworkUrl ?? undefined,
    provider: isYouTube
      ? "youtube"
      : "local-demo",
    videoId: isYouTube
      ? musicItem.providerTrackId
      : undefined,
  };
}

function formatDuration(durationMs: number) {
  const totalSeconds = Math.floor(
    durationMs / 1000,
  );

  const minutes = Math.floor(
    totalSeconds / 60,
  );

  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

export function QueueDrawer() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(
    null,
  );
  const [error, setError] = useState<string | null>(
    null,
  );

  const playTrack = usePlayerStore(
    (state) => state.playTrack,
  );

  const setQueue = usePlayerStore(
    (state) => state.setQueue,
  );

  const currentTrack = usePlayerStore(
    (state) => state.currentTrack,
  );

  const playerQueue = useMemo(
    () => items.map(toPlayerTrack),
    [items],
  );

  async function refreshQueue() {
    try {
      setError(null);
      const nextItems = await getQueue();

      setItems(nextItems);
      setQueue(
        nextItems.map(toPlayerTrack),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load queue.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshQueue();

    const handleQueueUpdated = () => {
      void refreshQueue();
    };

    window.addEventListener(
      "sonora:queue-updated",
      handleQueueUpdated,
    );

    return () => {
      window.removeEventListener(
        "sonora:queue-updated",
        handleQueueUpdated,
      );
    };
  }, []);

  async function handleMove(
    item: QueueItem,
    direction: "up" | "down",
  ) {
    const targetPosition =
      direction === "up"
        ? item.position - 1
        : item.position + 1;

    if (
      targetPosition < 0 ||
      targetPosition >= items.length
    ) {
      return;
    }

    try {
      setBusyId(item.id);
      setError(null);

      await reorderQueueItem(
        item.id,
        targetPosition,
      );

      await refreshQueue();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to reorder queue.",
      );
    } finally {
      setBusyId(null);
    }
  }

  async function handleRemove(item: QueueItem) {
    try {
      setBusyId(item.id);
      setError(null);

      await removeQueueItem(item.id);

      await refreshQueue();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to remove queue item.",
      );
    } finally {
      setBusyId(null);
    }
  }

  async function handleClear() {
    try {
      setBusyId("clear");
      setError(null);

      await clearQueue();

      await refreshQueue();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to clear queue.",
      );
    } finally {
      setBusyId(null);
    }
  }

  function handlePlay(item: QueueItem) {
    const track = toPlayerTrack(item);

    playTrack(track, playerQueue);
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open queue"
        className="fixed bottom-24 right-5 z-40 flex items-center gap-2 rounded-full border border-white/10 bg-[#211813]/95 px-4 py-3 text-xs font-medium uppercase tracking-[0.15em] text-[#F5EFE8] shadow-2xl backdrop-blur-xl transition hover:border-white/20 hover:bg-[#2A1D16]"
      >
        <ListMusic
          className="h-4 w-4"
          aria-hidden="true"
        />

        <span>Queue</span>

        {items.length > 0 && (
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px]">
            {items.length}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close queue"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />

          <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#17110E]/98 shadow-2xl backdrop-blur-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#8F8175]">
                  Persistent playback
                </p>

                <h2 className="mt-1 text-xl font-semibold text-[#F5EFE8]">
                  Queue
                </h2>
              </div>

              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    type="button"
                    onClick={() => void handleClear()}
                    disabled={busyId === "clear"}
                    className="rounded-xl border border-white/10 px-3 py-2 text-[10px] uppercase tracking-[0.15em] text-[#B5A69B] transition hover:border-white/20 hover:text-[#F5EFE8] disabled:opacity-50"
                  >
                    {busyId === "clear"
                      ? "Clearing"
                      : "Clear"}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close queue"
                  className="rounded-xl border border-white/10 p-2 text-[#B5A69B] transition hover:border-white/20 hover:text-[#F5EFE8]"
                >
                  <X
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>

            {error && (
              <div className="mx-5 mt-4 rounded-xl border border-red-300/10 bg-red-300/[0.04] px-4 py-3 text-xs text-red-200">
                {error}
              </div>
            )}

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              {loading ? (
                <div className="flex min-h-48 items-center justify-center text-[#8F8175]">
                  <Loader2
                    className="h-5 w-5 animate-spin"
                    aria-hidden="true"
                  />
                </div>
              ) : items.length === 0 ? (
                <div className="flex min-h-64 flex-col items-center justify-center text-center">
                  <ListMusic
                    className="h-10 w-10 text-[#776A60]"
                    aria-hidden="true"
                  />

                  <p className="mt-4 text-sm text-[#F5EFE8]">
                    Your queue is empty
                  </p>

                  <p className="mt-1 max-w-xs text-xs leading-5 text-[#776A60]">
                    Add tracks from search results and
                    they will stay here after refresh.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {items.map((item, index) => {
                    const track = item.musicItem;
                    const isCurrent =
                      currentTrack?.id ===
                      track.providerTrackId;

                    const isBusy =
                      busyId === item.id;

                    return (
                      <div
                        key={item.id}
                        className={`rounded-2xl border p-3 transition ${
                          isCurrent
                            ? "border-[#C9B29B]/30 bg-[#C9B29B]/[0.07]"
                            : "border-white/10 bg-white/[0.02] hover:border-white/15"
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#201814]">
                            {track.artworkUrl ? (
                              <img
                                src={track.artworkUrl}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[#776A60]">
                                <ListMusic
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-[#F5EFE8]">
                              {track.title}
                            </p>

                            <p className="mt-0.5 truncate text-xs text-[#B5A69B]">
                              {track.artist?.name ??
                                "Unknown artist"}
                            </p>

                            <div className="mt-1 flex items-center gap-2 text-[10px] text-[#776A60]">
                              <span>
                                {formatDuration(
                                  track.durationMs,
                                )}
                              </span>

                              {isCurrent && (
                                <span className="inline-flex items-center gap-1 uppercase tracking-[0.12em] text-[#C9B29B]">
                                  <Check
                                    className="h-3 w-3"
                                    aria-hidden="true"
                                  />
                                  Playing
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handlePlay(item)
                            }
                            aria-label={`Play ${track.title}`}
                            className="self-center rounded-xl border border-white/10 p-2 text-[#F5EFE8] transition hover:border-white/20 hover:bg-white/[0.06]"
                          >
                            <Play
                              className="h-4 w-4 fill-current"
                              aria-hidden="true"
                            />
                          </button>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-[0.16em] text-[#665B54]">
                            #{index + 1}
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                void handleMove(
                                  item,
                                  "up",
                                )
                              }
                              disabled={
                                index === 0 ||
                                isBusy
                              }
                              aria-label="Move up"
                              className="rounded-lg border border-white/10 p-1.5 text-[#8F8175] transition hover:text-[#F5EFE8] disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <ChevronUp
                                className="h-3.5 w-3.5"
                                aria-hidden="true"
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                void handleMove(
                                  item,
                                  "down",
                                )
                              }
                              disabled={
                                index ===
                                  items.length - 1 ||
                                isBusy
                              }
                              aria-label="Move down"
                              className="rounded-lg border border-white/10 p-1.5 text-[#8F8175] transition hover:text-[#F5EFE8] disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <ChevronDown
                                className="h-3.5 w-3.5"
                                aria-hidden="true"
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                void handleRemove(
                                  item,
                                )
                              }
                              disabled={isBusy}
                              aria-label={`Remove ${track.title}`}
                              className="ml-1 rounded-lg border border-white/10 p-1.5 text-[#8F8175] transition hover:border-red-300/20 hover:text-red-200 disabled:opacity-40"
                            >
                              {isBusy ? (
                                <Loader2
                                  className="h-3.5 w-3.5 animate-spin"
                                  aria-hidden="true"
                                />
                              ) : (
                                <Trash2
                                  className="h-3.5 w-3.5"
                                  aria-hidden="true"
                                />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}