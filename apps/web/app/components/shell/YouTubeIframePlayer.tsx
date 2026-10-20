"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  setYouTubeController,
} from "@/stores/player-store";

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement,
        options: {
          width?: number | string;

          height?: number | string;

          videoId?: string;

          playerVars?: Record<
            string,
            number | string
          >;

          events?: {
            onReady?: (
              event: {
                target: YTPlayer;
              },
            ) => void;

            onStateChange?: (
              event: {
                target: YTPlayer;
                data: number;
              },
            ) => void;
          };
        },
      ) => YTPlayer;

      PlayerState?: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };

    onYouTubeIframeAPIReady?: () => void;
  }
}

type YTPlayer = {
  loadVideoById(
    videoId: string,
  ): void;

  playVideo(): void;

  pauseVideo(): void;

  seekTo(
    seconds: number,
    allowSeekAhead: boolean,
  ): void;

  setVolume(
    volume: number,
  ): void;

  getCurrentTime(): number;

  getDuration(): number;

  destroy(): void;
};

type YouTubeIframePlayerProps = {
  videoId: string | null;

  isPlaying: boolean;

  repeat: boolean;

  onReady?: () => void;

  onPlaying?: () => void;

  onPaused?: () => void;

  onEnded?: () => void;

  onTimeUpdate?: (
    currentTime: number,
    duration: number,
  ) => void;
};

export function YouTubeIframePlayer({
  videoId,
  isPlaying,
  repeat,
  onReady,
  onPlaying,
  onPaused,
  onEnded,
  onTimeUpdate,
}: YouTubeIframePlayerProps) {
  const containerRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const playerRef =
    useRef<YTPlayer | null>(
      null,
    );

  const intervalRef =
    useRef<ReturnType<
      typeof setInterval
    > | null>(null);

  const readyRef =
    useRef(false);

  const videoIdRef =
    useRef<string | null>(
      videoId,
    );

  const isPlayingRef =
    useRef(isPlaying);

  const repeatRef =
    useRef(repeat);

  const callbacksRef =
    useRef({
      onReady,
      onPlaying,
      onPaused,
      onEnded,
      onTimeUpdate,
    });

  /*
   * Keep latest values in refs.
   */
  useEffect(() => {
    videoIdRef.current =
      videoId;
  }, [videoId]);

  useEffect(() => {
    isPlayingRef.current =
      isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    repeatRef.current =
      repeat;
  }, [repeat]);

  useEffect(() => {
    callbacksRef.current = {
      onReady,
      onPlaying,
      onPaused,
      onEnded,
      onTimeUpdate,
    };
  });

  /*
   * CREATE YOUTUBE PLAYER
   */
  useEffect(() => {
    let cancelled = false;

    const startTimeUpdates =
      () => {
        if (intervalRef.current) {
          return;
        }

        intervalRef.current =
          setInterval(() => {
            const player =
              playerRef.current;

            if (
              !player ||
              !readyRef.current
            ) {
              return;
            }

            const duration =
              player.getDuration();

            const currentTime =
              player.getCurrentTime();

            if (duration > 0) {
              callbacksRef.current.onTimeUpdate?.(
                currentTime,
                duration,
              );
            }
          }, 500);
      };

    const createPlayer =
      () => {
        if (
          cancelled ||
          !containerRef.current ||
          !window.YT?.Player
        ) {
          return;
        }

        const initialVideoId =
          videoIdRef.current;

        const player =
          new window.YT.Player(
            containerRef.current,
            {
              width: "100%",

              height: "270",

              ...(initialVideoId
                ? {
                    videoId:
                      initialVideoId,
                  }
                : {}),

              playerVars: {
                playsinline: 1,
                rel: 0,
              },

              events: {
                onReady: (
                  event,
                ) => {
                  if (
                    cancelled
                  ) {
                    return;
                  }

                  /*
                   * IMPORTANT:
                   *
                   * The actual usable YouTube
                   * player comes from event.target.
                   */
                  playerRef.current =
                    event.target;

                  readyRef.current =
                    true;

                  /*
                   * Register controller so
                   * MiniPlayer / FullPlayer
                   * can control YouTube.
                   */
                  setYouTubeController({
                    loadAndPlay: (
                      nextVideoId,
                    ) => {
                      const currentPlayer =
                        playerRef.current;

                      if (
                        !currentPlayer ||
                        !readyRef.current
                      ) {
                        return;
                      }

                      currentPlayer.loadVideoById(
                        nextVideoId,
                      );

                      currentPlayer.playVideo();
                    },

                    play: () => {
                      const currentPlayer =
                        playerRef.current;

                      if (
                        !currentPlayer ||
                        !readyRef.current
                      ) {
                        return;
                      }

                      currentPlayer.playVideo();
                    },

                    pause: () => {
                      const currentPlayer =
                        playerRef.current;

                      if (
                        !currentPlayer ||
                        !readyRef.current
                      ) {
                        return;
                      }

                      currentPlayer.pauseVideo();
                    },

                    seek: (
                      seconds,
                    ) => {
                      const currentPlayer =
                        playerRef.current;

                      if (
                        !currentPlayer ||
                        !readyRef.current
                      ) {
                        return;
                      }

                      currentPlayer.seekTo(
                        seconds,
                        true,
                      );
                    },
                  });

                  callbacksRef.current
                    .onReady?.();

                  const latestVideoId =
                    videoIdRef.current;

                  /*
                   * Load currently selected
                   * song once player is ready.
                   */
                  if (
                    latestVideoId
                  ) {
                    event.target.loadVideoById(
                      latestVideoId,
                    );

                    /*
                     * Search result was already
                     * clicked, so keep playing.
                     */
                    if (
                      isPlayingRef.current
                    ) {
                      event.target.playVideo();
                    }
                  }

                  startTimeUpdates();
                },

                onStateChange:
                  (event) => {
                    const state =
                      event.data;

                    /*
                     * PLAYING
                     */
                    if (
                      window.YT
                        ?.PlayerState
                        ?.PLAYING ===
                      state
                    ) {
                      callbacksRef.current.onPlaying?.();
                    }

                    /*
                     * PAUSED
                     */
                    if (
                      window.YT
                        ?.PlayerState
                        ?.PAUSED ===
                      state
                    ) {
                      callbacksRef.current.onPaused?.();
                    }

                    /*
                     * ENDED
                     */
                    if (
                      window.YT
                        ?.PlayerState
                        ?.ENDED ===
                      state
                    ) {
                      /*
                       * Repeat current song
                       */
                      if (
                        repeatRef.current
                      ) {
                        event.target.seekTo(
                          0,
                          true,
                        );

                        event.target.playVideo();

                        callbacksRef.current.onPlaying?.();

                        return;
                      }

                      /*
                       * Store will select
                       * the next queue item.
                       */
                      callbacksRef.current.onEnded?.();
                    }
                  },
              },
            },
          );

        /*
         * We intentionally use event.target
         * as the real API player reference.
         */
        void player;
      };

    /*
     * API already loaded
     */
    if (window.YT?.Player) {
      createPlayer();
    } else {
      /*
       * Preserve any previous callback
       */
      const previous =
        window.onYouTubeIframeAPIReady;

      window.onYouTubeIframeAPIReady =
        () => {
          previous?.();

          createPlayer();
        };

      /*
       * Prevent duplicate script
       */
      const existing =
        document.querySelector(
          'script[src="https://www.youtube.com/iframe_api"]',
        );

      if (!existing) {
        const script =
          document.createElement(
            "script",
          );

        script.src =
          "https://www.youtube.com/iframe_api";

        script.async = true;

        document.head.appendChild(
          script,
        );
      }
    }

    return () => {
      cancelled = true;

      readyRef.current =
        false;

      /*
       * Remove controller before
       * destroying iframe.
       */
      setYouTubeController(
        null,
      );

      if (intervalRef.current) {
        clearInterval(
          intervalRef.current,
        );

        intervalRef.current =
          null;
      }

      playerRef.current?.destroy();

      playerRef.current = null;
    };
  }, []);

  /*
   * SONG CHANGE
   *
   * Search result / next / previous
   */
  useEffect(() => {
    const player =
      playerRef.current;

    if (
      !player ||
      !readyRef.current
    ) {
      return;
    }

    if (!videoId) {
      return;
    }

    player.loadVideoById(
      videoId,
    );

    if (isPlaying) {
      player.playVideo();
    }
  }, [videoId]);

  /*
   * PLAY / PAUSE
   *
   * MiniPlayer and FullPlayer
   * call Zustand → controller →
   * this effect also keeps state synced.
   */
  useEffect(() => {
    const player =
      playerRef.current;

    if (
      !player ||
      !readyRef.current
    ) {
      return;
    }

    if (isPlaying) {
      player.playVideo();
    } else {
      player.pauseVideo();
    }
  }, [isPlaying]);

  return (
    <div
      className="w-full overflow-hidden rounded-2xl border border-white/10 bg-black"
      aria-label="YouTube music player"
    >
      <div
        ref={containerRef}
        className="aspect-video w-full min-w-[200px]"
      />
    </div>
  );
}