import {
  Controller,
  Get,
} from "@nestjs/common";

import { HealthService } from "./health.service";
import { HealthDatabaseService } from "./health.database.service";

@Controller("health")
export class HealthController {
  constructor(
    private readonly healthService: HealthService,
    private readonly healthDatabaseService: HealthDatabaseService,
  ) {}

  @Get()
  getHealth() {
    return this.healthService.getHealth();
  }

  @Get("db")
  async getDatabaseHealth() {
    const database =
      await this.healthDatabaseService.check();

    return {
      success: true,
      data: database,
    };
  }
}