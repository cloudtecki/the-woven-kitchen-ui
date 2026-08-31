import { InferType } from "yup";
import { UserSchema } from "../schema/user";

export type UserSubmitParams = {
    name: string;
    email: string;
    address?: string;
};

export type UserParams = {
    id: string;
    name: string;
    email: string;
    address?: string;
};

export type ThemeModeType = 'light' | 'dark';

export type UserApiResponse = InferType<typeof UserSchema>;