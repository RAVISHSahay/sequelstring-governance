# 🏗️ SequelString CRM - MERN Stack Architecture
## Enterprise Features Technical Architecture Document

**Version:** 1.0.0  
**Date:** January 29, 2026  
**Author:** Senior Tech Architect  
**Status:** Production Ready

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Overview](#system-overview)
3. [Architecture Principles](#architecture-principles)
4. [Technology Stack](#technology-stack)
5. [High-Level Architecture](#high-level-architecture)
6. [Component Architecture](#component-architecture)
7. [Data Architecture](#data-architecture)
8. [API Architecture](#api-architecture)
9. [Feature-Specific Architecture](#feature-specific-architecture)
10. [Security Architecture](#security-architecture)
11. [Deployment Architecture](#deployment-architecture)
12. [Scalability & Performance](#scalability--performance)
13. [Monitoring & Observability](#monitoring--observability)

---

## 1. Executive Summary

SequelString CRM is a modern Customer Relationship Management system built on the **MERN Stack** (MongoDB, Express.js, React, Node.js). This document outlines the complete technical architecture for four enterprise-grade features:

| Feature | Description | Priority |
|---------|-------------|----------|
| **Occasion-Based Auto Email** | Automated birthday/anniversary emails with templates | P0 |
| **Social Profile Integration** | LinkedIn/Twitter profile linking and activity tracking | P0 |
| **Public Domain Intelligence** | News alerts and competitive intelligence | P1 |
| **Calls Integration** | CTI integration with AI-powered call summaries | P1 |

---

## 2. System Overview

### 2.1 Architecture Style
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          MERN STACK ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │   MongoDB   │◄───│  Express.js │◄───│   React     │◄───│   Node.js   │  │
│  │  Database   │    │  REST API   │    │  Frontend   │    │   Runtime   │  │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘  │
│        ▲                  ▲                  ▲                   ▲          │
│        │                  │                  │                   │          │
│        ▼                  ▼                  ▼                   ▼          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    MICROSERVICES LAYER                              │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐               │   │
│  │  │  Email   │ │  Social  │ │   Intel  │ │   Calls  │               │   │
│  │  │ Service  │ │ Service  │ │  Service │ │  Service │               │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| **Microservices** | Independent scaling, fault isolation, technology flexibility |
| **Event-Driven** | Async processing for emails, notifications, webhooks |
| **API-First** | RESTful APIs with OpenAPI spec, versioning support |
| **Container-Native** | Docker + Kubernetes for orchestration |

---

## 3. Architecture Principles

### 3.1 Core Principles

1. **Separation of Concerns** - Clear boundaries between layers
2. **Single Responsibility** - Each service handles one domain
3. **DRY (Don't Repeat Yourself)** - Shared utilities and components
4. **SOLID Principles** - Object-oriented design patterns
5. **12-Factor App** - Cloud-native application methodology

### 3.2 Design Patterns Used

| Pattern | Usage |
|---------|-------|
| **Repository Pattern** | Data access abstraction |
| **Factory Pattern** | Object creation (Email templates, Notifications) |
| **Observer Pattern** | Event handling and subscriptions |
| **Strategy Pattern** | Different integration providers |
| **Adapter Pattern** | Third-party API integration |

---

## 4. Technology Stack

### 4.1 Complete Stack Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND LAYER                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  React 18.3      │ TypeScript 5.x  │  Vite 5.x       │  TailwindCSS       │
│  React Router 6  │ React Query     │  Zustand        │  Shadcn/UI         │
│  React Hook Form │ Zod Validation  │  Recharts       │  Lucide Icons      │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND LAYER                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  Node.js 20 LTS  │ Express.js 4.x  │  TypeScript     │  Mongoose 8.x      │
│  JWT Auth        │ Passport.js     │  Helmet         │  Morgan Logger     │
│  Node-Cron       │ Bull Queue      │  Socket.io      │  Winston Logger    │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATABASE LAYER                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  MongoDB 7.x     │ Redis 7.x       │  Elasticsearch  │  S3 (File Storage) │
│  (Primary DB)    │ (Cache/Queue)   │  (Search/Intel) │  (Recordings)      │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL INTEGRATIONS                                │
├─────────────────────────────────────────────────────────────────────────────┤
│  SendGrid/SES    │ LinkedIn API    │  Twitter API    │  Twilio/WebRTC     │
│  (Email)         │ (Social)        │  (Social)       │  (Calls/CTI)       │
│  OpenAI GPT-4    │ News APIs       │  Google NLP     │  AWS Transcribe    │
│  (AI Summaries)  │ (Intelligence)  │ (Sentiment)     │ (Transcription)    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Package Dependencies

#### Frontend (package.json)
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2",
    "@tanstack/react-query": "^5.56.2",
    "zustand": "^4.5.0",
    "axios": "^1.7.0",
    "socket.io-client": "^4.7.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-tabs": "^1.0.4",
    "tailwindcss": "^3.4.0",
    "lucide-react": "^0.454.0",
    "recharts": "^2.12.0",
    "date-fns": "^3.6.0",
    "zod": "^3.23.0",
    "react-hook-form": "^7.53.0"
  }
}
```

#### Backend (package.json)
```json
{
  "dependencies": {
    "express": "^4.19.0",
    "mongoose": "^8.5.0",
    "mongodb": "^6.8.0",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "bull": "^4.12.0",
    "node-cron": "^3.0.3",
    "socket.io": "^4.7.5",
    "winston": "^3.13.0",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "@sendgrid/mail": "^8.1.0",
    "openai": "^4.55.0",
    "redis": "^4.6.0"
  }
}
```

---

## 5. High-Level Architecture

### 5.1 System Architecture Diagram

```
                                    ┌─────────────────┐
                                    │   CDN (CloudFlare)   │
                                    └────────┬────────┘
                                             │
                                             ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                              LOAD BALANCER (nginx/ALB)                          │
└────────────────────────────────────────────────────────────────────────────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    │                        │                        │
                    ▼                        ▼                        ▼
           ┌─────────────┐          ┌─────────────┐          ┌─────────────┐
           │   React     │          │   React     │          │   React     │
           │   App #1    │          │   App #2    │          │   App #N    │
           │   (Static)  │          │   (Static)  │          │   (Static)  │
           └─────────────┘          └─────────────┘          └─────────────┘
                    │                        │                        │
                    └────────────────────────┼────────────────────────┘
                                             │
                                             ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY (Kong/Express)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Rate Limit   │  │ Auth/JWT     │  │ Request Log  │  │ API Version  │       │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘       │
└────────────────────────────────────────────────────────────────────────────────┘
                                             │
          ┌──────────────┬──────────────┬────┴────┬──────────────┬──────────────┐
          │              │              │         │              │              │
          ▼              ▼              ▼         ▼              ▼              ▼
    ┌──────────┐   ┌──────────┐  ┌──────────┐ ┌──────────┐ ┌──────────┐  ┌──────────┐
    │  Auth    │   │  Email   │  │  Social  │ │  Intel   │ │  Calls   │  │  Core    │
    │ Service  │   │ Service  │  │ Service  │ │ Service  │ │ Service  │  │  CRM     │
    └──────────┘   └──────────┘  └──────────┘ └──────────┘ └──────────┘  └──────────┘
          │              │              │           │            │             │
          └──────────────┴──────────────┴─────┬─────┴────────────┴─────────────┘
                                              │
                                              ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                              MESSAGE BROKER (Redis/RabbitMQ)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Email Queue  │  │ Webhook Queue│  │ Notify Queue │  │ Process Queue│       │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘       │
└────────────────────────────────────────────────────────────────────────────────┘
                                              │
          ┌───────────────┬───────────────────┼───────────────┬───────────────┐
          │               │                   │               │               │
          ▼               ▼                   ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐       ┌──────────┐    ┌──────────┐    ┌──────────┐
    │ MongoDB  │    │  Redis   │       │Elasticsearch│   │   S3     │    │  OpenAI  │
    │ Primary  │    │  Cache   │       │  (Search)  │   │ Storage  │    │  GPT-4   │
    └──────────┘    └──────────┘       └──────────┘    └──────────┘    └──────────┘
```

---

## 6. Component Architecture

### 6.1 Frontend Architecture (React)

```
src/
├── app/                          # App-level configuration
│   ├── App.tsx                   # Root component
│   ├── router.tsx                # Route definitions
│   └── providers.tsx             # Context providers
│
├── components/                   # Reusable UI components
│   ├── ui/                       # Base UI components (shadcn)
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── tabs.tsx
│   │   └── ...
│   │
│   ├── occasion-email/           # Feature 1: Occasion-Based Email
│   │   ├── ImportantDatesSection.tsx
│   │   ├── ImportantDateCard.tsx
│   │   ├── AddDateDialog.tsx
│   │   └── EmailTemplateSelector.tsx
│   │
│   ├── social-profile/           # Feature 2: Social Profile
│   │   ├── SocialProfilesSection.tsx
│   │   ├── ConnectedProfiles.tsx
│   │   ├── ActivityFeed.tsx
│   │   └── ProfileDetailDialog.tsx
│   │
│   ├── intelligence/             # Feature 3: Intelligence
│   │   ├── IntelligenceSection.tsx
│   │   ├── NewsAlertCard.tsx
│   │   ├── CompetitiveIntelSection.tsx
│   │   └── SubscriptionsPanel.tsx
│   │
│   └── call/                     # Feature 4: Calls
│       ├── CallsSection.tsx
│       ├── UpcomingCallCard.tsx
│       ├── CallHistoryList.tsx
│       ├── TranscriptViewer.tsx
│       └── AIInsightsPanel.tsx
│
├── pages/                        # Route pages
│   ├── Dashboard.tsx
│   ├── Contacts.tsx
│   ├── EnterpriseFeatures.tsx
│   └── ...
│
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts
│   ├── useContacts.ts
│   ├── useImportantDates.ts
│   ├── useSocialProfiles.ts
│   ├── useIntelligence.ts
│   └── useCalls.ts
│
├── services/                     # API service layer
│   ├── api.ts                    # Axios instance
│   ├── authService.ts
│   ├── contactService.ts
│   ├── emailService.ts
│   ├── socialService.ts
│   ├── intelligenceService.ts
│   └── callService.ts
│
├── stores/                       # Zustand state management
│   ├── authStore.ts
│   ├── contactStore.ts
│   └── notificationStore.ts
│
├── types/                        # TypeScript type definitions
│   ├── contact.ts
│   ├── importantDate.ts
│   ├── socialProfile.ts
│   ├── intelligence.ts
│   └── call.ts
│
└── utils/                        # Utility functions
    ├── dateUtils.ts
    ├── formatters.ts
    └── validators.ts
```

### 6.2 Backend Architecture (Node.js/Express)

```
server/
├── src/
│   ├── app.ts                    # Express app setup
│   ├── server.ts                 # Server entry point
│   │
│   ├── config/                   # Configuration
│   │   ├── database.ts           # MongoDB connection
│   │   ├── redis.ts              # Redis connection
│   │   ├── passport.ts           # Auth strategies
│   │   └── env.ts                # Environment variables
│   │
│   ├── middleware/               # Express middleware
│   │   ├── auth.ts               # JWT authentication
│   │   ├── rateLimit.ts          # Rate limiting
│   │   ├── validate.ts           # Request validation
│   │   ├── errorHandler.ts       # Global error handler
│   │   └── logger.ts             # Request logging
│   │
│   ├── models/                   # Mongoose models
│   │   ├── User.ts
│   │   ├── Contact.ts
│   │   ├── ImportantDate.ts
│   │   ├── SocialProfile.ts
│   │   ├── NewsAlert.ts
│   │   ├── Call.ts
│   │   └── CallTranscript.ts
│   │
│   ├── routes/                   # API routes
│   │   ├── index.ts              # Route aggregator
│   │   ├── auth.routes.ts
│   │   ├── contacts.routes.ts
│   │   ├── dates.routes.ts
│   │   ├── social.routes.ts
│   │   ├── intelligence.routes.ts
│   │   └── calls.routes.ts
│   │
│   ├── controllers/              # Route controllers
│   │   ├── authController.ts
│   │   ├── contactController.ts
│   │   ├── dateController.ts
│   │   ├── socialController.ts
│   │   ├── intelligenceController.ts
│   │   └── callController.ts
│   │
│   ├── services/                 # Business logic
│   │   ├── authService.ts
│   │   ├── emailService.ts       # Email sending (SendGrid)
│   │   ├── schedulerService.ts   # Cron job scheduling
│   │   ├── socialService.ts      # Social API integration
│   │   ├── intelligenceService.ts # News aggregation
│   │   ├── callService.ts        # CTI integration
│   │   ├── transcriptionService.ts # Audio transcription
│   │   └── aiService.ts          # OpenAI integration
│   │
│   ├── jobs/                     # Background jobs (Bull)
│   │   ├── emailQueue.ts
│   │   ├── socialSyncQueue.ts
│   │   ├── newsAggregatorQueue.ts
│   │   └── transcriptionQueue.ts
│   │
│   ├── integrations/             # External API adapters
│   │   ├── sendgrid/
│   │   ├── linkedin/
│   │   ├── twitter/
│   │   ├── twilio/
│   │   ├── openai/
│   │   └── newsapi/
│   │
│   ├── utils/                    # Utility functions
│   │   ├── logger.ts
│   │   ├── crypto.ts
│   │   └── validators.ts
│   │
│   └── types/                    # TypeScript types
│       ├── express.d.ts
│       └── models.ts
│
├── tests/                        # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
└── scripts/                      # Utility scripts
    ├── seed.ts
    └── migrate.ts
```

---

## 7. Data Architecture

### 7.1 MongoDB Schema Design

#### Contact Schema
```javascript
// models/Contact.ts
const ContactSchema = new Schema({
  _id: ObjectId,
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  company: { type: ObjectId, ref: 'Account' },
  title: String,
  
  // Feature 1: Important Dates
  importantDates: [{
    type: { type: String, enum: ['birthday', 'anniversary', 'custom'] },
    date: Date,
    sendTime: String,
    emailTemplate: { type: ObjectId, ref: 'EmailTemplate' },
    repeatAnnually: { type: Boolean, default: true },
    optOut: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    lastSent: Date,
    createdAt: Date
  }],
  
  // Feature 2: Social Profiles
  socialProfiles: [{
    platform: { type: String, enum: ['linkedin', 'twitter', 'facebook'] },
    profileUrl: String,
    profileId: String,
    displayName: String,
    headline: String,
    avatarUrl: String,
    followers: Number,
    lastSynced: Date,
    isVerified: { type: Boolean, default: false }
  }],
  
  // Metadata
  owner: { type: ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
}, {
  timestamps: true,
  indexes: [
    { email: 1 },
    { company: 1 },
    { 'importantDates.date': 1 },
    { 'socialProfiles.platform': 1 }
  ]
});
```

#### Call Schema
```javascript
// models/Call.ts
const CallSchema = new Schema({
  _id: ObjectId,
  contact: { type: ObjectId, ref: 'Contact', required: true },
  account: { type: ObjectId, ref: 'Account' },
  user: { type: ObjectId, ref: 'User', required: true },
  
  // Call Details
  type: { type: String, enum: ['inbound', 'outbound', 'scheduled'] },
  status: { type: String, enum: ['scheduled', 'in-progress', 'completed', 'missed', 'cancelled'] },
  scheduledAt: Date,
  startedAt: Date,
  endedAt: Date,
  duration: Number, // in seconds
  
  // Recording & Transcript
  recordingUrl: String,
  recordingDuration: Number,
  transcript: {
    text: String,
    segments: [{
      speaker: String,
      text: String,
      startTime: Number,
      endTime: Number,
      confidence: Number
    }],
    language: String,
    processedAt: Date
  },
  
  // AI Analysis
  aiSummary: {
    keyPoints: [String],
    actionItems: [{
      description: String,
      assignee: { type: ObjectId, ref: 'User' },
      dueDate: Date,
      completed: Boolean
    }],
    sentiment: {
      overall: { type: String, enum: ['positive', 'neutral', 'negative'] },
      score: Number,
      breakdown: {
        positive: Number,
        neutral: Number,
        negative: Number
      }
    },
    topics: [String],
    nextSteps: String,
    generatedAt: Date
  },
  
  // CTI Integration
  ctiProvider: { type: String, enum: ['twilio', 'ringcentral', 'zoom'] },
  externalCallId: String,
  dialedNumber: String,
  
  // Metadata
  notes: String,
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});
```

#### NewsAlert Schema (Intelligence)
```javascript
// models/NewsAlert.ts
const NewsAlertSchema = new Schema({
  _id: ObjectId,
  account: { type: ObjectId, ref: 'Account' },
  
  // Article Details
  title: { type: String, required: true },
  summary: String,
  content: String,
  sourceUrl: { type: String, required: true },
  sourceName: String,
  publishedAt: Date,
  imageUrl: String,
  
  // Classification
  category: { 
    type: String, 
    enum: ['earnings', 'product_launch', 'ma', 'leadership', 'regulatory', 'market'] 
  },
  tags: [String],
  relevanceScore: { type: Number, min: 0, max: 100 },
  
  // Sentiment Analysis
  sentiment: {
    label: { type: String, enum: ['positive', 'neutral', 'negative'] },
    score: Number
  },
  
  // User Interactions
  interactions: [{
    user: { type: ObjectId, ref: 'User' },
    action: { type: String, enum: ['viewed', 'shared', 'dismissed', 'opportunity_created'] },
    timestamp: Date,
    opportunityId: { type: ObjectId, ref: 'Opportunity' }
  }],
  
  // Metadata
  isActive: { type: Boolean, default: true },
  expiresAt: Date,
  createdAt: { type: Date, default: Date.now }
});
```

### 7.2 Database Relationships

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATABASE ENTITY RELATIONSHIPS                        │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────┐         ┌───────────────┐         ┌──────────────┐
    │   User   │ 1 ───── N │   Contact   │ 1 ───── N │ImportantDate│
    └──────────┘           └───────────────┘         └──────────────┘
         │                        │
         │                        │ 1
         │                        │
         │                        ├───── N ┌─────────────┐
         │                        │        │SocialProfile│
         │                        │        └─────────────┘
         │                        │
         │                        │ 1
    ┌────┴────┐                   │
    │ Account │ 1 ────────────────┘
    └─────────┘
         │
         │ 1
         │
         ├───── N ┌───────────┐
         │        │ NewsAlert │
         │        └───────────┘
         │
         │ 1
         │
         └───── N ┌──────────┐ 1 ───── 1 ┌─────────────┐
                  │   Call   │           │ Transcript  │
                  └──────────┘           └─────────────┘
                       │
                       │ 1
                       │
                       └───── 1 ┌───────────┐
                               │ AISummary │
                               └───────────┘
```

### 7.3 Redis Cache Strategy

```javascript
// Key patterns for Redis caching

// Session & Auth
`session:${userId}` -> JSON (TTL: 24h)
`token:${refreshToken}` -> userId (TTL: 7d)

// Feature 1: Important Dates
`dates:contact:${contactId}` -> JSON[] (TTL: 1h)
`dates:upcoming:${userId}` -> JSON[] (TTL: 15m)

// Feature 2: Social Profiles
`social:profile:${contactId}` -> JSON[] (TTL: 6h)
`social:activity:${contactId}` -> JSON[] (TTL: 30m)

// Feature 3: Intelligence
`intel:news:${accountId}` -> JSON[] (TTL: 15m)
`intel:alerts:${userId}` -> JSON[] (TTL: 5m)

// Feature 4: Calls
`call:active:${userId}` -> JSON (TTL: 2h)
`call:transcript:${callId}` -> JSON (TTL: 24h)
```

---

## 8. API Architecture

### 8.1 RESTful API Design

#### Base URL Structure
```
https://api.sequelstring.com/v1/
```

#### Feature 1: Occasion-Based Email APIs
```
# Important Dates
GET    /contacts/:contactId/dates              # List all dates
POST   /contacts/:contactId/dates              # Add new date
GET    /contacts/:contactId/dates/:dateId      # Get date details
PUT    /contacts/:contactId/dates/:dateId      # Update date
DELETE /contacts/:contactId/dates/:dateId      # Delete date

# Email Templates
GET    /email-templates                        # List templates
GET    /email-templates/:id                    # Get template
POST   /email-templates                        # Create template
PUT    /email-templates/:id                    # Update template

# Email Scheduling
POST   /contacts/:contactId/dates/:dateId/send # Manual send
GET    /emails/scheduled                       # View scheduled emails
```

#### Feature 2: Social Profile APIs
```
# Social Profiles
GET    /contacts/:contactId/social             # List social profiles
POST   /contacts/:contactId/social             # Connect new profile
DELETE /contacts/:contactId/social/:profileId  # Disconnect profile
POST   /contacts/:contactId/social/:profileId/sync # Force sync

# Activity Feed
GET    /contacts/:contactId/social/activity    # Get activity feed
GET    /contacts/:contactId/social/posts       # Get recent posts
```

#### Feature 3: Intelligence APIs
```
# News & Alerts
GET    /accounts/:accountId/news               # Get news for account
GET    /intelligence/feed                      # User's intelligence feed
POST   /intelligence/alerts/:alertId/action    # Take action on alert

# Subscriptions
GET    /intelligence/subscriptions             # Get subscriptions
POST   /intelligence/subscriptions             # Create subscription
PUT    /intelligence/subscriptions/:id         # Update subscription
DELETE /intelligence/subscriptions/:id         # Remove subscription
```

#### Feature 4: Calls APIs
```
# Calls
GET    /calls                                  # List all calls
POST   /calls                                  # Schedule new call
GET    /calls/:callId                          # Get call details
PUT    /calls/:callId                          # Update call
DELETE /calls/:callId                          # Cancel call

# Recordings & Transcripts
GET    /calls/:callId/recording                # Get recording URL
GET    /calls/:callId/transcript               # Get transcript
POST   /calls/:callId/transcript/generate      # Generate transcript

# AI Analysis
GET    /calls/:callId/ai-summary               # Get AI summary
POST   /calls/:callId/ai-summary/generate      # Generate new summary
GET    /calls/:callId/ai-summary/action-items  # Get action items
```

### 8.2 API Response Format

```typescript
// Standard success response
interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
}

// Standard error response
interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

// Example response
{
  "success": true,
  "data": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "type": "birthday",
    "date": "1990-03-15",
    "sendTime": "09:00",
    "emailTemplate": "birthday-corporate",
    "repeatAnnually": true,
    "isActive": true
  }
}
```

### 8.3 WebSocket Events (Real-time)

```typescript
// Socket.io event handlers

// Calls - Real-time updates
socket.on('call:started', (data: CallEvent) => {});
socket.on('call:ended', (data: CallEvent) => {});
socket.on('call:transcript:update', (data: TranscriptChunk) => {});

// Intelligence - Live alerts
socket.on('intel:new-alert', (data: NewsAlert) => {});
socket.on('intel:alert-update', (data: AlertUpdate) => {});

// Social - Activity updates
socket.on('social:new-activity', (data: SocialActivity) => {});
socket.on('social:profile-synced', (data: ProfileSync) => {});

// Notifications
socket.on('notification', (data: Notification) => {});
```

---

## 9. Feature-Specific Architecture

### 9.1 Feature 1: Occasion-Based Auto Email

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    OCCASION-BASED EMAIL ARCHITECTURE                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│    React     │    │   Express    │    │   MongoDB    │    │   SendGrid   │
│  Frontend    │───▶│    API       │───▶│   Database   │    │   Email      │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
                           │                                       ▲
                           │                                       │
                           ▼                                       │
                    ┌──────────────┐    ┌──────────────┐          │
                    │  Scheduler   │───▶│  Bull Queue  │──────────┘
                    │  (node-cron) │    │  (Email Jobs)│
                    └──────────────┘    └──────────────┘

FLOW:
1. User creates important date via React UI
2. API stores date in MongoDB
3. Node-cron scheduler checks daily for upcoming dates
4. Matching dates are queued in Bull (Redis)
5. Email worker processes queue and sends via SendGrid
6. Delivery status is updated in MongoDB
```

**Key Components:**
- **SchedulerService**: Runs daily cron job at midnight
- **EmailQueue**: Bull queue for reliable email delivery
- **TemplateEngine**: Handlebars for email templates
- **SendGridAdapter**: Integration with SendGrid API

### 9.2 Feature 2: Social Profile Integration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOCIAL PROFILE INTEGRATION ARCHITECTURE                   │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│    React     │    │   Express    │    │   MongoDB    │
│  Frontend    │───▶│    API       │───▶│   Database   │
└──────────────┘    └──────────────┘    └──────────────┘
                           │                   ▲
                    ┌──────┴──────┐            │
                    ▼             ▼            │
             ┌──────────┐  ┌──────────┐       │
             │ LinkedIn │  │ Twitter  │       │
             │   API    │  │   API    │       │
             └──────────┘  └──────────┘       │
                    │             │           │
                    ▼             ▼           │
             ┌────────────────────────┐       │
             │    Sync Queue (Bull)   │───────┘
             │  - Profile data sync   │
             │  - Activity fetch      │
             │  - Rate limit handling │
             └────────────────────────┘

FLOW:
1. User connects social profile via OAuth
2. OAuth callback stores tokens securely
3. Initial profile data fetched and stored
4. Periodic sync jobs update activity feed
5. Real-time WebSocket updates for new activity
```

**Key Components:**
- **OAuthService**: Handles LinkedIn/Twitter OAuth flow
- **SocialSyncQueue**: Background job for profile syncing
- **ActivityAggregator**: Combines activities from multiple platforms
- **RateLimitManager**: Respects API rate limits

### 9.3 Feature 3: Public Domain Intelligence

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PUBLIC DOMAIN INTELLIGENCE ARCHITECTURE                   │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│    React     │    │   Express    │    │   MongoDB    │
│  Frontend    │───▶│    API       │───▶│   Database   │
└──────────────┘    └──────────────┘    └──────────────┘
                           ▲                   ▲
                           │                   │
                    ┌──────┴───────────────────┴──────┐
                    │        Intelligence Engine       │
                    │  ┌────────────────────────────┐ │
                    │  │  News Aggregator Service   │ │
                    │  │  - NewsAPI                 │ │
                    │  │  - Google News             │ │
                    │  │  - RSS Feeds               │ │
                    │  └────────────────────────────┘ │
                    │  ┌────────────────────────────┐ │
                    │  │  Content Processor         │ │
                    │  │  - NLP Classification      │ │
                    │  │  - Sentiment Analysis      │ │
                    │  │  - Entity Extraction       │ │
                    │  └────────────────────────────┘ │
                    │  ┌────────────────────────────┐ │
                    │  │  Matching Engine           │ │
                    │  │  - Account matching        │ │
                    │  │  - Keyword rules           │ │
                    │  │  - Relevance scoring       │ │
                    │  └────────────────────────────┘ │
                    └─────────────────────────────────┘
                                    │
                                    ▼
                    ┌─────────────────────────────────┐
                    │         Elasticsearch           │
                    │   - Full-text search            │
                    │   - Faceted filtering           │
                    │   - Real-time indexing          │
                    └─────────────────────────────────┘

FLOW:
1. News Aggregator fetches from multiple sources (every 15 min)
2. Content Processor analyzes and classifies articles
3. Matching Engine links articles to accounts
4. Articles indexed in Elasticsearch for fast search
5. Users see personalized intelligence feed
6. Real-time WebSocket for breaking news alerts
```

**Key Components:**
- **NewsAggregator**: Multi-source news collection
- **NLPProcessor**: OpenAI-powered text analysis
- **MatchingEngine**: Rules-based article-to-account matching
- **AlertManager**: Real-time notification delivery

### 9.4 Feature 4: Calls Integration with AI

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CALLS INTEGRATION WITH AI ARCHITECTURE                    │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│    React     │    │   Express    │    │   MongoDB    │    │     S3       │
│  Frontend    │───▶│    API       │───▶│   Database   │    │  Recordings  │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
       │                   │                                       │
       │                   │                                       │
       ▼                   ▼                                       │
┌──────────────┐    ┌──────────────┐                              │
│  WebRTC /    │    │   Twilio     │                              │
│  SIP Client  │───▶│   CTI API    │──────────────────────────────┘
└──────────────┘    └──────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AI PROCESSING PIPELINE                                │
│                                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                  │
│  │    Audio     │    │  Transcribe  │    │   OpenAI     │                  │
│  │   Storage    │───▶│   (Whisper)  │───▶│   GPT-4      │                  │
│  │     (S3)     │    │              │    │  Analysis    │                  │
│  └──────────────┘    └──────────────┘    └──────────────┘                  │
│         │                   │                   │                           │
│         │                   ▼                   ▼                           │
│         │            ┌─────────────────────────────────┐                   │
│         │            │        AI Summary Output         │                   │
│         │            │  - Key Points                    │                   │
│         │            │  - Action Items                  │                   │
│         │            │  - Sentiment Analysis            │                   │
│         │            │  - Next Steps                    │                   │
│         │            └─────────────────────────────────┘                   │
│         │                          │                                        │
│         └──────────────────────────┴───────▶ MongoDB                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

FLOW:
1. User initiates/receives call via CTI integration
2. Call audio streamed to Twilio/provider
3. Recording stored in S3 after call ends
4. Transcription job queued (Bull queue)
5. Whisper API transcribes audio to text
6. GPT-4 analyzes transcript for:
   - Key discussion points
   - Action items with assignees
   - Sentiment analysis
   - Recommended next steps
7. Results stored in MongoDB
8. Real-time UI update via WebSocket
```

**Key Components:**
- **CTIAdapter**: Twilio/RingCentral/Zoom integration
- **RecordingService**: Handles audio storage in S3
- **TranscriptionQueue**: Async audio-to-text processing
- **AIAnalyzer**: GPT-4 powered call analysis
- **ActionItemTracker**: Extracts and tracks follow-ups

---

## 10. Security Architecture

### 10.1 Authentication & Authorization

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SECURITY ARCHITECTURE                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│    Client    │ ──JWT──▶│  API Gateway │ ──────▶ │   Services   │
└──────────────┘         └──────────────┘         └──────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Auth Middleware   │
                    │  ┌───────────────┐  │
                    │  │ JWT Verify    │  │
                    │  │ Role Check    │  │
                    │  │ Permission    │  │
                    │  │ Rate Limit    │  │
                    │  └───────────────┘  │
                    └─────────────────────┘
```

### 10.2 Security Measures

| Layer | Security Measure | Implementation |
|-------|------------------|----------------|
| **Transport** | TLS 1.3 | HTTPS everywhere |
| **API** | JWT + Refresh Tokens | Passport.js + Redis |
| **Data** | Field-level encryption | bcryptjs for passwords |
| **Application** | Input validation | Zod + express-validator |
| **Infrastructure** | WAF + DDoS protection | CloudFlare/AWS Shield |

### 10.3 OAuth Integrations Security

```typescript
// Secure token storage for social integrations
interface SecureTokenStore {
  // Encryption at rest
  encryptionKey: process.env.TOKEN_ENCRYPTION_KEY;
  algorithm: 'aes-256-gcm';
  
  // Token handling
  storeToken(userId: string, provider: string, tokens: OAuthTokens): Promise<void>;
  getToken(userId: string, provider: string): Promise<OAuthTokens | null>;
  refreshToken(userId: string, provider: string): Promise<OAuthTokens>;
  revokeToken(userId: string, provider: string): Promise<void>;
}
```

---

## 11. Deployment Architecture

### 11.1 Container Architecture (Docker)

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Frontend
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://api:4000
    depends_on:
      - api

  # API Gateway
  api:
    build: ./server
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/sequelstring
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongo
      - redis

  # Background Workers
  worker:
    build: ./server
    command: npm run worker
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/sequelstring
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongo
      - redis

  # Databases
  mongo:
    image: mongo:7
    volumes:
      - mongo_data:/data/db
    ports:
      - "27017:27017"

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"

  elasticsearch:
    image: elasticsearch:8.11.0
    environment:
      - discovery.type=single-node
    volumes:
      - es_data:/usr/share/elasticsearch/data
    ports:
      - "9200:9200"

volumes:
  mongo_data:
  redis_data:
  es_data:
```

### 11.2 Kubernetes Deployment

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         KUBERNETES ARCHITECTURE                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              Kubernetes Cluster                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         Ingress Controller                           │   │
│  │                      (nginx-ingress / ALB)                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│       ┌────────────────────────────┼────────────────────────────┐          │
│       │                            │                            │          │
│       ▼                            ▼                            ▼          │
│  ┌──────────┐               ┌──────────┐               ┌──────────┐       │
│  │ Frontend │               │   API    │               │  Worker  │       │
│  │ Service  │               │ Service  │               │ Service  │       │
│  │ (3 pods) │               │ (5 pods) │               │ (3 pods) │       │
│  └──────────┘               └──────────┘               └──────────┘       │
│       │                            │                            │          │
│       └────────────────────────────┼────────────────────────────┘          │
│                                    │                                        │
│  ┌─────────────────────────────────┼───────────────────────────────────┐   │
│  │                          StatefulSets                                │   │
│  │  ┌──────────┐       ┌──────────┐       ┌──────────────┐            │   │
│  │  │ MongoDB  │       │  Redis   │       │Elasticsearch │            │   │
│  │  │ Replica  │       │ Cluster  │       │   Cluster    │            │   │
│  │  │   Set    │       │          │       │              │            │   │
│  │  └──────────┘       └──────────┘       └──────────────┘            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                          ConfigMaps & Secrets                        │   │
│  │  - API Keys (SendGrid, Twilio, OpenAI)                              │   │
│  │  - Database credentials                                              │   │
│  │  - OAuth client secrets                                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 11.3 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Tests
        run: |
          npm ci
          npm run test
          npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Build Docker Images
        run: |
          docker build -t sequelstring/frontend:${{ github.sha }} ./frontend
          docker build -t sequelstring/api:${{ github.sha }} ./server
          
      - name: Push to Registry
        run: |
          docker push sequelstring/frontend:${{ github.sha }}
          docker push sequelstring/api:${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/frontend frontend=sequelstring/frontend:${{ github.sha }}
          kubectl set image deployment/api api=sequelstring/api:${{ github.sha }}
          kubectl rollout status deployment/frontend
          kubectl rollout status deployment/api
```

---

## 12. Scalability & Performance

### 12.1 Horizontal Scaling Strategy

| Component | Scaling Trigger | Min/Max Pods | Strategy |
|-----------|-----------------|--------------|----------|
| Frontend | CPU > 70% | 2-10 | Stateless, CDN |
| API | CPU > 70%, RPS > 1000 | 3-20 | Stateless, LB |
| Worker | Queue depth > 100 | 2-10 | Queue-based |
| MongoDB | Storage > 80% | 3 (replica) | Sharding |
| Redis | Memory > 80% | 3 (cluster) | Cluster mode |

### 12.2 Caching Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CACHING LAYERS                                     │
└─────────────────────────────────────────────────────────────────────────────┘

Layer 1: Browser Cache (Static Assets)
├── TTL: 1 year for versioned assets
├── Cache-Control: public, max-age=31536000
└── CDN: CloudFlare/CloudFront

Layer 2: CDN Cache (API Responses)
├── TTL: 5-15 minutes for read-heavy endpoints
├── Vary: Authorization (per-user caching)
└── Stale-while-revalidate support

Layer 3: Redis Cache (Application)
├── Session data: 24 hours
├── API responses: 5-60 minutes
├── Real-time data: 30 seconds
└── Background job results: 1 hour

Layer 4: Database Query Cache (MongoDB)
├── Frequent queries cached
├── Index optimization
└── Read replicas for read-heavy ops
```

### 12.3 Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **API Response Time (P95)** | < 200ms | New Relic APM |
| **Page Load Time** | < 2s | Lighthouse |
| **Time to First Byte** | < 100ms | Real User Monitoring |
| **Database Query Time (P95)** | < 50ms | MongoDB Profiler |
| **WebSocket Latency** | < 50ms | Custom metrics |

---

## 13. Monitoring & Observability

### 13.1 Observability Stack

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         OBSERVABILITY ARCHITECTURE                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Metrics    │     │    Logs      │     │   Traces     │
│  (Prometheus)│     │ (ELK Stack)  │     │  (Jaeger)    │
└──────────────┘     └──────────────┘     └──────────────┘
       │                    │                    │
       └────────────────────┼────────────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │   Grafana    │
                    │  Dashboards  │
                    └──────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │  Alerting    │
                    │ (PagerDuty)  │
                    └──────────────┘
```

### 13.2 Key Metrics to Monitor

#### Feature 1: Occasion-Based Email
- Emails sent per day
- Email delivery success rate
- Queue depth and processing time
- Template rendering errors

#### Feature 2: Social Profile
- Profile sync success rate
- API rate limit remaining
- Activity feed latency
- OAuth token refresh rate

#### Feature 3: Intelligence
- News articles processed per hour
- Matching accuracy (precision/recall)
- Alert delivery latency
- Elasticsearch query performance

#### Feature 4: Calls
- Active calls count
- Transcription processing time
- AI summary generation time
- Recording storage utilization

### 13.3 Alerting Rules

```yaml
# prometheus-alerts.yml
groups:
  - name: api_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High API error rate detected"
          
      - alert: HighLatency
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 0.5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "API latency exceeding 500ms (P95)"
          
      - alert: EmailQueueBacklog
        expr: bull_queue_waiting{queue="email"} > 1000
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Email queue backlog growing"
```

---

## 14. Summary

This MERN stack architecture provides a robust, scalable foundation for the SequelString CRM enterprise features:

| Aspect | Implementation |
|--------|----------------|
| **Frontend** | React 18 + TypeScript + Vite + Zustand + React Query |
| **Backend** | Node.js + Express + TypeScript + Mongoose |
| **Database** | MongoDB (primary) + Redis (cache) + Elasticsearch (search) |
| **Real-time** | Socket.io for live updates |
| **Background Jobs** | Bull queues for async processing |
| **AI/ML** | OpenAI GPT-4 for summaries, Whisper for transcription |
| **Infrastructure** | Docker + Kubernetes + CI/CD |
| **Observability** | Prometheus + Grafana + ELK Stack |

### Architecture Decision Records (ADRs)

1. **ADR-001**: MERN stack chosen for rapid development and JavaScript ecosystem
2. **ADR-002**: Microservices for independent scaling of features
3. **ADR-003**: MongoDB for flexible schema evolution
4. **ADR-004**: Redis for caching and job queues (Bull)
5. **ADR-005**: OpenAI GPT-4 for call summarization over alternatives
6. **ADR-006**: Kubernetes for container orchestration

---

**Document Version History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-29 | Senior Tech Architect | Initial architecture document |

---

*This architecture document is a living document and should be updated as the system evolves.*
