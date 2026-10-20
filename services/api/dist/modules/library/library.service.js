"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibraryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let LibraryService = class LibraryService {
    constructor(prisma) {
        this.prisma = prisma;
        this.musicItemInclude = {
            artist: true,
            album: true,
        };
    }
    async getLibrary(userId) {
        const items = await this.prisma.savedMusicItem.findMany({
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
    async getTrackStatus(userId, musicItemId) {
        const item = await this.prisma.savedMusicItem.findUnique({
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
    async saveTrack(userId, musicItemId) {
        const musicItem = await this.prisma.musicItem.findUnique({
            where: { id: musicItemId },
            select: { id: true },
        });
        if (!musicItem) {
            throw new common_1.NotFoundException("Music item not found.");
        }
        const item = await this.prisma.savedMusicItem.upsert({
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
    async unsaveTrack(userId, musicItemId) {
        const existing = await this.prisma.savedMusicItem.findUnique({
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
};
exports.LibraryService = LibraryService;
exports.LibraryService = LibraryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LibraryService);
//# sourceMappingURL=library.service.js.map