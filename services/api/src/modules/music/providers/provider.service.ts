import {
  BadRequestException,
  Injectable,
} from "@nestjs/common";

import type {
  MusicProvider,
  MusicProviderId,
} from "./music-provider.interface";

import { LocalDemoProvider } from "./local-demo.provider";
import { YouTubeProvider } from "./youtube.provider";

@Injectable()
export class ProviderService {
  private readonly providers =
    new Map<
      MusicProviderId,
      MusicProvider
    >();

  constructor(
    private readonly localDemoProvider: LocalDemoProvider,

    private readonly youtubeProvider: YouTubeProvider,
  ) {
    this.providers.set(
      localDemoProvider.id,
      localDemoProvider,
    );

    this.providers.set(
      youtubeProvider.id,
      youtubeProvider,
    );
  }

  getProvider(
    providerId: MusicProviderId,
  ): MusicProvider {
    const provider =
      this.providers.get(
        providerId,
      );

    if (!provider) {
      throw new BadRequestException(
        `Music provider "${providerId}" is not available.`,
      );
    }

    return provider;
  }

  getDefaultProvider(): MusicProvider {
    return this.youtubeProvider;
  }

  async getDefaultProviderStatus() {
    return this.youtubeProvider.status();
  }
}