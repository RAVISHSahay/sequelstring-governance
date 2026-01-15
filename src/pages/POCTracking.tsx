import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  FlaskConical, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  Target, 
  TrendingUp, 
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Calendar,
  Users,
  DollarSign,
  BarChart3,
  Edit,
  Eye,
  Play,
  Pause,
  Check,
  X,
  Zap,
  Shield,
  CircleDollarSign,
  Settings2,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Briefcase,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { POCStatus, POCKPI } from "@/types/account";

// POC Status configuration
const pocStatusConfig: Record<POCStatus, { label: string; color: string; bgColor: string; icon: any }> = {
  initiated: { label: 'Initiated', color: 'text-slate-600', bgColor: 'bg-slate-100 dark:bg-slate-800', icon: Play },
  in_progress: { label: 'In Progress', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900', icon: Zap },
  completed: { label: 'Completed', color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900', icon: CheckCircle },
  accepted: { label: 'Accepted', color: 'text-emerald-600', bgColor: 'bg-emerald-100 dark:bg-emerald-900', icon: Check },
  rejected: { label: 'Rejected', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900', icon: X },
  waived: { label: 'Waived', color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900', icon: Shield },
};

// KPI Category configuration
const kpiCategories = {
  accuracy: { label: 'Accuracy', icon: Target, color: 'text-blue-500' },
  performance: { label: 'Performance', icon: Zap, color: 'text-amber-500' },
  cost_saving: { label: 'Cost Saving', icon: CircleDollarSign, color: 'text-emerald-500' },
  sla_improvement: { label: 'SLA', icon: Clock, color: 'text-purple-500' },
  compliance: { label: 'Compliance', icon: Shield, color: 'text-red-500' },
  custom: { label: 'Custom', icon: Settings2, color: 'text-slate-500' },
};

// Mock POC Data
const mockPOCs = [
  {
    id: 'poc_1',
    name: 'Enterprise CRM Integration POC',
    opportunityId: 'opp_1',
    opportunityName: 'TechCorp Enterprise License',
    accountName: 'TechCorp India Pvt Ltd',
    status: 'in_progress' as POCStatus,
    startDate: new Date('2024-11-15'),
    expectedEndDate: new Date('2024-12-20'),
    daysElapsed: 32,
    daysRemaining: 5,
    objectives: ['Validate API integration', 'Test data sync accuracy', 'Measure performance under load'],
    pocOwner: 'Rahul Sharma',
    customerContact: 'Vikram Singh (CTO)',
    technicalLead: 'Priya Mehta',
    estimatedCost: 150000,
    actualCost: 125000,
    overallScore: 78,
    probabilityAdjustment: 15,
    kpis: [
      { id: 'kpi_1', name: 'API Response Time', category: 'performance', baselineValue: 500, targetValue: 200, actualValue: 180, unit: 'ms', weight: 25, achieved: true },
      { id: 'kpi_2', name: 'Data Sync Accuracy', category: 'accuracy', baselineValue: 85, targetValue: 99, actualValue: 97, unit: '%', weight: 30, achieved: false },
      { id: 'kpi_3', name: 'System Uptime', category: 'sla_improvement', baselineValue: 95, targetValue: 99.9, actualValue: 99.5, unit: '%', weight: 25, achieved: false },
      { id: 'kpi_4', name: 'Integration Cost Reduction', category: 'cost_saving', baselineValue: 0, targetValue: 30, actualValue: 35, unit: '%', weight: 20, achieved: true },
    ],
  },
  {
    id: 'poc_2',
    name: 'Analytics Platform Pilot',
    opportunityId: 'opp_2',
    opportunityName: 'FinServ Analytics Suite',
    accountName: 'FinServ Ltd',
    status: 'completed' as POCStatus,
    startDate: new Date('2024-10-01'),
    expectedEndDate: new Date('2024-11-30'),
    daysElapsed: 60,
    daysRemaining: 0,
    objectives: ['Validate ML model accuracy', 'Test report generation', 'Assess user adoption'],
    pocOwner: 'Anjali Kumar',
    customerContact: 'Ramesh Gupta (VP Analytics)',
    technicalLead: 'Sanjay Patel',
    estimatedCost: 200000,
    actualCost: 185000,
    overallScore: 92,
    probabilityAdjustment: 25,
    kpis: [
      { id: 'kpi_5', name: 'Prediction Accuracy', category: 'accuracy', baselineValue: 70, targetValue: 90, actualValue: 94, unit: '%', weight: 40, achieved: true },
      { id: 'kpi_6', name: 'Report Generation Time', category: 'performance', baselineValue: 120, targetValue: 30, actualValue: 25, unit: 'sec', weight: 30, achieved: true },
      { id: 'kpi_7', name: 'User Adoption Rate', category: 'custom', baselineValue: 0, targetValue: 80, actualValue: 85, unit: '%', weight: 30, achieved: true },
    ],
  },
  {
    id: 'poc_3',
    name: 'Cloud Migration Assessment',
    opportunityId: 'opp_3',
    opportunityName: 'RetailMax Cloud Transformation',
    accountName: 'RetailMax India',
    status: 'initiated' as POCStatus,
    startDate: new Date('2024-12-10'),
    expectedEndDate: new Date('2025-01-31'),
    daysElapsed: 5,
    daysRemaining: 47,
    objectives: ['Assess migration complexity', 'Validate cloud architecture', 'Test disaster recovery'],
    pocOwner: 'Vikram Das',
    customerContact: 'Meera Joshi (IT Director)',
    technicalLead: 'Amit Shah',
    estimatedCost: 250000,
    actualCost: 50000,
    overallScore: 0,
    probabilityAdjustment: 0,
    kpis: [
      { id: 'kpi_8', name: 'Migration Success Rate', category: 'accuracy', baselineValue: 0, targetValue: 100, actualValue: undefined, unit: '%', weight: 35, achieved: false },
      { id: 'kpi_9', name: 'Downtime During Migration', category: 'sla_improvement', baselineValue: 480, targetValue: 60, actualValue: undefined, unit: 'min', weight: 35, achieved: false },
      { id: 'kpi_10', name: 'Cost vs Estimate', category: 'cost_saving', baselineValue: 100, targetValue: 90, actualValue: undefined, unit: '%', weight: 30, achieved: false },
    ],
  },
  {
    id: 'poc_4',
    name: 'Security Compliance Validation',
    opportunityId: 'opp_4',
    opportunityName: 'GovCorp Security Suite',
    accountName: 'Government Corp',
    status: 'rejected' as POCStatus,
    startDate: new Date('2024-09-01'),
    expectedEndDate: new Date('2024-10-15'),
    daysElapsed: 45,
    daysRemaining: 0,
    objectives: ['Validate security protocols', 'Test compliance adherence', 'Audit trail verification'],
    pocOwner: 'Priya Sharma',
    customerContact: 'Col. Rajan (CISO)',
    technicalLead: 'Karthik Nair',
    estimatedCost: 180000,
    actualCost: 175000,
    overallScore: 45,
    probabilityAdjustment: -40,
    kpis: [
      { id: 'kpi_11', name: 'Security Audit Pass Rate', category: 'compliance', baselineValue: 0, targetValue: 100, actualValue: 65, unit: '%', weight: 50, achieved: false },
      { id: 'kpi_12', name: 'Encryption Compliance', category: 'compliance', baselineValue: 0, targetValue: 100, actualValue: 100, unit: '%', weight: 30, achieved: true },
      { id: 'kpi_13', name: 'Response Time SLA', category: 'performance', baselineValue: 1000, targetValue: 200, actualValue: 350, unit: 'ms', weight: 20, achieved: false },
    ],
  },
];

const formatCurrency = (value: number) => {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  return `₹${value.toLocaleString('en-IN')}`;
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function POCTracking() {
  const [pocs, setPocs] = useState(mockPOCs);
  const [selectedPOC, setSelectedPOC] = useState<typeof mockPOCs[0] | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredPOCs = pocs.filter(poc => {
    const matchesSearch = poc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poc.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poc.opportunityName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || poc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pocStats = {
    total: pocs.length,
    inProgress: pocs.filter(p => p.status === 'in_progress').length,
    completed: pocs.filter(p => p.status === 'completed').length,
    accepted: pocs.filter(p => p.status === 'accepted').length,
    rejected: pocs.filter(p => p.status === 'rejected').length,
    avgScore: Math.round(pocs.filter(p => p.overallScore > 0).reduce((sum, p) => sum + p.overallScore, 0) / pocs.filter(p => p.overallScore > 0).length),
  };

  const handleViewPOC = (poc: typeof mockPOCs[0]) => {
    setSelectedPOC(poc);
    setIsDetailDialogOpen(true);
  };

  const handleUpdateStatus = (pocId: string, newStatus: POCStatus) => {
    setPocs(prev => prev.map(poc => 
      poc.id === pocId ? { ...poc, status: newStatus } : poc
    ));
    toast({
      title: "POC Status Updated",
      description: `POC status changed to ${pocStatusConfig[newStatus].label}`,
    });
  };

  const getKPIProgress = (kpi: typeof mockPOCs[0]['kpis'][0]) => {
    if (kpi.actualValue === undefined) return 0;
    const isLowerBetter = kpi.category === 'performance' || kpi.name.toLowerCase().includes('time') || kpi.name.toLowerCase().includes('cost');
    
    if (isLowerBetter) {
      const improvement = ((kpi.baselineValue - kpi.actualValue) / (kpi.baselineValue - kpi.targetValue)) * 100;
      return Math.min(100, Math.max(0, improvement));
    } else {
      const progress = ((kpi.actualValue - kpi.baselineValue) / (kpi.targetValue - kpi.baselineValue)) * 100;
      return Math.min(100, Math.max(0, progress));
    }
  };

  return (
    <AppLayout title="POC Tracking">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">POC Tracking</h1>
            <p className="text-muted-foreground mt-1">
              Manage active Proof of Concepts with KPI progress tracking
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New POC
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total POCs</p>
                  <p className="text-2xl font-bold">{pocStats.total}</p>
                </div>
                <FlaskConical className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{pocStats.inProgress}</p>
                </div>
                <Zap className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-amber-600">{pocStats.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Accepted</p>
                  <p className="text-2xl font-bold text-emerald-600">{pocStats.accepted}</p>
                </div>
                <Check className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{pocStats.rejected}</p>
                </div>
                <X className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Avg Score</p>
                  <p className="text-2xl font-bold text-purple-600">{pocStats.avgScore}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search POCs, accounts, opportunities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.entries(pocStatusConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>{config.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* POC Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredPOCs.map((poc) => {
            const statusInfo = pocStatusConfig[poc.status];
            const StatusIcon = statusInfo.icon;
            const achievedKPIs = poc.kpis.filter(k => k.achieved).length;
            const totalKPIs = poc.kpis.length;
            
            return (
              <Card 
                key={poc.id} 
                className="cursor-pointer hover:shadow-lg transition-all"
                onClick={() => handleViewPOC(poc)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg", statusInfo.bgColor)}>
                        <FlaskConical className={cn("h-5 w-5", statusInfo.color)} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{poc.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Building2 className="h-3 w-3" />
                          {poc.accountName}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={cn(statusInfo.bgColor, statusInfo.color, "border-0")}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusInfo.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Opportunity Link */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    <span>{poc.opportunityName}</span>
                  </div>

                  {/* Timeline */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(poc.startDate)} - {formatDate(poc.expectedEndDate)}</span>
                    </div>
                    {poc.daysRemaining > 0 ? (
                      <Badge variant="outline" className="text-xs">
                        {poc.daysRemaining} days left
                      </Badge>
                    ) : poc.status !== 'initiated' && (
                      <Badge variant="secondary" className="text-xs">
                        Completed
                      </Badge>
                    )}
                  </div>

                  {/* KPI Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">KPIs Achieved</span>
                      <span className="font-medium">{achievedKPIs}/{totalKPIs}</span>
                    </div>
                    <Progress value={(achievedKPIs / totalKPIs) * 100} className="h-2" />
                  </div>

                  {/* Overall Score & Probability Impact */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Score:</span>
                      <span className={cn(
                        "font-bold",
                        poc.overallScore >= 80 ? "text-emerald-600" :
                        poc.overallScore >= 60 ? "text-amber-600" :
                        poc.overallScore > 0 ? "text-red-600" : "text-muted-foreground"
                      )}>
                        {poc.overallScore > 0 ? `${poc.overallScore}%` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-muted-foreground">Prob. Impact:</span>
                      {poc.probabilityAdjustment !== 0 && (
                        <Badge 
                          variant={poc.probabilityAdjustment > 0 ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {poc.probabilityAdjustment > 0 ? (
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                          )}
                          {poc.probabilityAdjustment > 0 ? '+' : ''}{poc.probabilityAdjustment}%
                        </Badge>
                      )}
                      {poc.probabilityAdjustment === 0 && (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </div>
                  </div>

                  {/* Team */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{poc.pocOwner.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="text-muted-foreground">{poc.pocOwner}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span>{formatCurrency(poc.actualCost)} / {formatCurrency(poc.estimatedCost)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredPOCs.length === 0 && (
          <Card className="p-12 text-center">
            <FlaskConical className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No POCs found</h3>
            <p className="text-muted-foreground mt-1">Try adjusting your search or filter criteria</p>
          </Card>
        )}

        {/* POC Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedPOC && (
              <>
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg", pocStatusConfig[selectedPOC.status].bgColor)}>
                        <FlaskConical className={cn("h-6 w-6", pocStatusConfig[selectedPOC.status].color)} />
                      </div>
                      <div>
                        <DialogTitle className="text-xl">{selectedPOC.name}</DialogTitle>
                        <DialogDescription className="flex items-center gap-2 mt-1">
                          <Building2 className="h-3 w-3" />
                          {selectedPOC.accountName} • {selectedPOC.opportunityName}
                        </DialogDescription>
                      </div>
                    </div>
                    <Select 
                      value={selectedPOC.status} 
                      onValueChange={(value: POCStatus) => {
                        handleUpdateStatus(selectedPOC.id, value);
                        setSelectedPOC({ ...selectedPOC, status: value });
                      }}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(pocStatusConfig).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <config.icon className={cn("h-4 w-4", config.color)} />
                              {config.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </DialogHeader>

                <Tabs defaultValue="kpis" className="mt-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="kpis">KPIs</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="team">Team</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                  </TabsList>

                  {/* KPIs Tab */}
                  <TabsContent value="kpis" className="space-y-4 mt-4">
                    {/* Overall Score */}
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Overall Score</p>
                            <p className={cn(
                              "text-4xl font-bold",
                              selectedPOC.overallScore >= 80 ? "text-emerald-600" :
                              selectedPOC.overallScore >= 60 ? "text-amber-600" :
                              selectedPOC.overallScore > 0 ? "text-red-600" : "text-muted-foreground"
                            )}>
                              {selectedPOC.overallScore > 0 ? `${selectedPOC.overallScore}%` : 'Pending'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Probability Impact</p>
                            <p className={cn(
                              "text-2xl font-bold",
                              selectedPOC.probabilityAdjustment > 0 ? "text-emerald-600" :
                              selectedPOC.probabilityAdjustment < 0 ? "text-red-600" : "text-muted-foreground"
                            )}>
                              {selectedPOC.probabilityAdjustment > 0 ? '+' : ''}{selectedPOC.probabilityAdjustment}%
                            </p>
                          </div>
                        </div>
                        <Progress 
                          value={selectedPOC.overallScore} 
                          className="mt-4 h-3"
                        />
                      </CardContent>
                    </Card>

                    {/* Individual KPIs */}
                    <div className="space-y-3">
                      {selectedPOC.kpis.map((kpi) => {
                        const category = kpiCategories[kpi.category as keyof typeof kpiCategories];
                        const Icon = category?.icon || Target;
                        const progress = getKPIProgress(kpi);
                        
                        return (
                          <Card key={kpi.id}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className={cn("p-2 rounded-lg bg-muted")}>
                                    <Icon className={cn("h-5 w-5", category?.color)} />
                                  </div>
                                  <div>
                                    <p className="font-medium">{kpi.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      Weight: {kpi.weight}%
                                    </p>
                                  </div>
                                </div>
                                {kpi.achieved ? (
                                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Achieved
                                  </Badge>
                                ) : kpi.actualValue !== undefined ? (
                                  <Badge variant="destructive">
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Not Met
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Pending
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                                <div>
                                  <p className="text-muted-foreground">Baseline</p>
                                  <p className="font-medium">{kpi.baselineValue}{kpi.unit}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Target</p>
                                  <p className="font-medium text-primary">{kpi.targetValue}{kpi.unit}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Actual</p>
                                  <p className={cn(
                                    "font-medium",
                                    kpi.achieved ? "text-emerald-600" : 
                                    kpi.actualValue !== undefined ? "text-red-600" : "text-muted-foreground"
                                  )}>
                                    {kpi.actualValue !== undefined ? `${kpi.actualValue}${kpi.unit}` : '-'}
                                  </p>
                                </div>
                              </div>
                              
                              <Progress value={progress} className="h-2" />
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </TabsContent>

                  {/* Details Tab */}
                  <TabsContent value="details" className="space-y-4 mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">POC Objectives</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {selectedPOC.objectives.map((obj, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                              <Target className="h-4 w-4 text-primary" />
                              <span className="text-sm">{obj}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Timeline</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Start Date</span>
                            <span className="font-medium">{formatDate(selectedPOC.startDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Expected End</span>
                            <span className="font-medium">{formatDate(selectedPOC.expectedEndDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Days Elapsed</span>
                            <span className="font-medium">{selectedPOC.daysElapsed} days</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Days Remaining</span>
                            <Badge variant={selectedPOC.daysRemaining > 7 ? "secondary" : "destructive"}>
                              {selectedPOC.daysRemaining} days
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Budget</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Estimated Cost</span>
                            <span className="font-medium">{formatCurrency(selectedPOC.estimatedCost)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Actual Cost</span>
                            <span className="font-medium">{formatCurrency(selectedPOC.actualCost)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Variance</span>
                            <Badge variant={selectedPOC.actualCost <= selectedPOC.estimatedCost ? "default" : "destructive"}>
                              {selectedPOC.actualCost <= selectedPOC.estimatedCost ? '-' : '+'}
                              {formatCurrency(Math.abs(selectedPOC.estimatedCost - selectedPOC.actualCost))}
                            </Badge>
                          </div>
                          <Progress 
                            value={(selectedPOC.actualCost / selectedPOC.estimatedCost) * 100} 
                            className="h-2"
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Team Tab */}
                  <TabsContent value="team" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback>{selectedPOC.pocOwner.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{selectedPOC.pocOwner}</p>
                              <p className="text-sm text-muted-foreground">POC Owner</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback>{selectedPOC.technicalLead.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{selectedPOC.technicalLead}</p>
                              <p className="text-sm text-muted-foreground">Technical Lead</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback>{selectedPOC.customerContact.split(' ')[0].split('').slice(0, 2).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{selectedPOC.customerContact}</p>
                              <p className="text-sm text-muted-foreground">Customer Contact</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* History Tab */}
                  <TabsContent value="history" className="mt-4">
                    <Card>
                      <CardContent className="p-6 text-center text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Status history and audit trail will appear here</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                <DialogFooter className="mt-6">
                  <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                    Close
                  </Button>
                  <Button>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit POC
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
