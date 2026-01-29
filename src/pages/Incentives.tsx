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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  MoreHorizontal,
  DollarSign,
  Percent,
  TrendingUp,
  Layers,
  Edit,
  Copy,
  Trash2,
  Eye,
  Lock,
  Unlock,
  PlayCircle,
  PauseCircle,
} from "lucide-react";
import { mockIncentivePlans, incentiveSummaryStats } from "@/data/mockIncentiveData";
import { IncentivePlan, CommissionModel } from "@/types/incentives";
import { AddIncentivePlanDialog } from "@/components/incentives/AddIncentivePlanDialog";
import { CommissionCalculator } from "@/components/incentives/CommissionCalculator";
import { useToast } from "@/hooks/use-toast";

const modelLabels: Record<CommissionModel, string> = {
  flat_percentage: "Flat %",
  slab_based: "Slab-Based",
  tiered: "Tiered",
  product_wise: "Product-Wise",
  margin_based: "Margin-Based",
  discount_linked: "Discount-Linked",
  accelerator: "Accelerator",
  decelerator: "Decelerator",
};

const modelDescriptions: Record<CommissionModel, string> = {
  flat_percentage: "Fixed percentage on all deals",
  slab_based: "Different rates based on deal value ranges",
  tiered: "Cumulative rates across tiers",
  product_wise: "Product-specific commission rates",
  margin_based: "Commission linked to margin achieved",
  discount_linked: "Penalty for over-discounting",
  accelerator: "Higher payout after hitting threshold",
  decelerator: "Lower payout for poor margin",
};

export default function Incentives() {
  const { toast } = useToast();
  const [plans, setPlans] = useState<IncentivePlan[]>(mockIncentivePlans);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<IncentivePlan | null>(null);
  const [selectedTab, setSelectedTab] = useState("plans");

  const filteredPlans = plans.filter((plan) =>
    plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSavePlan = (data: Partial<IncentivePlan>) => {
    if (editingPlan) {
      setPlans(prev =>
        prev.map(p => p.id === editingPlan.id ? { ...p, ...data } as IncentivePlan : p)
      );
      toast({ title: "Incentive plan updated successfully" });
    } else {
      const newPlan: IncentivePlan = {
        id: `PLAN-${String(plans.length + 1).padStart(3, '0')}`,
        name: data.name || '',
        description: data.description || '',
        commissionModel: data.commissionModel || 'flat_percentage',
        commissionBasis: data.commissionBasis || 'order_value',
        payoutTrigger: data.payoutTrigger || 'payment_receipt',
        baseRate: data.baseRate || 5,
        slabs: data.slabs || [],
        acceleratorThreshold: data.acceleratorThreshold || 100,
        acceleratorMultiplier: data.acceleratorMultiplier || 1.5,
        deceleratorThreshold: data.deceleratorThreshold || 20,
        deceleratorMultiplier: data.deceleratorMultiplier || 0.8,
        discountPenaltyEnabled: data.discountPenaltyEnabled || false,
        discountPenaltyRate: data.discountPenaltyRate || 0,
        applicableProducts: data.applicableProducts || [],
        applicableTeams: data.applicableTeams || [],
        effectiveFrom: data.effectiveFrom || new Date().toISOString().split('T')[0],
        effectiveTo: data.effectiveTo || '',
        status: 'draft',
        isLocked: false,
        createdBy: 'Current User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPlans(prev => [...prev, newPlan]);
      toast({ title: "Incentive plan created successfully" });
    }
    setEditingPlan(null);
  };

  const handleEdit = (plan: IncentivePlan) => {
    if (plan.isLocked) {
      toast({ title: "Cannot edit locked plan", variant: "destructive" });
      return;
    }
    setEditingPlan(plan);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const plan = plans.find(p => p.id === id);
    if (plan?.isLocked) {
      toast({ title: "Cannot delete locked plan", variant: "destructive" });
      return;
    }
    setPlans(prev => prev.filter(p => p.id !== id));
    toast({ title: "Incentive plan deleted successfully" });
  };

  const handleToggleLock = (id: string) => {
    setPlans(prev =>
      prev.map(p => p.id === id ? { ...p, isLocked: !p.isLocked } : p)
    );
    const plan = plans.find(p => p.id === id);
    toast({ title: plan?.isLocked ? "Plan unlocked" : "Plan locked" });
  };

  const handleToggleStatus = (id: string) => {
    setPlans(prev =>
      prev.map(p => p.id === id ? { 
        ...p, 
        status: p.status === 'active' ? 'inactive' : 'active' 
      } : p)
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success/10 text-success border-0">Active</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
    return `₹${value.toLocaleString()}`;
  };

  return (
    <AppLayout title="Incentive Plans">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Incentive Plans</h1>
            <p className="text-muted-foreground">
              Configure commission models, slabs, and payout triggers
            </p>
          </div>
          <Button onClick={() => { setEditingPlan(null); setDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            New Plan
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="stat-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Plans</p>
                  <p className="text-2xl font-bold">{incentiveSummaryStats.totalActivePlans}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Layers className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Incentive Liability</p>
                  <p className="text-2xl font-bold">{formatCurrency(incentiveSummaryStats.totalIncentiveLiability)}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">YTD Payouts</p>
                  <p className="text-2xl font-bold">{formatCurrency(incentiveSummaryStats.ytdPayoutsReleased)}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Approvals</p>
                  <p className="text-2xl font-bold">{incentiveSummaryStats.pendingApprovals}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
                  <Percent className="h-5 w-5 text-chart-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="plans">Commission Plans</TabsTrigger>
            <TabsTrigger value="calculator">Commission Calculator</TabsTrigger>
            <TabsTrigger value="models">Plan Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="plans" className="space-y-4">
            {/* Search */}
            <Card>
              <CardContent className="p-4">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search plans..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredPlans.map((plan) => (
                <Card key={plan.id} className="relative">
                  {plan.isLocked && (
                    <div className="absolute top-4 right-4">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <CardDescription className="mt-1">{plan.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {getStatusBadge(plan.status)}
                      <Badge variant="outline">{modelLabels[plan.commissionModel]}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Base Rate</p>
                        <p className="font-semibold">{plan.baseRate}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Payout Trigger</p>
                        <p className="font-semibold capitalize">{plan.payoutTrigger.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Commission Basis</p>
                        <p className="font-semibold capitalize">{plan.commissionBasis.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Effective Period</p>
                        <p className="font-semibold">{plan.effectiveFrom} - {plan.effectiveTo}</p>
                      </div>
                    </div>

                    {plan.slabs.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Commission Slabs</p>
                        <div className="space-y-1">
                          {plan.slabs.slice(0, 3).map((slab, idx) => (
                            <div key={slab.id} className="flex justify-between text-sm bg-muted/50 px-3 py-1.5 rounded">
                              <span>
                                {formatCurrency(slab.minValue)} - {slab.maxValue ? formatCurrency(slab.maxValue) : '∞'}
                              </span>
                              <span className="font-semibold text-primary">{slab.rate}%</span>
                            </div>
                          ))}
                          {plan.slabs.length > 3 && (
                            <p className="text-xs text-muted-foreground text-center">
                              +{plan.slabs.length - 3} more slabs
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {plan.discountPenaltyEnabled && (
                      <div className="flex items-center gap-2 text-sm text-warning">
                        <Percent className="h-4 w-4" />
                        <span>Discount penalty: {plan.discountPenaltyRate}% per discount %</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEdit(plan)}
                        disabled={plan.isLocked}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleLock(plan.id)}
                      >
                        {plan.isLocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(plan.id)}
                      >
                        {plan.status === 'active' ? (
                          <PauseCircle className="h-4 w-4" />
                        ) : (
                          <PlayCircle className="h-4 w-4" />
                        )}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Clone Plan
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(plan.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Plan
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="calculator">
            <CommissionCalculator plans={plans} />
          </TabsContent>

          <TabsContent value="models" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Commission Model Templates</CardTitle>
                <CardDescription>
                  Pre-configured templates for common commission structures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(Object.entries(modelLabels) as [CommissionModel, string][]).map(([model, label]) => (
                    <Card key={model} className="cursor-pointer hover:border-primary/50 transition-colors">
                      <CardContent className="p-4">
                        <h3 className="font-semibold">{label}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {modelDescriptions[model]}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3 w-full"
                          onClick={() => {
                            setEditingPlan(null);
                            setDialogOpen(true);
                          }}
                        >
                          Use Template
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AddIncentivePlanDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSavePlan}
        editData={editingPlan}
      />
    </AppLayout>
  );
}
