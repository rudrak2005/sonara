import { Injectable } from "@nestjs/common";

import { PrismaService } from "../../database/prisma.service";

type CreateUserAccountInput = {
  email: string;
  passwordHash: string;
  displayName: string;
  timezone: string;
};

@Injectable()
export class UsersRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        profile: true,
        preference: true,
      },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        profile: true,
        preference: true,
      },
    });
  }

  createAccount(
    input: CreateUserAccountInput,
  ) {
    return this.prisma.user.create({
      data: {
        email: input.email,
        passwordHash: input.passwordHash,

        profile: {
          create: {
            displayName:
              input.displayName,
            timezone:
              input.timezone,
            locale: "en-IN",
          },
        },

        preference: {
          create: {},
        },
      },

      select: {
        id: true,
        email: true,
        status: true,
        role: true,
        createdAt: true,

        profile: {
          select: {
            displayName: true,
            avatarUrl: true,
            bio: true,
            locale: true,
            timezone: true,
          },
        },

        preference: {
          select: {
            autoAtmosphereEnabled: true,
            atmosphereMode: true,
            personalizationEnabled: true,
            pulseEnabled: true,
            memoryEnabled: true,
            discoveryLevel: true,
            aiAssistantEnabled: true,
            reducedMotion: true,
            privateSessionDefault: true,
          },
        },
      },
    });
  }
}