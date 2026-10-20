export type UserProfile = {
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  locale: string;
  timezone: string;
};

export type UserPreference = {
  autoAtmosphereEnabled: boolean;
  atmosphereMode:
    | "OFF"
    | "AUTO"
    | "MANUAL";

  personalizationEnabled: boolean;
  pulseEnabled: boolean;
  memoryEnabled: boolean;

  discoveryLevel:
    | "LOW"
    | "BALANCED"
    | "HIGH";

  aiAssistantEnabled: boolean;
  reducedMotion: boolean;
  privateSessionDefault: boolean;

  onboardingCompleted?: boolean;
};

export type AuthenticatedUser = {
  id: string;
  email: string;
  status: string;
  role: string;
  createdAt: string;

  profile: UserProfile | null;
  preference: UserPreference | null;
};

export type OnboardingStatus = {
  completed: boolean;
};