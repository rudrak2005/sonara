import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";

import { SessionGuard } from "../auth/guards/session.guard";

import { LibraryService } from "./library.service";

type AuthenticatedRequest = Request & {
  user?: {
    id: string;
  };
};

@Controller("library")
@UseGuards(SessionGuard)
export class LibraryController {
  constructor(
    private readonly libraryService: LibraryService,
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
  getLibrary(
    @Req() request: AuthenticatedRequest,
  ) {
    return this.libraryService.getLibrary(
      this.getUserId(request),
    );
  }

  @Get("tracks/:musicItemId")
  getTrackStatus(
    @Req() request: AuthenticatedRequest,
    @Param("musicItemId") musicItemId: string,
  ) {
    return this.libraryService.getTrackStatus(
      this.getUserId(request),
      musicItemId,
    );
  }

  @Post("tracks/:musicItemId")
  saveTrack(
    @Req() request: AuthenticatedRequest,
    @Param("musicItemId") musicItemId: string,
  ) {
    return this.libraryService.saveTrack(
      this.getUserId(request),
      musicItemId,
    );
  }

  @Delete("tracks/:musicItemId")
  unsaveTrack(
    @Req() request: AuthenticatedRequest,
    @Param("musicItemId") musicItemId: string,
  ) {
    return this.libraryService.unsaveTrack(
      this.getUserId(request),
      musicItemId,
    );
  }
}
