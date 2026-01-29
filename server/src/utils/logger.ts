// server/src/utils/logger.ts
// Structured Logging Utility

import winston from 'winston';

const { combine, timestamp, printf, colorize, json } = winston.format;

// Custom format for console output
const consoleFormat = printf(({ level, message, timestamp, context, ...meta }) => {
    const ctx = context ? `[${context}]` : '';
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} ${level} ${ctx} ${message}${metaStr}`;
});

// Create Winston logger
const winstonLogger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        process.env.NODE_ENV === 'production' ? json() : combine(colorize(), consoleFormat)
    ),
    transports: [
        new winston.transports.Console()
    ]
});

// Add file transport in production
if (process.env.NODE_ENV === 'production') {
    winstonLogger.add(
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 10 * 1024 * 1024, // 10MB
            maxFiles: 5
        })
    );
    winstonLogger.add(
        new winston.transports.File({
            filename: 'logs/combined.log',
            maxsize: 10 * 1024 * 1024, // 10MB
            maxFiles: 10
        })
    );
}

/**
 * Logger class with context support
 */
export class Logger {
    private context: string;

    constructor(context: string) {
        this.context = context;
    }

    private log(level: string, message: string, meta?: Record<string, unknown>): void {
        winstonLogger.log({
            level,
            message,
            context: this.context,
            ...meta
        });
    }

    debug(message: string, meta?: Record<string, unknown>): void {
        this.log('debug', message, meta);
    }

    info(message: string, meta?: Record<string, unknown>): void {
        this.log('info', message, meta);
    }

    warn(message: string, meta?: Record<string, unknown>): void {
        this.log('warn', message, meta);
    }

    error(message: string, meta?: Record<string, unknown>): void {
        this.log('error', message, meta);
    }

    // Child logger with additional context
    child(childContext: string): Logger {
        return new Logger(`${this.context}:${childContext}`);
    }
}

// Default logger instance
export const logger = new Logger('App');

export default Logger;
