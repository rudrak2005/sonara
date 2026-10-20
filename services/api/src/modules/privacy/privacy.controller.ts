import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";

import type { Request } from "express";

import { SessionGuard } from "../auth/guards/session.guard";
import { PrivacyService } from "./privacy.service";
import { ResetHistoryDto } from "./dto/reset-history.dto";

type AuthenticatedRequest = Request & {
  user?: {
    id: string;
  };
};

@Controller("privacy")
@UseGuards(SessionGuard)
export class PrivacyController {
  constructor(
    private readonly privacyService: PrivacyService,
  ) {}

  @Get("status")
  async getStatus(
    @Req() request: AuthenticatedRequest,
  ) {
    const data =
      await this.privacyService.getStatus(
        request.user!.id,
      );

    return {
      success: true,
      data,
    };
  }

  @Post("history/reset")
  @HttpCode(HttpStatus.OK)
  async resetHistory(
    @Req() request: AuthenticatedRequest,
    @Body() dto: ResetHistoryDto,
  ) {
    if (!dto.confirm) {
      return {
        success: false,
        error: {
          code: "RESET_CONFIRMATION_REQUIRED",
          message:
            "Confirm history reset before continuing.",
        },
      };
    }

    const result =
      await this.privacyService.resetHistory(
        request.user!.id,
      );

    return {
      success: true,
      data: result,
    };
  }
}