import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import type { Request } from "express";

import {
  AUTH_COOKIE_NAME,
} from "../auth.constants";
import {
  AuthSessionService,
} from "../auth-session.service";

type AuthenticatedRequest =
  Request & {
    user?: unknown;
    authSessionId?: string;
  };

@Injectable()
export class SessionGuard
  implements CanActivate
{
  constructor(
    private readonly authSessionService: AuthSessionService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request =
      context.switchToHttp().getRequest<AuthenticatedRequest>();

    const token =
      this.getCookie(request, AUTH_COOKIE_NAME);

    if (!token) {
      throw new UnauthorizedException({
        message:
          "Authentication required.",
        error:
          "AUTHENTICATION_REQUIRED",
      });
    }

    const session =
      await this.authSessionService.findValidSession(
        token,
      );

    if (!session) {
      throw new UnauthorizedException({
        message:
          "Session is invalid or expired.",
        error:
          "INVALID_SESSION",
      });
    }

    request.user = session.user;
    request.authSessionId = session.id;

    await this.authSessionService.touch(
      session.id,
    );

    return true;
  }

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