import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
        headers.set('Content-Type', 'application/json')
        if(typeof window !== 'undefined') {
            const anonymousId = localStorage.getItem('anon_client_id');
            if(anonymousId) {
                headers.set("x-anonymous-id", anonymousId);
            }
        }

        return headers
    }
})

const baseQueryWithGlobalErrorHandler: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);

    if (result.error) {
        const status = result.error.status;
        const errorData = result.error.data;

        console.error(`[API Error] Status: ${status} | Path: ${typeof args === 'string' ? args : args.url}`);

        // You can intercept specific server crashes here (e.g., 500 Internal Server Errors)
        if (status === 500) {
            // Log to services like Sentry, LogRocket, etc.
            console.error(
                'Critical server failure:',
                (errorData as { message?: string })?.message || 'No details provided'
            );
        }
    }

    return result
}

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: baseQueryWithGlobalErrorHandler,
    tagTypes: ["Images", "QueuedStatus"],
    endpoints: () => ({}),
})