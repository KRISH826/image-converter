"use client"

import React, { useCallback, useRef, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { FileStatus, FileUploadProps, UploadedFile } from '@/types/upload'
import { FileImage, Loader2, UploadCloud, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { toast } from 'sonner'
import { useUploadandConvertImageMutation } from '@/services/conversionApi'
import DownloadedFile from './DownloadedFile'

const title = 'Submit Your Report'
const description = 'Attach supporting documents to complete your submission.'
const maxFiles = 6
const maxSizeMB = 25
const files = 20
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png']

const UploadFile = ({
    title = 'Submit Your Report',
    description = 'Attach supporting documents to complete your submission.',
    maxFiles = 20,
    maxSizeMB = 150,
    acceptedLabel = 'JPG or PNG, up to',
    submitLabel = 'Convert to WebP',
    cancelLabel = 'Clear all',
    onSubmit,
    onCancel,
}: FileUploadProps) => {
    const [files, setFiles] = useState<UploadedFile[]>([])
    const [isDragging, setIsDragging] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploadAndConvertImage, { isLoading }] = useUploadandConvertImageMutation();
    const [resultData, SetresultData] = useState([]);


    const validateFiles = (file: File) => {
        if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
            const message = 'File type not supported. Only JPG and PNG are allowed.'
            toast(message)
            return message
        }
        if (file.size > maxSizeMB * 1024 * 1024) {
            const message = `File size exceeds the limit of ${maxSizeMB}MB.`
            toast(message)
            return message
        }
        return undefined
    }
    const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`


    const addFiles = useCallback(
        (fileList: FileList | File[]) => {
            const incoming = Array.from(fileList)

            setFiles((prev) => {
                const availableSlots = maxFiles - prev.length
                if (availableSlots <= 0) return prev

                const next: UploadedFile[] = incoming
                    .slice(0, availableSlots)
                    .map((file) => {
                        const fileError = validateFiles(file)
                        return {
                            id: generateId(),
                            file,
                            progress: 0,
                            status: (fileError ? 'error' : 'queued') as FileStatus,
                            preview: URL.createObjectURL(file),
                            error: fileError,
                        }
                    })

                return [...prev, ...next]
            })
        },
        [maxFiles, maxSizeMB]
    )

    const handleBrowse = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            addFiles(e.target.files)
        }
        e.target.value = ''
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files?.length) {
            addFiles(e.dataTransfer.files)
        }
    }

    const removeFile = (id: string) => {
        setFiles((prev) => {
            const target = prev.find((file) => file.id === id)
            if (target?.preview) {
                URL.revokeObjectURL(target.preview)
            }
            return prev.filter((file) => file.id !== id)
        })
    }

    const clearAll = () => {
        files.forEach((file) => {
            file.preview && URL.revokeObjectURL(file.preview)
        })
        setFiles([])
        onCancel && onCancel()
    }

    const handleSubmit = async () => {
        const validFiles = files.filter((file) => file.status !== 'error')
        if (validFiles.length === 0) return
        const formData = new FormData();
        validFiles.forEach((file) => {
            formData.append('files', file.file)
        })
        try {
            const result = await uploadAndConvertImage(formData).unwrap();
            toast.success("all DOne")
            SetresultData(result.data)
            if(onSubmit) onSubmit(result)
            clearAll()
        }
        catch (error: any) {
            console.error('Upload component error:', error)
            toast('Something went wrong. Please try again.')
        }
    }

    const clearDownload = () => {
        if(resultData.length > 0) {
            SetresultData([])
        }
    }

    const validCount = files.filter((f) => f.status !== 'error').length
    const isFull = files.length >= maxFiles


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
                    <Badge variant="secondary" className="shrink-0 tabular-nums">
                        {validCount} / {maxFiles}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="flex transition-all duration-500 flex-col gap-4">
                <div onDrop={handleDrop} onDragLeave={() => setIsDragging(false)}
                    onDragOver={(e) => {
                        e.preventDefault()
                        setIsDragging(true)
                    }}
                    onClick={() => inputRef.current?.click()}
                    className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition-colors ${isDragging
                        ? 'border-primary bg-primary/5'
                        : 'border-muted-foreground/25 hover:border-muted-foreground/40'
                        }`}>
                    <UploadCloud className="text-muted-foreground h-8 w-8" />
                    <p className="text-sm font-medium">
                        Drag & drop files here, or click to browse
                    </p>
                    <p className="text-muted-foreground text-xs">
                        {acceptedLabel} {maxSizeMB}MB each
                    </p>
                    <input ref={inputRef} type="file" accept="image/jpeg,image/png" multiple className="hidden" onChange={handleBrowse} />
                </div>

                {
                    files.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <AnimatePresence initial={false}>
                                {files.map((file) => (
                                    <motion.div
                                        key={file.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex items-center gap-3 rounded-md border p-2"
                                    >
                                        {file.preview ? (
                                            <img
                                                src={file.preview}
                                                alt={file.file.name}
                                                className="h-10 w-10 rounded object-cover"
                                            />
                                        ) : (
                                            <FileImage className="text-muted-foreground h-10 w-10" />
                                        )}

                                        <div className="flex min-w-0 flex-1 flex-col">
                                            <span className="truncate text-sm font-medium">
                                                {file.file.name}
                                            </span>
                                            <span className="text-muted-foreground text-xs">
                                                {(file.file.size / (1024 * 1024)).toFixed(2)} MB
                                            </span>
                                            {file.error && (
                                                <span className="text-xs text-red-500">{file.error}</span>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => removeFile(file.id)}
                                            className="text-muted-foreground hover:text-foreground ml-auto shrink-0 rounded-sm p-1 transition-colors"
                                            aria-label={`Remove ${file.file.name}`}
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )
                }

                {/* results-data */}
                {resultData.length > 0 && <DownloadedFile data={resultData} />}

            </CardContent>
            <CardFooter className='flex justify-end items-center gap-2'>
                {
                    resultData.length > 0 && (
                        <Button size="lg" variant="outline" onClick={clearDownload}>
                            Clear All
                        </Button>
                    )
                }
                <Button size="lg" variant="default" disabled={!!isLoading || validCount === 0} onClick={handleSubmit}>
                    {
                        isLoading ? (
                            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                        ) : (
                            <UploadCloud className="mr-1 h-4 w-4" />
                        )
                    }
                    Submit
                </Button>
            </CardFooter>
        </Card>
    )
}

export default UploadFile
