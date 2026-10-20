import type { ApiResponse } from "./types";
import { ApiError } from "./errors";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000/api/v1";

type RequestOptions = RequestInit & {
  query?: Record<
    string,
    string | number | boolean | undefined
  >;
};

function buildUrl(
  path: string,
  query?: RequestOptions["query"],
) {
  const url = new URL(
    `${API_URL}${path}`,
  );

  Object.entries(query ?? {}).forEach(
    ([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    },
  );

  return url.toString();
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { query, headers, ...init } = options;

  const response = await fetch(
    buildUrl(path, query),
    {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      credentials: "include",
    },
  );

  let payload:
    | ApiResponse<T>
    | undefined;

  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError({
      message: "Invalid API response.",
      code: "INVALID_API_RESPONSE",
      status: response.status,
    });
  }

  if (
    !response.ok ||
    !payload.success
  ) {
    const error =
      payload.success === false
        ? payload.error
        : {
            code: "HTTP_ERROR",
            message: "Request failed.",
            requestId: "",
          };

    throw new ApiError({
      message: error.message,
      code: error.code,
      requestId: error.requestId,
      status: response.status,
    });
  }

  return payload.data;
}

export const api = {
  get<T>(
    path: string,
    query?: RequestOptions["query"],
  ) {
    return apiRequest<T>(path, {
      method: "GET",
      query,
    });
  },

  post<T, Body>(
    path: string,
    body: Body,
  ) {
    return apiRequest<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  put<T, Body>(
    path: string,
    body: Body,
  ) {
    return apiRequest<T>(path, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  delete<T>(path: string) {
    return apiRequest<T>(path, {
      method: "DELETE",
    });
  },
};