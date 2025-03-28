import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schemas
const addTagSchema = z.object({
    name: z.string().min(1).max(50),
});

const removeTagSchema = z.object({
    tagId: z.string().uuid(),
});

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const tags = await prisma.imageTag.findMany({
            where: {
                imageId: params.id,
            },
            include: {
                tag: true,
            },
            orderBy: {
                tag: {
                    name: 'asc',
                },
            },
        });

        return NextResponse.json({
            tags: tags.map((t) => ({
                id: t.tag.id,
                name: t.tag.name,
            })),
        });
    } catch (error) {
        console.error('Failed to fetch tags:', error);
        return NextResponse.json(
            { error: 'Failed to fetch tags' },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { name } = addTagSchema.parse(body);

        // Create or get existing tag
        const tag = await prisma.tag.upsert({
            where: {
                name: name.toLowerCase(),
            },
            update: {},
            create: {
                name: name.toLowerCase(),
            },
        });

        // Add tag to image if not already added
        await prisma.imageTag.upsert({
            where: {
                imageId_tagId: {
                    imageId: params.id,
                    tagId: tag.id,
                },
            },
            update: {},
            create: {
                imageId: params.id,
                tagId: tag.id,
            },
        });

        return NextResponse.json({ success: true, tag });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.errors },
                { status: 400 }
            );
        }
        console.error('Failed to add tag:', error);
        return NextResponse.json(
            { error: 'Failed to add tag' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { tagId } = removeTagSchema.parse(body);

        await prisma.imageTag.delete({
            where: {
                imageId_tagId: {
                    imageId: params.id,
                    tagId,
                },
            },
        });

        // Optional: Remove tag if it's not used by any other images
        const tagUsageCount = await prisma.imageTag.count({
            where: {
                tagId,
            },
        });

        if (tagUsageCount === 0) {
            await prisma.tag.delete({
                where: {
                    id: tagId,
                },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.errors },
                { status: 400 }
            );
        }
        console.error('Failed to remove tag:', error);
        return NextResponse.json(
            { error: 'Failed to remove tag' },
            { status: 500 }
        );
    }
}
