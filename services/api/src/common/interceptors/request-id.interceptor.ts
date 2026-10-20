import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";

import type {
  Request,
  Response,
} from "express";

import { randomUUID } from "node:crypto";
import { Observable } from "rxjs";

@Injectable()
export class RequestIdInterceptor
  implements NestInterceptor
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const http =
      context.switchToHttp();

    const request =
      http.getRequest<Request>();

    const response =
      http.getResponse<Response>();

    const incoming =
      request.headers[
        "x-request-id"
      ];

    const requestId =
      typeof incoming ===
        "string" &&
      incoming.trim().length > 0
        ? incoming
        : randomUUID();

    request.headers[
      "x-request-id"
    ] = requestId;

    response.setHeader(
      "x-request-id",
      requestId,
    );

    return next.handle();
  }
}