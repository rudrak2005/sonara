import {
  Injectable,
} from "@nestjs/common";

import {
  createHash,
  randomBytes,
} from "node:crypto";

import { PrismaService } from "../../database/prisma.service";
import { PasswordService } from "./password.service";

@Injectable()
export class PasswordResetService {
  private readonly tokenTtlMs =
    15 * 60 * 1000;

  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  private hashToken(token: string): string {
    return createHash("sha256")
      .update(token)
      .digest("hex");
  }

  async requestReset(email: string) {
    const normalizedEmail =
      email.trim().toLowerCase();

    const user =
      await this.prisma.user.findUnique({
        where: {
          email: normalizedEmail,
        },
      });

    /*
     * Important:
     * Same response whether user exists or not.
     */
    if (!user) {
      return;
    }

    const rawToken =
      randomBytes(32).toString("hex");

    const tokenHash =
      this.hashToken(rawToken);

    const expiresAt = new Date(
      Date.now() + this.tokenTtlMs,
    );

    /*
     * Invalidate older unused tokens.
     */
    await this.prisma.passwordResetToken.updateMany({
      where: {
        userId: user.id,
        usedAt: null,
      },
      data: {
        usedAt: new Date(),
      },
    });

    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    return {
      email: user.email,
      token: rawToken,
    };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ) {
    const tokenHash =
      this.hashToken(token);

    const resetToken =
      await this.prisma.passwordResetToken.findUnique({
        where: {
          tokenHash,
        },
      });

    if (!resetToken) {
      throw new Error("INVALID_RESET_TOKEN");
    }

    if (resetToken.usedAt) {
      throw new Error("RESET_TOKEN_ALREADY_USED");
    }

    if (
      resetToken.expiresAt.getTime() <=
      Date.now()
    ) {
      throw new Error("RESET_TOKEN_EXPIRED");
    }

    const passwordHash =
      await this.passwordService.hash(
        newPassword,
      );

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: {
          id: resetToken.userId,
        },
        data: {
          passwordHash,
        },
      }),

      this.prisma.passwordResetToken.update({
        where: {
          id: resetToken.id,
        },
        data: {
          usedAt: new Date(),
        },
      }),

      /*
       * Password change invalidates
       * currently active sessions.
       */
      this.prisma.authSession.updateMany({
        where: {
          userId: resetToken.userId,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      }),
    ]);
  }
}