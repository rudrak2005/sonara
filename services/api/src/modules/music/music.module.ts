import { Module } from "@nestjs/common";

import { AuthModule } from "../auth/auth.module";

import { MusicController } from "./music.controller";
import { MusicSearchService } from "./music-search.service";

import { LocalDemoProvider } from "./providers/local-demo.provider";
import { ProviderService } from "./providers/provider.service";
import { YouTubeProvider } from "./providers/youtube.provider";

@Module({
  imports: [
    AuthModule,
  ],

  controllers: [
    MusicController,
  ],

  providers: [
    LocalDemoProvider,
    YouTubeProvider,
    ProviderService,
    MusicSearchService,
  ],

  exports: [
    ProviderService,
    MusicSearchService,
  ],
})
export class MusicModule {}