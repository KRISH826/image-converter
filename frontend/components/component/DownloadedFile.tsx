import { Convertedfile, UploadedFile } from '@/types/upload'
import { DownloadIcon, FileImage } from 'lucide-react'
import { motion } from "motion/react"

type props = {
    data: Convertedfile[]
}

const DownloadedFile = ({data}: props) => {
    if(!Array.isArray(data) || data.length === 0) return null
    const downloadFile = (file: Convertedfile) => {
       const link = document.createElement('a')
        link.href = `data:${file.mimeType};base64,${file.base64}`
        link.download = file.name
        link.click()
    }
    return (
        <div className='flex flex-col gap-2.5'>
            {data.map((file, index) => (
                <motion.div
                    key={`${file.name}-${index}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-3 rounded-md border p-2"
                >
                    <img
                        src={`data:${file.mimeType};base64,${file.base64}`}
                        alt={file.name}
                        className="h-10 w-10 rounded object-cover"
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm font-medium">{file.name}</span>
                        <span className="text-muted-foreground text-xs">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => downloadFile(file)}
                        className="text-muted-foreground hover:text-foreground ml-auto shrink-0 rounded-sm p-1 transition-colors"
                        aria-label={`Download ${file.name}`}
                    >
                        <DownloadIcon className="h-4 w-4" />
                    </button>
                </motion.div>
            ))}
        </div>
    )
}

export default DownloadedFile