import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Edit, DollarSign, Percent, Package, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const products = [
  {
    id: 1,
    name: "Enterprise Platform License",
    sku: "ENT-PLAT-001",
    category: "Platform",
    basePrice: "₹15,00,000",
    pricingUnit: "Per Year",
    status: "Active",
  },
  {
    id: 2,
    name: "API Gateway",
    sku: "API-GW-001",
    category: "Integration",
    basePrice: "₹5,00,000",
    pricingUnit: "Per Year",
    status: "Active",
  },
  {
    id: 3,
    name: "Data Analytics Module",
    sku: "DATA-AN-001",
    category: "Analytics",
    basePrice: "₹8,00,000",
    pricingUnit: "Per Year",
    status: "Active",
  },
  {
    id: 4,
    name: "Implementation Services",
    sku: "SVC-IMP-001",
    category: "Services",
    basePrice: "₹25,000",
    pricingUnit: "Per Day",
    status: "Active",
  },
  {
    id: 5,
    name: "Annual Support",
    sku: "SUP-ANN-001",
    category: "Support",
    basePrice: "18%",
    pricingUnit: "of License",
    status: "Active",
  },
];

const discountRules = [
  {
    id: 1,
    name: "Standard Volume Discount",
    condition: "Deal Value > ₹50L",
    discount: "Up to 10%",
    approval: "Sales Manager",
    status: "Active",
  },
  {
    id: 2,
    name: "Strategic Account Discount",
    condition: "Strategic Account Tag",
    discount: "Up to 15%",
    approval: "VP Sales",
    status: "Active",
  },
  {
    id: 3,
    name: "Multi-Year Commitment",
    condition: "3+ Year Contract",
    discount: "Up to 20%",
    approval: "Finance Head",
    status: "Active",
  },
  {
    id: 4,
    name: "Competitive Displacement",
    condition: "Replacing Competitor",
    discount: "Up to 25%",
    approval: "CEO",
    status: "Active",
  },
];

const paymentTerms = [
  { id: 1, name: "Standard - Product", terms: "100% with PO", default: true },
  { id: 2, name: "Standard - Services", terms: "50% PO / 30% UAT / 20% Go-Live", default: true },
  { id: 3, name: "Enterprise", terms: "Quarterly in Advance", default: false },
  { id: 4, name: "Government/PSU", terms: "30 Days from Invoice", default: false },
];

export default function Pricing() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <AppLayout title="Pricing & Discounts">
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="products" className="gap-2">
            <Package className="h-4 w-4" />
            Products & Pricing
          </TabsTrigger>
          <TabsTrigger value="discounts" className="gap-2">
            <Percent className="h-4 w-4" />
            Discount Rules
          </TabsTrigger>
          <TabsTrigger value="terms" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Payment Terms
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </div>

          <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="table-header hover:bg-muted/50">
                  <TableHead>Product Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Base Price</TableHead>
                  <TableHead>Pricing Unit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} className="group hover:bg-muted/30">
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">{product.sku}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-muted">
                        {product.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">{product.basePrice}</TableCell>
                    <TableCell className="text-muted-foreground">{product.pricingUnit}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="discounts" className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Discount Approval Matrix</h2>
              <p className="text-sm text-muted-foreground">Configure discount thresholds and approval workflows</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Rule
            </Button>
          </div>

          <div className="grid gap-4">
            {discountRules.map((rule, index) => (
              <Card
                key={rule.id}
                className="p-5 hover:shadow-md transition-shadow animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-accent/10">
                      <Percent className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{rule.name}</h3>
                      <p className="text-sm text-muted-foreground">{rule.condition}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{rule.discount}</p>
                      <p className="text-xs text-muted-foreground">Max Discount</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">{rule.approval}</p>
                      <p className="text-xs text-muted-foreground">Approver</p>
                    </div>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      {rule.status}
                    </Badge>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="terms" className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Payment Terms Templates</h2>
              <p className="text-sm text-muted-foreground">Standard payment terms for quotes and contracts</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Template
            </Button>
          </div>

          <div className="grid gap-4">
            {paymentTerms.map((term, index) => (
              <Card
                key={term.id}
                className="p-5 hover:shadow-md transition-shadow animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{term.name}</h3>
                        {term.default && (
                          <Badge variant="outline" className="bg-info/10 text-info border-info/20 text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{term.terms}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
