import { baseApi } from 'core/api/base.api';
import { STORE_TAGS } from 'core/base/const/store';
import { AuthApiService } from 'core/service/auth.service';
import { CurrentUserApiResponse } from 'core/base/type/auth';

const authQueriesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCurrentUser: builder.query<CurrentUserApiResponse, void>({
            queryFn: async () => {
                return AuthApiService.getCurrentUser();
            },
            providesTags: [STORE_TAGS.USER],
        }),
    }),
});

export const { useGetCurrentUserQuery, useLazyGetCurrentUserQuery } = authQueriesApi;
