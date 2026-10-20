"use client";

import { ChevronDown } from "lucide-react";
import { PlayerArtwork } from "./PlayerArtwork";
import { ProgressBar } from "./ProgressBar";
import { PlayerControls } from "./PlayerControls";
import { usePlayerStore } from "@/stores/player-store";

export function FullPlayer() {
  const {
    currentTrack,
    currentTime,
    duration,
    seek,
    isFullPlayerOpen,
    closeFullPlayer,
  } = usePlayerStore();

  if (!isFullPlayerOpen || !currentTrack) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Now playing"
      className="fixed inset-0 z-50 bg-[#0B0908]"
    >
      <div className="mx-auto flex min-h-full max-w-5xl flex-col px-6 py-6 md:px-10">
        <header className="flex items-center justify-between">
          <button
            type="button"
            onClick={closeFullPlayer}
            aria-label="Close full player"
            className="rounded-full p-2 text-[#B5A69A] hover:bg-white/5 hover:text-[#F2E9DE]"
          >
            <ChevronDown size={26} />
          </button>

          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#B5A69A]">
              Now Playing
            </p>

            <p className="mt-1 text-xs text-[#F2E9DE]">
              SONORA
            </p>
          </div>

          <div className="w-10" />
        </header>

        <div className="flex flex-1 flex-col items-center justify-center">
          <PlayerArtwork
            track={currentTrack}
            size="lg"
          />

          <div className="mt-8 w-full max-w-2xl text-center">
            <p className="text-3xl font-semibold tracking-tight text-[#F2E9DE] md:text-5xl">
              {currentTrack.title}
            </p>

            <p className="mt-2 text-base text-[#B5A69A]">
              {currentTrack.artist}
            </p>

            <p className="mt-1 text-sm text-[#B5A69A]/70">
              {currentTrack.album}
            </p>
          </div>

          <div className="mt-10 w-full max-w-2xl">
            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              onSeek={seek}
            />
          </div>

          <div className="mt-8">
            <PlayerControls />
          </div>
        </div>
      </div>
    </div>
  );
}