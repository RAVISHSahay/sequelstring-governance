import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Package,
  Cloud,
  Code,
  Shield,
  Database,
  Cpu,
  Plus,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  basePrice: number;
  pricingUnit: string;
  icon: React.ElementType;
}

const products: Product[] = [
  {
    id: "PLAT-001",
    name: "SequelString Platform License",
    category: "Platform",
    description: "Enterprise CRM platform with full feature access",
    basePrice: 500000,
    pricingUnit: "per year",
    icon: Package,
  },
  {
    id: "PLAT-002",
    name: "Cloud Infrastructure",
    category: "Platform",
    description: "Managed cloud hosting and infrastructure",
    basePrice: 150000,
    pricingUnit: "per month",
    icon: Cloud,
  },
  {
    id: "SVC-001",
    name: "Implementation Services",
    category: "Services",
    description: "Full platform implementation and configuration",
    basePrice: 800000,
    pricingUnit: "one-time",
    icon: Cpu,
  },
  {
    id: "SVC-002",
    name: "API Integration Package",
    category: "Services",
    description: "Custom API integrations with existing systems",
    basePrice: 250000,
    pricingUnit: "per integration",
    icon: Code,
  },
  {
    id: "SVC-003",
    name: "Data Migration Services",
    category: "Services",
    description: "Complete data migration from legacy systems",
    basePrice: 400000,
    pricingUnit: "one-time",
    icon: Database,
  },
  {
    id: "ADD-001",
    name: "Security Compliance Module",
    category: "Add-ons",
    description: "SOX, GDPR, DPDP compliance features",
    basePrice: 200000,
    pricingUnit: "per year",
    icon: Shield,
  },
  {
    id: "ADD-002",
    name: "Advanced Analytics Suite",
    category: "Add-ons",
    description: "AI-powered analytics and forecasting",
    basePrice: 300000,
    pricingUnit: "per year",
    icon: Cpu,
  },
  {
    id: "USG-001",
    name: "API Calls Package",
    category: "Usage-Based",
    description: "Additional API call capacity",
    basePrice: 0.5,
    pricingUnit: "per 1000 calls",
    icon: Code,
  },
  {
    id: "USG-002",
    name: "Document Processing",
    category: "Usage-Based",
    description: "OCR and document processing credits",
    basePrice: 2,
    pricingUnit: "per page",
    icon: Database,
  },
];

const categories = ["All", "Platform", "Services", "Add-ons", "Usage-Based"];

interface ProductCatalogProps {
  onAddProduct: (product: Product) => void;
  selectedProducts: string[];
}

export function ProductCatalog({ onAddProduct, selectedProducts }: ProductCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price: number) => {
    if (price < 1) return `₹${price}`;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category)}
            className="text-xs"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Product List */}
      <ScrollArea className="flex-1 -mx-4 px-4">
        <div className="space-y-3">
          {filteredProducts.map((product) => {
            const Icon = product.icon;
            const isSelected = selectedProducts.includes(product.id);

            return (
              <div
                key={product.id}
                className={cn(
                  "p-4 rounded-lg border transition-all cursor-pointer group",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border/50 hover:border-primary/50 hover:bg-muted/30"
                )}
                onClick={() => !isSelected && onAddProduct(product)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "p-2 rounded-lg",
                      isSelected ? "bg-primary/10" : "bg-muted"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5",
                        isSelected ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm truncate">
                        {product.name}
                      </span>
                      {isSelected && (
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                      <span className="text-xs font-medium text-primary">
                        {formatPrice(product.basePrice)}{" "}
                        <span className="text-muted-foreground font-normal">
                          {product.pricingUnit}
                        </span>
                      </span>
                    </div>
                  </div>
                  {!isSelected && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddProduct(product);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

export { products };
