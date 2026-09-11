export type AuthRole = 'ADMIN' | 'CUSTOMER';

// Alias kept for navigation/route-guard readability. Single source of truth
// stays AuthRole (mirrors backend ROLES in backend-twk-admin/src/shared/constants/roles.js).
export type UserRole = AuthRole;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: AuthRole;
  bio: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  password: string;
  bio?: string;
}

export interface SignupApiResponse {
  success: boolean;
  data: AuthUser;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginData {
  token: string;
  user: AuthUser;
}

export interface LoginApiResponse {
  success: boolean;
  data: LoginData;
  message: string;
}

// GET /api/users/me — backend wraps the user DTO with successResponse(res, user)
// (no message). Message stays optional to match the backend exactly.
export interface CurrentUserApiResponse {
  success: boolean;
  data: AuthUser;
  message?: string;
}