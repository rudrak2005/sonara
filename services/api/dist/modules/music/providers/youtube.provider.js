"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YouTubeProvider = void 0;
const common_1 = require("@nestjs/common");
const provider_errors_1 = require("./provider.errors");
let YouTubeProvider = class YouTubeProvider {
    constructor() {
        this.id = "youtube";
        this.baseUrl = "https://www.googleapis.com/youtube/v3";
        this.apiKey = process.env.YOUTUBE_API_KEY ?? "";
    }
    buildUrl(path, params = {}) {
        if (!this.apiKey) {
            throw new provider_errors_1.MusicProviderError("YouTube API key is not configured.", "PROVIDER_UNAUTHORIZED");
        }
        const url = new URL(path.replace(/^\/+/, ""), `${this.baseUrl}/`);
        url.searchParams.set("key", this.apiKey);
        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined &&
                value !== null) {
                url.searchParams.set(key, String(value));
            }
        }
        return url;
    }
    async request(url) {
        let response;
        try {
            response = await fetch(url, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
                signal: AbortSignal.timeout(10000),
            });
        }
        catch {
            throw new provider_errors_1.MusicProviderError("YouTube API is unreachable.", "PROVIDER_UNAVAILABLE");
        }
        if (response.status === 429) {
            throw new provider_errors_1.MusicProviderError("YouTube API rate limit reached.", "PROVIDER_RATE_LIMITED");
        }
        if (response.status === 401 ||
            response.status === 403) {
            throw new provider_errors_1.MusicProviderError("YouTube API authorization failed.", "PROVIDER_UNAUTHORIZED");
        }
        if (!response.ok) {
            throw new provider_errors_1.MusicProviderError(`YouTube API returned ${response.status}.`, "PROVIDER_UNAVAILABLE");
        }
        try {
            return (await response.json());
        }
        catch {
            throw new provider_errors_1.MusicProviderError("YouTube API returned invalid JSON.", "PROVIDER_INVALID_RESPONSE");
        }
    }
    artwork(snippet) {
        return (snippet?.thumbnails?.high?.url ??
            snippet?.thumbnails?.medium?.url ??
            snippet?.thumbnails?.default?.url ??
            null);
    }
    parseDuration(isoDuration) {
        if (!isoDuration) {
            return 0;
        }
        const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (!match) {
            return 0;
        }
        const hours = Number(match[1] ?? 0);
        const minutes = Number(match[2] ?? 0);
        const seconds = Number(match[3] ?? 0);
        return ((hours * 3600 +
            minutes * 60 +
            seconds) * 1000);
    }
    mapSearchItem(item, durationMs = 0) {
        const videoId = item.id?.videoId;
        if (!videoId) {
            return null;
        }
        const snippet = item.snippet;
        const artist = {
            providerArtistId: snippet?.channelId ??
                `channel-${videoId}`,
            name: snippet?.channelTitle ??
                "Unknown channel",
            imageUrl: this.artwork(snippet),
            metadata: {
                source: "youtube-data-api",
            },
        };
        const album = null;
        return {
            providerTrackId: videoId,
            title: snippet?.title ??
                "Unknown title",
            artist,
            album,
            durationMs,
            releaseDate: snippet?.publishedAt ??
                null,
            genres: [],
            artworkUrl: this.artwork(snippet),
            playback: {
                type: "youtube-iframe",
                videoId,
            },
            metadata: {
                source: "youtube-data-api",
                channelId: snippet?.channelId ??
                    null,
                channelTitle: snippet?.channelTitle ??
                    null,
            },
        };
    }
    async search(query, limit = 20) {
        const normalized = query
            .trim()
            .replace(/\s+/g, " ");
        if (!normalized) {
            return {
                items: [],
                total: 0,
            };
        }
        const url = this.buildUrl("/search", {
            part: "snippet",
            q: normalized,
            type: "video",
            videoEmbeddable: "true",
            maxResults: Math.min(Math.max(limit, 1), 50),
            regionCode: "IN",
            relevanceLanguage: "en",
        });
        const response = await this.request(url);
        const searchItems = (response.items ?? [])
            .filter((item) => Boolean(item.id?.videoId));
        const videoIds = searchItems
            .map((item) => item.id?.videoId)
            .filter((id) => Boolean(id));
        const durationMap = new Map();
        if (videoIds.length > 0) {
            const detailsUrl = this.buildUrl("/videos", {
                part: "contentDetails",
                id: videoIds.join(","),
            });
            const detailsResponse = await this.request(detailsUrl);
            for (const video of detailsResponse.items ?? []) {
                durationMap.set(video.id, this.parseDuration(video.contentDetails
                    ?.duration));
            }
        }
        const items = searchItems
            .map((item) => this.mapSearchItem(item, durationMap.get(item.id?.videoId ?? "") ?? 0))
            .filter((item) => item !== null);
        return {
            items,
            total: response.pageInfo
                ?.totalResults ??
                items.length,
        };
    }
    async getTrack(providerTrackId) {
        const normalized = providerTrackId.trim();
        if (!normalized) {
            return null;
        }
        const url = this.buildUrl("/videos", {
            part: "snippet,contentDetails",
            id: normalized,
        });
        const response = await this.request(url);
        const item = response.items?.[0];
        if (!item) {
            return null;
        }
        const videoId = item.id;
        return {
            providerTrackId: videoId,
            title: item.snippet?.title ??
                "Unknown title",
            artist: {
                providerArtistId: item.snippet?.channelId ??
                    `channel-${videoId}`,
                name: item.snippet
                    ?.channelTitle ??
                    "Unknown channel",
                imageUrl: this.artwork(item.snippet),
                metadata: {
                    source: "youtube-data-api",
                },
            },
            album: null,
            durationMs: this.parseDuration(item.contentDetails
                ?.duration),
            releaseDate: item.snippet
                ?.publishedAt ??
                null,
            genres: [],
            artworkUrl: this.artwork(item.snippet),
            playback: {
                type: "youtube-iframe",
                videoId,
            },
            metadata: {
                source: "youtube-data-api",
                channelId: item.snippet
                    ?.channelId ??
                    null,
                channelTitle: item.snippet
                    ?.channelTitle ??
                    null,
            },
        };
    }
    async getPlaybackInfo(providerTrackId) {
        const track = await this.getTrack(providerTrackId);
        if (!track) {
            throw new provider_errors_1.MusicProviderError("YouTube video was not found.", "PROVIDER_UNAVAILABLE");
        }
        if (track.playback.type !==
            "youtube-iframe") {
            throw new provider_errors_1.MusicProviderError("YouTube playback is unavailable.", "TRACK_NOT_PLAYABLE");
        }
        return track.playback;
    }
    async status() {
        try {
            const url = this.buildUrl("/videos", {
                part: "snippet",
                chart: "mostPopular",
                regionCode: "IN",
                maxResults: 1,
            });
            await this.request(url);
            return {
                displayName: "YouTube",
                connected: true,
                mode: "iframe",
                implementation: "YouTube Data API + IFrame Player API",
            };
        }
        catch {
            return {
                displayName: "YouTube",
                connected: false,
                mode: "iframe",
                implementation: "YouTube Data API + IFrame Player API",
            };
        }
    }
};
exports.YouTubeProvider = YouTubeProvider;
exports.YouTubeProvider = YouTubeProvider = __decorate([
    (0, common_1.Injectable)()
], YouTubeProvider);
//# sourceMappingURL=youtube.provider.js.map