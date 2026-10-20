"use client";

import {
  FormEvent,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  Badge,
  Button,
  GlassPanel,
  SectionTitle,
} from "@sonora/ui";


import {
  useAuthStore,
} from "@/stores/auth-store";
import { ApiError } from "@/lib/api/errors";
import Link from "next/dist/client/link";

export default function LoginPage() {
  const router = useRouter();

  const login =
    useAuthStore(
      (state) => state.login,
    );

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
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

  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    setError("Please enter your email address.");
    return;
  }

  if (password.length < 8) {
    setError("Password must be at least 8 characters.");
    return;
  }

  setLoading(true);

  try {
  await login(
  normalizedEmail,
  password,
);

router.replace("/onboarding");
router.refresh();
  } catch (err) {
    setError(
      err instanceof ApiError
        ? err.message
        : "Login failed. Please try again.",
    );
  } finally {
    setLoading(false);
  }
}


  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-md">
        <GlassPanel className="p-6">
          <Badge>
            SONORA ACCESS
          </Badge>

          <div className="mt-4">
            <SectionTitle
              title="Welcome back"
            />

            <p className="mt-2 text-sm text-[var(--sonora-muted)]">
              Continue your personal listening world.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4"
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
              <div className="flex justify-end">
  <Link
    href="/forgot-password"
    className="text-sm text-[var(--sonora-amber)] hover:underline"
  >
    Forgot password?
  </Link>
</div>

              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value,
                  )
                }
                className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3"
                placeholder="Your password"
                autoComplete="current-password"
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
                ? "Signing in..."
                : "Sign in"}
            </Button>
          </form>
        </GlassPanel>
      </div>
    </main>
  );
}