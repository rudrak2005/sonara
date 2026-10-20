import { AnalyticsModule } from "./modules/analytics/analytics.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { LoggerModule } from "nestjs-pino";
import { resolve } from "node:path";
import { QueueModule } from "./modules/queue/queue.module";
import { HealthModule } from "./modules/health/health.module";
import { validateEnvironment } from "./config/env.validation";
import { UsersModule } from "./modules/users/users.module";
import { PrismaModule } from "./database/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { PrivacyModule } from "./modules/privacy/privacy.module";
import { LibraryModule } from "./modules/library/library.module";

import {
  MusicModule,
} from "./modules/music/music.module";
import {
  PreferencesModule,
} from "./modules/preferences/preferences.module";


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,

      envFilePath: [
        resolve(__dirname, "../.env"),
        resolve(process.cwd(), ".env"),
      ],

      validate:
        validateEnvironment,
    }),

    LoggerModule.forRoot({
      pinoHttp: {
        level:
          process.env.LOG_LEVEL ??
          "info",
      },
    }),

    HealthModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    PreferencesModule,
    PrivacyModule,
    LibraryModule,
    MusicModule,
    QueueModule,
    AnalyticsModule,
      LoggerModule,
  ],
})
export class AppModule {}