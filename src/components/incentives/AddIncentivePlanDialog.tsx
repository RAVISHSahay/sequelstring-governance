import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { IncentivePlan, CommissionModel, CommissionBasis, PayoutTrigger, CommissionSlab } from "@/types/incentives";

interface AddIncentivePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Partial<IncentivePlan>) => void;
  editData: IncentivePlan | null;
}

const modelOptions: { value: CommissionModel; label: string }[] = [
  { value: "flat_percentage", label: "Flat Percentage" },
  { value: "slab_based", label: "Slab-Based" },
  { value: "tiered", label: "Tiered Commission" },
  { value: "product_wise", label: "Product-Wise" },
  { value: "margin_based", label: "Margin-Based" },
  { value: "discount_linked", label: "Discount-Linked" },
  { value: "accelerator", label: "Accelerator" },
  { value: "decelerator", label: "Decelerator" },
];

const basisOptions: { value: CommissionBasis; label: string }[] = [
  { value: "quote_value", label: "Quote Value" },
  { value: "order_value", label: "Order Value" },
  { value: "invoice_value", label: "Invoice Value" },
  { value: "collection", label: "Collection Received" },
  { value: "net_revenue", label: "Net Revenue" },
];

const triggerOptions: { value: PayoutTrigger; label: string }[] = [
  { value: "deal_closure", label: "Deal Closure" },
  { value: "invoice_generation", label: "Invoice Generation" },
  { value: "payment_receipt", label: "Payment Receipt" },
  { value: "milestone_completion", label: "Milestone Completion" },
  { value: "combination", label: "Combination" },
];

export function AddIncentivePlanDialog({ open, onOpenChange, onSave, editData }: AddIncentivePlanDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    commissionModel: "flat_percentage" as CommissionModel,
    commissionBasis: "order_value" as CommissionBasis,
    payoutTrigger: "payment_receipt" as PayoutTrigger,
    baseRate: 5,
    slabs: [] as CommissionSlab[],
    acceleratorThreshold: 100,
    acceleratorMultiplier: 1.5,
    deceleratorThreshold: 20,
    deceleratorMultiplier: 0.8,
    discountPenaltyEnabled: false,
    discountPenaltyRate: 0,
    effectiveFrom: "",
    effectiveTo: "",
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name,
        description: editData.description,
        commissionModel: editData.commissionModel,
        commissionBasis: editData.commissionBasis,
        payoutTrigger: editData.payoutTrigger,
        baseRate: editData.baseRate,
        slabs: editData.slabs,
        acceleratorThreshold: editData.acceleratorThreshold,
        acceleratorMultiplier: editData.acceleratorMultiplier,
        deceleratorThreshold: editData.deceleratorThreshold,
        deceleratorMultiplier: editData.deceleratorMultiplier,
        discountPenaltyEnabled: editData.discountPenaltyEnabled,
        discountPenaltyRate: editData.discountPenaltyRate,
        effectiveFrom: editData.effectiveFrom,
        effectiveTo: editData.effectiveTo,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        commissionModel: "flat_percentage",
        commissionBasis: "order_value",
        payoutTrigger: "payment_receipt",
        baseRate: 5,
        slabs: [],
        acceleratorThreshold: 100,
        acceleratorMultiplier: 1.5,
        deceleratorThreshold: 20,
        deceleratorMultiplier: 0.8,
        discountPenaltyEnabled: false,
        discountPenaltyRate: 0,
        effectiveFrom: new Date().toISOString().split('T')[0],
        effectiveTo: "",
      });
    }
  }, [editData, open]);

  const handleAddSlab = () => {
    setFormData({
      ...formData,
      slabs: [
        ...formData.slabs,
        {
          id: `slab-${Date.now()}`,
          minValue: formData.slabs.length > 0 ? (formData.slabs[formData.slabs.length - 1].maxValue || 0) : 0,
          maxValue: null,
          rate: formData.baseRate,
        },
      ],
    });
  };

  const handleRemoveSlab = (id: string) => {
    setFormData({
      ...formData,
      slabs: formData.slabs.filter((slab) => slab.id !== id),
    });
  };

  const handleSlabChange = (id: string, field: keyof CommissionSlab, value: number | null) => {
    setFormData({
      ...formData,
      slabs: formData.slabs.map((slab) =>
        slab.id === id ? { ...slab, [field]: value } : slab
      ),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  const showSlabs = ["slab_based", "tiered"].includes(formData.commissionModel);
  const showAccelerator = formData.commissionModel === "accelerator";
  const showDecelerator = formData.commissionModel === "decelerator" || formData.commissionModel === "margin_based";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Incentive Plan" : "Create Incentive Plan"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Plan Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Q1 Sales Incentive Plan"
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the incentive plan..."
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="commissionModel">Commission Model</Label>
              <Select
                value={formData.commissionModel}
                onValueChange={(value: CommissionModel) => setFormData({ ...formData, commissionModel: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {modelOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="baseRate">Base Commission Rate (%)</Label>
              <Input
                id="baseRate"
                type="number"
                step="0.1"
                min={0}
                max={100}
                value={formData.baseRate}
                onChange={(e) => setFormData({ ...formData, baseRate: Number(e.target.value) })}
              />
            </div>

            <div>
              <Label htmlFor="commissionBasis">Commission Basis</Label>
              <Select
                value={formData.commissionBasis}
                onValueChange={(value: CommissionBasis) => setFormData({ ...formData, commissionBasis: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select basis" />
                </SelectTrigger>
                <SelectContent>
                  {basisOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="payoutTrigger">Payout Trigger</Label>
              <Select
                value={formData.payoutTrigger}
                onValueChange={(value: PayoutTrigger) => setFormData({ ...formData, payoutTrigger: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select trigger" />
                </SelectTrigger>
                <SelectContent>
                  {triggerOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="effectiveFrom">Effective From</Label>
              <Input
                id="effectiveFrom"
                type="date"
                value={formData.effectiveFrom}
                onChange={(e) => setFormData({ ...formData, effectiveFrom: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="effectiveTo">Effective To</Label>
              <Input
                id="effectiveTo"
                type="date"
                value={formData.effectiveTo}
                onChange={(e) => setFormData({ ...formData, effectiveTo: e.target.value })}
              />
            </div>
          </div>

          {/* Commission Slabs */}
          {showSlabs && (
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Commission Slabs</h3>
                <Button type="button" variant="outline" size="sm" onClick={handleAddSlab}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Slab
                </Button>
              </div>
              <div className="space-y-2">
                {formData.slabs.map((slab, idx) => (
                  <div key={slab.id} className="flex items-center gap-2 p-3 border rounded-lg">
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      <div>
                        <Label className="text-xs">Min Value</Label>
                        <Input
                          type="number"
                          value={slab.minValue}
                          onChange={(e) => handleSlabChange(slab.id, "minValue", Number(e.target.value))}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Max Value</Label>
                        <Input
                          type="number"
                          value={slab.maxValue || ""}
                          onChange={(e) => handleSlabChange(slab.id, "maxValue", e.target.value ? Number(e.target.value) : null)}
                          placeholder="Unlimited"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Rate (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={slab.rate}
                          onChange={(e) => handleSlabChange(slab.id, "rate", Number(e.target.value))}
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveSlab(slab.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                {formData.slabs.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No slabs configured. Click "Add Slab" to define commission tiers.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Accelerator Settings */}
          {showAccelerator && (
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Accelerator Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="acceleratorThreshold">Threshold (% of target)</Label>
                  <Input
                    id="acceleratorThreshold"
                    type="number"
                    value={formData.acceleratorThreshold}
                    onChange={(e) => setFormData({ ...formData, acceleratorThreshold: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="acceleratorMultiplier">Multiplier</Label>
                  <Input
                    id="acceleratorMultiplier"
                    type="number"
                    step="0.1"
                    value={formData.acceleratorMultiplier}
                    onChange={(e) => setFormData({ ...formData, acceleratorMultiplier: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Decelerator Settings */}
          {showDecelerator && (
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Decelerator/Margin Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deceleratorThreshold">Margin Threshold (%)</Label>
                  <Input
                    id="deceleratorThreshold"
                    type="number"
                    value={formData.deceleratorThreshold}
                    onChange={(e) => setFormData({ ...formData, deceleratorThreshold: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="deceleratorMultiplier">Reduction Multiplier</Label>
                  <Input
                    id="deceleratorMultiplier"
                    type="number"
                    step="0.1"
                    value={formData.deceleratorMultiplier}
                    onChange={(e) => setFormData({ ...formData, deceleratorMultiplier: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Discount Penalty */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-medium">Discount Penalty</h3>
                <p className="text-sm text-muted-foreground">
                  Reduce commission based on discount percentage given
                </p>
              </div>
              <Switch
                checked={formData.discountPenaltyEnabled}
                onCheckedChange={(checked) => setFormData({ ...formData, discountPenaltyEnabled: checked })}
              />
            </div>
            {formData.discountPenaltyEnabled && (
              <div>
                <Label htmlFor="discountPenaltyRate">Penalty Rate (% reduction per % discount)</Label>
                <Input
                  id="discountPenaltyRate"
                  type="number"
                  step="0.1"
                  value={formData.discountPenaltyRate}
                  onChange={(e) => setFormData({ ...formData, discountPenaltyRate: Number(e.target.value) })}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{editData ? "Update Plan" : "Create Plan"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
