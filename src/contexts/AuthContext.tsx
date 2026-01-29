import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Permission, rolePermissions, UserRole } from '@/types/rbac';

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
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  canAccessRoute: (route: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile from profiles table
  const fetchProfile = useCallback(async (userId: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return {
        id: data.id,
        email: data.email,
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        role: (data.role as UserRole) || 'sales',
        teamId: data.team_id || undefined,
        teamName: data.team_name || undefined,
        region: data.region || undefined,
        avatarUrl: data.avatar_url || undefined,
        isActive: data.is_active,
        createdAt: data.created_at,
        lastLogin: new Date().toISOString(),
      };
    } catch (err) {
      console.error('Error fetching profile:', err);
      return null;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Defer profile fetch with setTimeout to prevent deadlock
          setTimeout(() => {
            fetchProfile(currentSession.user.id).then(profile => {
              setUser(profile);
              setIsLoading(false);
            });
          }, 0);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      setSession(existingSession);
      
      if (existingSession?.user) {
        fetchProfile(existingSession.user.id).then(profile => {
          setUser(profile);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const isAuthenticated = user !== null && session !== null;

  const login = useCallback(async (email: string, password: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }, []);

  // For demo purposes - allows switching between roles
  const switchRole = useCallback(async (role: UserRole) => {
    if (!user) return;
    
    // Update role in database
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', user.id);

    if (!error) {
      setUser(prev => prev ? { ...prev, role } : null);
    }
  }, [user]);

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
      if (!requiredPermissions) return true;
      return hasAnyPermission(requiredPermissions);
    },
    [hasAnyPermission]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated,
        isLoading,
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
