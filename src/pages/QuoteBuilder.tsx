import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  Save,
  Send,
  FileDown,
  Eye,
  CheckCircle,
  Package,
  FileText,
  Calculator,
  CalendarDays,
  Settings2,
} from "lucide-react";
import { toast } from "sonner";

import { ProductCatalog, products, type Product } from "@/components/quotes/ProductCatalog";
import { QuoteLineItems, type LineItem } from "@/components/quotes/QuoteLineItems";
import { QuoteSummary } from "@/components/quotes/QuoteSummary";
import { PaymentTermsConfig, type PaymentTerms } from "@/components/quotes/PaymentTermsConfig";
import { QuoteHeader, type QuoteInfo } from "@/components/quotes/QuoteHeader";
import { DiscountControls } from "@/components/quotes/DiscountControls";

const generateQuoteId = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `QT-${year}-${random}`;
};

export default function QuoteBuilder() {
  const navigate = useNavigate();

  // Quote Header State
  const [quoteInfo, setQuoteInfo] = useState<QuoteInfo>({
    quoteId: generateQuoteId(),
    quoteName: "New Quote",
    accountId: "",
    accountName: "",
    opportunityId: "",
    opportunityName: "",
    owner: "Priya Sharma",
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    version: "v1.0",
    status: "Draft",
  });

  // Line Items State
  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  // Discount State
  const [quoteDiscount, setQuoteDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<"percentage" | "amount">("percentage");
  const [discountReason, setDiscountReason] = useState("");

  // Payment Terms State
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerms>({
    templateId: "standard-50-50",
    templateName: "50-50 Split",
    milestones: [
      { id: "1", name: "Advance", percentage: 50, dueCondition: "with-po" },
      { id: "2", name: "On Completion", percentage: 50, dueCondition: "on-delivery" },
    ],
    creditDays: 0,
    requiresPO: true,
    requiresApproval: false,
  });

  // Tax rate
  const taxRate = 18;

  // Calculate totals
  const subtotal = useMemo(() => {
    return lineItems.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [lineItems]);

  // Add product to line items
  const handleAddProduct = (product: Product) => {
    const existingItem = lineItems.find((item) => item.productId === product.id);
    if (existingItem) {
      toast.info("Product already added", {
        description: "Adjust quantity in the line items table",
      });
      return;
    }

    const newLineItem: LineItem = {
      id: `LI-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      category: product.category,
      quantity: 1,
      unit: product.pricingUnit,
      basePrice: product.basePrice,
      discountPercent: 0,
      discountAmount: 0,
      netPrice: product.basePrice,
      totalPrice: product.basePrice,
      pricingModel: product.pricingUnit.includes("year")
        ? "per-year"
        : product.pricingUnit.includes("month")
        ? "per-month"
        : "one-time",
      billingFrequency: product.pricingUnit.includes("year")
        ? "yearly"
        : product.pricingUnit.includes("month")
        ? "monthly"
        : "one-time",
    };

    setLineItems([...lineItems, newLineItem]);
    toast.success("Product added", {
      description: `${product.name} added to quote`,
    });
  };

  // Update line item
  const handleUpdateLineItem = (id: string, updates: Partial<LineItem>) => {
    setLineItems(
      lineItems.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  // Remove line item
  const handleRemoveLineItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
    toast.info("Product removed from quote");
  };

  // Update quote info
  const handleUpdateQuoteInfo = (updates: Partial<QuoteInfo>) => {
    setQuoteInfo({ ...quoteInfo, ...updates });
  };

  // Save quote
  const handleSaveQuote = () => {
    toast.success("Quote saved", {
      description: `${quoteInfo.quoteId} has been saved as draft`,
    });
  };

  // Submit for approval
  const handleSubmitForApproval = () => {
    setQuoteInfo({ ...quoteInfo, status: "Pending Approval" });
    toast.success("Quote submitted", {
      description: "Quote has been submitted for approval",
    });
  };

  // Generate PDF
  const handleGeneratePDF = () => {
    toast.info("Generating PDF", {
      description: "Your quote PDF will be ready shortly",
    });
  };

  const selectedProductIds = lineItems.map((item) => item.productId);

  return (
    <AppLayout title="Quote Builder">
      {/* Top Actions Bar */}
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <Button
          variant="ghost"
          onClick={() => navigate("/quotes")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Quotes
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleGeneratePDF} className="gap-2">
            <FileDown className="h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" className="gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button variant="outline" onClick={handleSaveQuote} className="gap-2">
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          <Button
            onClick={handleSubmitForApproval}
            className="gap-2"
            disabled={lineItems.length === 0}
          >
            <Send className="h-4 w-4" />
            Submit for Approval
          </Button>
        </div>
      </div>

      {/* Quote Header */}
      <QuoteHeader quoteInfo={quoteInfo} onUpdateQuoteInfo={handleUpdateQuoteInfo} />

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6 mt-6">
        {/* Left Sidebar - Product Catalog */}
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-card rounded-xl border border-border/50 p-4 sticky top-4 animate-slide-up">
            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              Product Catalog
            </h2>
            <div className="h-[calc(100vh-400px)]">
              <ProductCatalog
                onAddProduct={handleAddProduct}
                selectedProducts={selectedProductIds}
              />
            </div>
          </div>
        </div>

        {/* Center - Line Items */}
        <div className="col-span-12 lg:col-span-6">
          <div
            className="bg-card rounded-xl border border-border/50 p-4 animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <Tabs defaultValue="line-items" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="line-items" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Line Items ({lineItems.length})
                </TabsTrigger>
                <TabsTrigger value="pricing" className="gap-2">
                  <Calculator className="h-4 w-4" />
                  Pricing & Discounts
                </TabsTrigger>
                <TabsTrigger value="payment" className="gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Payment Terms
                </TabsTrigger>
              </TabsList>

              <TabsContent value="line-items" className="mt-0">
                <QuoteLineItems
                  lineItems={lineItems}
                  onUpdateLineItem={handleUpdateLineItem}
                  onRemoveLineItem={handleRemoveLineItem}
                />
              </TabsContent>

              <TabsContent value="pricing" className="mt-0">
                <div className="space-y-6">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                      <Settings2 className="h-4 w-4 text-muted-foreground" />
                      Quote-Level Discount
                    </h3>
                    <DiscountControls
                      quoteDiscount={quoteDiscount}
                      discountType={discountType}
                      discountReason={discountReason}
                      dealValue={subtotal}
                      onDiscountChange={setQuoteDiscount}
                      onDiscountTypeChange={setDiscountType}
                      onReasonChange={setDiscountReason}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Discount Policy</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                        <p className="font-medium text-success">≤ 5%</p>
                        <p className="text-xs text-muted-foreground">Auto-approved</p>
                      </div>
                      <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                        <p className="font-medium text-accent">&gt; 5%</p>
                        <p className="text-xs text-muted-foreground">Sales Manager</p>
                      </div>
                      <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                        <p className="font-medium text-destructive">&gt; 10%</p>
                        <p className="text-xs text-muted-foreground">Finance Head</p>
                      </div>
                      <div className="p-3 rounded-lg bg-destructive/20 border border-destructive/30">
                        <p className="font-medium text-destructive">&gt; 15%</p>
                        <p className="text-xs text-muted-foreground">CEO Approval</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="payment" className="mt-0">
                <PaymentTermsConfig
                  paymentTerms={paymentTerms}
                  onUpdatePaymentTerms={setPaymentTerms}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right Sidebar - Quote Summary */}
        <div className="col-span-12 lg:col-span-3">
          <div
            className="bg-card rounded-xl border border-border/50 p-4 sticky top-4 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <QuoteSummary
              lineItems={lineItems}
              quoteDiscount={quoteDiscount}
              taxRate={taxRate}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
