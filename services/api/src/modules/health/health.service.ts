import { Injectable } from "@nestjs/common";

@Injectable()
export class HealthService {
  getHealth() {
    return {
      success: true,
      data: {
        status: "ok",
        service: "sonora-api",
        version: "0.1.0",
        environment:
          process.env.NODE_ENV ??
          "development",
        timestamp:
          new Date().toISOString(),
      },
    };
  }
}