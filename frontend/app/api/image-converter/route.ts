import { redisConnection } from "@/lib/redis";
import { imageQueue } from "@/workers/queue";
import { QueueEvents } from "bullmq";
import { NextResponse, NextRequest } from "next/server"
import sharp from "sharp"


const queuedEvents = new QueueEvents("image-conversion", { connection: redisConnection });


export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const files = formData.getAll("files") as File[];

        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: 'No files provided for coversion.' },
                { status: 400 }
            )
        }

        const processedFile = await Promise.all(
            files.map(async (file) => {
                const arrayBuffer = await file.arrayBuffer();

                const job = await imageQueue.add("image-conversion", {
                    filename: file.name,
                    bufferBase64: Buffer.from(arrayBuffer).toString("base64"),
                })

                const result = await job.waitUntilFinished(queuedEvents);

                return {
                    jobId: job.id,
                    name: result.name,
                    mimeType: result.mimeType,
                    base64: result.base64,
                    size: result.size,
                }
            })
        );

        return NextResponse.json({
            success: true,
            message: `Successfully Converted ${files.length} file(s) to WebP.`,
            data: processedFile
        }, { status: 200 })
    } catch (error) {
        console.error("Conversion API Error:", error);
        return NextResponse.json({ error: 'Something went wrong during conversion.' }, { status: 500 })
    }
}