// Sales Target, Incentive & Payout Engine Types

// ============= Target Types =============

export type TargetLevel = 
  | 'individual' 
  | 'team' 
  | 'region' 
  | 'product' 
  | 'platform' 
  | 'service_line' 
  | 'key_account' 
  | 'channel_partner';

export type TargetPeriodicity = 'monthly' | 'quarterly' | 'yearly' | 'custom';

export type TargetType = 
  | 'revenue' 
  | 'booking' 
  | 'collection' 
  | 'margin' 
  | 'volume' 
  | 'strategic';

export interface Target {
  id: string;
  name: string;
  level: TargetLevel;
  levelEntityId: string; // ID of salesperson, team, region, etc.
  levelEntityName: string;
  type: TargetType;
  periodicity: TargetPeriodicity;
  fiscalYear: string;
  period: string; // Q1 2024, Jan 2024, etc.
  targetValue: number;
  weightage: number; // percentage
  minimumThreshold: number;
  stretchTarget: number;
  carryForwardEnabled: boolean;
  rolloverEnabled: boolean;
  achieved: number;
  achievementPercentage: number;
  status: 'active' | 'draft' | 'closed';
  createdAt: string;
  updatedAt: string;
}

// ============= Commission & Incentive Types =============

export type CommissionModel = 
  | 'flat_percentage' 
  | 'slab_based' 
  | 'tiered' 
  | 'product_wise' 
  | 'margin_based' 
  | 'discount_linked' 
  | 'accelerator' 
  | 'decelerator';

export type CommissionBasis = 
  | 'quote_value' 
  | 'order_value' 
  | 'invoice_value' 
  | 'collection' 
  | 'net_revenue';

export type PayoutTrigger = 
  | 'deal_closure' 
  | 'invoice_generation' 
  | 'payment_receipt' 
  | 'milestone_completion' 
  | 'combination';

export interface CommissionSlab {
  id: string;
  minValue: number;
  maxValue: number | null; // null for unlimited
  rate: number; // percentage
}

export interface IncentivePlan {
  id: string;
  name: string;
  description: string;
  commissionModel: CommissionModel;
  commissionBasis: CommissionBasis;
  payoutTrigger: PayoutTrigger;
  baseRate: number; // base commission percentage
  slabs: CommissionSlab[];
  acceleratorThreshold: number; // percentage of target after which accelerator kicks in
  acceleratorMultiplier: number;
  deceleratorThreshold: number; // margin threshold below which decelerator applies
  deceleratorMultiplier: number;
  discountPenaltyEnabled: boolean;
  discountPenaltyRate: number; // reduction per percentage of discount
  applicableProducts: string[];
  applicableTeams: string[];
  effectiveFrom: string;
  effectiveTo: string;
  status: 'active' | 'draft' | 'inactive';
  isLocked: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ============= Payout Types =============

export type PayoutFrequency = 'monthly' | 'quarterly' | 'annual' | 'custom';

export type PayoutComponent = 'fixed' | 'variable' | 'spiff' | 'bonus' | 'presidents_club';

export type PayoutStatus = 
  | 'pending_calculation' 
  | 'calculated' 
  | 'pending_approval' 
  | 'approved' 
  | 'on_hold' 
  | 'released' 
  | 'clawed_back';

export interface PayoutLineItem {
  id: string;
  dealId: string;
  dealName: string;
  accountName: string;
  dealValue: number;
  commissionBasis: CommissionBasis;
  basisValue: number;
  discountApplied: number;
  marginAchieved: number;
  baseCommission: number;
  adjustments: number; // accelerator/decelerator/discount penalty
  finalCommission: number;
  payoutTriggerDate: string;
  status: 'pending' | 'approved' | 'paid' | 'clawed_back';
}

export interface Payout {
  id: string;
  salespersonId: string;
  salespersonName: string;
  period: string;
  frequency: PayoutFrequency;
  component: PayoutComponent;
  planId: string;
  planName: string;
  lineItems: PayoutLineItem[];
  grossAmount: number;
  holdbackAmount: number;
  clawbackAmount: number;
  netAmount: number;
  status: PayoutStatus;
  approvalLevel: number;
  approvedBy: string[];
  releaseDate: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============= Approval Workflow Types =============

export type ApprovalType = 'exception_payout' | 'manual_override' | 'special_bonus' | 'plan_change';

export interface ApprovalRequest {
  id: string;
  type: ApprovalType;
  entityId: string;
  entityType: 'payout' | 'plan' | 'target';
  requestedBy: string;
  requestedAmount: number;
  justification: string;
  approvalChain: ApprovalStep[];
  currentLevel: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalStep {
  level: number;
  role: 'sales_head' | 'finance' | 'hr' | 'ceo';
  approverId: string;
  approverName: string;
  status: 'pending' | 'approved' | 'rejected';
  comments: string;
  timestamp: string | null;
}

// ============= Performance Dashboard Types =============

export interface SalespersonPerformance {
  id: string;
  name: string;
  teamId: string;
  teamName: string;
  region: string;
  targets: TargetProgress[];
  expectedPayout: number;
  pipelineContribution: number;
  commissionLeakage: number;
  ytdEarnings: number;
  rank: number;
}

export interface TargetProgress {
  targetId: string;
  targetName: string;
  type: TargetType;
  target: number;
  achieved: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  daysRemaining: number;
}

export interface TeamPerformance {
  teamId: string;
  teamName: string;
  region: string;
  memberCount: number;
  totalTarget: number;
  totalAchieved: number;
  achievementPercentage: number;
  incentiveLiability: number;
  marginErosion: number;
  avgDiscount: number;
  avgPayout: number;
}

// ============= Audit Log Types =============

export interface AuditLog {
  id: string;
  entityType: 'target' | 'plan' | 'payout' | 'approval';
  entityId: string;
  action: 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'release' | 'clawback';
  changedBy: string;
  changedByRole: string;
  previousValue: Record<string, unknown>;
  newValue: Record<string, unknown>;
  timestamp: string;
  ipAddress: string;
}
