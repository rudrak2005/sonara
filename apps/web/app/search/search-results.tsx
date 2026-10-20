"use client";

import {
  ArrowUpRight,
  Music2,
  Play,
  UserRound,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { GlassPanel } from "@sonora/ui";

import type { PlayerTrack } from "@/stores/player-store";

import { usePlayerStore } from "@/stores/player-store";

type SearchItem = {
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

type Props = {
  provider: string;

  cached: boolean;

  total: number;

  items: SearchItem[];
};

function formatDuration(
  durationMs: number,
) {
  const totalSeconds =
    Math.max(
      0,
      Math.floor(
        durationMs / 1000,
      ),
    );

  const minutes =
    Math.floor(
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
}: Props) {
  const router =
    useRouter();

  const playTrack =
    usePlayerStore(
      (state) =>
        state.playTrack,
    );

  function createPlayerTrack(
    item: SearchItem,
  ): PlayerTrack {
    const isYouTube =
      provider.toLowerCase() ===
      "youtube";

    return {
      id:
        item.providerTrackId,

      title:
        item.title,

      artist:
        item.artist?.name ??
        "Unknown artist",

      album:
        item.album?.title ??
        "Unknown album",

      duration:
        Math.floor(
          item.durationMs /
            1000,
        ),

      artwork:
        item.artworkUrl ??
        undefined,

      provider:
        isYouTube
          ? "youtube"
          : "local-demo",

      videoId:
        isYouTube
          ? item.providerTrackId
          : undefined,
    };
  }

  function playSearchItem(
    item: SearchItem,
  ) {
    const queue =
      items.map(
        createPlayerTrack,
      );

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

  function openDetails(
    item: SearchItem,
  ) {
    router.push(
      `/sonora/track/${encodeURIComponent(
        item.providerTrackId,
      )}`,
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#B5A69A]">
            {total} result
            {total === 1
              ? ""
              : "s"}
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-[#F5EFE8]">
            Search results
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-[#C9B29B]">
            {provider}
          </span>

          <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-[#8F8175]">
            {cached
              ? "CACHE HIT"
              : "LIVE PROVIDER"}
          </span>
        </div>
      </div>

      {items.length ===
        0 && (
        <GlassPanel className="p-8">
          <p className="text-lg font-medium text-[#F5EFE8]">
            No music found.
          </p>

          <p className="mt-2 text-sm text-[#B5A69A]">
            Try another song,
            artist, or album.
          </p>
        </GlassPanel>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {items.map(
          (item) => (
            <GlassPanel
              key={`${provider}:${item.providerTrackId}`}
              className="group p-4 transition hover:border-white/20"
            >
              <div className="flex gap-4">
                {/* Artwork / Play */}
                <button
                  type="button"
                  onClick={() =>
                    playSearchItem(
                      item,
                    )
                  }
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#201814]"
                  aria-label={`Play ${item.title}`}
                >
                  {item.artworkUrl ? (
                    <img
                      src={
                        item.artworkUrl
                      }
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
                        className="ml-0.5 h-4 w-4"
                        fill="currentColor"
                      />
                    </span>
                  </div>
                </button>

                {/* Information */}
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
                      {item.artist
                        ?.name ??
                        "Unknown artist"}
                    </span>
                  </div>

                  <p className="mt-1 truncate text-xs text-[#776A60]">
                    {item.album
                      ?.title ??
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
                        openDetails(
                          item,
                        )
                      }
                      className="ml-auto flex items-center gap-1 rounded-full border border-white/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-[#C9B29B] transition hover:bg-white/[0.05]"
                      aria-label={`Open details for ${item.title}`}
                    >
                      Details

                      <ArrowUpRight
                        size={12}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </GlassPanel>
          ),
        )}
      </div>
    </section>
  );
}