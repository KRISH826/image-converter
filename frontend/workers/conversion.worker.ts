import { Worker, Job } from "bullmq"
import sharp from "sharp"
import { redisConnection } from "@/lib/redis"

interface conversionDto {
    filename: string
    bufferBase64: string
}

export const conversionImageWorker = () => {
    return new Worker(
        "image-conversion",
        async (job: Job<conversionDto>) => {
            const { filename, bufferBase64 } = job.data;
            const buffer = Buffer.from(bufferBase64, 'base64');

            const webpBuffer = await sharp(buffer)
                .resize({
                    width: 1920,
                    withoutEnlargement: true,
                    fit: 'inside'
                }).webp({
                    quality: 30,
                    effort: 4
                }).toBuffer()

            const originalName = filename.substring(0, filename.lastIndexOf('.')) || filename;
            return {
                name: `${originalName}.webp`,
                base64: webpBuffer.toString("base64"),
                mimeType: "image/webp",
                size: webpBuffer.length,
            }
        },
        {
            connection: redisConnection,
            concurrency: 3
        }
    )
}