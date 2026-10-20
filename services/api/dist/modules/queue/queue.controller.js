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
exports.QueueController = void 0;
const common_1 = require("@nestjs/common");
const session_guard_1 = require("../auth/guards/session.guard");
const add_queue_item_dto_1 = require("./dto/add-queue-item.dto");
const reorder_queue_dto_1 = require("./dto/reorder-queue.dto");
const queue_service_1 = require("./queue.service");
let QueueController = class QueueController {
    constructor(queueService) {
        this.queueService = queueService;
    }
    getUserId(request) {
        const userId = request.user?.id;
        if (!userId) {
            throw new common_1.UnauthorizedException("Authenticated user not found.");
        }
        return userId;
    }
    getQueue(request) {
        return this.queueService.getQueue(this.getUserId(request));
    }
    add(request, dto) {
        return this.queueService.add(this.getUserId(request), dto);
    }
    reorder(request, id, dto) {
        return this.queueService.reorder(this.getUserId(request), id, dto);
    }
    remove(request, id) {
        return this.queueService.remove(this.getUserId(request), id);
    }
    clear(request) {
        return this.queueService.clear(this.getUserId(request));
    }
};
exports.QueueController = QueueController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], QueueController.prototype, "getQueue", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, add_queue_item_dto_1.AddQueueItemDto]),
    __metadata("design:returntype", void 0)
], QueueController.prototype, "add", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, reorder_queue_dto_1.ReorderQueueDto]),
    __metadata("design:returntype", void 0)
], QueueController.prototype, "reorder", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], QueueController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], QueueController.prototype, "clear", null);
exports.QueueController = QueueController = __decorate([
    (0, common_1.Controller)("queue"),
    (0, common_1.UseGuards)(session_guard_1.SessionGuard),
    __metadata("design:paramtypes", [queue_service_1.QueueService])
], QueueController);
//# sourceMappingURL=queue.controller.js.map