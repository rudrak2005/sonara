export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiFailure = {
  success: false;
  error: {
    code: string;
    message: string;
    requestId: string;
  };
};

export type ApiResponse<T> =
  | ApiSuccess<T>
  | ApiFailure;

  export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly requestId?: string;

  constructor(input: {
    message: string;
    code: string;
    status: number;
    requestId?: string;
  }) {
    super(input.message);

    this.name = "ApiError";
    this.code = input.code;
    this.status = input.status;
    this.requestId = input.requestId;
  }
}