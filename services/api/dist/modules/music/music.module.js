"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const music_controller_1 = require("./music.controller");
const music_search_service_1 = require("./music-search.service");
const local_demo_provider_1 = require("./providers/local-demo.provider");
const provider_service_1 = require("./providers/provider.service");
const youtube_provider_1 = require("./providers/youtube.provider");
let MusicModule = class MusicModule {
};
exports.MusicModule = MusicModule;
exports.MusicModule = MusicModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
        ],
        controllers: [
            music_controller_1.MusicController,
        ],
        providers: [
            local_demo_provider_1.LocalDemoProvider,
            youtube_provider_1.YouTubeProvider,
            provider_service_1.ProviderService,
            music_search_service_1.MusicSearchService,
        ],
        exports: [
            provider_service_1.ProviderService,
            music_search_service_1.MusicSearchService,
        ],
    })
], MusicModule);
//# sourceMappingURL=music.module.js.map