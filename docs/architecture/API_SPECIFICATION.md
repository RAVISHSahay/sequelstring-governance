# 🔌 API Specification
## SequelString CRM - RESTful API Documentation

**Base URL:** `https://api.sequelstring.com/v1`  
**Authentication:** Bearer Token (JWT)  
**Content-Type:** `application/json`

---

## Table of Contents

1. [Authentication](#authentication)
2. [Feature 1: Important Dates API](#feature-1-important-dates-api)
3. [Feature 2: Social Profiles API](#feature-2-social-profiles-api)
4. [Feature 3: Intelligence API](#feature-3-intelligence-api)
5. [Feature 4: Calls API](#feature-4-calls-api)
6. [WebSocket Events](#websocket-events)
7. [Error Handling](#error-handling)

---

## Authentication

### Headers
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
X-Request-ID: <uuid>
```

### JWT Payload Structure
```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "role": "sales_head",
  "permissions": ["contacts:*", "calls:*"],
  "iat": 1706500000,
  "exp": 1706586400
}
```

---

## Feature 1: Important Dates API

### List Important Dates for Contact
```http
GET /contacts/:contactId/dates
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| type | string | Filter by type: birthday, anniversary, custom |
| isActive | boolean | Filter by active status |
| upcoming | number | Get dates within N days |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "type": "birthday",
      "label": "Birthday",
      "date": "03-15",
      "year": 1985,
      "sendTime": "09:00",
      "timezone": "Asia/Kolkata",
      "emailTemplate": {
        "id": "65f1a2b3...",
        "name": "Birthday - Corporate"
      },
      "repeatAnnually": true,
      "optOut": false,
      "isActive": true,
      "lastSentAt": "2025-03-15T09:00:00Z",
      "nextSendAt": "2026-03-15T09:00:00Z",
      "createdAt": "2025-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 20
  }
}
```

---

### Create Important Date
```http
POST /contacts/:contactId/dates
```

**Request Body:**
```json
{
  "type": "birthday",
  "date": "03-15",
  "year": 1985,
  "sendTime": "09:00",
  "timezone": "Asia/Kolkata",
  "emailTemplateId": "65f1a2b3c4d5e6f7g8h9i0j1",
  "repeatAnnually": true,
  "isActive": true
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "type": "birthday",
    "date": "03-15",
    "nextSendAt": "2026-03-15T09:00:00Z",
    "message": "Important date created. Email scheduled."
  }
}
```

---

### Update Important Date
```http
PUT /contacts/:contactId/dates/:dateId
```

**Request Body:**
```json
{
  "sendTime": "10:00",
  "isActive": false,
  "emailTemplateId": "new_template_id"
}
```

**Response:** `200 OK`

---

### Delete Important Date
```http
DELETE /contacts/:contactId/dates/:dateId
```

**Response:** `204 No Content`

---

### List Email Templates
```http
GET /email-templates
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| type | string | birthday, anniversary, custom |
| isActive | boolean | Filter active templates |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "65f1a2b3...",
      "name": "Birthday - Corporate",
      "description": "Professional birthday greeting",
      "type": "birthday",
      "previewHtml": "<html>...</html>",
      "isDefault": true
    }
  ]
}
```

---

### Manually Send Email
```http
POST /contacts/:contactId/dates/:dateId/send
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "messageId": "msg_123456",
    "status": "queued",
    "estimatedDelivery": "2026-01-29T10:00:00Z"
  }
}
```

---

## Feature 2: Social Profiles API

### List Social Profiles
```http
GET /contacts/:contactId/social
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "65f1a2b3...",
      "platform": "linkedin",
      "profileUrl": "https://linkedin.com/in/rajesh-sharma",
      "displayName": "Rajesh Sharma",
      "headline": "CTO at Tata Steel",
      "avatarUrl": "https://media.licdn.com/...",
      "followers": 15420,
      "connections": 500,
      "isVerified": true,
      "lastSyncedAt": "2026-01-29T06:00:00Z",
      "syncStatus": "success"
    }
  ]
}
```

---

### Connect Social Profile
```http
POST /contacts/:contactId/social
```

**Request Body:**
```json
{
  "platform": "linkedin",
  "profileUrl": "https://linkedin.com/in/username"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "65f1a2b3...",
    "platform": "linkedin",
    "oauthUrl": "https://linkedin.com/oauth/authorize?...",
    "status": "pending_authorization"
  }
}
```

---

### Disconnect Social Profile
```http
DELETE /contacts/:contactId/social/:profileId
```

**Response:** `204 No Content`

---

### Force Sync Profile
```http
POST /contacts/:contactId/social/:profileId/sync
```

**Response:**
```json
{
  "success": true,
  "data": {
    "jobId": "sync_123456",
    "status": "queued",
    "estimatedCompletion": "2026-01-29T10:05:00Z"
  }
}
```

---

### Get Activity Feed
```http
GET /contacts/:contactId/social/activity
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| platform | string | Filter by platform |
| type | string | post, share, like, comment |
| limit | number | Max results (default: 20) |
| cursor | string | Pagination cursor |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "65f1a2b3...",
      "platform": "linkedin",
      "type": "post",
      "content": {
        "text": "Excited to announce our sustainability initiative! 🌱",
        "imageUrls": ["https://..."],
        "linkUrl": "https://tatasteel.com/sustainability"
      },
      "engagement": {
        "likes": 847,
        "comments": 52,
        "shares": 128
      },
      "publishedAt": "2026-01-28T10:30:00Z"
    }
  ],
  "meta": {
    "nextCursor": "eyJsYXN0SWQiOi..."
  }
}
```

---

## Feature 3: Intelligence API

### Get News Feed
```http
GET /accounts/:accountId/news
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| category | string | earnings, product_launch, ma, leadership |
| sentiment | string | positive, neutral, negative |
| from | date | Start date (ISO 8601) |
| to | date | End date (ISO 8601) |
| limit | number | Max results |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "65f1a2b3...",
      "title": "Tata Steel Reports Record Q3 Earnings",
      "summary": "Net profit reaches ₹7,893 crore...",
      "sourceUrl": "https://economictimes.com/...",
      "sourceName": "Economic Times",
      "publishedAt": "2026-01-29T08:30:00Z",
      "imageUrl": "https://img.etimg.com/...",
      "category": "earnings",
      "tags": ["Q3", "earnings", "growth"],
      "analysis": {
        "sentiment": {
          "label": "positive",
          "score": 0.85
        },
        "relevanceScore": 92
      },
      "isRead": false
    }
  ]
}
```

---

### Take Action on Alert
```http
POST /intelligence/alerts/:alertId/action
```

**Request Body:**
```json
{
  "action": "opportunity_created",
  "opportunityData": {
    "name": "Tata Steel - Enterprise Upgrade",
    "value": 250000,
    "stage": "qualification"
  }
}
```

**Actions Available:**
- `viewed` - Mark as read
- `shared` - Share with team
- `dismissed` - Mark as not relevant
- `opportunity_created` - Create opportunity from alert

**Response:** `200 OK`

---

### Manage Subscriptions
```http
GET /intelligence/subscriptions
POST /intelligence/subscriptions
PUT /intelligence/subscriptions/:id
DELETE /intelligence/subscriptions/:id
```

**Subscription Object:**
```json
{
  "id": "65f1a2b3...",
  "accountId": "65f1a2b3...",
  "enabled": true,
  "frequency": "realtime",
  "categories": ["earnings", "ma", "leadership"],
  "keywords": ["steel", "sustainability"],
  "competitors": ["JSW Steel", "SAIL"],
  "notifyChannels": ["email", "push", "slack"]
}
```

---

## Feature 4: Calls API

### List Calls
```http
GET /calls
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| contactId | string | Filter by contact |
| accountId | string | Filter by account |
| status | string | scheduled, completed, missed |
| type | string | inbound, outbound, scheduled |
| from | date | Start date |
| to | date | End date |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "65f1a2b3...",
      "contact": {
        "id": "65f1a2b3...",
        "name": "Rajesh Sharma",
        "company": "Tata Steel Ltd"
      },
      "type": "outbound",
      "status": "completed",
      "scheduledAt": "2026-01-29T10:00:00Z",
      "duration": 2715,
      "hasRecording": true,
      "hasTranscript": true,
      "hasAISummary": true,
      "sentiment": "positive"
    }
  ]
}
```

---

### Schedule Call
```http
POST /calls
```

**Request Body:**
```json
{
  "contactId": "65f1a2b3...",
  "scheduledAt": "2026-01-30T14:00:00Z",
  "duration": 30,
  "type": "scheduled",
  "notes": "Discuss Q1 projections",
  "ctiProvider": "twilio",
  "dialNumber": "+91-9876543210"
}
```

**Response:** `201 Created`

---

### Get Call Details
```http
GET /calls/:callId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "65f1a2b3...",
    "contact": { /* contact object */ },
    "account": { /* account object */ },
    "user": { /* user object */ },
    "type": "outbound",
    "status": "completed",
    "scheduledAt": "2026-01-29T10:00:00Z",
    "startedAt": "2026-01-29T10:02:15Z",
    "endedAt": "2026-01-29T10:47:30Z",
    "duration": 2715,
    "recording": {
      "url": "https://cdn.sequelstring.com/recordings/...",
      "duration": 2715,
      "status": "available"
    },
    "transcriptAvailable": true,
    "aiSummaryAvailable": true
  }
}
```

---

### Get Call Recording
```http
GET /calls/:callId/recording
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://cdn.sequelstring.com/recordings/signed-url...",
    "expiresAt": "2026-01-29T12:00:00Z",
    "duration": 2715,
    "format": "mp3",
    "size": 6547890
  }
}
```

---

### Get Call Transcript
```http
GET /calls/:callId/transcript
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| format | string | full, segments, summary |
| speaker | string | Filter by speaker |

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "completed",
    "language": "en-US",
    "confidence": 0.94,
    "wordCount": 2847,
    "segments": [
      {
        "speaker": "agent",
        "speakerName": "Ravish Sahay",
        "text": "Good morning, Mr. Sharma. How are you today?",
        "startTime": 0.0,
        "endTime": 3.5,
        "confidence": 0.96
      },
      {
        "speaker": "contact",
        "speakerName": "Rajesh Sharma",
        "text": "I'm doing well, thank you. Let's discuss the Q4 projections.",
        "startTime": 3.8,
        "endTime": 8.2,
        "confidence": 0.93
      }
    ],
    "processedAt": "2026-01-29T11:00:00Z"
  }
}
```

---

### Generate Transcript
```http
POST /calls/:callId/transcript/generate
```

**Request Body:**
```json
{
  "language": "en-US",
  "speakerDiarization": true,
  "priority": "high"
}
```

**Response:** `202 Accepted`
```json
{
  "success": true,
  "data": {
    "jobId": "transcribe_123456",
    "status": "queued",
    "estimatedCompletion": "2026-01-29T11:05:00Z"
  }
}
```

---

### Get AI Summary
```http
GET /calls/:callId/ai-summary
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "completed",
    "model": "gpt-4-turbo",
    
    "summary": "The call focused on Q4 earnings projections and the upcoming Gujarat plant expansion...",
    
    "keyPoints": [
      "Q4 revenue projected at $5.8B, representing 12% YoY growth",
      "New Gujarat steel plant on track for Q2 2026 launch",
      "Sustainability initiatives are reducing carbon emissions by 15%",
      "Client expressed strong interest in CRM enterprise upgrade"
    ],
    
    "actionItems": [
      {
        "id": "65f1a2b3...",
        "description": "Send detailed Q4 earnings presentation",
        "assignee": {
          "id": "65f1a2b3...",
          "name": "Ravish Sahay"
        },
        "dueDate": "2026-01-31T17:00:00Z",
        "priority": "high",
        "status": "pending"
      }
    ],
    
    "sentiment": {
      "overall": "positive",
      "score": 0.78,
      "breakdown": {
        "positive": 0.65,
        "neutral": 0.28,
        "negative": 0.07
      },
      "highlights": {
        "positive": [
          "Excited about the partnership potential",
          "Very impressed with the demo capabilities"
        ],
        "concerns": [
          "Some budget constraints mentioned for Q1"
        ]
      }
    },
    
    "topics": ["Q4 Earnings", "Plant Expansion", "Sustainability", "CRM Upgrade"],
    
    "nextSteps": "Schedule a product demo in the first week of February. Prepare a custom ROI analysis highlighting cost savings from automation.",
    
    "opportunities": [
      {
        "type": "upsell",
        "description": "Enterprise CRM upgrade package",
        "estimatedValue": 250000,
        "probability": 0.7,
        "suggestedAction": "Create opportunity in pipeline"
      }
    ],
    
    "generatedAt": "2026-01-29T11:02:00Z"
  }
}
```

---

### Generate AI Summary
```http
POST /calls/:callId/ai-summary/generate
```

**Request Body:**
```json
{
  "model": "gpt-4-turbo",
  "includeActionItems": true,
  "includeSentiment": true,
  "includeOpportunities": true,
  "language": "en"
}
```

**Response:** `202 Accepted`

---

### Update Action Item Status
```http
PATCH /calls/:callId/ai-summary/action-items/:itemId
```

**Request Body:**
```json
{
  "status": "completed",
  "completedAt": "2026-01-30T15:00:00Z"
}
```

---

## WebSocket Events

### Connection
```javascript
const socket = io('wss://api.sequelstring.com', {
  auth: { token: 'jwt_token' }
});
```

### Events

#### Call Events
```javascript
// Call started
socket.on('call:started', (data) => {
  // { callId, contactId, startedAt }
});

// Call ended
socket.on('call:ended', (data) => {
  // { callId, duration, status }
});

// Live transcript chunk
socket.on('call:transcript:chunk', (data) => {
  // { callId, segment: { speaker, text, timestamp } }
});

// Transcript complete
socket.on('call:transcript:complete', (data) => {
  // { callId, wordCount, segments }
});

// AI Summary ready
socket.on('call:ai-summary:ready', (data) => {
  // { callId, summary, keyPoints, actionItems }
});
```

#### Intelligence Events
```javascript
// New alert
socket.on('intel:new-alert', (data) => {
  // { alertId, title, category, account, relevanceScore }
});

// Breaking news
socket.on('intel:breaking', (data) => {
  // { alertId, priority: 'high', title }
});
```

#### Social Events
```javascript
// New activity
socket.on('social:new-activity', (data) => {
  // { contactId, platform, type, content }
});

// Profile synced
socket.on('social:profile-synced', (data) => {
  // { contactId, profileId, status }
});
```

---

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": {
      "email": ["Email is required"],
      "date": ["Invalid date format. Use DD-MM"]
    },
    "requestId": "req_abc123",
    "timestamp": "2026-01-29T10:00:00Z"
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | Invalid or missing auth token |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 400 | Invalid request data |
| RATE_LIMITED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |
| SERVICE_UNAVAILABLE | 503 | External service down |

### Rate Limits

| Endpoint Type | Limit |
|---------------|-------|
| Standard APIs | 100 req/min |
| Bulk Operations | 10 req/min |
| WebSocket | 50 msg/min |
| File Uploads | 10 req/min |

---

## Pagination

### Cursor-Based (Recommended)
```json
{
  "data": [...],
  "meta": {
    "nextCursor": "eyJsYXN0SWQiOiI2NWYxYTJiMy4uLiJ9",
    "prevCursor": null,
    "hasMore": true
  }
}
```

### Offset-Based
```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "totalPages": 8
  }
}
```
