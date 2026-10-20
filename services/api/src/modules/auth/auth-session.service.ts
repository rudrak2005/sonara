import { Injectable } from "@nestjs/common";
import {
  createHash,
  randomBytes,
} from "node:crypto";

import { PrismaService } from "../../database/prisma.service";

import {
  AUTH_SESSION_TTL_MS,
} from "./auth.constants";

@Injectable()
export class AuthSessionService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  private hashToken(token: string) {
    return createHash("sha256")
      .update(token)
      .digest("hex");
  }

  async create(userId: string) {
    const token =
      randomBytes(32).toString("hex");

    const tokenHash =
      this.hashToken(token);

    const expiresAt = new Date(
      Date.now() +
        AUTH_SESSION_TTL_MS,
    );

    const session =
      await this.prisma.authSession.create({
        data: {
          userId,
          tokenHash,
          expiresAt,
        },
      });

    return {
      token,
      session,
    };
  }

  async findValidSession(
    token: string,
  ) {
    const tokenHash =
      this.hashToken(token);

    const session =
      await this.prisma.authSession.findUnique(
        {
          where: {
            tokenHash,
          },
          include: {
            user: {
              include: {
                profile: true,
                preference: true,
              },
            },
          },
        },
      );

    if (!session) {
      return null;
    }

    if (session.revokedAt) {
      return null;
    }

    if (
      session.expiresAt.getTime() <=
      Date.now()
    ) {
      return null;
    }

    return session;
  }

  async touch(sessionId: string) {
    await this.prisma.authSession.update({
      where: {
        id: sessionId,
      },
      data: {
        lastUsedAt: new Date(),
      },
    });
  }

  async revoke(token: string) {
    const tokenHash =
      this.hashToken(token);

    await this.prisma.authSession.updateMany(
      {
        where: {
          tokenHash,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      },
    );
  }
}