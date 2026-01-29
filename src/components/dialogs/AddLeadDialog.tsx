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
import { toast } from "sonner";
import { useActivityLogger } from "@/hooks/useActivityLogger";

export interface LeadData {
  id?: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  source: string;
  subSource?: string; // Campaign name, call list, event, etc.
  quality: string; // Hot / Warm / Cold
  industry: string;
  geography: string;
  estimatedDealSize?: number; // in Lakhs
  owner: string;
}

interface AddLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: LeadData | null;
  onSave?: (data: LeadData) => void;
}

const sources = ["Marketing", "Telesales", "Campaign", "Partner", "Inbound", "Website", "Referral", "LinkedIn", "Event", "Cold Call"];
const qualityIndicators = ["Hot", "Warm", "Cold"];
const industries = [
  "Technology",
  "Financial Services",
  "Healthcare",
  "Manufacturing",
  "Retail",
  "Education",
  "Real Estate",
  "Consulting",
  "E-commerce",
  "Telecom",
  "Other"
];
const geographies = [
  "Mumbai",
  "Delhi NCR",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Kolkata",
  "Ahmedabad",
  "Gurgaon",
  "Noida",
  "Other"
];
const owners = [
  { name: "Priya Sharma", initials: "PS" },
  { name: "Rahul Mehta", initials: "RM" },
  { name: "Anjali Kumar", initials: "AK" },
  { name: "Vikram Desai", initials: "VD" },
];

const emptyFormData: LeadData = {
  name: "",
  email: "",
  phone: "",
  company: "",
  title: "",
  source: "",
  subSource: "",
  quality: "",
  industry: "",
  geography: "",
  estimatedDealSize: undefined,
  owner: "",
};

export function AddLeadDialog({ open, onOpenChange, editData, onSave }: AddLeadDialogProps) {
  const [formData, setFormData] = useState<LeadData>(emptyFormData);
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

    if (!formData.name || !formData.email || !formData.company || !formData.source || !formData.quality || !formData.industry || !formData.geography) {
      toast.error("Please fill in all required fields (Name, Email, Company, Source, Quality, Industry, Geography)");
      return;
    }

    if (onSave) {
      onSave(formData);
    }

    // Log activity
    if (isEditing) {
      log("update", "lead", formData.name, `Updated lead from ${formData.company}`, formData.id?.toString());
    } else {
      log("create", "lead", formData.name, `Created new lead from ${formData.company}`, undefined, { company: formData.company, source: formData.source });
    }

    toast.success(isEditing ? "Lead updated successfully" : "Lead created successfully", {
      description: `${formData.name} from ${formData.company} has been ${isEditing ? "updated" : "added"}`,
    });

    setFormData(emptyFormData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Lead" : "Add New Lead"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the lead details below."
              : "Enter the lead details below. Required fields are marked with *."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., VP Engineering"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                placeholder="Enter company name"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source">Lead Source *</Label>
                <Select
                  value={formData.source}
                  onValueChange={(value) => setFormData({ ...formData, source: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {sources.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subSource">Lead Sub-source</Label>
                <Input
                  id="subSource"
                  placeholder="e.g., Digital Campaign Q1"
                  value={formData.subSource || ""}
                  onChange={(e) => setFormData({ ...formData, subSource: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quality">Lead Quality *</Label>
                <Select
                  value={formData.quality}
                  onValueChange={(value) => setFormData({ ...formData, quality: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    {qualityIndicators.map((quality) => (
                      <SelectItem key={quality} value={quality}>
                        {quality}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <Select
                  value={formData.industry}
                  onValueChange={(value) => setFormData({ ...formData, industry: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="geography">Geography *</Label>
                <Select
                  value={formData.geography}
                  onValueChange={(value) => setFormData({ ...formData, geography: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select geography" />
                  </SelectTrigger>
                  <SelectContent>
                    {geographies.map((geo) => (
                      <SelectItem key={geo} value={geo}>
                        {geo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dealSize">Est. Deal Size (₹ Lakhs)</Label>
                <Input
                  id="dealSize"
                  type="number"
                  placeholder="e.g., 25"
                  value={formData.estimatedDealSize || ""}
                  onChange={(e) => setFormData({ ...formData, estimatedDealSize: e.target.value ? parseFloat(e.target.value) : undefined })}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
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
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{isEditing ? "Save Changes" : "Create Lead"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
