"use client";

import {
  ArrowLeft,
  Bookmark,
  Check,
  Loader2,
  Music2,
  Play,
} from "lucide-react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  useEffect,
  useState,
} from "react";

import { GlassPanel } from "@sonora/ui";

import {
  getTrack,
  type TrackDetail,
} from "@/lib/music/track";

import {
  getSavedTrackStatus,
  saveTrack,
  unsaveTrack,
} from "@/lib/music/library";

import { usePlayerStore } from "@/stores/player-store";

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

export default function TrackDetailPage() {
  const params = useParams();

  const router = useRouter();

  const playTrack =
    usePlayerStore(
      (state) => state.playTrack,
    );

  const [track, setTrack] =
    useState<TrackDetail | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(
      null,
    );

  const [saved, setSaved] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [saveError, setSaveError] =
    useState<string | null>(null);

  const rawTrackId =
    params.trackId;

  const trackId =
    Array.isArray(rawTrackId)
      ? rawTrackId[0]
      : rawTrackId;

  useEffect(() => {
    let cancelled = false;

    async function loadTrack() {
      if (!trackId) {
        setTrack(null);
        setError(
          "Track not found.",
        );
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data =
          await getTrack(
            trackId,
          );

        if (cancelled) {
          return;
        }

        setTrack(data);

        try {
          const status =
            await getSavedTrackStatus(
              data.musicItemId,
            );

          if (!cancelled) {
            setSaved(status.saved);
          }
        } catch {
          if (!cancelled) {
            setSaved(false);
          }
        }
      } catch (err) {
        if (cancelled) {
          return;
        }

        setTrack(null);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load track.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadTrack();

    return () => {
      cancelled = true;
    };
  }, [trackId]);

  function handlePlay() {
    if (!track) {
      return;
    }

    const isYouTube =
      track.playback.type ===
      "youtube-iframe";

    playTrack({
      id:
        track.providerTrackId,

      title:
        track.title,

      artist:
        track.artist?.name ??
        "Unknown artist",

      album:
        track.album?.title ??
        "Unknown album",

      duration:
        Math.floor(
          track.durationMs /
            1000,
        ),

      artwork:
        track.artworkUrl ??
        undefined,

      provider:
        isYouTube
          ? "youtube"
          : "local-demo",

      videoId:
        track.playback.type === "youtube-iframe"
          ? track.playback.videoId
          : undefined,
    });
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10">
          <p className="text-xs uppercase tracking-[0.3em] text-[#D18A4D]">
            SONORA
          </p>

          <p className="mt-3 text-sm text-[#B5A69A]">
            Loading track...
          </p>
        </div>
      </section>
    );
  }

  if (error || !track) {
    return (
      <section className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() =>
            router.push(
              "/sonora/search",
            )
          }
          className="mb-6 flex items-center gap-2 text-sm text-[#B5A69A] transition hover:text-[#F5EFE8]"
        >
          <ArrowLeft size={16} />

          Back to search
        </button>

        <GlassPanel className="p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[#D18A4D]">
            TRACK ERROR
          </p>

          <h1 className="mt-3 text-2xl font-semibold text-[#F5EFE8]">
            Track unavailable
          </h1>

          <p className="mt-2 text-sm text-[#B5A69A]">
            {error ??
              "This track could not be loaded."}
          </p>
        </GlassPanel>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl space-y-8 pb-44">
      <button
        type="button"
        onClick={() =>
          router.push(
            "/sonora/search",
          )
        }
        className="flex items-center gap-2 text-sm text-[#B5A69A] transition hover:text-[#F5EFE8]"
      >
        <ArrowLeft size={16} />

        Back to search
      </button>

      <GlassPanel className="overflow-hidden p-6 md:p-10">
        <div className="grid gap-10 md:grid-cols-[320px_1fr] md:items-center">
          {/* Artwork */}
          <div className="aspect-square overflow-hidden rounded-[28px] border border-white/10 bg-[#201814]">
            {track.artworkUrl ? (
              <img
                src={
                  track.artworkUrl
                }
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[#8F8175]">
                <Music2
                  className="h-20 w-20"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>

          {/* Main information */}
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.3em] text-[#D18A4D]">
              {track.provider}
            </p>

            <h1 className="mt-3 break-words text-4xl font-semibold tracking-tight text-[#F5EFE8] md:text-6xl">
              {track.title}
            </h1>

            <p className="mt-4 text-lg text-[#B5A69A]">
              {track.artist?.name ??
                "Unknown artist"}
            </p>

            <p className="mt-2 text-sm text-[#776A60]">
              {track.album?.title ??
                "Unknown album"}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-[#B5A69A]">
                {formatDuration(
                  track.durationMs,
                )}
              </span>

              {track.releaseDate && (
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-[#B5A69A]">
                  {new Date(
                    track.releaseDate,
                  ).getFullYear()}
                </span>
              )}

              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-[#B5A69A]">
                {track.provider}
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={
                  handlePlay
                }
                className="flex items-center gap-2 rounded-2xl bg-[#D18A4D] px-6 py-3 text-sm font-semibold text-[#0B0908] transition hover:brightness-110"
              >
                <Play
                  size={17}
                  fill="currentColor"
                />

                Play
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={() => {
                  if (!track) {
                    return;
                  }

                  setSaving(true);
                  setSaveError(null);

                  void (async () => {
                    try {
                      if (saved) {
                        await unsaveTrack(
                          track.musicItemId,
                        );
                        setSaved(false);
                      } else {
                        await saveTrack(
                          track.musicItemId,
                        );
                        setSaved(true);
                      }

                      window.dispatchEvent(
                        new Event(
                          "sonora:library-updated",
                        ),
                      );
                    } catch (err) {
                      setSaveError(
                        err instanceof Error
                          ? err.message
                          : "Unable to update your library.",
                      );
                    } finally {
                      setSaving(false);
                    }
                  })();
                }}
                className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-medium text-[#F5EFE8] transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                ) : saved ? (
                  <Check size={17} />
                ) : (
                  <Bookmark size={17} />
                )}

                {saving
                  ? "Saving..."
                  : saved
                    ? "Saved"
                    : "Save"}
              </button>
            </div>

            {saveError && (
              <p className="mt-3 text-sm text-red-200">
                {saveError}
              </p>
            )}
          </div>
        </div>
      </GlassPanel>

      {/* Track information */}
      <GlassPanel className="p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-[#D18A4D]">
          TRACK INFORMATION
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
            <p className="text-xs text-[#776A60]">
              Provider
            </p>

            <p className="mt-2 text-sm text-[#F5EFE8]">
              {track.provider}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
            <p className="text-xs text-[#776A60]">
              Duration
            </p>

            <p className="mt-2 text-sm text-[#F5EFE8]">
              {formatDuration(
                track.durationMs,
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
            <p className="text-xs text-[#776A60]">
              Provider Track ID
            </p>

            <p className="mt-2 break-all text-sm text-[#F5EFE8]">
              {
                track.providerTrackId
              }
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
            <p className="text-xs text-[#776A60]">
              Playback
            </p>

            <p className="mt-2 text-sm text-[#F5EFE8]">
              {track.playback.type}
            </p>
          </div>
        </div>
      </GlassPanel>

      {/* Artist */}
      {track.artist && (
        <GlassPanel className="p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-[#D18A4D]">
            ARTIST
          </p>

          <div className="mt-5 flex items-center gap-4">
            {track.artist.imageUrl ? (
              <img
                src={
                  track.artist
                    .imageUrl
                }
                alt=""
                className="h-14 w-14 rounded-full border border-white/10 object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[#B5A69A]">
                <Music2
                  size={20}
                />
              </div>
            )}

            <div>
              <p className="text-lg font-medium text-[#F5EFE8]">
                {track.artist.name}
              </p>

              <p className="mt-1 text-xs text-[#776A60]">
                {track.artist.providerArtistId}
              </p>
            </div>
          </div>
        </GlassPanel>
      )}

      {/* Album */}
      {track.album && (
        <GlassPanel className="p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-[#D18A4D]">
            ALBUM
          </p>

          <div className="mt-5 flex items-center gap-4">
            {track.album.artworkUrl ? (
              <img
                src={
                  track.album
                    .artworkUrl
                }
                alt=""
                className="h-16 w-16 rounded-xl border border-white/10 object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-[#B5A69A]">
                <Music2
                  size={22}
                />
              </div>
            )}

            <div>
              <p className="text-lg font-medium text-[#F5EFE8]">
                {track.album.title}
              </p>

              {track.album
                .releaseDate && (
                <p className="mt-1 text-xs text-[#776A60]">
                  {new Date(
                    track.album
                      .releaseDate,
                  ).getFullYear()}
                </p>
              )}
            </div>
          </div>
        </GlassPanel>
      )}

      {/* Genres */}
      {track.genres.length >
        0 && (
        <GlassPanel className="p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-[#D18A4D]">
            GENRES
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {track.genres.map(
              (genre) => (
                <span
                  key={genre}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-[#B5A69A]"
                >
                  {genre}
                </span>
              ),
            )}
          </div>
        </GlassPanel>
      )}
    </section>
  );
}