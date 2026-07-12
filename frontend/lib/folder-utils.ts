import { CategorizedFile, FolderSummary } from "@/types/upload";

export const getFileType = (file: File): CategorizedFile['type'] => {
    const name = file.name.toLowerCase();
    if (file.type === 'image/jpeg' || name.endsWith('.jpg') || name.endsWith('.jpeg')) return 'jpeg'
    if (file.type === 'image/png' || name.endsWith('.png')) return 'png'
    if (file.type === 'image/webp' || name.endsWith('.webp')) return 'webp'
    if (file.type === 'image/svg+xml' || name.endsWith('.svg')) return 'svg'
    return "other"
}

export const traverseFiletTree = async (item: FileSystemEntry, path = ''): Promise<File[]> => {
    return new Promise((resolve) => {
        if (item.isFile) {
            (item as FileSystemFileEntry).file((file) => {
                // relativePath manually attach karo kyunki drag-drop files mein webkitRelativePath nahi hota
                Object.defineProperty(file, 'relativePath', {
                    value: path + file.name,
                    writable: false,
                })
                resolve([file])
            })
        } else if (item.isDirectory) {
            const dirReader = (item as FileSystemDirectoryEntry).createReader()
            dirReader.readEntries(async (entries) => {
                const files = await Promise.all(
                    entries.map((entry) => traverseFiletTree(entry, path + item.name + '/'))
                )
                resolve(files.flat())
            }

            )
        }
        else {
            resolve([])
        }
    })
}

export const categorizeFiles = (files: File[]): {categorized: CategorizedFile[], summary: FolderSummary} => {
    const summary: FolderSummary = {totalfiles: 0, totalsize: 0, jpeg: 0, png: 0, svg: 0, other: 0}

    const categorized = files.map((file) => {
        const type = getFileType(file)
        summary.totalfiles++
        summary.totalsize++
        if (type === 'webp') {
            summary.other++
        } else {
            summary[type]++
        }

        return {
            file,
            relativePath: (file as any).relativePath || (file as any).webkitRelativePath || file.name,
            type
        }
    })
    return {categorized, summary}
}