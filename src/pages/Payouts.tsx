import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  MoreHorizontal,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  FileText,
  Download,
  RefreshCw,
  Ban,
  Banknote,
  TrendingUp,
  Users,
} from "lucide-react";
import { mockPayouts, mockApprovalRequests, incentiveSummaryStats } from "@/data/mockIncentiveData";
import { Payout, PayoutStatus, ApprovalRequest } from "@/types/incentives";
import { useToast } from "@/hooks/use-toast";

const statusConfig: Record<PayoutStatus, { label: string; icon: typeof Clock; color: string }> = {
  pending_calculation: { label: "Pending Calc", icon: Clock, color: "text-muted-foreground" },
  calculated: { label: "Calculated", icon: CheckCircle, color: "text-chart-4" },
  pending_approval: { label: "Pending Approval", icon: AlertTriangle, color: "text-warning" },
  approved: { label: "Approved", icon: CheckCircle, color: "text-success" },
  on_hold: { label: "On Hold", icon: Ban, color: "text-destructive" },
  released: { label: "Released", icon: Banknote, color: "text-success" },
  clawed_back: { label: "Clawed Back", icon: RefreshCw, color: "text-destructive" },
};

const formatCurrency = (value: number) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  return `₹${value.toLocaleString()}`;
};

export default function Payouts() {
  const { toast } = useToast();
  const [payouts, setPayouts] = useState<Payout[]>(mockPayouts);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(mockApprovalRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");
  const [selectedTab, setSelectedTab] = useState("payouts");
  const [detailPayout, setDetailPayout] = useState<Payout | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filteredPayouts = payouts.filter((payout) => {
    const matchesSearch =
      payout.salespersonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payout.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || payout.status === selectedStatus;
    const matchesPeriod = selectedPeriod === "all" || payout.period === selectedPeriod;
    return matchesSearch && matchesStatus && matchesPeriod;
  });

  const handleApprove = (id: string) => {
    setPayouts(prev =>
      prev.map(p => p.id === id ? { ...p, status: 'approved' as PayoutStatus } : p)
    );
    toast({ title: "Payout approved successfully" });
  };

  const handleRelease = (id: string) => {
    setPayouts(prev =>
      prev.map(p => p.id === id ? { 
        ...p, 
        status: 'released' as PayoutStatus,
        releaseDate: new Date().toISOString().split('T')[0]
      } : p)
    );
    toast({ title: "Payout released successfully" });
  };

  const handleHold = (id: string) => {
    setPayouts(prev =>
      prev.map(p => p.id === id ? { ...p, status: 'on_hold' as PayoutStatus } : p)
    );
    toast({ title: "Payout placed on hold" });
  };

  const handleClawback = (id: string) => {
    setPayouts(prev =>
      prev.map(p => p.id === id ? { ...p, status: 'clawed_back' as PayoutStatus } : p)
    );
    toast({ title: "Payout clawed back" });
  };

  const handleApprovalAction = (id: string, action: 'approve' | 'reject') => {
    setApprovals(prev =>
      prev.map(a => a.id === id ? { 
        ...a, 
        status: action === 'approve' ? 'approved' : 'rejected'
      } : a)
    );
    toast({ 
      title: action === 'approve' ? "Request approved" : "Request rejected"
    });
  };

  const getStatusBadge = (status: PayoutStatus) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <Badge variant="outline" className={`${config.color} gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const viewPayoutDetails = (payout: Payout) => {
    setDetailPayout(payout);
    setDetailOpen(true);
  };

  // Calculate summary stats
  const pendingAmount = payouts
    .filter(p => ['pending_approval', 'approved'].includes(p.status))
    .reduce((sum, p) => sum + p.netAmount, 0);

  const releasedAmount = payouts
    .filter(p => p.status === 'released')
    .reduce((sum, p) => sum + p.netAmount, 0);

  return (
    <AppLayout title="Payouts & Settlements">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Payouts & Settlements</h1>
            <p className="text-muted-foreground">
              Manage commission payouts, approvals, and clawbacks
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Recalculate
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="stat-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Payouts</p>
                  <p className="text-2xl font-bold">{incentiveSummaryStats.pendingPayouts}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Amount</p>
                  <p className="text-2xl font-bold">{formatCurrency(pendingAmount)}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-chart-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Released This Period</p>
                  <p className="text-2xl font-bold">{formatCurrency(releasedAmount)}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Banknote className="h-5 w-5 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Approvals</p>
                  <p className="text-2xl font-bold">{approvals.filter(a => a.status === 'pending').length}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
            <TabsTrigger value="approvals">
              Approvals
              {approvals.filter(a => a.status === 'pending').length > 0 && (
                <Badge className="ml-2 bg-destructive text-destructive-foreground">
                  {approvals.filter(a => a.status === 'pending').length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="clawbacks">Holdbacks & Clawbacks</TabsTrigger>
          </TabsList>

          <TabsContent value="payouts" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search payouts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending_calculation">Pending Calc</SelectItem>
                      <SelectItem value="calculated">Calculated</SelectItem>
                      <SelectItem value="pending_approval">Pending Approval</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="released">Released</SelectItem>
                      <SelectItem value="on_hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Periods</SelectItem>
                      <SelectItem value="Q1 2024">Q1 2024</SelectItem>
                      <SelectItem value="Q2 2024">Q2 2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Payouts Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="table-header">
                      <TableHead>Payout ID</TableHead>
                      <TableHead>Salesperson</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead className="text-right">Gross</TableHead>
                      <TableHead className="text-right">Holdback</TableHead>
                      <TableHead className="text-right">Net Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayouts.map((payout) => (
                      <TableRow key={payout.id}>
                        <TableCell className="font-medium">{payout.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Users className="h-4 w-4 text-primary" />
                            </div>
                            {payout.salespersonName}
                          </div>
                        </TableCell>
                        <TableCell>{payout.period}</TableCell>
                        <TableCell>{payout.planName}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(payout.grossAmount)}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          -{formatCurrency(payout.holdbackAmount)}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-success">
                          {formatCurrency(payout.netAmount)}
                        </TableCell>
                        <TableCell>{getStatusBadge(payout.status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => viewPayoutDetails(payout)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="h-4 w-4 mr-2" />
                                Download Statement
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {payout.status === 'pending_approval' && (
                                <DropdownMenuItem onClick={() => handleApprove(payout.id)}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve
                                </DropdownMenuItem>
                              )}
                              {payout.status === 'approved' && (
                                <DropdownMenuItem onClick={() => handleRelease(payout.id)}>
                                  <Banknote className="h-4 w-4 mr-2" />
                                  Release Payout
                                </DropdownMenuItem>
                              )}
                              {['pending_approval', 'approved'].includes(payout.status) && (
                                <DropdownMenuItem onClick={() => handleHold(payout.id)}>
                                  <Ban className="h-4 w-4 mr-2" />
                                  Put on Hold
                                </DropdownMenuItem>
                              )}
                              {payout.status === 'released' && (
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleClawback(payout.id)}
                                >
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Clawback
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approvals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Approval Requests</CardTitle>
                <CardDescription>
                  Exception payouts, manual overrides, and special bonuses requiring approval
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {approvals.filter(a => a.status === 'pending').map((approval) => (
                    <Card key={approval.id} className="border-l-4 border-l-warning">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="capitalize">
                                {approval.type.replace('_', ' ')}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {approval.id}
                              </span>
                            </div>
                            <p className="font-medium">
                              Request by {approval.requestedBy} for {formatCurrency(approval.requestedAmount)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {approval.justification}
                            </p>
                            <div className="flex items-center gap-4 pt-2">
                              {approval.approvalChain.map((step, idx) => (
                                <div key={idx} className="flex items-center gap-1">
                                  {step.status === 'approved' ? (
                                    <CheckCircle className="h-4 w-4 text-success" />
                                  ) : step.status === 'rejected' ? (
                                    <XCircle className="h-4 w-4 text-destructive" />
                                  ) : (
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                  )}
                                  <span className="text-sm capitalize">{step.role.replace('_', ' ')}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApprovalAction(approval.id, 'reject')}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleApprovalAction(approval.id, 'approve')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {approvals.filter(a => a.status === 'pending').length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No pending approval requests
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clawbacks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Holdback & Clawback Rules</CardTitle>
                <CardDescription>
                  Configure retention holdbacks and deal cancellation reversals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Retention Holdback</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Percentage of commission held until payment collection
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">10%</span>
                        <Badge variant="outline">Active</Badge>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Clawback Period</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Duration after which clawback is not applicable
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">90 Days</span>
                        <Badge variant="outline">Active</Badge>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Payment Default</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Clawback triggered on customer payment default
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">100%</span>
                        <Badge variant="outline">Active</Badge>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Deal Cancellation</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Reversal on contract cancellation within period
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">100%</span>
                        <Badge variant="outline">Active</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Payout Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Payout Details - {detailPayout?.id}</DialogTitle>
            <DialogDescription>
              Commission breakdown for {detailPayout?.salespersonName}
            </DialogDescription>
          </DialogHeader>
          {detailPayout && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Period</p>
                  <p className="font-semibold">{detailPayout.period}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Plan</p>
                  <p className="font-semibold">{detailPayout.planName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getStatusBadge(detailPayout.status)}
                </div>
              </div>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Deal</TableHead>
                      <TableHead>Account</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                      <TableHead className="text-right">Discount</TableHead>
                      <TableHead className="text-right">Commission</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detailPayout.lineItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.dealName}</TableCell>
                        <TableCell>{item.accountName}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.dealValue)}</TableCell>
                        <TableCell className="text-right">{item.discountApplied}%</TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(item.finalCommission)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-end gap-8 pt-4 border-t">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Gross Amount</p>
                  <p className="text-lg font-semibold">{formatCurrency(detailPayout.grossAmount)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Holdback</p>
                  <p className="text-lg font-semibold text-muted-foreground">
                    -{formatCurrency(detailPayout.holdbackAmount)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Net Payout</p>
                  <p className="text-xl font-bold text-success">{formatCurrency(detailPayout.netAmount)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
