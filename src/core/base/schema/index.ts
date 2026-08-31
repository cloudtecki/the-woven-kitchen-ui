import { string } from "yup";
export * from './user'

export const stringRequired = string().required();
export const stringOptional = string().notRequired();
export const stringNullable = string().nullable();
export const stringRequiredNullable = string().required().nullable();
export const booleanRequired = string().required();
export const booleanOptional = string().notRequired();
export const booleanNullable = string().nullable();
export const booleanRequiredNullable = string().required().nullable();
export const numberRequired = string().required();
export const numberOptional = string().notRequired();
export const numberNullable = string().nullable();
export const numberRequiredNullable = string().required().nullable();