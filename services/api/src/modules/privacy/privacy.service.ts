import {
  BadRequestException,
  Injectable,
} from "@nestjs/common";

import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class PrivacyService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getStatus(userId: string) {
    const preference =
      await this.prisma.userPreference.findUnique({
        where: {
          userId,
        },
        select: {
          personalizationEnabled: true,
          pulseEnabled: true,
          memoryEnabled: true,
          aiAssistantEnabled: true,
          reducedMotion: true,
          privateSessionDefault: true,
          discoveryLevel: true,
          atmosphereMode: true,
        },
      });

    if (!preference) {
      throw new BadRequestException({
        message:
          "Privacy preferences not found.",
        error:
          "PRIVACY_PREFERENCES_NOT_FOUND",
      });
    }

    return preference;
  }

  async resetHistory(userId: string) {
    await this.prisma.$transaction([
      this.prisma.sessionItem.deleteMany({
        where: {
          session: {
            userId,
          },
        },
      }),

      this.prisma.session.deleteMany({
        where: {
          userId,
        },
      }),
    ]);

    return {
      reset: true,
      resetAt: new Date(),
    };
  }
}