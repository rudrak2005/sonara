import { Injectable } from "@nestjs/common";

type PreferenceInput = {
  personalizationEnabled: boolean;
  pulseEnabled: boolean;
  memoryEnabled: boolean;
  aiAssistantEnabled: boolean;
  reducedMotion: boolean;
  privateSessionDefault: boolean;
};

@Injectable()
export class PrivacyPolicyService {
  canPersonalize(
    preferences: PreferenceInput,
  ) {
    return preferences.personalizationEnabled;
  }

  canUsePulse(
    preferences: PreferenceInput,
  ) {
    return preferences.pulseEnabled;
  }

  canUseMemory(
    preferences: PreferenceInput,
  ) {
    return preferences.memoryEnabled;
  }

  canUseAiAssistant(
    preferences: PreferenceInput,
  ) {
    return preferences.aiAssistantEnabled;
  }

  shouldReduceMotion(
    preferences: PreferenceInput,
  ) {
    return preferences.reducedMotion;
  }

  shouldStartPrivate(
    preferences: PreferenceInput,
  ) {
    return preferences.privateSessionDefault;
  }
}