"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  apiRequest,
} from "@/lib/api/client";

import {
  ApiError,
} from "@/lib/api/errors";

type Preferences = {
  autoAtmosphereEnabled: boolean;
  atmosphereMode: "OFF" | "AUTO" | "MANUAL";
  personalizationEnabled: boolean;
  pulseEnabled: boolean;
  memoryEnabled: boolean;
  discoveryLevel: "LOW" | "BALANCED" | "HIGH";
  aiAssistantEnabled: boolean;
  reducedMotion: boolean;
  privateSessionDefault: boolean;
};



export default function OnboardingPage() {
  const router = useRouter();

  const [displayName, setDisplayName] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [preferences, setPreferences] =
    useState<Preferences>({
      autoAtmosphereEnabled: true,
      atmosphereMode: "AUTO",
      personalizationEnabled: true,
      pulseEnabled: true,
      memoryEnabled: true,
      discoveryLevel: "BALANCED",
      aiAssistantEnabled: true,
      reducedMotion: false,
      privateSessionDefault: false,
    });

  useEffect(() => {
    async function load() {
      try {
       const result =
  await apiRequest<Preferences>(
    "/api/v1/preferences/me",
  );

setPreferences(result);

    
      } catch (err) {
        if (
          err instanceof ApiError &&
          err.status === 401
        ) {
          router.replace("/login");
          return;
        }

        setError(
          "Unable to load your preferences.",
        );
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [router]);

  function updatePreference<K extends keyof Preferences>(
    key: K,
    value: Preferences[K],
  ) {
    setPreferences((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setSaving(true);

    try {
      await apiRequest(
        "/api/v1/preferences/onboarding",
        {
          method: "POST",
          body: JSON.stringify({
            profile: {
              displayName,
            },
            preferences,
          }),
        },
      );

      router.replace("/sonora");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Unable to save your preferences.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center bg-[#0b0908] text-[#f2e9de]">
        <div className="text-xs uppercase tracking-[0.3em] text-[#b5a69a]">
          SONORA / LOADING PROFILE
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0908] px-5 py-12 text-[#f2e9de]">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#d18a4d]">
            SONORA / FIRST SIGNAL
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-6xl">
            Tune your
            <br />
            <span className="text-[#d18a4d]">
              frequency.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-6 text-[#b5a69a]">
            These choices control how SONORA
            personalizes your listening experience.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <section className="rounded-[28px] border border-white/10 bg-[#201712]/70 p-6 backdrop-blur-xl">
            <label
              htmlFor="displayName"
              className="text-sm"
            >
              Display name
            </label>

            <input
              id="displayName"
              value={displayName}
              onChange={(event) =>
                setDisplayName(
                  event.target.value,
                )
              }
              placeholder="What should we call you?"
              className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-[#d18a4d]/60"
            />
          </section>

          <section className="rounded-[28px] border border-white/10 bg-[#201712]/70 p-6">
            <p className="text-sm font-semibold">
              Atmosphere
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              {(
                [
                  "OFF",
                  "AUTO",
                  "MANUAL",
                ] as const
              ).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() =>
                    updatePreference(
                      "atmosphereMode",
                      mode,
                    )
                  }
                  className={`rounded-full border px-5 py-2 text-xs uppercase tracking-[0.12em] ${
                    preferences.atmosphereMode ===
                    mode
                      ? "border-[#d18a4d]/60 bg-[#d18a4d]/15 text-[#f2e9de]"
                      : "border-white/10 text-[#b5a69a]"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            {[
              [
                "personalizationEnabled",
                "Personalization",
                "Let SONORA adapt recommendations.",
              ],
              [
                "pulseEnabled",
                "Pulse",
                "Use listening rhythm for sessions.",
              ],
              [
                "memoryEnabled",
                "Memories",
                "Allow personal music memories.",
              ],
              [
                "aiAssistantEnabled",
                "AI Assistant",
                "Enable SONORA AI assistance.",
              ],
              [
                "reducedMotion",
                "Reduced Motion",
                "Use calmer motion and transitions.",
              ],
              [
                "privateSessionDefault",
                "Private Sessions",
                "Start sessions privately by default.",
              ],
            ].map(
              ([key, title, description]) => {
                const typedKey =
                  key as keyof Preferences;

                const value =
                  preferences[typedKey] as boolean;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      updatePreference(
                        typedKey,
                        !value,
                      )
                    }
                    className="rounded-[24px] border border-white/10 bg-[#201712]/70 p-5 text-left"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-semibold">
                        {title}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-[10px] ${
                          value
                            ? "bg-[#d18a4d]/15 text-[#d18a4d]"
                            : "bg-white/5 text-[#b5a69a]"
                        }`}
                      >
                        {value
                          ? "ON"
                          : "OFF"}
                      </span>
                    </div>

                    <p className="mt-2 text-xs leading-5 text-[#b5a69a]">
                      {description}
                    </p>
                  </button>
                );
              },
            )}
          </section>

          <section className="rounded-[28px] border border-white/10 bg-[#201712]/70 p-6">
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
                    updatePreference(
                      "discoveryLevel",
                      level,
                    )
                  }
                  className={`rounded-full border px-5 py-2 text-xs uppercase tracking-[0.12em] ${
                    preferences.discoveryLevel ===
                    level
                      ? "border-[#d18a4d]/60 bg-[#d18a4d]/15"
                      : "border-white/10 text-[#b5a69a]"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </section>

          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-2xl bg-[#d18a4d] px-5 py-4 font-semibold text-[#0b0908] transition hover:brightness-110 disabled:opacity-50"
          >
            {saving
              ? "Saving your frequency..."
              : "Enter SONORA →"}
          </button>
        </form>
      </div>
    </main>
  );
}