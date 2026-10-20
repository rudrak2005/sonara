import { Injectable } from "@nestjs/common";

import { MusicProviderError } from "./provider.errors";

import type {
  MusicProvider,
  ProviderAlbum,
  ProviderArtist,
  ProviderPlaybackInfo,
  ProviderSearchResult,
  ProviderStatus,
  ProviderTrack,
} from "./music-provider.interface";

type YouTubeSearchItem = {
  id?: {
    videoId?: string;
  };

  snippet?: {
    title?: string;
    channelId?: string;
    channelTitle?: string;
    publishedAt?: string;

    thumbnails?: {
      high?: {
        url?: string;
      };

      medium?: {
        url?: string;
      };

      default?: {
        url?: string;
      };
    };
  };
};

type YouTubeSearchResponse = {
  items?: YouTubeSearchItem[];

  pageInfo?: {
    totalResults?: number;
  };
};

type YouTubeVideoResponse = {
  items?: Array<{
    id: string;

    snippet?: {
      title?: string;
      channelId?: string;
      channelTitle?: string;
      publishedAt?: string;

      thumbnails?: {
        high?: {
          url?: string;
        };

        medium?: {
          url?: string;
        };

        default?: {
          url?: string;
        };
      };
    };

    contentDetails?: {
      duration?: string;
    };
  }>;
};

@Injectable()
export class YouTubeProvider implements MusicProvider {
  readonly id = "youtube" as const;

  private readonly baseUrl =
    "https://www.googleapis.com/youtube/v3";

  private readonly apiKey =
    process.env.YOUTUBE_API_KEY ?? "";

  private buildUrl(
    path: string,
    params: Record<
      string,
      string | number | undefined
    > = {},
  ) {
    if (!this.apiKey) {
      throw new MusicProviderError(
        "YouTube API key is not configured.",
        "PROVIDER_UNAUTHORIZED",
      );
    }

    const url = new URL(
      path.replace(/^\/+/, ""),
      `${this.baseUrl}/`,
    );

    url.searchParams.set(
      "key",
      this.apiKey,
    );

    for (
      const [key, value]
      of Object.entries(params)
    ) {
      if (
        value !== undefined &&
        value !== null
      ) {
        url.searchParams.set(
          key,
          String(value),
        );
      }
    }

    return url;
  }

  private async request<T>(
    url: URL,
  ): Promise<T> {
    let response: Response;

    try {
      response = await fetch(
        url,
        {
          method: "GET",
          headers: {
            Accept:
              "application/json",
          },
          signal:
            AbortSignal.timeout(
              10000,
            ),
        },
      );
    } catch {
      throw new MusicProviderError(
        "YouTube API is unreachable.",
        "PROVIDER_UNAVAILABLE",
      );
    }

    if (response.status === 429) {
      throw new MusicProviderError(
        "YouTube API rate limit reached.",
        "PROVIDER_RATE_LIMITED",
      );
    }

    if (
      response.status === 401 ||
      response.status === 403
    ) {
      throw new MusicProviderError(
        "YouTube API authorization failed.",
        "PROVIDER_UNAUTHORIZED",
      );
    }

    if (!response.ok) {
      throw new MusicProviderError(
        `YouTube API returned ${response.status}.`,
        "PROVIDER_UNAVAILABLE",
      );
    }

    try {
      return (await response.json()) as T;
    } catch {
      throw new MusicProviderError(
        "YouTube API returned invalid JSON.",
        "PROVIDER_INVALID_RESPONSE",
      );
    }
  }

  private artwork(
    snippet:
      | YouTubeSearchItem["snippet"]
      | NonNullable<
          YouTubeVideoResponse["items"]
        >[number]["snippet"],
  ): string | null {
    return (
      snippet?.thumbnails?.high?.url ??
      snippet?.thumbnails?.medium?.url ??
      snippet?.thumbnails?.default?.url ??
      null
    );
  }

  private parseDuration(
    isoDuration?: string,
  ): number {
    if (!isoDuration) {
      return 0;
    }

    const match =
      isoDuration.match(
        /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/,
      );

    if (!match) {
      return 0;
    }

    const hours =
      Number(match[1] ?? 0);

    const minutes =
      Number(match[2] ?? 0);

    const seconds =
      Number(match[3] ?? 0);

    return (
      (
        hours * 3600 +
        minutes * 60 +
        seconds
      ) * 1000
    );
  }

  private mapSearchItem(
    item: YouTubeSearchItem,
    durationMs = 0,
  ): ProviderTrack | null {
    const videoId =
      item.id?.videoId;

    if (!videoId) {
      return null;
    }

    const snippet =
      item.snippet;

    const artist: ProviderArtist = {
      providerArtistId:
        snippet?.channelId ??
        `channel-${videoId}`,

      name:
        snippet?.channelTitle ??
        "Unknown channel",

      imageUrl:
        this.artwork(snippet),

      metadata: {
        source:
          "youtube-data-api",
      },
    };

    const album: ProviderAlbum | null =
      null;

    return {
      providerTrackId:
        videoId,

      title:
        snippet?.title ??
        "Unknown title",

      artist,

      album,

      durationMs,

      releaseDate:
        snippet?.publishedAt ??
        null,

      genres: [],

      artworkUrl:
        this.artwork(snippet),

      playback: {
        type:
          "youtube-iframe",

        videoId,
      },

      metadata: {
        source:
          "youtube-data-api",

        channelId:
          snippet?.channelId ??
          null,

        channelTitle:
          snippet?.channelTitle ??
          null,
      },
    };
  }

  async search(
    query: string,
    limit = 20,
  ): Promise<ProviderSearchResult> {
    const normalized =
      query
        .trim()
        .replace(/\s+/g, " ");

    if (!normalized) {
      return {
        items: [],
        total: 0,
      };
    }

    const url =
      this.buildUrl(
        "/search",
        {
          part:
            "snippet",

          q:
            normalized,

          type:
            "video",

          videoEmbeddable:
            "true",

          maxResults:
            Math.min(
              Math.max(
                limit,
                1,
              ),
              50,
            ),

          regionCode:
            "IN",

          relevanceLanguage:
            "en",
        },
      );

    const response =
      await this.request<
        YouTubeSearchResponse
      >(url);

    const searchItems =
      (response.items ?? [])
        .filter(
          (item) =>
            Boolean(
              item.id?.videoId,
            ),
        );

    const videoIds =
      searchItems
        .map(
          (item) =>
            item.id?.videoId,
        )
        .filter(
          (
            id,
          ): id is string =>
            Boolean(id),
        );

    const durationMap =
      new Map<string, number>();

    /*
     * Search API gives us the video IDs,
     * but not contentDetails.duration.
     *
     * Fetch all durations in one batched
     * YouTube videos.list request.
     */
    if (videoIds.length > 0) {
      const detailsUrl =
        this.buildUrl(
          "/videos",
          {
            part:
              "contentDetails",

            id:
              videoIds.join(","),
          },
        );

      const detailsResponse =
        await this.request<
          YouTubeVideoResponse
        >(detailsUrl);

      for (
        const video
        of detailsResponse.items ?? []
      ) {
        durationMap.set(
          video.id,
          this.parseDuration(
            video.contentDetails
              ?.duration,
          ),
        );
      }
    }

    const items =
      searchItems
        .map(
          (item) =>
            this.mapSearchItem(
              item,
              durationMap.get(
                item.id?.videoId ?? "",
              ) ?? 0,
            ),
        )
        .filter(
          (
            item,
          ): item is ProviderTrack =>
            item !== null,
        );

    return {
      items,

      total:
        response.pageInfo
          ?.totalResults ??
        items.length,
    };
  }

  async getTrack(
    providerTrackId: string,
  ): Promise<ProviderTrack | null> {
    const normalized =
      providerTrackId.trim();

    if (!normalized) {
      return null;
    }

    const url =
      this.buildUrl(
        "/videos",
        {
          part:
            "snippet,contentDetails",

          id:
            normalized,
        },
      );

    const response =
      await this.request<
        YouTubeVideoResponse
      >(url);

    const item =
      response.items?.[0];

    if (!item) {
      return null;
    }

    const videoId =
      item.id;

    return {
      providerTrackId:
        videoId,

      title:
        item.snippet?.title ??
        "Unknown title",

      artist: {
        providerArtistId:
          item.snippet?.channelId ??
          `channel-${videoId}`,

        name:
          item.snippet
            ?.channelTitle ??
          "Unknown channel",

        imageUrl:
          this.artwork(
            item.snippet,
          ),

        metadata: {
          source:
            "youtube-data-api",
        },
      },

      album: null,

      durationMs:
        this.parseDuration(
          item.contentDetails
            ?.duration,
        ),

      releaseDate:
        item.snippet
          ?.publishedAt ??
        null,

      genres: [],

      artworkUrl:
        this.artwork(
          item.snippet,
        ),

      playback: {
        type:
          "youtube-iframe",

        videoId,
      },

      metadata: {
        source:
          "youtube-data-api",

        channelId:
          item.snippet
            ?.channelId ??
          null,

        channelTitle:
          item.snippet
            ?.channelTitle ??
          null,
      },
    };
  }

  async getPlaybackInfo(
    providerTrackId: string,
  ): Promise<ProviderPlaybackInfo> {
    const track =
      await this.getTrack(
        providerTrackId,
      );

    if (!track) {
      throw new MusicProviderError(
        "YouTube video was not found.",
        "PROVIDER_UNAVAILABLE",
      );
    }

    if (
      track.playback.type !==
      "youtube-iframe"
    ) {
      throw new MusicProviderError(
        "YouTube playback is unavailable.",
        "TRACK_NOT_PLAYABLE",
      );
    }

    return track.playback;
  }

  async status(): Promise<ProviderStatus> {
    try {
      const url =
        this.buildUrl(
          "/videos",
          {
            part:
              "snippet",

            chart:
              "mostPopular",

            regionCode:
              "IN",

            maxResults:
              1,
          },
        );

      await this.request<
        YouTubeVideoResponse
      >(url);

      return {
        displayName:
          "YouTube",

        connected: true,

        mode:
          "iframe",

        implementation:
          "YouTube Data API + IFrame Player API",
      };
    } catch {
      return {
        displayName:
          "YouTube",

        connected: false,

        mode:
          "iframe",

        implementation:
          "YouTube Data API + IFrame Player API",
      };
    }
  }
}