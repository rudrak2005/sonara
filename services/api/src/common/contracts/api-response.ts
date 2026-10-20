export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiFailure = {
  success: false;
  error: {
    code: string;
    message: string;
    requestId?: string;
  };
};

export type ApiResponse<T> =
  | ApiSuccess<T>
  | ApiFailure;