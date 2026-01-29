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
import { UserPlus } from 'lucide-react';
import { useActivityLogger } from '@/hooks/useActivityLogger';

interface Contact {
  id: number;
  name: string;
  title: string;
  account: string;
  email: string;
  phone: string;
  role: string;
  influence: string;
  lastContact: string;
}

interface AddContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (contact: Contact) => void;
  contact?: Contact | null;
  mode?: 'create' | 'edit';
  defaultAccount?: string;
}

const roles = ['Decision Maker', 'Executive Sponsor', 'Champion', 'Technical Buyer', 'Economic Buyer', 'Influencer'];
const influences = ['Critical', 'High', 'Medium', 'Low'];
const accounts = [
  'Tata Steel Ltd',
  'Reliance Industries',
  'HDFC Bank',
  'Infosys Ltd',
  'Mahindra Group',
  'Wipro Technologies',
  'State Bank of India',
  'ONGC',
];

export function AddContactDialog({ open, onOpenChange, onSave, contact, mode = 'create', defaultAccount = '' }: AddContactDialogProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    title: '',
    account: defaultAccount,
    email: '',
    phone: '',
    role: '',
    influence: '',
  });
  const { log } = useActivityLogger();

  useEffect(() => {
    if (contact && mode === 'edit') {
      const [firstName, ...lastParts] = contact.name.split(' ');
      setFormData({
        firstName,
        lastName: lastParts.join(' '),
        title: contact.title,
        account: contact.account,
        email: contact.email,
        phone: contact.phone,
        role: contact.role,
        influence: contact.influence,
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        title: '',
        account: defaultAccount,
        email: '',
        phone: '',
        role: '',
        influence: '',
      });
    }
  }, [contact, mode, open, defaultAccount]);

  const handleSubmit = () => {
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const newContact: Contact = {
      id: contact?.id || Date.now(),
      name: fullName,
      title: formData.title,
      account: formData.account,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      influence: formData.influence,
      lastContact: 'Just now',
    };

    // Log activity
    if (mode === 'edit') {
      log("update", "contact", fullName, `Updated contact at ${formData.account}`, contact?.id?.toString());
    } else {
      log("create", "contact", fullName, `Added new contact at ${formData.account} (${formData.title || 'No title'})`, undefined, { account: formData.account, role: formData.role });
    }

    onSave(newContact);
    onOpenChange(false);
  };

  const isValid =
    formData.firstName.trim() !== '' &&
    formData.lastName.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.account !== '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            {mode === 'create' ? 'Add New Contact' : 'Edit Contact'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Add a new contact to your CRM'
              : 'Update contact information'}
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
                placeholder="First name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., CTO, VP Engineering"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="account">Account *</Label>
            <Select
              value={formData.account}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, account: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((acc) => (
                  <SelectItem key={acc} value={acc}>
                    {acc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="email@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Contact Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="influence">Influence Level</Label>
              <Select
                value={formData.influence}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, influence: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select influence" />
                </SelectTrigger>
                <SelectContent>
                  {influences.map((inf) => (
                    <SelectItem key={inf} value={inf}>
                      {inf}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            {mode === 'create' ? 'Add Contact' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
