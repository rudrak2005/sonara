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
exports.ProviderService = void 0;
const common_1 = require("@nestjs/common");
const local_demo_provider_1 = require("./local-demo.provider");
const youtube_provider_1 = require("./youtube.provider");
let ProviderService = class ProviderService {
    constructor(localDemoProvider, youtubeProvider) {
        this.localDemoProvider = localDemoProvider;
        this.youtubeProvider = youtubeProvider;
        this.providers = new Map();
        this.providers.set(localDemoProvider.id, localDemoProvider);
        this.providers.set(youtubeProvider.id, youtubeProvider);
    }
    getProvider(providerId) {
        const provider = this.providers.get(providerId);
        if (!provider) {
            throw new common_1.BadRequestException(`Music provider "${providerId}" is not available.`);
        }
        return provider;
    }
    getDefaultProvider() {
        return this.youtubeProvider;
    }
    async getDefaultProviderStatus() {
        return this.youtubeProvider.status();
    }
};
exports.ProviderService = ProviderService;
exports.ProviderService = ProviderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [local_demo_provider_1.LocalDemoProvider,
        youtube_provider_1.YouTubeProvider])
], ProviderService);
//# sourceMappingURL=provider.service.js.map