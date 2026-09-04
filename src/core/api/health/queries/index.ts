import { baseApi } from "core/api/base.api";
import { STORE_TAGS } from "core/base/const/store";
import { HealthService } from "core/service/health.service";
import { HealthResponse } from "core/base/type/health";

export const HealthApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getHealth: builder.query<HealthResponse, void>({
            queryFn: async () => {
                return HealthService.getHealth();
            },
            providesTags: [STORE_TAGS.HEALTH],
        }),
    })
});

export const {
    useGetHealthQuery,
    useLazyGetHealthQuery,
} = HealthApi;
