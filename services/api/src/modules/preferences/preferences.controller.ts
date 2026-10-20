import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";

import type { Request } from "express";

import { PreferencesService } from "./preferences.service";
import {
  UpdatePreferencesDto,
} from "./dto/update-preferences.dto";
import {
  UpdateOnboardingProfileDto,
} from "./dto/update-onboarding-profile.dto";

import {
  SessionGuard,
} from "../auth/guards/session.guard";

type AuthenticatedRequest = Request & {
  user?: {
    id: string;
  };
};

@Controller("preferences")
@UseGuards(SessionGuard)
export class PreferencesController {
  constructor(
    private readonly preferencesService:
      PreferencesService,
  ) {}

  @Get("me")
  async getMyPreferences(
    @Req()
    request: AuthenticatedRequest,
  ) {
    const preferences =
      await this.preferencesService.getForUser(
        request.user!.id,
      );

    return {
      success: true,
      data: preferences,
    };
  }

  @Patch("me")
  async updateMyPreferences(
    @Req()
    request: AuthenticatedRequest,
    @Body()
    dto: UpdatePreferencesDto,
  ) {
    const preferences =
      await this.preferencesService.updateForUser(
        request.user!.id,
        dto,
      );

    return {
      success: true,
      data: preferences,
    };
  }

  @Get("onboarding-status")
  async getOnboardingStatus(
    @Req()
    request: AuthenticatedRequest,
  ) {
    const completed =
      await this.preferencesService
        .isOnboardingComplete(
          request.user!.id,
        );

    return {
      success: true,
      data: {
        completed,
      },
    };
  }

  @Post("onboarding")
  async completeOnboarding(
    @Req()
    request: AuthenticatedRequest,

    @Body()
    body: {
      profile?: UpdateOnboardingProfileDto;
      preferences: UpdatePreferencesDto;
    },
  ) {
    const preferences =
      await this.preferencesService.completeOnboarding(
        request.user!.id,
        {
          displayName:
            body.profile?.displayName,
          timezone:
            body.profile?.timezone,
          preferences:
            body.preferences,
        },
      );

    return {
      success: true,
      data: {
        completed: true,
        preferences,
      },
    };
  }
}