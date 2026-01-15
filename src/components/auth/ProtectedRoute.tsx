import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Permission } from '@/types/rbac';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermissions?: Permission[];
  requireAll?: boolean; // If true, user must have ALL permissions. If false, ANY permission is enough.
  fallbackPath?: string;
}

export function ProtectedRoute({
  children,
  requiredPermissions = [],
  requireAll = false,
  fallbackPath = '/',
}: ProtectedRouteProps) {
  const { isAuthenticated, hasAnyPermission, hasAllPermissions } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login (or home for now since we don't have a login page)
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (requiredPermissions.length > 0) {
    const hasAccess = requireAll
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);

    if (!hasAccess) {
      return <Navigate to={fallbackPath} replace />;
    }
  }

  return <>{children}</>;
}
