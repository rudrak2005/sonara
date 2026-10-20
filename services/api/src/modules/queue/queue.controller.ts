import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";

import { SessionGuard } from "../auth/guards/session.guard";

import { AddQueueItemDto } from "./dto/add-queue-item.dto";
import { ReorderQueueDto } from "./dto/reorder-queue.dto";
import { QueueService } from "./queue.service";

type AuthenticatedRequest = Request & {
  user?: {
    id: string;
  };
};

@Controller("queue")
@UseGuards(SessionGuard)
export class QueueController {
  constructor(
    private readonly queueService: QueueService,
  ) {}

  private getUserId(
    request: AuthenticatedRequest,
  ): string {
    const userId = request.user?.id;

    if (!userId) {
      throw new UnauthorizedException(
        "Authenticated user not found.",
      );
    }

    return userId;
  }

  @Get()
  getQueue(
    @Req() request: AuthenticatedRequest,
  ) {
    return this.queueService.getQueue(
      this.getUserId(request),
    );
  }

  @Post()
  add(
    @Req() request: AuthenticatedRequest,
    @Body() dto: AddQueueItemDto,
  ) {
    return this.queueService.add(
      this.getUserId(request),
      dto,
    );
  }

  @Patch(":id")
  reorder(
    @Req() request: AuthenticatedRequest,
    @Param("id") id: string,
    @Body() dto: ReorderQueueDto,
  ) {
    return this.queueService.reorder(
      this.getUserId(request),
      id,
      dto,
    );
  }

  @Delete(":id")
  remove(
    @Req() request: AuthenticatedRequest,
    @Param("id") id: string,
  ) {
    return this.queueService.remove(
      this.getUserId(request),
      id,
    );
  }

  @Delete()
  clear(
    @Req() request: AuthenticatedRequest,
  ) {
    return this.queueService.clear(
      this.getUserId(request),
    );
  }
}