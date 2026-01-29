// server/src/config/database.ts
// MongoDB Connection Configuration

import mongoose from 'mongoose';
import { Logger } from '../utils/logger';

const logger = new Logger('Database');

interface DatabaseConfig {
    uri: string;
    options: mongoose.ConnectOptions;
}

const defaultConfig: DatabaseConfig = {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/sequelstring',
    options: {
        maxPoolSize: 50,
        minPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4
    }
};

/**
 * Connect to MongoDB
 */
export async function connectDatabase(config: Partial<DatabaseConfig> = {}): Promise<mongoose.Connection> {
    const { uri, options } = { ...defaultConfig, ...config };

    try {
        logger.info('Connecting to MongoDB...', { uri: uri.replace(/\/\/.*@/, '//<credentials>@') });

        await mongoose.connect(uri, options);

        const connection = mongoose.connection;

        connection.on('connected', () => {
            logger.info('MongoDB connected successfully');
        });

        connection.on('error', (err) => {
            logger.error('MongoDB connection error', { error: err.message });
        });

        connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected');
        });

        connection.on('reconnected', () => {
            logger.info('MongoDB reconnected');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await connection.close();
            logger.info('MongoDB connection closed due to app termination');
            process.exit(0);
        });

        return connection;
    } catch (error) {
        logger.error('Failed to connect to MongoDB', { error: (error as Error).message });
        throw error;
    }
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectDatabase(): Promise<void> {
    try {
        await mongoose.disconnect();
        logger.info('MongoDB disconnected');
    } catch (error) {
        logger.error('Error disconnecting from MongoDB', { error: (error as Error).message });
        throw error;
    }
}

/**
 * Get database connection status
 */
export function getDatabaseStatus(): string {
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    return states[mongoose.connection.readyState] || 'unknown';
}

/**
 * Health check
 */
export async function checkDatabaseHealth(): Promise<{ status: string; latency?: number }> {
    try {
        const start = Date.now();
        await mongoose.connection.db?.admin().ping();
        const latency = Date.now() - start;

        return {
            status: 'healthy',
            latency
        };
    } catch (error) {
        return {
            status: 'unhealthy'
        };
    }
}

export default {
    connectDatabase,
    disconnectDatabase,
    getDatabaseStatus,
    checkDatabaseHealth
};
