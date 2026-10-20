"use client";

import type { PlayerTrack } from "@/stores/player-store";

interface PlayerArtworkProps {
  track: PlayerTrack | null;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "h-12 w-12 rounded-[8px]",
  md: "h-20 w-20 rounded-[12px]",
  lg: "h-64 w-64 rounded-[22px] md:h-80 md:w-80",
};

export function PlayerArtwork({
  track,
  size = "md",
}: PlayerArtworkProps) {
  if (!track) {
    return (
      <div
        className={[
          sizes[size],
          "flex items-center justify-center",
          "bg-[#201712]",
          "border border-white/10",
          "text-[#B5A69A]",
        ].join(" ")}
      >
        —
      </div>
    );
  }

  return (
    <div
      className={[
        sizes[size],
        "flex shrink-0 items-center justify-center",
        "overflow-hidden",
        "border border-white/10",
        "bg-gradient-to-br from-[#D18A4D] via-[#4A3428] to-[#0B0908]",
        "shadow-2xl",
      ].join(" ")}
      aria-label={`${track.title} artwork`}
    >
      <div className="text-center">
        <div className="text-2xl font-semibold text-[#F2E9DE]">
          S
        </div>

        <div className="mt-1 text-[9px] uppercase tracking-[0.25em] text-[#F2E9DE]/60">
          Sonora
        </div>
      </div>
    </div>
  );
}