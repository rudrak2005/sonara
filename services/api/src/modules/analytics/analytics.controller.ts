import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { SessionGuard } from "../auth/guards/session.guard.js";
import { AnalyticsService } from "./analytics.service.js";
import { TrackEventDto } from "./dto/track-event.dto.js";

type AuthenticatedRequest = Request & {
  user?: {
    id: string;
  };
};

@Controller("playback/events")
@UseGuards(SessionGuard)
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
  ) {}

  private getUserId(
    request: AuthenticatedRequest,
  ) {
    const userId = request.user?.id;

    if (!userId) {
      throw new UnauthorizedException(
        "Authenticated user not found.",
      );
    }

    return userId;
  }

  @Post()
  ingest(
    @Req() request: AuthenticatedRequest,
    @Body() dto: TrackEventDto,
  ) {
    return this.analyticsService.ingest(
      this.getUserId(request),
      dto,
    );
  }

  @Get("recent")
  recent(
    @Req() request: AuthenticatedRequest,
    @Query("limit") limit?: string,
  ) {
    const parsed = Number(limit ?? 25);

    return this.analyticsService.recent(
      this.getUserId(request),
      Number.isFinite(parsed)
        ? parsed
        : 25,
    );
  }
}
