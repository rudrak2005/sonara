import {
  Injectable,
} from "@nestjs/common";

import type {
  MusicProvider,
  ProviderSearchResult,
  ProviderStatus,
  ProviderTrack,
} from "./music-provider.interface";

@Injectable()
export class LocalDemoProvider
  implements MusicProvider
{
  readonly id = "local-demo" as const;

  private readonly tracks: ProviderTrack[] = [
    {
      providerTrackId:
        "demo-midnight-circuit",

      title: "Midnight Circuit",

      artist: {
        providerArtistId:
          "demo-rhea-echo",

        name: "Rhea Echo",

        imageUrl: null,

        metadata: {},
      },

      album: {
        providerAlbumId:
          "demo-neon-hours",

        title: "Neon Hours",

        releaseDate:
          "2026-01-15",

        artworkUrl: null,

        metadata: {},
      },

      durationMs: 214000,

      releaseDate:
        "2026-01-15",

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
      providerTrackId:
        "demo-afterglow-drive",

      title: "Afterglow Drive",

      artist: {
        providerArtistId:
          "demo-nova-static",

        name: "Nova Static",

        imageUrl: null,

        metadata: {},
      },

      album: {
        providerAlbumId:
          "demo-night-drive",

        title: "Night Drive",

        releaseDate:
          "2026-02-03",

        artworkUrl: null,

        metadata: {},
      },

      durationMs: 198000,

      releaseDate:
        "2026-02-03",

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
      providerTrackId:
        "demo-warm-frequency",

      title: "Warm Frequency",

      artist: {
        providerArtistId:
          "demo-sonora-001",

        name: "SONORA Session",

        imageUrl: null,

        metadata: {},
      },

      album: {
        providerAlbumId:
          "demo-sonora-lab",

        title: "Frequency Lab",

        releaseDate:
          "2026-03-10",

        artworkUrl: null,

        metadata: {},
      },

      durationMs: 231000,

      releaseDate:
        "2026-03-10",

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

  async status(): Promise<ProviderStatus> {
    return {
      displayName: "SONORA Demo",
      connected: true,
      mode: "sandbox",
      implementation: "local-demo",
    };
  }

  async search(
    query: string,
    limit = 20,
  ): Promise<ProviderSearchResult> {
    const normalized =
      query
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();

    if (!normalized) {
      return {
        items: [],
        total: 0,
      };
    }

    const items =
      this.tracks
        .filter((track) => {
          const haystack = [
            track.title,
            track.artist?.name ?? "",
            track.album?.title ?? "",
            ...track.genres,
          ]
            .join(" ")
            .toLowerCase();

          return haystack.includes(
            normalized,
          );
        })
        .slice(0, limit);

    return {
      items,
      total: items.length,
    };
  }

  async getTrack(
    providerTrackId: string,
  ): Promise<ProviderTrack | null> {
    return (
      this.tracks.find(
        (track) =>
          track.providerTrackId ===
          providerTrackId,
      ) ?? null
    );
  }

  async getStreamUrl(
    providerTrackId: string,
  ): Promise<string> {
    throw new Error(
      `Demo track "${providerTrackId}" does not have a real stream.`,
    );
  }
  async getPlaybackInfo() {
  return {
    type: "demo" as const,
  };
}
}