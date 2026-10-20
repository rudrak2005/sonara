"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import SonoraLoader from "@/app/components/sonora-loader";

type AuthGateProps = {
  children: ReactNode;
};

export function AuthGate({ children }: AuthGateProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      try {
        const response = await fetch("/api/v1/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!active) return;

        if (!response.ok) {
          router.replace("/login");
          return;
        }

        setAuthenticated(true);
      } catch {
        router.replace("/login");
      } finally {
        if (active) {
          setChecking(false);
        }
      }
    }

    checkSession();

    return () => {
      active = false;
    };
  }, [router]);

  if (checking) {
    return <SonoraLoader />;
  }

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
}