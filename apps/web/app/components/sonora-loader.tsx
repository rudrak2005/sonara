"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type SonoraLoaderProps = {
  redirect?: string;
  duration?: number;
};

const WAVE_HEIGHTS = [
  18, 24, 31, 40, 50,
  62, 74, 84, 96, 110,
  124, 138, 152, 168, 182,
  198, 214, 230, 248, 264,
  280, 296, 308, 296, 280,
  264, 248, 230, 214, 198,
  182, 168, 152, 138, 124,
  110, 96, 84, 74, 62,
  50, 40, 31, 24, 18,
];

export default function SonoraLoader({
  redirect,
  duration = 2000,
}: SonoraLoaderProps) {
  const router = useRouter();
  const [phase, setPhase] = useState("TUNING YOUR FREQUENCY");

  useEffect(() => {
    const phaseOne = window.setTimeout(() => {
      setPhase("BUILDING YOUR SOUNDSPACE");
    }, 650);

    const phaseTwo = window.setTimeout(() => {
      setPhase("SONORA READY");
    }, 1350);

    const redirectTimer = redirect
      ? window.setTimeout(() => {
          router.replace(redirect);
        }, duration)
      : undefined;

    return () => {
      window.clearTimeout(phaseOne);
      window.clearTimeout(phaseTwo);

      if (redirectTimer) {
        window.clearTimeout(redirectTimer);
      }
    };
  }, [duration, redirect, router]);

  return (
    <main className="sonora-loader">
      <div className="sonora-loader__grid" />
      <div className="sonora-loader__noise" />

      <div className="sonora-loader__core">
        <div className="sonora-loader__eyebrow">
          <span />
          SYSTEM BOOT
          <span />
        </div>

        <div className="sonora-loader__logo">
          SONORA
        </div>

        <div className="sonora-loader__machine">
          <div className="sonora-loader__orb">
            <div className="sonora-loader__orb-inner">
              ◉
            </div>
          </div>

          <div className="sonora-loader__wave">
            {WAVE_HEIGHTS.map((height, index) => (
              <span
                key={index}
                className="sonora-loader__bar"
                style={{
                  height: `${height}px`,
                  animationDelay: `${index * 0.028}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="sonora-loader__status">
          <span className="sonora-loader__status-dot" />
          {phase}
        </div>

        <div className="sonora-loader__meta">
          <span>AI MUSIC MACHINE</span>
          <span>01 / 01</span>
          <span>READY</span>
        </div>
      </div>
    </main>
  );
}