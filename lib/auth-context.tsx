"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import {
  api,
  getToken,
  setToken,
  clearToken,
  getStoredUser,
  setStoredUser,
  ApiError,
} from "./api";
import type {
  User,
  Tenant,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  ResendVerificationResponse,
} from "./types";

interface AuthState {
  user: User | null;
  tenant: Tenant | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (data: LoginRequest) => Promise<LoginResponse>;
  signup: (data: SignupRequest) => Promise<SignupResponse>;
  verifyEmail: (data: VerifyEmailRequest) => Promise<VerifyEmailResponse>;
  resendVerification: (email: string) => Promise<ResendVerificationResponse>;
  logout: () => void;
  setTenantData: (tenant: Tenant) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    tenant: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Initialize from localStorage
  useEffect(() => {
    const token = getToken();
    const storedUser = getStoredUser();

    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        setState({
          user,
          tenant: null,
          token,
          isLoading: true,
          isAuthenticated: true,
        });

        // Validate token by fetching tenant
        if (user.tenant_id) {
          api
            .get<Tenant>(`/api/v1/tenants/${user.tenant_id}`)
            .then((tenant) => {
              setState((prev) => ({
                ...prev,
                tenant,
                isLoading: false,
              }));
            })
            .catch(() => {
              clearToken();
              setState({
                user: null,
                tenant: null,
                token: null,
                isLoading: false,
                isAuthenticated: false,
              });
            });
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch {
        clearToken();
        setState({
          user: null,
          tenant: null,
          token: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(
    async (data: LoginRequest): Promise<LoginResponse> => {
      const response = await api.post<LoginResponse>(
        "/api/v1/auth/login",
        data,
        { skipAuth: true }
      );

      setToken(response.token);
      setStoredUser(response.user);

      // Fetch tenant info
      let tenant: Tenant | null = null;
      if (response.user.tenant_id) {
        try {
          tenant = await api.get<Tenant>(
            `/api/v1/tenants/${response.user.tenant_id}`
          );
        } catch {
          // Non-critical - proceed without tenant
        }
      }

      setState({
        user: response.user,
        tenant,
        token: response.token,
        isLoading: false,
        isAuthenticated: true,
      });

      return response;
    },
    []
  );

  const signup = useCallback(
    async (data: SignupRequest): Promise<SignupResponse> => {
      return api.post<SignupResponse>("/api/v1/auth/signup", data, {
        skipAuth: true,
      });
    },
    []
  );

  const verifyEmail = useCallback(
    async (data: VerifyEmailRequest): Promise<VerifyEmailResponse> => {
      return api.post<VerifyEmailResponse>("/api/v1/auth/verify-email", data, {
        skipAuth: true,
      });
    },
    []
  );

  const resendVerification = useCallback(
    async (email: string): Promise<ResendVerificationResponse> => {
      return api.post<ResendVerificationResponse>(
        "/api/v1/auth/resend-verification",
        { email },
        { skipAuth: true }
      );
    },
    []
  );

  const logout = useCallback(() => {
    clearToken();
    setState({
      user: null,
      tenant: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });
    router.push("/login");
  }, [router]);

  const setTenantData = useCallback((tenant: Tenant) => {
    setState((prev) => ({ ...prev, tenant }));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      signup,
      verifyEmail,
      resendVerification,
      logout,
      setTenantData,
    }),
    [state, login, signup, verifyEmail, resendVerification, logout, setTenantData]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

// --- Auth Guard Component ---

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full gradient-bg animate-pulse" />
          <p className="text-text-secondary text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

export { ApiError };
