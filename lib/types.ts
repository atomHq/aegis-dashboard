// ============================================
// AEGIS DOMAIN TYPES
// ============================================

// --- API Response Envelope ---

export interface APISuccessResponse<T> {
  status: "success";
  data: T;
  meta: {
    request_id: string;
    timestamp: string; // RFC3339
  };
}

export interface APIErrorResponse {
  status: "error";
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta: {
    request_id: string;
    timestamp: string;
  };
}

export type APIResponse<T> = APISuccessResponse<T> | APIErrorResponse;

// --- Error Codes ---

export type ErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "LIMIT_EXCEEDED"
  | "SECRET_EXPIRED"
  | "INTERNAL_ERROR"
  | "SIGNUP_FAILED"
  | "VERIFICATION_FAILED"
  | "CREATE_FAILED"
  | "KEY_CREATE_FAILED"
  | "SECRET_WRITE_FAILED"
  | "UNEXPECTED_RESPONSE";

// --- Domain Models ---

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  tenant_id?: string;
  is_verified: boolean;
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: "free" | "pro" | "enterprise";
  max_secrets: number;
  max_projects: number;
  rate_limit_per_min: number;
  is_active: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  tenant_id: string;
  name: string;
  slug: string;
  description?: string;
  environment: "development" | "staging" | "production";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type Scope =
  | "secrets:read"
  | "secrets:write"
  | "secrets:admin"
  | "projects:manage"
  | "api_keys:manage"
  | "audit:read";

export interface APIKey {
  id: string;
  tenant_id: string;
  name: string;
  key_prefix: string;
  scopes: Scope[];
  project_ids?: string[];
  is_active: boolean;
  last_used_at?: string;
  expires_at?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  tenant_id: string;
  actor: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  metadata?: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
}

// --- Auth Request/Response Types ---

export interface SignupRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  org_name: string;
  org_slug: string;
}

export interface SignupResponse {
  user: User;
  tenant: Tenant;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  token_type: "Bearer";
  expires_in: number;
  user: User;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface VerifyEmailResponse {
  user: User;
  message: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ResendVerificationResponse {
  message: string;
}

// --- CRUD Request Types ---

export interface CreateProjectRequest {
  name: string;
  slug: string;
  description?: string;
  environment: "development" | "staging" | "production";
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  is_active?: boolean;
}

export interface CreateAPIKeyRequest {
  name: string;
  scopes: Scope[];
  project_ids?: string[];
  expires_at?: string;
}

export interface CreateAPIKeyResponse {
  key: APIKey;
  plaintext_key: string;
  warning: string;
}

export interface UpdateTenantRequest {
  name?: string;
}

// --- Pagination ---

export interface PaginationParams {
  limit?: number;
  cursor?: string;
}
