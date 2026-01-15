import { useAuth } from '@/contexts/AuthContext';
import { UserRole, roleInfo } from '@/types/rbac';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Shield, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RoleSwitcher() {
  const { user, switchRole } = useAuth();

  if (!user) return null;

  const roles: UserRole[] = ['admin', 'sales_head', 'finance', 'hr', 'sales', 'viewer'];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Shield className="h-4 w-4" />
          <span className="hidden sm:inline">{roleInfo[user.role].label}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Switch Role (Demo)</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {roles.map((role) => (
          <DropdownMenuItem
            key={role}
            onClick={() => switchRole(role)}
            className="flex items-start gap-3 py-2"
          >
            <div
              className={cn(
                'h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5',
                roleInfo[role].color
              )}
            >
              {roleInfo[role].label.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{roleInfo[role].label}</span>
                {user.role === role && <Check className="h-4 w-4 text-primary" />}
              </div>
              <p className="text-xs text-muted-foreground">{roleInfo[role].description}</p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
