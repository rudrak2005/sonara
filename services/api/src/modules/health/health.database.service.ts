import { Injectable } from "@nestjs/common";

import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class HealthDatabaseService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async check() {
    await this.prisma.$queryRaw`SELECT 1`;

    return {
      database: "ok",
    };
  }
}