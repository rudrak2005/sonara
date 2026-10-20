"use client";

import { useEffect } from "react";

import {
  EVENT_TYPES,
  trackListeningEvent,
} from "@/lib/music/events";

import { usePlayerStore } from "@/stores/player-store";

export function ListeningEventBridge() {
  useEffect(() => {
    const unsubscribe =
      usePlayerStore.subscribe(
        (state, previousState) => {
          const currentTrack =
            state.currentTrack;

          const previousTrack =
            previousState.currentTrack;

          if (
            !currentTrack
          ) {
            return;
          }

          /*
           * Track changed:
           * old track was skipped
           * and new track started.
           */
          if (
            previousTrack &&
            previousTrack.id !==
              currentTrack.id
          ) {
            const previousWasNearEnd =
              previousState.duration > 0 &&
              previousState.currentTime >=
                Math.max(
                  0,
                  previousState.duration - 2,
                );

            if (
              previousState.isPlaying &&
              !previousWasNearEnd
            ) {
              void trackListeningEvent({
                providerTrackId:
                  previousTrack.id,
                eventType:
                  EVENT_TYPES.SKIPPED,
                positionMs:
                  Math.max(
                    0,
                    Math.round(
                      previousState.currentTime *
                        1000,
                    ),
                  ),
                durationMs:
                  Math.max(
                    0,
                    Math.round(
                      previousState.duration *
                        1000,
                    ),
                  ),
                source: "PLAYER",
              }).catch(() => {
                /*
                 * Analytics must never
                 * break playback.
                 */
              });
            }

            if (
              state.isPlaying
            ) {
              void trackListeningEvent({
                providerTrackId:
                  currentTrack.id,
                eventType:
                  EVENT_TYPES.PLAY_STARTED,
                positionMs: 0,
                durationMs:
                  Math.max(
                    0,
                    Math.round(
                      state.duration *
                        1000,
                    ),
                  ),
                source: "PLAYER",
              }).catch(() => {});
            }

            return;
          }

          /*
           * Same track resumed from 0
           * = replay.
           */
          if (
            previousTrack &&
            previousTrack.id ===
              currentTrack.id &&
            !previousState.isPlaying &&
            state.isPlaying &&
            state.currentTime <= 1
          ) {
            void trackListeningEvent({
              providerTrackId:
                currentTrack.id,
              eventType:
                EVENT_TYPES.REPLAYED,
              positionMs: 0,
              durationMs:
                Math.max(
                  0,
                  Math.round(
                    state.duration *
                      1000,
                  ),
                ),
              source: "PLAYER",
            }).catch(() => {});

            return;
          }

          /*
           * Same track paused before completion.
           */
          if (
            previousTrack &&
            previousTrack.id ===
              currentTrack.id &&
            previousState.isPlaying &&
            !state.isPlaying
          ) {
            const completed =
              state.duration > 0 &&
              state.currentTime >=
                Math.max(
                  0,
                  state.duration - 2,
                );

            if (!completed) {
              void trackListeningEvent({
                providerTrackId:
                  currentTrack.id,
                eventType:
                  EVENT_TYPES.PAUSED,
                positionMs:
                  Math.max(
                    0,
                    Math.round(
                      state.currentTime *
                        1000,
                    ),
                  ),
                durationMs:
                  Math.max(
                    0,
                    Math.round(
                      state.duration *
                        1000,
                    ),
                  ),
                source: "PLAYER",
              }).catch(() => {});
            }
          }
        },
      );

    return unsubscribe;
  }, []);

  return null;
}
