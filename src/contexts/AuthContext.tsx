import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, UserRole, Permission, rolePermissions } from '@/types/rbac';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void; // For demo purposes
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  canAccessRoute: (route: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo - in production, this would come from a database
const mockUsers: Record<string, User> = {
  admin: {
    id: 'USR-001',
    email: 'admin@sequelstring.com',
    firstName: 'System',
    lastName: 'Admin',
    role: 'admin',
    isActive: true,
    createdAt: '2024-01-01',
    lastLogin: new Date().toISOString(),
  },
  sales_head: {
    id: 'USR-002',
    email: 'vikram.singh@sequelstring.com',
    firstName: 'Vikram',
    lastName: 'Singh',
    role: 'sales_head',
    teamId: 'TEAM-ENT',
    teamName: 'Enterprise Sales',
    region: 'North',
    isActive: true,
    createdAt: '2024-01-01',
    lastLogin: new Date().toISOString(),
  },
  finance: {
    id: 'USR-003',
    email: 'priya.finance@sequelstring.com',
    firstName: 'Priya',
    lastName: 'Gupta',
    role: 'finance',
    isActive: true,
    createdAt: '2024-01-01',
    lastLogin: new Date().toISOString(),
  },
  sales: {
    id: 'USR-004',
    email: 'rahul.sharma@sequelstring.com',
    firstName: 'Rahul',
    lastName: 'Sharma',
    role: 'sales',
    teamId: 'TEAM-ENT',
    teamName: 'Enterprise Sales',
    region: 'North',
    isActive: true,
    createdAt: '2024-01-01',
    lastLogin: new Date().toISOString(),
  },
};

// Route-permission mapping
const routePermissions: Record<string, Permission[]> = {
  '/': ['view_dashboard'],
  '/accounts': ['view_accounts'],
  '/contacts': ['view_contacts'],
  '/leads': ['view_leads'],
  '/opportunities': ['view_opportunities'],
  '/quotes': ['view_quotes'],
  '/quotes/new': ['manage_quotes'],
  '/contracts': ['view_contracts'],
  '/orders': ['view_orders'],
  '/activities': ['view_dashboard'],
  '/targets': ['view_targets'],
  '/incentives': ['view_incentives'],
  '/payouts': ['view_payouts'],
  '/performance': ['view_performance'],
  '/admin': ['view_admin'],
  '/reports': ['view_reports'],
  '/pricing': ['view_dashboard'],
  '/settings': ['view_dashboard'],
};

export function AuthProvider({ children }: { children: ReactNode }) {
  // Default to admin user for demo
  const [user, setUser] = useState<User | null>(mockUsers.admin);

  const isAuthenticated = user !== null;

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Mock login - in production, this would validate against a backend
    const foundUser = Object.values(mockUsers).find((u) => u.email === email);
    if (foundUser) {
      setUser({ ...foundUser, lastLogin: new Date().toISOString() });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  // For demo purposes - allows switching between roles to test RBAC
  const switchRole = useCallback((role: UserRole) => {
    const mockUser = mockUsers[role];
    if (mockUser) {
      setUser({ ...mockUser, lastLogin: new Date().toISOString() });
    }
  }, []);

  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      if (!user) return false;
      const permissions = rolePermissions[user.role] || [];
      return permissions.includes(permission);
    },
    [user]
  );

  const hasAnyPermission = useCallback(
    (permissions: Permission[]): boolean => {
      return permissions.some((p) => hasPermission(p));
    },
    [hasPermission]
  );

  const hasAllPermissions = useCallback(
    (permissions: Permission[]): boolean => {
      return permissions.every((p) => hasPermission(p));
    },
    [hasPermission]
  );

  const canAccessRoute = useCallback(
    (route: string): boolean => {
      const requiredPermissions = routePermissions[route];
      if (!requiredPermissions) return true; // Routes not in the map are accessible
      return hasAnyPermission(requiredPermissions);
    },
    [hasAnyPermission]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        switchRole,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        canAccessRoute,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
