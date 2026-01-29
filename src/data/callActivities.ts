import { CallActivity, CallDisposition, CallStatus, DNCEntry, CallScript, normalizePhoneNumber } from '@/types/callIntegration';

// Storage keys
const STORAGE_KEY_CALLS = 'crm_call_activities';
const STORAGE_KEY_DNC = 'crm_dnc_list';
const STORAGE_KEY_SCRIPTS = 'crm_call_scripts';

// Generate unique ID
const generateId = () => `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Mock call scripts
export const defaultCallScripts: CallScript[] = [
    {
        id: 'script_cold_call',
        name: 'Cold Call Introduction',
        description: 'Initial outreach to new prospects',
        script: `**Opening:**
"Hi [Name], this is [Your Name] from [Company]. I hope I'm not catching you at a bad time?"

**Purpose:**
"I'm reaching out because we help companies like [Their Company] with [Value Proposition]. I noticed that..."

**Discovery Questions:**
1. "What's your current approach to [Problem Area]?"
2. "What challenges are you facing with [Specific Issue]?"
3. "Who else would be involved in evaluating solutions like this?"

**Next Steps:**
"Based on what you've shared, I think it would be valuable to schedule a brief demo. How does [Day] at [Time] work for you?"

**Objection Handling:**
- "Not interested" → "I understand. May I ask what you're currently using?"
- "Send info" → "Absolutely. What specific aspects would be most relevant to you?"
- "Call back later" → "Of course. When would be a better time to connect?"`,
        tags: ['cold-call', 'outbound', 'prospecting'],
        useCase: 'cold_call',
        isActive: true,
        createdBy: 'system',
        createdAt: new Date('2026-01-15').toISOString(),
        updatedAt: new Date('2026-01-15').toISOString(),
    },
    {
        id: 'script_follow_up',
        name: 'Follow-up Call',
        description: 'Following up after initial contact or demo',
        script: `**Opening:**
"Hi [Name], this is [Your Name] from [Company]. We spoke [last week/after your demo] about [Topic]. Do you have a few minutes?"

**Check-in:**
"I wanted to follow up on our conversation and see if you had any questions after reviewing the information I sent."

**Key Questions:**
1. "What stood out to you from what we discussed?"
2. "Have you had a chance to discuss this with your team?"
3. "What would you need to see to move forward?"

**Address Concerns:**
"I understand [Concern]. Many of our clients felt the same way initially. Here's what we found..."

**Close:**
"Based on our discussion, I recommend we [Next Step]. Does that work for you?"`,
        tags: ['follow-up', 'nurture'],
        useCase: 'follow_up',
        isActive: true,
        createdBy: 'system',
        createdAt: new Date('2026-01-15').toISOString(),
        updatedAt: new Date('2026-01-15').toISOString(),
    },
    {
        id: 'script_qualification',
        name: 'Qualification Call',
        description: 'BANT qualification for leads',
        script: `**BANT Framework:**

**Budget:**
- "Do you have budget allocated for this type of solution?"
- "What's your typical investment range for tools like this?"

**Authority:**
- "Who else would be involved in this decision?"
- "What does your evaluation process typically look like?"

**Need:**
- "Tell me more about the challenges you're facing with [Problem]?"
- "How is this impacting your team/business currently?"
- "What would success look like for you?"

**Timeline:**
- "When are you looking to have a solution in place?"
- "Is there a specific event driving this timeline?"

**Scoring:**
- Strong fit: All 4 criteria met
- Good fit: 3 criteria met
- Needs nurturing: 2 or fewer criteria met`,
        tags: ['qualification', 'bant', 'discovery'],
        useCase: 'qualification',
        isActive: true,
        createdBy: 'system',
        createdAt: new Date('2026-01-15').toISOString(),
        updatedAt: new Date('2026-01-15').toISOString(),
    },
];

// Mock call activities
export const mockCallActivities: CallActivity[] = [
    {
        id: 'call_1',
        entityType: 'lead',
        entityId: '1',
        entityName: 'Arun Patel',
        userId: 'user_1',
        userName: 'Priya Sharma',
        direction: 'outbound',
        fromNumber: '+91 98765 43210',
        toNumber: '+91 87654 32109',
        normalizedToNumber: '918765432109',
        startTime: new Date('2026-01-28T10:30:00').toISOString(),
        endTime: new Date('2026-01-28T10:45:00').toISOString(),
        duration: 900,
        status: 'Connected',
        disposition: 'Interested',
        notes: 'Discussed product features. Interested in demo next week.',
        recordingConsent: true,
        isDNC: false,
        createdAt: new Date('2026-01-28T10:30:00').toISOString(),
        updatedAt: new Date('2026-01-28T10:45:00').toISOString(),
    },
    {
        id: 'call_2',
        entityType: 'contact',
        entityId: '2',
        entityName: 'Sneha Reddy',
        userId: 'user_1',
        userName: 'Priya Sharma',
        direction: 'outbound',
        fromNumber: '+91 98765 43210',
        toNumber: '+91 76543 21098',
        normalizedToNumber: '917654321098',
        startTime: new Date('2026-01-28T14:00:00').toISOString(),
        endTime: new Date('2026-01-28T14:05:00').toISOString(),
        duration: 300,
        status: 'No Answer',
        notes: 'No answer. Will try again tomorrow.',
        recordingConsent: false,
        isDNC: false,
        createdAt: new Date('2026-01-28T14:00:00').toISOString(),
        updatedAt: new Date('2026-01-28T14:05:00').toISOString(),
    },
];

// CRUD Operations for Call Activities
export const getCallActivities = (): CallActivity[] => {
    const stored = localStorage.getItem(STORAGE_KEY_CALLS);
    if (stored) {
        return JSON.parse(stored);
    }
    localStorage.setItem(STORAGE_KEY_CALLS, JSON.stringify(mockCallActivities));
    return mockCallActivities;
};

export const getCallsByEntityId = (entityId: string, entityType?: string): CallActivity[] => {
    const allCalls = getCallActivities();
    return allCalls.filter(call =>
        call.entityId === entityId &&
        (!entityType || call.entityType === entityType)
    ).sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
};

export const createCallActivity = (call: Omit<CallActivity, 'id' | 'createdAt' | 'updatedAt'>): CallActivity => {
    const allCalls = getCallActivities();
    const newCall: CallActivity = {
        ...call,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    allCalls.push(newCall);
    localStorage.setItem(STORAGE_KEY_CALLS, JSON.stringify(allCalls));
    return newCall;
};

export const updateCallActivity = (id: string, updates: Partial<CallActivity>): CallActivity | null => {
    const allCalls = getCallActivities();
    const index = allCalls.findIndex(c => c.id === id);
    if (index === -1) return null;

    allCalls[index] = {
        ...allCalls[index],
        ...updates,
        updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY_CALLS, JSON.stringify(allCalls));
    return allCalls[index];
};

// DNC List Operations
export const getDNCList = (): DNCEntry[] => {
    const stored = localStorage.getItem(STORAGE_KEY_DNC);
    return stored ? JSON.parse(stored) : [];
};

export const addToDNCList = (entry: Omit<DNCEntry, 'id' | 'addedAt'>): DNCEntry => {
    const list = getDNCList();
    const newEntry: DNCEntry = {
        ...entry,
        id: `dnc_${Date.now()}`,
        addedAt: new Date().toISOString(),
    };
    list.push(newEntry);
    localStorage.setItem(STORAGE_KEY_DNC, JSON.stringify(list));
    return newEntry;
};

export const isNumberDNC = (phoneNumber: string): boolean => {
    const normalized = normalizePhoneNumber(phoneNumber);
    const list = getDNCList();
    return list.some(entry =>
        entry.isActive &&
        entry.normalizedPhoneNumber === normalized
    );
};

export const removeFromDNCList = (id: string): boolean => {
    const list = getDNCList();
    const filtered = list.filter(e => e.id !== id);
    if (filtered.length === list.length) return false;
    localStorage.setItem(STORAGE_KEY_DNC, JSON.stringify(filtered));
    return true;
};

// Call Scripts Operations
export const getCallScripts = (): CallScript[] => {
    const stored = localStorage.getItem(STORAGE_KEY_SCRIPTS);
    if (stored) {
        return JSON.parse(stored);
    }
    localStorage.setItem(STORAGE_KEY_SCRIPTS, JSON.stringify(defaultCallScripts));
    return defaultCallScripts;
};

export const getScriptById = (id: string): CallScript | null => {
    const scripts = getCallScripts();
    return scripts.find(s => s.id === id) || null;
};

// Phone matching
export const matchPhoneToEntity = (phoneNumber: string): {
    found: boolean;
    entityType?: string;
    entityId?: string;
    entityName?: string
} => {
    const normalized = normalizePhoneNumber(phoneNumber);

    // Mock phone directory - in real app, query contacts/leads tables
    const phoneDirectory: Record<string, { entityType: string; entityId: string; entityName: string }> = {
        '918765432109': { entityType: 'lead', entityId: '1', entityName: 'Arun Patel' },
        '917654321098': { entityType: 'contact', entityId: '2', entityName: 'Sneha Reddy' },
        '916543210987': { entityType: 'contact', entityId: '3', entityName: 'Vikram Kumar' },
    };

    const match = phoneDirectory[normalized];
    if (match) {
        return { found: true, ...match };
    }
    return { found: false };
};
