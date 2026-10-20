"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

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

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  const [error, setError] =
    useState("");

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

    setLoading(true);

    try {
      await apiRequest(
        "/api/v1/auth/password-reset/request",
        {
          method: "POST",
          body: JSON.stringify({
            email: normalizedEmail,
          }),
        },
      );

      /*
       * Always show generic success.
       */
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Unable to process the request.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen px-6 py-12">
        <div className="mx-auto flex min-h-[75vh] max-w-md items-center">
          <GlassPanel className="w-full p-7">
            <Badge>
              SONORA RECOVERY
            </Badge>

            <div className="mt-5">
              <SectionTitle title="Check your inbox" />
            </div>

            <p className="mt-4 text-sm leading-6 text-[var(--sonora-muted)]">
              If an account exists for this
              email address, a password reset
              link has been sent.
            </p>

            <div className="mt-7 rounded-xl border border-white/10 bg-black/20 p-4 text-sm">
              <p className="text-[var(--sonora-muted)]">
                Development mode
              </p>

              <p className="mt-2">
                Check the API terminal for the
                reset URL.
              </p>
            </div>

            <Button
              type="button"
              className="mt-6 w-full"
              onClick={() =>
                router.replace("/login")
              }
            >
              Back to Login
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

            <div className="mt-5">
              <SectionTitle title="Forgot your password?" />
            </div>

            <p className="mt-3 text-sm leading-6 text-[var(--sonora-muted)]">
              Enter your email and SONORA will
              send a secure password reset link.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-5"
          >
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
                  setEmail(
                    event.target.value,
                  )
                }
                autoComplete="email"
                placeholder="you@example.com"
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
              disabled={loading}
              className="w-full"
            >
              {loading
                ? "Sending..."
                : "Send Reset Link"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--sonora-muted)]">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-[var(--sonora-amber)] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </GlassPanel>
      </div>
    </main>
  );
}