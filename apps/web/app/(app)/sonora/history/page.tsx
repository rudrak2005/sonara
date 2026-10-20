"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getDailyAggregation,
  getTopTrackAggregation,
  type DailyAggregate,
  type TrackAggregate,
} from "@/lib/music/aggregation";

function toNumber(
  value: string | number,
) {
  return Number(value) || 0;
}

function formatMinutes(
  milliseconds: string | number,
) {
  const minutes = Math.round(
    toNumber(milliseconds) /
      60_000,
  );

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(
    minutes / 60,
  );

  const remaining =
    minutes % 60;

  return remaining
    ? `${hours}h ${remaining}m`
    : `${hours}h`;
}

export default function HistoryPage() {
  const [daily, setDaily] =
    useState<DailyAggregate[]>(
      [],
    );

  const [tracks, setTracks] =
    useState<TrackAggregate[]>(
      [],
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(
      null,
    );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [
          dailyResponse,
          trackResponse,
        ] = await Promise.all([
          getDailyAggregation(30),
          getTopTrackAggregation(
            30,
            20,
          ),
        ]);

        if (cancelled) {
          return;
        }

        setDaily(
          dailyResponse.items,
        );

        setTracks(
          trackResponse.items,
        );
      } catch (cause) {
        if (!cancelled) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Unable to load history.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const totals = useMemo(() => {
    return daily.reduce(
      (acc, item) => {
        acc.plays +=
          item.playStartedCount;
        acc.completed +=
          item.completedCount;
        acc.skipped +=
          item.skippedCount;
        acc.saved +=
          item.savedCount;
        acc.listenMs += toNumber(
            item.totalListenMs,
          );
        acc.tracks +=
          item.uniqueTrackCount;

        return acc;
      },
      {
        plays: 0,
        completed: 0,
        skipped: 0,
        saved: 0,
        listenMs: 0,
        tracks: 0,
      },
    );
  }, [daily]);

  const maxPlays =
    Math.max(
      1,
      ...daily.map(
        (item) =>
          item.playStartedCount +
          item.completedCount,
      ),
    );

  return (
    <main className="min-h-screen px-6 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="mb-2 text-xs uppercase tracking-[0.35em] text-white/45">
            SONORA / ANALYTICS
          </p>

          <h1 className="text-3xl font-semibold tracking-tight">
            Listening History
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-white/55">
            Your raw listening events are
            transformed into private,
            reusable listening signals.
          </p>
        </div>

        {loading && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-sm text-white/55">
            Building your listening
            signals...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-400/20 bg-red-500/[0.06] p-8">
            <p className="text-sm text-red-200">
              {error}
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          daily.length === 0 &&
          tracks.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-10 text-center">
              <h2 className="text-lg font-medium">
                No listening data yet
              </h2>

              <p className="mt-2 text-sm text-white/50">
                Play a few tracks in SONORA
                and your history will appear
                here.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          (daily.length > 0 ||
            tracks.length > 0) && (
            <>
              <section className="grid gap-4 md:grid-cols-5">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-xs uppercase tracking-wider text-white/45">
                    Plays
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {totals.plays}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-xs uppercase tracking-wider text-white/45">
                    Completed
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {totals.completed}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-xs uppercase tracking-wider text-white/45">
                    Skipped
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {totals.skipped}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-xs uppercase tracking-wider text-white/45">
                    Saved
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {totals.saved}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-xs uppercase tracking-wider text-white/45">
                    Listening
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {formatMinutes(
                      totals.listenMs.toString(),
                    )}
                  </p>
                </div>
              </section>

              <section className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                  <div className="mb-6">
                    <h2 className="font-medium">
                      Daily activity
                    </h2>
                    <p className="mt-1 text-xs text-white/45">
                      Last 30 days
                    </p>
                  </div>

                  <div className="space-y-3">
                    {daily.map(
                      (item) => {
                        const value =
                          item.playStartedCount +
                          item.completedCount;

                        const width = Math.max(
                          4,
                          Math.round(
                            (value /
                              maxPlays) *
                              100,
                          ),
                        );

                        return (
                          <div
                            key={item.id}
                            className="grid grid-cols-[70px_1fr_45px] items-center gap-3"
                          >
                            <span className="text-xs text-white/45">
                              {item.day.slice(
                                5,
                              )}
                            </span>

                            <div className="h-2 overflow-hidden rounded-full bg-white/8">
                              <div
                                className="h-full rounded-full bg-white/70"
                                style={{
                                  width: `${width}%`,
                                }}
                              />
                            </div>

                            <span className="text-right text-xs text-white/55">
                              {value}
                            </span>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                  <div className="mb-6">
                    <h2 className="font-medium">
                      Top tracks
                    </h2>
                    <p className="mt-1 text-xs text-white/45">
                      By play count
                    </p>
                  </div>

                  <div className="space-y-4">
                    {tracks.map(
                      (
                        track,
                        index,
                      ) => (
                        <div
                          key={track.id}
                          className="flex items-center gap-3"
                        >
                          <span className="w-5 text-xs text-white/35">
                            {index + 1}
                          </span>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                              {
                                track
                                  .musicItem
                                  .title
                              }
                            </p>

                            <p className="truncate text-xs text-white/45">
                              {
                                track
                                  .musicItem
                                  .artist
                                  ?.name ??
                                "Unknown artist"
                              }
                            </p>
                          </div>

                          <span className="text-xs text-white/50">
                            {track.playCount}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </section>
            </>
          )}
      </div>
    </main>
  );
}
