export type MusicProviderId =
  | "local-demo"
  | "youtube";

export type ProviderStatus = {
  displayName: string;
  connected: boolean;
  mode: string;
  implementation: string;
};

export type ProviderArtist = {
  providerArtistId: string;
  name: string;
  imageUrl: string | null;
  metadata: Record<string, unknown>;
};

export type ProviderAlbum = {
  providerAlbumId: string;
  title: string;
  releaseDate: string | null;
  artworkUrl: string | null;
  metadata: Record<string, unknown>;
};

export type YouTubePlaybackInfo = {
  type: "youtube-iframe";
  videoId: string;
};

export type DemoPlaybackInfo = {
  type: "demo";
};

export type ProviderPlaybackInfo =
  | YouTubePlaybackInfo
  | DemoPlaybackInfo;

export type ProviderTrack = {
  providerTrackId: string;
  title: string;

  artist: ProviderArtist | null;
  album: ProviderAlbum | null;

  durationMs: number;
  releaseDate: string | null;
  genres: string[];

  artworkUrl: string | null;

  playback: ProviderPlaybackInfo;

  metadata: Record<string, unknown>;
};

export type ProviderSearchResult = {
  items: ProviderTrack[];
  total?: number;
};

export interface MusicProvider {
  readonly id: MusicProviderId;

  search(
    query: string,
    limit?: number,
  ): Promise<ProviderSearchResult>;

  getTrack(
    providerTrackId: string,
  ): Promise<ProviderTrack | null>;

  getPlaybackInfo(
    providerTrackId: string,
  ): Promise<ProviderPlaybackInfo>;

  status(): Promise<ProviderStatus>;
}