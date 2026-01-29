# 📊 Database Schema Design
## SequelString CRM - MongoDB Collections

---

## Collection: `contacts`

```javascript
{
  _id: ObjectId("65f1a2b3c4d5e..."),
  
  // Basic Info
  firstName: "Rajesh",
  lastName: "Sharma",
  email: "rajesh.sharma@tatasteel.com",
  phone: "+91-9876543210",
  title: "Chief Technology Officer",
  
  // Relationships
  accountId: ObjectId("65f1a2b3..."),  // Reference to Account
  ownerId: ObjectId("65f1a2b3..."),    // Reference to User
  
  // Feature 1: Important Dates (Embedded)
  importantDates: [
    {
      _id: ObjectId("65f1a2b3..."),
      type: "birthday",              // birthday | anniversary | work_anniversary | custom
      label: "Birthday",
      date: "03-15",                 // DD-MM format
      year: 1985,                    // Optional birth year
      sendTime: "09:00",
      timezone: "Asia/Kolkata",
      emailTemplateId: ObjectId("65f1a2b3..."),
      repeatAnnually: true,
      optOut: false,
      isActive: true,
      lastSentAt: ISODate("2025-03-15T09:00:00Z"),
      nextSendAt: ISODate("2026-03-15T09:00:00Z"),
      createdAt: ISODate("2025-01-15T10:30:00Z"),
      updatedAt: ISODate("2025-01-15T10:30:00Z")
    }
  ],
  
  // Feature 2: Social Profiles (Embedded)
  socialProfiles: [
    {
      _id: ObjectId("65f1a2b3..."),
      platform: "linkedin",           // linkedin | twitter | facebook
      profileUrl: "https://linkedin.com/in/rajesh-sharma-cto",
      profileId: "rajesh-sharma-cto",
      displayName: "Rajesh Sharma",
      headline: "CTO at Tata Steel | Digital Transformation Leader",
      avatarUrl: "https://media.licdn.com/...",
      followers: 15420,
      connections: 500,
      isVerified: true,
      accessToken: "encrypted_token...",  // Encrypted OAuth token
      refreshToken: "encrypted_token...",
      tokenExpiresAt: ISODate("2026-02-28T00:00:00Z"),
      lastSyncedAt: ISODate("2026-01-29T06:00:00Z"),
      syncStatus: "success",          // success | failed | pending
      createdAt: ISODate("2025-06-10T14:20:00Z")
    }
  ],
  
  // Metadata
  source: "manual",                   // manual | import | api
  tags: ["enterprise", "decision-maker"],
  customFields: {
    department: "Technology",
    reportsTo: "CEO"
  },
  
  createdAt: ISODate("2025-01-10T08:00:00Z"),
  updatedAt: ISODate("2026-01-29T10:00:00Z"),
  createdBy: ObjectId("65f1a2b3..."),
  updatedBy: ObjectId("65f1a2b3...")
}
```

### Indexes
```javascript
db.contacts.createIndex({ email: 1 }, { unique: true });
db.contacts.createIndex({ accountId: 1 });
db.contacts.createIndex({ ownerId: 1 });
db.contacts.createIndex({ "importantDates.date": 1 });
db.contacts.createIndex({ "importantDates.nextSendAt": 1 });
db.contacts.createIndex({ "socialProfiles.platform": 1 });
db.contacts.createIndex({ "socialProfiles.profileId": 1 });
db.contacts.createIndex({ tags: 1 });
db.contacts.createIndex({ createdAt: -1 });
```

---

## Collection: `accounts`

```javascript
{
  _id: ObjectId("65f1a2b3c4d5e..."),
  
  // Basic Info
  name: "Tata Steel Ltd",
  website: "https://www.tatasteel.com",
  industry: "Manufacturing",
  employees: "10000+",
  annualRevenue: "$21.06B",
  
  // Address
  address: {
    street: "Bombay House, 24 Homi Mody Street",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    postalCode: "400001"
  },
  
  // Intelligence Subscriptions (Feature 3)
  intelligenceConfig: {
    newsSubscription: true,
    alertFrequency: "realtime",      // realtime | daily | weekly
    keywords: ["steel", "manufacturing", "sustainability"],
    competitors: ["JSW Steel", "SAIL", "ArcelorMittal"],
    categories: ["earnings", "product_launch", "leadership", "ma"],
    lastAlertAt: ISODate("2026-01-29T09:00:00Z")
  },
  
  // Relationships
  ownerId: ObjectId("65f1a2b3..."),
  parentAccountId: ObjectId("65f1a2b3..."),  // For subsidiaries
  
  // Metadata
  type: "enterprise",                // prospect | customer | partner | enterprise
  status: "active",
  createdAt: ISODate("2025-01-05T12:00:00Z"),
  updatedAt: ISODate("2026-01-29T10:00:00Z")
}
```

### Indexes
```javascript
db.accounts.createIndex({ name: 1 });
db.accounts.createIndex({ ownerId: 1 });
db.accounts.createIndex({ industry: 1 });
db.accounts.createIndex({ "intelligenceConfig.newsSubscription": 1 });
```

---

## Collection: `calls`

```javascript
{
  _id: ObjectId("65f1a2b3c4d5e..."),
  
  // Participants
  contactId: ObjectId("65f1a2b3..."),
  accountId: ObjectId("65f1a2b3..."),
  userId: ObjectId("65f1a2b3..."),
  
  // Call Details
  type: "outbound",                  // inbound | outbound | scheduled
  status: "completed",               // scheduled | in-progress | completed | missed | cancelled
  direction: "outbound",
  
  // Timing
  scheduledAt: ISODate("2026-01-29T10:00:00Z"),
  startedAt: ISODate("2026-01-29T10:02:15Z"),
  endedAt: ISODate("2026-01-29T10:47:30Z"),
  duration: 2715,                    // seconds
  
  // CTI Integration
  ctiProvider: "twilio",             // twilio | ringcentral | zoom | teams
  externalCallId: "CA123456789abc",
  dialedNumber: "+91-9876543210",
  callerNumber: "+1-555-123-4567",
  
  // Recording
  recording: {
    url: "s3://sequelstring-recordings/calls/2026/01/29/CA123456789abc.mp3",
    duration: 2715,
    size: 6547890,                   // bytes
    format: "mp3",
    status: "available"              // processing | available | deleted
  },
  
  // Transcript (Feature 4)
  transcript: {
    status: "completed",             // pending | processing | completed | failed
    language: "en-US",
    text: "Full transcript text...",
    confidence: 0.94,
    
    segments: [
      {
        speaker: "agent",
        speakerId: ObjectId("65f1a2b3..."),
        text: "Good morning, Mr. Sharma. How are you today?",
        startTime: 0.0,
        endTime: 3.5,
        confidence: 0.96
      },
      {
        speaker: "contact",
        speakerId: ObjectId("65f1a2b3..."),
        text: "I'm doing well, thank you. Let's discuss the Q4 projections.",
        startTime: 3.8,
        endTime: 8.2,
        confidence: 0.93
      }
      // ... more segments
    ],
    
    wordCount: 2847,
    processedAt: ISODate("2026-01-29T11:00:00Z"),
    processingTime: 45                // seconds
  },
  
  // AI Summary (Feature 4)
  aiSummary: {
    status: "completed",             // pending | processing | completed | failed
    model: "gpt-4-turbo",
    
    summary: "Discussed Q4 earnings projections and new steel plant expansion...",
    
    keyPoints: [
      "Q4 revenue projected at $5.8B, 12% YoY growth",
      "New Gujarat plant on track for Q2 2026 launch",
      "Sustainability initiatives reducing carbon by 15%",
      "Interested in CRM enterprise upgrade"
    ],
    
    actionItems: [
      {
        _id: ObjectId("65f1a2b3..."),
        description: "Send Q4 earnings presentation",
        assigneeId: ObjectId("65f1a2b3..."),
        dueDate: ISODate("2026-01-31T17:00:00Z"),
        priority: "high",
        status: "pending"            // pending | completed | cancelled
      },
      {
        _id: ObjectId("65f1a2b3..."),
        description: "Schedule follow-up demo for Feb",
        assigneeId: ObjectId("65f1a2b3..."),
        dueDate: ISODate("2026-02-05T10:00:00Z"),
        priority: "medium",
        status: "pending"
      }
    ],
    
    sentiment: {
      overall: "positive",           // positive | neutral | negative
      score: 0.78,
      breakdown: {
        positive: 0.65,
        neutral: 0.28,
        negative: 0.07
      },
      highlights: {
        positive: ["excited about partnership", "impressed with demo"],
        concerns: ["budget constraints in Q1"]
      }
    },
    
    topics: ["Q4 Earnings", "Plant Expansion", "Sustainability", "CRM Upgrade"],
    
    nextSteps: "Schedule product demo in first week of February. Prepare custom ROI analysis...",
    
    opportunities: [
      {
        type: "upsell",
        description: "Enterprise CRM upgrade discussed",
        estimatedValue: 250000,
        probability: 0.7
      }
    ],
    
    generatedAt: ISODate("2026-01-29T11:02:00Z"),
    processingTime: 12               // seconds
  },
  
  // User Notes
  notes: "Positive call. Decision expected by mid-Feb.",
  tags: ["enterprise", "high-priority", "q4-review"],
  
  // Metadata
  createdAt: ISODate("2026-01-29T09:55:00Z"),
  updatedAt: ISODate("2026-01-29T11:02:00Z"),
  createdBy: ObjectId("65f1a2b3...")
}
```

### Indexes
```javascript
db.calls.createIndex({ contactId: 1 });
db.calls.createIndex({ accountId: 1 });
db.calls.createIndex({ userId: 1 });
db.calls.createIndex({ status: 1 });
db.calls.createIndex({ scheduledAt: 1 });
db.calls.createIndex({ startedAt: -1 });
db.calls.createIndex({ "transcript.status": 1 });
db.calls.createIndex({ "aiSummary.status": 1 });
db.calls.createIndex({ tags: 1 });
db.calls.createIndex({ createdAt: -1 });
```

---

## Collection: `news_alerts`

```javascript
{
  _id: ObjectId("65f1a2b3c4d5e..."),
  
  // Related Entity
  accountId: ObjectId("65f1a2b3..."),
  
  // Article Details
  title: "Tata Steel Reports Record Q3 Earnings, Stock Surges 8%",
  summary: "Tata Steel announced record-breaking Q3 results with net profit of ₹7,893 crore...",
  content: "Full article content here...",
  
  sourceUrl: "https://economictimes.com/tata-steel-q3-earnings",
  sourceName: "Economic Times",
  sourceType: "news",                // news | press_release | blog | social
  
  publishedAt: ISODate("2026-01-29T08:30:00Z"),
  
  // Media
  imageUrl: "https://img.etimg.com/tata-steel-earnings.jpg",
  thumbnailUrl: "https://img.etimg.com/tata-steel-earnings-thumb.jpg",
  
  // Classification (Feature 3)
  category: "earnings",              // earnings | product_launch | ma | leadership | regulatory | market
  subcategory: "quarterly_results",
  
  tags: ["Q3", "earnings", "steel", "manufacturing", "growth"],
  
  // AI Analysis
  analysis: {
    sentiment: {
      label: "positive",
      score: 0.85
    },
    relevanceScore: 92,              // 0-100
    entities: [
      { name: "Tata Steel", type: "company" },
      { name: "T.V. Narendran", type: "person", role: "CEO" }
    ],
    keywords: ["earnings", "profit", "growth", "steel", "Q3"],
    topics: ["Financial Results", "Stock Market"]
  },
  
  // User Interactions
  interactions: [
    {
      userId: ObjectId("65f1a2b3..."),
      action: "viewed",
      timestamp: ISODate("2026-01-29T09:15:00Z")
    },
    {
      userId: ObjectId("65f1a2b3..."),
      action: "opportunity_created",
      timestamp: ISODate("2026-01-29T09:20:00Z"),
      opportunityId: ObjectId("65f1a2b3...")
    }
  ],
  
  // Status
  isActive: true,
  isRead: true,
  isDismissed: false,
  
  // Metadata
  expiresAt: ISODate("2026-02-28T00:00:00Z"),
  fetchedAt: ISODate("2026-01-29T08:45:00Z"),
  processedAt: ISODate("2026-01-29T08:46:00Z"),
  createdAt: ISODate("2026-01-29T08:46:00Z")
}
```

### Indexes
```javascript
db.news_alerts.createIndex({ accountId: 1 });
db.news_alerts.createIndex({ category: 1 });
db.news_alerts.createIndex({ publishedAt: -1 });
db.news_alerts.createIndex({ "analysis.relevanceScore": -1 });
db.news_alerts.createIndex({ isActive: 1 });
db.news_alerts.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
db.news_alerts.createIndex({ tags: 1 });
```

---

## Collection: `email_templates`

```javascript
{
  _id: ObjectId("65f1a2b3c4d5e..."),
  
  name: "Birthday - Corporate",
  description: "Professional birthday greeting for corporate contacts",
  
  type: "birthday",                  // birthday | anniversary | work_anniversary | custom
  category: "occasion",              // occasion | marketing | transactional
  
  // Template Content
  subject: "Happy Birthday, {{contact.firstName}}! 🎂",
  
  htmlBody: `
    <div style="font-family: Arial, sans-serif;">
      <h1>Happy Birthday, {{contact.firstName}}!</h1>
      <p>On behalf of everyone at {{company.name}}, we wish you a wonderful birthday!</p>
      <p>May this special day bring you joy, happiness, and success.</p>
      <p>Best regards,<br>{{sender.name}}</p>
    </div>
  `,
  
  textBody: `
    Happy Birthday, {{contact.firstName}}!
    
    On behalf of everyone at {{company.name}}, we wish you a wonderful birthday!
    May this special day bring you joy, happiness, and success.
    
    Best regards,
    {{sender.name}}
  `,
  
  // Variables available
  variables: [
    "contact.firstName",
    "contact.lastName",
    "contact.email",
    "company.name",
    "sender.name",
    "sender.email",
    "sender.title"
  ],
  
  // Settings
  isActive: true,
  isDefault: true,
  
  // Metadata
  createdBy: ObjectId("65f1a2b3..."),
  createdAt: ISODate("2025-01-10T10:00:00Z"),
  updatedAt: ISODate("2025-06-15T14:30:00Z")
}
```

---

## Collection: `social_activities`

```javascript
{
  _id: ObjectId("65f1a2b3c4d5e..."),
  
  // Related Entity
  contactId: ObjectId("65f1a2b3..."),
  socialProfileId: ObjectId("65f1a2b3..."),
  
  // Platform Details
  platform: "linkedin",
  externalId: "urn:li:activity:7159876543210",
  
  // Activity Details
  type: "post",                      // post | share | like | comment | article
  
  content: {
    text: "Excited to announce our new sustainable steel initiative! 🌱 #Sustainability #Steel",
    imageUrls: ["https://media.licdn.com/..."],
    linkUrl: "https://tatasteel.com/sustainability",
    linkTitle: "Tata Steel Sustainability Report 2025"
  },
  
  // Engagement Metrics
  engagement: {
    likes: 847,
    comments: 52,
    shares: 128,
    views: 15420
  },
  
  // Timing
  publishedAt: ISODate("2026-01-28T10:30:00Z"),
  fetchedAt: ISODate("2026-01-29T06:00:00Z"),
  
  // User Actions
  crmActions: [
    {
      type: "task_created",
      userId: ObjectId("65f1a2b3..."),
      taskId: ObjectId("65f1a2b3..."),
      timestamp: ISODate("2026-01-29T09:30:00Z")
    }
  ],
  
  // Metadata
  isRead: false,
  createdAt: ISODate("2026-01-29T06:00:00Z")
}
```

### Indexes
```javascript
db.social_activities.createIndex({ contactId: 1 });
db.social_activities.createIndex({ platform: 1 });
db.social_activities.createIndex({ publishedAt: -1 });
db.social_activities.createIndex({ isRead: 1 });
```

---

## Collection: `users`

```javascript
{
  _id: ObjectId("65f1a2b3c4d5e..."),
  
  // Authentication
  email: "ravish.sahay@sequelstring.com",
  passwordHash: "$2b$12$...",        // bcrypt hashed
  
  // Profile
  firstName: "Ravish",
  lastName: "Sahay",
  title: "Sales Head",
  phone: "+91-9876543210",
  avatarUrl: "https://sequelstring.com/avatars/rs.jpg",
  
  // Role & Permissions
  role: "sales_head",                // admin | sales_head | sales_rep | viewer
  permissions: ["contacts:*", "accounts:*", "calls:*", "intelligence:read"],
  
  // Settings
  preferences: {
    timezone: "Asia/Kolkata",
    language: "en",
    emailNotifications: true,
    pushNotifications: true,
    theme: "light"
  },
  
  // Status
  isActive: true,
  lastLoginAt: ISODate("2026-01-29T08:00:00Z"),
  
  // Metadata
  createdAt: ISODate("2025-01-01T00:00:00Z"),
  updatedAt: ISODate("2026-01-29T08:00:00Z")
}
```

---

## Redis Key Patterns

```
# Authentication
session:{userId}                     -> JSON (TTL: 24h)
refresh:{refreshToken}               -> userId (TTL: 7d)

# Important Dates Cache
dates:upcoming:{userId}              -> JSON[] (TTL: 15m)
dates:contact:{contactId}            -> JSON[] (TTL: 1h)

# Social Profiles Cache  
social:profiles:{contactId}          -> JSON[] (TTL: 6h)
social:activity:{contactId}          -> JSON[] (TTL: 30m)

# Intelligence Cache
intel:news:{accountId}               -> JSON[] (TTL: 15m)
intel:alerts:{userId}                -> JSON[] (TTL: 5m)

# Calls Cache
call:active:{userId}                 -> JSON (TTL: 2h)
call:transcript:{callId}             -> JSON (TTL: 24h)

# Rate Limiting
ratelimit:{endpoint}:{ip}            -> count (TTL: 60s)
```

---

## Data Migration Strategy

### Phase 1: Schema Migration
```javascript
// Migration script example
db.contacts.updateMany(
  { importantDates: { $exists: false } },
  { $set: { importantDates: [], socialProfiles: [] } }
);
```

### Phase 2: Index Creation
```javascript
// Create indexes in background
db.contacts.createIndex({ "importantDates.nextSendAt": 1 }, { background: true });
```

### Phase 3: Data Validation
```javascript
// Validate schema compliance
db.contacts.find({
  $or: [
    { email: { $exists: false } },
    { firstName: { $exists: false } }
  ]
}).count();
```
