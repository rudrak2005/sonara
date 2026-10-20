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
exports.LibraryController = void 0;
const common_1 = require("@nestjs/common");
const session_guard_1 = require("../auth/guards/session.guard");
const library_service_1 = require("./library.service");
let LibraryController = class LibraryController {
    constructor(libraryService) {
        this.libraryService = libraryService;
    }
    getUserId(request) {
        const userId = request.user?.id;
        if (!userId) {
            throw new common_1.UnauthorizedException("Authenticated user not found.");
        }
        return userId;
    }
    getLibrary(request) {
        return this.libraryService.getLibrary(this.getUserId(request));
    }
    getTrackStatus(request, musicItemId) {
        return this.libraryService.getTrackStatus(this.getUserId(request), musicItemId);
    }
    saveTrack(request, musicItemId) {
        return this.libraryService.saveTrack(this.getUserId(request), musicItemId);
    }
    unsaveTrack(request, musicItemId) {
        return this.libraryService.unsaveTrack(this.getUserId(request), musicItemId);
    }
};
exports.LibraryController = LibraryController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LibraryController.prototype, "getLibrary", null);
__decorate([
    (0, common_1.Get)("tracks/:musicItemId"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("musicItemId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], LibraryController.prototype, "getTrackStatus", null);
__decorate([
    (0, common_1.Post)("tracks/:musicItemId"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("musicItemId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], LibraryController.prototype, "saveTrack", null);
__decorate([
    (0, common_1.Delete)("tracks/:musicItemId"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("musicItemId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], LibraryController.prototype, "unsaveTrack", null);
exports.LibraryController = LibraryController = __decorate([
    (0, common_1.Controller)("library"),
    (0, common_1.UseGuards)(session_guard_1.SessionGuard),
    __metadata("design:paramtypes", [library_service_1.LibraryService])
], LibraryController);
//# sourceMappingURL=library.controller.js.map