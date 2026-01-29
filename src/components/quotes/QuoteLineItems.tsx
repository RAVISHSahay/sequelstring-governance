import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Trash2, AlertTriangle, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "./ProductCatalog";

export interface LineItem {
  id: string;
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  basePrice: number;
  discountPercent: number;
  discountAmount: number;
  netPrice: number;
  totalPrice: number;
  pricingModel: string;
  billingFrequency: string;
}

interface QuoteLineItemsProps {
  lineItems: LineItem[];
  onUpdateLineItem: (id: string, updates: Partial<LineItem>) => void;
  onRemoveLineItem: (id: string) => void;
}

const pricingModels = [
  { value: "fixed", label: "Fixed" },
  { value: "per-user", label: "Per User" },
  { value: "per-month", label: "Monthly" },
  { value: "per-year", label: "Yearly" },
  { value: "usage", label: "Usage-Based" },
  { value: "one-time", label: "One-Time" },
];

const billingOptions = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
  { value: "one-time", label: "One-Time" },
];

export function QuoteLineItems({
  lineItems,
  onUpdateLineItem,
  onRemoveLineItem,
}: QuoteLineItemsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateLineItemTotals = (item: LineItem, updates: Partial<LineItem>) => {
    const quantity = updates.quantity ?? item.quantity;
    const basePrice = updates.basePrice ?? item.basePrice;
    const discountPercent = updates.discountPercent ?? item.discountPercent;

    const grossPrice = quantity * basePrice;
    const discountAmount = (grossPrice * discountPercent) / 100;
    const netPrice = basePrice * (1 - discountPercent / 100);
    const totalPrice = grossPrice - discountAmount;

    return {
      discountAmount,
      netPrice,
      totalPrice,
    };
  };

  const handleQuantityChange = (id: string, value: string) => {
    const quantity = parseInt(value) || 1;
    const item = lineItems.find((li) => li.id === id);
    if (item) {
      const totals = calculateLineItemTotals(item, { quantity });
      onUpdateLineItem(id, { quantity, ...totals });
    }
  };

  const handleDiscountChange = (id: string, value: string) => {
    const discountPercent = parseFloat(value) || 0;
    const item = lineItems.find((li) => li.id === id);
    if (item) {
      const totals = calculateLineItemTotals(item, { discountPercent });
      onUpdateLineItem(id, { discountPercent, ...totals });
    }
  };

  const handleBasePriceChange = (id: string, value: string) => {
    const basePrice = parseFloat(value.replace(/,/g, "")) || 0;
    const item = lineItems.find((li) => li.id === id);
    if (item) {
      const totals = calculateLineItemTotals(item, { basePrice });
      onUpdateLineItem(id, { basePrice, ...totals });
    }
  };

  if (lineItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <GripVertical className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">No line items yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Add products from the catalog on the left to build your quote. Each product
          will appear as a configurable line item.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[250px]">Product / Service</TableHead>
            <TableHead className="text-center w-[80px]">Qty</TableHead>
            <TableHead className="text-right w-[120px]">Base Price</TableHead>
            <TableHead className="w-[130px]">Billing</TableHead>
            <TableHead className="text-center w-[100px]">Discount %</TableHead>
            <TableHead className="text-right w-[120px]">Net Price</TableHead>
            <TableHead className="text-right w-[140px]">Total</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lineItems.map((item, index) => {
            const needsApproval = item.discountPercent > 10;
            const highDiscount = item.discountPercent > 5;

            return (
              <TableRow
                key={item.id}
                className="group animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">{item.productName}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {item.category}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    className="w-16 text-center h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="text"
                    value={item.basePrice.toLocaleString("en-IN")}
                    onChange={(e) => handleBasePriceChange(item.id, e.target.value)}
                    className="w-28 text-right h-8"
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={item.billingFrequency}
                    onValueChange={(value) =>
                      onUpdateLineItem(item.id, { billingFrequency: value })
                    }
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {billingOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      step={0.5}
                      value={item.discountPercent}
                      onChange={(e) => handleDiscountChange(item.id, e.target.value)}
                      className={cn(
                        "w-16 text-center h-8",
                        highDiscount && "border-accent",
                        needsApproval && "border-destructive"
                      )}
                    />
                    {needsApproval && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Discount &gt;10% requires Finance approval</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium text-sm">
                  {formatCurrency(item.netPrice)}
                </TableCell>
                <TableCell className="text-right font-semibold text-primary">
                  {formatCurrency(item.totalPrice)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    onClick={() => onRemoveLineItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
