// ============================================
// AEGIS API CLIENT
// ============================================

import type {
  APIResponse,
  APIErrorResponse,
  APISuccessResponse,
  ErrorCode,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// --- Custom Error ---

export class ApiError extends Error {
  code: ErrorCode | string;
  status: number;
  details?: Record<string, unknown>;

  constructor(
    code: ErrorCode | string,
    message: string,
    status: number,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

// --- Token helpers ---

const TOKEN_KEY = "aegis_token";
const USER_KEY = "aegis_user";

type UnauthorizedBehavior = "logout" | "throw";

interface AuthTeardownOptions {
  expired?: boolean;
}

type AuthTeardownHandler = (options?: AuthTeardownOptions) => void;

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
  onUnauthorized?: UnauthorizedBehavior;
}

let authTeardownHandler: AuthTeardownHandler | null = null;

export function registerAuthTeardownHandler(
  handler: AuthTeardownHandler
): () => void {
  authTeardownHandler = handler;

  return () => {
    if (authTeardownHandler === handler) {
      authTeardownHandler = null;
    }
  };
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USER_KEY);
}

export function setStoredUser(user: object): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// --- API Client ---

async function request<T>(
  endpoint: string,
  options?: RequestOptions
): Promise<T> {
  const token = getToken();
  const {
    skipAuth,
    onUnauthorized = "logout",
    ...fetchOptions
  } = options || {};

  const headers = new Headers(fetchOptions?.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (!skipAuth && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  const rawBody =
    res.status === 204 || res.status === 205 ? "" : await res.text();
  const contentType = res.headers.get("content-type") || "";
  const expectsJson =
    contentType.includes("application/json") || contentType.includes("+json");

  let parsedBody: unknown = null;
  let parseFailed = false;

  if (rawBody && expectsJson) {
    try {
      parsedBody = JSON.parse(rawBody) as APIResponse<T>;
    } catch {
      parseFailed = true;
    }
  }

  if (isAPIErrorResponse(parsedBody)) {
    if (res.status === 401 && onUnauthorized === "logout") {
      handleUnauthorized({ expired: true });
    }

    throw new ApiError(
      parsedBody.error.code,
      parsedBody.error.message,
      res.status,
      parsedBody.error.details
    );
  }

  if (res.status === 401 && onUnauthorized === "logout") {
    handleUnauthorized({ expired: true });
  }

  if (!res.ok) {
    throw buildFallbackError(res.status, rawBody);
  }

  if (!rawBody) {
    return undefined as T;
  }

  if (isAPISuccessResponse<T>(parsedBody)) {
    return parsedBody.data as T;
  }

  if (parseFailed || expectsJson || rawBody) {
    throw buildFallbackError(
      res.status,
      rawBody,
      "Received an unexpected response from the server."
    );
  }

  return undefined as T;
}

function handleUnauthorized(options?: AuthTeardownOptions): void {
  if (authTeardownHandler) {
    authTeardownHandler(options);
    return;
  }

  clearToken();
  if (typeof window !== "undefined") {
    window.location.href = options?.expired
      ? "/login?expired=true"
      : "/login";
  }
}

function buildFallbackError(
  status: number,
  rawBody: string,
  fallbackMessage?: string
): ApiError {
  const message =
    rawBody.trim() || fallbackMessage || "The server returned an invalid response.";

  return new ApiError("UNEXPECTED_RESPONSE", message, status);
}

function isAPIErrorResponse(value: unknown): value is APIErrorResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const maybeResponse = value as Partial<APIErrorResponse>;
  return (
    maybeResponse.status === "error" &&
    !!maybeResponse.error &&
    typeof maybeResponse.error.code === "string" &&
    typeof maybeResponse.error.message === "string"
  );
}

function isAPISuccessResponse<T>(value: unknown): value is APISuccessResponse<T> {
  if (!value || typeof value !== "object") {
    return false;
  }

  return (value as Partial<APISuccessResponse<T>>).status === "success";
}

// --- Convenience methods ---

export const api = {
  get<T>(endpoint: string, opts?: RequestOptions) {
    return request<T>(endpoint, { ...opts, method: "GET" });
  },

  post<T>(
    endpoint: string,
    body?: unknown,
    opts?: RequestOptions
  ) {
    return request<T>(endpoint, {
      ...opts,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  patch<T>(
    endpoint: string,
    body?: unknown,
    opts?: RequestOptions
  ) {
    return request<T>(endpoint, {
      ...opts,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put<T>(
    endpoint: string,
    body?: unknown,
    opts?: RequestOptions
  ) {
    return request<T>(endpoint, {
      ...opts,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete<T>(endpoint: string, opts?: RequestOptions) {
    return request<T>(endpoint, { ...opts, method: "DELETE" });
  },
};
