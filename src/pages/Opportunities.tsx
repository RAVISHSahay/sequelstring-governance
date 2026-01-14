import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Filter, Plus, MoreHorizontal, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Deal {
  id: number;
  name: string;
  account: string;
  value: string;
  probability: number;
  owner: string;
  initials: string;
  daysInStage: number;
  closeDate: string;
}

interface Stage {
  id: string;
  name: string;
  color: string;
  deals: Deal[];
  totalValue: string;
}

const stages: Stage[] = [
  {
    id: "lead",
    name: "Lead",
    color: "bg-muted-foreground",
    totalValue: "₹45L",
    deals: [
      {
        id: 1,
        name: "Data Analytics Platform",
        account: "Tech Mahindra",
        value: "₹15,00,000",
        probability: 20,
        owner: "Priya S",
        initials: "PS",
        daysInStage: 5,
        closeDate: "Mar 2025",
      },
      {
        id: 2,
        name: "Cloud Infrastructure",
        account: "L&T Infotech",
        value: "₹30,00,000",
        probability: 15,
        owner: "Rahul M",
        initials: "RM",
        daysInStage: 3,
        closeDate: "Apr 2025",
      },
    ],
  },
  {
    id: "qualified",
    name: "Qualified",
    color: "bg-info",
    totalValue: "₹78L",
    deals: [
      {
        id: 3,
        name: "ERP Integration Suite",
        account: "Bajaj Auto",
        value: "₹42,00,000",
        probability: 40,
        owner: "Anjali K",
        initials: "AK",
        daysInStage: 8,
        closeDate: "Feb 2025",
      },
      {
        id: 4,
        name: "Security Compliance",
        account: "Kotak Bank",
        value: "₹18,00,000",
        probability: 35,
        owner: "Vikram D",
        initials: "VD",
        daysInStage: 12,
        closeDate: "Mar 2025",
      },
      {
        id: 5,
        name: "API Gateway License",
        account: "Axis Bank",
        value: "₹18,00,000",
        probability: 45,
        owner: "Priya S",
        initials: "PS",
        daysInStage: 6,
        closeDate: "Feb 2025",
      },
    ],
  },
  {
    id: "proposal",
    name: "Proposal",
    color: "bg-accent",
    totalValue: "₹1.2Cr",
    deals: [
      {
        id: 6,
        name: "Enterprise Platform License",
        account: "Tata Steel",
        value: "₹45,00,000",
        probability: 60,
        owner: "Priya S",
        initials: "PS",
        daysInStage: 4,
        closeDate: "Jan 2025",
      },
      {
        id: 7,
        name: "Cloud Migration",
        account: "Reliance Industries",
        value: "₹28,50,000",
        probability: 55,
        owner: "Rahul M",
        initials: "RM",
        daysInStage: 7,
        closeDate: "Feb 2025",
      },
      {
        id: 8,
        name: "Data Analytics Suite",
        account: "Mahindra Group",
        value: "₹32,00,000",
        probability: 50,
        owner: "Priya S",
        initials: "PS",
        daysInStage: 10,
        closeDate: "Feb 2025",
      },
      {
        id: 9,
        name: "Digital Transformation",
        account: "Godrej Industries",
        value: "₹22,00,000",
        probability: 65,
        owner: "Sanjay G",
        initials: "SG",
        daysInStage: 2,
        closeDate: "Jan 2025",
      },
    ],
  },
  {
    id: "negotiation",
    name: "Negotiation",
    color: "bg-chart-5",
    totalValue: "₹63L",
    deals: [
      {
        id: 10,
        name: "Annual Support Contract",
        account: "ICICI Bank",
        value: "₹25,00,000",
        probability: 80,
        owner: "Vikram D",
        initials: "VD",
        daysInStage: 15,
        closeDate: "Jan 2025",
      },
      {
        id: 11,
        name: "Platform Upgrade",
        account: "SBI Life",
        value: "₹38,00,000",
        probability: 75,
        owner: "Anjali K",
        initials: "AK",
        daysInStage: 9,
        closeDate: "Jan 2025",
      },
    ],
  },
  {
    id: "closed-won",
    name: "Closed Won",
    color: "bg-success",
    totalValue: "₹58L",
    deals: [
      {
        id: 12,
        name: "API Integration Package",
        account: "HDFC Bank",
        value: "₹18,75,000",
        probability: 100,
        owner: "Vikram D",
        initials: "VD",
        daysInStage: 0,
        closeDate: "Closed",
      },
      {
        id: 13,
        name: "Support Renewal",
        account: "Infosys Ltd",
        value: "₹12,00,000",
        probability: 100,
        owner: "Anjali K",
        initials: "AK",
        daysInStage: 0,
        closeDate: "Closed",
      },
      {
        id: 14,
        name: "License Expansion",
        account: "Wipro",
        value: "₹27,25,000",
        probability: 100,
        owner: "Priya S",
        initials: "PS",
        daysInStage: 0,
        closeDate: "Closed",
      },
    ],
  },
];

function DealCard({ deal }: { deal: Deal }) {
  return (
    <div className="deal-card group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground text-sm truncate group-hover:text-primary transition-colors">
            {deal.name}
          </p>
          <p className="text-xs text-muted-foreground truncate">{deal.account}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 flex-shrink-0"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Edit Opportunity</DropdownMenuItem>
            <DropdownMenuItem>Create Quote</DropdownMenuItem>
            <DropdownMenuItem>Log Activity</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className="text-lg font-semibold text-foreground">{deal.value}</span>
        <Badge variant="outline" className="text-xs font-medium">
          {deal.probability}%
        </Badge>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-medium">
              {deal.initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{deal.owner}</span>
        </div>
        <span className="text-xs text-muted-foreground">{deal.closeDate}</span>
      </div>

      {deal.daysInStage > 10 && (
        <div className="mt-2 pt-2 border-t border-destructive/20">
          <span className="text-xs text-destructive font-medium">
            ⚠ {deal.daysInStage} days in stage
          </span>
        </div>
      )}
    </div>
  );
}

export default function Opportunities() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <AppLayout title="Opportunities">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search opportunities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Opportunity
          </Button>
        </div>
      </div>

      {/* Pipeline View */}
      <div className="overflow-x-auto pb-4 -mx-6 px-6">
        <div className="flex gap-4 min-w-max">
          {stages.map((stage) => (
            <div key={stage.id} className="pipeline-column w-[300px] animate-fade-in">
              {/* Stage Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={cn("h-2 w-2 rounded-full", stage.color)} />
                  <h3 className="font-semibold text-foreground">{stage.name}</h3>
                  <Badge variant="secondary" className="font-normal text-xs">
                    {stage.deals.length}
                  </Badge>
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {stage.totalValue}
                </span>
              </div>

              {/* Deals */}
              <div className="space-y-3">
                {stage.deals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>

              {/* Add Deal Button */}
              <Button
                variant="ghost"
                className="w-full mt-3 border-2 border-dashed border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Deal
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Bar */}
      <div className="mt-6 p-4 bg-card rounded-xl border border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div>
            <p className="text-sm text-muted-foreground">Total Pipeline</p>
            <p className="text-2xl font-bold text-foreground">₹3.64 Cr</p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div>
            <p className="text-sm text-muted-foreground">Weighted Pipeline</p>
            <p className="text-2xl font-bold text-foreground">₹1.82 Cr</p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div>
            <p className="text-sm text-muted-foreground">Avg Deal Size</p>
            <p className="text-2xl font-bold text-foreground">₹26L</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Forecast Accuracy</p>
          <p className="text-2xl font-bold text-success">92%</p>
        </div>
      </div>
    </AppLayout>
  );
}
