'use client';

import { useQueryClient } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { ChevronDownIcon, FilterIcon, XIcon } from 'lucide-react';
import { useCallback, useState } from 'react';

interface FilterState {
    search: string;
    tags: string[];
    dateRange: {
        start: Date | null;
        end: Date | null;
    };
    dimensions: {
        minWidth: number | null;
        minHeight: number | null;
    };
    format: string[];
}

export default function SearchFilters() {
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(true);
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        tags: [],
        dateRange: {
            start: null,
            end: null,
        },
        dimensions: {
            minWidth: null,
            minHeight: null,
        },
        format: [],
    });

    const updateFilters = useCallback(
        debounce((newFilters: Partial<FilterState>) => {
            setFilters((prev) => ({
                ...prev,
                ...newFilters,
            }));
            // Invalidate and refetch images with new filters
            queryClient.invalidateQueries({ queryKey: ['images'] });
        }, 300),
        [queryClient]
    );

    const clearFilters = useCallback(() => {
        setFilters({
            search: '',
            tags: [],
            dateRange: {
                start: null,
                end: null,
            },
            dimensions: {
                minWidth: null,
                minHeight: null,
            },
            format: [],
        });
        queryClient.invalidateQueries({ queryKey: ['images'] });
    }, [queryClient]);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <FilterIcon className="w-5 h-5 text-gray-500" />
                    <h2 className="text-lg font-medium">Filters</h2>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                    aria-label={isOpen ? "Collapse filters" : "Expand filters"}
                    title={isOpen ? "Collapse filters" : "Expand filters"}
                >
                    <ChevronDownIcon
                        className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''
                            }`}
                    />
                </button>
            </div>

            {isOpen && (
                <div className="space-y-4">
                    {/* Search input */}
                    <div>
                        <label
                            htmlFor="search"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Search
                        </label>
                        <input
                            type="text"
                            id="search"
                            value={filters.search}
                            onChange={(e) => updateFilters({ search: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                            placeholder="Search images..."
                        />
                    </div>

                    {/* Format filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Format
                        </label>
                        <div className="space-y-2">
                            {['JPG', 'PNG', 'GIF', 'WEBP'].map((format) => (
                                <label
                                    key={format}
                                    className="flex items-center space-x-2"
                                >
                                    <input
                                        type="checkbox"
                                        checked={filters.format.includes(format)}
                                        onChange={(e) => {
                                            const newFormats = e.target.checked
                                                ? [...filters.format, format]
                                                : filters.format.filter((f) => f !== format);
                                            updateFilters({ format: newFormats });
                                        }}
                                        className="rounded border-gray-300 dark:border-gray-600"
                                        aria-label={`Filter by ${format} format`}
                                    />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {format}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Date range filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Date Range
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="date"
                                value={filters.dateRange.start?.toISOString().split('T')[0] || ''}
                                onChange={(e) =>
                                    updateFilters({
                                        dateRange: {
                                            ...filters.dateRange,
                                            start: e.target.value ? new Date(e.target.value) : null,
                                        },
                                    })
                                }
                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                                aria-label="Start date"
                                title="Start date"
                                placeholder="Start date"
                            />
                            <input
                                type="date"
                                value={filters.dateRange.end?.toISOString().split('T')[0] || ''}
                                onChange={(e) =>
                                    updateFilters({
                                        dateRange: {
                                            ...filters.dateRange,
                                            end: e.target.value ? new Date(e.target.value) : null,
                                        },
                                    })
                                }
                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                                aria-label="End date"
                                title="End date"
                                placeholder="End date"
                            />
                        </div>
                    </div>

                    {/* Clear filters button */}
                    <button
                        onClick={clearFilters}
                        className="w-full px-4 py-2 mt-4 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center justify-center space-x-2"
                        aria-label="Clear all filters"
                    >
                        <XIcon className="w-4 h-4" />
                        <span>Clear Filters</span>
                    </button>
                </div>
            )}
        </div>
    );
}
