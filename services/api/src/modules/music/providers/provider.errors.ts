export type MusicProviderErrorCode =
  | "PROVIDER_UNAVAILABLE"
  | "PROVIDER_RATE_LIMITED"
  | "PROVIDER_UNAUTHORIZED"
  | "PROVIDER_INVALID_RESPONSE"
  | "TRACK_NOT_PLAYABLE";

export class MusicProviderError extends Error {
  public readonly code: MusicProviderErrorCode;

  constructor(
    message: string,
    code: MusicProviderErrorCode,
  ) {
    super(message);

    this.name = "MusicProviderError";
    this.code = code;

    Object.setPrototypeOf(
      this,
      MusicProviderError.prototype,
    );
  }
}