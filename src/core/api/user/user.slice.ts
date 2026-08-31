import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialUserState } from "./user.state";
import { ThemeModeType, UserApiResponse } from "core/base/type/user";

const userSlice = createSlice({
    name: 'user',
    initialState: initialUserState,
    reducers: {
        setUserDetails: (state, action: PayloadAction<UserApiResponse>) => {
            state.userDetails = action.payload;
        },
        setThemeMode: (state, action: PayloadAction<ThemeModeType>) => {
            state.themeMode = action.payload;
        }
    }
});


export const { setUserDetails, setThemeMode } = userSlice.actions;

export default userSlice.reducer;