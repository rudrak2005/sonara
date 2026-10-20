"use client";

import { create } from "zustand";

import { apiRequest } from "@/lib/api/client";

type AuthUser = {
  id: string;
  email: string;
  status: string;
  role: string;
  createdAt: string;

  profile: {
    displayName: string;
    avatarUrl: string | null;
    bio: string | null;
    locale: string;
    timezone: string;
  } | null;

  preference: {
    autoAtmosphereEnabled: boolean;
    atmosphereMode: "OFF" | "AUTO" | "MANUAL";
    personalizationEnabled: boolean;
    pulseEnabled: boolean;
    memoryEnabled: boolean;
    discoveryLevel: "LOW" | "BALANCED" | "HIGH";
    aiAssistantEnabled: boolean;
    reducedMotion: boolean;
    privateSessionDefault: boolean;
    onboardingCompleted?: boolean;
  } | null;
};

type AuthState = {
  user: AuthUser | null;
  loading: boolean;

  login: (
    email: string,
    password: string,
  ) => Promise<AuthUser>;

  logout: () => Promise<void>;

  loadMe: () => Promise<AuthUser | null>;
};

export const useAuthStore =
  create<AuthState>((set) => ({
    user: null,
    loading: false,

    async login(
      email,
      password,
    ) {
      set({
        loading: true,
      });

      try {
        const user =
          await apiRequest<AuthUser>(
            "/api/v1/auth/login",
            {
              method: "POST",
              body: JSON.stringify({
                email,
                password,
              }),
            },
          );

        set({
          user,
          loading: false,
        });

        return user;
      } catch (error) {
        set({
          loading: false,
        });

        throw error;
      }
    },

    async logout() {
      await apiRequest(
        "/api/v1/auth/logout",
        {
          method: "POST",
        },
      );

      set({
        user: null,
      });
    },

    async loadMe() {
      try {
        const user =
          await apiRequest<AuthUser>(
            "/api/v1/auth/me",
          );

        set({
          user,
        });

        return user;
      } catch {
        set({
          user: null,
        });

        return null;
      }
    },
  }));