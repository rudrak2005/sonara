import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import type {
  Request,
  Response,
} from "express";

import {
  AUTH_COOKIE_NAME,
  AUTH_SESSION_TTL_MS,
} from "./auth.constants";

import { AuthService } from "./auth.service";
import { PasswordResetService } from "./password-reset.service";

import {
  LoginDto,
} from "./dto/login.dto";

import {
  RegisterDto,
} from "./dto/register.dto";

import {
  PasswordResetRequestDto,
} from "./dto/password-reset-request.dto";

import {
  PasswordResetConfirmDto,
} from "./dto/password-reset-confirm.dto";

import {
  SessionGuard,
} from "./guards/session.guard";

type AuthenticatedRequest = Request & {
  user?: any;
};

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly passwordResetService: PasswordResetService,
  ) {}

  // --------------------------------------------------
  // REGISTER
  // --------------------------------------------------

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() dto: RegisterDto,
  ) {
    const user =
      await this.authService.register(dto);

    return {
      success: true,
      data: user,
    };
  }

  // --------------------------------------------------
  // LOGIN
  // --------------------------------------------------

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true })
    response: Response,
  ) {
    const result =
      await this.authService.login(dto);

    const isProduction =
      process.env.NODE_ENV === "production";

    response.cookie(
      AUTH_COOKIE_NAME,
      result.token,
      {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge:
          AUTH_SESSION_TTL_MS,
      },
    );

    return {
      success: true,
      data: result.user,
    };
  }

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true })
    response: Response,
  ) {
    const token =
      this.getCookie(
        request,
        AUTH_COOKIE_NAME,
      );

    await this.authService.logout(token);

    const isProduction =
      process.env.NODE_ENV === "production";

    response.clearCookie(
      AUTH_COOKIE_NAME,
      {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
      },
    );

    return {
      success: true,
      data: {
        loggedOut: true,
      },
    };
  }

  // --------------------------------------------------
  // CURRENT USER
  // --------------------------------------------------

  @Get("me")
  @UseGuards(SessionGuard)
  getMe(
    @Req()
    request: AuthenticatedRequest,
  ) {
    return {
      success: true,
      data:
        this.authService.sanitizeAuthenticatedUser(
          request.user,
        ),
    };
  }

  // --------------------------------------------------
  // PASSWORD RESET REQUEST
  // --------------------------------------------------

  @Post("password-reset/request")
  @HttpCode(HttpStatus.OK)
  async requestPasswordReset(
    @Body() dto: PasswordResetRequestDto,
  ) {
    const result =
      await this.passwordResetService.requestReset(
        dto.email,
      );

    /*
     * Important:
     * The frontend receives the same response
     * whether the email exists or not.
     *
     * This prevents account enumeration.
     */

    return {
      success: true,
      data: {
        message:
          "If an account exists for that email, a reset link has been sent.",
      },
    };
  }

  // --------------------------------------------------
  // PASSWORD RESET CONFIRM
  // --------------------------------------------------

  @Post("password-reset/confirm")
  @HttpCode(HttpStatus.OK)
  async confirmPasswordReset(
    @Body() dto: PasswordResetConfirmDto,
  ) {
    try {
      await this.passwordResetService.resetPassword(
        dto.token,
        dto.password,
      );

      return {
        success: true,
        data: {
          message:
            "Password has been reset successfully.",
        },
      };
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "INVALID_RESET_TOKEN"
      ) {
        throw new BadRequestException({
          message:
            "This password reset link is invalid.",
          error: "INVALID_RESET_TOKEN",
        });
      }

      if (
        error instanceof Error &&
        error.message === "RESET_TOKEN_ALREADY_USED"
      ) {
        throw new BadRequestException({
          message:
            "This password reset link has already been used.",
          error: "RESET_TOKEN_ALREADY_USED",
        });
      }

      if (
        error instanceof Error &&
        error.message === "RESET_TOKEN_EXPIRED"
      ) {
        throw new BadRequestException({
          message:
            "This password reset link has expired.",
          error: "RESET_TOKEN_EXPIRED",
        });
      }

      throw error;
    }
  }

  // --------------------------------------------------
  // COOKIE HELPER
  // --------------------------------------------------

  private getCookie(
    request: Request,
    name: string,
  ) {
    const header =
      request.headers.cookie;

    if (!header) {
      return null;
    }

    const cookies = header
      .split(";")
      .map((part) => part.trim());

    const target =
      cookies.find((cookie) =>
        cookie.startsWith(`${name}=`),
      );

    if (!target) {
      return null;
    }

    return decodeURIComponent(
      target.slice(name.length + 1),
    );
  }
}