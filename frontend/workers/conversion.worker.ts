import { Worker, Job } from "bullmq"
import sharp from "sharp"
import { redisConnection } from "@/lib/redis"
import path from "path"
import os from "os"
import { readFile, unlink, writeFile } from "fs/promises"

interface conversionDto {
    filename: string
    filePath: string
    relativePath?: string
}

export const conversionImageWorker = () => {
    return new Worker(
        "image-conversion",
        async (job: Job<conversionDto>) => {
            const { filename, filePath, relativePath } = job.data;
            const buffer = await readFile(filePath);

            const webpBuffer = await sharp(buffer)
                .resize({
                    width: 1920,
                    withoutEnlargement: true,
                    fit: 'inside',
                    kernel: 'linear'
                }).webp({
                    quality: 30,
                    effort: 2
                }).toBuffer()

           const safeFilename = path.basename(filename.replace(/\\/g, '/'));
            const originalName = safeFilename.substring(0, safeFilename.lastIndexOf('.')) || safeFilename;
            const outPutName = `${originalName}.webp`;
            const outputPath = path.join(
                os.tmpdir(),
                `out-${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${outPutName}`
            );
            writeFile(outputPath, webpBuffer);
            await unlink(filePath).catch(() => { });
            return {
                name: `${originalName}.webp`,
                mimeType: "image/webp",
                size: webpBuffer.length,
                outputPath,
                relativePath: relativePath
                    ? relativePath.replace(/\.[^/.]+$/, '.webp')
                    : outPutName,
            }
        },
        {
            connection: redisConnection,
            concurrency: 3
        }
    )
}