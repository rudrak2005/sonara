import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";

import { UsersService } from "../users/users.service";
import {
  AuthSessionService,
} from "./auth-session.service";
import {
  PasswordService,
} from "./password.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

type SafeUser = {
  id: string;
  email: string;
  status: string;
  role: string;
  createdAt: Date;

  profile: {
    displayName: string;
    avatarUrl: string | null;
    bio: string | null;
    locale: string;
    timezone: string;
  } | null;

  preference: {
    autoAtmosphereEnabled: boolean;
    atmosphereMode: string;
    personalizationEnabled: boolean;
    pulseEnabled: boolean;
    memoryEnabled: boolean;
    discoveryLevel: string;
    aiAssistantEnabled: boolean;
    reducedMotion: boolean;
    privateSessionDefault: boolean;
  } | null;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly authSessionService: AuthSessionService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email
      .trim()
      .toLowerCase();

    const existingUser =
      await this.usersService.getByEmail(email);

    if (existingUser) {
      throw new ConflictException({
        message:
          "An account with this email already exists.",
        error:
          "EMAIL_ALREADY_REGISTERED",
      });
    }

    const passwordHash =
      await this.passwordService.hash(
        dto.password,
      );

    const displayName =
      dto.displayName?.trim() ||
      email.split("@")[0];

    const timezone =
      dto.timezone?.trim() || "UTC";

    try {
      return await this.usersService.createAccount({
        email,
        passwordHash,
        displayName,
        timezone,
      });
    } catch (error: unknown) {
      if (
        this.isUniqueConstraintError(error)
      ) {
        throw new ConflictException({
          message:
            "An account with this email already exists.",
          error:
            "EMAIL_ALREADY_REGISTERED",
        });
      }

      throw new InternalServerErrorException({
        message:
          "Unable to create account at this time.",
        error: "REGISTRATION_FAILED",
      });
    }
  }

  async login(dto: LoginDto) {
    const email = dto.email
      .trim()
      .toLowerCase();

    const user =
      await this.usersService.getByEmail(email);

    if (
      !user ||
      user.status !== "ACTIVE" ||
      !user.passwordHash
    ) {
      throw new UnauthorizedException({
        message:
          "Invalid email or password.",
        error: "INVALID_CREDENTIALS",
      });
    }

    const valid =
      await this.passwordService.verify(
        user.passwordHash,
        dto.password,
      );

    if (!valid) {
      throw new UnauthorizedException({
        message:
          "Invalid email or password.",
        error: "INVALID_CREDENTIALS",
      });
    }

    const session =
      await this.authSessionService.create(
        user.id,
      );

    return {
      token: session.token,
      user: this.sanitizeAuthenticatedUser(
        user,
      ),
    };
  }

  async logout(token: string | null) {
    if (!token) {
      return;
    }

    await this.authSessionService.revoke(
      token,
    );
  }

  sanitizeAuthenticatedUser(
    user: SafeUser,
  ) {
    return {
      id: user.id,
      email: user.email,
      status: user.status,
      role: user.role,
      createdAt: user.createdAt,

      profile: user.profile
        ? {
            displayName:
              user.profile.displayName,
            avatarUrl:
              user.profile.avatarUrl,
            bio:
              user.profile.bio,
            locale:
              user.profile.locale,
            timezone:
              user.profile.timezone,
          }
        : null,

      preference: user.preference
        ? {
            autoAtmosphereEnabled:
              user.preference
                .autoAtmosphereEnabled,
            atmosphereMode:
              user.preference
                .atmosphereMode,
            personalizationEnabled:
              user.preference
                .personalizationEnabled,
            pulseEnabled:
              user.preference.pulseEnabled,
            memoryEnabled:
              user.preference.memoryEnabled,
            discoveryLevel:
              user.preference.discoveryLevel,
            aiAssistantEnabled:
              user.preference
                .aiAssistantEnabled,
            reducedMotion:
              user.preference.reducedMotion,
            privateSessionDefault:
              user.preference
                .privateSessionDefault,
          }
        : null,
    };
  }

  private isUniqueConstraintError(
    error: unknown,
  ): boolean {
    if (
      typeof error !== "object" ||
      error === null
    ) {
      return false;
    }

    if (!("code" in error)) {
      return false;
    }

    return (
      (error as { code?: unknown }).code ===
      "P2002"
    );
  }
}