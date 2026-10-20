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
exports.PreferencesController = void 0;
const common_1 = require("@nestjs/common");
const preferences_service_1 = require("./preferences.service");
const update_preferences_dto_1 = require("./dto/update-preferences.dto");
const session_guard_1 = require("../auth/guards/session.guard");
let PreferencesController = class PreferencesController {
    constructor(preferencesService) {
        this.preferencesService = preferencesService;
    }
    async getMyPreferences(request) {
        const preferences = await this.preferencesService.getForUser(request.user.id);
        return {
            success: true,
            data: preferences,
        };
    }
    async updateMyPreferences(request, dto) {
        const preferences = await this.preferencesService.updateForUser(request.user.id, dto);
        return {
            success: true,
            data: preferences,
        };
    }
    async getOnboardingStatus(request) {
        const completed = await this.preferencesService
            .isOnboardingComplete(request.user.id);
        return {
            success: true,
            data: {
                completed,
            },
        };
    }
    async completeOnboarding(request, body) {
        const preferences = await this.preferencesService.completeOnboarding(request.user.id, {
            displayName: body.profile?.displayName,
            timezone: body.profile?.timezone,
            preferences: body.preferences,
        });
        return {
            success: true,
            data: {
                completed: true,
                preferences,
            },
        };
    }
};
exports.PreferencesController = PreferencesController;
__decorate([
    (0, common_1.Get)("me"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PreferencesController.prototype, "getMyPreferences", null);
__decorate([
    (0, common_1.Patch)("me"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_preferences_dto_1.UpdatePreferencesDto]),
    __metadata("design:returntype", Promise)
], PreferencesController.prototype, "updateMyPreferences", null);
__decorate([
    (0, common_1.Get)("onboarding-status"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PreferencesController.prototype, "getOnboardingStatus", null);
__decorate([
    (0, common_1.Post)("onboarding"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PreferencesController.prototype, "completeOnboarding", null);
exports.PreferencesController = PreferencesController = __decorate([
    (0, common_1.Controller)("preferences"),
    (0, common_1.UseGuards)(session_guard_1.SessionGuard),
    __metadata("design:paramtypes", [preferences_service_1.PreferencesService])
], PreferencesController);
//# sourceMappingURL=preferences.controller.js.map