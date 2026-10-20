"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { apiRequest } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";

type PrivacyState = {
  personalizationEnabled: boolean;
  pulseEnabled: boolean;
  memoryEnabled: boolean;
  aiAssistantEnabled: boolean;
  reducedMotion: boolean;
  privateSessionDefault: boolean;
  discoveryLevel: "LOW" | "BALANCED" | "HIGH";
  atmosphereMode: "OFF" | "AUTO" | "MANUAL";
};

const DEFAULT_PRIVACY: PrivacyState = {
  personalizationEnabled: true,
  pulseEnabled: true,
  memoryEnabled: true,
  aiAssistantEnabled: true,
  reducedMotion: false,
  privateSessionDefault: false,
  discoveryLevel: "BALANCED",
  atmosphereMode: "AUTO",
};

export default function PrivacyPage() {
  const router = useRouter();

  const [privacy, setPrivacy] =
    useState<PrivacyState>(
      DEFAULT_PRIVACY,
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [resettingHistory, setResettingHistory] =
    useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data =
          await apiRequest<PrivacyState>(
            "/api/v1/privacy/status",
          );

        setPrivacy(data);
      } catch (err) {
        if (
          err instanceof ApiError &&
          err.status === 401
        ) {
          router.replace("/login");
          return;
        }

        setError(
          "Unable to load privacy settings.",
        );
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [router]);

  async function save(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setMessage("");
    setSaving(true);

    try {
      const data =
        await apiRequest<PrivacyState>(
          "/api/v1/preferences/me",
          {
            method: "PATCH",
            body: JSON.stringify(
              privacy,
            ),
          },
        );

      setPrivacy(data);
      setMessage(
        "Privacy settings saved.",
      );
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Unable to save settings.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function resetHistory() {
    const confirmed =
      window.confirm(
        "Reset your listening history? This cannot be undone.",
      );

    if (!confirmed) return;

    setResettingHistory(true);
    setError("");
    setMessage("");

    try {
      await apiRequest(
        "/api/v1/privacy/history/reset",
        {
          method: "POST",
          body: JSON.stringify({
            confirm: true,
          }),
        },
      );

      setMessage(
        "Your listening history has been reset.",
      );
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Unable to reset history.",
      );
    } finally {
      setResettingHistory(false);
    }
  }

  function toggle(
    key: keyof Pick<
      PrivacyState,
      | "personalizationEnabled"
      | "pulseEnabled"
      | "memoryEnabled"
      | "aiAssistantEnabled"
      | "reducedMotion"
      | "privateSessionDefault"
    >,
  ) {
    setPrivacy((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#0b0908] text-[#f2e9de]">
        <div className="text-xs uppercase tracking-[0.28em] text-[#b5a69a]">
          SONORA / LOADING PRIVACY
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0908] px-5 py-10 text-[#f2e9de]">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#d18a4d]">
            SONORA / PRIVACY
          </p>

          <h1 className="mt-4 text-5xl font-black tracking-[-0.06em]">
            Your data.
            <br />
            <span className="text-[#d18a4d]">
              Your controls.
            </span>
          </h1>

          <p className="mt-5 text-sm leading-6 text-[#b5a69a]">
            Control what SONORA is allowed to
            remember and personalize.
          </p>
        </div>

        <form
          onSubmit={save}
          className="space-y-4"
        >
          <section className="rounded-[28px] border border-white/10 bg-[#201712]/75 p-6">
            <PrivacyToggle
              title="Personalization"
              description="Use long-term listening signals to adapt recommendations."
              enabled={
                privacy.personalizationEnabled
              }
              onClick={() =>
                toggle(
                  "personalizationEnabled",
                )
              }
            />

            <PrivacyToggle
              title="Pulse"
              description="Allow listening rhythm signals to shape Pulse sessions."
              enabled={privacy.pulseEnabled}
              onClick={() =>
                toggle("pulseEnabled")
              }
            />

            <PrivacyToggle
              title="Memories"
              description="Allow SONORA to store personal music memories."
              enabled={privacy.memoryEnabled}
              onClick={() =>
                toggle("memoryEnabled")
              }
            />

            <PrivacyToggle
              title="AI Assistant"
              description="Allow SONORA's AI music assistant."
              enabled={
                privacy.aiAssistantEnabled
              }
              onClick={() =>
                toggle(
                  "aiAssistantEnabled",
                )
              }
            />

            <PrivacyToggle
              title="Reduced Motion"
              description="Use reduced animation and calmer transitions."
              enabled={privacy.reducedMotion}
              onClick={() =>
                toggle("reducedMotion")
              }
            />

            <PrivacyToggle
              title="Private Session by Default"
              description="Start new listening sessions without long-term signals."
              enabled={
                privacy.privateSessionDefault
              }
              onClick={() =>
                toggle(
                  "privateSessionDefault",
                )
              }
            />
          </section>

          <section className="rounded-[28px] border border-white/10 bg-[#201712]/75 p-6">
            <p className="text-sm font-semibold">
              Discovery level
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              {(
                [
                  "LOW",
                  "BALANCED",
                  "HIGH",
                ] as const
              ).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() =>
                    setPrivacy((current) => ({
                      ...current,
                      discoveryLevel:
                        level,
                    }))
                  }
                  className={`rounded-full border px-5 py-2 text-xs tracking-[0.12em] ${
                    privacy.discoveryLevel ===
                    level
                      ? "border-[#d18a4d]/50 bg-[#d18a4d]/15"
                      : "border-white/10"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </section>

          {message && (
            <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-sm">
              {message}
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-2xl bg-[#d18a4d] px-6 py-4 font-semibold text-[#0b0908] disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save Privacy Settings"}
          </button>
        </form>

        <section className="mt-8 rounded-[28px] border border-red-500/15 bg-red-500/[0.03] p-6">
          <p className="text-sm font-semibold">
            Listening history
          </p>

          <p className="mt-2 text-sm leading-6 text-[#b5a69a]">
            Remove the currently stored listening
            history associated with your account.
          </p>

          <button
            type="button"
            onClick={resetHistory}
            disabled={resettingHistory}
            className="mt-5 rounded-full border border-red-400/20 px-5 py-2.5 text-sm text-red-200 disabled:opacity-50"
          >
            {resettingHistory
              ? "Resetting..."
              : "Reset listening history"}
          </button>
        </section>
      </div>
    </main>
  );
}

function PrivacyToggle({
  title,
  description,
  enabled,
  onClick,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-5 border-b border-white/5 py-5 text-left last:border-0"
    >
      <div>
        <p className="text-sm font-semibold">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-[#b5a69a]">
          {description}
        </p>
      </div>

      <span
        className={`shrink-0 rounded-full px-3 py-1 text-[10px] ${
          enabled
            ? "bg-[#d18a4d]/15 text-[#d18a4d]"
            : "bg-white/5 text-[#b5a69a]"
        }`}
      >
        {enabled ? "ON" : "OFF"}
      </span>
    </button>
  );
}