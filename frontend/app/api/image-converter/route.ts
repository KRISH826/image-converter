import { redisConnection } from "@/lib/redis";
import { imageQueue } from "@/workers/queue";
import { QueueEvents } from "bullmq";
import { unlink, writeFile } from "fs/promises";
import { NextResponse, NextRequest } from "next/server"
import path from "path";
import os from "os";


const queuedEvents = new QueueEvents("image-conversion", { connection: redisConnection });
queuedEvents.setMaxListeners(70); // 0 = unlimited, warning gayab

export async function POST(request: NextRequest) {
    const cleanupPaths: string[] = [];
    try {
        const formData = await request.formData();
        const files = formData.getAll("files") as File[];
        const pathMapRaw = formData.get('pathMap') as string
        const pathMap: Record<string, string> = pathMapRaw ? JSON.parse(pathMapRaw) : {}

        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: 'No files provided for coversion.' },
                { status: 400 }
            )
        }

        const processedFile = await Promise.all(
            files.map(async (file) => {
                const arrayBuffer = await file.arrayBuffer();

                const tempPath = path.join(
                    os.tmpdir(),
                    `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${file.name}`
                );
                await writeFile(tempPath, Buffer.from(arrayBuffer));
                cleanupPaths.push(tempPath);

                const job = await imageQueue.add("image-conversion", {
                    filename: file.name,
                    filePath: tempPath,
                    relativePath: pathMap[file.name] || file.name
                })

                const result = await job.waitUntilFinished(queuedEvents);
                cleanupPaths.push(result.outputPath);

                return {
                    jobId: job.id,
                    name: result.name,
                    mimeType: result.mimeType,
                    base64: result.base64,
                    size: result.size,
                    relativePath: result.relativePath
                }
            })
        );

         // cleanup — input aur output dono temp files hata do
        await Promise.all(cleanupPaths.map((p) => unlink(p).catch(() => {})));

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