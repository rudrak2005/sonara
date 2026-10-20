"use client";

import {
  Bookmark,
  Check,
  ListPlus,
  Loader2,
  Music2,
  Play,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";

import { GlassPanel } from "@sonora/ui";

import { getTrack } from "@/lib/music/track";
import { addQueueItem } from "@/lib/music/queue";
import {
  getLibrary,
  saveTrack,
  unsaveTrack,
} from "@/lib/music/library";

import {
  type PlayerTrack,
  usePlayerStore,
} from "@/stores/player-store";

export type SearchItem = {
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

type SearchResultsProps = {
  provider: string;
  cached: boolean;
  total: number;
  items: SearchItem[];
};

function formatDuration(
  durationMs: number,
) {
  const totalSeconds = Math.floor(
    durationMs / 1000,
  );

  const minutes = Math.floor(
    totalSeconds / 60,
  );

  const seconds =
    totalSeconds % 60;

  return `${minutes}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

export function SearchResults({
  provider,
  cached,
  total,
  items,
}: SearchResultsProps) {
  const playTrack = usePlayerStore(
    (state) => state.playTrack,
  );

  const [
    queueingId,
    setQueueingId,
  ] = useState<string | null>(null);

  const [
    queuedIds,
    setQueuedIds,
  ] = useState<Set<string>>(
    new Set(),
  );

  const [
    queueError,
    setQueueError,
  ] = useState<string | null>(null);

  const [
    savingId,
    setSavingId,
  ] = useState<string | null>(null);

  const [
    savedIds,
    setSavedIds,
  ] = useState<Set<string>>(
    new Set(),
  );

  const [
    saveError,
    setSaveError,
  ] = useState<string | null>(null);

  function handlePlay(
    item: SearchItem,
  ) {
    const isYouTube =
      provider.toLowerCase() ===
      "youtube";

    const queue: PlayerTrack[] =
      items.map((searchItem) => ({
        id:
          searchItem.providerTrackId,

        title:
          searchItem.title,

        artist:
          searchItem.artist?.name ??
          "Unknown artist",

        album:
          searchItem.album?.title ??
          "Unknown album",

        duration: Math.floor(
          searchItem.durationMs /
            1000,
        ),

        artwork:
          searchItem.artworkUrl ??
          undefined,

        provider: isYouTube
          ? "youtube"
          : "local-demo",

        videoId: isYouTube
          ? searchItem.providerTrackId
          : undefined,
      }));

    const selectedTrack =
      queue.find(
        (track) =>
          track.id ===
          item.providerTrackId,
      );

    if (!selectedTrack) {
      return;
    }

    playTrack(
      selectedTrack,
      queue,
    );
  }

  async function handleAddToQueue(
    item: SearchItem,
  ) {
    try {
      setQueueingId(
        item.providerTrackId,
      );

      setQueueError(null);

      /*
       * Ensure the provider track is
       * persisted as a MusicItem and
       * get the durable musicItemId.
       */
      const detail = await getTrack(
        item.providerTrackId,
      );

      await addQueueItem(
        detail.musicItemId,
      );

      setQueuedIds(
        (current) => {
          const next =
            new Set(current);

          next.add(
            item.providerTrackId,
          );

          return next;
        },
      );

      window.dispatchEvent(
        new Event(
          "sonora:queue-updated",
        ),
      );
    } catch (error) {
      setQueueError(
        error instanceof Error
          ? error.message
          : "Unable to add track to queue.",
      );
    } finally {
      setQueueingId(null);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadSavedTracks() {
      try {
        const library =
          await getLibrary();

        if (cancelled) {
          return;
        }

        setSavedIds(
          new Set(
            library.map(
              (track) =>
                track.musicItem
                  .providerTrackId,
            ),
          ),
        );
      } catch {
        if (!cancelled) {
          setSavedIds(new Set());
        }
      }
    }

    void loadSavedTracks();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSaveToggle(
    item: SearchItem,
  ) {
    try {
      setSavingId(item.providerTrackId);
      setSaveError(null);

      const detail = await getTrack(
        item.providerTrackId,
      );

      const isSaved =
        savedIds.has(
          item.providerTrackId,
        );

      if (isSaved) {
        await unsaveTrack(
          detail.musicItemId,
        );
      } else {
        await saveTrack(
          detail.musicItemId,
        );
      }

      setSavedIds(
        (current) => {
          const next = new Set(
            current,
          );

          if (isSaved) {
            next.delete(
              item.providerTrackId,
            );
          } else {
            next.add(
              item.providerTrackId,
            );
          }

          return next;
        },
      );

      window.dispatchEvent(
        new Event(
          "sonora:library-updated",
        ),
      );
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Unable to update library.",
      );
    } finally {
      setSavingId(null);
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#B5A69A]">
            {total}{" "}
            {total === 1
              ? "result"
              : "results"}
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-[#F5EFE8]">
            Search results
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-[#C9B29B]">
            YouTube Music
          </span>

          <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-[#8F8175]">
            ytmusicapi
          </span>

          <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-[#8F8175]">
            {cached
              ? "CACHE HIT"
              : "LIVE SEARCH"}
          </span>

          <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-[#8F8175]">
            {provider}
          </span>

          <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-[#8F8175]">
            {cached
              ? "CACHE HIT"
              : "LIVE PROVIDER"}
          </span>
        </div>
      </div>

      {queueError && (
        <div className="rounded-xl border border-red-300/10 bg-red-300/[0.04] px-4 py-3 text-xs text-red-200">
          {queueError}
        </div>
      )}

      {saveError && (
        <div className="rounded-xl border border-red-300/10 bg-red-300/[0.04] px-4 py-3 text-xs text-red-200">
          {saveError}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => {
          const isQueueing =
            queueingId ===
            item.providerTrackId;

          const isQueued =
            queuedIds.has(
              item.providerTrackId,
            );

  return (
            <GlassPanel
              key={`${provider}:${item.providerTrackId}`}
              className="group p-4 transition hover:border-white/20"
            >
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() =>
                    handlePlay(item)
                  }
                  aria-label={`Play ${item.title}`}
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#201814]"
                >
                  {item.artworkUrl ? (
                    <img
                      src={item.artworkUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[#8F8175]">
                      <Music2
                        className="h-7 w-7"
                        aria-hidden="true"
                      />
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5EFE8] text-black">
                      <Play
                        className="ml-0.5 h-4 w-4 fill-current"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </button>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-lg font-semibold text-[#F5EFE8]">
                    {item.title}
                  </h3>

                  <div className="mt-1 flex items-center gap-2 text-sm text-[#B5A69A]">
                    <UserRound
                      className="h-3.5 w-3.5 shrink-0"
                      aria-hidden="true"
                    />

                    <span className="truncate">
                      {item.artist?.name ??
                        "Unknown artist"}
                    </span>
                  </div>

                  <p className="mt-1 truncate text-xs text-[#776A60]">
                    {item.album?.title ??
                      "Unknown album"}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {item.genres
                      .slice(0, 2)
                      .map(
                        (genre) => (
                          <span
                            key={genre}
                            className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-[#988A7E]"
                          >
                            {genre}
                          </span>
                        ),
                      )}

                    <span className="text-[11px] text-[#776A60]">
                      {formatDuration(
                        item.durationMs,
                      )}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        void handleSaveToggle(
                          item,
                        )
                      }
                      disabled={
                        savingId ===
                        item.providerTrackId
                      }
                      aria-label={
                        savedIds.has(
                          item.providerTrackId,
                        )
                          ? `Unsave ${item.title}`
                          : `Save ${item.title}`
                      }
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-[#C9B29B] transition hover:border-white/20 hover:bg-white/[0.06] disabled:opacity-50"
                    >
                      {savingId ===
                      item.providerTrackId ? (
                        <span className="h-3 w-3 animate-spin rounded-full border border-white/20 border-t-white" />
                      ) : (
                        <Bookmark
                          className="h-3 w-3"
                          fill={
                            savedIds.has(
                              item.providerTrackId,
                            )
                              ? "currentColor"
                              : "none"
                          }
                          aria-hidden="true"
                        />
                      )}
                      {savedIds.has(
                        item.providerTrackId,
                      )
                        ? "Saved"
                        : "Save"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        void handleAddToQueue(
                          item,
                        )
                      }
                      disabled={isQueueing}
                      aria-label={
                        isQueued
                          ? `${item.title} already queued`
                          : `Add ${item.title} to queue`
                      }
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-[#C9B29B] transition hover:border-white/20 hover:bg-white/[0.06] disabled:opacity-50"
                    >
                      {isQueueing ? (
                        <>
                          <Loader2
                            className="h-3 w-3 animate-spin"
                            aria-hidden="true"
                          />
                          Adding
                        </>
                      ) : isQueued ? (
                        <>
                          <Check
                            className="h-3 w-3"
                            aria-hidden="true"
                          />
                          Queued
                        </>
                      ) : (
                        <>
                          <ListPlus
                            className="h-3 w-3"
                            aria-hidden="true"
                          />
                          Add to Queue
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </GlassPanel>
          );
        })}
      </div>
    </section>
  );
}