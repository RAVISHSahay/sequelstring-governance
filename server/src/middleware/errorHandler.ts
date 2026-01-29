// server/src/middleware/errorHandler.ts
// Global Error Handler Middleware

import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger';

const logger = new Logger('ErrorHandler');

// Custom error class
export class AppError extends Error {
    statusCode: number;
    code: string;
    isOperational: boolean;
    details?: Record<string, unknown>;

    constructor(
        message: string,
        statusCode: number = 500,
        code: string = 'INTERNAL_ERROR',
        isOperational: boolean = true,
        details?: Record<string, unknown>
    ) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = isOperational;
        this.details = details;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Common error types
export class NotFoundError extends AppError {
    constructor(resource: string = 'Resource') {
        super(`${resource} not found`, 404, 'NOT_FOUND');
    }
}

export class ValidationError extends AppError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(message, 400, 'VALIDATION_ERROR', true, details);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized') {
        super(message, 401, 'UNAUTHORIZED');
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = 'Forbidden') {
        super(message, 403, 'FORBIDDEN');
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 409, 'CONFLICT');
    }
}

export class RateLimitError extends AppError {
    constructor(retryAfter: number) {
        super('Too many requests', 429, 'RATE_LIMITED', true, { retryAfter });
    }
}

/**
 * Global error handler middleware
 */
export function errorHandler(
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    // Default error values
    let statusCode = 500;
    let code = 'INTERNAL_ERROR';
    let message = 'An unexpected error occurred';
    let details: Record<string, unknown> | undefined;
    let isOperational = false;

    // Handle AppError instances
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        code = err.code;
        message = err.message;
        details = err.details;
        isOperational = err.isOperational;
    }

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        statusCode = 400;
        code = 'VALIDATION_ERROR';
        message = 'Validation failed';
        // @ts-ignore
        details = err.errors;
        isOperational = true;
    }

    // Handle Mongoose duplicate key errors
    if (err.name === 'MongoServerError' && (err as any).code === 11000) {
        statusCode = 409;
        code = 'DUPLICATE_KEY';
        message = 'Duplicate entry';
        isOperational = true;
    }

    // Handle Mongoose cast errors (invalid ObjectId)
    if (err.name === 'CastError') {
        statusCode = 400;
        code = 'INVALID_ID';
        message = 'Invalid ID format';
        isOperational = true;
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        code = 'INVALID_TOKEN';
        message = 'Invalid token';
        isOperational = true;
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        code = 'TOKEN_EXPIRED';
        message = 'Token expired';
        isOperational = true;
    }

    // Log error
    if (isOperational) {
        logger.warn('Operational error', {
            code,
            message,
            path: req.path,
            method: req.method,
            userId: req.user?.id
        });
    } else {
        logger.error('Unexpected error', {
            error: err.message,
            stack: err.stack,
            path: req.path,
            method: req.method,
            userId: req.user?.id
        });
    }

    // Send response
    const response: Record<string, unknown> = {
        success: false,
        error: {
            code,
            message,
            requestId: req.headers['x-request-id'] || generateRequestId(),
            timestamp: new Date().toISOString()
        }
    };

    // Include details in development
    if (details && (process.env.NODE_ENV === 'development' || isOperational)) {
        (response.error as Record<string, unknown>).details = details;
    }

    // Include stack in development
    if (process.env.NODE_ENV === 'development' && !isOperational) {
        (response.error as Record<string, unknown>).stack = err.stack;
    }

    res.status(statusCode).json(response);
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req: Request, res: Response): void {
    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: `Route ${req.method} ${req.path} not found`,
            timestamp: new Date().toISOString()
        }
    });
}

/**
 * Generate unique request ID
 */
function generateRequestId(): string {
    return `req_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
}

export default { errorHandler, notFoundHandler, AppError };
