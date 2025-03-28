'use client';

import config from '@/config';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface UploadProgress {
    fileName: string;
    progress: number;
    status: 'uploading' | 'processing' | 'complete' | 'error';
    error?: string;
}

export default function ImageUploadZone() {
    const [uploads, setUploads] = useState<UploadProgress[]>([]);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const newUploads = acceptedFiles.map((file) => ({
            fileName: file.name,
            progress: 0,
            status: 'uploading' as const,
        }));

        setUploads((prev) => [...prev, ...newUploads]);

        acceptedFiles.forEach(async (file, index) => {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('/api/images/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Upload failed');
                }

                // Update progress to complete
                setUploads((prev) =>
                    prev.map((upload, i) =>
                        i === index
                            ? { ...upload, progress: 100, status: 'complete' as const }
                            : upload
                    )
                );
            } catch (error) {
                // Update progress to error
                setUploads((prev) =>
                    prev.map((upload, i) =>
                        i === index
                            ? {
                                ...upload,
                                progress: 0,
                                status: 'error' as const,
                                error: error instanceof Error ? error.message : 'Upload failed',
                            }
                            : upload
                    )
                );
            }
        });
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': config.storage.allowedMimeTypes,
        },
        maxSize: config.storage.maxFileSize,
        multiple: true,
    });

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
                    }`}
            >
                <input {...getInputProps()} />
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {isDragActive
                        ? 'Drop the files here'
                        : 'Drag and drop images here, or click to select files'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Supported formats: JPG, PNG, GIF, WEBP (up to {config.storage.maxFileSize / 1024 / 1024}MB)
                </p>
            </div>

            {/* Upload progress */}
            {uploads.length > 0 && (
                <div className="space-y-2">
                    {uploads.map((upload, index) => {
                        // Define CSS variables for dynamic styling
                        const progressBarClass = upload.status === 'error'
                            ? 'progress-bar-error'
                            : upload.status === 'complete'
                                ? 'progress-bar-complete'
                                : 'progress-bar-uploading';

                        // Create a class name with the progress percentage
                        const widthClass = `w-[${upload.progress}%]`;

                        return (
                            <div
                                key={`${upload.fileName}-${index}`}
                                className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm"
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm truncate">{upload.fileName}</span>
                                    <span className="text-xs text-gray-500">
                                        {upload.status === 'complete'
                                            ? 'Complete'
                                            : upload.status === 'error'
                                                ? 'Error'
                                                : `${upload.progress}%`}
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className={`${progressBarClass} ${widthClass}`}
                                    />
                                </div>
                                {upload.error && (
                                    <p className="text-xs text-red-500 mt-1">{upload.error}</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
