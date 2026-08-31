import { combineReducers } from '@reduxjs/toolkit';
import {
    reducerPath as apiReducerPath,
    reducer as apiReducer,
} from 'core/api/base.api';
// import userReducer from 'core/api/user/user.reducer';
import user from "core/api/user/user.slice";

const rootReducer = combineReducers({
    user,
    [apiReducerPath]: apiReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
