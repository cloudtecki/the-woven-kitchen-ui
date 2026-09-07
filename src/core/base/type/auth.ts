export type AuthRole = 'ADMIN' | 'CUSTOMER';

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