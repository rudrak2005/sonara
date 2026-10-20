"use client";

import { useEffect } from "react";

import { MiniPlayer } from "./MiniPlayer";
import { FullPlayer } from "./FullPlayer";
import { QueueDrawer } from "./QueueDrawer";
import { ListeningEventBridge } from "./ListeningEventBridge";
import { usePlayerStore } from "@/stores/player-store";
import { EVENT_TYPES, trackListeningEvent } from "@/lib/music/events";

import { YouTubeIframePlayer } from "../shell/YouTubeIframePlayer";

export function PlayerHost() {
  const {
    currentTrack,
    isPlaying,
    repeat,
  
    togglePlay,
    openFullPlayer,
  } = usePlayerStore();

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      const target =
        event.target as HTMLElement | null;

      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (isTyping) {
        return;
      }

      if (
        event.code === "Space"
      ) {
        event.preventDefault();

        togglePlay();
      }

      if (
        event.code ===
        "ArrowRight"
      ) {
        const state =
          usePlayerStore.getState();

        state.seek(
          state.currentTime + 5,
        );
      }

      if (
        event.code ===
        "ArrowLeft"
      ) {
        const state =
          usePlayerStore.getState();

        state.seek(
          state.currentTime - 5,
        );
      }

      if (
        event.code === "Enter"
      ) {
        openFullPlayer();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    openFullPlayer,
    togglePlay,
  ]);

  const handlePlaying =
    () => {
      usePlayerStore.setState({
        isPlaying: true,
      });
    };

  const handlePaused =
    () => {
      usePlayerStore.setState({
        isPlaying: false,
      });
    };

  const handleEnded =
    () => {
      const state =
        usePlayerStore.getState();

      const track =
        state.currentTrack;

      if (track) {
        void trackListeningEvent({
          providerTrackId:
            track.id,
          eventType:
            EVENT_TYPES.PLAY_COMPLETED,
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
        }).catch(() => {
          /*
           * Analytics must never
           * break playback.
           */
        });
      }

      state.next();
    };

  const handleTimeUpdate = (
    nextCurrentTime: number,
    nextDuration: number,
  ) => {
    usePlayerStore.setState({
      currentTime:
        nextCurrentTime,

      duration:
        nextDuration,
    });
  };

  return (
    <>
      <div
        className="pointer-events-none fixed -left-[10000px] top-0 z-0 h-[270px] w-[480px] overflow-hidden opacity-0"
        aria-hidden="true"
      ><YouTubeIframePlayer
  videoId={
    currentTrack?.provider ===
    "youtube"
      ? currentTrack.videoId ??
        null
      : null
  }
  isPlaying={isPlaying}
  repeat={repeat}
  onPlaying={
    handlePlaying
  }
  onPaused={
    handlePaused
  }
  onEnded={handleEnded}
  onTimeUpdate={
    handleTimeUpdate
  }
/>
        
      </div>

      <MiniPlayer />
<QueueDrawer />
      <ListeningEventBridge />
      <FullPlayer />
    </>
  );
}