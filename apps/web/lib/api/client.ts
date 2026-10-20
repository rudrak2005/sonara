import type { ApiResponse } from "./types";
import { ApiError } from "./errors";

type RequestOptions = RequestInit & {
  query?: Record<
    string,
    string | number | boolean | undefined
  >;
};

/*
 * Frontend requests go through the Next.js
 * same-origin proxy:
 *
 * Browser
 *   /api/v1/...
 *        ↓
 * Next.js rewrite
 *        ↓
 * localhost:5000/api/v1/...
 *
 * Therefore the base URL must be empty.
 */
const API_URL = "";

function buildUrl(
  path: string,
  query?: RequestOptions["query"],
) {
  const cleanPath =
    path.startsWith("/")
      ? path
      : `/${path}`;

  const finalUrl =
    `${API_URL}${cleanPath}`;

  const url = new URL(
    finalUrl,
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000",
  );

  for (const [
    key,
    value,
  ] of Object.entries(
    query ?? {},
  )) {
    if (value !== undefined) {
      url.searchParams.set(
        key,
        String(value),
      );
    }
  }

  return url.toString();
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    query,
    headers,
    ...init
  } = options;

  const response = await fetch(
    buildUrl(path, query),
    {
      ...init,
      headers: {
        Accept:
          "application/json",
        "Content-Type":
          "application/json",
        ...headers,
      },
      credentials: "include",
      cache: "no-store",
    },
  );

  let payload:
    | ApiResponse<T>
    | undefined;

  try {
    payload =
      (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError({
      message:
        "Invalid API response.",
      code:
        "INVALID_API_RESPONSE",
      status:
        response.status,
    });
  }

  if (
    !response.ok ||
    !payload.success
  ) {
    if (!payload.success) {
      throw new ApiError({
        message:
          payload.error.message,
        code:
          payload.error.code,
        requestId:
          payload.error.requestId,
        status:
          response.status,
      });
    }

    throw new ApiError({
      message:
        "Request failed.",
      code:
        "HTTP_ERROR",
      status:
        response.status,
    });
  }

  return payload.data;
}

export const api = {
  get<T>(
    path: string,
    query?: RequestOptions["query"],
  ) {
    return apiRequest<T>(
      path,
      {
        method: "GET",
        query,
      },
    );
  },

  post<T, B>(
    path: string,
    body: B,
  ) {
    return apiRequest<T>(
      path,
      {
        method: "POST",
        body:
          JSON.stringify(body),
      },
    );
  },

  put<T, B>(
    path: string,
    body: B,
  ) {
    return apiRequest<T>(
      path,
      {
        method: "PUT",
        body:
          JSON.stringify(body),
      },
    );
  },

  patch<T, B>(
    path: string,
    body: B,
  ) {
    return apiRequest<T>(
      path,
      {
        method: "PATCH",
        body:
          JSON.stringify(body),
      },
    );
  },

  delete<T>(
    path: string,
  ) {
    return apiRequest<T>(
      path,
      {
        method: "DELETE",
      },
    );
  },
};