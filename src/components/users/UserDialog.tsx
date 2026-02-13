import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { User, UserRole, roleInfo } from '@/types/rbac';
import { teams, regions } from '@/data/mockUsers';
import { UserPlus, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  onSave: (user: Partial<User>) => void;
  mode: 'create' | 'edit';
}

const roles: UserRole[] = ['admin', 'sales_head', 'finance', 'hr', 'sales', 'presales', 'value_engineering', 'viewer'];

export function UserDialog({ open, onOpenChange, user, onSave, mode }: UserDialogProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'sales' as UserRole,
    teamId: '',
    teamName: '',
    region: '',
    isActive: true,
  });

  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        teamId: user.teamId || '',
        teamName: user.teamName || '',
        region: user.region || '',
        isActive: user.isActive,
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        role: 'sales',
        teamId: '',
        teamName: '',
        region: '',
        isActive: true,
      });
    }
  }, [user, mode, open]);

  const handleTeamChange = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId);
    setFormData((prev) => ({
      ...prev,
      teamId,
      teamName: team?.name || '',
    }));
  };

  const handleSubmit = () => {
    const userData: Partial<User> = {
      ...formData,
      id: user?.id || `USR-${Date.now()}`,
      createdAt: user?.createdAt || new Date().toISOString().split('T')[0],
      lastLogin: user?.lastLogin || new Date().toISOString(),
    };
    onSave(userData);
    onOpenChange(false);
  };

  const isValid =
    formData.firstName.trim() !== '' &&
    formData.lastName.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.email.includes('@');

  const showTeamFields = ['sales', 'sales_head', 'presales', 'value_engineering'].includes(formData.role);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'create' ? (
              <>
                <UserPlus className="h-5 w-5 text-primary" />
                Add New User
              </>
            ) : (
              <>
                <Edit2 className="h-5 w-5 text-primary" />
                Edit User
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Create a new user account and assign their role'
              : 'Update user information and role assignment'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                placeholder="Enter first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="user@sequelstring.com"
            />
          </div>

          <div className="space-y-2">
            <Label>Role *</Label>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, role }))}
                  className={cn(
                    'flex items-center gap-2 p-3 rounded-lg border text-left transition-colors',
                    formData.role === role
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <div
                    className={cn(
                      'h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold',
                      roleInfo[role].color
                    )}
                  >
                    {roleInfo[role].label.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{roleInfo[role].label}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {roleInfo[role].description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {showTeamFields && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Team</Label>
                <Select value={formData.teamId} onValueChange={handleTeamChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Region</Label>
                <Select
                  value={formData.region}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, region: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div>
              <Label htmlFor="isActive" className="cursor-pointer">
                Account Status
              </Label>
              <p className="text-sm text-muted-foreground">
                {formData.isActive ? 'User can access the system' : 'User access is disabled'}
              </p>
            </div>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            {mode === 'create' ? 'Create User' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
