"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  Badge,
  Button,
  GlassPanel,
  SectionTitle,
} from "@sonora/ui";

import {
  apiRequest,
} from "@/lib/api/client";

import {
  ApiError,
} from "@/lib/api/errors";

export default function ResetPasswordForm() {
  const router = useRouter();

  const searchParams =
    useSearchParams();

  const token =
    searchParams.get("token") ?? "";

const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (!token) {
      setError(
        "This reset link is missing its token.",
      );
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters.",
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
      await apiRequest(
        "/api/v1/auth/password-reset/confirm",
        {
          method: "POST",
          body: JSON.stringify({
            token,
            password,
          }),
        },
      );

      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Unable to reset your password.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <main className="min-h-screen px-6 py-12">
        <div className="mx-auto flex min-h-[75vh] max-w-md items-center">
          <GlassPanel className="w-full p-7">
            <Badge>
              PASSWORD UPDATED
            </Badge>

            <SectionTitle
              title="You're back in control."
            />

            <p className="mt-3 text-sm leading-6 text-[var(--sonora-muted)]">
              Your password has been changed
              successfully. Active sessions were
              invalidated for security.
            </p>

            <Button
              type="button"
              className="mt-7 w-full"
              onClick={() =>
                router.replace("/login")
              }
            >
              Continue to Login
            </Button>
          </GlassPanel>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto flex min-h-[75vh] max-w-md items-center">
        <GlassPanel className="w-full p-7">
          <Link
            href="/login"
            className="text-xs tracking-[0.22em] text-[var(--sonora-muted)]"
          >
            ← SONORA ACCESS
          </Link>

          <div className="mt-7">
            <Badge>
              PASSWORD RECOVERY
            </Badge>

            <SectionTitle
              title="Create a new password"
            />

            <p className="mt-3 text-sm leading-6 text-[var(--sonora-muted)]">
              Choose a strong new password for
              your SONORA account.
            </p>
          </div>

          {!token && (
            <div className="mt-6 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm">
              This password reset link is
              invalid or incomplete.
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-5"
          >
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm"
              >
                New password
              </label>

              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value,
                  )
                }
                autoComplete="new-password"
                placeholder="At least 8 characters"
                className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-[var(--sonora-amber)]"
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
                minLength={8}
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value,
                  )
                }
                autoComplete="new-password"
                placeholder="Repeat your password"
                className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-[var(--sonora-amber)]"
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
              disabled={loading || !token}
              className="w-full"
            >
              {loading
                ? "Updating..."
                : "Reset Password"}
            </Button>
          </form>
        </GlassPanel>
      </div>
    </main>
  );
}