import { BasicImageInfo, ImageMetadata } from '@prisma/client';

export interface ProcessImageJob {
    filePath: string;
    fileName: string;
    mimeType: string;
    size: number;
    options?: {
        generateThumbnail?: boolean;
        thumbnailSize?: {
            width: number;
            height: number;
        };
        extractMetadata?: boolean;
        computeHash?: boolean;
        optimizeImage?: boolean;
    };
}

export interface ImageProcessingResult {
    success: boolean;
    basicInfo?: BasicImageInfo;
    metadata?: ImageMetadata;
    error?: {
        message: string;
        code: string;
        details?: unknown;
    };
    processingTime?: number;
}

export interface ThumbnailGenerationJob {
    imageId: string;
    sourcePath: string;
    targetPath: string;
    width: number;
    height: number;
    quality?: number;
}

export interface MetadataExtractionJob {
    imageId: string;
    filePath: string;
}

export interface DeduplicationJob {
    imageId: string;
    hash: string;
}

export type JobError = {
    message: string;
    code: string;
    details?: unknown;
};

export type QueueJobStatus = {
    jobId: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress?: number;
    error?: JobError;
    result?: unknown;
};

export interface QueueEventCallbacks {
    onProgress?: (progress: number) => void;
    onCompleted?: (result: unknown) => void;
    onFailed?: (error: JobError) => void;
}

export type JobTypes = {
    'image-processing': ProcessImageJob;
    'thumbnail-generation': ThumbnailGenerationJob;
    'metadata-extraction': MetadataExtractionJob;
    'deduplication': DeduplicationJob;
};

export type JobResults = {
    'image-processing': ImageProcessingResult;
    'thumbnail-generation': { success: boolean; path: string };
    'metadata-extraction': { success: boolean; metadata: Record<string, unknown> };
    'deduplication': { success: boolean; duplicates: string[] };
};
