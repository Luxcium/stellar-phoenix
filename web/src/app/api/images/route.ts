import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const cursor = searchParams.get('cursor');
        const limit = Number(searchParams.get('limit')) || 20;
        const search = searchParams.get('search') || undefined;
        const format = searchParams.getAll('format');
        const tags = searchParams.getAll('tags');

        // Parse date range if provided
        const startDate = searchParams.get('startDate')
            ? new Date(searchParams.get('startDate')!)
            : undefined;
        const endDate = searchParams.get('endDate')
            ? new Date(searchParams.get('endDate')!)
            : undefined;

        // Build where clause based on filters
        const where = {
            AND: [
                // Search by file name
                search
                    ? {
                        filePath: {
                            contains: search,
                            mode: 'insensitive' as const,
                        },
                    }
                    : {},
                // Filter by format
                format.length > 0
                    ? {
                        metadata: {
                            format: {
                                in: format,
                                mode: 'insensitive' as const,
                            },
                        },
                    }
                    : {},
                // Filter by tags
                tags.length > 0
                    ? {
                        tags: {
                            some: {
                                tag: {
                                    name: {
                                        in: tags,
                                    },
                                },
                            },
                        },
                    }
                    : {},
                // Filter by date range
                startDate
                    ? {
                        createdAt: {
                            gte: startDate,
                        },
                    }
                    : {},
                endDate
                    ? {
                        createdAt: {
                            lte: endDate,
                        },
                    }
                    : {},
            ],
        };

        // Fetch images with pagination
        const images = await prisma.basicImageInfo.findMany({
            where,
            take: limit + 1, // Take one extra to determine if there are more
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                metadata: true,
                tags: {
                    include: {
                        tag: true,
                    },
                },
            },
        });

        let nextCursor: string | undefined;
        if (images.length > limit) {
            const nextItem = images.pop(); // Remove the extra item
            nextCursor = nextItem!.id;
        }

        // Transform the data for the response
        const formattedImages = images.map((image) => ({
            id: image.id,
            filePath: image.filePath,
            thumbnailPath: image.thumbnailPath,
            metadata: image.metadata,
            tags: image.tags.map((t) => t.tag.name),
            createdAt: image.createdAt,
        }));

        return NextResponse.json({
            images: formattedImages,
            nextCursor,
        });
    } catch (error) {
        console.error('Failed to fetch images:', error);
        return NextResponse.json(
            { error: 'Failed to fetch images' },
            { status: 500 }
        );
    }
}
