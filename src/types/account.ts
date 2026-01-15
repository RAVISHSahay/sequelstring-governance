// ============================================
// ACCOUNT MAPPING & SALES STAGE FRAMEWORK
// Enterprise-Grade CRM Data Models
// ============================================

// ==========================================
// MODULE 1: Account Hierarchy & Structure
// ==========================================

export type AccountType = 'enterprise' | 'government' | 'psu' | 'sme' | 'startup' | 'partner';
export type AccountClassification = 'strategic' | 'key' | 'growth' | 'maintain' | 'transactional';
export type AccountStatus = 'prospect' | 'active' | 'dormant' | 'churned' | 'blacklisted';

export interface AccountHierarchy {
  id: string;
  parentId: string | null;
  level: number; // 0 = root, 1 = subsidiary, etc.
  hierarchyPath: string[]; // Array of ancestor IDs
  consolidatedRevenue: number;
  consolidatedOpportunities: number;
}

export interface Account {
  id: string;
  name: string;
  legalName: string;
  type: AccountType;
  classification: AccountClassification;
  status: AccountStatus;
  
  // Hierarchy
  hierarchy: AccountHierarchy;
  
  // Ownership
  ownerId: string;
  ownerName: string;
  teamId: string;
  region: string;
  territory: string;
  
  // Identification
  gstin?: string;
  pan?: string;
  cin?: string;
  duns?: string;
  
  // Industry
  industry: string;
  subIndustry: string;
  employeeCount: string;
  annualRevenue: string;
  fiscalYearEnd: string;
  
  // Health Metrics
  healthScore: number; // 0-100
  engagementScore: number; // 0-100
  riskScore: number; // 0-100
  npsScore?: number;
  
  // Financial
  totalContractValue: number;
  activeContractValue: number;
  lifetimeValue: number;
  outstandingReceivables: number;
  paymentBehaviorScore: number; // 0-100
  
  // Pipeline
  activePipelineValue: number;
  activePipelineCount: number;
  weightedPipeline: number;
  
  // History
  totalWins: number;
  totalLosses: number;
  winRate: number;
  avgDealSize: number;
  avgSalesCycle: number; // days
  
  // Dates
  createdAt: Date;
  updatedAt: Date;
  lastActivityDate: Date;
  nextRenewalDate?: Date;
  
  // Metadata
  tags: string[];
  customFields: Record<string, any>;
}

// ==========================================
// MODULE 1.2: Stakeholder & Influence Mapping
// ==========================================

export type ContactRole = 
  | 'economic_buyer' 
  | 'technical_approver' 
  | 'influencer' 
  | 'gatekeeper' 
  | 'user' 
  | 'champion' 
  | 'executive_sponsor'
  | 'procurement';

export type RelationshipStrength = 'cold' | 'warm' | 'strong' | 'advocate';
export type DecisionAuthority = 'final' | 'strong_influence' | 'recommender' | 'evaluator' | 'none';

export interface Stakeholder {
  id: string;
  accountId: string;
  contactId: string;
  
  // Contact Info
  name: string;
  title: string;
  department: string;
  email: string;
  phone: string;
  linkedIn?: string;
  
  // Role & Influence
  roles: ContactRole[];
  primaryRole: ContactRole;
  powerScore: number; // 1-10
  influenceScore: number; // 1-10
  decisionAuthority: DecisionAuthority;
  relationshipStrength: RelationshipStrength;
  
  // Relationship Owner
  relationshipOwnerId: string;
  relationshipOwnerName: string;
  
  // Engagement
  lastContactDate: Date;
  preferredChannel: 'email' | 'phone' | 'in_person' | 'video';
  communicationFrequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
  
  // Sentiment
  sentiment: 'positive' | 'neutral' | 'negative' | 'unknown';
  notes: string;
  
  // Flags
  isKeyContact: boolean;
  isDecisionMaker: boolean;
  requiresExecutiveEngagement: boolean;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// MODULE 1.3: Account Relationship Graph
// ==========================================

export type RelationshipType = 
  | 'reports_to' 
  | 'influences' 
  | 'collaborates_with'
  | 'competes_with'
  | 'partner'
  | 'consultant'
  | 'vendor'
  | 'procurement_authority';

export interface AccountRelationship {
  id: string;
  sourceAccountId: string;
  targetAccountId: string;
  relationshipType: RelationshipType;
  strength: number; // 1-10
  description: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
}

export interface ContactRelationship {
  id: string;
  sourceContactId: string;
  targetContactId: string;
  relationshipType: RelationshipType;
  strength: number;
  description: string;
}

// ==========================================
// MODULE 2: Sales Stage Framework
// ==========================================

export interface SalesStage {
  id: string;
  name: string;
  code: string;
  order: number;
  category: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closing' | 'post_sale';
  
  // Probability & Forecasting
  defaultProbability: number; // 0-100
  forecastCategory: 'omitted' | 'pipeline' | 'best_case' | 'commit' | 'closed';
  
  // Stage Rules
  entryCriteria: StageRule[];
  exitCriteria: StageRule[];
  mandatoryFields: string[];
  allowedActions: string[];
  
  // Time Tracking
  expectedDuration: number; // days
  warningThreshold: number; // days
  criticalThreshold: number; // days
  
  // Governance
  requiresApproval: boolean;
  approvalRoles: string[];
  maxDiscount: number; // percentage
  priceLocked: boolean;
  requiredDocuments: string[];
  
  // Workflow
  onEnterWorkflows: string[];
  onExitWorkflows: string[];
  
  // Display
  color: string;
  icon: string;
  isActive: boolean;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface StageRule {
  id: string;
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'is_set' | 'is_not_set';
  value: any;
  errorMessage: string;
}

// ==========================================
// MODULE 3: Opportunity Intelligence
// ==========================================

export type OpportunityStatus = 'open' | 'won' | 'lost' | 'on_hold' | 'abandoned';
export type DealType = 'new_business' | 'expansion' | 'renewal' | 'upsell' | 'cross_sell';
export type BudgetStatus = 'confirmed' | 'tentative' | 'not_allocated' | 'unknown';
export type CompetitorThreat = 'low' | 'medium' | 'high' | 'critical';

export interface Opportunity {
  id: string;
  name: string;
  accountId: string;
  accountName: string;
  
  // Ownership
  ownerId: string;
  ownerName: string;
  teamId: string;
  
  // Stage & Status
  stageId: string;
  stageName: string;
  status: OpportunityStatus;
  probability: number;
  
  // Deal Info
  dealType: DealType;
  dealSize: number;
  weightedValue: number;
  currency: string;
  
  // Timeline
  createdDate: Date;
  expectedCloseDate: Date;
  actualCloseDate?: Date;
  lastStageChangeDate: Date;
  daysInCurrentStage: number;
  totalSalesCycleDays: number;
  
  // Strategic
  strategicImportance: 'critical' | 'high' | 'medium' | 'low';
  isStrategicDeal: boolean;
  isKeyAccount: boolean;
  
  // Budget
  budgetStatus: BudgetStatus;
  budgetAmount?: number;
  budgetFiscalYear?: string;
  
  // Decision
  decisionProcess: string;
  decisionCriteria: string[];
  decisionTimeline: Date;
  painPoints: string[];
  
  // Competition
  competitors: CompetitorInfo[];
  competitorThreat: CompetitorThreat;
  competitivePosition: 'leading' | 'even' | 'behind' | 'unknown';
  
  // Forecast
  forecastCategory: 'omitted' | 'pipeline' | 'best_case' | 'commit' | 'closed';
  isInForecast: boolean;
  forecastNotes: string;
  
  // Win/Loss
  closeReason?: string;
  closeReasonCategory?: 'price' | 'product' | 'relationship' | 'timing' | 'competition' | 'budget' | 'other';
  competitorWon?: string;
  lessonsLearned?: string;
  
  // Products
  products: OpportunityProduct[];
  
  // Stakeholders
  primaryContactId: string;
  stakeholderIds: string[];
  
  // Stage History
  stageHistory: StageHistoryEntry[];
  
  // Metadata
  tags: string[];
  customFields: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompetitorInfo {
  name: string;
  threat: CompetitorThreat;
  strengths: string[];
  weaknesses: string[];
  proposedValue?: number;
}

export interface OpportunityProduct {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  totalPrice: number;
  paymentTerms: string;
}

export interface StageHistoryEntry {
  id: string;
  fromStageId: string;
  toStageId: string;
  changedAt: Date;
  changedBy: string;
  daysInStage: number;
  notes: string;
}

// ==========================================
// MODULE 4: Activity & Engagement
// ==========================================

export type ActivityType = 
  | 'call' 
  | 'meeting' 
  | 'email' 
  | 'demo' 
  | 'site_visit' 
  | 'workshop' 
  | 'proposal_review'
  | 'negotiation'
  | 'contract_discussion'
  | 'follow_up'
  | 'task';

export type ActivityStatus = 'planned' | 'completed' | 'cancelled' | 'rescheduled';

export interface Activity {
  id: string;
  type: ActivityType;
  subject: string;
  description: string;
  status: ActivityStatus;
  
  // Relationships
  accountId?: string;
  contactId?: string;
  opportunityId?: string;
  stageId?: string;
  
  // Ownership
  ownerId: string;
  ownerName: string;
  participants: string[];
  
  // Timing
  scheduledDate: Date;
  completedDate?: Date;
  duration: number; // minutes
  
  // Outcome
  outcome?: 'positive' | 'neutral' | 'negative';
  nextSteps?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// MODULE 5: Forecasting
// ==========================================

export interface ForecastEntry {
  id: string;
  userId: string;
  period: string; // e.g., "2024-Q1"
  
  // Categories
  commit: number;
  bestCase: number;
  pipeline: number;
  closed: number;
  
  // Targets
  quota: number;
  attainment: number; // percentage
  gap: number;
  
  // Risk
  atRiskDeals: number;
  atRiskValue: number;
  stalledDeals: number;
  
  // Metadata
  lastUpdated: Date;
  notes: string;
}

// ==========================================
// MODULE 6: Configuration
// ==========================================

export interface SalesProcess {
  id: string;
  name: string;
  description: string;
  accountTypes: AccountType[];
  stages: SalesStage[];
  isDefault: boolean;
  isActive: boolean;
}

// ==========================================
// MODULE 7: Audit Trail
// ==========================================

export interface AuditLogEntry {
  id: string;
  entityType: 'account' | 'opportunity' | 'contact' | 'activity';
  entityId: string;
  action: 'create' | 'update' | 'delete' | 'stage_change' | 'approval';
  field?: string;
  oldValue?: any;
  newValue?: any;
  userId: string;
  userName: string;
  timestamp: Date;
  ipAddress?: string;
  notes?: string;
}
