// server/src/services/EmailSchedulerService.ts
// Feature 1: Occasion-Based Auto Email Service

import Bull, { Queue, Job } from 'bull';
import cron from 'node-cron';
import { Contact, IContact, IImportantDate } from '../models/Contact';
import { EmailTemplate } from '../models/EmailTemplate';
import { SendGridAdapter } from '../integrations/sendgrid/SendGridAdapter';
import { RedisClient } from '../config/redis';
import { Logger } from '../utils/logger';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface EmailJobData {
    contactId: string;
    dateId: string;
    dateType: string;
    email: string;
    firstName: string;
    lastName: string;
    templateId: string;
    scheduledFor: Date;
    senderUserId: string;
}

export interface SchedulerConfig {
    cronExpression: string;
    timezone: string;
    lookAheadDays: number;
    batchSize: number;
}

export interface SendResult {
    success: boolean;
    messageId?: string;
    error?: string;
    sentAt?: Date;
}

// =============================================================================
// EMAIL SCHEDULER SERVICE
// =============================================================================

export class EmailSchedulerService {
    private emailQueue: Queue<EmailJobData>;
    private sendgrid: SendGridAdapter;
    private logger: Logger;
    private config: SchedulerConfig;
    private cronJob?: cron.ScheduledTask;

    constructor(config?: Partial<SchedulerConfig>) {
        this.config = {
            cronExpression: '0 0 * * *', // Daily at midnight
            timezone: 'UTC',
            lookAheadDays: 1,
            batchSize: 100,
            ...config
        };

        this.logger = new Logger('EmailSchedulerService');
        this.sendgrid = new SendGridAdapter();

        // Initialize Bull queue
        this.emailQueue = new Bull('email-queue', {
            redis: RedisClient.getConfig(),
            defaultJobOptions: {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 5000
                },
                removeOnComplete: 100,
                removeOnFail: 1000
            }
        });

        this.setupQueueHandlers();
    }

    // ===========================================================================
    // QUEUE HANDLERS
    // ===========================================================================

    private setupQueueHandlers(): void {
        // Process email jobs
        this.emailQueue.process('send-occasion-email', async (job: Job<EmailJobData>) => {
            return this.processEmailJob(job);
        });

        // Event handlers
        this.emailQueue.on('completed', (job: Job<EmailJobData>, result: SendResult) => {
            this.logger.info(`Email sent successfully`, {
                jobId: job.id,
                contactId: job.data.contactId,
                messageId: result.messageId
            });
        });

        this.emailQueue.on('failed', (job: Job<EmailJobData>, error: Error) => {
            this.logger.error(`Email failed to send`, {
                jobId: job.id,
                contactId: job.data.contactId,
                error: error.message
            });
        });

        this.emailQueue.on('stalled', (job: Job<EmailJobData>) => {
            this.logger.warn(`Email job stalled`, {
                jobId: job.id,
                contactId: job.data.contactId
            });
        });
    }

    // ===========================================================================
    // CRON JOB MANAGEMENT
    // ===========================================================================

    public startScheduler(): void {
        this.logger.info('Starting email scheduler', { config: this.config });

        this.cronJob = cron.schedule(
            this.config.cronExpression,
            async () => {
                try {
                    await this.scheduleUpcomingEmails();
                } catch (error) {
                    this.logger.error('Scheduler execution failed', { error });
                }
            },
            {
                timezone: this.config.timezone,
                scheduled: true
            }
        );

        this.logger.info('Email scheduler started successfully');
    }

    public stopScheduler(): void {
        if (this.cronJob) {
            this.cronJob.stop();
            this.logger.info('Email scheduler stopped');
        }
    }

    // ===========================================================================
    // CORE SCHEDULING LOGIC
    // ===========================================================================

    public async scheduleUpcomingEmails(): Promise<number> {
        const startTime = Date.now();
        this.logger.info('Starting daily email scheduling run');

        const today = new Date();
        const lookAhead = new Date(today.getTime() + this.config.lookAheadDays * 24 * 60 * 60 * 1000);

        let scheduledCount = 0;
        let skip = 0;
        let hasMore = true;

        while (hasMore) {
            // Fetch contacts with upcoming important dates
            const contacts = await Contact.find({
                'importantDates.isActive': true,
                'importantDates.optOut': { $ne: true },
                'importantDates.nextSendAt': {
                    $gte: today,
                    $lte: lookAhead
                }
            })
                .limit(this.config.batchSize)
                .skip(skip)
                .lean<IContact[]>();

            if (contacts.length === 0) {
                hasMore = false;
                continue;
            }

            // Schedule emails for each contact's important dates
            for (const contact of contacts) {
                const scheduledForContact = await this.scheduleContactEmails(contact, today, lookAhead);
                scheduledCount += scheduledForContact;
            }

            skip += this.config.batchSize;
        }

        const duration = Date.now() - startTime;
        this.logger.info('Daily scheduling run completed', {
            scheduledCount,
            duration: `${duration}ms`
        });

        return scheduledCount;
    }

    private async scheduleContactEmails(
        contact: IContact,
        fromDate: Date,
        toDate: Date
    ): Promise<number> {
        let count = 0;

        for (const importantDate of contact.importantDates) {
            if (!this.shouldSchedule(importantDate, fromDate, toDate)) {
                continue;
            }

            // Check if already scheduled (idempotency)
            const jobId = this.generateJobId(contact._id.toString(), importantDate._id?.toString() || '');
            const existingJob = await this.emailQueue.getJob(jobId);

            if (existingJob) {
                this.logger.debug('Email already scheduled', { jobId });
                continue;
            }

            // Queue the email
            const jobData: EmailJobData = {
                contactId: contact._id.toString(),
                dateId: importantDate._id?.toString() || '',
                dateType: importantDate.type,
                email: contact.email,
                firstName: contact.firstName,
                lastName: contact.lastName,
                templateId: importantDate.emailTemplateId.toString(),
                scheduledFor: importantDate.nextSendAt!,
                senderUserId: contact.ownerId.toString()
            };

            const delay = this.calculateDelay(importantDate.nextSendAt!, importantDate.timezone);

            await this.emailQueue.add('send-occasion-email', jobData, {
                jobId,
                delay,
                priority: this.getPriority(importantDate.type)
            });

            count++;
            this.logger.debug('Email scheduled', {
                contactId: contact._id,
                dateType: importantDate.type,
                scheduledFor: importantDate.nextSendAt
            });
        }

        return count;
    }

    private shouldSchedule(date: IImportantDate, fromDate: Date, toDate: Date): boolean {
        if (!date.isActive || date.optOut || !date.nextSendAt) {
            return false;
        }
        return date.nextSendAt >= fromDate && date.nextSendAt <= toDate;
    }

    private calculateDelay(scheduledTime: Date, timezone: string): number {
        const now = Date.now();
        const targetTime = scheduledTime.getTime();
        return Math.max(0, targetTime - now);
    }

    private getPriority(dateType: string): number {
        // Lower number = higher priority
        switch (dateType) {
            case 'birthday':
                return 1;
            case 'anniversary':
                return 2;
            case 'work_anniversary':
                return 3;
            default:
                return 5;
        }
    }

    private generateJobId(contactId: string, dateId: string): string {
        const today = new Date().toISOString().split('T')[0];
        return `email:${contactId}:${dateId}:${today}`;
    }

    // ===========================================================================
    // EMAIL PROCESSING
    // ===========================================================================

    private async processEmailJob(job: Job<EmailJobData>): Promise<SendResult> {
        const { data } = job;
        this.logger.info('Processing email job', { jobId: job.id, contactId: data.contactId });

        try {
            // Fetch email template
            const template = await EmailTemplate.findById(data.templateId);
            if (!template) {
                throw new Error(`Template not found: ${data.templateId}`);
            }

            // Render template with contact data
            const renderedEmail = this.renderTemplate(template, {
                contact: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email
                }
            });

            // Send via SendGrid
            const result = await this.sendgrid.send({
                to: data.email,
                from: process.env.SENDER_EMAIL || 'noreply@sequelstring.com',
                subject: renderedEmail.subject,
                html: renderedEmail.html,
                text: renderedEmail.text
            });

            // Update contact's lastSentAt
            await this.updateLastSent(data.contactId, data.dateId);

            return {
                success: true,
                messageId: result.messageId,
                sentAt: new Date()
            };
        } catch (error) {
            this.logger.error('Email processing failed', {
                jobId: job.id,
                contactId: data.contactId,
                error: (error as Error).message
            });

            return {
                success: false,
                error: (error as Error).message
            };
        }
    }

    private renderTemplate(
        template: { subject: string; htmlBody: string; textBody: string },
        data: Record<string, unknown>
    ): { subject: string; html: string; text: string } {
        // Simple template rendering (replace with Handlebars in production)
        const replaceVars = (text: string, vars: Record<string, unknown>): string => {
            return text.replace(/\{\{(\w+)\.(\w+)\}\}/g, (_, obj, prop) => {
                const value = vars[obj] as Record<string, string>;
                return value?.[prop] || '';
            });
        };

        return {
            subject: replaceVars(template.subject, data),
            html: replaceVars(template.htmlBody, data),
            text: replaceVars(template.textBody, data)
        };
    }

    private async updateLastSent(contactId: string, dateId: string): Promise<void> {
        await Contact.updateOne(
            { _id: contactId, 'importantDates._id': dateId },
            {
                $set: {
                    'importantDates.$.lastSentAt': new Date(),
                    'importantDates.$.nextSendAt': this.calculateNextYear(new Date())
                }
            }
        );
    }

    private calculateNextYear(date: Date): Date {
        const next = new Date(date);
        next.setFullYear(next.getFullYear() + 1);
        return next;
    }

    // ===========================================================================
    // MANUAL OPERATIONS
    // ===========================================================================

    public async sendEmailNow(contactId: string, dateId: string): Promise<SendResult> {
        const contact = await Contact.findOne(
            { _id: contactId, 'importantDates._id': dateId },
            { 'importantDates.$': 1, email: 1, firstName: 1, lastName: 1, ownerId: 1 }
        ).lean<IContact>();

        if (!contact || !contact.importantDates?.length) {
            throw new Error('Contact or important date not found');
        }

        const importantDate = contact.importantDates[0];

        const jobData: EmailJobData = {
            contactId: contact._id.toString(),
            dateId: dateId,
            dateType: importantDate.type,
            email: contact.email,
            firstName: contact.firstName,
            lastName: contact.lastName,
            templateId: importantDate.emailTemplateId.toString(),
            scheduledFor: new Date(),
            senderUserId: contact.ownerId.toString()
        };

        // Add with no delay for immediate processing
        const job = await this.emailQueue.add('send-occasion-email', jobData, {
            priority: 0
        });

        return new Promise((resolve, reject) => {
            job.finished()
                .then((result) => resolve(result as SendResult))
                .catch(reject);
        });
    }

    public async getQueueStats(): Promise<{
        waiting: number;
        active: number;
        completed: number;
        failed: number;
        delayed: number;
    }> {
        const [waiting, active, completed, failed, delayed] = await Promise.all([
            this.emailQueue.getWaitingCount(),
            this.emailQueue.getActiveCount(),
            this.emailQueue.getCompletedCount(),
            this.emailQueue.getFailedCount(),
            this.emailQueue.getDelayedCount()
        ]);

        return { waiting, active, completed, failed, delayed };
    }

    public async cleanupOldJobs(olderThanMs: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
        await this.emailQueue.clean(olderThanMs, 'completed');
        await this.emailQueue.clean(olderThanMs, 'failed');
        this.logger.info('Cleaned up old jobs');
    }

    public async shutdown(): Promise<void> {
        this.stopScheduler();
        await this.emailQueue.close();
        this.logger.info('Email scheduler service shut down');
    }
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

let instance: EmailSchedulerService | null = null;

export function getEmailSchedulerService(config?: Partial<SchedulerConfig>): EmailSchedulerService {
    if (!instance) {
        instance = new EmailSchedulerService(config);
    }
    return instance;
}

export default EmailSchedulerService;
