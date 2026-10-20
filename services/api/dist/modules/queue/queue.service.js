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
exports.QueueService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let QueueService = class QueueService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getQueue(userId) {
        const items = await this.prisma.queueItem.findMany({
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
    async add(userId, dto) {
        return this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `
          SELECT pg_advisory_xact_lock(
            hashtextextended(${userId}, 0)
          )
        `;
            const musicItem = await tx.musicItem.findUnique({
                where: {
                    id: dto.musicItemId,
                },
            });
            if (!musicItem) {
                throw new common_1.NotFoundException("Music item not found.");
            }
            const existing = await tx.queueItem.findFirst({
                where: {
                    userId,
                    musicItemId: dto.musicItemId,
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
            const last = await tx.queueItem.findFirst({
                where: { userId },
                orderBy: {
                    position: "desc",
                },
                select: {
                    position: true,
                },
            });
            const position = (last?.position ?? -1) + 1;
            const item = await tx.queueItem.create({
                data: {
                    userId,
                    musicItemId: dto.musicItemId,
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
        });
    }
    async remove(userId, id) {
        return this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `
          SELECT pg_advisory_xact_lock(
            hashtextextended(${userId}, 0)
          )
        `;
            const item = await tx.queueItem.findFirst({
                where: {
                    id,
                    userId,
                },
            });
            if (!item) {
                throw new common_1.NotFoundException("Queue item not found.");
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
        });
    }
    async clear(userId) {
        await this.prisma.queueItem.deleteMany({
            where: { userId },
        });
        return {
            success: true,
            data: null,
        };
    }
    async reorder(userId, id, dto) {
        return this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `
          SELECT pg_advisory_xact_lock(
            hashtextextended(${userId}, 0)
          )
        `;
            const item = await tx.queueItem.findFirst({
                where: {
                    id,
                    userId,
                },
            });
            if (!item) {
                throw new common_1.NotFoundException("Queue item not found.");
            }
            const count = await tx.queueItem.count({
                where: { userId },
            });
            if (dto.position >= count) {
                throw new common_1.BadRequestException(`Position must be between 0 and ${Math.max(count - 1, 0)}.`);
            }
            if (dto.position === item.position) {
                return {
                    success: true,
                    data: item,
                };
            }
            if (dto.position < item.position) {
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
            }
            else {
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
            const updated = await tx.queueItem.update({
                where: {
                    id: item.id,
                },
                data: {
                    position: dto.position,
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
        });
    }
};
exports.QueueService = QueueService;
exports.QueueService = QueueService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QueueService);
//# sourceMappingURL=queue.service.js.map