import { boolean, object, string } from 'yup';
import { USER_ROLES } from 'core/base/const/validation';

export const AuthUserSchema = object({
  id: string().required(),
  name: string().required(),
  email: string().required(),
  phone: string().required(),
  role: string().oneOf([USER_ROLES.ADMIN, USER_ROLES.CUSTOMER]).required(),
  bio: string().nullable(),
  isActive: boolean().required(),
  createdAt: string().required(),
  updatedAt: string().required(),
});

export const SignupRequestSchema = object({
  name: string().trim().min(1).max(100).required(),
  email: string().trim().lowercase().required(),
  phone: string().required(),
  alternatePhone: string().notRequired(),
  password: string().required(),
  bio: string().max(500).notRequired(),
});

export const SignupApiResponseSchema = object({
  success: boolean().required(),
  data: AuthUserSchema.required(),
  message: string().required(),
});

export const LoginRequestSchema = object({
  email: string().trim().required(),
  password: string().trim().min(1).required(),
});

export const LoginDataSchema = object({
  token: string().required(),
  user: AuthUserSchema.required(),
});

export const LoginApiResponseSchema = object({
  success: boolean().required(),
  data: LoginDataSchema.required(),
  message: string().required(),
});