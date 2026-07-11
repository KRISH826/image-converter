import { NextResponse, NextRequest } from "next/server"
import sharp from "sharp"


export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const files = formData.getAll("files") as File[];

        if(!files || files.length === 0) {
            return NextResponse.json(
                {error: 'No files provided for coversion.'},
                {status: 400}
            )
        }

        const processedFile = await Promise.all(
            files.map(async (file) => {
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                const webpBuffer = await sharp(buffer)
                .resize({
                    width: 1920,
                    withoutEnlargement: true
                })
                .webp({
                    quality: 30,
                    effort: 4
                }).toBuffer();

                const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                const newName = `${originalName}.webp`;

                return {
                    name: newName,
                    base64: webpBuffer.toString('base64'),
                    mimeType: 'image/webp',
                    size: webpBuffer.length
                }
            })
        )

        return NextResponse.json({
            success: true,
            message: `Successfully Converted ${files.length} file(s) to WebP.`,
            data: processedFile
        }, {status: 200})
    } catch (error) {
        console.error("Conversion API Error:", error);
        return NextResponse.json({error: 'Something went wrong during conversion.'}, {status: 500})
    }
}