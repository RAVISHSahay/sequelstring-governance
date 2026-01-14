import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  ArrowUpDown,
  FileText,
  Download,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const quotes = [
  {
    id: "QT-2025-001",
    name: "Enterprise Platform License",
    account: "Tata Steel Ltd",
    opportunity: "Enterprise Platform License",
    value: "₹45,00,000",
    discount: "5%",
    status: "Pending Approval",
    approver: "Finance Head",
    validUntil: "Jan 30, 2025",
    owner: "Priya S",
    initials: "PS",
    createdAt: "Jan 15, 2025",
    version: "v2.1",
  },
  {
    id: "QT-2025-002",
    name: "Cloud Migration Services",
    account: "Reliance Industries",
    opportunity: "Cloud Migration",
    value: "₹28,50,000",
    discount: "8%",
    status: "Approved",
    approver: "VP Sales",
    validUntil: "Feb 15, 2025",
    owner: "Rahul M",
    initials: "RM",
    createdAt: "Jan 12, 2025",
    version: "v1.0",
  },
  {
    id: "QT-2025-003",
    name: "Annual Support Contract",
    account: "Infosys Ltd",
    opportunity: "Support Renewal",
    value: "₹12,00,000",
    discount: "0%",
    status: "Sent",
    approver: "-",
    validUntil: "Jan 25, 2025",
    owner: "Anjali K",
    initials: "AK",
    createdAt: "Jan 10, 2025",
    version: "v1.2",
  },
  {
    id: "QT-2025-004",
    name: "API Integration Package",
    account: "HDFC Bank",
    opportunity: "API Integration",
    value: "₹18,75,000",
    discount: "3%",
    status: "Accepted",
    approver: "-",
    validUntil: "Closed",
    owner: "Vikram D",
    initials: "VD",
    createdAt: "Jan 08, 2025",
    version: "v1.0",
  },
  {
    id: "QT-2025-005",
    name: "Data Analytics Suite",
    account: "Mahindra Group",
    opportunity: "Data Analytics Suite",
    value: "₹32,00,000",
    discount: "12%",
    status: "Pending Approval",
    approver: "CEO",
    validUntil: "Feb 01, 2025",
    owner: "Priya S",
    initials: "PS",
    createdAt: "Jan 14, 2025",
    version: "v3.0",
  },
  {
    id: "QT-2024-156",
    name: "Security Compliance Suite",
    account: "Kotak Bank",
    opportunity: "Security Compliance",
    value: "₹22,50,000",
    discount: "10%",
    status: "Rejected",
    approver: "VP Sales",
    validUntil: "Expired",
    owner: "Sanjay G",
    initials: "SG",
    createdAt: "Dec 28, 2024",
    version: "v2.0",
  },
  {
    id: "QT-2025-006",
    name: "Platform Upgrade",
    account: "SBI Life",
    opportunity: "Platform Upgrade",
    value: "₹38,00,000",
    discount: "7%",
    status: "Draft",
    approver: "-",
    validUntil: "-",
    owner: "Anjali K",
    initials: "AK",
    createdAt: "Jan 16, 2025",
    version: "v1.0",
  },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "Accepted":
      return {
        color: "bg-success/10 text-success border-success/20",
        icon: CheckCircle,
      };
    case "Approved":
      return {
        color: "bg-success/10 text-success border-success/20",
        icon: CheckCircle,
      };
    case "Sent":
      return {
        color: "bg-info/10 text-info border-info/20",
        icon: Send,
      };
    case "Pending Approval":
      return {
        color: "bg-accent/10 text-accent border-accent/20",
        icon: Clock,
      };
    case "Draft":
      return {
        color: "bg-muted text-muted-foreground border-border",
        icon: FileText,
      };
    case "Rejected":
      return {
        color: "bg-destructive/10 text-destructive border-destructive/20",
        icon: AlertCircle,
      };
    default:
      return {
        color: "bg-muted text-muted-foreground border-border",
        icon: FileText,
      };
  }
};

export default function Quotes() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredQuotes = quotes.filter(
    (quote) =>
      quote.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.account.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout title="Quotes">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="stat-card animate-slide-up">
          <p className="text-sm text-muted-foreground mb-1">Open Quotes</p>
          <p className="text-2xl font-bold">23</p>
        </div>
        <div className="stat-card animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <p className="text-sm text-muted-foreground mb-1">Pending Approval</p>
          <p className="text-2xl font-bold text-accent">8</p>
        </div>
        <div className="stat-card animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <p className="text-sm text-muted-foreground mb-1">Total Value</p>
          <p className="text-2xl font-bold">₹1.96 Cr</p>
        </div>
        <div className="stat-card animate-slide-up" style={{ animationDelay: "0.15s" }}>
          <p className="text-sm text-muted-foreground mb-1">Avg Discount</p>
          <p className="text-2xl font-bold">6.4%</p>
        </div>
        <div className="stat-card animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <p className="text-sm text-muted-foreground mb-1">Win Rate</p>
          <p className="text-2xl font-bold text-success">68%</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search quotes..."
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
            Create Quote
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border/50 overflow-hidden animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow className="table-header hover:bg-muted/50">
              <TableHead className="w-[120px]">
                <div className="flex items-center gap-1">
                  Quote ID
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="w-[220px]">Quote Name</TableHead>
              <TableHead>Account</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead className="text-center">Discount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Approver</TableHead>
              <TableHead>Valid Until</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuotes.map((quote) => {
              const statusConfig = getStatusConfig(quote.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <TableRow key={quote.id} className="group cursor-pointer hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono text-sm">{quote.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {quote.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{quote.version}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{quote.account}</TableCell>
                  <TableCell className="text-right font-semibold">{quote.value}</TableCell>
                  <TableCell className="text-center">
                    <span className={cn(
                      "font-medium",
                      parseFloat(quote.discount) > 10 ? "text-destructive" : 
                      parseFloat(quote.discount) > 5 ? "text-accent" : "text-foreground"
                    )}>
                      {quote.discount}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("font-medium gap-1", statusConfig.color)}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {quote.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {quote.approver}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {quote.validUntil}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Quote</DropdownMenuItem>
                          <DropdownMenuItem>Clone Quote</DropdownMenuItem>
                          <DropdownMenuItem>Download PDF</DropdownMenuItem>
                          <DropdownMenuItem>Send to Customer</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
        <p>Showing {filteredQuotes.length} of {quotes.length} quotes</p>
      </div>
    </AppLayout>
  );
}
