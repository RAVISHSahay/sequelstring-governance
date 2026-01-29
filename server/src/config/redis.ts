// server/src/config/redis.ts
// Redis Connection Configuration

import Redis from 'ioredis';
import { Logger } from '../utils/logger';

const logger = new Logger('Redis');

interface RedisConfig {
    host: string;
    port: number;
    password?: string;
    db?: number;
    maxRetriesPerRequest?: number;
    retryDelayMs?: number;
}

let redisInstance: Redis | null = null;

/**
 * Parse Redis URL to config
 */
function parseRedisUrl(url: string): RedisConfig {
    try {
        const parsed = new URL(url);
        return {
            host: parsed.hostname,
            port: parseInt(parsed.port, 10) || 6379,
            password: parsed.password || undefined,
            db: parseInt(parsed.pathname.slice(1), 10) || 0
        };
    } catch {
        return {
            host: 'localhost',
            port: 6379
        };
    }
}

/**
 * Get Redis configuration
 */
export function getConfig(): RedisConfig {
    const url = process.env.REDIS_URL;

    if (url) {
        return parseRedisUrl(url);
    }

    return {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD,
        db: parseInt(process.env.REDIS_DB || '0', 10)
    };
}

/**
 * Redis Client Singleton
 */
export class RedisClient {
    private static instance: Redis;

    static getInstance(): Redis {
        if (!RedisClient.instance) {
            RedisClient.instance = RedisClient.createClient();
        }
        return RedisClient.instance;
    }

    static getConfig(): { redis: RedisConfig } {
        return { redis: getConfig() };
    }

    private static createClient(): Redis {
        const config = getConfig();

        const client = new Redis({
            host: config.host,
            port: config.port,
            password: config.password,
            db: config.db,
            maxRetriesPerRequest: 3,
            retryStrategy: (times) => {
                if (times > 10) {
                    logger.error('Redis: Max retries exceeded, giving up');
                    return null;
                }
                const delay = Math.min(times * 100, 3000);
                logger.warn(`Redis: Retrying connection in ${delay}ms`);
                return delay;
            },
            reconnectOnError: (err) => {
                const targetErrors = ['READONLY', 'ECONNRESET', 'ECONNREFUSED'];
                if (targetErrors.some(e => err.message.includes(e))) {
                    return true;
                }
                return false;
            }
        });

        client.on('connect', () => {
            logger.info('Redis: Connecting...');
        });

        client.on('ready', () => {
            logger.info('Redis: Connected and ready');
        });

        client.on('error', (err) => {
            logger.error('Redis: Connection error', { error: err.message });
        });

        client.on('close', () => {
            logger.warn('Redis: Connection closed');
        });

        client.on('reconnecting', () => {
            logger.info('Redis: Reconnecting...');
        });

        return client;
    }

    /**
     * Close connection
     */
    static async close(): Promise<void> {
        if (RedisClient.instance) {
            await RedisClient.instance.quit();
            logger.info('Redis: Connection closed');
        }
    }

    /**
     * Health check
     */
    static async checkHealth(): Promise<{ status: string; latency?: number }> {
        try {
            const start = Date.now();
            const result = await RedisClient.instance.ping();
            const latency = Date.now() - start;

            return {
                status: result === 'PONG' ? 'healthy' : 'unhealthy',
                latency
            };
        } catch (error) {
            return {
                status: 'unhealthy'
            };
        }
    }
}

// Legacy exports for compatibility
export const getRedisClient = () => RedisClient.getInstance();
export const closeRedis = () => RedisClient.close();
export const checkRedisHealth = () => RedisClient.checkHealth();

export default RedisClient;
