import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service.js";
import { Prisma } from "../../generated/prisma/client.js";
import { TrackEventDto } from "./dto/track-event.dto.js";

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async ingest(
    userId: string,
    dto: TrackEventDto,
  ) {
    const musicItem =
      await this.prisma.musicItem.findUnique({
        where: { id: dto.musicItemId },
        select: { id: true },
      });

    if (!musicItem) {
      throw new NotFoundException(
        "Music item not found.",
      );
    }

    if (
      dto.positionMs !== undefined &&
      dto.durationMs !== undefined &&
      dto.positionMs > dto.durationMs
    ) {
      throw new BadRequestException(
        "positionMs cannot exceed durationMs.",
      );
    }

    if (dto.sessionId) {
      const session =
        await this.prisma.session.findFirst({
          where: {
            id: dto.sessionId,
            userId,
          },
          select: { id: true },
        });

      if (!session) {
        throw new NotFoundException(
          "Listening session not found.",
        );
      }
    }

    const idempotencyKey =
      dto.idempotencyKey.trim();

    if (!idempotencyKey) {
      throw new BadRequestException(
        "idempotencyKey is required.",
      );
    }

    const existing =
      await this.prisma.listeningEvent.findUnique({
        where: {
          userId_idempotencyKey: {
            userId,
            idempotencyKey,
          },
        },
      });

    if (existing) {
      return {
        success: true,
        data: {
          id: existing.id,
          eventType: existing.eventType,
          timestamp: existing.timestamp,
          duplicate: true,
        },
      };
    }

    try {
      const event =
        await this.prisma.listeningEvent.create({
          data: {
            userId,
            musicItemId: dto.musicItemId,
            eventType: dto.eventType,
            sessionId: dto.sessionId ?? null,
            positionMs: dto.positionMs ?? null,
            durationMs: dto.durationMs ?? null,
            source: dto.source?.trim() || "WEB",
            contextJson: dto.contextJson
              ? (dto.contextJson as Prisma.InputJsonValue)
              : undefined,
            idempotencyKey,
          },
        });

      return {
        success: true,
        data: {
          id: event.id,
          eventType: event.eventType,
          timestamp: event.timestamp,
          duplicate: false,
        },
      };
    } catch (error) {
      const isUniqueViolation =
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2002";

      if (!isUniqueViolation) {
        throw error;
      }

      const duplicate =
        await this.prisma.listeningEvent.findUnique({
          where: {
            userId_idempotencyKey: {
              userId,
              idempotencyKey,
            },
          },
        });

      if (!duplicate) {
        throw error;
      }

      return {
        success: true,
        data: {
          id: duplicate.id,
          eventType: duplicate.eventType,
          timestamp: duplicate.timestamp,
          duplicate: true,
        },
      };
    }
  }

  async recent(
    userId: string,
    limit = 25,
  ) {
    const safeLimit = Math.min(
      Math.max(limit, 1),
      100,
    );

    const items =
      await this.prisma.listeningEvent.findMany({
        where: { userId },
        include: {
          musicItem: {
            include: {
              artist: true,
              album: true,
            },
          },
        },
        orderBy: { timestamp: "desc" },
        take: safeLimit,
      });

    return {
      success: true,
      data: {
        count: items.length,
        items,
      },
    };
  }
}
