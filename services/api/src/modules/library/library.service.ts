import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class LibraryService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  private readonly musicItemInclude = {
    artist: true,
    album: true,
  } as const;

  async getLibrary(userId: string) {
    const items =
      await this.prisma.savedMusicItem.findMany({
        where: { userId },
        include: {
          musicItem: {
            include: this.musicItemInclude,
          },
        },
        orderBy: {
          createdAt: "desc",
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

  async getTrackStatus(
    userId: string,
    musicItemId: string,
  ) {
    const item =
      await this.prisma.savedMusicItem.findUnique({
        where: {
          userId_musicItemId: {
            userId,
            musicItemId,
          },
        },
        include: {
          musicItem: {
            include: this.musicItemInclude,
          },
        },
      });

    return {
      success: true,
      data: {
        saved: Boolean(item),
        item,
      },
    };
  }

  async saveTrack(
    userId: string,
    musicItemId: string,
  ) {
    const musicItem =
      await this.prisma.musicItem.findUnique({
        where: { id: musicItemId },
        select: { id: true },
      });

    if (!musicItem) {
      throw new NotFoundException(
        "Music item not found.",
      );
    }

    const item =
      await this.prisma.savedMusicItem.upsert({
        where: {
          userId_musicItemId: {
            userId,
            musicItemId,
          },
        },
        create: {
          userId,
          musicItemId,
        },
        update: {},
        include: {
          musicItem: {
            include: this.musicItemInclude,
          },
        },
      });

    return {
      success: true,
      data: item,
    };
  }

  async unsaveTrack(
    userId: string,
    musicItemId: string,
  ) {
    const existing =
      await this.prisma.savedMusicItem.findUnique({
        where: {
          userId_musicItemId: {
            userId,
            musicItemId,
          },
        },
        select: { id: true },
      });

    if (existing) {
      await this.prisma.savedMusicItem.delete({
        where: { id: existing.id },
      });
    }

    return {
      success: true,
      data: null,
    };
  }
}
