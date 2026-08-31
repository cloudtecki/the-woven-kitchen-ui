import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { STORE_TAGS } from 'core/base/const/store';

// Define a service using a base URL and expected endpoints
export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery(),
    endpoints: () => ({
        // end points are to be injected later dynamically
    }),
    keepUnusedDataFor: 0,
    tagTypes: [...Object.values(STORE_TAGS)],
});

export const { middleware, reducer, reducerPath } = baseApi;