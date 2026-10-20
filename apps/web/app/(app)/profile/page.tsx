"use client";

import {
  useEffect,
} from "react";

import { useRouter } from "next/navigation";

import {
  Badge,
  GlassPanel,
  SectionTitle,
} from "@sonora/ui";

import {
  useAuthStore,
} from "@/stores/auth-store";

export default function ProfilePage() {
  const router = useRouter();

  const user =
    useAuthStore(
      (state) => state.user,
    );

  const loading =
    useAuthStore(
      (state) => state.loading,
    );

  const loadMe =
    useAuthStore(
      (state) => state.loadMe,
    );

  useEffect(() => {
    void loadMe();
  }, [loadMe]);

  useEffect(() => {
    if (
      !loading &&
      !user
    ) {
      router.replace("/login");
    }
  }, [
    loading,
    user,
    router,
  ]);

  if (loading) {
    return (
      <div className="p-8">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="p-6">
      <GlassPanel className="p-6">
        <Badge>
          AUTHENTICATED
        </Badge>

        <div className="mt-4">
          <SectionTitle
            title={
              user.profile?.displayName ??
              "SONORA User"
            }
          />

          <p className="mt-2 text-sm text-[var(--sonora-muted)]">
            {user.email}
          </p>

          <p className="mt-4 text-sm">
            Role: {user.role}
          </p>
        </div>
      </GlassPanel>
    </div>
    
  );
}