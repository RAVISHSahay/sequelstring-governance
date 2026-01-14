import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Percent,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  Info,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DiscountControlsProps {
  quoteDiscount: number;
  discountType: "percentage" | "amount";
  discountReason: string;
  dealValue: number;
  onDiscountChange: (discount: number) => void;
  onDiscountTypeChange: (type: "percentage" | "amount") => void;
  onReasonChange: (reason: string) => void;
}

const discountReasons = [
  { value: "volume", label: "Volume Discount" },
  { value: "strategic", label: "Strategic Account" },
  { value: "competitive", label: "Competitive Pressure" },
  { value: "renewal", label: "Renewal Incentive" },
  { value: "bundle", label: "Bundle Discount" },
  { value: "early-payment", label: "Early Payment" },
  { value: "other", label: "Other (Specify)" },
];

export function DiscountControls({
  quoteDiscount,
  discountType,
  discountReason,
  dealValue,
  onDiscountChange,
  onDiscountTypeChange,
  onReasonChange,
}: DiscountControlsProps) {
  const [isExpanded, setIsExpanded] = useState(quoteDiscount > 0);
  const [customReason, setCustomReason] = useState("");

  const discountAmount = discountType === "percentage" 
    ? (dealValue * quoteDiscount) / 100 
    : quoteDiscount;
  
  const discountPercent = discountType === "amount" 
    ? dealValue > 0 ? (quoteDiscount / dealValue) * 100 : 0
    : quoteDiscount;

  const getApprovalLevel = () => {
    if (discountPercent > 15) return { level: "CEO", severity: "critical" };
    if (discountPercent > 10) return { level: "Finance Head", severity: "high" };
    if (discountPercent > 5) return { level: "Sales Manager", severity: "medium" };
    return { level: "Auto-Approved", severity: "low" };
  };

  const approvalInfo = getApprovalLevel();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between p-0 h-auto hover:bg-transparent"
        >
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-accent/10">
              <Percent className="h-4 w-4 text-accent" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium">Quote-Level Discount</p>
              {quoteDiscount > 0 && (
                <p className="text-xs text-muted-foreground">
                  {discountPercent.toFixed(1)}% ({formatCurrency(discountAmount)})
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {quoteDiscount > 0 && (
              <Badge
                variant="outline"
                className={cn(
                  approvalInfo.severity === "low" && "bg-success/10 text-success border-success/20",
                  approvalInfo.severity === "medium" && "bg-accent/10 text-accent border-accent/20",
                  approvalInfo.severity === "high" && "bg-destructive/10 text-destructive border-destructive/20",
                  approvalInfo.severity === "critical" && "bg-destructive text-destructive-foreground"
                )}
              >
                {approvalInfo.level}
              </Badge>
            )}
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                isExpanded && "rotate-180"
              )}
            />
          </div>
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="pt-4 space-y-4">
        {/* Discount Type Toggle */}
        <div className="flex gap-2">
          <Button
            variant={discountType === "percentage" ? "default" : "outline"}
            size="sm"
            onClick={() => onDiscountTypeChange("percentage")}
            className="flex-1"
          >
            <Percent className="h-4 w-4 mr-1" />
            Percentage
          </Button>
          <Button
            variant={discountType === "amount" ? "default" : "outline"}
            size="sm"
            onClick={() => onDiscountTypeChange("amount")}
            className="flex-1"
          >
            ₹ Amount
          </Button>
        </div>

        {/* Discount Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm">
              {discountType === "percentage" ? "Discount %" : "Discount Amount"}
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">
                    <strong>Approval Thresholds:</strong><br />
                    ≤5%: Auto-approved<br />
                    &gt;5%: Sales Manager<br />
                    &gt;10%: Finance Head<br />
                    &gt;15%: CEO
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {discountType === "percentage" ? (
            <>
              <Slider
                value={[quoteDiscount]}
                onValueChange={([value]) => onDiscountChange(value)}
                max={25}
                step={0.5}
                className={cn(
                  quoteDiscount > 10 && "[&_[role=slider]]:bg-destructive [&_.range]:bg-destructive"
                )}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span className="font-medium text-foreground">{quoteDiscount}%</span>
                <span>25%</span>
              </div>
            </>
          ) : (
            <Input
              type="text"
              value={quoteDiscount.toLocaleString("en-IN")}
              onChange={(e) => {
                const value = parseFloat(e.target.value.replace(/,/g, "")) || 0;
                onDiscountChange(Math.min(value, dealValue));
              }}
              className="text-right"
              placeholder="Enter discount amount"
            />
          )}
        </div>

        {/* Discount Reason */}
        {quoteDiscount > 0 && (
          <div className="space-y-2">
            <Label className="text-sm">Discount Reason</Label>
            <Select value={discountReason} onValueChange={onReasonChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select reason for discount" />
              </SelectTrigger>
              <SelectContent>
                {discountReasons.map((reason) => (
                  <SelectItem key={reason.value} value={reason.value}>
                    {reason.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {discountReason === "other" && (
              <Textarea
                placeholder="Specify the reason..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="mt-2"
                rows={2}
              />
            )}
          </div>
        )}

        {/* Discount Impact */}
        {quoteDiscount > 0 && (
          <div className="p-3 rounded-lg bg-muted/50 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <TrendingDown className="h-4 w-4 text-accent" />
              <span className="text-muted-foreground">Discount Impact</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Amount</p>
                <p className="font-semibold text-accent">
                  -{formatCurrency(discountAmount)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Effective Rate</p>
                <p className="font-semibold">{discountPercent.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Approval Warning */}
        {quoteDiscount > 5 && (
          <div
            className={cn(
              "flex items-start gap-2 p-3 rounded-lg text-sm",
              approvalInfo.severity === "medium" && "bg-accent/10 text-accent",
              approvalInfo.severity === "high" && "bg-destructive/10 text-destructive",
              approvalInfo.severity === "critical" && "bg-destructive/20 text-destructive"
            )}
          >
            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Approval Required</p>
              <p className="text-xs opacity-80">
                This discount level ({discountPercent.toFixed(1)}%) requires approval
                from {approvalInfo.level}
              </p>
            </div>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
