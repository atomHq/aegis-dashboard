// ============================================
// AEGIS API CLIENT
// ============================================

import type {
  APIResponse,
  APIErrorResponse,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// --- Custom Error ---

export class ApiError extends Error {
  code: string;
  status: number;
  details?: Record<string, unknown>;

  constructor(
    code: string,
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

// Flag to suppress 401 redirect during login / session init
let _suppressAuthRedirect = false;

export function suppressAuthRedirect(suppress: boolean): void {
  _suppressAuthRedirect = suppress;
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
  options?: RequestInit & { skipAuth?: boolean }
): Promise<T> {
  const token = getToken();
  const { skipAuth, ...fetchOptions } = options || {};

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((fetchOptions?.headers as Record<string, string>) || {}),
  };

  if (!skipAuth && token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  const json = (await res.json()) as APIResponse<T>;

  if (json.status === "error") {
    const errorResponse = json as APIErrorResponse;

    // 401 → clear token and redirect (unless suppressed during login/init)
    if (res.status === 401 && !_suppressAuthRedirect) {
      clearToken();
      if (typeof window !== "undefined") {
        window.location.href = "/login?expired=true";
      }
    }

    throw new ApiError(
      errorResponse.error.code,
      errorResponse.error.message,
      res.status,
      errorResponse.error.details
    );
  }

  return json.data as T;
}

// --- Convenience methods ---

export const api = {
  get<T>(endpoint: string, opts?: RequestInit & { skipAuth?: boolean }) {
    return request<T>(endpoint, { ...opts, method: "GET" });
  },

  post<T>(
    endpoint: string,
    body?: unknown,
    opts?: RequestInit & { skipAuth?: boolean }
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
    opts?: RequestInit & { skipAuth?: boolean }
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
    opts?: RequestInit & { skipAuth?: boolean }
  ) {
    return request<T>(endpoint, {
      ...opts,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete<T>(endpoint: string, opts?: RequestInit & { skipAuth?: boolean }) {
    return request<T>(endpoint, { ...opts, method: "DELETE" });
  },
};
