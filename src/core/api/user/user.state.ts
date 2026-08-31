import { ThemeModeType, UserApiResponse } from "core/base/type/user";

export type initialUserStateType = {
    userDetails: UserApiResponse,
    themeMode: ThemeModeType
};

export const initialUserState: initialUserStateType = {
    userDetails: {} as UserApiResponse,
    themeMode: 'light'
};