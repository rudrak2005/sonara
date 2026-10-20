"use client";

import {
  Bookmark,
  Loader2,
  Music2,
  Play,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

import { GlassPanel } from "@sonora/ui";

import {
  getLibrary,
  unsaveTrack,
  type SavedLibraryItem,
} from "@/lib/music/library";
import {
  type PlayerTrack,
  usePlayerStore,
} from "@/stores/player-store";

function formatDuration(durationMs: number) {
  const totalSeconds = Math.max(
    0,
    Math.floor(durationMs / 1000),
  );
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function toPlayerTrack(
  item: SavedLibraryItem,
): PlayerTrack {
  const track = item.musicItem;

  const isYouTube =
    track.provider.toLowerCase() === "youtube";

  return {
    id: track.providerTrackId,
    title: track.title,
    artist: track.artist?.name ?? "Unknown artist",
    album: track.album?.title ?? "Unknown album",
    duration: Math.floor(track.durationMs / 1000),
    artwork: track.artworkUrl ?? undefined,
    provider: isYouTube ? "youtube" : "local-demo",
    videoId: isYouTube ? track.providerTrackId : undefined,
  };
}

export default function LibraryPage() {
  const playTrack = usePlayerStore(
    (state) => state.playTrack,
  );

  const [items, setItems] = useState<SavedLibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refreshLibrary() {
    setLoading(true);
    setError(null);

    try {
      setItems(await getLibrary());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your library.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshLibrary();
  }, []);

  async function handleRemove(item: SavedLibraryItem) {
    try {
      setRemovingId(item.musicItemId);
      await unsaveTrack(item.musicItemId);
      setItems((current) =>
        current.filter(
          (saved) =>
            saved.musicItemId !== item.musicItemId,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to remove track.",
      );
    } finally {
      setRemovingId(null);
    }
  }

  function handlePlay(item: SavedLibraryItem) {
    const queue = items.map(toPlayerTrack);
    const selected = queue.find(
      (track) =>
        track.id === item.musicItem.providerTrackId,
    );

    if (!selected) {
      return;
    }

    playTrack(selected, queue);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-44">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-[#B5A69A]">
          SONORA / LIBRARY
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
              Your library.
            </h1>
            <p className="mt-3 max-w-2xl text-[#B5A69A]">
              Songs you saved for coming back later.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs uppercase tracking-[0.14em] text-[#C9B29B] sm:self-auto">
            <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />
            {items.length} saved
          </div>
        </div>
      </header>

      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-200"
        >
          {error}
        </div>
      )}

      {loading ? (
        <GlassPanel className="flex items-center gap-3 p-8 text-sm text-[#B5A69A]">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Loading your library...
        </GlassPanel>
      ) : items.length === 0 ? (
        <GlassPanel className="p-10 text-center">
          <Bookmark className="mx-auto h-10 w-10 text-[#8F8175]" aria-hidden="true" />
          <h2 className="mt-4 text-xl font-semibold text-[#F5EFE8]">
            Your library is empty.
          </h2>
          <p className="mt-2 text-sm text-[#B5A69A]">
            Open a track and press Save to keep it here.
          </p>
        </GlassPanel>
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {items.map((item) => {
            const track = item.musicItem;
            const removing =
              removingId === item.musicItemId;

            return (
              <GlassPanel
                key={item.id}
                className="group p-4 transition hover:border-white/20"
              >
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => handlePlay(item)}
                    aria-label={`Play ${track.title}`}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#201814]"
                  >
                    {track.artworkUrl ? (
                      <img
                        src={track.artworkUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Music2
                        className="mx-auto mt-6 h-8 w-8 text-[#8F8175]"
                        aria-hidden="true"
                      />
                    )}

                    <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5EFE8] text-black">
                        <Play
                          className="ml-0.5 h-4 w-4 fill-current"
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-semibold text-[#F5EFE8]">
                          {track.title}
                        </h2>
                        <p className="mt-1 truncate text-sm text-[#B5A69A]">
                          {track.artist?.name ?? "Unknown artist"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => void handleRemove(item)}
                        disabled={removing}
                        aria-label={`Remove ${track.title} from library`}
                        className="shrink-0 rounded-xl border border-white/10 bg-white/[0.03] p-2 text-[#C9B29B] transition hover:bg-white/[0.08] disabled:opacity-50"
                      >
                        {removing ? (
                          <Loader2
                            className="h-4 w-4 animate-spin"
                            aria-hidden="true"
                          />
                        ) : (
                          <Trash2
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {track.album?.title && (
                        <span className="max-w-[18rem] truncate rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-[#8F8175]">
                          {track.album.title}
                        </span>
                      )}
                      <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-[#8F8175]">
                        {formatDuration(track.durationMs)}
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-[#8F8175]">
                        {track.provider}
                      </span>
                    </div>
                  </div>
                </div>
              </GlassPanel>
            );
          })}
        </section>
      )}
    </div>
  );
}
