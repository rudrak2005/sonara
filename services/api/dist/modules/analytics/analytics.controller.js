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
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const session_guard_js_1 = require("../auth/guards/session.guard.js");
const analytics_service_js_1 = require("./analytics.service.js");
const track_event_dto_js_1 = require("./dto/track-event.dto.js");
let AnalyticsController = class AnalyticsController {
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    getUserId(request) {
        const userId = request.user?.id;
        if (!userId) {
            throw new common_1.UnauthorizedException("Authenticated user not found.");
        }
        return userId;
    }
    ingest(request, dto) {
        return this.analyticsService.ingest(this.getUserId(request), dto);
    }
    recent(request, limit) {
        const parsed = Number(limit ?? 25);
        return this.analyticsService.recent(this.getUserId(request), Number.isFinite(parsed)
            ? parsed
            : 25);
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, track_event_dto_js_1.TrackEventDto]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "ingest", null);
__decorate([
    (0, common_1.Get)("recent"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "recent", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, common_1.Controller)("playback/events"),
    (0, common_1.UseGuards)(session_guard_js_1.SessionGuard),
    __metadata("design:paramtypes", [analytics_service_js_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map