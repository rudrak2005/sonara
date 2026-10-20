export interface UserProfile {
  id: string;
  displayName: string;
  avatarUrl?: string;
  locale: string;
  timezone: string;
}

export interface UserSettings {
  autoAtmosphereEnabled: boolean;
  atmosphereMode:
    | "AUTO"
    | "SUBTLE"
    | "FULL"
    | "OFF";
  personalizationEnabled: boolean;
  pulseEnabled: boolean;
  memoryEnabled: boolean;
  discoveryLevel: number;
  aiAssistantEnabled: boolean;
  reducedMotion: boolean;
  privateSessionDefault: boolean;
}