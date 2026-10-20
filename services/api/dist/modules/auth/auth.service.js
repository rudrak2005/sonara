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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const auth_session_service_1 = require("./auth-session.service");
const password_service_1 = require("./password.service");
let AuthService = class AuthService {
    constructor(usersService, passwordService, authSessionService) {
        this.usersService = usersService;
        this.passwordService = passwordService;
        this.authSessionService = authSessionService;
    }
    async register(dto) {
        const email = dto.email
            .trim()
            .toLowerCase();
        const existingUser = await this.usersService.getByEmail(email);
        if (existingUser) {
            throw new common_1.ConflictException({
                message: "An account with this email already exists.",
                error: "EMAIL_ALREADY_REGISTERED",
            });
        }
        const passwordHash = await this.passwordService.hash(dto.password);
        const displayName = dto.displayName?.trim() ||
            email.split("@")[0];
        const timezone = dto.timezone?.trim() || "UTC";
        try {
            return await this.usersService.createAccount({
                email,
                passwordHash,
                displayName,
                timezone,
            });
        }
        catch (error) {
            if (this.isUniqueConstraintError(error)) {
                throw new common_1.ConflictException({
                    message: "An account with this email already exists.",
                    error: "EMAIL_ALREADY_REGISTERED",
                });
            }
            throw new common_1.InternalServerErrorException({
                message: "Unable to create account at this time.",
                error: "REGISTRATION_FAILED",
            });
        }
    }
    async login(dto) {
        const email = dto.email
            .trim()
            .toLowerCase();
        const user = await this.usersService.getByEmail(email);
        if (!user ||
            user.status !== "ACTIVE" ||
            !user.passwordHash) {
            throw new common_1.UnauthorizedException({
                message: "Invalid email or password.",
                error: "INVALID_CREDENTIALS",
            });
        }
        const valid = await this.passwordService.verify(user.passwordHash, dto.password);
        if (!valid) {
            throw new common_1.UnauthorizedException({
                message: "Invalid email or password.",
                error: "INVALID_CREDENTIALS",
            });
        }
        const session = await this.authSessionService.create(user.id);
        return {
            token: session.token,
            user: this.sanitizeAuthenticatedUser(user),
        };
    }
    async logout(token) {
        if (!token) {
            return;
        }
        await this.authSessionService.revoke(token);
    }
    sanitizeAuthenticatedUser(user) {
        return {
            id: user.id,
            email: user.email,
            status: user.status,
            role: user.role,
            createdAt: user.createdAt,
            profile: user.profile
                ? {
                    displayName: user.profile.displayName,
                    avatarUrl: user.profile.avatarUrl,
                    bio: user.profile.bio,
                    locale: user.profile.locale,
                    timezone: user.profile.timezone,
                }
                : null,
            preference: user.preference
                ? {
                    autoAtmosphereEnabled: user.preference
                        .autoAtmosphereEnabled,
                    atmosphereMode: user.preference
                        .atmosphereMode,
                    personalizationEnabled: user.preference
                        .personalizationEnabled,
                    pulseEnabled: user.preference.pulseEnabled,
                    memoryEnabled: user.preference.memoryEnabled,
                    discoveryLevel: user.preference.discoveryLevel,
                    aiAssistantEnabled: user.preference
                        .aiAssistantEnabled,
                    reducedMotion: user.preference.reducedMotion,
                    privateSessionDefault: user.preference
                        .privateSessionDefault,
                }
                : null,
        };
    }
    isUniqueConstraintError(error) {
        if (typeof error !== "object" ||
            error === null) {
            return false;
        }
        if (!("code" in error)) {
            return false;
        }
        return (error.code ===
            "P2002");
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        password_service_1.PasswordService,
        auth_session_service_1.AuthSessionService])
], AuthService);
//# sourceMappingURL=auth.service.js.map