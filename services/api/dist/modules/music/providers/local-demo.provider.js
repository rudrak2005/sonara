"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalDemoProvider = void 0;
const common_1 = require("@nestjs/common");
let LocalDemoProvider = class LocalDemoProvider {
    constructor() {
        this.id = "local-demo";
        this.tracks = [
            {
                providerTrackId: "demo-midnight-circuit",
                title: "Midnight Circuit",
                artist: {
                    providerArtistId: "demo-rhea-echo",
                    name: "Rhea Echo",
                    imageUrl: null,
                    metadata: {},
                },
                album: {
                    providerAlbumId: "demo-neon-hours",
                    title: "Neon Hours",
                    releaseDate: "2026-01-15",
                    artworkUrl: null,
                    metadata: {},
                },
                durationMs: 214000,
                releaseDate: "2026-01-15",
                genres: [
                    "electronic",
                    "synthwave",
                ],
                artworkUrl: null,
                playback: {
                    type: "demo",
                },
                metadata: {
                    demo: true,
                },
            },
            {
                providerTrackId: "demo-afterglow-drive",
                title: "Afterglow Drive",
                artist: {
                    providerArtistId: "demo-nova-static",
                    name: "Nova Static",
                    imageUrl: null,
                    metadata: {},
                },
                album: {
                    providerAlbumId: "demo-night-drive",
                    title: "Night Drive",
                    releaseDate: "2026-02-03",
                    artworkUrl: null,
                    metadata: {},
                },
                durationMs: 198000,
                releaseDate: "2026-02-03",
                genres: [
                    "synthwave",
                    "ambient",
                ],
                artworkUrl: null,
                playback: {
                    type: "demo",
                },
                metadata: {
                    demo: true,
                },
            },
            {
                providerTrackId: "demo-warm-frequency",
                title: "Warm Frequency",
                artist: {
                    providerArtistId: "demo-sonora-001",
                    name: "SONORA Session",
                    imageUrl: null,
                    metadata: {},
                },
                album: {
                    providerAlbumId: "demo-sonora-lab",
                    title: "Frequency Lab",
                    releaseDate: "2026-03-10",
                    artworkUrl: null,
                    metadata: {},
                },
                durationMs: 231000,
                releaseDate: "2026-03-10",
                genres: [
                    "chill",
                    "electronic",
                ],
                artworkUrl: null,
                playback: {
                    type: "demo",
                },
                metadata: {
                    demo: true,
                },
            },
        ];
    }
    async status() {
        return {
            displayName: "SONORA Demo",
            connected: true,
            mode: "sandbox",
            implementation: "local-demo",
        };
    }
    async search(query, limit = 20) {
        const normalized = query
            .trim()
            .replace(/\s+/g, " ")
            .toLowerCase();
        if (!normalized) {
            return {
                items: [],
                total: 0,
            };
        }
        const items = this.tracks
            .filter((track) => {
            const haystack = [
                track.title,
                track.artist?.name ?? "",
                track.album?.title ?? "",
                ...track.genres,
            ]
                .join(" ")
                .toLowerCase();
            return haystack.includes(normalized);
        })
            .slice(0, limit);
        return {
            items,
            total: items.length,
        };
    }
    async getTrack(providerTrackId) {
        return (this.tracks.find((track) => track.providerTrackId ===
            providerTrackId) ?? null);
    }
    async getStreamUrl(providerTrackId) {
        throw new Error(`Demo track "${providerTrackId}" does not have a real stream.`);
    }
    async getPlaybackInfo() {
        return {
            type: "demo",
        };
    }
};
exports.LocalDemoProvider = LocalDemoProvider;
exports.LocalDemoProvider = LocalDemoProvider = __decorate([
    (0, common_1.Injectable)()
], LocalDemoProvider);
//# sourceMappingURL=local-demo.provider.js.map