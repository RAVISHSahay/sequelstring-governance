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
import { Building2 } from 'lucide-react';
import { useActivityLogger } from '@/hooks/useActivityLogger';

interface Account {
  id: number;
  name: string;
  type: string;
  industry: string;
  revenue: string;
  deals: number;
  contacts: number;
  status: string;
  owner: string;
  gstin?: string;
  pan?: string;
}

interface AddAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (account: Account) => void;
  account?: Account | null;
  mode?: 'create' | 'edit';
}

const accountTypes = ['Enterprise', 'PSU', 'Government', 'SMB', 'Startup'];
const industries = [
  'Manufacturing',
  'IT Services',
  'Banking',
  'Conglomerate',
  'Automotive',
  'Oil & Gas',
  'Pharmaceuticals',
  'Telecommunications',
  'Retail',
  'Healthcare',
];
const statuses = ['Active', 'Prospect', 'Inactive', 'Churned'];
const owners = ['Priya Sharma', 'Rahul Mehta', 'Anjali Kumar', 'Vikram Das', 'Sanjay Gupta'];

export function AddAccountDialog({ open, onOpenChange, onSave, account, mode = 'create' }: AddAccountDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    industry: '',
    revenue: '',
    status: 'Prospect',
    owner: '',
    gstin: '',
    pan: '',
  });
  const { log } = useActivityLogger();

  useEffect(() => {
    if (account && mode === 'edit') {
      setFormData({
        name: account.name,
        type: account.type,
        industry: account.industry,
        revenue: account.revenue.replace('₹', '').trim(),
        status: account.status,
        owner: account.owner,
        gstin: account.gstin || '',
        pan: account.pan || '',
      });
    } else {
      setFormData({
        name: '',
        type: '',
        industry: '',
        revenue: '',
        status: 'Prospect',
        owner: '',
        gstin: '',
        pan: '',
      });
    }
  }, [account, mode, open]);

  const handleSubmit = () => {
    const newAccount: Account = {
      id: account?.id || Date.now(),
      name: formData.name,
      type: formData.type,
      industry: formData.industry,
      revenue: formData.revenue.startsWith('₹') ? formData.revenue : `₹${formData.revenue}`,
      deals: account?.deals || 0,
      contacts: account?.contacts || 0,
      status: formData.status,
      owner: formData.owner,
      gstin: formData.gstin,
      pan: formData.pan,
    };

    // Log activity
    if (mode === 'edit') {
      log("update", "account", formData.name, `Updated account in ${formData.industry}`, account?.id?.toString());
    } else {
      log("create", "account", formData.name, `Created new ${formData.type} account in ${formData.industry}`, undefined, { type: formData.type, industry: formData.industry });
    }

    onSave(newAccount);
    onOpenChange(false);
  };

  const isValid =
    formData.name.trim() !== '' &&
    formData.type !== '' &&
    formData.industry !== '' &&
    formData.owner !== '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            {mode === 'create' ? 'Add New Account' : 'Edit Account'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Create a new account in your CRM'
              : 'Update account information'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Account Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter company name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Account Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {accountTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry *</Label>
              <Select
                value={formData.industry}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, industry: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((ind) => (
                    <SelectItem key={ind} value={ind}>
                      {ind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="revenue">Annual Revenue</Label>
              <Input
                id="revenue"
                value={formData.revenue}
                onChange={(e) => setFormData((prev) => ({ ...prev, revenue: e.target.value }))}
                placeholder="e.g., 2.4 Cr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gstin">GSTIN</Label>
              <Input
                id="gstin"
                value={formData.gstin}
                onChange={(e) => setFormData((prev) => ({ ...prev, gstin: e.target.value.toUpperCase() }))}
                placeholder="22AAAAA0000A1Z5"
                maxLength={15}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pan">PAN</Label>
              <Input
                id="pan"
                value={formData.pan}
                onChange={(e) => setFormData((prev) => ({ ...prev, pan: e.target.value.toUpperCase() }))}
                placeholder="ABCDE1234F"
                maxLength={10}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="owner">Account Owner *</Label>
            <Select
              value={formData.owner}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, owner: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select owner" />
              </SelectTrigger>
              <SelectContent>
                {owners.map((owner) => (
                  <SelectItem key={owner} value={owner}>
                    {owner}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            {mode === 'create' ? 'Add Account' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
