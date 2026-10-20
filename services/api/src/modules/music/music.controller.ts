import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";

import { SessionGuard } from "../auth/guards/session.guard";

import { SearchMusicDto } from "./dto/search-music.dto";
import { MusicSearchService } from "./music-search.service";
import { ProviderService } from "./providers/provider.service";

@Controller("music")
@UseGuards(SessionGuard)
export class MusicController {
  constructor(
    private readonly providerService: ProviderService,
    private readonly musicSearchService: MusicSearchService,
  ) {}

  @Get("search")
  async search(
    @Query() dto: SearchMusicDto,
  ) {
    const result =
      await this.musicSearchService.search(
        dto.q,
        dto.limit ?? 20,
      );

    return {
      success: true,
      data: result,
    };
  }

  @Get("provider/status")
  async getProviderStatus() {
    const provider =
      this.providerService
        .getDefaultProvider();

    const status =
      await provider.status();

    return {
      success: true,
      data: {
        provider: provider.id,
        ...status,
      },
    };
  }

  /*
   * Get complete track metadata.
   *
   * This endpoint is used before a provider
   * track is added to the persistent queue.
   */
  @Get("tracks/:trackId")
  async getTrack(
    @Param("trackId") trackId: string,
  ) {
    const result =
      await this.musicSearchService.getTrack(
        trackId,
      );

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

  @Get("tracks/:trackId/playback")
  async getPlayback(
    @Param("trackId") trackId: string,
  ) {
    const provider =
      this.providerService
        .getDefaultProvider();

    const playback =
      await provider.getPlaybackInfo(
        trackId,
      );

    return {
      success: true,
      data: {
        provider:
          provider.id,

        providerTrackId:
          trackId,

        playback,
      },
    };
  }
}