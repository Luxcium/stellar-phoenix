import { mkdir, writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

import config from '@/config';
import prisma from '@/lib/prisma';
import { queues } from '@/lib/queue';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        // Validate file type
        if (!config.storage.allowedMimeTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type' },
                { status: 400 }
            );
        }

        // Validate file size
        if (file.size > config.storage.maxFileSize) {
            return NextResponse.json(
                { error: 'File too large' },
                { status: 400 }
            );
        }

        // Create storage directories if they don't exist
        await mkdir(config.storage.paths.storage, { recursive: true });
        await mkdir(config.storage.paths.thumbnails, { recursive: true });

        // Generate unique filename
        const id = uuidv4();
        const fileExt = file.name.split('.').pop();
        const fileName = `${id}.${fileExt}`;
        const filePath = join(config.storage.paths.storage, fileName);

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Save file
        await writeFile(filePath, buffer);

        // Get basic image metadata
        const metadata = await sharp(buffer).metadata();

        // Create database entry
        const image = await prisma.basicImageInfo.create({
            data: {
                filePath,
                thumbnailPath: '', // Will be updated after processing
                fileSize: file.size,
                hash: '', // Will be updated after processing
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

        // Queue image for processing
        await queues.imageProcessing.add(
            'process-image',
            {
                imageId: image.id,
                filePath,
                fileName: file.name,
                mimeType: file.type,
                size: file.size,
                options: {
                    generateThumbnail: true,
                    extractMetadata: true,
                    computeHash: true,
                    optimizeImage: config.features.imageOptimization,
                },
            },
            {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000,
                },
            }
        );

        return NextResponse.json({
            success: true,
            image: {
                id: image.id,
                filePath: image.filePath,
                fileName: file.name,
                size: file.size,
                metadata: image.metadata,
            },
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        );
    }
}

// Increase payload size limit for image uploads
export const config = {
    api: {
        bodyParser: false,
    },
};
