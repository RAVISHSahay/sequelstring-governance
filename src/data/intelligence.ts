import {
    AccountNewsItem,
    AccountNewsSubscription,
    AccountIntelEntry,
    CompetitorProfile,
    TechStackEntry,
    NewsTag,
    NewsRelevance,
    IntelType,
    ConfidenceLevel,
    SourceType
} from '@/types/intelligence';

// Storage keys
const STORAGE_KEY_NEWS = 'crm_account_news';
const STORAGE_KEY_SUBSCRIPTIONS = 'crm_news_subscriptions';
const STORAGE_KEY_INTEL = 'crm_intel_entries';
const STORAGE_KEY_COMPETITORS = 'crm_competitors';
const STORAGE_KEY_TECHSTACK = 'crm_techstack';

// Generate unique ID
const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Mock news items
export const mockNewsItems: AccountNewsItem[] = [
    {
        id: 'news_1',
        accountId: '1', // Tata Steel
        title: 'Tata Steel Reports Record Q3 Earnings',
        summary: 'Tata Steel announced record quarterly earnings driven by strong domestic demand and operational efficiency improvements. Revenue grew 15% YoY with EBITDA margins expanding to 22%.',
        sourceName: 'Economic Times',
        sourceUrl: 'https://economictimes.com/tata-steel-q3-results',
        publishedAt: new Date('2026-01-28T09:00:00').toISOString(),
        ingestedAt: new Date('2026-01-28T09:30:00').toISOString(),
        tags: ['Earnings'],
        relevanceScore: 'High',
        matchedTerms: ['Tata Steel'],
        status: 'active',
        isDuplicate: false,
        createdAt: new Date('2026-01-28T09:30:00').toISOString(),
        updatedAt: new Date('2026-01-28T09:30:00').toISOString(),
    },
    {
        id: 'news_2',
        accountId: '1',
        title: 'Tata Steel Invests ₹12,000 Cr in Green Steel Initiative',
        summary: 'Tata Steel announces major investment in hydrogen-based steel production as part of its sustainability roadmap. New facility expected to reduce carbon emissions by 30%.',
        sourceName: 'Mint',
        sourceUrl: 'https://livemint.com/tata-steel-green-investment',
        publishedAt: new Date('2026-01-27T14:00:00').toISOString(),
        ingestedAt: new Date('2026-01-27T14:30:00').toISOString(),
        tags: ['Product Launch', 'M&A'],
        relevanceScore: 'High',
        matchedTerms: ['Tata Steel', 'Tata Steel Ltd'],
        status: 'active',
        isDuplicate: false,
        createdAt: new Date('2026-01-27T14:30:00').toISOString(),
        updatedAt: new Date('2026-01-27T14:30:00').toISOString(),
    },
    {
        id: 'news_3',
        accountId: '2', // Infosys
        title: 'Infosys Wins $500M Digital Transformation Deal',
        summary: 'Infosys secures large digital transformation contract with European telecom giant. Deal includes cloud migration, AI implementation, and managed services.',
        sourceName: 'Business Standard',
        sourceUrl: 'https://business-standard.com/infosys-deal',
        publishedAt: new Date('2026-01-26T11:00:00').toISOString(),
        ingestedAt: new Date('2026-01-26T11:30:00').toISOString(),
        tags: ['Contract', 'Partnership'],
        relevanceScore: 'High',
        matchedTerms: ['Infosys'],
        status: 'active',
        isDuplicate: false,
        createdAt: new Date('2026-01-26T11:30:00').toISOString(),
        updatedAt: new Date('2026-01-26T11:30:00').toISOString(),
    },
    {
        id: 'news_4',
        accountId: '3', // Reliance
        title: 'Reliance Industries Appoints New Chief Digital Officer',
        summary: 'Reliance Industries announces appointment of new CDO to lead digital initiatives across retail and telecom verticals. Focus on AI and data analytics capabilities.',
        sourceName: 'NDTV Profit',
        sourceUrl: 'https://ndtv.com/reliance-cdo-appointment',
        publishedAt: new Date('2026-01-25T16:00:00').toISOString(),
        ingestedAt: new Date('2026-01-25T16:30:00').toISOString(),
        tags: ['Leadership Change'],
        relevanceScore: 'Medium',
        matchedTerms: ['Reliance Industries', 'Reliance'],
        status: 'active',
        isDuplicate: false,
        createdAt: new Date('2026-01-25T16:30:00').toISOString(),
        updatedAt: new Date('2026-01-25T16:30:00').toISOString(),
    },
    {
        id: 'news_5',
        accountId: '1',
        title: 'Tata Steel Faces Supply Chain Disruption in Europe',
        summary: 'Logistics challenges impact Tata Steel European operations. Company implementing contingency measures to maintain production levels.',
        sourceName: 'Reuters',
        sourceUrl: 'https://reuters.com/tata-steel-supply-chain',
        publishedAt: new Date('2026-01-24T08:00:00').toISOString(),
        ingestedAt: new Date('2026-01-24T08:30:00').toISOString(),
        tags: ['Other'],
        relevanceScore: 'Medium',
        matchedTerms: ['Tata Steel'],
        status: 'active',
        isDuplicate: false,
        createdAt: new Date('2026-01-24T08:30:00').toISOString(),
        updatedAt: new Date('2026-01-24T08:30:00').toISOString(),
    },
];

// Mock intel entries
export const mockIntelEntries: AccountIntelEntry[] = [
    {
        id: 'intel_1',
        accountId: '1',
        intelType: 'competitor',
        title: 'JSW Steel Pricing Strategy',
        content: 'JSW Steel has been aggressive on pricing in Q4, offering 5-8% discounts on long products. Their focus is on gaining market share in construction segment. We should emphasize quality and delivery reliability in our positioning.',
        tags: ['pricing', 'competition', 'steel'],
        confidenceLevel: 'High',
        sourceType: 'Sales Observation',
        visibility: 'sales_visible',
        validFrom: new Date('2026-01-15').toISOString(),
        reviewDueAt: new Date('2026-04-15').toISOString(),
        isArchived: false,
        createdBy: 'user_1',
        createdAt: new Date('2026-01-15').toISOString(),
        updatedAt: new Date('2026-01-15').toISOString(),
    },
    {
        id: 'intel_2',
        accountId: '2',
        intelType: 'techstack',
        title: 'Current ERP Implementation',
        content: 'Infosys currently uses SAP S/4HANA for core ERP with custom extensions. They have Salesforce for CRM and ServiceNow for ITSM. Cloud infrastructure is primarily AWS with some Azure workloads.',
        tags: ['technology', 'erp', 'cloud'],
        confidenceLevel: 'High',
        sourceType: 'Customer Feedback',
        visibility: 'sales_visible',
        validFrom: new Date('2026-01-10').toISOString(),
        reviewDueAt: new Date('2026-07-10').toISOString(),
        isArchived: false,
        createdBy: 'user_2',
        createdAt: new Date('2026-01-10').toISOString(),
        updatedAt: new Date('2026-01-10').toISOString(),
    },
    {
        id: 'intel_3',
        accountId: '1',
        intelType: 'procurement',
        title: 'Procurement Process Insights',
        content: 'Tata Steel procurement is highly structured with formal RFP process for contracts >₹5L. Average cycle is 45-60 days. Key stakeholders: Procurement Head, IT Director, and Business Unit Lead must sign off.',
        tags: ['procurement', 'process', 'stakeholders'],
        confidenceLevel: 'Medium',
        sourceType: 'Partner',
        visibility: 'intelligence_only',
        validFrom: new Date('2026-01-05').toISOString(),
        reviewDueAt: new Date('2026-04-05').toISOString(),
        isArchived: false,
        createdBy: 'user_1',
        createdAt: new Date('2026-01-05').toISOString(),
        updatedAt: new Date('2026-01-05').toISOString(),
    },
];

// Mock tech stack entries
export const mockTechStack: TechStackEntry[] = [
    {
        id: 'tech_1',
        accountId: '1',
        category: 'ERP',
        technology: 'SAP S/4HANA',
        vendor: 'SAP',
        version: '2023',
        confidence: 'High',
        source: 'Customer Feedback',
        createdBy: 'user_1',
        createdAt: new Date('2026-01-10').toISOString(),
        updatedAt: new Date('2026-01-10').toISOString(),
    },
    {
        id: 'tech_2',
        accountId: '1',
        category: 'Cloud',
        technology: 'AWS',
        vendor: 'Amazon',
        confidence: 'High',
        source: 'Public',
        createdBy: 'user_1',
        createdAt: new Date('2026-01-10').toISOString(),
        updatedAt: new Date('2026-01-10').toISOString(),
    },
    {
        id: 'tech_3',
        accountId: '2',
        category: 'CRM',
        technology: 'Salesforce',
        vendor: 'Salesforce',
        confidence: 'High',
        source: 'Public',
        createdBy: 'user_2',
        createdAt: new Date('2026-01-08').toISOString(),
        updatedAt: new Date('2026-01-08').toISOString(),
    },
];

// CRUD Operations for News
export const getAccountNews = (): AccountNewsItem[] => {
    const stored = localStorage.getItem(STORAGE_KEY_NEWS);
    if (stored) {
        return JSON.parse(stored);
    }
    localStorage.setItem(STORAGE_KEY_NEWS, JSON.stringify(mockNewsItems));
    return mockNewsItems;
};

export const getNewsByAccountId = (accountId: string): AccountNewsItem[] => {
    const allNews = getAccountNews();
    return allNews
        .filter(news => news.accountId === accountId && news.status === 'active')
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
};

export const updateNewsStatus = (id: string, status: 'active' | 'dismissed' | 'saved'): boolean => {
    const allNews = getAccountNews();
    const index = allNews.findIndex(n => n.id === id);
    if (index === -1) return false;

    allNews[index].status = status;
    allNews[index].updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY_NEWS, JSON.stringify(allNews));
    return true;
};

export const addNewsItem = (news: Omit<AccountNewsItem, 'id' | 'createdAt' | 'updatedAt' | 'ingestedAt'>): AccountNewsItem => {
    const allNews = getAccountNews();
    const newItem: AccountNewsItem = {
        ...news,
        id: `news_${generateId()}`,
        ingestedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    allNews.push(newItem);
    localStorage.setItem(STORAGE_KEY_NEWS, JSON.stringify(allNews));
    return newItem;
};

// CRUD Operations for Intel Entries
export const getIntelEntries = (): AccountIntelEntry[] => {
    const stored = localStorage.getItem(STORAGE_KEY_INTEL);
    if (stored) {
        return JSON.parse(stored);
    }
    localStorage.setItem(STORAGE_KEY_INTEL, JSON.stringify(mockIntelEntries));
    return mockIntelEntries;
};

export const getIntelByAccountId = (accountId: string, salesVisible: boolean = false): AccountIntelEntry[] => {
    const allIntel = getIntelEntries();
    return allIntel
        .filter(intel =>
            intel.accountId === accountId &&
            !intel.isArchived &&
            (salesVisible ? intel.visibility === 'sales_visible' || intel.visibility === 'all' : true)
        )
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const addIntelEntry = (intel: Omit<AccountIntelEntry, 'id' | 'createdAt' | 'updatedAt'>): AccountIntelEntry => {
    const allIntel = getIntelEntries();
    const newEntry: AccountIntelEntry = {
        ...intel,
        id: `intel_${generateId()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    allIntel.push(newEntry);
    localStorage.setItem(STORAGE_KEY_INTEL, JSON.stringify(allIntel));
    return newEntry;
};

export const updateIntelEntry = (id: string, updates: Partial<AccountIntelEntry>): AccountIntelEntry | null => {
    const allIntel = getIntelEntries();
    const index = allIntel.findIndex(i => i.id === id);
    if (index === -1) return null;

    allIntel[index] = {
        ...allIntel[index],
        ...updates,
        updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY_INTEL, JSON.stringify(allIntel));
    return allIntel[index];
};

// CRUD Operations for Tech Stack
export const getTechStack = (): TechStackEntry[] => {
    const stored = localStorage.getItem(STORAGE_KEY_TECHSTACK);
    if (stored) {
        return JSON.parse(stored);
    }
    localStorage.setItem(STORAGE_KEY_TECHSTACK, JSON.stringify(mockTechStack));
    return mockTechStack;
};

export const getTechStackByAccountId = (accountId: string): TechStackEntry[] => {
    const allTech = getTechStack();
    return allTech.filter(tech => tech.accountId === accountId);
};

export const addTechStackEntry = (tech: Omit<TechStackEntry, 'id' | 'createdAt' | 'updatedAt'>): TechStackEntry => {
    const allTech = getTechStack();
    const newEntry: TechStackEntry = {
        ...tech,
        id: `tech_${generateId()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    allTech.push(newEntry);
    localStorage.setItem(STORAGE_KEY_TECHSTACK, JSON.stringify(allTech));
    return newEntry;
};

// Subscriptions
export const getNewsSubscriptions = (): AccountNewsSubscription[] => {
    const stored = localStorage.getItem(STORAGE_KEY_SUBSCRIPTIONS);
    return stored ? JSON.parse(stored) : [];
};

export const getSubscriptionByAccountId = (accountId: string): AccountNewsSubscription | null => {
    const subs = getNewsSubscriptions();
    return subs.find(s => s.accountId === accountId) || null;
};

export const saveNewsSubscription = (sub: Omit<AccountNewsSubscription, 'id' | 'createdAt' | 'updatedAt'>): AccountNewsSubscription => {
    const subs = getNewsSubscriptions();
    const existing = subs.findIndex(s => s.accountId === sub.accountId);

    const newSub: AccountNewsSubscription = {
        ...sub,
        id: existing >= 0 ? subs[existing].id : `sub_${generateId()}`,
        createdBy: sub.createdBy || 'user_1',
        createdAt: existing >= 0 ? subs[existing].createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    if (existing >= 0) {
        subs[existing] = newSub;
    } else {
        subs.push(newSub);
    }

    localStorage.setItem(STORAGE_KEY_SUBSCRIPTIONS, JSON.stringify(subs));
    return newSub;
};
