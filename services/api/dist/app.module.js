"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const analytics_module_1 = require("./modules/analytics/analytics.module");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nestjs_pino_1 = require("nestjs-pino");
const node_path_1 = require("node:path");
const queue_module_1 = require("./modules/queue/queue.module");
const health_module_1 = require("./modules/health/health.module");
const env_validation_1 = require("./config/env.validation");
const users_module_1 = require("./modules/users/users.module");
const prisma_module_1 = require("./database/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const privacy_module_1 = require("./modules/privacy/privacy.module");
const library_module_1 = require("./modules/library/library.module");
const music_module_1 = require("./modules/music/music.module");
const preferences_module_1 = require("./modules/preferences/preferences.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                cache: true,
                envFilePath: [
                    (0, node_path_1.resolve)(__dirname, "../.env"),
                    (0, node_path_1.resolve)(process.cwd(), ".env"),
                ],
                validate: env_validation_1.validateEnvironment,
            }),
            nestjs_pino_1.LoggerModule.forRoot({
                pinoHttp: {
                    level: process.env.LOG_LEVEL ??
                        "info",
                },
            }),
            health_module_1.HealthModule,
            prisma_module_1.PrismaModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            preferences_module_1.PreferencesModule,
            privacy_module_1.PrivacyModule,
            library_module_1.LibraryModule,
            music_module_1.MusicModule,
            queue_module_1.QueueModule,
            analytics_module_1.AnalyticsModule,
            nestjs_pino_1.LoggerModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map