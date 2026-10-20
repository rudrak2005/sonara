"use client";

import { create } from "zustand";

export type PlayerTrack = {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  artwork?: string;
  provider?: "youtube" | "local-demo";
  videoId?: string;
};

export type PlaybackState = {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  currentTrack: PlayerTrack | null;
  queue: PlayerTrack[];
  queueIndex: number;
  isFullPlayerOpen: boolean;
  shuffle: boolean;
  repeat: boolean;
};

type PlayerActions = {
  playTrack: (
    track: PlayerTrack,
    queue?: PlayerTrack[],
  ) => void;

  togglePlay: () => void;
  pause: () => void;
  play: () => void;
  seek: (time: number) => void;

  setQueue: (queue: PlayerTrack[]) => void;

  next: () => void;
  previous: () => void;

  toggleShuffle: () => void;
  toggleRepeat: () => void;

  openFullPlayer: () => void;
  closeFullPlayer: () => void;
};

type PlayerStore = PlaybackState & PlayerActions;

/*
 * YouTube controller
 *
 * The YouTube iframe registers these functions
 * when its API player becomes ready.
 */
type YouTubeController = {
  loadAndPlay: (videoId: string) => void;
  play: () => void;
  pause: () => void;
  seek: (seconds: number) => void;
};

let youtubeController: YouTubeController | null = null;

export function setYouTubeController(
  controller: YouTubeController | null,
) {
  youtubeController = controller;
}

export const DEMO_TRACKS: PlayerTrack[] = [
  {
    id: "track-01",
    title: "Night Drive",
    artist: "SONORA Demo",
    album: "Midnight Memory",
    duration: 214,
    provider: "local-demo",
  },
  {
    id: "track-02",
    title: "Neon Rain",
    artist: "SONORA Demo",
    album: "After Hours",
    duration: 198,
    provider: "local-demo",
  },
  {
    id: "track-03",
    title: "Static Dreams",
    artist: "SONORA Demo",
    album: "Digital Memory",
    duration: 241,
    provider: "local-demo",
  },
];

let playbackTimer: ReturnType<typeof setInterval> | null =
  null;

const stopTimer = () => {
  if (playbackTimer) {
    clearInterval(playbackTimer);
    playbackTimer = null;
  }
};

const startTimer = (
  set: (
    partial:
      | Partial<PlayerStore>
      | ((
          state: PlayerStore,
        ) => Partial<PlayerStore>),
  ) => void,
  get: () => PlayerStore,
) => {
  if (playbackTimer) {
    return;
  }

  playbackTimer = setInterval(() => {
    const state = get();

    /*
     * YouTube has its own clock.
     * Demo tracks use the local timer.
     */
    if (state.currentTrack?.provider === "youtube") {
      stopTimer();
      return;
    }

    if (!state.isPlaying || !state.currentTrack) {
      stopTimer();
      return;
    }

    const nextTime = state.currentTime + 0.25;

    if (nextTime >= state.duration) {
      if (state.repeat) {
        set({
          currentTime: 0,
          isPlaying: true,
        });

        return;
      }

      const nextIndex = state.queueIndex + 1;

      if (nextIndex < state.queue.length) {
        const nextTrack = state.queue[nextIndex];

        if (!nextTrack) {
          set({
            isPlaying: false,
          });

          stopTimer();
          return;
        }

        set({
          currentTrack: nextTrack,
          queueIndex: nextIndex,
          duration: nextTrack.duration,
          currentTime: 0,
          isPlaying: true,
        });

        return;
      }

      set({
        currentTime: state.duration,
        isPlaying: false,
      });

      stopTimer();
      return;
    }

    set({
      currentTime: nextTime,
    });
  }, 250);
};

export const usePlayerStore = create<PlayerStore>(
  (set, get) => ({
    isPlaying: false,

    currentTime: 0,

    duration: 0,

    currentTrack: DEMO_TRACKS[0] ?? null,

    queue: DEMO_TRACKS,

    queueIndex: 0,

    isFullPlayerOpen: false,

    shuffle: false,

    repeat: false,

    /*
     * SET QUEUE
     */
    setQueue: (queue) => {
      const currentTrackId = get().currentTrack?.id;

      const nextQueueIndex = currentTrackId
        ? queue.findIndex(
            (track) => track.id === currentTrackId,
          )
        : -1;

      set({
        queue,
        queueIndex:
          nextQueueIndex >= 0
            ? nextQueueIndex
            : 0,
      });
    },

    /*
     * PLAY TRACK
     */
    playTrack: (
      track,
      providedQueue,
    ) => {
      const currentState = get();

      stopTimer();

      const existingQueue =
        providedQueue ?? currentState.queue;

      const existingIndex =
        existingQueue.findIndex(
          (item) => item.id === track.id,
        );

      const nextQueue =
        providedQueue &&
        providedQueue.length > 0
          ? providedQueue
          : existingIndex >= 0
            ? existingQueue
            : [
                ...existingQueue,
                track,
              ];

      const nextIndex =
        nextQueue.findIndex(
          (item) => item.id === track.id,
        );

      set({
        currentTrack: track,

        queue:
          nextQueue.length > 0
            ? nextQueue
            : [track],

        queueIndex:
          nextIndex >= 0
            ? nextIndex
            : 0,

        currentTime: 0,

        duration: track.duration,

        isPlaying: true,
      });

      /*
       * REAL YOUTUBE PLAYBACK
       */
      if (
        track.provider === "youtube" &&
        track.videoId
      ) {
        youtubeController?.loadAndPlay(
          track.videoId,
        );

        return;
      }

      /*
       * LOCAL DEMO PLAYBACK
       */
      startTimer(set, get);
    },

    /*
     * PLAY
     */
    play: () => {
      const state = get();

      if (!state.currentTrack) {
        return;
      }

      set({
        isPlaying: true,
      });

      if (
        state.currentTrack.provider ===
        "youtube"
      ) {
        youtubeController?.play();

        return;
      }

      startTimer(set, get);
    },

    /*
     * PAUSE
     */
    pause: () => {
      const state = get();

      set({
        isPlaying: false,
      });

      if (
        state.currentTrack?.provider ===
        "youtube"
      ) {
        youtubeController?.pause();

        return;
      }

      stopTimer();
    },

    /*
     * TOGGLE PLAY / PAUSE
     */
    togglePlay: () => {
      if (get().isPlaying) {
        get().pause();
      } else {
        get().play();
      }
    },

    /*
     * SEEK
     */
    seek: (time) => {
      const state = get();

      const duration =
        state.duration > 0
          ? state.duration
          : state.currentTrack?.duration ?? 0;

      const safeTime = Math.max(
        0,
        Math.min(time, duration),
      );

      set({
        currentTime: safeTime,
      });

      if (
        state.currentTrack?.provider ===
        "youtube"
      ) {
        youtubeController?.seek(safeTime);
      }
    },

    /*
     * NEXT TRACK
     */
    next: () => {
      const state = get();

      const {
        queue,
        queueIndex,
        repeat,
      } = state;

      if (queue.length === 0) {
        return;
      }

      /*
       * End of queue
       */
      if (
        queueIndex + 1 >=
        queue.length
      ) {
        if (!repeat) {
          set({
            isPlaying: false,
          });

          stopTimer();

          return;
        }

        /*
         * Repeat -> first track
         */
        const firstTrack = queue[0];

        if (!firstTrack) {
          return;
        }

        stopTimer();

        set({
          currentTrack:
            firstTrack,

          queueIndex: 0,

          currentTime: 0,

          duration:
            firstTrack.duration,

          isPlaying: true,
        });

        if (
          firstTrack.provider ===
            "youtube" &&
          firstTrack.videoId
        ) {
          youtubeController?.loadAndPlay(
            firstTrack.videoId,
          );

          return;
        }

        startTimer(set, get);

        return;
      }

      const nextIndex =
        queueIndex + 1;

      const nextTrack =
        queue[nextIndex];

      if (!nextTrack) {
        return;
      }

      stopTimer();

      set({
        currentTrack:
          nextTrack,

        queueIndex:
          nextIndex,

        currentTime: 0,

        duration:
          nextTrack.duration,

        isPlaying: true,
      });

      /*
       * YouTube next
       */
      if (
        nextTrack.provider ===
          "youtube" &&
        nextTrack.videoId
      ) {
        youtubeController?.loadAndPlay(
          nextTrack.videoId,
        );

        return;
      }

      /*
       * Demo next
       */
      startTimer(set, get);
    },

    /*
     * PREVIOUS TRACK
     */
    previous: () => {
      const state = get();

      /*
       * Same song:
       * restart when > 5 seconds
       */
      if (state.currentTime > 5) {
        set({
          currentTime: 0,
        });

        if (
          state.currentTrack
            ?.provider === "youtube"
        ) {
          youtubeController?.seek(0);
        }

        return;
      }

      /*
       * Already first track
       */
      if (state.queueIndex <= 0) {
        set({
          currentTime: 0,
        });

        if (
          state.currentTrack
            ?.provider === "youtube"
        ) {
          youtubeController?.seek(0);
        }

        return;
      }

      const previousIndex =
        state.queueIndex - 1;

      const previousTrack =
        state.queue[previousIndex];

      if (!previousTrack) {
        return;
      }

      stopTimer();

      set({
        currentTrack:
          previousTrack,

        queueIndex:
          previousIndex,

        currentTime: 0,

        duration:
          previousTrack.duration,

        isPlaying: true,
      });

      /*
       * YouTube previous
       */
      if (
        previousTrack.provider ===
          "youtube" &&
        previousTrack.videoId
      ) {
        youtubeController?.loadAndPlay(
          previousTrack.videoId,
        );

        return;
      }

      /*
       * Demo previous
       */
      startTimer(set, get);
    },

    /*
     * SHUFFLE
     */
    toggleShuffle: () => {
      set((state) => ({
        shuffle: !state.shuffle,
      }));
    },

    /*
     * REPEAT
     */
    toggleRepeat: () => {
      set((state) => ({
        repeat: !state.repeat,
      }));
    },

    /*
     * FULL PLAYER
     */
    openFullPlayer: () => {
      set({
        isFullPlayerOpen: true,
      });
    },

    closeFullPlayer: () => {
      set({
        isFullPlayerOpen: false,
      });
    },
  }),
);