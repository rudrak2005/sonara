import { Module } from "@nestjs/common";

import { UsersModule } from "../users/users.module";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthSessionService } from "./auth-session.service";
import { PasswordService } from "./password.service";
import { PasswordResetService } from "./password-reset.service";
import { PasswordResetEmailService } from "./password-reset-email.service";
import { SessionGuard } from "./guards/session.guard";

@Module({
  imports: [
    UsersModule,
  ],

  controllers: [
    AuthController,
  ],

  providers: [
    AuthService,
    PasswordService,
    AuthSessionService,
    PasswordResetService,
    PasswordResetEmailService,
    SessionGuard,
  ],

  exports: [
    AuthService,
    AuthSessionService,
    SessionGuard,
  ],
})
export class AuthModule {}