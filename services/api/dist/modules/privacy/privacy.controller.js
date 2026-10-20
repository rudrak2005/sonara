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
exports.PrivacyController = void 0;
const common_1 = require("@nestjs/common");
const session_guard_1 = require("../auth/guards/session.guard");
const privacy_service_1 = require("./privacy.service");
const reset_history_dto_1 = require("./dto/reset-history.dto");
let PrivacyController = class PrivacyController {
    constructor(privacyService) {
        this.privacyService = privacyService;
    }
    async getStatus(request) {
        const data = await this.privacyService.getStatus(request.user.id);
        return {
            success: true,
            data,
        };
    }
    async resetHistory(request, dto) {
        if (!dto.confirm) {
            return {
                success: false,
                error: {
                    code: "RESET_CONFIRMATION_REQUIRED",
                    message: "Confirm history reset before continuing.",
                },
            };
        }
        const result = await this.privacyService.resetHistory(request.user.id);
        return {
            success: true,
            data: result,
        };
    }
};
exports.PrivacyController = PrivacyController;
__decorate([
    (0, common_1.Get)("status"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PrivacyController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Post)("history/reset"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, reset_history_dto_1.ResetHistoryDto]),
    __metadata("design:returntype", Promise)
], PrivacyController.prototype, "resetHistory", null);
exports.PrivacyController = PrivacyController = __decorate([
    (0, common_1.Controller)("privacy"),
    (0, common_1.UseGuards)(session_guard_1.SessionGuard),
    __metadata("design:paramtypes", [privacy_service_1.PrivacyService])
], PrivacyController);
//# sourceMappingURL=privacy.controller.js.map