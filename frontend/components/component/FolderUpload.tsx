"use client"

import React, { useCallback, useRef, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { CategorizedFile, Convertedfile, FileUploadProps, FolderSummary } from '@/types/upload'
import { FolderUp, Loader2, UploadCloud } from 'lucide-react'
import { toast } from 'sonner'
import { useUploadandConvertImageMutation } from '@/services/conversionApi'
import DownloadedFile from './DownloadedFile'
import ProcessLoading from './ProcessLoading'
import JSZip from 'jszip'
import { categorizeFiles, traverseFiletTree } from '@/lib/folder-utils'


const FolderUpload = ({
    title = 'Submit Your Folder',
    description = 'Attach supporting documents to complete your submission.',
    maxSizeMB = 30,
}: FileUploadProps) => {
    const [isDragging, setIsDragging] = useState(false)
    const [summary, setSummary] = useState<FolderSummary | null>(null)
    const [categorized, setCategorized] = useState<CategorizedFile[]>([])
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploadAndConvertImage] = useUploadandConvertImageMutation();
    const [resultData, SetresultData] = useState<Convertedfile[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingProgress, setProcessingProgress] = useState({ current: 0, total: 0 });

    const processedFiles = (files: File[]) => {
        const { categorized, summary } = categorizeFiles(files); // typo fix
        if (summary.totalsize > maxSizeMB * 1024 * 1024) return toast(`File size exceeds the limit of ${maxSizeMB}MB. Please try again.`);

        if (summary.totalfiles === 0) {
            toast("No files found in the folder. Please try again.");
            return
        }
        setCategorized(categorized);
        setSummary(summary);
    }

    const handleBrowse = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            processedFiles(Array.from(e.target.files))
        }
        e.target.value = ''
    }

    const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)

        const items = e.dataTransfer.items
        if (!items) return

        const entries = Array.from(items)
            .map((item) => item.webkitGetAsEntry())
            .filter((entry): entry is FileSystemEntry => entry !== null)

        const filesNested = await Promise.all(entries.map((entry) => traverseFiletTree(entry)))
        processedFiles(filesNested.flat())
    }, [])

    const handleSubmit = async () => {
        const toConvert = categorized.filter((f) => f.type === 'jpeg' || f.type === 'png')
        const passthrough = categorized.filter((f) => f.type !== 'jpeg' && f.type !== 'png')

        if (toConvert.length === 0 && passthrough.length === 0) {
            toast("No files found in the folder. Please try again.");
            return
        }

        setIsProcessing(true)
        setProcessingProgress({ current: 0, total: toConvert.length })
        const converted: Convertedfile[] = []

        try {
            if (toConvert.length > 0) {
                await Promise.all(
                    toConvert.map(async (c) => {
                        const formData = new FormData();
                        const pathMap: Record<string, string> = {
                            [c.file.name]: c.relativePath
                        }
                        formData.append('files', c.file)
                        formData.append('pathMap', JSON.stringify(pathMap))
                        const result = await uploadAndConvertImage(formData).unwrap();
                        if (result?.data?.[0]) {
                            converted.push(result.data[0])
                        }
                        setProcessingProgress((prev) => ({
                            ...prev,
                            current: prev.current + 1
                        }))
                    })
                )
            }

            const passthroughData: Convertedfile[] = await Promise.all(
                passthrough.map(async (c) => {
                    const buffer = await c.file.arrayBuffer()
                    const base64 = btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''))
                    return {
                        name: c.file.name,
                        base64,
                        mimeType: c.file.type,
                        size: c.file.size,
                        relativePath: c.relativePath
                    }
                })
            )

            SetresultData([...converted, ...passthroughData])
            toast.success(`Processed: ${toConvert.length} converted, ${passthrough.length} skipped (already optimized).`)
        } catch (error) {
            console.error('Folder upload error:', error)
            toast.error('Something went wrong during folder processing.')
        } finally {
            setIsProcessing(false)
        }
    }

    const clearDownload = () => {
        if (resultData.length > 0) {
            SetresultData([])
        }
    }

    const downloadZip = async () => {
        const zip = new JSZip();
        const folder = zip.folder("images");

        resultData.forEach((file: Convertedfile) => {
            const pathZip = file.relativePath || file.name
            zip.file(pathZip, file.base64, { base64: true })
        })

        const zipBlob = await zip.generateAsync({ type: "blob" })
        const url = URL.createObjectURL(zipBlob)

        const link = document.createElement('a')
        link.href = url
        link.download = "images.zip"
        link.click()

        URL.revokeObjectURL(url)
    }

    return (
        <Card className="mx-auto w-full shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_2px_-1px_rgba(0,0,0,0.06),0px_2px_4px_0px_rgba(0,0,0,0.04)] ring-0">
            <CardHeader>
                <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-foreground text-base leading-snug font-semibold tracking-tight">
                            {title}
                        </h2>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex transition-all duration-500 flex-col gap-4">
                <div onDrop={handleDrop} onDragLeave={() => setIsDragging(false)}
                    onDragOver={(e) => {
                        e.preventDefault()
                        setIsDragging(true)
                    }}
                    onClick={() => inputRef.current?.click()}
                    className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-8 py-12 text-center transition-colors ${isDragging
                        ? 'border-primary bg-primary/5'
                        : 'border-muted-foreground/25 hover:border-muted-foreground/40'
                        }`}>
                    <FolderUp className="text-muted-foreground h-8 w-8" />
                    <p className="text-sm font-medium">Drag & drop a folder here, or click to browse</p>
                    <input ref={inputRef} type="file" // @ts-ignore - webkitdirectory not in default TS types
                        webkitdirectory=""
                        directory=""
                        multiple className="hidden" onChange={handleBrowse} />
                </div>

                {summary && (
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Total: {summary.totalfiles} files ({(summary.totalsize / 1024 / 1024).toFixed(1)}MB)</Badge>
                        {summary.jpeg > 0 && <Badge>{summary.jpeg} JPEG</Badge>}
                        {summary.png > 0 && <Badge>{summary.png} PNG</Badge>}
                        {summary.svg > 0 && <Badge variant="outline">{summary.svg} SVG (skip)</Badge>}
                        {summary.webp > 0 && <Badge variant="outline">{summary.webp} WebP (skip)</Badge>}
                        {summary.other > 0 && <Badge variant="destructive">{summary.other} unsupported</Badge>}
                    </div>
                )}

                {/* results-data */}
                {
                    isProcessing ? (
                        <ProcessLoading 
                            current={processingProgress.current} 
                            total={processingProgress.total} 
                        />
                    ) : (
                        <>
                            {resultData.length > 0 && <DownloadedFile data={resultData} />}
                        </>
                    )
                }

            </CardContent>
            <CardFooter className='flex justify-end items-center gap-2'>
                {
                    resultData.length > 1 && (
                        <Button size="lg" variant="outline" onClick={downloadZip}>
                            Download All
                        </Button>
                    )
                }

                {
                    resultData.length > 0 && (
                        <Button size="lg" variant="destructive" onClick={clearDownload}>
                            Clear All
                        </Button>
                    )
                }

                <Button size="lg" variant="default" disabled={!!isProcessing || !summary} onClick={handleSubmit}>
                    {
                        isProcessing ? (
                            <><Loader2 className="mr-1 h-4 w-4 animate-spin" /> Processing</>
                        ) : (
                            <>
                                <UploadCloud className="mr-1 h-4 w-4" /> Submit
                            </>
                        )
                    }

                </Button>
            </CardFooter>
        </Card>
    )
}

export default FolderUpload
