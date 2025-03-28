import { ZodError } from 'zod';

export class AppError extends Error {
    public readonly statusCode: number;
    public readonly code: string;
    public readonly isOperational: boolean;

    constructor(
        message: string,
        statusCode: number = 500,
        code: string = 'INTERNAL_ERROR',
        isOperational: boolean = true
    ) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    public readonly errors: unknown[];

    constructor(message: string, errors: unknown[] = []) {
        super(message, 400, 'VALIDATION_ERROR');
        this.errors = errors;
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, 404, 'NOT_FOUND');
    }
}

export class FileSystemError extends AppError {
    constructor(message: string, code: string = 'FILESYSTEM_ERROR') {
        super(message, 500, code, true);
    }
}

export class ImageProcessingError extends AppError {
    constructor(message: string, code: string = 'IMAGE_PROCESSING_ERROR') {
        super(message, 500, code, true);
    }
}

export class DatabaseError extends AppError {
    constructor(message: string, code: string = 'DATABASE_ERROR') {
        super(message, 500, code, true);
    }
}

interface ErrorResponse {
    error: {
        message: string;
        code: string;
        errors?: unknown[];
        stack?: string;
    };
    statusCode: number;
}

export function handleError(error: unknown): ErrorResponse {
    console.error('Error:', error);

    if (error instanceof AppError) {
        return {
            error: {
                message: error.message,
                code: error.code,
                ...(error instanceof ValidationError && {
                    errors: error.errors,
                }),
                ...(process.env.NODE_ENV === 'development' && {
                    stack: error.stack,
                }),
            },
            statusCode: error.statusCode,
        };
    }

    if (error instanceof ZodError) {
        return {
            error: {
                message: 'Validation error',
                code: 'VALIDATION_ERROR',
                errors: error.errors,
                ...(process.env.NODE_ENV === 'development' && {
                    stack: error.stack,
                }),
            },
            statusCode: 400,
        };
    }

    // Handle unknown errors
    return {
        error: {
            message: error instanceof Error ? error.message : 'An unknown error occurred',
            code: 'INTERNAL_ERROR',
            ...(process.env.NODE_ENV === 'development' && {
                stack: error instanceof Error ? error.stack : undefined,
            }),
        },
        statusCode: 500,
    };
}

export function isAppError(error: unknown): error is AppError {
    return error instanceof AppError;
}

export function isValidationError(error: unknown): error is ValidationError {
    return error instanceof ValidationError;
}

export function assertNever(value: never): never {
    throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
}

// Helper function to ensure a value exists
export function assertExists<T>(
    value: T | null | undefined,
    message: string = 'Value does not exist'
): asserts value is T {
    if (value === null || value === undefined) {
        throw new NotFoundError(message);
    }
}

// Type guard for checking if a value is Record<string, unknown>
export function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Error handler middleware for API routes
export async function withErrorHandler(
    handler: () => Promise<unknown>
): Promise<ErrorResponse | unknown> {
    try {
        return await handler();
    } catch (error) {
        return handleError(error);
    }
}
