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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_constants_1 = require("./auth.constants");
const auth_service_1 = require("./auth.service");
const password_reset_service_1 = require("./password-reset.service");
const login_dto_1 = require("./dto/login.dto");
const register_dto_1 = require("./dto/register.dto");
const password_reset_request_dto_1 = require("./dto/password-reset-request.dto");
const password_reset_confirm_dto_1 = require("./dto/password-reset-confirm.dto");
const session_guard_1 = require("./guards/session.guard");
let AuthController = class AuthController {
    constructor(authService, passwordResetService) {
        this.authService = authService;
        this.passwordResetService = passwordResetService;
    }
    async register(dto) {
        const user = await this.authService.register(dto);
        return {
            success: true,
            data: user,
        };
    }
    async login(dto, response) {
        const result = await this.authService.login(dto);
        const isProduction = process.env.NODE_ENV === "production";
        response.cookie(auth_constants_1.AUTH_COOKIE_NAME, result.token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            path: "/",
            maxAge: auth_constants_1.AUTH_SESSION_TTL_MS,
        });
        return {
            success: true,
            data: result.user,
        };
    }
    async logout(request, response) {
        const token = this.getCookie(request, auth_constants_1.AUTH_COOKIE_NAME);
        await this.authService.logout(token);
        const isProduction = process.env.NODE_ENV === "production";
        response.clearCookie(auth_constants_1.AUTH_COOKIE_NAME, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            path: "/",
        });
        return {
            success: true,
            data: {
                loggedOut: true,
            },
        };
    }
    getMe(request) {
        return {
            success: true,
            data: this.authService.sanitizeAuthenticatedUser(request.user),
        };
    }
    async requestPasswordReset(dto) {
        const result = await this.passwordResetService.requestReset(dto.email);
        return {
            success: true,
            data: {
                message: "If an account exists for that email, a reset link has been sent.",
            },
        };
    }
    async confirmPasswordReset(dto) {
        try {
            await this.passwordResetService.resetPassword(dto.token, dto.password);
            return {
                success: true,
                data: {
                    message: "Password has been reset successfully.",
                },
            };
        }
        catch (error) {
            if (error instanceof Error &&
                error.message === "INVALID_RESET_TOKEN") {
                throw new common_1.BadRequestException({
                    message: "This password reset link is invalid.",
                    error: "INVALID_RESET_TOKEN",
                });
            }
            if (error instanceof Error &&
                error.message === "RESET_TOKEN_ALREADY_USED") {
                throw new common_1.BadRequestException({
                    message: "This password reset link has already been used.",
                    error: "RESET_TOKEN_ALREADY_USED",
                });
            }
            if (error instanceof Error &&
                error.message === "RESET_TOKEN_EXPIRED") {
                throw new common_1.BadRequestException({
                    message: "This password reset link has expired.",
                    error: "RESET_TOKEN_EXPIRED",
                });
            }
            throw error;
        }
    }
    getCookie(request, name) {
        const header = request.headers.cookie;
        if (!header) {
            return null;
        }
        const cookies = header
            .split(";")
            .map((part) => part.trim());
        const target = cookies.find((cookie) => cookie.startsWith(`${name}=`));
        if (!target) {
            return null;
        }
        return decodeURIComponent(target.slice(name.length + 1));
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)("register"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)("login"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)("logout"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)("me"),
    (0, common_1.UseGuards)(session_guard_1.SessionGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getMe", null);
__decorate([
    (0, common_1.Post)("password-reset/request"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [password_reset_request_dto_1.PasswordResetRequestDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "requestPasswordReset", null);
__decorate([
    (0, common_1.Post)("password-reset/confirm"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [password_reset_confirm_dto_1.PasswordResetConfirmDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "confirmPasswordReset", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        password_reset_service_1.PasswordResetService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map