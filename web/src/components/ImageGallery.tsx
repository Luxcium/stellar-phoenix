'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface ImageItem {
    id: string;
    thumbnailPath: string;
    filePath: string;
    metadata: {
        width: number;
        height: number;
        format: string;
    };
}

interface ImageResponse {
    images: ImageItem[];
    nextCursor?: string;
}

async function fetchImages(cursor?: string): Promise<ImageResponse> {
    const response = await fetch(
        `/api/images?${cursor ? `cursor=${cursor}&` : ''}limit=20`
    );
    if (!response.ok) throw new Error('Failed to fetch images');
    return response.json();
}

export default function ImageGallery() {
    const { ref, inView } = useInView();

    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['images'],
        queryFn: ({ pageParam }) => fetchImages(pageParam as string),
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialPageSize: 20,
    });

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

    const handleImageClick = useCallback((image: ImageItem) => {
        setSelectedImage(image);
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <Loader2Icon className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center text-red-500">
                Failed to load images. Please try again.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {data?.pages.map((page) =>
                    page.images.map((image) => (
                        <div
                            key={image.id}
                            className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
                            onClick={() => handleImageClick(image)}
                        >
                            <Image
                                src={image.thumbnailPath}
                                alt=""
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                        </div>
                    ))
                )}
            </div>

            {hasNextPage && (
                <div
                    ref={ref}
                    className="flex items-center justify-center py-4"
                >
                    {isFetchingNextPage && (
                        <Loader2Icon className="w-6 h-6 animate-spin text-primary" />
                    )}
                </div>
            )}

            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-4xl max-h-[90vh] w-full mx-4">
                        <Image
                            src={selectedImage.filePath}
                            alt=""
                            width={selectedImage.metadata.width}
                            height={selectedImage.metadata.height}
                            className="object-contain w-full h-full"
                            priority
                        />
                        <button
                            className="absolute top-4 right-4 text-white hover:text-gray-300"
                            onClick={() => setSelectedImage(null)}
                        >
                            <span className="sr-only">Close</span>
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
