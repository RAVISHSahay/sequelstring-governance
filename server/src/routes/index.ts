// server/src/routes/index.ts
// Main Router - Aggregates all feature routes

import { Router } from 'express';
import authRoutes from './auth.routes';
import contactRoutes from './contacts.routes';
import dateRoutes from './dates.routes';
import socialRoutes from './social.routes';
import intelligenceRoutes from './intelligence.routes';
import callRoutes from './calls.routes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0'
    });
});

// API Routes
router.use('/auth', authRoutes);
router.use('/contacts', contactRoutes);
router.use('/contacts', dateRoutes);      // Nested: /contacts/:contactId/dates
router.use('/contacts', socialRoutes);    // Nested: /contacts/:contactId/social
router.use('/intelligence', intelligenceRoutes);
router.use('/calls', callRoutes);

export default router;
