import { APIEndpoints } from 'core/base/enum/api';
import {
    CurrentUserApiResponseSchema,
    LoginApiResponseSchema,
    SignupApiResponseSchema,
} from 'core/base/schema/auth';
import {
    CurrentUserApiResponse,
    LoginApiResponse,
    LoginRequest,
    SignupApiResponse,
    SignupRequest,
} from 'core/base/type/auth';
import { ServiceBase } from 'core/http/base.service';
import { ApiIResult } from 'core/http/type';

export class AuthApiService extends ServiceBase {
    static signup(payload: SignupRequest): Promise<ApiIResult<SignupApiResponse>> {
        return this.post(APIEndpoints.SIGNUP, payload, SignupApiResponseSchema);
    }

    static login(payload: LoginRequest): Promise<ApiIResult<LoginApiResponse>> {
        return this.post(APIEndpoints.LOGIN, payload, LoginApiResponseSchema);
    }

    static getCurrentUser(): Promise<ApiIResult<CurrentUserApiResponse>> {
        return this.get(APIEndpoints.GET_CURRENT_USER, CurrentUserApiResponseSchema);
    }
}