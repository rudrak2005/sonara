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
exports.PasswordResetService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const prisma_service_1 = require("../../database/prisma.service");
const password_service_1 = require("./password.service");
let PasswordResetService = class PasswordResetService {
    constructor(prisma, passwordService) {
        this.prisma = prisma;
        this.passwordService = passwordService;
        this.tokenTtlMs = 15 * 60 * 1000;
    }
    hashToken(token) {
        return (0, node_crypto_1.createHash)("sha256")
            .update(token)
            .digest("hex");
    }
    async requestReset(email) {
        const normalizedEmail = email.trim().toLowerCase();
        const user = await this.prisma.user.findUnique({
            where: {
                email: normalizedEmail,
            },
        });
        if (!user) {
            return;
        }
        const rawToken = (0, node_crypto_1.randomBytes)(32).toString("hex");
        const tokenHash = this.hashToken(rawToken);
        const expiresAt = new Date(Date.now() + this.tokenTtlMs);
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
    async resetPassword(token, newPassword) {
        const tokenHash = this.hashToken(token);
        const resetToken = await this.prisma.passwordResetToken.findUnique({
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
        if (resetToken.expiresAt.getTime() <=
            Date.now()) {
            throw new Error("RESET_TOKEN_EXPIRED");
        }
        const passwordHash = await this.passwordService.hash(newPassword);
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
};
exports.PasswordResetService = PasswordResetService;
exports.PasswordResetService = PasswordResetService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        password_service_1.PasswordService])
], PasswordResetService);
//# sourceMappingURL=password-reset.service.js.map