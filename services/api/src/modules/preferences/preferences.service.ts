import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../../database/prisma.service";

import {
  UpdatePreferencesDto,
} from "./dto/update-preferences.dto";

@Injectable()
export class PreferencesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getForUser(userId: string) {
    const preference =
      await this.prisma.userPreference.findUnique({
        where: {
          userId,
        },
      });

    if (!preference) {
      throw new NotFoundException({
        message: "User preferences were not found.",
        error: "PREFERENCES_NOT_FOUND",
      });
    }

    return preference;
  }

  async updateForUser(
    userId: string,
    dto: UpdatePreferencesDto,
  ) {
    return this.prisma.userPreference.update({
      where: {
        userId,
      },
      data: {
        ...dto,
      },
    });
  }

  async completeOnboarding(
    userId: string,
    input: {
      displayName?: string;
      timezone?: string;
      preferences: UpdatePreferencesDto;
    },
  ) {
    const displayName =
      input.displayName?.trim();

    const timezone =
      input.timezone?.trim();

    return this.prisma.$transaction(
      async (tx) => {
        if (displayName || timezone) {
          await tx.profile.update({
            where: {
              userId,
            },
            data: {
              ...(displayName
                ? { displayName }
                : {}),
              ...(timezone
                ? { timezone }
                : {}),
            },
          });
        }

        return tx.userPreference.update({
          where: {
            userId,
          },
          data: {
            ...input.preferences,
            onboardingCompleted: true,
          },
        });
      },
    );
  }

  async isOnboardingComplete(
    userId: string,
  ): Promise<boolean> {
    const preference =
      await this.prisma.userPreference.findUnique({
        where: {
          userId,
        },
        select: {
          onboardingCompleted: true,
        },
      });

    return (
      preference?.onboardingCompleted === true
    );
  }
}