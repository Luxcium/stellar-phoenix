import { PrismaClient } from '@prisma/client';

declare global {
    var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
}

export default prisma;

// Helper types for the Image Data (not stored in database)
export interface ImageData {
    buffer: Buffer;
    analysisResults?: any;
    processingState: 'idle' | 'processing' | 'error';
    dispose(): void;
}

// Utility types for working with images
export type ImageProcessingOptions = {
    generateThumbnail?: boolean;
    thumbnailSize?: { width: number; height: number };
    extractMetadata?: boolean;
    computeHash?: boolean;
};

export type ImageSearchParams = {
    tags?: string[];
    groups?: string[];
    metadata?: Record<string, any>;
    filename?: string;
    dateRange?: {
        start: Date;
        end: Date;
    };
};

// Error types
export class ImageProcessingError extends Error {
    constructor(message: string, public readonly originalError?: Error) {
        super(message);
        this.name = 'ImageProcessingError';
    }
}

export class DatabaseError extends Error {
    constructor(message: string, public readonly originalError?: Error) {
        super(message);
        this.name = 'DatabaseError';
    }
}
