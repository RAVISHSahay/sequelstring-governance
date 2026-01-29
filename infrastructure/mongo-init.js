// MongoDB Initialization Script
// This runs when the container is first created

// Create application database
db = db.getSiblingDB('sequelstring');

// Create collections
db.createCollection('users');
db.createCollection('contacts');
db.createCollection('accounts');
db.createCollection('calls');
db.createCollection('news_alerts');
db.createCollection('email_templates');
db.createCollection('social_activities');

// Create indexes
// Users collection
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ 'refreshTokens.token': 1 });

// Contacts collection
db.contacts.createIndex({ email: 1 }, { unique: true });
db.contacts.createIndex({ accountId: 1 });
db.contacts.createIndex({ ownerId: 1 });
db.contacts.createIndex({ 'importantDates.nextSendAt': 1 });
db.contacts.createIndex({ 'importantDates.type': 1, 'importantDates.isActive': 1 });
db.contacts.createIndex({ 'socialProfiles.platform': 1 });
db.contacts.createIndex({ tags: 1 });
db.contacts.createIndex({ createdAt: -1 });

// Accounts collection
db.accounts.createIndex({ name: 1 });
db.accounts.createIndex({ website: 1 }, { unique: true, sparse: true });
db.accounts.createIndex({ ownerId: 1 });
db.accounts.createIndex({ 'intelligenceConfig.newsSubscription': 1 });

// Calls collection
db.calls.createIndex({ contactId: 1 });
db.calls.createIndex({ accountId: 1 });
db.calls.createIndex({ userId: 1, status: 1 });
db.calls.createIndex({ startedAt: -1 });
db.calls.createIndex({ scheduledAt: 1 });
db.calls.createIndex({ externalCallId: 1 }, { unique: true, sparse: true });
db.calls.createIndex({ 'transcript.status': 1 });
db.calls.createIndex({ 'aiSummary.status': 1 });

// News Alerts collection
db.news_alerts.createIndex({ accountId: 1, publishedAt: -1 });
db.news_alerts.createIndex({ category: 1 });
db.news_alerts.createIndex({ 'analysis.sentiment.overall': 1 });
db.news_alerts.createIndex({ isActive: 1, isDismissed: 1 });
db.news_alerts.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Email Templates collection
db.email_templates.createIndex({ type: 1, isActive: 1 });
db.email_templates.createIndex({ isDefault: 1 });

// Social Activities collection
db.social_activities.createIndex({ contactId: 1, publishedAt: -1 });
db.social_activities.createIndex({ socialProfileId: 1 });
db.social_activities.createIndex({ platform: 1 });
db.social_activities.createIndex({ externalId: 1, platform: 1 }, { unique: true });

// Insert default email templates
db.email_templates.insertMany([
    {
        name: 'Birthday Greeting',
        type: 'birthday',
        description: 'Default birthday greeting template',
        subject: 'Happy Birthday, {{contact.firstName}}! 🎂',
        htmlBody: '<h1>Happy Birthday, {{contact.firstName}}!</h1><p>Wishing you a wonderful day filled with joy and happiness.</p><p>Best wishes,<br>The {{company.name}} Team</p>',
        textBody: 'Happy Birthday, {{contact.firstName}}!\n\nWishing you a wonderful day filled with joy and happiness.\n\nBest wishes,\nThe {{company.name}} Team',
        variables: ['contact.firstName', 'contact.lastName', 'company.name'],
        isDefault: true,
        isActive: true,
        createdAt: new Date()
    },
    {
        name: 'Work Anniversary',
        type: 'work_anniversary',
        description: 'Default work anniversary template',
        subject: 'Congratulations on Your Work Anniversary, {{contact.firstName}}! 🎉',
        htmlBody: '<h1>Happy Work Anniversary!</h1><p>Congratulations on another year of achievements, {{contact.firstName}}.</p><p>Best wishes,<br>The {{company.name}} Team</p>',
        textBody: 'Happy Work Anniversary!\n\nCongratulations on another year of achievements, {{contact.firstName}}.\n\nBest wishes,\nThe {{company.name}} Team',
        variables: ['contact.firstName', 'contact.lastName', 'company.name'],
        isDefault: true,
        isActive: true,
        createdAt: new Date()
    },
    {
        name: 'Anniversary Greeting',
        type: 'anniversary',
        description: 'Default anniversary greeting template',
        subject: 'Happy Anniversary, {{contact.firstName}}! 💝',
        htmlBody: '<h1>Happy Anniversary!</h1><p>Wishing you and your loved ones a beautiful celebration, {{contact.firstName}}.</p><p>Warm regards,<br>The {{company.name}} Team</p>',
        textBody: 'Happy Anniversary!\n\nWishing you and your loved ones a beautiful celebration, {{contact.firstName}}.\n\nWarm regards,\nThe {{company.name}} Team',
        variables: ['contact.firstName', 'contact.lastName', 'company.name'],
        isDefault: true,
        isActive: true,
        createdAt: new Date()
    }
]);

print('MongoDB initialization completed successfully!');
print('Created collections: users, contacts, accounts, calls, news_alerts, email_templates, social_activities');
print('Created indexes and inserted default email templates');
