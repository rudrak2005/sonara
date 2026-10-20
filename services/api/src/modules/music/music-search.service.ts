import {
  BadGatewayException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";

import { PrismaService } from "../../database/prisma.service.js";

import {
  MusicProviderError,
} from "./providers/provider.errors";

import type {
  ProviderTrack,
} from "./providers/music-provider.interface";

import {
  ProviderService,
} from "./providers/provider.service";

function toPrismaJson(
  value: Record<string, unknown>,
) {
  return JSON.parse(
    JSON.stringify(value),
  );
}

type SearchTrack = {
  providerTrackId: string;
  title: string;

  artist: {
    providerArtistId: string;
    name: string;
    imageUrl: string | null;
    metadata: Record<string, unknown>;
  } | null;

  album: {
    providerAlbumId: string;
    title: string;
    releaseDate: string | null;
    artworkUrl: string | null;
    metadata: Record<string, unknown>;
  } | null;

  durationMs: number;
  releaseDate: string | null;
  genres: string[];
  artworkUrl: string | null;
  metadata: Record<string, unknown>;
};

type SearchCacheEntry = {
  expiresAt: number;

  value: {
    provider: string;
    items: SearchTrack[];
    total: number;
  };
};

@Injectable()
export class MusicSearchService {
  private readonly cache =
    new Map<
      string,
      SearchCacheEntry
    >();

  private readonly ttlMs = 30_000;

  private readonly maxCacheEntries = 100;

  constructor(
    private readonly providerService: ProviderService,
    private readonly prisma: PrismaService,
  ) {}

  async getTrack(
    providerTrackId: string,
    suppliedTrack?: ProviderTrack,
  ) {
    const normalizedId =
      providerTrackId.trim();

    if (!normalizedId) {
      return null;
    }

    const provider =
      this.providerService
        .getDefaultProvider();

    /*
     * First check durable metadata cache.
     */
    const cached =
      await this.prisma.musicItem.findUnique({
        where: {
          provider_providerTrackId: {
            provider:
              provider.id,

            providerTrackId:
              normalizedId,
          },
        },

        include: {
          artist: true,
          album: true,
        },
      });

    /*
     * If cached metadata exists,
     * return it directly.
     */
    if (cached) {
      return {
        musicItemId:
          cached.id,

        provider:
          provider.id,

        providerTrackId:
          cached.providerTrackId,

        title:
          cached.title,

        artist:
          cached.artist
            ? {
                providerArtistId:
                  cached.artist
                    .providerArtistId,

                name:
                  cached.artist.name,

                imageUrl:
                  cached.artist.imageUrl,
              }
            : null,

        album:
          cached.album
            ? {
                providerAlbumId:
                  cached.album
                    .providerAlbumId,

                title:
                  cached.album.title,

                releaseDate:
                  cached.album
                    .releaseDate
                    ?.toISOString() ??
                  null,

                artworkUrl:
                  cached.album
                    .artworkUrl,
              }
            : null,

        durationMs:
          cached.durationMs,

        releaseDate:
          cached.releaseDate
            ?.toISOString() ??
          null,

        genres:
          Array.isArray(
            cached.genreData,
          )
            ? (cached.genreData as string[])
            : [],

        artworkUrl:
          cached.artworkUrl,

        metadata:
          cached.metadataJson &&
          typeof cached.metadataJson ===
            "object"
            ? (cached.metadataJson as Record<
                string,
                unknown
              >)
            : {},

        playback:
          provider.id ===
          "youtube"
            ? {
                type:
                  "youtube-iframe",

                videoId:
                  cached.providerTrackId,
              }
            : {
                type: "demo",
              },
      };
    }

    /*
     * Cache miss:
     *
     * - When called from search(), use the
     *   already available ProviderTrack.
     * - Otherwise fetch directly from provider.
     */
    const track =
      suppliedTrack ??
      await provider.getTrack(
        normalizedId,
      );

    if (!track) {
      return null;
    }

    /*
     * Upsert artist.
     */
    let artistId:
      | string
      | null = null;

    if (track.artist) {
      const artist =
        await this.prisma.artist.upsert({
          where: {
            provider_providerArtistId: {
              provider:
                provider.id,

              providerArtistId:
                track.artist
                  .providerArtistId,
            },
          },

          create: {
            provider:
              provider.id,

            providerArtistId:
              track.artist
                .providerArtistId,

            name:
              track.artist.name,

            imageUrl:
              track.artist.imageUrl,

            metadataJson:
              toPrismaJson(
                track.artist.metadata,
              ),
          },

          update: {
            name:
              track.artist.name,

            imageUrl:
              track.artist.imageUrl,

            metadataJson:
              toPrismaJson(
                track.artist.metadata,
              ),
          },
        });

      artistId =
        artist.id;
    }

    /*
     * Upsert album when provider gives one.
     */
    let albumId:
      | string
      | null = null;

    if (track.album) {
      const album =
        await this.prisma.album.upsert({
          where: {
            provider_providerAlbumId: {
              provider:
                provider.id,

              providerAlbumId:
                track.album
                  .providerAlbumId,
            },
          },

          create: {
            provider:
              provider.id,

            providerAlbumId:
              track.album
                .providerAlbumId,

            artistId,

            title:
              track.album.title,

            releaseDate:
              track.album.releaseDate
                ? new Date(
                    track.album
                      .releaseDate,
                  )
                : null,

            artworkUrl:
              track.album.artworkUrl,

            metadataJson:
              toPrismaJson(
                track.album.metadata,
              ),
          },

          update: {
            artistId,

            title:
              track.album.title,

            releaseDate:
              track.album.releaseDate
                ? new Date(
                    track.album
                      .releaseDate,
                  )
                : null,

            artworkUrl:
              track.album.artworkUrl,

            metadataJson:
              toPrismaJson(
                track.album.metadata,
              ),
          },
        });

      albumId =
        album.id;
    }

    /*
     * Persist track metadata.
     */
    const musicItem =
      await this.prisma.musicItem.upsert({
        where: {
          provider_providerTrackId: {
            provider:
              provider.id,

            providerTrackId:
              track.providerTrackId,
          },
        },

        create: {
          provider:
            provider.id,

          providerTrackId:
            track.providerTrackId,

          title:
            track.title,

          artistId,

          albumId,

          durationMs:
            track.durationMs,

          releaseDate:
            track.releaseDate
              ? new Date(
                  track.releaseDate,
                )
              : null,

          genreData:
            track.genres,

          artworkUrl:
            track.artworkUrl,

          metadataJson:
            toPrismaJson(
              track.metadata,
            ),
        },

        update: {
          title:
            track.title,

          artistId,

          albumId,

          durationMs:
            track.durationMs,

          releaseDate:
            track.releaseDate
              ? new Date(
                  track.releaseDate,
                )
              : null,

          genreData:
            track.genres,

          artworkUrl:
            track.artworkUrl,

          metadataJson:
            toPrismaJson(
              track.metadata,
            ),
        },
      });

    /*
     * Return the durable database ID.
     *
     * Frontend uses musicItemId to create
     * the user's persistent queue item.
     */
    return {
      musicItemId:
        musicItem.id,

      provider:
        provider.id,

      providerTrackId:
        musicItem.providerTrackId,

      title:
        musicItem.title,

      artist:
        track.artist
          ? {
              providerArtistId:
                track.artist
                  .providerArtistId,

              name:
                track.artist.name,

              imageUrl:
                track.artist.imageUrl,
            }
          : null,

      album:
        track.album
          ? {
              providerAlbumId:
                track.album
                  .providerAlbumId,

              title:
                track.album.title,

              releaseDate:
                track.album
                  .releaseDate,

              artworkUrl:
                track.album
                  .artworkUrl,
            }
          : null,

      durationMs:
        musicItem.durationMs,

      releaseDate:
        track.releaseDate,

      genres:
        track.genres,

      artworkUrl:
        musicItem.artworkUrl,

      metadata:
        track.metadata,

      playback:
        track.playback,
    };
  }

  async search(
    query: string,
    limit: number,
  ) {
    const normalizedQuery =
      query
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();

    const cacheKey =
      `${normalizedQuery}:${limit}`;

    const cached =
      this.cache.get(
        cacheKey,
      );

    if (
      cached &&
      cached.expiresAt > Date.now()
    ) {
      return {
        ...cached.value,
        cached: true,
      };
    }

    this.cache.delete(
      cacheKey,
    );

    const provider =
      this.providerService
        .getDefaultProvider();

    try {
      const result =
        await provider.search(
          normalizedQuery,
          limit,
        );

      /*
       * Persist every fresh search result using
       * the ProviderTrack already returned by
       * the search provider.
       *
       * This avoids doing another YouTube
       * /videos request just to create the
       * MusicItem.
       */
      await Promise.all(
        result.items.map(
          (track) =>
            this.getTrack(
              track.providerTrackId,
              track,
            ),
        ),
      );

      const mappedItems =
        result.items.map(
          (track) => ({
            providerTrackId:
              track.providerTrackId,

            title:
              track.title,

            artist:
              track.artist
                ? {
                    providerArtistId:
                      track.artist
                        .providerArtistId,

                    name:
                      track.artist.name,

                    imageUrl:
                      track.artist
                        .imageUrl,

                    metadata:
                      track.artist
                        .metadata,
                  }
                : null,

            album:
              track.album
                ? {
                    providerAlbumId:
                      track.album
                        .providerAlbumId,

                    title:
                      track.album.title,

                    releaseDate:
                      track.album
                        .releaseDate,

                    artworkUrl:
                      track.album
                        .artworkUrl,

                    metadata:
                      track.album
                        .metadata,
                  }
                : null,

            durationMs:
              track.durationMs,

            releaseDate:
              track.releaseDate,

            genres:
              track.genres,

            artworkUrl:
              track.artworkUrl,

            metadata:
              track.metadata,
          }),
        );

      const value = {
        provider:
          provider.id,

        items:
          mappedItems,

        total:
          result.total ??
          mappedItems.length,
      };

      this.setCache(
        cacheKey,
        value,
      );

      return {
        ...value,
        cached: false,
      };
    } catch (error) {
      if (
        error instanceof
        MusicProviderError
      ) {
        if (
          error.code ===
          "PROVIDER_RATE_LIMITED"
        ) {
          throw new HttpException(
            "Music provider rate limit reached.",
            HttpStatus.TOO_MANY_REQUESTS,
          );
        }

        if (
          error.code ===
          "PROVIDER_UNAUTHORIZED"
        ) {
          throw new BadGatewayException(
            "Music provider authorization is unavailable.",
          );
        }

        throw new BadGatewayException(
          "Music provider is temporarily unavailable.",
        );
      }

      throw new BadGatewayException(
        "Unable to search music right now.",
      );
    }
  }

  private setCache(
    key: string,
    value: SearchCacheEntry["value"],
  ) {
    if (
      this.cache.size >=
      this.maxCacheEntries
    ) {
      const oldestKey =
        this.cache
          .keys()
          .next()
          .value;

      if (oldestKey) {
        this.cache.delete(
          oldestKey,
        );
      }
    }

    this.cache.set(
      key,
      {
        expiresAt:
          Date.now() +
          this.ttlMs,

        value,
      },
    );
  }
}