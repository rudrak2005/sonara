"use client";

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

function formatTime(seconds: number) {
  const value = Math.max(0, Math.floor(seconds));

  const minutes = Math.floor(value / 60);
  const secs = value % 60;

  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

export function ProgressBar({
  currentTime,
  duration,
  onSeek,
}: ProgressBarProps) {
  const safeDuration = Math.max(duration, 1);
  const percentage = Math.min(
    100,
    Math.max(0, (currentTime / safeDuration) * 100),
  );

  return (
    <div className="space-y-2">
      <input
        aria-label="Playback progress"
        type="range"
        min={0}
        max={safeDuration}
        step={0.1}
        value={Math.min(currentTime, safeDuration)}
        onChange={(event) =>
          onSeek(Number(event.target.value))
        }
        className="h-1.5 w-full cursor-pointer accent-[#D18A4D]"
      />

      <div className="flex justify-between text-xs text-[#B5A69A]">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <div className="sr-only">
        {Math.round(percentage)} percent played
      </div>
    </div>
  );
}