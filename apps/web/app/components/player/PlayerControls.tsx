"use client";

import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Repeat,
  Shuffle,
} from "lucide-react";
import { usePlayerStore } from "@/stores/player-store";

export function PlayerControls() {
  const {
    isPlaying,
    shuffle,
    repeat,
    togglePlay,
    next,
    previous,
    toggleShuffle,
    toggleRepeat,
  } = usePlayerStore();

  return (
    <div className="flex items-center justify-center gap-3">
      <button
        type="button"
        aria-label="Toggle shuffle"
        aria-pressed={shuffle}
        onClick={toggleShuffle}
        className={[
          "rounded-full p-2.5",
          "text-[#B5A69A]",
          "transition hover:bg-white/5 hover:text-[#F2E9DE]",
          shuffle ? "text-[#D18A4D]" : "",
        ].join(" ")}
      >
        <Shuffle size={18} />
      </button>

      <button
        type="button"
        aria-label="Previous track"
        onClick={previous}
        className="rounded-full p-3 text-[#F2E9DE] transition hover:bg-white/10"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        type="button"
        aria-label={isPlaying ? "Pause" : "Play"}
        onClick={togglePlay}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D18A4D] text-[#0B0908] transition hover:brightness-110"
      >
        {isPlaying ? (
          <Pause size={22} fill="currentColor" />
        ) : (
          <Play
            size={22}
            fill="currentColor"
            className="translate-x-[1px]"
          />
        )}
      </button>

      <button
        type="button"
        aria-label="Next track"
        onClick={next}
        className="rounded-full p-3 text-[#F2E9DE] transition hover:bg-white/10"
      >
        <ChevronRight size={22} />
      </button>

      <button
        type="button"
        aria-label="Toggle repeat"
        aria-pressed={repeat}
        onClick={toggleRepeat}
        className={[
          "rounded-full p-2.5",
          "text-[#B5A69A]",
          "transition hover:bg-white/5 hover:text-[#F2E9DE]",
          repeat ? "text-[#D18A4D]" : "",
        ].join(" ")}
      >
        <Repeat size={18} />
      </button>
    </div>
  );
}