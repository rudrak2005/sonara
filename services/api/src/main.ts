import {
  ValidationPipe,
} from "@nestjs/common";

import {
  NestFactory,
} from "@nestjs/core";

import {
  Logger,
} from "nestjs-pino";

import { AppModule } from "./app.module";

import {
  HttpExceptionFilter,
} from "./common/filters/http-exception.filter";
import {
  DocumentBuilder,
  SwaggerModule,
} from "@nestjs/swagger";



import {
  RequestIdInterceptor,
} from "./common/interceptors/request-id.interceptor";

async function bootstrap() {
  const app =
    await NestFactory.create(
      AppModule,
      {
        bufferLogs: true,
      },
    );
    const swaggerConfig =
  new DocumentBuilder()
    .setTitle("SONORA API")
    .setDescription(
      "SONORA — The AI Retro Music Machine API",
    )
    .setVersion("0.1.0")
    .addTag("auth")
    .addTag("preferences")
    .addTag("privacy")
    .addTag("health")
    .build();

const swaggerDocument =
  SwaggerModule.createDocument(
    app,
    swaggerConfig,
  );

SwaggerModule.setup(
  "api/docs",
  app,
  swaggerDocument,
);

  app.useLogger(
    app.get(Logger),
  );

  app.setGlobalPrefix(
    "api/v1",
  );

  app.enableCors({
    origin:
      process.env.WEB_ORIGIN ??
      "http://localhost:3000",
    credentials: true,
  });

  app.useGlobalFilters(
    new HttpExceptionFilter(),
  );

  app.useGlobalInterceptors(
    new RequestIdInterceptor(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = Number(
    process.env.PORT ?? 5000,
  );

  await app.listen(port);

  app.get(Logger).log(
    `SONORA API running on http://localhost:${port}`,
    "Bootstrap",
  );
}

void bootstrap();

