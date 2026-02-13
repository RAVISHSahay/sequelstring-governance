// Role-Based Access Control (RBAC) Types

export type UserRole = 'admin' | 'sales_head' | 'finance' | 'hr' | 'sales' | 'presales' | 'value_engineering' | 'viewer';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  teamId?: string;
  teamName?: string;
  region?: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin: string;
}

export type Permission =
  | 'view_dashboard'
  | 'view_accounts'
  | 'manage_accounts'
  | 'view_contacts'
  | 'manage_contacts'
  | 'view_leads'
  | 'manage_leads'
  | 'view_opportunities'
  | 'manage_opportunities'
  | 'view_quotes'
  | 'manage_quotes'
  | 'view_contracts'
  | 'manage_contracts'
  | 'view_orders'
  | 'manage_orders'
  | 'view_targets'
  | 'manage_targets'
  | 'view_incentives'
  | 'manage_incentives'
  | 'view_payouts'
  | 'manage_payouts'
  | 'approve_payouts'
  | 'view_performance'
  | 'view_admin'
  | 'manage_admin'
  | 'view_audit_logs'
  | 'manage_users'
  | 'view_reports'
  | 'manage_settings';

// Role-Permission Mapping
export const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    'view_dashboard',
    'view_accounts', 'manage_accounts',
    'view_contacts', 'manage_contacts',
    'view_leads', 'manage_leads',
    'view_opportunities', 'manage_opportunities',
    'view_quotes', 'manage_quotes',
    'view_contracts', 'manage_contracts',
    'view_orders', 'manage_orders',
    'view_targets', 'manage_targets',
    'view_incentives', 'manage_incentives',
    'view_payouts', 'manage_payouts', 'approve_payouts',
    'view_performance',
    'view_admin', 'manage_admin',
    'view_audit_logs',
    'manage_users',
    'view_reports',
    'manage_settings',
  ],
  sales_head: [
    'view_dashboard',
    'view_accounts', 'manage_accounts',
    'view_contacts', 'manage_contacts',
    'view_leads', 'manage_leads',
    'view_opportunities', 'manage_opportunities',
    'view_quotes', 'manage_quotes',
    'view_contracts',
    'view_orders',
    'view_targets', 'manage_targets',
    'view_incentives',
    'view_payouts', 'approve_payouts',
    'view_performance',
    'view_reports',
  ],
  finance: [
    'view_dashboard',
    'view_accounts',
    'view_contracts',
    'view_orders',
    'view_targets',
    'view_incentives',
    'view_payouts', 'manage_payouts', 'approve_payouts',
    'view_performance',
    'view_admin',
    'view_audit_logs',
    'view_reports',
  ],
  hr: [
    'view_dashboard',
    'view_targets',
    'view_incentives',
    'view_payouts', 'approve_payouts',
    'view_performance',
    'view_audit_logs',
    'manage_users',
    'view_reports',
  ],
  sales: [
    'view_dashboard',
    'view_accounts', 'manage_accounts',
    'view_contacts', 'manage_contacts',
    'view_leads', 'manage_leads',
    'view_opportunities', 'manage_opportunities',
    'view_quotes', 'manage_quotes',
    'view_contracts',
    'view_orders',
    'view_targets',
    'view_incentives',
    'view_payouts',
    'view_performance',
  ],
  presales: [
    'view_dashboard',
    'view_accounts',
    'view_opportunities',
    'view_quotes', 'manage_quotes',
    'view_contracts',
  ],
  value_engineering: [
    'view_dashboard',
    'view_accounts',
    'view_opportunities',
    'view_quotes', 'manage_quotes',
    'view_contracts',
    'view_reports',
  ],
  viewer: [
    'view_dashboard',
    'view_accounts',
    'view_contacts',
    'view_leads',
    'view_opportunities',
    'view_quotes',
    'view_contracts',
    'view_orders',
    'view_targets',
    'view_incentives',
    'view_payouts',
    'view_performance',
    'view_reports',
  ],
};

// Role display names and descriptions
export const roleInfo: Record<UserRole, { label: string; description: string; color: string }> = {
  admin: {
    label: 'Administrator',
    description: 'Full system access including user management and admin controls',
    color: 'bg-purple-500',
  },
  sales_head: {
    label: 'Sales Head',
    description: 'Manage sales team, approve payouts, set targets',
    color: 'bg-blue-500',
  },
  finance: {
    label: 'Finance',
    description: 'Approve payouts, view audit logs, financial reporting',
    color: 'bg-amber-500',
  },
  hr: {
    label: 'HR',
    description: 'Manage users, approve payouts, view performance',
    color: 'bg-pink-500',
  },
  sales: {
    label: 'Sales Representative',
    description: 'Manage accounts, leads, opportunities, and quotes',
    color: 'bg-emerald-500',
  },
  presales: {
    label: 'Presales',
    description: 'Support sales with technical expertise and demos',
    color: 'bg-cyan-500',
  },
  value_engineering: {
    label: 'Value Engineering',
    description: 'Analyze and demonstrate business value to clients',
    color: 'bg-indigo-500',
  },
  viewer: {
    label: 'Viewer',
    description: 'Read-only access to most areas',
    color: 'bg-slate-500',
  },
};
