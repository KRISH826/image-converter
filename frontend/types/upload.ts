export type FileStatus = 'queued' | 'uploading' | 'done' | 'error';

export interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: FileStatus;
  preview?: string;
  error?: string;
}

export interface FileUploadProps {
  title?: string;
  description?: string;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedLabel?: string;
  submitLabel?: string;
  cancelLabel?: string;
  onSubmit?: (files: UploadedFile[]) => void;
  onCancel?: () => void;
}

export interface Convertedfile {
  name: string
  base64: string
  mimeType: string
  size: number
  relativePath?: string
}

export interface CategorizedFile {
  relativePath: string;
  file: File
  path: string
  type: 'jpeg' | 'png' | 'webp' | 'svg' | 'webp' | 'other'
}

export interface FolderSummary {
  totalfiles: number
  totalsize: number
  jpeg: number
  png: number
  svg: number
  webp: number
  other: number
} 

