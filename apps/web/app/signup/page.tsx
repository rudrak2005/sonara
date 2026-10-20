"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Badge,
  Button,
  GlassPanel,
  SectionTitle,
} from "@sonora/ui";

import { api } from "@/lib/api/client";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [displayName, setDisplayName] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    const normalizedEmail =
      email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError(
        "Please enter your email address.",
      );
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters.",
      );
      return;
    }

    if (password.length > 128) {
      setError(
        "Password must be 128 characters or fewer.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match.",
      );
      return;
    }

    setLoading(true);

    try {
      await api.post<
        {
          id: string;
          email: string;
        },
        {
          email: string;
          password: string;
          displayName?: string;
          timezone?: string;
        }
      >("/auth/register", {
        email: normalizedEmail,
        password,
        displayName:
          displayName.trim() || undefined,
        timezone:
          Intl.DateTimeFormat().resolvedOptions()
            .timeZone,
      });

      router.push("/login");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create account.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-md">
        <GlassPanel className="p-6">
          <Badge>SONORA ACCOUNT</Badge>

          <div className="mt-4">
            <SectionTitle title="Create your account" />
            <p className="mt-2 text-sm text-muted">
              Start building your personal
              listening world.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4"
          >
            <div>
              <label
                htmlFor="displayName"
                className="mb-2 block text-sm"
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
                className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3"
                placeholder="Your name"
                maxLength={80}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3"
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value,
                  )
                }
                className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3"
                placeholder="Repeat password"
                autoComplete="new-password"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm"
              >
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading
                ? "Creating account..."
                : "Create account"}
            </Button>
          </form>
        </GlassPanel>
      </div>
    </main>
  );
}