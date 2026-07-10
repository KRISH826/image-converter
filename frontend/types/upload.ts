export type FileStatus = 'queued' | 'uploading' | 'done' | 'error';

export interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: FileStatus;
}

export interface FileUploadProps {
    title: string;
    description: string;
    maxFiles: number;
    maxSizeMB: number;
    acceptedLabel: string;
    submitLabel: string;
    cancelLabel: string;
    onSubmit: (files: UploadedFile[]) => void;
    onCancel: () => void;
}