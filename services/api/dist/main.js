"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const nestjs_pino_1 = require("nestjs-pino");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const swagger_1 = require("@nestjs/swagger");
const request_id_interceptor_1 = require("./common/interceptors/request-id.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bufferLogs: true,
    });
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle("SONORA API")
        .setDescription("SONORA — The AI Retro Music Machine API")
        .setVersion("0.1.0")
        .addTag("auth")
        .addTag("preferences")
        .addTag("privacy")
        .addTag("health")
        .build();
    const swaggerDocument = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup("api/docs", app, swaggerDocument);
    app.useLogger(app.get(nestjs_pino_1.Logger));
    app.setGlobalPrefix("api/v1");
    app.enableCors({
        origin: process.env.WEB_ORIGIN ??
            "http://localhost:3000",
        credentials: true,
    });
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new request_id_interceptor_1.RequestIdInterceptor());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const port = Number(process.env.PORT ?? 5000);
    await app.listen(port);
    app.get(nestjs_pino_1.Logger).log(`SONORA API running on http://localhost:${port}`, "Bootstrap");
}
void bootstrap();
//# sourceMappingURL=main.js.map