// server/src/controllers/IntelligenceController.ts
// Feature 3: Intelligence Controller

import { Request, Response, NextFunction } from 'express';
import { NewsAlert } from '../models/NewsAlert';
import { getIntelligenceService } from '../services/IntelligenceService';
import { NewsCategory } from '../models/NewsAlert';

export class IntelligenceController {

    // GET /accounts/:accountId/news - Get news feed
    async getNewsFeed(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { accountId } = req.params;
            const { category, sentiment, search, limit = 20, offset = 0 } = req.query;

            const intelligenceService = getIntelligenceService();
            const news = await intelligenceService.getNewsFeed(accountId, {
                category: category as NewsCategory | undefined,
                sentiment: sentiment as 'positive' | 'neutral' | 'negative' | undefined,
                search: search as string | undefined,
                limit: Number(limit),
                offset: Number(offset)
            });

            res.json({
                success: true,
                data: news.map(article => ({
                    id: article._id,
                    title: article.title,
                    summary: article.summary,
                    sourceUrl: article.sourceUrl,
                    sourceName: article.sourceName,
                    publishedAt: article.publishedAt,
                    imageUrl: article.imageUrl,
                    category: article.category,
                    tags: article.tags,
                    analysis: {
                        sentiment: article.analysis?.sentiment,
                        relevanceScore: article.analysis?.relevanceScore
                    },
                    isRead: article.isRead
                }))
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /feed - Get user's intelligence feed (all accounts)
    async getUserIntelligenceFeed(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const { category, limit = 20 } = req.query;

            // Get all accounts the user has access to
            const accounts = await this.getUserAccounts(userId);
            const accountIds = accounts.map(a => a._id);

            const query: Record<string, unknown> = {
                accountId: { $in: accountIds },
                isActive: true,
                isDismissed: false
            };

            if (category) {
                query.category = category;
            }

            const news = await NewsAlert.find(query)
                .sort({ publishedAt: -1, 'analysis.relevanceScore': -1 })
                .limit(Number(limit))
                .populate('accountId', 'name')
                .lean();

            res.json({
                success: true,
                data: news
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /alerts/:alertId - Get alert details
    async getAlertDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { alertId } = req.params;

            const alert = await NewsAlert.findById(alertId)
                .populate('accountId', 'name website')
                .lean();

            if (!alert) {
                res.status(404).json({
                    success: false,
                    error: { code: 'NOT_FOUND', message: 'Alert not found' }
                });
                return;
            }

            // Mark as read
            const userId = req.user!.id;
            const intelligenceService = getIntelligenceService();
            await intelligenceService.markAsRead(alertId, userId);

            res.json({
                success: true,
                data: alert
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /alerts/:alertId/action - Take action on alert
    async takeAction(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { alertId } = req.params;
            const { action, opportunityData } = req.body;
            const userId = req.user!.id;

            const intelligenceService = getIntelligenceService();

            switch (action) {
                case 'viewed':
                    await intelligenceService.markAsRead(alertId, userId);
                    break;
                case 'dismissed':
                    await intelligenceService.dismissAlert(alertId, userId);
                    break;
                case 'shared':
                    const shareResult = await intelligenceService.shareAlert(alertId, userId);
                    res.json({ success: true, data: shareResult });
                    return;
                case 'opportunity_created':
                    const oppResult = await intelligenceService.createOpportunityFromAlert(
                        alertId,
                        userId,
                        opportunityData
                    );
                    res.json({ success: true, data: oppResult });
                    return;
                default:
                    res.status(400).json({
                        success: false,
                        error: { code: 'INVALID_ACTION', message: 'Unknown action' }
                    });
                    return;
            }

            res.json({
                success: true,
                data: { message: `Action '${action}' completed` }
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /subscriptions - Get subscriptions
    async getSubscriptions(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const accounts = await this.getUserAccounts(userId);

            const intelligenceService = getIntelligenceService();
            const subscriptions = [];

            for (const account of accounts) {
                const sub = await intelligenceService.getSubscription(account._id.toString());
                if (sub) {
                    subscriptions.push({
                        ...sub,
                        accountName: account.name
                    });
                }
            }

            res.json({
                success: true,
                data: subscriptions
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /subscriptions - Create subscription
    async createSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const config = req.body;

            const intelligenceService = getIntelligenceService();
            const subscription = await intelligenceService.updateSubscription(config.accountId, {
                enabled: true,
                ...config
            });

            res.status(201).json({
                success: true,
                data: subscription
            });
        } catch (error) {
            next(error);
        }
    }

    // PUT /subscriptions/:id - Update subscription
    async updateSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id: accountId } = req.params;
            const updates = req.body;

            const intelligenceService = getIntelligenceService();
            const subscription = await intelligenceService.updateSubscription(accountId, updates);

            res.json({
                success: true,
                data: subscription
            });
        } catch (error) {
            next(error);
        }
    }

    // DELETE /subscriptions/:id - Delete subscription
    async deleteSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id: accountId } = req.params;

            const intelligenceService = getIntelligenceService();
            await intelligenceService.updateSubscription(accountId, { enabled: false });

            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    // GET /competitors/:accountId - Get competitor news
    async getCompetitorNews(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { accountId } = req.params;
            const { competitor, limit = 10 } = req.query;

            if (!competitor) {
                res.status(400).json({
                    success: false,
                    error: { code: 'VALIDATION_ERROR', message: 'Competitor name required' }
                });
                return;
            }

            const intelligenceService = getIntelligenceService();
            const news = await intelligenceService.getCompetitorNews(
                accountId,
                competitor as string,
                Number(limit)
            );

            res.json({
                success: true,
                data: news
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /trends/:accountId - Get industry trends
    async getIndustryTrends(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { accountId } = req.params;

            const intelligenceService = getIntelligenceService();
            const trends = await intelligenceService.getIndustryTrends(accountId);

            res.json({
                success: true,
                data: trends
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /stats - Get intelligence stats
    async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const intelligenceService = getIntelligenceService();
            const queueStats = await intelligenceService.getQueueStats();

            const totalAlerts = await NewsAlert.countDocuments({ isActive: true });
            const unreadAlerts = await NewsAlert.countDocuments({ isActive: true, isRead: false });

            res.json({
                success: true,
                data: {
                    totalAlerts,
                    unreadAlerts,
                    queue: queueStats
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // Helper: Get user's accounts
    private async getUserAccounts(userId: string): Promise<Array<{ _id: string; name: string }>> {
        // In a real app, this would query based on user permissions
        const Account = require('../models/Account').Account;
        return Account.find({ ownerId: userId }, '_id name').lean();
    }
}

export default IntelligenceController;
