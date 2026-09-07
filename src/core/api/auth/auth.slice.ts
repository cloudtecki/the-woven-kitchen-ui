import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthUser } from 'core/base/type/auth';

export type AuthState = {
    user: AuthUser | null;
};

export const initialAuthState: AuthState = {
    user: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState: initialAuthState,
    reducers: {
        setAuthUser: (state, action: PayloadAction<AuthUser>) => {
            state.user = action.payload;
        },
        clearAuthUser: (state) => {
            state.user = null;
        },
    },
});

export const { setAuthUser, clearAuthUser } = authSlice.actions;

export default authSlice.reducer;