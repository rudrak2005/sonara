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
exports.MusicSearchService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_js_1 = require("../../database/prisma.service.js");
const provider_errors_1 = require("./providers/provider.errors");
const provider_service_1 = require("./providers/provider.service");
function toPrismaJson(value) {
    return JSON.parse(JSON.stringify(value));
}
let MusicSearchService = class MusicSearchService {
    constructor(providerService, prisma) {
        this.providerService = providerService;
        this.prisma = prisma;
        this.cache = new Map();
        this.ttlMs = 30_000;
        this.maxCacheEntries = 100;
    }
    async getTrack(providerTrackId, suppliedTrack) {
        const normalizedId = providerTrackId.trim();
        if (!normalizedId) {
            return null;
        }
        const provider = this.providerService
            .getDefaultProvider();
        const cached = await this.prisma.musicItem.findUnique({
            where: {
                provider_providerTrackId: {
                    provider: provider.id,
                    providerTrackId: normalizedId,
                },
            },
            include: {
                artist: true,
                album: true,
            },
        });
        if (cached) {
            return {
                musicItemId: cached.id,
                provider: provider.id,
                providerTrackId: cached.providerTrackId,
                title: cached.title,
                artist: cached.artist
                    ? {
                        providerArtistId: cached.artist
                            .providerArtistId,
                        name: cached.artist.name,
                        imageUrl: cached.artist.imageUrl,
                    }
                    : null,
                album: cached.album
                    ? {
                        providerAlbumId: cached.album
                            .providerAlbumId,
                        title: cached.album.title,
                        releaseDate: cached.album
                            .releaseDate
                            ?.toISOString() ??
                            null,
                        artworkUrl: cached.album
                            .artworkUrl,
                    }
                    : null,
                durationMs: cached.durationMs,
                releaseDate: cached.releaseDate
                    ?.toISOString() ??
                    null,
                genres: Array.isArray(cached.genreData)
                    ? cached.genreData
                    : [],
                artworkUrl: cached.artworkUrl,
                metadata: cached.metadataJson &&
                    typeof cached.metadataJson ===
                        "object"
                    ? cached.metadataJson
                    : {},
                playback: provider.id ===
                    "youtube"
                    ? {
                        type: "youtube-iframe",
                        videoId: cached.providerTrackId,
                    }
                    : {
                        type: "demo",
                    },
            };
        }
        const track = suppliedTrack ??
            await provider.getTrack(normalizedId);
        if (!track) {
            return null;
        }
        let artistId = null;
        if (track.artist) {
            const artist = await this.prisma.artist.upsert({
                where: {
                    provider_providerArtistId: {
                        provider: provider.id,
                        providerArtistId: track.artist
                            .providerArtistId,
                    },
                },
                create: {
                    provider: provider.id,
                    providerArtistId: track.artist
                        .providerArtistId,
                    name: track.artist.name,
                    imageUrl: track.artist.imageUrl,
                    metadataJson: toPrismaJson(track.artist.metadata),
                },
                update: {
                    name: track.artist.name,
                    imageUrl: track.artist.imageUrl,
                    metadataJson: toPrismaJson(track.artist.metadata),
                },
            });
            artistId =
                artist.id;
        }
        let albumId = null;
        if (track.album) {
            const album = await this.prisma.album.upsert({
                where: {
                    provider_providerAlbumId: {
                        provider: provider.id,
                        providerAlbumId: track.album
                            .providerAlbumId,
                    },
                },
                create: {
                    provider: provider.id,
                    providerAlbumId: track.album
                        .providerAlbumId,
                    artistId,
                    title: track.album.title,
                    releaseDate: track.album.releaseDate
                        ? new Date(track.album
                            .releaseDate)
                        : null,
                    artworkUrl: track.album.artworkUrl,
                    metadataJson: toPrismaJson(track.album.metadata),
                },
                update: {
                    artistId,
                    title: track.album.title,
                    releaseDate: track.album.releaseDate
                        ? new Date(track.album
                            .releaseDate)
                        : null,
                    artworkUrl: track.album.artworkUrl,
                    metadataJson: toPrismaJson(track.album.metadata),
                },
            });
            albumId =
                album.id;
        }
        const musicItem = await this.prisma.musicItem.upsert({
            where: {
                provider_providerTrackId: {
                    provider: provider.id,
                    providerTrackId: track.providerTrackId,
                },
            },
            create: {
                provider: provider.id,
                providerTrackId: track.providerTrackId,
                title: track.title,
                artistId,
                albumId,
                durationMs: track.durationMs,
                releaseDate: track.releaseDate
                    ? new Date(track.releaseDate)
                    : null,
                genreData: track.genres,
                artworkUrl: track.artworkUrl,
                metadataJson: toPrismaJson(track.metadata),
            },
            update: {
                title: track.title,
                artistId,
                albumId,
                durationMs: track.durationMs,
                releaseDate: track.releaseDate
                    ? new Date(track.releaseDate)
                    : null,
                genreData: track.genres,
                artworkUrl: track.artworkUrl,
                metadataJson: toPrismaJson(track.metadata),
            },
        });
        return {
            musicItemId: musicItem.id,
            provider: provider.id,
            providerTrackId: musicItem.providerTrackId,
            title: musicItem.title,
            artist: track.artist
                ? {
                    providerArtistId: track.artist
                        .providerArtistId,
                    name: track.artist.name,
                    imageUrl: track.artist.imageUrl,
                }
                : null,
            album: track.album
                ? {
                    providerAlbumId: track.album
                        .providerAlbumId,
                    title: track.album.title,
                    releaseDate: track.album
                        .releaseDate,
                    artworkUrl: track.album
                        .artworkUrl,
                }
                : null,
            durationMs: musicItem.durationMs,
            releaseDate: track.releaseDate,
            genres: track.genres,
            artworkUrl: musicItem.artworkUrl,
            metadata: track.metadata,
            playback: track.playback,
        };
    }
    async search(query, limit) {
        const normalizedQuery = query
            .trim()
            .replace(/\s+/g, " ")
            .toLowerCase();
        const cacheKey = `${normalizedQuery}:${limit}`;
        const cached = this.cache.get(cacheKey);
        if (cached &&
            cached.expiresAt > Date.now()) {
            return {
                ...cached.value,
                cached: true,
            };
        }
        this.cache.delete(cacheKey);
        const provider = this.providerService
            .getDefaultProvider();
        try {
            const result = await provider.search(normalizedQuery, limit);
            await Promise.all(result.items.map((track) => this.getTrack(track.providerTrackId, track)));
            const mappedItems = result.items.map((track) => ({
                providerTrackId: track.providerTrackId,
                title: track.title,
                artist: track.artist
                    ? {
                        providerArtistId: track.artist
                            .providerArtistId,
                        name: track.artist.name,
                        imageUrl: track.artist
                            .imageUrl,
                        metadata: track.artist
                            .metadata,
                    }
                    : null,
                album: track.album
                    ? {
                        providerAlbumId: track.album
                            .providerAlbumId,
                        title: track.album.title,
                        releaseDate: track.album
                            .releaseDate,
                        artworkUrl: track.album
                            .artworkUrl,
                        metadata: track.album
                            .metadata,
                    }
                    : null,
                durationMs: track.durationMs,
                releaseDate: track.releaseDate,
                genres: track.genres,
                artworkUrl: track.artworkUrl,
                metadata: track.metadata,
            }));
            const value = {
                provider: provider.id,
                items: mappedItems,
                total: result.total ??
                    mappedItems.length,
            };
            this.setCache(cacheKey, value);
            return {
                ...value,
                cached: false,
            };
        }
        catch (error) {
            if (error instanceof
                provider_errors_1.MusicProviderError) {
                if (error.code ===
                    "PROVIDER_RATE_LIMITED") {
                    throw new common_1.HttpException("Music provider rate limit reached.", common_1.HttpStatus.TOO_MANY_REQUESTS);
                }
                if (error.code ===
                    "PROVIDER_UNAUTHORIZED") {
                    throw new common_1.BadGatewayException("Music provider authorization is unavailable.");
                }
                throw new common_1.BadGatewayException("Music provider is temporarily unavailable.");
            }
            throw new common_1.BadGatewayException("Unable to search music right now.");
        }
    }
    setCache(key, value) {
        if (this.cache.size >=
            this.maxCacheEntries) {
            const oldestKey = this.cache
                .keys()
                .next()
                .value;
            if (oldestKey) {
                this.cache.delete(oldestKey);
            }
        }
        this.cache.set(key, {
            expiresAt: Date.now() +
                this.ttlMs,
            value,
        });
    }
};
exports.MusicSearchService = MusicSearchService;
exports.MusicSearchService = MusicSearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [provider_service_1.ProviderService,
        prisma_service_js_1.PrismaService])
], MusicSearchService);
//# sourceMappingURL=music-search.service.js.map