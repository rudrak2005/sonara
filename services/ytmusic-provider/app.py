from typing import Any

from fastapi import FastAPI, HTTPException, Query
from ytmusicapi import YTMusic

app = FastAPI(
    title="SONORA YouTube Music Provider",
    version="1.0.0",
)

ytmusic = YTMusic()


def thumbnail_url(
    thumbnails: list[dict[str, Any]] | None,
) -> str | None:
    if not thumbnails:
        return None

    return thumbnails[-1].get("url")


def map_song(item: dict[str, Any]) -> dict[str, Any]:
    artists = item.get("artists") or []
    artist = artists[0] if artists else None

    album = item.get("album") or {}

    artwork = thumbnail_url(
        item.get("thumbnails")
    )

    duration_seconds = (
        item.get("duration_seconds") or 0
    )

    return {
        "providerTrackId": item.get("videoId"),
        "title": item.get("title") or "Unknown title",

        "artist": (
            {
                "providerArtistId":
                    artist.get("id")
                    if artist
                    else None,

                "name":
                    artist.get("name")
                    if artist
                    else "Unknown artist",

                "imageUrl": artwork,

                "metadata": {
                    "source": "ytmusicapi",
                },
            }
            if artist
            else None
        ),

        "album": (
            {
                "providerAlbumId":
                    album.get("id"),

                "title":
                    album.get("name")
                    or "Unknown album",

                "releaseDate": None,

                "artworkUrl": artwork,

                "metadata": {
                    "source": "ytmusicapi",
                },
            }
            if album
            else None
        ),

        "durationMs":
            int(duration_seconds * 1000),

        "releaseDate": None,

        "genres": [],

        "artworkUrl": artwork,

        "metadata": {
            "source": "ytmusicapi",
            "resultType":
                item.get("resultType"),
            "category":
                item.get("category"),
            "videoId":
                item.get("videoId"),
        },
    }


@app.get("/health")
def health():
    return {
        "success": True,
        "provider": "youtube-music",
        "displayName": "YouTube Music",
        "implementation": "ytmusicapi",
        "mode": "public-search",
        "connected": True,
    }


@app.get("/search")
def search(
    q: str = Query(
        ...,
        min_length=1,
        max_length=100,
    ),
    limit: int = Query(
        20,
        ge=1,
        le=50,
    ),
):
    query = " ".join(q.strip().split())

    if not query:
        raise HTTPException(
            status_code=400,
            detail="Search query cannot be empty.",
        )

    try:
        results = ytmusic.search(
            query,
            filter="songs",
            limit=limit,
        )

        items = []

        for item in results:
            if item.get("resultType") != "song":
                continue

            mapped = map_song(item)

            if mapped["providerTrackId"]:
                items.append(mapped)

        return {
            "success": True,
            "provider": "youtube-music",
            "displayName": "YouTube Music",
            "implementation": "ytmusicapi",
            "mode": "public-search",
            "items": items,
            "total": len(items),
        }

    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail="YouTube Music search is temporarily unavailable.",
        ) from exc


@app.get("/track/{video_id}")
def track(video_id: str):
    if not video_id.strip():
        raise HTTPException(
            status_code=400,
            detail="Invalid video id.",
        )

    try:
        result = ytmusic.get_song(
            video_id
        )

        video_details = (
            result.get("videoDetails")
            or {}
        )

        player_microformat = (
            result.get("microformat", {})
            .get(
                "playerMicroformatRenderer",
                {},
            )
        )

        thumbnails = (
            video_details
            .get("thumbnail", {})
            .get("thumbnails", [])
        )

        artwork = thumbnail_url(
            thumbnails
        )

        duration_seconds = int(
            video_details.get(
                "lengthSeconds",
                0,
            )
            or 0
        )

        artist_name = (
            video_details.get("author")
            or "Unknown artist"
        )

        channel_id = (
            player_microformat.get(
                "externalChannelId"
            )
        )

        return {
            "success": True,
            "data": {
                "providerTrackId": video_id,
                "title":
                    video_details.get(
                        "title"
                    )
                    or "Unknown title",

                "artist": {
                    "providerArtistId":
                        channel_id
                        or "unknown-artist",

                    "name": artist_name,

                    "imageUrl":
                        artwork,

                    "metadata": {
                        "source": "ytmusicapi",
                    },
                },

                "album": None,

                "durationMs":
                    duration_seconds * 1000,

                "releaseDate":
                    None,

                "genres": [],

                "artworkUrl":
                    artwork,

                "metadata": {
                    "source": "ytmusicapi",
                    "videoId": video_id,
                },
            },
        }

    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail="Unable to retrieve YouTube Music track.",
        ) from exc