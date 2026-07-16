import { NextResponse, NextRequest } from "next/server";
import { imageQueue } from "@/workers/queue";
import { QueueEvents } from "bullmq";
import { redisConnection } from "@/lib/redis";
import { uploadBufferToCloudinary } from "@/lib/cloudinary";


declare global {
    var queueEvents: QueueEvents | undefined;
}

export const queuedEvents =
    global.queueEvents ??
    new QueueEvents("image-conversion", {
        connection: redisConnection,
    });

if (!global.queueEvents) {
    global.queueEvents = queuedEvents;
}
queuedEvents.setMaxListeners(0);

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const files = (formData.getAll("files") as File[]).filter(
            (f) => f instanceof File && f.name && f.name.trim() !== '' && f.size > 0
        );
        const pathMapRaw = formData.get('pathMap') as string;
        const pathMap: Record<string, string> = pathMapRaw ? JSON.parse(pathMapRaw) : {};

        if (files.length === 0) {
            return NextResponse.json({ error: 'No files provided for conversion.' }, { status: 400 });
        }

        const processedFiles = await Promise.all(
            files.map(async (file) => {
                const buffer = Buffer.from(await file.arrayBuffer());

                // 1. Upload original file directly to Cloudinary
                const uploadResult = await uploadBufferToCloudinary(buffer, "temp-originals");

                if (!uploadResult?.secure_url || !uploadResult?.public_id) {
                    throw new Error(`Cloudinary did not return metadata for ${file.name}`);
                }

                // 2. Add to BullMQ Queue
                const job = await imageQueue.add("image-conversion", {
                    type: "convert",
                    filename: file.name,
                    sourceUrl: uploadResult.secure_url,
                    sourcePublicId: uploadResult.public_id,
                    relativePath: pathMap[file.name] || file.name
                });

                // 3. Wait for worker to finish and return the URL
                const result = await job.waitUntilFinished(queuedEvents);

                return {
                    jobId: job.id,
                    name: result.name,
                    mimeType: "image/webp",
                    url: result.outputUrl, // Send Cloudinary URL to browser instead of massive Base64
                    size: result.size,
                    relativePath: result.relativePath
                };
            })
        );

        return NextResponse.json({
            success: true,
            message: `Successfully Converted ${files.length} file(s) to WebP. Links valid for 15 minutes!`,
            data: processedFiles
        }, { status: 200 });

    } catch (error: any) {
        console.error("Conversion API Error:", error?.stack || error);
        return NextResponse.json(
            { error: error?.message || 'Something went wrong during conversion.' },
            { status: 500 }
        );
    }
}
