// server/src/middleware/validate.ts
// Request Validation Middleware using Zod

import { Request, Response, NextFunction } from 'express';
import { z, ZodError, ZodSchema } from 'zod';

interface ValidationSchema {
    body?: ZodSchema;
    query?: ZodSchema;
    params?: ZodSchema;
}

/**
 * Validate request using Zod schemas
 */
export function validate(schema: ValidationSchema) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Validate body
            if (schema.body) {
                req.body = await schema.body.parseAsync(req.body);
            }

            // Validate query parameters
            if (schema.query) {
                req.query = await schema.query.parseAsync(req.query);
            }

            // Validate path parameters
            if (schema.params) {
                req.params = await schema.params.parseAsync(req.params);
            }

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const formattedErrors: Record<string, string[]> = {};

                error.errors.forEach((err) => {
                    const path = err.path.join('.');
                    if (!formattedErrors[path]) {
                        formattedErrors[path] = [];
                    }
                    formattedErrors[path].push(err.message);
                });

                res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Invalid request data',
                        details: formattedErrors
                    }
                });
                return;
            }

            next(error);
        }
    };
}

/**
 * Sanitize input by stripping unknown fields
 */
export function sanitize(schema: ZodSchema) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            req.body = await schema.strip().parseAsync(req.body);
            next();
        } catch (error) {
            next(error);
        }
    };
}

/**
 * Async validation helper
 */
export async function validateData<T>(
    schema: ZodSchema<T>,
    data: unknown
): Promise<T> {
    return schema.parseAsync(data);
}

export default { validate, sanitize, validateData };
