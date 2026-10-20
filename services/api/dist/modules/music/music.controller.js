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
exports.MusicController = void 0;
const common_1 = require("@nestjs/common");
const session_guard_1 = require("../auth/guards/session.guard");
const search_music_dto_1 = require("./dto/search-music.dto");
const music_search_service_1 = require("./music-search.service");
const provider_service_1 = require("./providers/provider.service");
let MusicController = class MusicController {
    constructor(providerService, musicSearchService) {
        this.providerService = providerService;
        this.musicSearchService = musicSearchService;
    }
    async search(dto) {
        const result = await this.musicSearchService.search(dto.q, dto.limit ?? 20);
        return {
            success: true,
            data: result,
        };
    }
    async getProviderStatus() {
        const provider = this.providerService
            .getDefaultProvider();
        const status = await provider.status();
        return {
            success: true,
            data: {
                provider: provider.id,
                ...status,
            },
        };
    }
    async getTrack(trackId) {
        const result = await this.musicSearchService.getTrack(trackId);
        if (!result) {
            return {
                success: false,
                error: {
                    code: "TRACK_NOT_FOUND",
                    message: "Track not found.",
                },
            };
        }
        return {
            success: true,
            data: result,
        };
    }
    async getPlayback(trackId) {
        const provider = this.providerService
            .getDefaultProvider();
        const playback = await provider.getPlaybackInfo(trackId);
        return {
            success: true,
            data: {
                provider: provider.id,
                providerTrackId: trackId,
                playback,
            },
        };
    }
};
exports.MusicController = MusicController;
__decorate([
    (0, common_1.Get)("search"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_music_dto_1.SearchMusicDto]),
    __metadata("design:returntype", Promise)
], MusicController.prototype, "search", null);
__decorate([
    (0, common_1.Get)("provider/status"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MusicController.prototype, "getProviderStatus", null);
__decorate([
    (0, common_1.Get)("tracks/:trackId"),
    __param(0, (0, common_1.Param)("trackId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MusicController.prototype, "getTrack", null);
__decorate([
    (0, common_1.Get)("tracks/:trackId/playback"),
    __param(0, (0, common_1.Param)("trackId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MusicController.prototype, "getPlayback", null);
exports.MusicController = MusicController = __decorate([
    (0, common_1.Controller)("music"),
    (0, common_1.UseGuards)(session_guard_1.SessionGuard),
    __metadata("design:paramtypes", [provider_service_1.ProviderService,
        music_search_service_1.MusicSearchService])
], MusicController);
//# sourceMappingURL=music.controller.js.map