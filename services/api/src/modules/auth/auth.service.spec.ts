import { ConflictException } from "@nestjs/common";
import {
  describe,
  expect,
  it,
  beforeEach,
} from "@jest/globals";

import { AuthService } from "./auth.service";

describe("AuthService", () => {
  let authService: AuthService;

  const usersService = {
    getByEmail: jest.fn(),
    createAccount: jest.fn(),
  };

  const passwordService = {
    hash: jest.fn(),
  };

beforeEach(() => {
  jest.clearAllMocks();

  const authSessionService = {
    create: jest.fn(),
    revoke: jest.fn(),
  };

  authService = new AuthService(
    usersService as never,
    passwordService as never,
    authSessionService as never,
  );
});

  it("creates a new account", async () => {
    usersService.getByEmail.mockResolvedValue(
      null,
    );

    passwordService.hash.mockResolvedValue(
      "$argon2id$test-hash",
    );

    usersService.createAccount.mockResolvedValue(
      {
        id: "user-id",
        email: "test@sonora.dev",
      },
    );

    const result =
      await authService.register({
        email: "TEST@SONORA.DEV",
        password: "TestPassword123",
      });

    expect(
      usersService.getByEmail,
    ).toHaveBeenCalledWith(
      "test@sonora.dev",
    );

    expect(
      passwordService.hash,
    ).toHaveBeenCalledWith(
      "TestPassword123",
    );

    expect(
      usersService.createAccount,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "test@sonora.dev",
        passwordHash:
          "$argon2id$test-hash",
      }),
    );

    expect(result.email).toBe(
      "test@sonora.dev",
    );
  });

  it("rejects duplicate email", async () => {
    usersService.getByEmail.mockResolvedValue(
      {
        id: "existing-user",
        email: "test@sonora.dev",
      },
    );

    await expect(
      authService.register({
        email: "test@sonora.dev",
        password: "TestPassword123",
      }),
    ).rejects.toBeInstanceOf(
      ConflictException,
    );

    expect(
      passwordService.hash,
    ).not.toHaveBeenCalled();

    expect(
      usersService.createAccount,
    ).not.toHaveBeenCalled();
  });
});