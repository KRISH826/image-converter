import { baseApi } from "./baseapi";
import { Convertedfile } from "../types/upload";

export interface ImageConversionResponse {
    success: boolean;
    message: string;
    data: Convertedfile[];
}

export const imageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        uploadandConvertImage: builder.mutation<ImageConversionResponse, FormData>({
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