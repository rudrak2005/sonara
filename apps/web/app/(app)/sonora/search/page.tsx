"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { searchMusic } from "@/lib/music/search";
import { SearchResults } from "./search-results";

type SearchResponse = {
  provider: string;
  cached: boolean;
  total: number;
  items: Array<{
    providerTrackId: string;
    title: string;

    artist: {
      providerArtistId: string;
      name: string;
      imageUrl: string | null;
    } | null;

    album: {
      providerAlbumId: string;
      title: string;
      artworkUrl: string | null;
    } | null;

    durationMs: number;
    artworkUrl: string | null;
    genres: string[];
  }>;
};

export default function SearchPage() {
  const searchParams = useSearchParams();

  const [query, setQuery] =
    useState("");

  const [results, setResults] =
    useState<SearchResponse | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function runSearch(value: string) {
    const normalized =
      value.trim();

    if (!normalized) {
      setError(
        "Enter a song, artist, or album.",
      );
      setResults(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data =
        await searchMusic(
          normalized,
          20,
        );

      setResults(data);
    } catch (err) {
      setResults(null);

      setError(
        err instanceof Error
          ? err.message
          : "Search failed.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    void runSearch(query);
  }

  useEffect(() => {
    const urlQuery =
      searchParams.get("q") ?? "";

    if (!urlQuery.trim()) {
      return;
    }

    setQuery(urlQuery);
    void runSearch(urlQuery);
  }, [searchParams]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-44">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-[#B5A69A]">
          SONORA / SEARCH
        </p>

        <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
          Find your sound.
        </h1>

        <p className="max-w-2xl text-[#B5A69A]">
          Search songs, artists, albums,
          and discover something worth playing.
        </p>
      </header>

      <form
        onSubmit={handleSearch}
        className="relative"
      >
        <div className="flex items-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-xl">
          <Search
            className="mr-3 h-5 w-5 text-[#8F8175]"
            aria-hidden="true"
          />

          <input
            type="search"
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Search Midnight Circuit..."
            className="min-w-0 flex-1 bg-transparent text-base text-[#F5EFE8] outline-none placeholder:text-[#71655C]"
            maxLength={100}
            aria-label="Search music"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl border border-white/10 bg-[#D18A4D]/10 px-4 py-2 text-sm font-medium text-[#F5EFE8] transition hover:bg-[#D18A4D]/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Searching..."
              : "Search"}
          </button>
        </div>
      </form>

      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-200"
        >
          {error}
        </div>
      )}

      {loading && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-sm text-[#B5A69A]">
          Searching your music source...
        </div>
      )}

      {!loading &&
        results &&
        results.items.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
            <p className="text-lg font-medium text-[#F5EFE8]">
              No music found.
            </p>

            <p className="mt-2 text-sm text-[#B5A69A]">
              Try another song, artist, or album.
            </p>
          </div>
        )}

      {!loading &&
        results &&
        results.items.length > 0 && (
          <SearchResults
            provider={results.provider}
            cached={results.cached}
            total={results.total}
            items={results.items}
          />
        )}
    </div>
  );
}