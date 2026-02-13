import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
  Eye,
  Pencil,
  Copy,
  Columns,
  List,
  BookOpen,
  FileSignature,
  Package,
  Truck,
  Building,
  UserCheck,
  CreditCard,
  Target,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { QuoteDetailDialog } from "@/components/dialogs/QuoteDetailDialog";
import { CustomerPortalDialog } from "@/components/quotes/CustomerPortalDialog";
import { toast } from "sonner";

const quotes = [
  {
    id: "QT-2025-001",
    name: "Enterprise Platform License",
    account: "Tata Steel Ltd",
    opportunity: "Enterprise Platform License",
    value: "₹45,00,000",
    discount: "5%",
    status: "Pending Approval",
    stage: "internal_approval",
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
    stage: "send_to_customer",
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
    stage: "customer_acceptance",
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
    stage: "contract_generation",
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
    stage: "internal_approval",
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
    stage: "draft",
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
    stage: "draft",
    approver: "-",
    validUntil: "-",
    owner: "Anjali K",
    initials: "AK",
    createdAt: "Jan 16, 2025",
    version: "v1.0",
  },
  {
    id: "QT-2025-007",
    name: "Server Hardware",
    account: "Airtel",
    opportunity: "Infra Upgrade",
    value: "₹1,20,00,000",
    discount: "15%",
    status: "Contract Signed",
    stage: "order_creation",
    approver: "CEO",
    validUntil: "-",
    owner: "Vikram D",
    initials: "VD",
    createdAt: "Jan 05, 2025",
    version: "v1.0",
  },
  {
    id: "QT-2025-008",
    name: "Managed Services",
    account: "Wipro",
    opportunity: "Managed Svcs",
    value: "₹55,00,000",
    discount: "5%",
    status: "Order Created",
    stage: "fulfillment",
    approver: "-",
    validUntil: "-",
    owner: "Priya S",
    initials: "PS",
    createdAt: "Jan 02, 2025",
    version: "v1.0",
  }
];

const workflowStages = [
  { id: "draft", label: "Quote Creation", icon: FileText, color: "bg-slate-100 text-slate-700" },
  { id: "internal_approval", label: "Internal Approval", icon: Clock, color: "bg-orange-100 text-orange-700" },
  { id: "send_to_customer", label: "Send to Customer", icon: Send, color: "bg-blue-100 text-blue-700" },
  { id: "customer_acceptance", label: "Customer Acceptance", icon: UserCheck, color: "bg-indigo-100 text-indigo-700" },
  { id: "contract_generation", label: "Contract Generation", icon: FileSignature, color: "bg-purple-100 text-purple-700" },
  { id: "order_creation", label: "Order Creation", icon: Package, color: "bg-pink-100 text-pink-700" },
  { id: "fulfillment", label: "Fulfillment", icon: Truck, color: "bg-emerald-100 text-emerald-700" }
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "Accepted":
    case "Contract Signed":
    case "Order Created":
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
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<typeof quotes[0] | null>(null);
  const [activeTab, setActiveTab] = useState("workflow");

  const handleViewDetails = (quote: typeof quotes[0]) => {
    setSelectedQuote(quote);
    setDetailDialogOpen(true);
  };

  const handleViewAsCustomer = (quote: typeof quotes[0]) => {
    setSelectedQuote(quote);
    setPortalOpen(true);
    toast.info("Opening Customer Portal View", {
      description: "This simulates what the customer sees.",
    });
  };

  const handleEditQuote = (quote: typeof quotes[0]) => {
    toast.info("Editing quote", {
      description: `Opening ${quote.id} in quote builder`,
    });
    navigate("/quotes/new");
  };

  const handleCloneQuote = (quote: typeof quotes[0]) => {
    toast.success("Quote cloned", {
      description: `${quote.id} has been cloned as a new draft`,
    });
  };

  const handleDownloadPDF = (quote: typeof quotes[0]) => {
    toast.success("Generating PDF...", {
      description: `${quote.id} will be downloaded shortly`,
    });
  };

  const handleSendToCustomer = (quote: typeof quotes[0]) => {
    toast.success("Quote sent!", {
      description: `${quote.id} has been sent to ${quote.account}`,
    });
  };

  const filteredQuotes = quotes.filter(
    (quote) =>
      quote.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.account.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout title="Quotes & Orders">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="stat-card animate-slide-up">
          <p className="text-sm text-muted-foreground mb-1">Open Quotes</p>
          <p className="text-2xl font-bold">25</p>
        </div>
        <div className="stat-card animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <p className="text-sm text-muted-foreground mb-1">Pending Approval</p>
          <p className="text-2xl font-bold text-accent">8</p>
        </div>
        <div className="stat-card animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <p className="text-sm text-muted-foreground mb-1">Total Pipeline</p>
          <p className="text-2xl font-bold">₹3.71 Cr</p>
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <TabsList>
            <TabsTrigger value="workflow" className="gap-2"><Columns className="h-4 w-4" /> Workflow Board</TabsTrigger>
            <TabsTrigger value="list" className="gap-2"><List className="h-4 w-4" /> All Quotes</TabsTrigger>
            <TabsTrigger value="guide" className="gap-2"><BookOpen className="h-4 w-4" /> Implementation Guide</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search quotes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-[200px] lg:w-[300px]"
              />
            </div>
            <Button className="gap-2" onClick={() => navigate("/quotes/new")}>
              <Plus className="h-4 w-4" />
              Create Quote
            </Button>
          </div>
        </div>

        <TabsContent value="workflow" className="h-[calc(100vh-300px)] overflow-hidden">
          <ScrollArea className="h-full">
            <div className="flex gap-4 pb-4 min-w-[1400px]">
              {workflowStages.map((stage) => (
                <div key={stage.id} className="flex-1 min-w-[280px] bg-muted/30 rounded-lg p-3 border border-border/50">
                  <div className={`flex items-center gap-2 mb-3 p-2 rounded-md ${stage.color} bg-opacity-20`}>
                    <stage.icon className="h-4 w-4" />
                    <span className="font-semibold text-sm">{stage.label}</span>
                  </div>
                  <div className="space-y-3">
                    {filteredQuotes.filter(q => q.stage === stage.id).map(quote => (
                      <Card key={quote.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleViewDetails(quote)}>
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-mono text-xs text-muted-foreground">{quote.id}</span>
                            <Badge variant="outline" className="text-[10px] h-5">{quote.status}</Badge>
                          </div>
                          <p className="font-medium text-sm mb-1 truncate">{quote.name}</p>
                          <p className="text-xs text-muted-foreground mb-2 truncate">{quote.account}</p>
                          <div className="flex justify-between items-center text-xs font-medium">
                            <span>{quote.value}</span>
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-[10px] bg-primary/10 text-primary">{quote.initials}</AvatarFallback>
                            </Avatar>
                          </div>

                          {stage.id === 'send_to_customer' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full mt-2 h-7 text-xs gap-1 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewAsCustomer(quote);
                              }}
                            >
                              <ExternalLink className="h-3 w-3" />
                              View as Customer
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                    {filteredQuotes.filter(q => q.stage === stage.id).length === 0 && (
                      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground opacity-50">
                        <stage.icon className="h-8 w-8 mb-2" />
                        <span className="text-xs">No items</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="list">
          <div className="bg-card rounded-xl border border-border/50 overflow-hidden animate-fade-in">
            <Table>
              <TableHeader>
                <TableRow className="table-header hover:bg-muted/50">
                  <TableHead className="w-[120px]">Quote ID</TableHead>
                  <TableHead className="w-[220px]">Quote Name</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-center">Discount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Approver</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotes.map((quote) => {
                  const statusConfig = getStatusConfig(quote.status);
                  const StatusIcon = statusConfig.icon;
                  const stageLabel = workflowStages.find(s => s.id === quote.stage)?.label || quote.stage;

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
                        {stageLabel}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {quote.approver}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(quote)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditQuote(quote)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit Quote
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleCloneQuote(quote)}>
                                <Copy className="h-4 w-4 mr-2" />
                                Clone Quote
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleViewAsCustomer(quote)}>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View as Customer
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDownloadPDF(quote)}>
                                <Download className="h-4 w-4 mr-2" />
                                Download PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSendToCustomer(quote)}>
                                <Send className="h-4 w-4 mr-2" />
                                Send to Customer
                              </DropdownMenuItem>
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
        </TabsContent>

        <TabsContent value="guide">
          <Card>
            <CardHeader>
              <CardTitle>Quote-to-Order Workflow Implementation Guide</CardTitle>
              <CardDescription>Enterprise Sales Governance Platform - Document Version 2.0</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-8 max-w-4xl">
                  {/* Executive Summary */}
                  <section>
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Executive Summary
                    </h3>
                    <div className="bg-muted/30 p-4 rounded-lg border">
                      <p className="mb-4">
                        The Quote-to-Order workflow is a comprehensive sales governance system that automates the complete sales-to-cash cycle for SequelString CRM.
                        This implementation transforms how your organization manages quotes, approvals, contracts, and orders.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-background p-3 rounded border">
                          <h4 className="font-semibold mb-2 text-destructive">Before</h4>
                          <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                            <li>Manual quote creation</li>
                            <li>Email-based approvals</li>
                            <li>Disconnected contract management</li>
                            <li>Delayed order processing</li>
                          </ul>
                        </div>
                        <div className="bg-background p-3 rounded border">
                          <h4 className="font-semibold mb-2 text-success">After</h4>
                          <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                            <li>Automated workflow</li>
                            <li>Multi-level approvals</li>
                            <li>Integrated contract generation</li>
                            <li>Real-time order fulfillment</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* System Overview */}
                  <section>
                    <h3 className="text-xl font-bold mb-3">System Overview: Complete Workflow Journey</h3>
                    <div className="relative border-l-2 border-primary/20 ml-3 space-y-8 py-4">
                      {workflowStages.map((stage, index) => (
                        <div key={stage.id} className="relative pl-8">
                          <div className={`absolute -left-[11px] top-0 h-6 w-6 rounded-full border-2 border-white ${stage.color.replace('text-', 'bg-').split(' ')[0]} flex items-center justify-center shadow-sm`}>
                            <span className="text-[10px] text-white font-bold">{index + 1}</span>
                          </div>
                          <h4 className="font-bold flex items-center gap-2">
                            {stage.label}
                          </h4>
                          <div className="mt-2 text-sm text-muted-foreground bg-muted/20 p-3 rounded-md">
                            {/* Specific details based on stage */}
                            {stage.id === 'draft' && "Sales Rep selects opportunity, adds products, applies discounts."}
                            {stage.id === 'internal_approval' && "Dynamic routing: Auto-Approve (<5%), Manager (5-10%), Head (10-15%), Finance (15-20%), CEO (&gt;20%)."}
                            {stage.id === 'send_to_customer' && "Generate PDF, Email with Tracking, Customer Portal Access."}
                            {stage.id === 'customer_acceptance' && "Customer views quote, Accepts/Rejects, E-Signature."}
                            {stage.id === 'contract_generation' && "Auto-Generate from Quote, Legal Review, DocuSign Integration."}
                            {stage.id === 'order_creation' && "Auto-Create Order, Inventory Allocation, Invoice Generation."}
                            {stage.id === 'fulfillment' && "Order Processing, Shipping & Tracking, Payment Collection."}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Business Impact */}
                  <section>
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                      <Building className="h-5 w-5 text-primary" />
                      Business Impact
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="p-4"><CardTitle className="text-lg">Time</CardTitle></CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-3xl font-bold text-emerald-500">53%</p>
                          <p className="text-sm text-muted-foreground">Faster Quote-to-Order</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="p-4"><CardTitle className="text-lg">Approvals</CardTitle></CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-3xl font-bold text-blue-500">24h</p>
                          <p className="text-sm text-muted-foreground">Cycle Time (vs 72h)</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="p-4"><CardTitle className="text-lg">Win Rate</CardTitle></CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-3xl font-bold text-purple-500">+25%</p>
                          <p className="text-sm text-muted-foreground">Improvement (45% -&gt; 70%)</p>
                        </CardContent>
                      </Card>
                    </div>
                  </section>

                  {/* Technical Architecture */}
                  <section>
                    <h3 className="text-xl font-bold mb-3">Technical Architecture</h3>
                    <div className="bg-slate-900 text-slate-200 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <div className="mb-4">
                        <span className="text-blue-400">Frontend:</span> React 18, TypeScript 5, TanStack Query, Shadcn/ui<br />
                        <span className="text-green-400">Backend:</span> Node.js 20+, PostgreSQL 15+, Redis 7+<br />
                        <span className="text-purple-400">Infrastructure:</span> AWS (S3, SES, EC2, RDS)
                      </div>
                      <Separator className="bg-slate-700 my-2" />
                      <p className="text-xs text-slate-400 mb-2">// Core Database Tables</p>
                      <ul className="list-disc pl-4 space-y-1 text-xs">
                        <li>quotes (Main record)</li>
                        <li>quote_line_items (Products)</li>
                        <li>quote_approval_chain (Workflow)</li>
                        <li>contracts (Legal)</li>
                        <li>orders (Fulfillment)</li>
                      </ul>
                    </div>
                  </section>

                  {/* Implementation Roadmap */}
                  <section>
                    <h3 className="text-xl font-bold mb-3">Implementation Roadmap (12 Weeks)</h3>
                    <div className="space-y-4">
                      <div className="flex gap-4 items-center p-3 border rounded-lg bg-green-50 border-green-200">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                        <div>
                          <h4 className="font-bold text-green-800">Phase 1: Foundation (Weeks 1-2)</h4>
                          <p className="text-sm text-green-700">Database schema, Quote CRUD, Basic UI</p>
                        </div>
                      </div>
                      <div className="flex gap-4 items-center p-3 border rounded-lg">
                        <Clock className="h-6 w-6 text-muted-foreground" />
                        <div>
                          <h4 className="font-bold">Phase 2: Approval Workflow (Weeks 3-4)</h4>
                          <p className="text-sm text-muted-foreground">Matrix config, Engine, Dashboard, Notifications</p>
                        </div>
                      </div>
                      <div className="flex gap-4 items-center p-3 border rounded-lg">
                        <Clock className="h-6 w-6 text-muted-foreground" />
                        <div>
                          <h4 className="font-bold">Phase 3: Customer Interaction (Weeks 5-6)</h4>
                          <p className="text-sm text-muted-foreground">Portal, E-Signature, Analytics</p>
                        </div>
                      </div>
                      <div className="flex gap-4 items-center p-3 border rounded-lg">
                        <Clock className="h-6 w-6 text-muted-foreground" />
                        <div>
                          <h4 className="font-bold">Phase 4: Contract Generation (Weeks 7-8)</h4>
                          <p className="text-sm text-muted-foreground">Templates, DocuSign Integration, Lifecycle</p>
                        </div>
                      </div>
                      <div className="flex gap-4 items-center p-3 border rounded-lg">
                        <Clock className="h-6 w-6 text-muted-foreground" />
                        <div>
                          <h4 className="font-bold">Phase 5: Order Processing (Weeks 9-10)</h4>
                          <p className="text-sm text-muted-foreground">Inventory, Delivery, Invoice Generation</p>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <QuoteDetailDialog
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
          quote={selectedQuote}
        />
        <CustomerPortalDialog
          open={portalOpen}
          onOpenChange={setPortalOpen}
          quote={selectedQuote}
        />
      </Tabs>
    </AppLayout>
  );
}
