"use client";

import Link from "next/link";

import { ProviderStatus } from "./provider-status";

import {
  Badge,
  Button,
  GlassPanel,
  SectionTitle,
} from "@sonora/ui";

import {
  DEMO_TRACKS,
  usePlayerStore,
} from "@/stores/player-store";

export default function HomePage() {
  const playTrack = usePlayerStore(
    (state) => state.playTrack,
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-44">
      {/* =========================================================
          SONORA HEADER
      ========================================================== */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#15100D] p-6 md:p-10">
        {/* Background glow */}
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#D18A4D]/10 blur-3xl" />

        <div className="relative">
          {/* Top Header Row */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Page Identity */}
            <Badge>SONORA / HOME</Badge>

            {/* Music Provider Status */}
            <ProviderStatus />
          </div>

          {/* Hero Content */}
          <div className="max-w-3xl space-y-5">
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
              Your music,
              <br />
              your rhythm.
            </h1>

            <p className="max-w-xl text-[#B5A69A]">
              Start a listening session built around
              your context, taste, and rhythm.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={() => playTrack(DEMO_TRACKS[0])}
              >
                Start My Session
              </Button>

              <Link
                href="/sonora/library"
                className="inline-flex items-center rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-[#F5EFE8] transition hover:bg-white/[0.08]"
              >
                My Library
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          YOUR SPACE
      ========================================================== */}
      <section className="space-y-4">
        <SectionTitle
          title="Your space"
          description="Your personalized SONORA workspace."
        />

        <div className="grid gap-4 md:grid-cols-3">
          {/* Pulse */}
          <GlassPanel className="p-5">
            <p className="text-sm text-[#B5A69A]">
              Pulse
            </p>

            <p className="mt-2 text-xl font-semibold">
              Getting to know your rhythm
            </p>
          </GlassPanel>

          {/* Music DNA */}
          <GlassPanel className="p-5">
            <p className="text-sm text-[#B5A69A]">
              Music DNA
            </p>

            <p className="mt-2 text-xl font-semibold">
              Your taste profile
            </p>
          </GlassPanel>

          {/* Memories */}
          <GlassPanel className="p-5">
            <p className="text-sm text-[#B5A69A]">
              Memories
            </p>

            <p className="mt-2 text-xl font-semibold">
              Songs that mean something
            </p>
          </GlassPanel>
        </div>
      </section>
    </div>
  );
}