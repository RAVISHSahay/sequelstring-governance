export type ActivityActionType =
  | "create"
  | "update"
  | "delete"
  | "view"
  | "export"
  | "import"
  | "login"
  | "logout"
  | "approve"
  | "reject"
  | "convert"
  | "assign"
  | "comment"
  | "upload"
  | "download"
  | "email";

export type ActivityEntityType =
  | "account"
  | "contact"
  | "lead"
  | "opportunity"
  | "quote"
  | "contract"
  | "order"
  | "activity"
  | "user"
  | "target"
  | "incentive"
  | "payout"
  | "poc"
  | "system";

export interface ActivityLogEntry {
  id: string;
  action: ActivityActionType;
  entityType: ActivityEntityType;
  entityName: string;
  entityId?: string;
  description: string;
  metadata?: Record<string, any>;
  userId: string;
  userName: string;
  userRole: string;
  timestamp: Date;
  ipAddress?: string;
}

// Mock activity log data
export const mockActivityLog: ActivityLogEntry[] = [
  {
    id: "1",
    action: "create",
    entityType: "opportunity",
    entityName: "Cloud Migration - HDFC Bank",
    entityId: "opp-001",
    description: "Created new opportunity worth ₹1.2 Cr",
    userId: "user-1",
    userName: "Priya Sharma",
    userRole: "Sales Representative",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: "2",
    action: "update",
    entityType: "quote",
    entityName: "Q-2025-0042",
    entityId: "quote-042",
    description: "Updated discount from 15% to 18%",
    metadata: { previousDiscount: "15%", newDiscount: "18%" },
    userId: "user-1",
    userName: "Priya Sharma",
    userRole: "Sales Representative",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: "3",
    action: "approve",
    entityType: "payout",
    entityName: "Payout #PAY-2025-001",
    entityId: "pay-001",
    description: "Approved commission payout of ₹2.5L for Rahul Mehta",
    userId: "user-2",
    userName: "Anil Kumar",
    userRole: "Finance",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "4",
    action: "convert",
    entityType: "lead",
    entityName: "Bajaj Finserv - Digital Platform",
    entityId: "lead-015",
    description: "Converted lead to opportunity (₹45L estimated)",
    userId: "user-3",
    userName: "Rahul Mehta",
    userRole: "Sales Representative",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    id: "5",
    action: "export",
    entityType: "account",
    entityName: "Accounts Export",
    description: "Exported 142 accounts to Excel",
    metadata: { format: "xlsx", recordCount: 142 },
    userId: "user-1",
    userName: "Priya Sharma",
    userRole: "Sales Representative",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "6",
    action: "create",
    entityType: "contact",
    entityName: "Vikram Patel",
    entityId: "contact-089",
    description: "Added new contact at Infosys (VP Engineering)",
    userId: "user-3",
    userName: "Rahul Mehta",
    userRole: "Sales Representative",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
  },
  {
    id: "7",
    action: "update",
    entityType: "opportunity",
    entityName: "ERP Integration - Wipro",
    entityId: "opp-023",
    description: "Moved from Proposal to Negotiation stage",
    metadata: { previousStage: "Proposal", newStage: "Negotiation" },
    userId: "user-1",
    userName: "Priya Sharma",
    userRole: "Sales Representative",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
  },
  {
    id: "8",
    action: "reject",
    entityType: "quote",
    entityName: "Q-2025-0039",
    entityId: "quote-039",
    description: "Rejected quote due to excessive discount (32%)",
    metadata: { reason: "Discount exceeds policy limit" },
    userId: "user-2",
    userName: "Anil Kumar",
    userRole: "Finance",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: "9",
    action: "import",
    entityType: "lead",
    entityName: "Leads Import",
    description: "Imported 28 leads from trade show CSV",
    metadata: { source: "Tech Summit 2025", recordCount: 28 },
    userId: "user-4",
    userName: "Sneha Reddy",
    userRole: "Sales Head",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
  },
  {
    id: "10",
    action: "create",
    entityType: "poc",
    entityName: "API Gateway POC - Axis Bank",
    entityId: "poc-012",
    description: "Created POC with 3 KPIs (30-day timeline)",
    userId: "user-1",
    userName: "Priya Sharma",
    userRole: "Sales Representative",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10),
  },
  {
    id: "11",
    action: "assign",
    entityType: "opportunity",
    entityName: "Data Analytics - TCS",
    entityId: "opp-045",
    description: "Reassigned opportunity from Rahul Mehta to Priya Sharma",
    metadata: { previousOwner: "Rahul Mehta", newOwner: "Priya Sharma" },
    userId: "user-4",
    userName: "Sneha Reddy",
    userRole: "Sales Head",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
  },
  {
    id: "12",
    action: "delete",
    entityType: "lead",
    entityName: "Duplicate - ABC Corp",
    entityId: "lead-old",
    description: "Deleted duplicate lead record",
    userId: "user-3",
    userName: "Rahul Mehta",
    userRole: "Sales Representative",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: "13",
    action: "login",
    entityType: "system",
    entityName: "User Session",
    description: "Logged in from Chrome on Windows",
    metadata: { browser: "Chrome 120", os: "Windows 11" },
    userId: "user-1",
    userName: "Priya Sharma",
    userRole: "Sales Representative",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26),
  },
  {
    id: "14",
    action: "update",
    entityType: "target",
    entityName: "Q1 2025 Revenue Target",
    entityId: "target-q1",
    description: "Updated team target from ₹5 Cr to ₹5.5 Cr",
    metadata: { previousValue: "₹5 Cr", newValue: "₹5.5 Cr" },
    userId: "user-4",
    userName: "Sneha Reddy",
    userRole: "Sales Head",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
  {
    id: "15",
    action: "create",
    entityType: "user",
    entityName: "Neha Gupta",
    entityId: "user-new",
    description: "Created new user account (Sales Representative)",
    userId: "user-admin",
    userName: "Admin User",
    userRole: "Administrator",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72),
  },
];

export const actionLabels: Record<ActivityActionType, string> = {
  create: "Created",
  update: "Updated",
  delete: "Deleted",
  view: "Viewed",
  export: "Exported",
  import: "Imported",
  login: "Logged in",
  logout: "Logged out",
  approve: "Approved",
  reject: "Rejected",
  convert: "Converted",
  assign: "Assigned",
  comment: "Commented",
  upload: "Uploaded",
  download: "Downloaded",
  email: "Emailed",
};

export const entityLabels: Record<ActivityEntityType, string> = {
  account: "Account",
  contact: "Contact",
  lead: "Lead",
  opportunity: "Opportunity",
  quote: "Quote",
  contract: "Contract",
  order: "Order",
  activity: "Activity",
  user: "User",
  target: "Target",
  incentive: "Incentive",
  payout: "Payout",
  poc: "POC",
  system: "System",
};

export function formatActivityTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}
