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
import { Target as TargetType, TargetLevel, TargetType as TargetTypeEnum, TargetPeriodicity } from "@/types/incentives";

interface AddTargetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Partial<TargetType>) => void;
  editData: TargetType | null;
}

const levelOptions: { value: TargetLevel; label: string }[] = [
  { value: "individual", label: "Individual Salesperson" },
  { value: "team", label: "Team" },
  { value: "region", label: "Region" },
  { value: "product", label: "Product" },
  { value: "platform", label: "Platform" },
  { value: "service_line", label: "Service Line" },
  { value: "key_account", label: "Key Account" },
  { value: "channel_partner", label: "Channel Partner" },
];

const typeOptions: { value: TargetTypeEnum; label: string }[] = [
  { value: "revenue", label: "Revenue Target" },
  { value: "booking", label: "Booking Target" },
  { value: "collection", label: "Collection Target" },
  { value: "margin", label: "Margin Target" },
  { value: "volume", label: "Volume Target" },
  { value: "strategic", label: "Strategic Target" },
];

const periodicityOptions: { value: TargetPeriodicity; label: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
  { value: "custom", label: "Custom Fiscal" },
];

export function AddTargetDialog({ open, onOpenChange, onSave, editData }: AddTargetDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    level: "individual" as TargetLevel,
    levelEntityName: "",
    type: "revenue" as TargetTypeEnum,
    periodicity: "quarterly" as TargetPeriodicity,
    fiscalYear: "FY2024",
    period: "Q1 2024",
    targetValue: 0,
    weightage: 100,
    minimumThreshold: 0,
    stretchTarget: 0,
    carryForwardEnabled: false,
    rolloverEnabled: false,
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name,
        level: editData.level,
        levelEntityName: editData.levelEntityName,
        type: editData.type,
        periodicity: editData.periodicity,
        fiscalYear: editData.fiscalYear,
        period: editData.period,
        targetValue: editData.targetValue,
        weightage: editData.weightage,
        minimumThreshold: editData.minimumThreshold,
        stretchTarget: editData.stretchTarget,
        carryForwardEnabled: editData.carryForwardEnabled,
        rolloverEnabled: editData.rolloverEnabled,
      });
    } else {
      setFormData({
        name: "",
        level: "individual",
        levelEntityName: "",
        type: "revenue",
        periodicity: "quarterly",
        fiscalYear: "FY2024",
        period: "Q1 2024",
        targetValue: 0,
        weightage: 100,
        minimumThreshold: 0,
        stretchTarget: 0,
        carryForwardEnabled: false,
        rolloverEnabled: false,
      });
    }
  }, [editData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      levelEntityId: `ENT-${Date.now()}`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Target" : "Add New Target"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Target Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Q1 Revenue Target - North Region"
                required
              />
            </div>

            <div>
              <Label htmlFor="level">Target Level</Label>
              <Select
                value={formData.level}
                onValueChange={(value: TargetLevel) => setFormData({ ...formData, level: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {levelOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="levelEntityName">Entity Name</Label>
              <Input
                id="levelEntityName"
                value={formData.levelEntityName}
                onChange={(e) => setFormData({ ...formData, levelEntityName: e.target.value })}
                placeholder="e.g., John Smith, Team Alpha, North"
                required
              />
            </div>

            <div>
              <Label htmlFor="type">Target Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: TargetTypeEnum) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="periodicity">Periodicity</Label>
              <Select
                value={formData.periodicity}
                onValueChange={(value: TargetPeriodicity) => setFormData({ ...formData, periodicity: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select periodicity" />
                </SelectTrigger>
                <SelectContent>
                  {periodicityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="fiscalYear">Fiscal Year</Label>
              <Select
                value={formData.fiscalYear}
                onValueChange={(value) => setFormData({ ...formData, fiscalYear: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fiscal year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FY2024">FY2024</SelectItem>
                  <SelectItem value="FY2025">FY2025</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="period">Period</Label>
              <Select
                value={formData.period}
                onValueChange={(value) => setFormData({ ...formData, period: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Q1 2024">Q1 2024</SelectItem>
                  <SelectItem value="Q2 2024">Q2 2024</SelectItem>
                  <SelectItem value="Q3 2024">Q3 2024</SelectItem>
                  <SelectItem value="Q4 2024">Q4 2024</SelectItem>
                  <SelectItem value="FY2024">FY2024 (Annual)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">Target Values</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="targetValue">Target Value</Label>
                <Input
                  id="targetValue"
                  type="number"
                  value={formData.targetValue}
                  onChange={(e) => setFormData({ ...formData, targetValue: Number(e.target.value) })}
                  placeholder="e.g., 10000000"
                  required
                />
              </div>

              <div>
                <Label htmlFor="weightage">Weightage (%)</Label>
                <Input
                  id="weightage"
                  type="number"
                  min={0}
                  max={100}
                  value={formData.weightage}
                  onChange={(e) => setFormData({ ...formData, weightage: Number(e.target.value) })}
                />
              </div>

              <div>
                <Label htmlFor="minimumThreshold">Minimum Threshold</Label>
                <Input
                  id="minimumThreshold"
                  type="number"
                  value={formData.minimumThreshold}
                  onChange={(e) => setFormData({ ...formData, minimumThreshold: Number(e.target.value) })}
                  placeholder="Minimum to qualify"
                />
              </div>

              <div>
                <Label htmlFor="stretchTarget">Stretch Target</Label>
                <Input
                  id="stretchTarget"
                  type="number"
                  value={formData.stretchTarget}
                  onChange={(e) => setFormData({ ...formData, stretchTarget: Number(e.target.value) })}
                  placeholder="Stretch/bonus target"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">Carry-Forward & Rollover Rules</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label htmlFor="carryForward">Carry Forward</Label>
                  <p className="text-sm text-muted-foreground">
                    Carry unachieved targets to next period
                  </p>
                </div>
                <Switch
                  id="carryForward"
                  checked={formData.carryForwardEnabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, carryForwardEnabled: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label htmlFor="rollover">Rollover</Label>
                  <p className="text-sm text-muted-foreground">
                    Roll over excess achievement
                  </p>
                </div>
                <Switch
                  id="rollover"
                  checked={formData.rolloverEnabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, rolloverEnabled: checked })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{editData ? "Update Target" : "Create Target"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
