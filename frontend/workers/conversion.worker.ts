import { Worker, Job } from "bullmq";
import sharp from "sharp";
import { redisConnection } from "@/lib/redis";
import path from "path";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";
// IMPORT YOUR QUEUE HERE so we can add delayed cleanup jobs
import { imageQueue } from "@/workers/queue"; 

interface ConversionDto {
    type: "convert";
    filename: string;
    sourceUrl: string;
    sourcePublicId: string;
    relativePath?: string;
}

interface CleanupDto {
    type: "cleanup";
    publicId: string;
}

type JobData = ConversionDto | CleanupDto;

export const conversionImageWorker = () => {
    return new Worker(
        "image-conversion",
        async (job: Job<JobData>) => {
            if (!job.data || typeof job.data !== "object") {
                throw new Error(`Job ${job.id} has no valid data`);
            }

            if (job.data.type === "cleanup") {
                if (!job.data.publicId) {
                    throw new Error(`Cleanup job ${job.id} is missing publicId`);
                }
                await deleteFromCloudinary(job.data.publicId);
                return { deleted: true, publicId: job.data.publicId };
            }

            if (job.data.type !== "convert") {
                throw new Error(`Job ${job.id} has an unsupported type`);
            }

            const { filename, sourceUrl, sourcePublicId, relativePath } = job.data;

            if (!filename || !sourceUrl || !sourcePublicId) {
                throw new Error(`Conversion job ${job.id} is missing file metadata`);
            }

            const response = await fetch(sourceUrl);
            if (!response.ok) {
                throw new Error(`Unable to download source image (${response.status})`);
            }
            const buffer = Buffer.from(await response.arrayBuffer());

            // 2. Convert using Sharp (effort: 1 makes it lighting fast)
            const webpBuffer = await sharp(buffer)
                .resize({ width: 1920, withoutEnlargement: true, fit: 'inside', kernel: 'linear' })
                .webp({ quality: 30, effort: 1 }) 
                .toBuffer();

            // 3. Upload WebP to Cloudinary
            const finalUpload = await uploadBufferToCloudinary(webpBuffer, "converted-webps");

            // 4. INSTANT CLEANUP: Delete original upload immediately (saves space!)
            await deleteFromCloudinary(sourcePublicId).catch(() => {});

            // 5. SCHEDULED CLEANUP: Tell BullMQ to delete the WebP after 15 mins
            await imageQueue.add("cleanup-job", {
                type: "cleanup",
                publicId: finalUpload.public_id
            }, { 
                delay: 15 * 60 * 1000 // 15 minutes in milliseconds
            });

            // 6. Return Data
            const safeFilename = path.basename(filename.replace(/\\/g, '/'));
            const originalName = safeFilename.substring(0, safeFilename.lastIndexOf('.')) || safeFilename;

            return {
                name: `${originalName}.webp`,
                outputUrl: finalUpload.secure_url,
                size: Buffer.byteLength(webpBuffer),
                relativePath: relativePath ? relativePath.replace(/\.[^/.]+$/, '.webp') : `${originalName}.webp`,
            };
        },
        {
            connection: redisConnection,
            concurrency: 2
        }
    );
};
