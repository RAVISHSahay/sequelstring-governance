import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import {
  Settings2,
  Copy,
  Lock,
  Unlock,
  Play,
  FileText,
  Search,
  Filter,
  Plus,
  Calendar,
  User,
  Building2,
  History,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react';
import { mockIncentivePlans, mockAuditLogs } from '@/data/mockIncentiveData';
import { IncentivePlan, AuditLog } from '@/types/incentives';
import { PayoutSimulator } from '@/components/admin/PayoutSimulator';
import { ClonePlanDialog } from '@/components/admin/ClonePlanDialog';

export default function AdminControls() {
  const [plans, setPlans] = useState<IncentivePlan[]>(mockIncentivePlans);
  const [auditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [logFilter, setLogFilter] = useState<string>('all');
  const [cloneDialogOpen, setCloneDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<IncentivePlan | null>(null);
  const [simulatorOpen, setSimulatorOpen] = useState(false);

  const filteredPlans = plans.filter((plan) => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || plan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredLogs = auditLogs.filter((log) => {
    return logFilter === 'all' || log.entityType === logFilter;
  });

  const handleToggleLock = (planId: string) => {
    setPlans((prev) =>
      prev.map((plan) =>
        plan.id === planId
          ? { ...plan, isLocked: !plan.isLocked, updatedAt: new Date().toISOString().split('T')[0] }
          : plan
      )
    );
    const plan = plans.find((p) => p.id === planId);
    toast.success(
      plan?.isLocked ? `Plan "${plan.name}" unlocked` : `Plan "${plan?.name}" locked`
    );
  };

  const handleClonePlan = (plan: IncentivePlan) => {
    setSelectedPlan(plan);
    setCloneDialogOpen(true);
  };

  const handleSimulatePlan = (plan: IncentivePlan) => {
    setSelectedPlan(plan);
    setSimulatorOpen(true);
  };

  const handleCloneComplete = (clonedPlan: IncentivePlan) => {
    setPlans((prev) => [...prev, clonedPlan]);
    setCloneDialogOpen(false);
    toast.success(`Plan "${clonedPlan.name}" created successfully`);
  };

  const handleActivatePlan = (planId: string) => {
    setPlans((prev) =>
      prev.map((plan) =>
        plan.id === planId
          ? { ...plan, status: 'active', updatedAt: new Date().toISOString().split('T')[0] }
          : plan
      )
    );
    toast.success('Plan activated successfully');
  };

  const handleDeactivatePlan = (planId: string) => {
    setPlans((prev) =>
      prev.map((plan) =>
        plan.id === planId
          ? { ...plan, status: 'inactive', updatedAt: new Date().toISOString().split('T')[0] }
          : plan
      )
    );
    toast.success('Plan deactivated successfully');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Active</Badge>;
      case 'draft':
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Draft</Badge>;
      case 'inactive':
        return <Badge className="bg-muted text-muted-foreground">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'create':
        return <Badge className="bg-emerald-500/10 text-emerald-500">Create</Badge>;
      case 'update':
        return <Badge className="bg-blue-500/10 text-blue-500">Update</Badge>;
      case 'delete':
        return <Badge className="bg-destructive/10 text-destructive">Delete</Badge>;
      case 'approve':
        return <Badge className="bg-emerald-500/10 text-emerald-500">Approve</Badge>;
      case 'reject':
        return <Badge className="bg-destructive/10 text-destructive">Reject</Badge>;
      case 'release':
        return <Badge className="bg-primary/10 text-primary">Release</Badge>;
      case 'clawback':
        return <Badge className="bg-amber-500/10 text-amber-500">Clawback</Badge>;
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  const summaryStats = {
    totalPlans: plans.length,
    activePlans: plans.filter((p) => p.status === 'active').length,
    lockedPlans: plans.filter((p) => p.isLocked).length,
    draftPlans: plans.filter((p) => p.status === 'draft').length,
  };

  return (
    <AppLayout title="Admin Controls">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Controls</h1>
            <p className="text-muted-foreground">
              Manage incentive plans, simulate payouts, and view audit logs
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setSimulatorOpen(true)}>
              <Play className="mr-2 h-4 w-4" />
              Simulate Payout
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="card-elevated">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Plans</p>
                  <p className="text-2xl font-bold text-foreground">{summaryStats.totalPlans}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Settings2 className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Plans</p>
                  <p className="text-2xl font-bold text-emerald-500">{summaryStats.activePlans}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Locked Plans</p>
                  <p className="text-2xl font-bold text-amber-500">{summaryStats.lockedPlans}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Draft Plans</p>
                  <p className="text-2xl font-bold text-muted-foreground">{summaryStats.draftPlans}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="plans" className="space-y-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="plans" className="gap-2">
              <Settings2 className="h-4 w-4" />
              Plan Management
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-2">
              <History className="h-4 w-4" />
              Audit Logs
            </TabsTrigger>
            <TabsTrigger value="compliance" className="gap-2">
              <Shield className="h-4 w-4" />
              Compliance
            </TabsTrigger>
          </TabsList>

          {/* Plan Management Tab */}
          <TabsContent value="plans" className="space-y-4">
            <Card className="card-elevated">
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle>Incentive Plans</CardTitle>
                    <CardDescription>
                      Define, clone, and manage incentive plans
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search plans..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 w-[200px]"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[130px]">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plan Name</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Base Rate</TableHead>
                      <TableHead>Effective Period</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Lock</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{plan.name}</p>
                            <p className="text-sm text-muted-foreground">{plan.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {plan.commissionModel.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{plan.baseRate}%</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{plan.effectiveFrom}</p>
                            <p className="text-muted-foreground">to {plan.effectiveTo}</p>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(plan.status)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleLock(plan.id)}
                            disabled={plan.status === 'draft'}
                          >
                            {plan.isLocked ? (
                              <Lock className="h-4 w-4 text-amber-500" />
                            ) : (
                              <Unlock className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSimulatePlan(plan)}
                              title="Simulate"
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleClonePlan(plan)}
                              title="Clone"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            {plan.status === 'draft' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleActivatePlan(plan.id)}
                                className="text-emerald-500 hover:text-emerald-600"
                                title="Activate"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                            )}
                            {plan.status === 'active' && !plan.isLocked && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeactivatePlan(plan.id)}
                                className="text-destructive hover:text-destructive"
                                title="Deactivate"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="audit" className="space-y-4">
            <Card className="card-elevated">
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle>Audit Trail</CardTitle>
                    <CardDescription>
                      Complete history of all changes for SOX and internal audit compliance
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select value={logFilter} onValueChange={setLogFilter}>
                      <SelectTrigger className="w-[150px]">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Entity Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Entities</SelectItem>
                        <SelectItem value="target">Targets</SelectItem>
                        <SelectItem value="plan">Plans</SelectItem>
                        <SelectItem value="payout">Payouts</SelectItem>
                        <SelectItem value="approval">Approvals</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <Calendar className="mr-2 h-4 w-4" />
                      Date Range
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Entity</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Changed By</TableHead>
                        <TableHead>Changes</TableHead>
                        <TableHead>IP Address</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <div className="text-sm">
                              <p>{new Date(log.timestamp).toLocaleDateString()}</p>
                              <p className="text-muted-foreground">
                                {new Date(log.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <Badge variant="outline" className="capitalize">
                                {log.entityType}
                              </Badge>
                              <p className="text-sm text-muted-foreground mt-1">{log.entityId}</p>
                            </div>
                          </TableCell>
                          <TableCell>{getActionBadge(log.action)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{log.changedBy}</p>
                                <p className="text-sm text-muted-foreground">{log.changedByRole}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Change Details</DialogTitle>
                                  <DialogDescription>
                                    {log.action} on {log.entityType} {log.entityId}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label className="text-muted-foreground">Previous Value</Label>
                                    <pre className="mt-1 p-3 bg-muted rounded-lg text-sm overflow-auto">
                                      {JSON.stringify(log.previousValue, null, 2)}
                                    </pre>
                                  </div>
                                  <div>
                                    <Label className="text-muted-foreground">New Value</Label>
                                    <pre className="mt-1 p-3 bg-muted rounded-lg text-sm overflow-auto">
                                      {JSON.stringify(log.newValue, null, 2)}
                                    </pre>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{log.ipAddress}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Separation of Duties
                  </CardTitle>
                  <CardDescription>
                    Role-based access control for incentive management
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">Sales</p>
                        <p className="text-sm text-muted-foreground">View targets, track performance</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-500">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="font-medium">Finance</p>
                        <p className="text-sm text-muted-foreground">Approve payouts, view audit logs</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-500">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <Settings2 className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <p className="font-medium">Admin</p>
                        <p className="text-sm text-muted-foreground">Full access, plan management</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-500">Active</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Compliance Alerts
                  </CardTitle>
                  <CardDescription>
                    Issues requiring attention
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-500">Draft Plan Pending</p>
                      <p className="text-sm text-muted-foreground">
                        "Margin Protection Plan" has been in draft for 30+ days
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-emerald-500">All Payouts Reconciled</p>
                      <p className="text-sm text-muted-foreground">
                        Q4 2023 payouts fully reconciled and audited
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                    <History className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-500">Audit Log Retention</p>
                      <p className="text-sm text-muted-foreground">
                        Logs retained for 7 years (SOX compliant)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Clone Plan Dialog */}
      {selectedPlan && (
        <ClonePlanDialog
          open={cloneDialogOpen}
          onOpenChange={setCloneDialogOpen}
          plan={selectedPlan}
          onClone={handleCloneComplete}
        />
      )}

      {/* Payout Simulator Dialog */}
      <PayoutSimulator
        open={simulatorOpen}
        onOpenChange={setSimulatorOpen}
        plan={selectedPlan}
        plans={plans}
      />
    </AppLayout>
  );
}
