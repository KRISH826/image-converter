import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
        headers.set('Content-Type', 'application/json')
        if (typeof window !== 'undefined') {
            const anonymousId = localStorage.getItem('anon_client_id');
            if (anonymousId) {
                headers.set("x-anonymous-id", anonymousId);
            }
        }

        return headers
    }
})

const baseQueryWithGlobalErrorHandler: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);

    if (result.error) {
        console.error("========== RTK ERROR ==========");
        console.error("Status:", result.error.status);
        console.error("Error Object:", result.error);
        console.error("Error Data:", result.error.data);
        console.error("Args:", args);
    }

    return result
}

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: baseQueryWithGlobalErrorHandler,
    tagTypes: ["Images", "QueuedStatus"],
    endpoints: () => ({}),
})
