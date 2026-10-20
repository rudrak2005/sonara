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
exports.SessionGuard = void 0;
const common_1 = require("@nestjs/common");
const auth_constants_1 = require("../auth.constants");
const auth_session_service_1 = require("../auth-session.service");
let SessionGuard = class SessionGuard {
    constructor(authSessionService) {
        this.authSessionService = authSessionService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.getCookie(request, auth_constants_1.AUTH_COOKIE_NAME);
        if (!token) {
            throw new common_1.UnauthorizedException({
                message: "Authentication required.",
                error: "AUTHENTICATION_REQUIRED",
            });
        }
        const session = await this.authSessionService.findValidSession(token);
        if (!session) {
            throw new common_1.UnauthorizedException({
                message: "Session is invalid or expired.",
                error: "INVALID_SESSION",
            });
        }
        request.user = session.user;
        request.authSessionId = session.id;
        await this.authSessionService.touch(session.id);
        return true;
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
exports.SessionGuard = SessionGuard;
exports.SessionGuard = SessionGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_session_service_1.AuthSessionService])
], SessionGuard);
//# sourceMappingURL=session.guard.js.map