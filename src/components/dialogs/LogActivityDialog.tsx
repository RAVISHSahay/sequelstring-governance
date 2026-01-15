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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ClipboardList, Phone, Mail, Video, CheckCircle, FileText, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Activity {
  id: number;
  type: string;
  icon: any;
  title: string;
  description: string;
  account: string;
  contact: string;
  user: string;
  initials: string;
  time: string;
  duration: string;
  outcome: string;
}

interface LogActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (activity: Activity) => void;
  defaultAccount?: string;
  accountContacts?: string[];
}

const activityTypes = [
  { value: 'call', label: 'Call', icon: Phone },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'meeting', label: 'Meeting', icon: Video },
  { value: 'task', label: 'Task', icon: CheckCircle },
  { value: 'note', label: 'Note', icon: FileText },
];

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

const defaultContacts = [
  'Rajesh Sharma',
  'Priya Menon',
  'Amit Patel',
  'Sunita Reddy',
  'Vikram Singh',
];

const outcomes = ['Positive', 'Negative', 'Neutral', 'Completed', 'Sent', 'Pending'];

export function LogActivityDialog({ open, onOpenChange, onSave, defaultAccount = '', accountContacts }: LogActivityDialogProps) {
  const contacts = accountContacts && accountContacts.length > 0 ? accountContacts : defaultContacts;
  const [formData, setFormData] = useState({
    type: 'call',
    title: '',
    description: '',
    account: defaultAccount,
    contact: '',
    duration: '',
    outcome: 'Positive',
  });

  useEffect(() => {
    if (open) {
      setFormData({
        type: 'call',
        title: '',
        description: '',
        account: defaultAccount,
        contact: '',
        duration: '',
        outcome: 'Positive',
      });
    }
  }, [open, defaultAccount]);

  const getIcon = (type: string) => {
    const activityType = activityTypes.find((t) => t.value === type);
    return activityType?.icon || Phone;
  };

  const handleSubmit = () => {
    const Icon = getIcon(formData.type);
    const newActivity: Activity = {
      id: Date.now(),
      type: formData.type,
      icon: Icon,
      title: formData.title,
      description: formData.description,
      account: formData.account,
      contact: formData.contact,
      user: 'Current User',
      initials: 'CU',
      time: 'Just now',
      duration: formData.duration || '-',
      outcome: formData.outcome,
    };
    onSave(newActivity);
    onOpenChange(false);
  };

  const isValid =
    formData.title.trim() !== '' &&
    formData.account !== '' &&
    formData.contact !== '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Log Activity
          </DialogTitle>
          <DialogDescription>
            Record a new activity in your CRM
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Activity Type Selection */}
          <div className="space-y-2">
            <Label>Activity Type *</Label>
            <div className="flex gap-2">
              {activityTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, type: type.value }))}
                    className={cn(
                      'flex flex-col items-center gap-1 p-3 rounded-lg border transition-colors flex-1',
                      formData.type === type.value
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Discovery Call - Tata Steel"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Add notes about this activity..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            <div className="space-y-2">
              <Label htmlFor="contact">Contact *</Label>
              <Select
                value={formData.contact}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, contact: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select contact" />
                </SelectTrigger>
                <SelectContent>
                  {contacts.map((contact) => (
                    <SelectItem key={contact} value={contact}>
                      {contact}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
                placeholder="e.g., 45 min"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="outcome">Outcome</Label>
              <Select
                value={formData.outcome}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, outcome: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select outcome" />
                </SelectTrigger>
                <SelectContent>
                  {outcomes.map((outcome) => (
                    <SelectItem key={outcome} value={outcome}>
                      {outcome}
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
            Log Activity
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
