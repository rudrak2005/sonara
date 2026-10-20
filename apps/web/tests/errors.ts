export class ApiError extends Error {
  readonly code: string;
  readonly requestId?: string;
  readonly status: number;

  constructor({
    message,
    code,
    requestId,
    status,
  }: {
    message: string;
    code: string;
    requestId?: string;
    status: number;
  }) {
    super(message);

    this.name = "ApiError";
    this.code = code;
    this.requestId = requestId;
    this.status = status;
  }
}