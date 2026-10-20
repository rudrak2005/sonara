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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_js_1 = require("../../database/prisma.service.js");
let AnalyticsService = class AnalyticsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async ingest(userId, dto) {
        const musicItem = await this.prisma.musicItem.findUnique({
            where: { id: dto.musicItemId },
            select: { id: true },
        });
        if (!musicItem) {
            throw new common_1.NotFoundException("Music item not found.");
        }
        if (dto.positionMs !== undefined &&
            dto.durationMs !== undefined &&
            dto.positionMs > dto.durationMs) {
            throw new common_1.BadRequestException("positionMs cannot exceed durationMs.");
        }
        if (dto.sessionId) {
            const session = await this.prisma.session.findFirst({
                where: {
                    id: dto.sessionId,
                    userId,
                },
                select: { id: true },
            });
            if (!session) {
                throw new common_1.NotFoundException("Listening session not found.");
            }
        }
        const idempotencyKey = dto.idempotencyKey.trim();
        if (!idempotencyKey) {
            throw new common_1.BadRequestException("idempotencyKey is required.");
        }
        const existing = await this.prisma.listeningEvent.findUnique({
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
            const event = await this.prisma.listeningEvent.create({
                data: {
                    userId,
                    musicItemId: dto.musicItemId,
                    eventType: dto.eventType,
                    sessionId: dto.sessionId ?? null,
                    positionMs: dto.positionMs ?? null,
                    durationMs: dto.durationMs ?? null,
                    source: dto.source?.trim() || "WEB",
                    contextJson: dto.contextJson
                        ? dto.contextJson
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
        }
        catch (error) {
            const isUniqueViolation = typeof error === "object" &&
                error !== null &&
                "code" in error &&
                error.code === "P2002";
            if (!isUniqueViolation) {
                throw error;
            }
            const duplicate = await this.prisma.listeningEvent.findUnique({
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
    async recent(userId, limit = 25) {
        const safeLimit = Math.min(Math.max(limit, 1), 100);
        const items = await this.prisma.listeningEvent.findMany({
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
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map