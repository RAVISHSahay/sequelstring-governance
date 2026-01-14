import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CalendarDays,
  Plus,
  Trash2,
  Settings2,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaymentMilestone {
  id: string;
  name: string;
  percentage: number;
  dueCondition: string;
  dueDays?: number;
}

export interface PaymentTerms {
  templateId: string;
  templateName: string;
  milestones: PaymentMilestone[];
  creditDays: number;
  requiresPO: boolean;
  requiresApproval: boolean;
}

const paymentTemplates: PaymentTerms[] = [
  {
    templateId: "standard-100",
    templateName: "100% Advance",
    milestones: [
      { id: "1", name: "Full Payment", percentage: 100, dueCondition: "with-po" },
    ],
    creditDays: 0,
    requiresPO: true,
    requiresApproval: false,
  },
  {
    templateId: "standard-50-50",
    templateName: "50-50 Split",
    milestones: [
      { id: "1", name: "Advance", percentage: 50, dueCondition: "with-po" },
      { id: "2", name: "On Completion", percentage: 50, dueCondition: "on-delivery" },
    ],
    creditDays: 0,
    requiresPO: true,
    requiresApproval: false,
  },
  {
    templateId: "implementation",
    templateName: "Implementation (50-30-20)",
    milestones: [
      { id: "1", name: "Project Kickoff", percentage: 50, dueCondition: "with-po" },
      { id: "2", name: "UAT Completion", percentage: 30, dueCondition: "on-uat" },
      { id: "3", name: "Go-Live", percentage: 20, dueCondition: "days-after-uat", dueDays: 30 },
    ],
    creditDays: 0,
    requiresPO: true,
    requiresApproval: false,
  },
  {
    templateId: "subscription-yearly",
    templateName: "Yearly Subscription",
    milestones: [
      { id: "1", name: "Annual Fee", percentage: 100, dueCondition: "yearly-advance" },
    ],
    creditDays: 0,
    requiresPO: true,
    requiresApproval: false,
  },
  {
    templateId: "net-30",
    templateName: "Net 30 Days",
    milestones: [
      { id: "1", name: "Full Payment", percentage: 100, dueCondition: "net-days", dueDays: 30 },
    ],
    creditDays: 30,
    requiresPO: false,
    requiresApproval: true,
  },
  {
    templateId: "custom",
    templateName: "Custom Terms",
    milestones: [],
    creditDays: 0,
    requiresPO: false,
    requiresApproval: true,
  },
];

const dueConditions = [
  { value: "with-po", label: "With Purchase Order" },
  { value: "on-delivery", label: "On Delivery" },
  { value: "on-uat", label: "On UAT Completion" },
  { value: "days-after-uat", label: "Days After UAT" },
  { value: "net-days", label: "Net Days" },
  { value: "yearly-advance", label: "Yearly Advance" },
  { value: "quarterly-advance", label: "Quarterly Advance" },
  { value: "monthly-arrears", label: "Monthly Arrears" },
];

interface PaymentTermsConfigProps {
  paymentTerms: PaymentTerms;
  onUpdatePaymentTerms: (terms: PaymentTerms) => void;
}

export function PaymentTermsConfig({
  paymentTerms,
  onUpdatePaymentTerms,
}: PaymentTermsConfigProps) {
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false);
  const [customMilestones, setCustomMilestones] = useState<PaymentMilestone[]>([]);
  const [newMilestone, setNewMilestone] = useState<Partial<PaymentMilestone>>({
    name: "",
    percentage: 0,
    dueCondition: "with-po",
  });

  const handleTemplateChange = (templateId: string) => {
    const template = paymentTemplates.find((t) => t.templateId === templateId);
    if (template) {
      if (templateId === "custom") {
        setCustomMilestones(paymentTerms.milestones);
        setIsCustomDialogOpen(true);
      } else {
        onUpdatePaymentTerms({ ...template });
      }
    }
  };

  const addCustomMilestone = () => {
    if (newMilestone.name && newMilestone.percentage) {
      const milestone: PaymentMilestone = {
        id: Date.now().toString(),
        name: newMilestone.name,
        percentage: newMilestone.percentage,
        dueCondition: newMilestone.dueCondition || "with-po",
        dueDays: newMilestone.dueDays,
      };
      setCustomMilestones([...customMilestones, milestone]);
      setNewMilestone({ name: "", percentage: 0, dueCondition: "with-po" });
    }
  };

  const removeCustomMilestone = (id: string) => {
    setCustomMilestones(customMilestones.filter((m) => m.id !== id));
  };

  const saveCustomTerms = () => {
    const totalPercentage = customMilestones.reduce((sum, m) => sum + m.percentage, 0);
    if (totalPercentage === 100) {
      onUpdatePaymentTerms({
        templateId: "custom",
        templateName: "Custom Terms",
        milestones: customMilestones,
        creditDays: paymentTerms.creditDays,
        requiresPO: true,
        requiresApproval: true,
      });
      setIsCustomDialogOpen(false);
    }
  };

  const totalMilestonePercent = paymentTerms.milestones.reduce(
    (sum, m) => sum + m.percentage,
    0
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          Payment Terms
        </h3>
        {paymentTerms.requiresApproval && (
          <Badge variant="outline" className="text-xs bg-accent/10 text-accent border-accent/20">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Requires Approval
          </Badge>
        )}
      </div>

      {/* Template Selector */}
      <div>
        <Label className="text-xs text-muted-foreground mb-1.5 block">
          Payment Template
        </Label>
        <Select
          value={paymentTerms.templateId}
          onValueChange={handleTemplateChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select payment terms" />
          </SelectTrigger>
          <SelectContent>
            {paymentTemplates.map((template) => (
              <SelectItem key={template.templateId} value={template.templateId}>
                <div className="flex items-center gap-2">
                  {template.templateId === "custom" ? (
                    <Settings2 className="h-4 w-4" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-success" />
                  )}
                  {template.templateName}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Milestones Display */}
      {paymentTerms.milestones.length > 0 && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="milestones" className="border-none">
            <AccordionTrigger className="text-sm py-2 hover:no-underline">
              <span className="flex items-center gap-2">
                Payment Milestones
                <Badge variant="secondary" className="text-xs">
                  {paymentTerms.milestones.length}
                </Badge>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                {paymentTerms.milestones.map((milestone, index) => (
                  <div
                    key={milestone.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/30 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{milestone.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {dueConditions.find((c) => c.value === milestone.dueCondition)?.label}
                          {milestone.dueDays && ` (${milestone.dueDays} days)`}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-none">
                      {milestone.percentage}%
                    </Badge>
                  </div>
                ))
                }
                <div className="flex items-center justify-between pt-2 text-sm">
                  <span className="text-muted-foreground">Total</span>
                  <span
                    className={cn(
                      "font-semibold",
                      totalMilestonePercent === 100 ? "text-success" : "text-destructive"
                    )}
                  >
                    {totalMilestonePercent}%
                  </span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* Credit Days */}
      {paymentTerms.creditDays > 0 && (
        <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
          <div className="flex items-center justify-between">
            <span className="text-sm">Credit Period</span>
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
              {paymentTerms.creditDays} Days
            </Badge>
          </div>
        </div>
      )}

      {/* PO Requirement */}
      <div className="flex items-center gap-2 text-sm">
        {paymentTerms.requiresPO ? (
          <>
            <CheckCircle className="h-4 w-4 text-success" />
            <span className="text-muted-foreground">Purchase Order required</span>
          </>
        ) : (
          <>
            <AlertTriangle className="h-4 w-4 text-accent" />
            <span className="text-muted-foreground">No PO requirement (needs approval)</span>
          </>
        )}
      </div>

      {/* Custom Terms Dialog */}
      <Dialog open={isCustomDialogOpen} onOpenChange={setIsCustomDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Configure Custom Payment Terms</DialogTitle>
            <DialogDescription>
              Define your own payment milestones. Total must equal 100%.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Existing Milestones */}
            {customMilestones.length > 0 && (
              <div className="space-y-2">
                {customMilestones.map((milestone, index) => (
                  <div
                    key={milestone.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{milestone.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {dueConditions.find((c) => c.value === milestone.dueCondition)?.label}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge>{milestone.percentage}%</Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeCustomMilestone(milestone.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
                }
              </div>
            )}

            <Separator />

            {/* Add New Milestone */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Add Milestone</Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Name</Label>
                  <Input
                    placeholder="e.g., Project Kickoff"
                    value={newMilestone.name}
                    onChange={(e) =>
                      setNewMilestone({ ...newMilestone, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Percentage</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    min={0}
                    max={100}
                    value={newMilestone.percentage || ""}
                    onChange={(e) =>
                      setNewMilestone({
                        ...newMilestone,
                        percentage: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Due Condition</Label>
                <Select
                  value={newMilestone.dueCondition}
                  onValueChange={(value) =>
                    setNewMilestone({ ...newMilestone, dueCondition: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dueConditions.map((condition) => (
                      <SelectItem key={condition.value} value={condition.value}>
                        {condition.label}
                      </SelectItem>
                    ))
                    }
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={addCustomMilestone}
                disabled={!newMilestone.name || !newMilestone.percentage}
              >
                <Plus className="h-4 w-4" />
                Add Milestone
              </Button>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
              <span className="font-medium">Total</span>
              <span
                className={cn(
                  "font-bold",
                  customMilestones.reduce((sum, m) => sum + m.percentage, 0) === 100
                    ? "text-success"
                    : "text-destructive"
                )}
              >
                {customMilestones.reduce((sum, m) => sum + m.percentage, 0)}%
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCustomDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={saveCustomTerms}
              disabled={
                customMilestones.reduce((sum, m) => sum + m.percentage, 0) !== 100
              }
            >
              Save Custom Terms
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
