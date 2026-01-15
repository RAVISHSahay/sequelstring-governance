import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  FlaskConical, 
  Plus,
  Building2,
  Calendar,
  DollarSign,
  Users,
  Target,
  Zap,
  Clock,
  CircleDollarSign,
  Shield,
  Settings2,
  Check,
  X,
  Play,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  FileText,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { POCStatus, POCKPI } from "@/types/account";
import { AddPOCDialog, POCFormData } from "./AddPOCDialog";

interface OpportunityDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opportunity: {
    id: number;
    name: string;
    account: string;
    value: string;
    probability: number;
    owner: string;
    initials: string;
    daysInStage: number;
    closeDate: string;
    stage?: string;
  } | null;
}

// POC Status configuration
const pocStatusConfig: Record<POCStatus, { label: string; color: string; bgColor: string; icon: any }> = {
  initiated: { label: 'Initiated', color: 'text-slate-600', bgColor: 'bg-slate-100 dark:bg-slate-800', icon: Play },
  in_progress: { label: 'In Progress', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900', icon: Zap },
  completed: { label: 'Completed', color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900', icon: CheckCircle },
  accepted: { label: 'Accepted', color: 'text-emerald-600', bgColor: 'bg-emerald-100 dark:bg-emerald-900', icon: Check },
  rejected: { label: 'Rejected', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900', icon: X },
  waived: { label: 'Waived', color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900', icon: Shield },
};

const kpiCategories = {
  accuracy: { label: 'Accuracy', icon: Target, color: 'text-blue-500' },
  performance: { label: 'Performance', icon: Zap, color: 'text-amber-500' },
  cost_saving: { label: 'Cost Saving', icon: CircleDollarSign, color: 'text-emerald-500' },
  sla_improvement: { label: 'SLA', icon: Clock, color: 'text-purple-500' },
  compliance: { label: 'Compliance', icon: Shield, color: 'text-red-500' },
  custom: { label: 'Custom', icon: Settings2, color: 'text-slate-500' },
};

// Mock POC data linked to opportunities
const getMockPOCsForOpportunity = (opportunityId: number) => {
  const allPOCs = [
    {
      id: 'poc_opp_1',
      opportunityId: 6,
      name: 'Platform Performance Validation',
      status: 'in_progress' as POCStatus,
      startDate: new Date('2024-12-01'),
      expectedEndDate: new Date('2025-01-15'),
      daysRemaining: 10,
      overallScore: 72,
      probabilityAdjustment: 12,
      kpis: [
        { id: 'k1', name: 'Response Time', category: 'performance' as const, baselineValue: 500, targetValue: 200, actualValue: 220, unit: 'ms', weight: 40, achieved: false },
        { id: 'k2', name: 'Uptime SLA', category: 'sla_improvement' as const, baselineValue: 95, targetValue: 99.9, actualValue: 99.5, unit: '%', weight: 30, achieved: false },
        { id: 'k3', name: 'Integration Success', category: 'accuracy' as const, baselineValue: 80, targetValue: 98, actualValue: 96, unit: '%', weight: 30, achieved: false },
      ],
    },
    {
      id: 'poc_opp_2',
      opportunityId: 3,
      name: 'ERP Data Migration POC',
      status: 'completed' as POCStatus,
      startDate: new Date('2024-10-15'),
      expectedEndDate: new Date('2024-11-30'),
      daysRemaining: 0,
      overallScore: 88,
      probabilityAdjustment: 20,
      kpis: [
        { id: 'k4', name: 'Data Accuracy', category: 'accuracy' as const, baselineValue: 85, targetValue: 99, actualValue: 98, unit: '%', weight: 50, achieved: true },
        { id: 'k5', name: 'Migration Speed', category: 'performance' as const, baselineValue: 1000, targetValue: 200, actualValue: 180, unit: 'rec/s', weight: 30, achieved: true },
        { id: 'k6', name: 'Downtime', category: 'sla_improvement' as const, baselineValue: 480, targetValue: 60, actualValue: 45, unit: 'min', weight: 20, achieved: true },
      ],
    },
    {
      id: 'poc_opp_3',
      opportunityId: 10,
      name: 'Support Platform Assessment',
      status: 'accepted' as POCStatus,
      startDate: new Date('2024-09-01'),
      expectedEndDate: new Date('2024-10-15'),
      daysRemaining: 0,
      overallScore: 94,
      probabilityAdjustment: 25,
      kpis: [
        { id: 'k7', name: 'Ticket Resolution', category: 'performance' as const, baselineValue: 24, targetValue: 4, actualValue: 3.5, unit: 'hrs', weight: 40, achieved: true },
        { id: 'k8', name: 'Customer Satisfaction', category: 'custom' as const, baselineValue: 70, targetValue: 90, actualValue: 92, unit: '%', weight: 35, achieved: true },
        { id: 'k9', name: 'Cost per Ticket', category: 'cost_saving' as const, baselineValue: 500, targetValue: 200, actualValue: 180, unit: '₹', weight: 25, achieved: true },
      ],
    },
  ];

  return allPOCs.filter(poc => poc.opportunityId === opportunityId);
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

type LinkedPOC = {
  id: string;
  opportunityId: number;
  name: string;
  status: POCStatus;
  startDate: Date;
  expectedEndDate: Date;
  daysRemaining: number;
  overallScore: number;
  probabilityAdjustment: number;
  kpis: POCKPI[];
};

export function OpportunityDetailDialog({ open, onOpenChange, opportunity }: OpportunityDetailDialogProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddPOCOpen, setIsAddPOCOpen] = useState(false);
  const [linkedPOCs, setLinkedPOCs] = useState<LinkedPOC[]>([]);

  // Load POCs when opportunity changes
  useState(() => {
    if (opportunity) {
      const mockPOCs = getMockPOCsForOpportunity(opportunity.id);
      setLinkedPOCs(mockPOCs.map(p => ({
        ...p,
        kpis: p.kpis.map(k => ({ ...k })) as POCKPI[],
      })));
    }
  });

  const handleAddPOC = (pocData: POCFormData) => {
    const newPOC: LinkedPOC = {
      id: `poc_new_${Date.now()}`,
      opportunityId: opportunity?.id || 0,
      name: pocData.name,
      status: 'initiated' as POCStatus,
      startDate: new Date(pocData.startDate),
      expectedEndDate: new Date(pocData.expectedEndDate),
      daysRemaining: Math.ceil((new Date(pocData.expectedEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      overallScore: 0,
      probabilityAdjustment: 0,
      kpis: pocData.kpis,
    };

    setLinkedPOCs(prev => [...prev, newPOC]);
    toast({
      title: "POC Created",
      description: `POC "${pocData.name}" linked to this opportunity`,
    });
  };

  const navigateToPOCTracking = () => {
    onOpenChange(false);
    navigate('/poc-tracking');
  };

  if (!opportunity) return null;

  const pocs: LinkedPOC[] = linkedPOCs.length > 0 ? linkedPOCs : getMockPOCsForOpportunity(opportunity.id).map(p => ({
    ...p,
    kpis: p.kpis.map(k => ({ ...k })) as POCKPI[],
  }));
  const activePOCs = pocs.filter(p => p.status === 'in_progress');
  const completedPOCs = pocs.filter(p => ['completed', 'accepted', 'rejected'].includes(p.status));
  const totalProbabilityImpact = pocs.reduce((sum, p) => sum + p.probabilityAdjustment, 0);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-xl">{opportunity.name}</DialogTitle>
                <DialogDescription className="flex items-center gap-2 mt-1">
                  <Building2 className="h-4 w-4" />
                  {opportunity.account}
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-lg font-semibold">
                  {opportunity.value}
                </Badge>
                <Badge className={cn(
                  opportunity.probability >= 70 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300" :
                  opportunity.probability >= 40 ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300" :
                  "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                )}>
                  {opportunity.probability}% probability
                </Badge>
              </div>
            </div>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="pocs" className="flex items-center gap-2">
                <FlaskConical className="h-4 w-4" />
                POCs
                {pocs.length > 0 && (
                  <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                    {pocs.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Users className="h-4 w-4" />
                      <span className="text-xs">Owner</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{opportunity.initials}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{opportunity.owner}</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs">Close Date</span>
                    </div>
                    <p className="font-medium">{opportunity.closeDate}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Clock className="h-4 w-4" />
                      <span className="text-xs">Days in Stage</span>
                    </div>
                    <p className={cn("font-medium", opportunity.daysInStage > 10 && "text-destructive")}>
                      {opportunity.daysInStage} days
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <FlaskConical className="h-4 w-4" />
                      <span className="text-xs">POC Impact</span>
                    </div>
                    <p className={cn(
                      "font-medium flex items-center gap-1",
                      totalProbabilityImpact > 0 ? "text-emerald-600" : totalProbabilityImpact < 0 ? "text-red-600" : ""
                    )}>
                      {totalProbabilityImpact > 0 && <TrendingUp className="h-4 w-4" />}
                      {totalProbabilityImpact < 0 && <TrendingDown className="h-4 w-4" />}
                      {totalProbabilityImpact > 0 ? '+' : ''}{totalProbabilityImpact}%
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* POC Summary in Overview */}
              {pocs.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <FlaskConical className="h-4 w-4 text-primary" />
                        Linked POCs
                      </CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => setActiveTab('pocs')}>
                        View All <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {pocs.slice(0, 2).map(poc => {
                        const status = pocStatusConfig[poc.status];
                        const StatusIcon = status.icon;
                        return (
                          <div key={poc.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-3">
                              <div className={cn("p-1.5 rounded", status.bgColor)}>
                                <StatusIcon className={cn("h-4 w-4", status.color)} />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{poc.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  Score: {poc.overallScore}% • {poc.kpis.filter(k => k.achieved).length}/{poc.kpis.length} KPIs met
                                </p>
                              </div>
                            </div>
                            <Badge className={cn(status.bgColor, status.color, "border-0 text-xs")}>
                              {status.label}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* POCs Tab */}
            <TabsContent value="pocs" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Active: </span>
                    <span className="font-semibold text-blue-600">{activePOCs.length}</span>
                  </div>
                  <Separator orientation="vertical" className="h-4" />
                  <div className="text-sm">
                    <span className="text-muted-foreground">Completed: </span>
                    <span className="font-semibold">{completedPOCs.length}</span>
                  </div>
                  <Separator orientation="vertical" className="h-4" />
                  <div className="text-sm">
                    <span className="text-muted-foreground">Probability Impact: </span>
                    <span className={cn(
                      "font-semibold",
                      totalProbabilityImpact > 0 ? "text-emerald-600" : totalProbabilityImpact < 0 ? "text-red-600" : ""
                    )}>
                      {totalProbabilityImpact > 0 ? '+' : ''}{totalProbabilityImpact}%
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={navigateToPOCTracking}>
                    <ExternalLink className="h-4 w-4 mr-1" />
                    POC Tracking
                  </Button>
                  <Button size="sm" onClick={() => setIsAddPOCOpen(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    New POC
                  </Button>
                </div>
              </div>

              {pocs.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-12 text-center">
                    <FlaskConical className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No POCs Linked</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create a Proof of Concept to validate technical requirements and increase deal probability.
                    </p>
                    <Button onClick={() => setIsAddPOCOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create POC
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {pocs.map(poc => {
                    const status = pocStatusConfig[poc.status];
                    const StatusIcon = status.icon;
                    const achievedKPIs = poc.kpis.filter(k => k.achieved).length;
                    
                    return (
                      <Card key={poc.id}>
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className={cn("p-2 rounded-lg", status.bgColor)}>
                                <FlaskConical className={cn("h-5 w-5", status.color)} />
                              </div>
                              <div>
                                <CardTitle className="text-base">{poc.name}</CardTitle>
                                <CardDescription className="flex items-center gap-2 mt-0.5">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(poc.startDate)} - {formatDate(poc.expectedEndDate)}
                                  {poc.daysRemaining > 0 && (
                                    <Badge variant="outline" className="text-xs ml-2">
                                      {poc.daysRemaining} days left
                                    </Badge>
                                  )}
                                </CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={cn(status.bgColor, status.color, "border-0")}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {status.label}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Score & Impact */}
                          <div className="flex items-center gap-6">
                            <div>
                              <p className="text-xs text-muted-foreground">Overall Score</p>
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold">{poc.overallScore}%</span>
                                <Progress value={poc.overallScore} className="w-20 h-2" />
                              </div>
                            </div>
                            <Separator orientation="vertical" className="h-10" />
                            <div>
                              <p className="text-xs text-muted-foreground">Probability Impact</p>
                              <span className={cn(
                                "text-2xl font-bold flex items-center gap-1",
                                poc.probabilityAdjustment > 0 ? "text-emerald-600" : poc.probabilityAdjustment < 0 ? "text-red-600" : ""
                              )}>
                                {poc.probabilityAdjustment > 0 && <TrendingUp className="h-5 w-5" />}
                                {poc.probabilityAdjustment < 0 && <TrendingDown className="h-5 w-5" />}
                                {poc.probabilityAdjustment > 0 ? '+' : ''}{poc.probabilityAdjustment}%
                              </span>
                            </div>
                            <Separator orientation="vertical" className="h-10" />
                            <div>
                              <p className="text-xs text-muted-foreground">KPIs Met</p>
                              <span className="text-2xl font-bold">
                                {achievedKPIs}/{poc.kpis.length}
                              </span>
                            </div>
                          </div>

                          {/* KPIs */}
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">KPI Progress</p>
                            <div className="grid gap-2">
                              {poc.kpis.map(kpi => {
                                const category = kpiCategories[kpi.category];
                                const CategoryIcon = category.icon;
                                const progress = kpi.actualValue !== undefined 
                                  ? Math.min(100, Math.abs((kpi.actualValue - kpi.baselineValue) / (kpi.targetValue - kpi.baselineValue) * 100))
                                  : 0;
                                
                                return (
                                  <div key={kpi.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                                    <CategoryIcon className={cn("h-4 w-4", category.color)} />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium truncate">{kpi.name}</span>
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs text-muted-foreground">
                                            {kpi.actualValue ?? '—'} / {kpi.targetValue} {kpi.unit}
                                          </span>
                                          {kpi.achieved ? (
                                            <Check className="h-4 w-4 text-emerald-500" />
                                          ) : kpi.actualValue !== undefined ? (
                                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                                          ) : (
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                          )}
                                        </div>
                                      </div>
                                      <Progress value={progress} className="h-1.5" />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* Activities Tab */}
            <TabsContent value="activities" className="space-y-4 mt-4">
              <Card className="border-dashed">
                <CardContent className="py-8 text-center">
                  <Activity className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Activity timeline coming soon
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <AddPOCDialog
        open={isAddPOCOpen}
        onOpenChange={setIsAddPOCOpen}
        onSave={handleAddPOC}
      />
    </>
  );
}
