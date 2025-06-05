import { Job, Queue, QueueScheduler, Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { processImage } from './processors/imageProcessor';
import { ImageProcessingResult, ProcessImageJob } from './types';

// Redis connection for BullMQ
const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
});

// Queue names
export const QUEUES = {
    IMAGE_PROCESSING: 'image-processing',
    THUMBNAIL_GENERATION: 'thumbnail-generation',
    METADATA_EXTRACTION: 'metadata-extraction',
    DEDUPLICATION: 'deduplication',
} as const;

// Initialize queues
export const queues = {
    imageProcessing: new Queue<ProcessImageJob, ImageProcessingResult>(QUEUES.IMAGE_PROCESSING, {
        connection,
        defaultJobOptions: {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000,
            },
            removeOnComplete: true,
            removeOnFail: false,
        },
    }),

    thumbnailGeneration: new Queue(QUEUES.THUMBNAIL_GENERATION, {
        connection,
        defaultJobOptions: {
            attempts: 3,
            removeOnComplete: true,
        },
    }),

    metadataExtraction: new Queue(QUEUES.METADATA_EXTRACTION, {
        connection,
        defaultJobOptions: {
            attempts: 2,
            removeOnComplete: true,
        },
    }),

    deduplication: new Queue(QUEUES.DEDUPLICATION, {
        connection,
        defaultJobOptions: {
            attempts: 1,
            removeOnComplete: true,
        },
    }),
};

// Initialize schedulers (for delayed jobs and retries)
export const schedulers = Object.values(QUEUES).map(
    (queueName) => new QueueScheduler(queueName, { connection })
);

// Initialize workers
const workers = {
    imageProcessing: new Worker<ProcessImageJob>(
        QUEUES.IMAGE_PROCESSING,
        async (job: Job<ProcessImageJob>) => {
            return await processImage(job.data);
        },
        {
            connection,
            concurrency: parseInt(process.env.MAX_CONCURRENT_PROCESSES || '3'),
            limiter: {
                max: 10,
                duration: 1000,
            },
        }
    ),

    thumbnailGeneration: new Worker(
        QUEUES.THUMBNAIL_GENERATION,
        async (job) => {
            // Implement thumbnail generation logic
            console.log('Processing thumbnail generation:', job.data);
        },
        { connection }
    ),

    metadataExtraction: new Worker(
        QUEUES.METADATA_EXTRACTION,
        async (job) => {
            // Implement metadata extraction logic
            console.log('Processing metadata extraction:', job.data);
        },
        { connection }
    ),

    deduplication: new Worker(
        QUEUES.DEDUPLICATION,
        async (job) => {
            // Implement deduplication logic
            console.log('Processing deduplication:', job.data);
        },
        { connection }
    ),
};

// Error handling for all workers
Object.values(workers).forEach((worker) => {
    worker.on('completed', (job) => {
        console.log(`Job ${job.id} completed successfully`);
    });

    worker.on('failed', (job, error) => {
        console.error(`Job ${job?.id} failed:`, error);
    });

    worker.on('error', (error) => {
        console.error('Worker error:', error);
    });
});

// Graceful shutdown
const shutdown = async () => {
    console.log('Shutting down queues and workers...');

    // Close all workers
    await Promise.all(Object.values(workers).map((worker) => worker.close()));

    // Close all queues
    await Promise.all(Object.values(queues).map((queue) => queue.close()));

    // Close all schedulers
    await Promise.all(schedulers.map((scheduler) => scheduler.close()));

    // Close Redis connection
    await connection.quit();

    console.log('Shutdown complete');
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export { connection, queues as default, workers };

