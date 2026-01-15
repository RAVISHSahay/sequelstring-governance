import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, 
  GripVertical, 
  Settings2, 
  Trash2, 
  Edit, 
  Shield, 
  FileText, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronRight,
  Lock,
  Unlock,
  FlaskConical,
  Users,
  DollarSign,
  Target,
  TrendingUp,
  TrendingDown,
  UserCheck,
  UserX,
  Crown,
  Star,
  Wallet,
  CircleDollarSign,
  ClipboardCheck,
  Gauge,
  BarChart3,
  Activity,
  Eye,
  Zap,
} from "lucide-react";
import { defaultSalesStages } from "@/data/mockAccountData";
import { SalesStage, StageRule, POCStatus, StakeholderStance } from "@/types/account";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

// Stage categories with colors
const stageCategories = [
  { value: 'prospecting', label: 'Prospecting', color: 'bg-slate-500' },
  { value: 'qualification', label: 'Qualification', color: 'bg-blue-500' },
  { value: 'proposal', label: 'Proposal', color: 'bg-amber-500' },
  { value: 'negotiation', label: 'Negotiation', color: 'bg-purple-500' },
  { value: 'closing', label: 'Closing', color: 'bg-emerald-500' },
  { value: 'post_sale', label: 'Post-Sale', color: 'bg-teal-500' },
];

const forecastCategories = [
  { value: 'omitted', label: 'Omitted', color: 'text-muted-foreground' },
  { value: 'pipeline', label: 'Pipeline', color: 'text-blue-500' },
  { value: 'best_case', label: 'Best Case', color: 'text-amber-500' },
  { value: 'commit', label: 'Commit', color: 'text-emerald-500' },
  { value: 'closed', label: 'Closed', color: 'text-purple-500' },
];

// POC Stages
const pocStages: { value: POCStatus; label: string; color: string }[] = [
  { value: 'initiated', label: 'Initiated', color: 'bg-slate-500' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-blue-500' },
  { value: 'completed', label: 'Completed', color: 'bg-amber-500' },
  { value: 'accepted', label: 'Accepted', color: 'bg-emerald-500' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-500' },
  { value: 'waived', label: 'Waived', color: 'bg-purple-500' },
];

// POC KPI Categories
const pocKPICategories = [
  { value: 'accuracy', label: 'Accuracy', icon: Target },
  { value: 'performance', label: 'Performance', icon: Zap },
  { value: 'cost_saving', label: 'Cost Saving', icon: CircleDollarSign },
  { value: 'sla_improvement', label: 'SLA Improvement', icon: Clock },
  { value: 'compliance', label: 'Compliance', icon: Shield },
  { value: 'custom', label: 'Custom', icon: Settings2 },
];

// Stakeholder stances
const stakeholderStances: { value: StakeholderStance; label: string; color: string; icon: any }[] = [
  { value: 'champion', label: 'Champion', color: 'bg-emerald-500', icon: Crown },
  { value: 'supporter', label: 'Supporter', color: 'bg-blue-500', icon: UserCheck },
  { value: 'influencer', label: 'Influencer', color: 'bg-amber-500', icon: Star },
  { value: 'decision_maker', label: 'Decision Maker', color: 'bg-purple-500', icon: Shield },
  { value: 'neutral', label: 'Neutral', color: 'bg-slate-500', icon: Users },
  { value: 'against_us', label: 'Against Us', color: 'bg-red-500', icon: UserX },
];

// Mock POC KPIs for configuration
const defaultPOCKPIs = [
  { id: '1', name: 'System Accuracy', category: 'accuracy', unit: '%', defaultTarget: 95 },
  { id: '2', name: 'Response Time', category: 'performance', unit: 'ms', defaultTarget: 200 },
  { id: '3', name: 'Cost Reduction', category: 'cost_saving', unit: '%', defaultTarget: 20 },
  { id: '4', name: 'SLA Compliance', category: 'sla_improvement', unit: '%', defaultTarget: 99 },
  { id: '5', name: 'Audit Pass Rate', category: 'compliance', unit: '%', defaultTarget: 100 },
];

// Stage governance rules mock
const stageGovernanceRules = [
  { stageFrom: 'Discovery', stageTo: 'Solution Mapping', rules: ['Champion identified', 'Pain points documented'] },
  { stageFrom: 'Solution Mapping', stageTo: 'Proposal', rules: ['Solution mapped to requirements', 'Technical validation complete'] },
  { stageFrom: 'Proposal', stageTo: 'Negotiation', rules: ['POC completed or waived', 'Budget identified', 'Champion confirmed'] },
  { stageFrom: 'Negotiation', stageTo: 'Project Approved', rules: ['Commercial terms agreed', 'Legal review complete', 'Approval authority confirmed'] },
];

export default function SalesStageConfig() {
  const [stages, setStages] = useState<SalesStage[]>(defaultSalesStages);
  const [selectedStage, setSelectedStage] = useState<SalesStage | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('stages');

  const handleStageToggle = (stageId: string) => {
    setStages(prev => prev.map(stage => 
      stage.id === stageId ? { ...stage, isActive: !stage.isActive } : stage
    ));
    toast({
      title: "Stage updated",
      description: "Stage visibility has been toggled.",
    });
  };

  const handleSaveStage = () => {
    if (selectedStage) {
      setStages(prev => prev.map(stage => 
        stage.id === selectedStage.id ? selectedStage : stage
      ));
      setIsEditDialogOpen(false);
      toast({
        title: "Stage saved",
        description: `${selectedStage.name} configuration has been updated.`,
      });
    }
  };

  const getCategoryInfo = (category: string) => {
    return stageCategories.find(c => c.value === category) || stageCategories[0];
  };

  const getForecastInfo = (forecast: string) => {
    return forecastCategories.find(f => f.value === forecast) || forecastCategories[0];
  };

  return (
    <AppLayout title="Sales Stage Configuration">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Sales Stage Framework</h1>
            <p className="text-muted-foreground mt-1">
              POC governance, stakeholder mapping, budget tracking & stage rules
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Settings2 className="h-4 w-4 mr-2" />
              Import Config
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Stage
            </Button>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="stages" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Stages
            </TabsTrigger>
            <TabsTrigger value="poc" className="gap-2">
              <FlaskConical className="h-4 w-4" />
              POC Governance
            </TabsTrigger>
            <TabsTrigger value="stakeholders" className="gap-2">
              <Users className="h-4 w-4" />
              Stakeholder Mapping
            </TabsTrigger>
            <TabsTrigger value="budget" className="gap-2">
              <Wallet className="h-4 w-4" />
              Budget & Approval
            </TabsTrigger>
            <TabsTrigger value="governance" className="gap-2">
              <Shield className="h-4 w-4" />
              Stage Rules
            </TabsTrigger>
          </TabsList>

          {/* ==================== STAGES TAB ==================== */}
          <TabsContent value="stages" className="space-y-6">
            {/* Stage Pipeline Visual */}
            <Card>
              <CardHeader>
                <CardTitle>Weighted Pipeline Stages</CardTitle>
                <CardDescription>Configure probability-driven stages for predictable revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 overflow-x-auto pb-4">
                  {stages.filter(s => s.isActive).sort((a, b) => a.order - b.order).map((stage, index) => {
                    const categoryInfo = getCategoryInfo(stage.category);
                    return (
                      <div key={stage.id} className="flex items-center">
                        <div 
                          className={cn(
                            "flex items-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition-all hover:shadow-md",
                            "bg-card min-w-[160px]"
                          )}
                          onClick={() => {
                            setSelectedStage(stage);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className={cn("h-2 w-2 rounded-full", categoryInfo.color)} />
                              <span className="font-medium text-sm">{stage.name}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs font-bold">
                                {stage.defaultProbability}%
                              </Badge>
                              {stage.priceLocked && <Lock className="h-3 w-3 text-amber-500" />}
                            </div>
                          </div>
                        </div>
                        {index < stages.filter(s => s.isActive).length - 1 && (
                          <ChevronRight className="h-4 w-4 text-muted-foreground mx-1 flex-shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Stage Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stages.sort((a, b) => a.order - b.order).map(stage => {
                const categoryInfo = getCategoryInfo(stage.category);
                const forecastInfo = getForecastInfo(stage.forecastCategory);
                
                return (
                  <Card 
                    key={stage.id}
                    className={cn(
                      "transition-all cursor-pointer hover:shadow-md",
                      !stage.isActive && "opacity-50"
                    )}
                    onClick={() => {
                      setSelectedStage(stage);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className={cn("h-3 w-3 rounded-full", categoryInfo.color)} />
                          <CardTitle className="text-lg">{stage.name}</CardTitle>
                        </div>
                        <Switch
                          checked={stage.isActive}
                          onCheckedChange={() => handleStageToggle(stage.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <CardDescription>{stage.code}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Probability</span>
                        <Badge variant="outline" className="font-bold">{stage.defaultProbability}%</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Forecast</span>
                        <span className={forecastInfo.color}>{forecastInfo.label}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Expected:</span>
                        <span>{stage.expectedDuration} days</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {stage.requiresApproval && (
                          <Badge variant="secondary" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            Approval
                          </Badge>
                        )}
                        {stage.priceLocked && (
                          <Badge variant="secondary" className="text-xs">
                            <Lock className="h-3 w-3 mr-1" />
                            Price Lock
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-emerald-500" />
                          {stage.entryCriteria.length} Entry Rules
                        </span>
                        <span className="flex items-center gap-1">
                          <XCircle className="h-3 w-3 text-amber-500" />
                          {stage.exitCriteria.length} Exit Rules
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* ==================== POC GOVERNANCE TAB ==================== */}
          <TabsContent value="poc" className="space-y-6">
            {/* POC Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">POC Stages</p>
                      <p className="text-2xl font-bold">{pocStages.length}</p>
                    </div>
                    <FlaskConical className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">KPI Templates</p>
                      <p className="text-2xl font-bold">{defaultPOCKPIs.length}</p>
                    </div>
                    <Target className="h-8 w-8 text-emerald-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Prob. Adjustment</p>
                      <p className="text-2xl font-bold">±50%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-amber-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Waiver Allowed</p>
                      <p className="text-2xl font-bold">Yes</p>
                    </div>
                    <ClipboardCheck className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* POC Lifecycle Stages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="h-5 w-5" />
                  POC Lifecycle Stages
                </CardTitle>
                <CardDescription>
                  Configure POC as a first-class workflow with time tracking and outcome mapping
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 overflow-x-auto pb-4">
                  {pocStages.map((stage, index) => (
                    <div key={stage.value} className="flex items-center">
                      <div className={cn(
                        "px-4 py-3 rounded-lg border min-w-[130px] cursor-pointer hover:shadow-md transition-all",
                        "bg-card"
                      )}>
                        <div className="flex items-center gap-2">
                          <div className={cn("h-3 w-3 rounded-full", stage.color)} />
                          <span className="font-medium text-sm">{stage.label}</span>
                        </div>
                      </div>
                      {index < pocStages.length - 1 && (
                        <ChevronRight className="h-4 w-4 text-muted-foreground mx-1 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>POC Impact on Probability:</strong>
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-500">Accepted</Badge>
                      <span className="text-emerald-600">+15% to +30%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-amber-500">Completed</Badge>
                      <span className="text-amber-600">+5% to +15%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-500">Rejected</Badge>
                      <span className="text-red-600">-30% to -50%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* POC KPI Templates */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      POC Success KPIs
                    </CardTitle>
                    <CardDescription>
                      Define success metrics for POC evaluation
                    </CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add KPI
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>KPI Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Default Target</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {defaultPOCKPIs.map((kpi) => {
                      const category = pocKPICategories.find(c => c.value === kpi.category);
                      const Icon = category?.icon || Target;
                      return (
                        <TableRow key={kpi.id}>
                          <TableCell className="font-medium">{kpi.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="gap-1">
                              <Icon className="h-3 w-3" />
                              {category?.label}
                            </Badge>
                          </TableCell>
                          <TableCell>{kpi.unit}</TableCell>
                          <TableCell>{kpi.defaultTarget}{kpi.unit === '%' ? '%' : ''}</TableCell>
                          <TableCell>
                            <Progress value={20} className="w-16 h-2" />
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== STAKEHOLDER MAPPING TAB ==================== */}
          <TabsContent value="stakeholders" className="space-y-6">
            {/* Stakeholder Stance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Deal Politics Engine
                </CardTitle>
                <CardDescription>
                  Map stakeholder influence, stance, and relationship strength for each opportunity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {stakeholderStances.map((stance) => {
                    const Icon = stance.icon;
                    return (
                      <div 
                        key={stance.value}
                        className={cn(
                          "p-4 rounded-lg border text-center cursor-pointer hover:shadow-md transition-all",
                          "bg-card"
                        )}
                      >
                        <div className={cn(
                          "h-10 w-10 rounded-full mx-auto mb-2 flex items-center justify-center",
                          stance.color
                        )}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <p className="font-medium text-sm">{stance.label}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {stance.value === 'against_us' ? 'Risk Alert' : 'Influence Map'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Stakeholder Configuration */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Influence Scoring */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gauge className="h-5 w-5" />
                    Influence Scoring
                  </CardTitle>
                  <CardDescription>Configure influence score thresholds</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { level: 5, label: 'Critical', description: 'Final decision authority', color: 'bg-red-500' },
                      { level: 4, label: 'High', description: 'Strong influence on decision', color: 'bg-amber-500' },
                      { level: 3, label: 'Medium', description: 'Significant input in process', color: 'bg-yellow-500' },
                      { level: 2, label: 'Low', description: 'Limited involvement', color: 'bg-blue-500' },
                      { level: 1, label: 'Minimal', description: 'Informational only', color: 'bg-slate-500' },
                    ].map((item) => (
                      <div key={item.level} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-3">
                          <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-white font-bold", item.color)}>
                            {item.level}
                          </div>
                          <div>
                            <p className="font-medium">{item.label}</p>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Risk Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Risk Alert Configuration
                  </CardTitle>
                  <CardDescription>Auto-trigger alerts based on stakeholder analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-950/30 rounded-r-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <UserX className="h-5 w-5 text-red-500" />
                      <span className="font-semibold text-red-700 dark:text-red-400">High-Influence Blocker</span>
                    </div>
                    <p className="text-sm text-red-600 dark:text-red-300">
                      Alert when "Against Us" stakeholder has influence score ≥ 4
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Switch defaultChecked />
                      <span className="text-sm text-muted-foreground">Active</span>
                    </div>
                  </div>
                  <div className="p-4 border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/30 rounded-r-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="h-5 w-5 text-amber-500" />
                      <span className="font-semibold text-amber-700 dark:text-amber-400">Missing Champion</span>
                    </div>
                    <p className="text-sm text-amber-600 dark:text-amber-300">
                      Alert when no Champion identified at Proposal stage
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Switch defaultChecked />
                      <span className="text-sm text-muted-foreground">Active</span>
                    </div>
                  </div>
                  <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/30 rounded-r-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-blue-500" />
                      <span className="font-semibold text-blue-700 dark:text-blue-400">Decision Maker Gap</span>
                    </div>
                    <p className="text-sm text-blue-600 dark:text-blue-300">
                      Alert when no Decision Maker mapped at Negotiation stage
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Switch defaultChecked />
                      <span className="text-sm text-muted-foreground">Active</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ==================== BUDGET & APPROVAL TAB ==================== */}
          <TabsContent value="budget" className="space-y-6">
            {/* Budget Tracking Config */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Budget Status Tracking
                  </CardTitle>
                  <CardDescription>Configure budget identification requirements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { status: 'Yes', description: 'Budget fully allocated and confirmed', color: 'bg-emerald-500', probImpact: '+10%' },
                      { status: 'Partial', description: 'Partial budget or pending approval', color: 'bg-amber-500', probImpact: '+0%' },
                      { status: 'No', description: 'No budget allocated yet', color: 'bg-red-500', probImpact: '-15%' },
                    ].map((item) => (
                      <div key={item.status} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className={cn("h-3 w-3 rounded-full", item.color)} />
                          <div>
                            <p className="font-medium">Budget: {item.status}</p>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                        <Badge variant={item.probImpact.startsWith('+') ? 'default' : 'destructive'}>
                          {item.probImpact} Prob.
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5" />
                    Approval Status Tracking
                  </CardTitle>
                  <CardDescription>Configure approval workflow stages</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { status: 'Approved', icon: CheckCircle, color: 'text-emerald-500', description: 'Project formally sanctioned' },
                      { status: 'In Review', icon: Eye, color: 'text-blue-500', description: 'Under evaluation by authority' },
                      { status: 'Conditional', icon: AlertTriangle, color: 'text-amber-500', description: 'Approved with conditions' },
                      { status: 'Rejected', icon: XCircle, color: 'text-red-500', description: 'Not approved - closed lost' },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.status} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                          <div className="flex items-center gap-3">
                            <Icon className={cn("h-5 w-5", item.color)} />
                            <div>
                              <p className="font-medium">{item.status}</p>
                              <p className="text-xs text-muted-foreground">{item.description}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Funding Sources */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CircleDollarSign className="h-5 w-5" />
                      Funding Source Categories
                    </CardTitle>
                    <CardDescription>Track where budget is allocated from</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Source
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {[
                    { name: 'OPEX', description: 'Operational Expenditure' },
                    { name: 'CAPEX', description: 'Capital Expenditure' },
                    { name: 'Project Fund', description: 'Dedicated project budget' },
                    { name: 'Contingency', description: 'Reserve funds' },
                    { name: 'External', description: 'External funding/grant' },
                    { name: 'Unknown', description: 'Source not identified' },
                  ].map((source) => (
                    <div 
                      key={source.name}
                      className="p-3 rounded-lg border text-center cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <p className="font-medium text-sm">{source.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{source.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stage-Budget Rules */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Budget Validation Rules
                </CardTitle>
                <CardDescription>Enforce budget requirements at stage transitions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Proposal Stage Entry</p>
                      <p className="text-sm text-muted-foreground">Require: Budget Identified = Yes or Partial</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Negotiation Stage Entry</p>
                      <p className="text-sm text-muted-foreground">Require: Budget Owner identified</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Project Approved Stage Entry</p>
                      <p className="text-sm text-muted-foreground">Require: Approval Status = Approved</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== STAGE GOVERNANCE RULES TAB ==================== */}
          <TabsContent value="governance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Stage Entry & Exit Governance
                </CardTitle>
                <CardDescription>
                  Define mandatory requirements for stage transitions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4">
                    {stageGovernanceRules.map((rule, idx) => (
                      <div key={idx} className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline">{rule.stageFrom}</Badge>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          <Badge>{rule.stageTo}</Badge>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Required for transition:</p>
                          {rule.rules.map((r, rIdx) => (
                            <div key={rIdx} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                              <CheckCircle className="h-4 w-4 text-emerald-500" />
                              <span className="text-sm">{r}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button variant="outline" size="sm">
                            <Plus className="h-3 w-3 mr-1" />
                            Add Rule
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Probability Adjustments Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Probability Intelligence
                </CardTitle>
                <CardDescription>
                  How POC, stakeholders, and budget affect deal probability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2 mb-3">
                      <FlaskConical className="h-5 w-5 text-blue-500" />
                      <span className="font-semibold">POC Impact</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Accepted</span>
                        <span className="text-emerald-600 font-medium">+15% to +30%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rejected</span>
                        <span className="text-red-600 font-medium">-30% to -50%</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="h-5 w-5 text-purple-500" />
                      <span className="font-semibold">Stakeholder Risk</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>High-influence blocker</span>
                        <span className="text-red-600 font-medium">-20%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>No champion</span>
                        <span className="text-amber-600 font-medium">-10%</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center gap-2 mb-3">
                      <Wallet className="h-5 w-5 text-emerald-500" />
                      <span className="font-semibold">Budget Readiness</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Budget confirmed</span>
                        <span className="text-emerald-600 font-medium">+10%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>No budget</span>
                        <span className="text-red-600 font-medium">-15%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Stage Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            {selectedStage && (
              <>
                <DialogHeader>
                  <DialogTitle>Configure Stage: {selectedStage.name}</DialogTitle>
                  <DialogDescription>
                    Define entry/exit criteria, governance rules, and workflow triggers
                  </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="criteria">Criteria</TabsTrigger>
                    <TabsTrigger value="governance">Governance</TabsTrigger>
                    <TabsTrigger value="workflows">Workflows</TabsTrigger>
                  </TabsList>

                  <TabsContent value="general" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Stage Name</Label>
                        <Input 
                          value={selectedStage.name}
                          onChange={(e) => setSelectedStage({...selectedStage, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Stage Code</Label>
                        <Input 
                          value={selectedStage.code}
                          onChange={(e) => setSelectedStage({...selectedStage, code: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select 
                          value={selectedStage.category}
                          onValueChange={(value: any) => setSelectedStage({...selectedStage, category: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {stageCategories.map(cat => (
                              <SelectItem key={cat.value} value={cat.value}>
                                <div className="flex items-center gap-2">
                                  <div className={cn("h-2 w-2 rounded-full", cat.color)} />
                                  {cat.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Forecast Category</Label>
                        <Select 
                          value={selectedStage.forecastCategory}
                          onValueChange={(value: any) => setSelectedStage({...selectedStage, forecastCategory: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {forecastCategories.map(cat => (
                              <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Default Probability: {selectedStage.defaultProbability}%</Label>
                      <Slider
                        value={[selectedStage.defaultProbability]}
                        onValueChange={([value]) => setSelectedStage({...selectedStage, defaultProbability: value})}
                        max={100}
                        step={5}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Expected Duration (days)</Label>
                        <Input 
                          type="number"
                          value={selectedStage.expectedDuration}
                          onChange={(e) => setSelectedStage({...selectedStage, expectedDuration: parseInt(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Warning (days)</Label>
                        <Input 
                          type="number"
                          value={selectedStage.warningThreshold}
                          onChange={(e) => setSelectedStage({...selectedStage, warningThreshold: parseInt(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Critical (days)</Label>
                        <Input 
                          type="number"
                          value={selectedStage.criticalThreshold}
                          onChange={(e) => setSelectedStage({...selectedStage, criticalThreshold: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="criteria" className="space-y-4 mt-4">
                    <div>
                      <Label className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        Entry Criteria
                      </Label>
                      <div className="space-y-2 p-4 border rounded-lg bg-muted/30">
                        {selectedStage.entryCriteria.length > 0 ? (
                          selectedStage.entryCriteria.map((rule) => (
                            <div key={rule.id} className="flex items-center justify-between p-2 bg-background rounded">
                              <span className="text-sm">{rule.field} {rule.operator} {String(rule.value)}</span>
                              <Button variant="ghost" size="sm"><Trash2 className="h-3 w-3" /></Button>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No entry criteria defined</p>
                        )}
                        <Button variant="outline" size="sm" className="w-full mt-2">
                          <Plus className="h-3 w-3 mr-1" />Add Entry Rule
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="flex items-center gap-2 mb-2">
                        <XCircle className="h-4 w-4 text-amber-500" />
                        Exit Criteria
                      </Label>
                      <div className="space-y-2 p-4 border rounded-lg bg-muted/30">
                        {selectedStage.exitCriteria.length > 0 ? (
                          selectedStage.exitCriteria.map((rule) => (
                            <div key={rule.id} className="flex items-center justify-between p-2 bg-background rounded">
                              <span className="text-sm">{rule.field} {rule.operator} {String(rule.value)}</span>
                              <Button variant="ghost" size="sm"><Trash2 className="h-3 w-3" /></Button>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No exit criteria defined</p>
                        )}
                        <Button variant="outline" size="sm" className="w-full mt-2">
                          <Plus className="h-3 w-3 mr-1" />Add Exit Rule
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="governance" className="space-y-4 mt-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label>Requires Approval</Label>
                        <p className="text-sm text-muted-foreground">Stage transition requires manager approval</p>
                      </div>
                      <Switch
                        checked={selectedStage.requiresApproval}
                        onCheckedChange={(checked) => setSelectedStage({...selectedStage, requiresApproval: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label>Lock Pricing</Label>
                        <p className="text-sm text-muted-foreground">Pricing cannot be modified at this stage</p>
                      </div>
                      <Switch
                        checked={selectedStage.priceLocked}
                        onCheckedChange={(checked) => setSelectedStage({...selectedStage, priceLocked: checked})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Maximum Discount: {selectedStage.maxDiscount}%</Label>
                      <Slider
                        value={[selectedStage.maxDiscount]}
                        onValueChange={([value]) => setSelectedStage({...selectedStage, maxDiscount: value})}
                        max={100}
                        step={5}
                      />
                    </div>

                    <div>
                      <Label className="mb-2">Required Documents</Label>
                      <div className="flex flex-wrap gap-2 p-4 border rounded-lg bg-muted/30">
                        {selectedStage.requiredDocuments.map((doc, idx) => (
                          <Badge key={idx} variant="outline">
                            <FileText className="h-3 w-3 mr-1" />{doc}
                            <button className="ml-1 hover:text-destructive">×</button>
                          </Badge>
                        ))}
                        <Button variant="ghost" size="sm">
                          <Plus className="h-3 w-3 mr-1" />Add Document
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="workflows" className="space-y-4 mt-4">
                    <div>
                      <Label className="mb-2">On Enter Workflows</Label>
                      <div className="space-y-2 p-4 border rounded-lg bg-muted/30">
                        {selectedStage.onEnterWorkflows.length > 0 ? (
                          selectedStage.onEnterWorkflows.map((wf, idx) => (
                            <Badge key={idx} variant="secondary">{wf}</Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No workflows configured</p>
                        )}
                        <Button variant="outline" size="sm" className="w-full mt-2">
                          <Plus className="h-3 w-3 mr-1" />Add Workflow
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2">On Exit Workflows</Label>
                      <div className="space-y-2 p-4 border rounded-lg bg-muted/30">
                        {selectedStage.onExitWorkflows.length > 0 ? (
                          selectedStage.onExitWorkflows.map((wf, idx) => (
                            <Badge key={idx} variant="secondary">{wf}</Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No workflows configured</p>
                        )}
                        <Button variant="outline" size="sm" className="w-full mt-2">
                          <Plus className="h-3 w-3 mr-1" />Add Workflow
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <DialogFooter className="mt-6">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSaveStage}>Save Changes</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
