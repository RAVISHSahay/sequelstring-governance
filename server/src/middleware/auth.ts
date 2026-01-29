// server/src/middleware/auth.ts
// Authentication Middleware

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { RedisClient } from '../config/redis';

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: string;
                permissions: string[];
            };
        }
    }
}

interface JWTPayload {
    sub: string;
    email: string;
    role: string;
    permissions: string[];
    iat: number;
    exp: number;
}

/**
 * Authenticate request using JWT Bearer token
 */
export async function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'No authentication token provided'
                }
            });
            return;
        }

        const token = authHeader.split(' ')[1];

        // Check if token is blacklisted
        const redis = RedisClient.getInstance();
        const isBlacklisted = await redis.get(`blacklist:${token}`);
        if (isBlacklisted) {
            res.status(401).json({
                success: false,
                error: {
                    code: 'TOKEN_REVOKED',
                    message: 'Token has been revoked'
                }
            });
            return;
        }

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'default-secret'
        ) as JWTPayload;

        // Attach user to request
        req.user = {
            id: decoded.sub,
            email: decoded.email,
            role: decoded.role,
            permissions: decoded.permissions
        };

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                success: false,
                error: {
                    code: 'TOKEN_EXPIRED',
                    message: 'Authentication token has expired'
                }
            });
            return;
        }

        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
                success: false,
                error: {
                    code: 'INVALID_TOKEN',
                    message: 'Invalid authentication token'
                }
            });
            return;
        }

        next(error);
    }
}

/**
 * Authorize based on required permissions
 */
export function authorize(...requiredPermissions: string[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Authentication required'
                }
            });
            return;
        }

        // Admin has all permissions
        if (req.user.role === 'admin') {
            next();
            return;
        }

        // Check if user has required permissions
        const hasPermission = requiredPermissions.every(permission => {
            // Support wildcard permissions (e.g., "contacts:*")
            return req.user!.permissions.some(p => {
                if (p === '*') return true;
                if (p.endsWith(':*')) {
                    const prefix = p.slice(0, -1);
                    return permission.startsWith(prefix);
                }
                return p === permission;
            });
        });

        if (!hasPermission) {
            res.status(403).json({
                success: false,
                error: {
                    code: 'FORBIDDEN',
                    message: 'Insufficient permissions'
                }
            });
            return;
        }

        next();
    };
}

/**
 * Optional authentication (doesn't fail if no token)
 */
export async function optionalAuth(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        next();
        return;
    }

    // If token provided, validate it
    await authenticate(req, res, next);
}

/**
 * Rate limiting per user
 */
export function rateLimit(maxRequests: number, windowSeconds: number) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const identifier = req.user?.id || req.ip;
            const key = `ratelimit:${req.path}:${identifier}`;

            const redis = RedisClient.getInstance();
            const current = await redis.incr(key);

            if (current === 1) {
                await redis.expire(key, windowSeconds);
            }

            // Set rate limit headers
            res.setHeader('X-RateLimit-Limit', maxRequests);
            res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - current));

            if (current > maxRequests) {
                res.status(429).json({
                    success: false,
                    error: {
                        code: 'RATE_LIMITED',
                        message: 'Too many requests',
                        retryAfter: windowSeconds
                    }
                });
                return;
            }

            next();
        } catch (error) {
            // If Redis fails, allow request
            next();
        }
    };
}

export default { authenticate, authorize, optionalAuth, rateLimit };
