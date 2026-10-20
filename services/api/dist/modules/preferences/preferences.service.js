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
exports.PreferencesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let PreferencesService = class PreferencesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getForUser(userId) {
        const preference = await this.prisma.userPreference.findUnique({
            where: {
                userId,
            },
        });
        if (!preference) {
            throw new common_1.NotFoundException({
                message: "User preferences were not found.",
                error: "PREFERENCES_NOT_FOUND",
            });
        }
        return preference;
    }
    async updateForUser(userId, dto) {
        return this.prisma.userPreference.update({
            where: {
                userId,
            },
            data: {
                ...dto,
            },
        });
    }
    async completeOnboarding(userId, input) {
        const displayName = input.displayName?.trim();
        const timezone = input.timezone?.trim();
        return this.prisma.$transaction(async (tx) => {
            if (displayName || timezone) {
                await tx.profile.update({
                    where: {
                        userId,
                    },
                    data: {
                        ...(displayName
                            ? { displayName }
                            : {}),
                        ...(timezone
                            ? { timezone }
                            : {}),
                    },
                });
            }
            return tx.userPreference.update({
                where: {
                    userId,
                },
                data: {
                    ...input.preferences,
                    onboardingCompleted: true,
                },
            });
        });
    }
    async isOnboardingComplete(userId) {
        const preference = await this.prisma.userPreference.findUnique({
            where: {
                userId,
            },
            select: {
                onboardingCompleted: true,
            },
        });
        return (preference?.onboardingCompleted === true);
    }
};
exports.PreferencesService = PreferencesService;
exports.PreferencesService = PreferencesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PreferencesService);
//# sourceMappingURL=preferences.service.js.map