"use client";

import { useState } from "react";
import { Button, GlassPanel } from "@sonora/ui";
import { api } from "@/lib/api/client";

type HealthResponse = {
  status: string;
  service: string;
  version: string;
  environment: string;
  timestamp: string;
};

export default function ApiTestPage() {
  const [data, setData] =
    useState<HealthResponse | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function checkApi() {
    setLoading(true);
    setError(null);

    try {
      const result =
        await api.get<HealthResponse>(
          "/health",
        );

      setData(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "API request failed.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <GlassPanel className="p-6">
        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#B5A69A]">
              SONORA API
            </p>

            <h1 className="mt-2 text-3xl font-semibold">
              Backend Foundation
            </h1>
          </div>

          <Button
            onClick={checkApi}
            disabled={loading}
          >
            {loading
              ? "Checking..."
              : "Check API"}
          </Button>

          {error && (
            <div className="rounded-[10px] border border-[#D75A4A]/30 bg-[#D75A4A]/10 p-4 text-sm text-[#F2E9DE]">
              {error}
            </div>
          )}

          {data && (
            <pre className="overflow-auto rounded-[10px] border border-white/10 bg-[#0B0908] p-4 text-sm text-[#8FCB81]">
              {JSON.stringify(
                data,
                null,
                2,
              )}
            </pre>
          )}
        </div>
      </GlassPanel>
    </main>
  );
}