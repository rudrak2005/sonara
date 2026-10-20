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
exports.AuthSessionService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const prisma_service_1 = require("../../database/prisma.service");
const auth_constants_1 = require("./auth.constants");
let AuthSessionService = class AuthSessionService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    hashToken(token) {
        return (0, node_crypto_1.createHash)("sha256")
            .update(token)
            .digest("hex");
    }
    async create(userId) {
        const token = (0, node_crypto_1.randomBytes)(32).toString("hex");
        const tokenHash = this.hashToken(token);
        const expiresAt = new Date(Date.now() +
            auth_constants_1.AUTH_SESSION_TTL_MS);
        const session = await this.prisma.authSession.create({
            data: {
                userId,
                tokenHash,
                expiresAt,
            },
        });
        return {
            token,
            session,
        };
    }
    async findValidSession(token) {
        const tokenHash = this.hashToken(token);
        const session = await this.prisma.authSession.findUnique({
            where: {
                tokenHash,
            },
            include: {
                user: {
                    include: {
                        profile: true,
                        preference: true,
                    },
                },
            },
        });
        if (!session) {
            return null;
        }
        if (session.revokedAt) {
            return null;
        }
        if (session.expiresAt.getTime() <=
            Date.now()) {
            return null;
        }
        return session;
    }
    async touch(sessionId) {
        await this.prisma.authSession.update({
            where: {
                id: sessionId,
            },
            data: {
                lastUsedAt: new Date(),
            },
        });
    }
    async revoke(token) {
        const tokenHash = this.hashToken(token);
        await this.prisma.authSession.updateMany({
            where: {
                tokenHash,
                revokedAt: null,
            },
            data: {
                revokedAt: new Date(),
            },
        });
    }
};
exports.AuthSessionService = AuthSessionService;
exports.AuthSessionService = AuthSessionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthSessionService);
//# sourceMappingURL=auth-session.service.js.map