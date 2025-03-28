import config from '@/config';
import { createHash } from 'crypto';
import ExifReader from 'exifreader';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

export interface ProcessOptions {
    generateThumbnail?: boolean;
    extractMetadata?: boolean;
    computeHash?: boolean;
    optimizeImage?: boolean;
    thumbnailSize?: {
        width: number;
        height: number;
    };
}

export interface ProcessingResult {
    thumbnailPath?: string;
    hash?: string;
    metadata?: {
        width: number;
        height: number;
        format: string;
        colorSpace: string;
        exif?: Record<string, unknown>;
    };
    optimizedPath?: string;
    error?: string;
}

export class ImageProcessor {
    private readonly thumbnailWidth: number;
    private readonly thumbnailHeight: number;
    private readonly thumbnailQuality: number;

    constructor() {
        this.thumbnailWidth = config.imageProcessing.thumbnail.width;
        this.thumbnailHeight = config.imageProcessing.thumbnail.height;
        this.thumbnailQuality = config.imageProcessing.thumbnail.quality;
    }

    async process(
        inputPath: string,
        options: ProcessOptions = {}
    ): Promise<ProcessingResult> {
        try {
            const imageBuffer = await readFile(inputPath);
            const result: ProcessingResult = {};

            // Generate hash if requested
            if (options.computeHash) {
                result.hash = this.computeHash(imageBuffer);
            }

            // Extract metadata if requested
            if (options.extractMetadata) {
                const metadata = await this.extractMetadata(imageBuffer);
                if (metadata) {
                    result.metadata = metadata;
                }
            }

            // Generate thumbnail if requested
            if (options.generateThumbnail) {
                const thumbnailPath = await this.generateThumbnail(
                    imageBuffer,
                    path.parse(inputPath).name,
                    options.thumbnailSize
                );
                if (thumbnailPath) {
                    result.thumbnailPath = thumbnailPath;
                }
            }

            // Optimize image if requested
            if (options.optimizeImage) {
                const optimizedPath = await this.optimizeImage(
                    imageBuffer,
                    inputPath
                );
                if (optimizedPath) {
                    result.optimizedPath = optimizedPath;
                }
            }

            return result;
        } catch (error) {
            return {
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    private computeHash(buffer: Buffer): string {
        return createHash('sha256').update(buffer).digest('hex');
    }

    private async extractMetadata(buffer: Buffer) {
        try {
            const sharpMetadata = await sharp(buffer).metadata();
            let exifData = {};

            try {
                exifData = await ExifReader.load(buffer);
            } catch (error) {
                console.warn('Failed to extract EXIF data:', error);
            }

            return {
                width: sharpMetadata.width || 0,
                height: sharpMetadata.height || 0,
                format: sharpMetadata.format || 'unknown',
                colorSpace: sharpMetadata.space || 'unknown',
                exif: exifData,
            };
        } catch (error) {
            console.error('Failed to extract metadata:', error);
            return null;
        }
    }

    private async generateThumbnail(
        buffer: Buffer,
        baseName: string,
        size?: { width: number; height: number }
    ): Promise<string | null> {
        try {
            const thumbnailPath = path.join(
                config.storage.paths.thumbnails,
                `${baseName}_thumb.webp`
            );

            await sharp(buffer)
                .resize(
                    size?.width || this.thumbnailWidth,
                    size?.height || this.thumbnailHeight,
                    {
                        fit: 'inside',
                        withoutEnlargement: true,
                    }
                )
                .webp({ quality: this.thumbnailQuality })
                .toFile(thumbnailPath);

            return thumbnailPath;
        } catch (error) {
            console.error('Failed to generate thumbnail:', error);
            return null;
        }
    }

    private async optimizeImage(
        buffer: Buffer,
        originalPath: string
    ): Promise<string | null> {
        try {
            const parsedPath = path.parse(originalPath);
            const optimizedPath = path.join(
                parsedPath.dir,
                `${parsedPath.name}_optimized${parsedPath.ext}`
            );

            const image = sharp(buffer);
            const metadata = await image.metadata();

            // Optimize based on format
            switch (metadata.format) {
                case 'jpeg':
                case 'jpg':
                    await image
                        .jpeg({ quality: 85, mozjpeg: true })
                        .toFile(optimizedPath);
                    break;
                case 'png':
                    await image
                        .png({ compressionLevel: 9, palette: true })
                        .toFile(optimizedPath);
                    break;
                case 'webp':
                    await image
                        .webp({ quality: 85, effort: 6 })
                        .toFile(optimizedPath);
                    break;
                default:
                    // For unsupported formats, copy the original
                    await writeFile(optimizedPath, buffer);
            }

            return optimizedPath;
        } catch (error) {
            console.error('Failed to optimize image:', error);
            return null;
        }
    }
}

export default new ImageProcessor();
