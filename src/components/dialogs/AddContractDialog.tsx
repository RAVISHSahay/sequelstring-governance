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
import { useActivityLogger } from "@/hooks/useActivityLogger";

export interface ContractData {
  id?: string;
  name: string;
  account: string;
  opportunityId?: string;
  type: string;
  value: string;
  status: string;
  startDate?: Date;
  endDate?: Date;
}

interface AddContractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: ContractData | null;
  onSave?: (data: ContractData) => void;
}

const accounts = [
  "Tata Steel Ltd",
  "Reliance Industries",
  "Infosys Ltd",
  "HDFC Bank",
  "Mahindra Group",
  "ICICI Bank",
  "SBI Life",
];

const contractTypes = [
  { value: "MSA", label: "Master Service Agreement" },
  { value: "License", label: "Platform License" },
  { value: "Support", label: "Support Contract" },
  { value: "NDA", label: "Non-Disclosure Agreement" },
  { value: "Services", label: "Professional Services" },
  { value: "SLA", label: "Service Level Agreement" },
];

const statusOptions = [
  { value: "Draft", label: "Draft" },
  { value: "Pending Signature", label: "Pending Signature" },
  { value: "Active", label: "Active" },
  { value: "Expired", label: "Expired" },
  { value: "Terminated", label: "Terminated" },
];

// Mock opportunities for linking
const opportunityOptions = [
  { id: "OPP-001", name: "Enterprise License Deal - Tata Steel" },
  { id: "OPP-002", name: "Cloud Migration Project - HDFC" },
  { id: "OPP-003", name: "Support Renewal - Infosys" },
  { id: "OPP-004", name: "Data Analytics Suite - Reliance" },
];

const emptyFormData: ContractData = {
  name: "",
  account: "",
  opportunityId: "",
  type: "",
  value: "",
  status: "Draft",
  startDate: undefined,
  endDate: undefined,
};

export function AddContractDialog({ open, onOpenChange, editData, onSave }: AddContractDialogProps) {
  const [formData, setFormData] = useState<ContractData>(emptyFormData);
  const { log } = useActivityLogger();
  const isEditing = !!editData;

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData(emptyFormData);
    }
  }, [editData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.account || !formData.type) {
      toast.error("Please fill in required fields");
      return;
    }

    if (onSave) {
      onSave(formData);
    }

    const year = new Date().getFullYear();
    const contractId = formData.id || (formData.type === "NDA"
      ? `NDA-${year}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
      : `CNT-${year}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`);

    // Log activity
    if (isEditing) {
      log("update", "contract", formData.name, `Updated contract for ${formData.account}`, formData.id);
    } else {
      log("create", "contract", contractId, `Created new ${formData.type} contract for ${formData.account}`, undefined, { type: formData.type, account: formData.account, value: formData.value });
    }

    toast.success(isEditing ? "Contract updated successfully" : "Contract created successfully", {
      description: isEditing
        ? `${formData.name} has been updated`
        : `${contractId} has been created for ${formData.account}`,
    });

    setFormData(emptyFormData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Contract" : "New Contract"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the contract details below."
              : "Create a new contract or agreement. Required fields are marked with *."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Contract Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Annual Support Contract"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="type">Contract Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {contractTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="opportunity">Linked Opportunity</Label>
                <Select
                  value={formData.opportunityId}
                  onValueChange={(value) => setFormData({ ...formData, opportunityId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select opportunity" />
                  </SelectTrigger>
                  <SelectContent>
                    {opportunityOptions.map((opp) => (
                      <SelectItem key={opp.id} value={opp.id}>
                        {opp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Contract Value (₹)</Label>
              <Input
                id="value"
                type="text"
                placeholder="e.g., 45,00,000"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => setFormData({ ...formData, startDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {formData.endDate ? format(formData.endDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => setFormData({ ...formData, endDate: date })}
                      initialFocus
                      disabled={(date) => formData.startDate ? date < formData.startDate : false}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{isEditing ? "Save Changes" : "Create Contract"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
