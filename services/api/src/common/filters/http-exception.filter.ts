import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";

import type {
  Request,
  Response,
} from "express";

import { randomUUID } from "node:crypto";

type ErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    requestId: string;
  };
};

@Catch()
export class HttpExceptionFilter
  implements ExceptionFilter
{
  catch(
    exception: unknown,
    host: ArgumentsHost,
  ) {
    const context =
      host.switchToHttp();

    const response =
      context.getResponse<Response>();

    const request =
      context.getRequest<Request>();

    const incomingRequestId =
      request.headers[
        "x-request-id"
      ];

    const requestId =
      typeof incomingRequestId ===
        "string" &&
      incomingRequestId.length > 0
        ? incomingRequestId
        : randomUUID();

    const status =
      exception instanceof
      HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let code =
      "INTERNAL_SERVER_ERROR";

    let message =
      "Internal server error";

    if (
      exception instanceof
      HttpException
    ) {
      const exceptionResponse =
        exception.getResponse();

      if (
        typeof exceptionResponse ===
        "string"
      ) {
        message =
          exceptionResponse;
      } else if (
        typeof exceptionResponse ===
          "object" &&
        exceptionResponse !== null
      ) {
        const data =
          exceptionResponse as {
            message?:
              | string
              | string[];
            error?: string;
          };

        if (
          Array.isArray(
            data.message,
          )
        ) {
          message =
            data.message.join(", ");
        } else if (
          data.message
        ) {
          message =
            data.message;
        }

        if (data.error) {
          code =
            data.error
              .toUpperCase()
              .replaceAll(
                " ",
                "_",
              );
        } else {
          code = `HTTP_${status}`;
        }
      }
    }

    const payload:
      ErrorResponse = {
      success: false,
      error: {
        code,
        message,
        requestId,
      },
    };

    response
      .status(status)
      .json(payload);
  }
}