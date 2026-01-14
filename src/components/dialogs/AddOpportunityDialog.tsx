import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface OpportunityData {
  id?: number;
  name: string;
  account: string;
  value: string;
  stage: string;
  probability: string;
  closeDate?: Date;
  owner: string;
}

interface AddOpportunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialStage?: string;
  editData?: OpportunityData | null;
  onSave?: (data: OpportunityData) => void;
}

const accounts = [
  "Tata Steel Ltd",
  "Reliance Industries",
  "Infosys Ltd",
  "HDFC Bank",
  "Mahindra Group",
  "Tech Mahindra",
  "L&T Infotech",
  "Bajaj Auto",
  "Kotak Bank",
  "Axis Bank",
  "ICICI Bank",
  "SBI Life",
  "Godrej Industries",
  "Wipro",
];

const stages = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won"];

const owners = [
  { name: "Priya Sharma", initials: "PS" },
  { name: "Rahul Mehta", initials: "RM" },
  { name: "Anjali Kumar", initials: "AK" },
  { name: "Vikram Desai", initials: "VD" },
  { name: "Sanjay Gupta", initials: "SG" },
];

const emptyFormData: OpportunityData = {
  name: "",
  account: "",
  value: "",
  stage: "Lead",
  probability: "20",
  closeDate: undefined,
  owner: "",
};

export function AddOpportunityDialog({ 
  open, 
  onOpenChange, 
  initialStage = "Lead",
  editData,
  onSave,
}: AddOpportunityDialogProps) {
  const [formData, setFormData] = useState<OpportunityData>({ ...emptyFormData, stage: initialStage });
  const isEditing = !!editData;

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData({ ...emptyFormData, stage: initialStage });
    }
  }, [editData, initialStage, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.account || !formData.value) {
      toast.error("Please fill in required fields");
      return;
    }

    if (onSave) {
      onSave(formData);
    }

    toast.success(isEditing ? "Opportunity updated successfully" : "Opportunity created successfully", {
      description: `${formData.name} has been ${isEditing ? "updated" : "added to " + formData.stage + " stage"}`,
    });
    
    setFormData({ ...emptyFormData, stage: initialStage });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Opportunity" : "Add New Opportunity"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update the opportunity details below." 
              : "Create a new opportunity in your pipeline. Required fields are marked with *."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Opportunity Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Enterprise Platform License"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account">Account *</Label>
              <Select
                value={formData.account}
                onValueChange={(value) => setFormData({ ...formData, account: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account} value={account}>
                      {account}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value">Deal Value (₹) *</Label>
                <Input
                  id="value"
                  type="text"
                  placeholder="e.g., 45,00,000"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="probability">Probability (%)</Label>
                <Input
                  id="probability"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.probability}
                  onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stage">Stage</Label>
                <Select
                  value={formData.stage}
                  onValueChange={(value) => setFormData({ ...formData, stage: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Expected Close Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.closeDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {formData.closeDate ? format(formData.closeDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.closeDate}
                      onSelect={(date) => setFormData({ ...formData, closeDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="owner">Assign To</Label>
              <Select
                value={formData.owner}
                onValueChange={(value) => setFormData({ ...formData, owner: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select owner" />
                </SelectTrigger>
                <SelectContent>
                  {owners.map((owner) => (
                    <SelectItem key={owner.name} value={owner.name}>
                      {owner.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{isEditing ? "Save Changes" : "Create Opportunity"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
