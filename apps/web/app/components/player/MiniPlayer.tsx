"use client";

import { Maximize2 } from "lucide-react";
import { PlayerArtwork } from "./PlayerArtwork";
import { ProgressBar } from "./ProgressBar";
import { PlayerControls } from "./PlayerControls";
import { usePlayerStore } from "@/stores/player-store";

export function MiniPlayer() {
  const {
    currentTrack,
    currentTime,
    duration,
    seek,
    openFullPlayer,
  } = usePlayerStore();

  if (!currentTrack) return null;

  return (
    <section
      aria-label="Mini player"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0B0908]/95 px-3 py-3 backdrop-blur-xl md:bottom-4 md:left-1/2 md:right-auto md:w-[min(900px,calc(100vw-32px))] md:-translate-x-1/2 md:rounded-[16px] md:border"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3">
        <button
          type="button"
          onClick={openFullPlayer}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
          aria-label="Open full player"
        >
          <PlayerArtwork
            track={currentTrack}
            size="sm"
          />

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[#F2E9DE]">
              {currentTrack.title}
            </p>

            <p className="truncate text-xs text-[#B5A69A]">
              {currentTrack.artist}
            </p>
          </div>
        </button>

        <div className="hidden min-w-[240px] md:block">
          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={seek}
          />
        </div>

        <div className="hidden md:block">
          <PlayerControls />
        </div>

        <button
          type="button"
          onClick={openFullPlayer}
          aria-label="Expand player"
          className="rounded-full p-2 text-[#B5A69A] hover:bg-white/5 hover:text-[#F2E9DE]"
        >
          <Maximize2 size={18} />
        </button>
      </div>

      <div className="mt-2 md:hidden">
        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          onSeek={seek}
        />
      </div>

      <div className="mt-2 flex justify-center md:hidden">
        <PlayerControls />
      </div>
    </section>
  );
}