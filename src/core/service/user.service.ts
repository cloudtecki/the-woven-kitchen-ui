import { APIEndpoints } from "core/base/enum/api";
import { stringRequired } from "core/base/schema";
import { UserSchema } from "core/base/schema/user";
import { UserApiResponse, UserParams, UserSubmitParams } from "core/base/type/user";
import { ServiceBase } from "core/http/base.service";
import { ApiIResult } from "core/http/type";


export class UserService extends ServiceBase {
    static getUserDetails(): Promise<ApiIResult<UserApiResponse>> {
        return this.get(APIEndpoints.GET_USER, UserSchema);
    }

    static getUserById(userId: string): Promise<ApiIResult<string>> {
        const url = `${APIEndpoints.GET_USER_BY_ID}/${userId}`;
        return this.get(url, stringRequired);
    }

    static createUser(userData: UserSubmitParams): Promise<ApiIResult<string>> {
        return this.post(
            APIEndpoints.CREATE_USER,
            userData,
            stringRequired,
        );
    }

    static updateUser(userData: UserParams): Promise<ApiIResult<string>> {
        const url = `${APIEndpoints.GET_USER_BY_ID}/${userData.id}`;
        return this.put(
            url,
            userData,
            stringRequired,
        );
    }

    static deleteUser(userId: string): Promise<ApiIResult<string>> {
        const url = `${APIEndpoints.DELETE_USER}/${userId}`;
        return this.post(
            url,
            {},
            stringRequired,
        );
    }
}