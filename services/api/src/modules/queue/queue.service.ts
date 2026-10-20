import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../../database/prisma.service";
import { AddQueueItemDto } from "./dto/add-queue-item.dto";
import { ReorderQueueDto } from "./dto/reorder-queue.dto";

@Injectable()
export class QueueService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getQueue(userId: string) {
    const items =
      await this.prisma.queueItem.findMany({
        where: { userId },
        include: {
          musicItem: {
            include: {
              artist: true,
              album: true,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      });

    return {
      success: true,
      data: {
        count: items.length,
        items,
      },
    };
  }

  async add(
    userId: string,
    dto: AddQueueItemDto,
  ) {
    return this.prisma.$transaction(
      async (tx) => {
        await tx.$executeRaw`
          SELECT pg_advisory_xact_lock(
            hashtextextended(${userId}, 0)
          )
        `;

        const musicItem =
          await tx.musicItem.findUnique({
            where: {
              id: dto.musicItemId,
            },
          });

        if (!musicItem) {
          throw new NotFoundException(
            "Music item not found.",
          );
        }

        const existing =
          await tx.queueItem.findFirst({
            where: {
              userId,
              musicItemId:
                dto.musicItemId,
            },
            orderBy: {
              position: "asc",
            },
          });

        if (existing) {
          return {
            success: true,
            data: existing,
          };
        }

        const last =
          await tx.queueItem.findFirst({
            where: { userId },
            orderBy: {
              position: "desc",
            },
            select: {
              position: true,
            },
          });

        const position =
          (last?.position ?? -1) + 1;

        const item =
          await tx.queueItem.create({
            data: {
              userId,
              musicItemId:
                dto.musicItemId,
              position,
            },
            include: {
              musicItem: {
                include: {
                  artist: true,
                  album: true,
                },
              },
            },
          });

        return {
          success: true,
          data: item,
        };
      },
    );
  }

  async remove(
    userId: string,
    id: string,
  ) {
    return this.prisma.$transaction(
      async (tx) => {
        await tx.$executeRaw`
          SELECT pg_advisory_xact_lock(
            hashtextextended(${userId}, 0)
          )
        `;

        const item =
          await tx.queueItem.findFirst({
            where: {
              id,
              userId,
            },
          });

        if (!item) {
          throw new NotFoundException(
            "Queue item not found.",
          );
        }

        await tx.queueItem.delete({
          where: {
            id: item.id,
          },
        });

        await tx.queueItem.updateMany({
          where: {
            userId,
            position: {
              gt: item.position,
            },
          },
          data: {
            position: {
              decrement: 1,
            },
          },
        });

        return {
          success: true,
          data: null,
        };
      },
    );
  }

  async clear(userId: string) {
    await this.prisma.queueItem.deleteMany({
      where: { userId },
    });

    return {
      success: true,
      data: null,
    };
  }

  async reorder(
    userId: string,
    id: string,
    dto: ReorderQueueDto,
  ) {
    return this.prisma.$transaction(
      async (tx) => {
        await tx.$executeRaw`
          SELECT pg_advisory_xact_lock(
            hashtextextended(${userId}, 0)
          )
        `;

        const item =
          await tx.queueItem.findFirst({
            where: {
              id,
              userId,
            },
          });

        if (!item) {
          throw new NotFoundException(
            "Queue item not found.",
          );
        }

        const count =
          await tx.queueItem.count({
            where: { userId },
          });

        if (
          dto.position >= count
        ) {
          throw new BadRequestException(
            `Position must be between 0 and ${Math.max(
              count - 1,
              0,
            )}.`,
          );
        }

        if (
          dto.position === item.position
        ) {
          return {
            success: true,
            data: item,
          };
        }

        if (
          dto.position < item.position
        ) {
          await tx.queueItem.updateMany({
            where: {
              userId,
              position: {
                gte: dto.position,
                lt: item.position,
              },
            },
            data: {
              position: {
                increment: 1,
              },
            },
          });
        } else {
          await tx.queueItem.updateMany({
            where: {
              userId,
              position: {
                gt: item.position,
                lte: dto.position,
              },
            },
            data: {
              position: {
                decrement: 1,
              },
            },
          });
        }

        const updated =
          await tx.queueItem.update({
            where: {
              id: item.id,
            },
            data: {
              position:
                dto.position,
            },
            include: {
              musicItem: {
                include: {
                  artist: true,
                  album: true,
                },
              },
            },
          });

        return {
          success: true,
          data: updated,
        };
      },
    );
  }
}
