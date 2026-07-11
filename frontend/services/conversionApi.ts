import { baseApi } from "./baseapi";

export const imageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        uploadandConvertImage: builder.mutation<any, FormData>({
            query: (formData) => ({
                url: "/image-converter",
                method: "POST",
                body: formData,
                formData: true,
            }),
            invalidatesTags: ['Images'],
        })
    })
})

export const {useUploadandConvertImageMutation} = imageApi