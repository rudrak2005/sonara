import { Module } from "@nestjs/common";

import { HealthController } from "./health.controller";
import { HealthService } from "./health.service";
import { HealthDatabaseService } from "./health.database.service";

@Module({
  controllers: [
    HealthController,
  ],
  providers: [
    HealthService,
    HealthDatabaseService,
  ],
})
export class HealthModule {}