import { baseApi } from "core/api/base.api";
import { UserService } from "core/service/user.service";
import { UserApiResponse } from "core/base/type/user";

export const UserApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query<UserApiResponse, void>({
            queryFn: async () => {
                return UserService.getUserDetails();
            },
            providesTags: ['User'],
        }),
        getUserById: builder.query<string, string>({
            queryFn: async (userId) => {
                return UserService.getUserById(userId);
            },
            providesTags: ['User'],
        }),
    })
});

export const {
    useGetUsersQuery,
    useLazyGetUsersQuery,
    useGetUserByIdQuery,
    useLazyGetUserByIdQuery
} = UserApi;