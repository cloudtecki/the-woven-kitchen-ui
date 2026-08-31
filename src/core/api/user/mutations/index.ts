import { baseApi } from "core/api/base.api";
import { STORE_TAGS } from "core/base/const/store";
import { UserParams } from "core/base/type/user";
import { UserService } from "core/service/user.service";


export const userMutationsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        updateUser: builder.mutation<
            string,
            UserParams
        >({
            queryFn: async (payload) => {
                return UserService.updateUser(payload);
            },
            invalidatesTags: [STORE_TAGS.USER],
        }),

        CreateUser: builder.mutation<
            string,
            UserParams
        >({
            queryFn: async (payload) => {
                return UserService.createUser(payload);
            },
            invalidatesTags: [STORE_TAGS.USER],
        }),

        DeleteUser: builder.mutation<
            string,
            string
        >({
            queryFn: async (userId) => {
                return UserService.deleteUser(userId);
            },
            invalidatesTags: [STORE_TAGS.USER],
        }),
    })
});

export const {
    useUpdateUserMutation,
    useCreateUserMutation,
    useDeleteUserMutation,
} = userMutationsApi;