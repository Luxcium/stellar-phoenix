import prisma from '@/lib/prisma';
import { createHash } from 'crypto';
import ExifReader from 'exifreader';
import { readFile } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { ImageProcessingResult, ProcessImageJob } from '../types';

const processImage = async (job: ProcessImageJob): Promise<ImageProcessingResult> => {
    const startTime = Date.now();

    try {
        const {
            filePath,
            fileName,
            options = {
                generateThumbnail: true,
                extractMetadata: true,
                computeHash: true,
                optimizeImage: true,
            },
        } = job;

        // Read the image file
        const imageBuffer = await readFile(filePath);

        // Initialize Sharp instance
        const image = sharp(imageBuffer);
        const metadata = await image.metadata();

        // Generate hash if requested
        const hash = options.computeHash
            ? createHash('sha256').update(imageBuffer).digest('hex')
            : '';

        // Process thumbnail if requested
        let thumbnailPath = '';
        if (options.generateThumbnail) {
            const thumbnailName = `thumb_${path.parse(fileName).name}.webp`;
            thumbnailPath = path.join(process.env.THUMBNAIL_PATH || 'storage/thumbnails', thumbnailName);

            await image
                .resize(300, 300, {
                    fit: 'inside',
                    withoutEnlargement: true,
                })
                .webp({ quality: 80 })
                .toFile(thumbnailPath);
        }

        // Extract EXIF data if requested
        let exifData = {};
        if (options.extractMetadata) {
            try {
                exifData = await ExifReader.load(imageBuffer);
            } catch (error) {
                console.warn('Failed to extract EXIF data:', error);
            }
        }

        // Create database entries
        const basicInfo = await prisma.basicImageInfo.create({
            data: {
                thumbnailPath,
                filePath,
                fileSize: imageBuffer.length,
                hash,
                metadata: {
                    create: {
                        width: metadata.width || 0,
                        height: metadata.height || 0,
                        format: metadata.format || 'unknown',
                        colorSpace: metadata.space || 'unknown',
                    },
                },
            },
            include: {
                metadata: true,
            },
        });

        return {
            success: true,
            basicInfo,
            metadata: basicInfo.metadata!,
            processingTime: Date.now() - startTime,
        };

    } catch (error) {
        console.error('Image processing error:', error);
        return {
            success: false,
            error: {
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                code: 'PROCESSING_ERROR',
                details: error,
            },
            processingTime: Date.now() - startTime,
        };
    }
};

// Utility functions
const generateThumbnail = async (
    imageBuffer: Buffer,
    size: { width: number; height: number } = { width: 300, height: 300 }
): Promise<Buffer> => {
    return await sharp(imageBuffer)
        .resize(size.width, size.height, {
            fit: 'inside',
            withoutEnlargement: true,
        })
        .webp({ quality: 80 })
        .toBuffer();
};

const optimizeImage = async (
    imageBuffer: Buffer,
    format: string
): Promise<Buffer> => {
    const image = sharp(imageBuffer);

    switch (format.toLowerCase()) {
        case 'jpeg':
        case 'jpg':
            return await image.jpeg({ quality: 85 }).toBuffer();
        case 'png':
            return await image.png({ quality: 85 }).toBuffer();
        case 'webp':
            return await image.webp({ quality: 85 }).toBuffer();
        default:
            return imageBuffer;
    }
};

const extractMetadata = async (imageBuffer: Buffer) => {
    const metadata = await sharp(imageBuffer).metadata();
    let exifData = {};

    try {
        exifData = await ExifReader.load(imageBuffer);
    } catch (error) {
        console.warn('Failed to extract EXIF data:', error);
    }

    return {
        ...metadata,
        exif: exifData,
    };
};

export {
    extractMetadata, generateThumbnail,
    optimizeImage, processImage
};

