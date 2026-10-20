"use client";

import { useEffect, useState } from "react";

import { apiRequest } from "@/lib/api/client";

type ProviderStatusData = {
  provider: string;
  displayName: string;
  connected: boolean;
  mode: string;
  implementation: string;
};

export function ProviderStatus() {
  const [status, setStatus] =
    useState<ProviderStatusData | null>(
      null,
    );

  useEffect(() => {
    let active = true;

    async function loadStatus() {
      try {
        const data =
          await apiRequest<ProviderStatusData>(
            "/api/v1/music/provider/status",
          );

        if (active) {
          setStatus(data);
        }
      } catch {
        if (active) {
          setStatus(null);
        }
      }
    }

    void loadStatus();

    return () => {
      active = false;
    };
  }, []);

  if (!status) {
    return (
      <div className="rounded-full border border-red-400/20 bg-red-400/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-red-200">
        Music source unavailable
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 rounded-full border px-3.5 py-2 backdrop-blur-xl ${
        status.connected
          ? "border-white/10 bg-white/[0.04]"
          : "border-red-400/20 bg-red-400/5"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status.connected
            ? "bg-[#D18A4D]"
            : "bg-red-400"
        }`}
        aria-hidden="true"
      />

      <span className="text-[10px] uppercase tracking-[0.16em] text-[#B5A69A]">
        {status.connected
          ? `${status.displayName} · ${status.implementation}`
          : `${status.displayName} unavailable`}
      </span>
    </div>
  );
}