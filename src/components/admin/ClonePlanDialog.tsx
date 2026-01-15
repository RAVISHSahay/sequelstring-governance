import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Copy, Building2 } from 'lucide-react';
import { IncentivePlan } from '@/types/incentives';

interface ClonePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: IncentivePlan;
  onClone: (plan: IncentivePlan) => void;
}

const availableTeams = [
  'Enterprise Sales',
  'SMB Sales',
  'Govt Sales',
  'Channel Partners',
  'Inside Sales',
  'Strategic Accounts',
];

export function ClonePlanDialog({ open, onOpenChange, plan, onClone }: ClonePlanDialogProps) {
  const [name, setName] = useState(`${plan.name} (Copy)`);
  const [description, setDescription] = useState(plan.description);
  const [selectedTeams, setSelectedTeams] = useState<string[]>(plan.applicableTeams);
  const [effectiveFrom, setEffectiveFrom] = useState('');
  const [effectiveTo, setEffectiveTo] = useState('');
  const [adjustBaseRate, setAdjustBaseRate] = useState(false);
  const [newBaseRate, setNewBaseRate] = useState(plan.baseRate);

  const handleTeamToggle = (team: string) => {
    setSelectedTeams((prev) =>
      prev.includes(team) ? prev.filter((t) => t !== team) : [...prev, team]
    );
  };

  const handleClone = () => {
    const clonedPlan: IncentivePlan = {
      ...plan,
      id: `PLAN-${Date.now()}`,
      name,
      description,
      applicableTeams: selectedTeams,
      effectiveFrom: effectiveFrom || plan.effectiveFrom,
      effectiveTo: effectiveTo || plan.effectiveTo,
      baseRate: adjustBaseRate ? newBaseRate : plan.baseRate,
      status: 'draft',
      isLocked: false,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    onClone(clonedPlan);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5 text-primary" />
            Clone Incentive Plan
          </DialogTitle>
          <DialogDescription>
            Create a copy of "{plan.name}" with optional modifications
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>New Plan Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Applicable Teams
            </Label>
            <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
              {availableTeams.map((team) => (
                <Badge
                  key={team}
                  variant={selectedTeams.includes(team) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => handleTeamToggle(team)}
                >
                  {team}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Effective From</Label>
              <Input
                type="date"
                value={effectiveFrom}
                onChange={(e) => setEffectiveFrom(e.target.value)}
                placeholder={plan.effectiveFrom}
              />
              <p className="text-xs text-muted-foreground">Original: {plan.effectiveFrom}</p>
            </div>
            <div className="space-y-2">
              <Label>Effective To</Label>
              <Input
                type="date"
                value={effectiveTo}
                onChange={(e) => setEffectiveTo(e.target.value)}
                placeholder={plan.effectiveTo}
              />
              <p className="text-xs text-muted-foreground">Original: {plan.effectiveTo}</p>
            </div>
          </div>

          <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="adjustRate"
                checked={adjustBaseRate}
                onCheckedChange={(checked) => setAdjustBaseRate(checked === true)}
              />
              <Label htmlFor="adjustRate" className="cursor-pointer">
                Adjust base commission rate
              </Label>
            </div>
            {adjustBaseRate && (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={newBaseRate}
                  onChange={(e) => setNewBaseRate(Number(e.target.value))}
                  className="w-24"
                  step={0.5}
                  min={0}
                  max={100}
                />
                <span className="text-sm text-muted-foreground">
                  % (original: {plan.baseRate}%)
                </span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleClone} disabled={!name || selectedTeams.length === 0}>
            <Copy className="mr-2 h-4 w-4" />
            Clone Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
