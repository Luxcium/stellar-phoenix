import path from 'path';
import { z } from 'zod';

// Environment schema validation
const envSchema = z.object({
    // Database
    DATABASE_URL: z.string().url(),

    // Redis
    REDIS_URL: z.string().url(),

    // Application
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().transform(Number).default('3000'),

    // Storage
    STORAGE_PATH: z.string().default('./storage'),
    THUMBNAIL_PATH: z.string().default('./storage/thumbnails'),
    MAX_FILE_SIZE: z.string().transform(Number).default('10485760'), // 10MB
    ALLOWED_MIME_TYPES: z.string().default('image/jpeg,image/png,image/gif,image/webp'),

    // Image Processing
    THUMBNAIL_WIDTH: z.string().transform(Number).default('300'),
    THUMBNAIL_HEIGHT: z.string().transform(Number).default('300'),
    THUMBNAIL_QUALITY: z.string().transform(Number).default('80'),
    MAX_CONCURRENT_PROCESSES: z.string().transform(Number).default('3'),

    // Feature Flags
    ENABLE_IMAGE_OPTIMIZATION: z.string().transform((v) => v === 'true').default('true'),
    ENABLE_EXIF_EXTRACTION: z.string().transform((v) => v === 'true').default('true'),
    ENABLE_DEDUPLICATION: z.string().transform((v) => v === 'true').default('true'),
});

// Parse and validate environment variables
const env = envSchema.parse(process.env);

// Paths configuration
const paths = {
    root: process.cwd(),
    storage: path.resolve(process.cwd(), env.STORAGE_PATH),
    thumbnails: path.resolve(process.cwd(), env.THUMBNAIL_PATH),
};

// Application configuration
const config = {
    env,
    paths,
    isDev: env.NODE_ENV === 'development',
    isProd: env.NODE_ENV === 'production',
    isTest: env.NODE_ENV === 'test',

    // Server configuration
    server: {
        port: env.PORT,
    },

    // Database configuration
    database: {
        url: env.DATABASE_URL,
    },

    // Redis configuration
    redis: {
        url: env.REDIS_URL,
    },

    // Storage configuration
    storage: {
        maxFileSize: env.MAX_FILE_SIZE,
        allowedMimeTypes: env.ALLOWED_MIME_TYPES.split(','),
        paths: paths,
    },

    // Image processing configuration
    imageProcessing: {
        thumbnail: {
            width: env.THUMBNAIL_WIDTH,
            height: env.THUMBNAIL_HEIGHT,
            quality: env.THUMBNAIL_QUALITY,
        },
        maxConcurrentProcesses: env.MAX_CONCURRENT_PROCESSES,
    },

    // Feature flags
    features: {
        imageOptimization: env.ENABLE_IMAGE_OPTIMIZATION,
        exifExtraction: env.ENABLE_EXIF_EXTRACTION,
        deduplication: env.ENABLE_DEDUPLICATION,
    },
} as const;

export type Config = typeof config;
export type Env = typeof env;
export type Paths = typeof paths;

export { config as default, env, paths };
