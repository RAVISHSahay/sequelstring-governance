// server/src/index.ts
// Main Server Entry Point

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

import { connectDatabase, checkDatabaseHealth } from './config/database';
import { RedisClient, checkRedisHealth } from './config/redis';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { Logger } from './utils/logger';

// Services
import { getEmailSchedulerService } from './services/EmailSchedulerService';
import { getIntelligenceService } from './services/IntelligenceService';

const logger = new Logger('Server');

// =============================================================================
// EXPRESS APPLICATION SETUP
// =============================================================================

const app: Application = express();
const httpServer = createServer(app);

// Socket.IO setup
const io = new SocketIOServer(httpServer, {
    cors: {
        origin: process.env.APP_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// =============================================================================
// MIDDLEWARE
// =============================================================================

// Security headers
app.use(helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false /
}));

// CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID']
}));

// Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Request logging
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Request ID
app.use((req, res, next) => {
    req.headers['x-request-id'] = req.headers['x-request-id'] ||
        `req_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
    res.setHeader('X-Request-ID', req.headers['x-request-id']);
    next();
});

// =============================================================================
// ROUTES
// =============================================================================

// Health check endpoint
app.get('/health', async (req, res) => {
    const [dbHealth, redisHealth] = await Promise.all([
        checkDatabaseHealth(),
        checkRedisHealth()
    ]);

    const isHealthy = dbHealth.status === 'healthy' && redisHealth.status === 'healthy';

    res.status(isHealthy ? 200 : 503).json({
        status: isHealthy ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        services: {
            database: dbHealth,
            redis: redisHealth
        }
    });
});

// API routes
app.use('/api/v1', routes);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// =============================================================================
// SOCKET.IO HANDLERS
// =============================================================================

io.on('connection', (socket) => {
    logger.info('Socket connected', { socketId: socket.id });

    // Join user-specific room
    socket.on('join:user', (userId: string) => {
        socket.join(`user:${userId}`);
    });

    // Join account room for intelligence updates
    socket.on('join:account', (accountId: string) => {
        socket.join(`account:${accountId}`);
    });

    // Join call room for real-time updates
    socket.on('join:call', (callId: string) => {
        socket.join(`call:${callId}`);
    });

    socket.on('disconnect', () => {
        logger.info('Socket disconnected', { socketId: socket.id });
    });
});

// Export io for use in services
export { io };

// =============================================================================
// SERVER STARTUP
// =============================================================================

async function startServer(): Promise<void> {
    try {
        // Connect to databases
        await connectDatabase();
        logger.info('Database connected');

        // Initialize Redis
        RedisClient.getInstance();
        logger.info('Redis connected');

        // Start background services
        if (process.env.ENABLE_SCHEDULER !== 'false') {
            const emailScheduler = getEmailSchedulerService();
            emailScheduler.startScheduler();
            logger.info('Email scheduler started');

            if (process.env.ENABLE_INTELLIGENCE !== 'false') {
                const intelligenceService = getIntelligenceService();
                intelligenceService.startScheduler();
                logger.info('Intelligence aggregator started');
            }
        }

        // Start HTTP server
        const port = parseInt(process.env.PORT || '4000', 10);
        httpServer.listen(port, () => {
            logger.info(`Server started on port ${port}`, {
                env: process.env.NODE_ENV,
                port
            });
        });

    } catch (error) {
        logger.error('Failed to start server', { error: (error as Error).message });
        process.exit(1);
    }
}

// Graceful shutdown
async function gracefulShutdown(signal: string): Promise<void> {
    logger.info(`Received ${signal}, starting graceful shutdown...`);

    // Stop accepting new connections
    httpServer.close(() => {
        logger.info('HTTP server closed');
    });

    // Stop background services
    try {
        const emailScheduler = getEmailSchedulerService();
        await emailScheduler.shutdown();

        const intelligenceService = getIntelligenceService();
        await intelligenceService.shutdown();
    } catch (error) {
        logger.error('Error stopping services', { error: (error as Error).message });
    }

    // Close database connections
    try {
        await RedisClient.close();
        await require('./config/database').disconnectDatabase();
    } catch (error) {
        logger.error('Error closing connections', { error: (error as Error).message });
    }

    logger.info('Graceful shutdown complete');
    process.exit(0);
}

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception', { error: error.message, stack: error.stack });
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled rejection', { reason });
    process.exit(1);
});

// Start server
startServer();

export default app;
