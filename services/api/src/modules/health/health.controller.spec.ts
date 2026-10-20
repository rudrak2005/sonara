import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";

import { HealthController } from "./health.controller";
import { HealthService } from "./health.service";
import { HealthDatabaseService } from "./health.database.service";

describe("HealthController", () => {
  let controller: HealthController;

  const checkMock = jest.fn();

  const healthDatabaseService =
    {
      check: checkMock,
    } as unknown as HealthDatabaseService;

  beforeEach(() => {
    jest.clearAllMocks();

    checkMock.mockReturnValue(
      Promise.resolve({
        database: "ok",
      }),
    );

    controller = new HealthController(
      new HealthService(),
      healthDatabaseService,
    );
  });

  it("returns healthy API status", () => {
    const result = controller.getHealth();

    expect(result.success).toBe(true);
    expect(result.data.status).toBe("ok");
    expect(result.data.service).toBe("sonora-api");
  });

  it("checks database health", async () => {
    const result = await controller.getDatabaseHealth();

    expect(checkMock).toHaveBeenCalledTimes(1);
    expect(result.success).toBe(true);
    expect(result.data.database).toBe("ok");
  });
});