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
exports.PrivacyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let PrivacyService = class PrivacyService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStatus(userId) {
        const preference = await this.prisma.userPreference.findUnique({
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
            throw new common_1.BadRequestException({
                message: "Privacy preferences not found.",
                error: "PRIVACY_PREFERENCES_NOT_FOUND",
            });
        }
        return preference;
    }
    async resetHistory(userId) {
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
};
exports.PrivacyService = PrivacyService;
exports.PrivacyService = PrivacyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrivacyService);
//# sourceMappingURL=privacy.service.js.map