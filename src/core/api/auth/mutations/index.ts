import { baseApi } from 'core/api/base.api';
import { AuthApiService } from 'core/service/auth.service';
import {
    LoginApiResponse,
    LoginRequest,
    SignupApiResponse,
    SignupRequest,
} from 'core/base/type/auth';

const authMutationsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        signup: builder.mutation<SignupApiResponse, SignupRequest>({
            queryFn: async (payload: SignupRequest) => {
                return AuthApiService.signup(payload);
            },
        }),
        login: builder.mutation<LoginApiResponse, LoginRequest>({
            queryFn: async (payload: LoginRequest) => {
                return AuthApiService.login(payload);
            },
        }),
    }),
});

export const { useSignupMutation, useLoginMutation } = authMutationsApi;