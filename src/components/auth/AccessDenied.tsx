import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldX, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { roleInfo } from '@/types/rbac';

interface AccessDeniedProps {
  title?: string;
  description?: string;
  requiredRole?: string;
}

export function AccessDenied({
  title = 'Access Denied',
  description = "You don't have permission to access this page.",
  requiredRole,
}: AccessDeniedProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="mx-auto h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <ShieldX className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {user && (
            <div className="p-3 bg-muted/50 rounded-lg text-sm">
              <p className="text-muted-foreground">Your current role:</p>
              <p className="font-medium">{roleInfo[user.role].label}</p>
            </div>
          )}
          {requiredRole && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm">
              <p className="text-amber-600 dark:text-amber-400">Required access level:</p>
              <p className="font-medium text-amber-700 dark:text-amber-300">{requiredRole}</p>
            </div>
          )}
          <div className="flex gap-2 justify-center pt-2">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Button onClick={() => navigate('/')}>
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
