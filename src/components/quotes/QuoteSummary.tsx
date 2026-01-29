import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, CheckCircle, Clock, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LineItem } from "./QuoteLineItems";

interface QuoteSummaryProps {
  lineItems: LineItem[];
  quoteDiscount: number;
  taxRate: number;
}

export function QuoteSummary({ lineItems, quoteDiscount, taxRate }: QuoteSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate totals
  const subtotal = lineItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalLineDiscount = lineItems.reduce((sum, item) => sum + item.discountAmount, 0);
  const quoteDiscountAmount = (subtotal * quoteDiscount) / 100;
  const taxableAmount = subtotal - quoteDiscountAmount;
  const taxAmount = (taxableAmount * taxRate) / 100;
  const grandTotal = taxableAmount + taxAmount;

  // Calculate approval requirements
  const totalDiscountPercent = subtotal > 0 
    ? ((totalLineDiscount + quoteDiscountAmount) / (subtotal + totalLineDiscount)) * 100 
    : 0;
  
  const maxLineDiscount = Math.max(...lineItems.map(item => item.discountPercent), 0);

  const getApprovalStatus = () => {
    if (grandTotal > 10000000) {
      return { level: "CEO", color: "destructive", reason: "Deal value > ₹1 Cr" };
    }
    if (maxLineDiscount > 10 || quoteDiscount > 10) {
      return { level: "Finance Head", color: "destructive", reason: "Discount > 10%" };
    }
    if (maxLineDiscount > 5 || quoteDiscount > 5) {
      return { level: "Sales Manager", color: "accent", reason: "Discount > 5%" };
    }
    return { level: "Auto-Approved", color: "success", reason: "Within standard limits" };
  };

  const approvalStatus = getApprovalStatus();

  // Categorize items
  const recurringItems = lineItems.filter(
    (item) => item.billingFrequency !== "one-time"
  );
  const oneTimeItems = lineItems.filter(
    (item) => item.billingFrequency === "one-time"
  );

  const recurringTotal = recurringItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const oneTimeTotal = oneTimeItems.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="space-y-6">
      {/* Quote Summary */}
      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Info className="h-4 w-4 text-muted-foreground" />
          Quote Summary
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Line Items</span>
            <span className="font-medium">{lineItems.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatCurrency(subtotal + totalLineDiscount)}</span>
          </div>
          {totalLineDiscount > 0 && (
            <div className="flex justify-between text-accent">
              <span>Line Discounts</span>
              <span>-{formatCurrency(totalLineDiscount)}</span>
            </div>
          )}
          {quoteDiscountAmount > 0 && (
            <div className="flex justify-between text-accent">
              <span>Quote Discount ({quoteDiscount}%)</span>
              <span>-{formatCurrency(quoteDiscountAmount)}</span>
            </div>
          )}
          <Separator className="my-2" />
          <div className="flex justify-between">
            <span className="text-muted-foreground">Taxable Amount</span>
            <span className="font-medium">{formatCurrency(taxableAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">GST ({taxRate}%)</span>
            <span className="font-medium">{formatCurrency(taxAmount)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between text-lg">
            <span className="font-semibold">Grand Total</span>
            <span className="font-bold text-primary">{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      {lineItems.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3">Revenue Breakdown</h3>
          <div className="space-y-2 text-sm">
            {recurringItems.length > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recurring Revenue</span>
                <span className="font-medium text-success">{formatCurrency(recurringTotal)}</span>
              </div>
            )}
            {oneTimeItems.length > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">One-Time Revenue</span>
                <span className="font-medium">{formatCurrency(oneTimeTotal)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Approval Status */}
      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          {approvalStatus.level === "Auto-Approved" ? (
            <CheckCircle className="h-4 w-4 text-success" />
          ) : (
            <Clock className="h-4 w-4 text-accent" />
          )}
          Approval Status
        </h3>
        <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Required Approver</span>
            <Badge
              variant="outline"
              className={cn(
                "font-medium",
                approvalStatus.color === "success" && "bg-success/10 text-success border-success/20",
                approvalStatus.color === "accent" && "bg-accent/10 text-accent border-accent/20",
                approvalStatus.color === "destructive" && "bg-destructive/10 text-destructive border-destructive/20"
              )}
            >
              {approvalStatus.level}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{approvalStatus.reason}</p>
          {totalDiscountPercent > 0 && (
            <div className="mt-2 flex items-center gap-1 text-xs">
              <AlertTriangle className="h-3 w-3 text-accent" />
              <span className="text-accent">
                Total discount: {totalDiscountPercent.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-muted/30 text-center">
          <p className="text-2xl font-bold text-primary">
            {totalDiscountPercent.toFixed(1)}%
          </p>
          <p className="text-xs text-muted-foreground">Total Discount</p>
        </div>
        <div className="p-3 rounded-lg bg-muted/30 text-center">
          <p className="text-2xl font-bold text-success">
            {((grandTotal / (grandTotal + totalLineDiscount + quoteDiscountAmount)) * 100).toFixed(1)}%
          </p>
          <p className="text-xs text-muted-foreground">Margin Protected</p>
        </div>
      </div>
    </div>
  );
}
