import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Building2,
  Users,
  Target,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Phone,
  Mail,
  Calendar,
  ChevronRight,
  Star,
  Activity,
  Network,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Briefcase,
  Crown,
  UserCheck,
  Gauge,
  Plus,
  UserPlus,
  ClipboardList,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  sampleAccounts, 
  sampleStakeholders, 
  sampleOpportunities, 
  sampleActivities,
  defaultSalesStages 
} from '@/data/mockAccountData';
import { AddOpportunityDialog, OpportunityData } from '@/components/dialogs/AddOpportunityDialog';
import { AddContactDialog } from '@/components/dialogs/AddContactDialog';
import { LogActivityDialog } from '@/components/dialogs/LogActivityDialog';
import { toast } from 'sonner';

const getHealthColor = (score: number) => {
  if (score >= 80) return 'text-emerald-500';
  if (score >= 60) return 'text-amber-500';
  return 'text-red-500';
};

const getHealthBg = (score: number) => {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 60) return 'bg-amber-500';
  return 'bg-red-500';
};

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'economic_buyer': return Crown;
    case 'technical_approver': return Shield;
    case 'influencer': return Star;
    case 'gatekeeper': return UserCheck;
    case 'champion': return Target;
    default: return Users;
  }
};

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'economic_buyer': return 'bg-purple-500/10 text-purple-600 border-purple-200';
    case 'technical_approver': return 'bg-blue-500/10 text-blue-600 border-blue-200';
    case 'influencer': return 'bg-amber-500/10 text-amber-600 border-amber-200';
    case 'gatekeeper': return 'bg-slate-500/10 text-slate-600 border-slate-200';
    case 'champion': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getStrengthColor = (strength: string) => {
  switch (strength) {
    case 'strong': return 'text-emerald-500';
    case 'warm': return 'text-amber-500';
    case 'cold': return 'text-blue-400';
    case 'advocate': return 'text-purple-500';
    default: return 'text-muted-foreground';
  }
};

const formatCurrency = (value: number) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  return `₹${value.toLocaleString('en-IN')}`;
};

export default function AccountMap() {
  const [searchParams] = useSearchParams();
  const accountParam = searchParams.get('account');
  
  // Find account by name from URL param, or use first account
  const initialAccount = accountParam 
    ? sampleAccounts.find(a => a.name.toLowerCase() === accountParam.toLowerCase()) || sampleAccounts[0]
    : sampleAccounts[0];
  
  const [selectedAccountId, setSelectedAccountId] = useState(initialAccount?.id || '');
  
  // Dialog states
  const [opportunityDialogOpen, setOpportunityDialogOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  
  // Update selection when URL param changes
  useEffect(() => {
    if (accountParam) {
      const found = sampleAccounts.find(a => a.name.toLowerCase() === accountParam.toLowerCase());
      if (found) {
        setSelectedAccountId(found.id);
      }
    }
  }, [accountParam]);
  
  const selectedAccount = sampleAccounts.find(a => a.id === selectedAccountId) || sampleAccounts[0];
  const accountStakeholders = sampleStakeholders.filter(s => s.accountId === selectedAccountId);
  const accountOpportunities = sampleOpportunities.filter(o => o.accountId === selectedAccountId);
  const accountActivities = sampleActivities.filter(a => a.accountId === selectedAccountId);

  // Handlers for dialogs
  const handleSaveOpportunity = (data: OpportunityData) => {
    toast.success(`Opportunity "${data.name}" created for ${selectedAccount.name}`);
    setOpportunityDialogOpen(false);
  };

  const handleSaveContact = (contact: any) => {
    toast.success(`Contact "${contact.name}" added to ${selectedAccount.name}`);
    setContactDialogOpen(false);
  };

  const handleSaveActivity = (activity: any) => {
    toast.success(`Activity logged for ${selectedAccount.name}`);
    setActivityDialogOpen(false);
  };

  return (
    <AppLayout title="Account Map">
      {/* Account Selector */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select an account" />
            </SelectTrigger>
            <SelectContent>
              {sampleAccounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {account.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="outline" className={cn(
            selectedAccount.classification === 'strategic' && 'bg-purple-500/10 text-purple-600 border-purple-200',
            selectedAccount.classification === 'key' && 'bg-blue-500/10 text-blue-600 border-blue-200',
          )}>
            {selectedAccount.classification.toUpperCase()}
          </Badge>
          <Badge variant="outline" className={cn(
            selectedAccount.status === 'active' && 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
          )}>
            {selectedAccount.status.toUpperCase()}
          </Badge>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Quick Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setOpportunityDialogOpen(true)}>
                <Target className="h-4 w-4 mr-2" />
                New Opportunity
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setContactDialogOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Contact
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActivityDialogOpen(true)}>
                <ClipboardList className="h-4 w-4 mr-2" />
                Log Activity
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            View History
          </Button>
        </div>
      </div>

      {/* Health Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Health Score</p>
                <p className={cn("text-3xl font-bold", getHealthColor(selectedAccount.healthScore))}>
                  {selectedAccount.healthScore}
                </p>
              </div>
              <div className={cn("p-3 rounded-full", getHealthBg(selectedAccount.healthScore) + '/10')}>
                <Gauge className={cn("h-6 w-6", getHealthColor(selectedAccount.healthScore))} />
              </div>
            </div>
            <Progress value={selectedAccount.healthScore} className="mt-3 h-1.5" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Engagement</p>
                <p className="text-3xl font-bold text-blue-500">{selectedAccount.engagementScore}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500/10">
                <Activity className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <Progress value={selectedAccount.engagementScore} className="mt-3 h-1.5" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pipeline Value</p>
                <p className="text-3xl font-bold text-primary">
                  {formatCurrency(selectedAccount.activePipelineValue)}
                </p>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {selectedAccount.activePipelineCount} active opportunities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Lifetime Value</p>
                <p className="text-3xl font-bold text-emerald-500">
                  {formatCurrency(selectedAccount.lifetimeValue)}
                </p>
              </div>
              <div className="p-3 rounded-full bg-emerald-500/10">
                <DollarSign className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Win rate: {selectedAccount.winRate}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Account Details */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Account Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Legal Name</p>
                    <p className="font-medium">{selectedAccount.legalName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Industry</p>
                    <p className="font-medium">{selectedAccount.industry} / {selectedAccount.subIndustry}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Annual Revenue</p>
                    <p className="font-medium">{selectedAccount.annualRevenue}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Employees</p>
                    <p className="font-medium">{selectedAccount.employeeCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Account Owner</p>
                    <p className="font-medium">{selectedAccount.ownerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Region / Territory</p>
                    <p className="font-medium">{selectedAccount.region} / {selectedAccount.territory}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">GSTIN</p>
                    <p className="font-medium font-mono text-sm">{selectedAccount.gstin || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fiscal Year End</p>
                    <p className="font-medium">{selectedAccount.fiscalYearEnd}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm">Total Wins</span>
                  </div>
                  <span className="font-bold text-emerald-500">{selectedAccount.totalWins}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Total Losses</span>
                  </div>
                  <span className="font-bold text-red-500">{selectedAccount.totalLosses}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Avg Sales Cycle</span>
                  </div>
                  <span className="font-bold">{selectedAccount.avgSalesCycle} days</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="text-sm">Avg Deal Size</span>
                  </div>
                  <span className="font-bold">{formatCurrency(selectedAccount.avgDealSize)}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Payment Score</span>
                  <div className="flex items-center gap-2">
                    <Progress value={selectedAccount.paymentBehaviorScore} className="w-20 h-2" />
                    <span className="font-medium">{selectedAccount.paymentBehaviorScore}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Stakeholders Preview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Key Stakeholders
              </CardTitle>
              <Button variant="ghost" size="sm">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {accountStakeholders.slice(0, 3).map((stakeholder) => {
                  const RoleIcon = getRoleIcon(stakeholder.primaryRole);
                  return (
                    <div key={stakeholder.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {stakeholder.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{stakeholder.name}</p>
                          <p className="text-sm text-muted-foreground truncate">{stakeholder.title}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className={cn("text-xs", getRoleBadgeColor(stakeholder.primaryRole))}>
                              <RoleIcon className="h-3 w-3 mr-1" />
                              {stakeholder.primaryRole.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-amber-500" />
                              <span className="text-xs">{stakeholder.influenceScore}/10</span>
                            </div>
                            <span className={cn("text-xs font-medium", getStrengthColor(stakeholder.relationshipStrength))}>
                              {stakeholder.relationshipStrength}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Active Opportunities Preview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Active Opportunities
              </CardTitle>
              <Button variant="ghost" size="sm">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Opportunity</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Probability</TableHead>
                    <TableHead>Close Date</TableHead>
                    <TableHead>Days in Stage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accountOpportunities.map((opp) => {
                    const stage = defaultSalesStages.find(s => s.id === opp.stageId);
                    const isOverdue = opp.daysInCurrentStage > (stage?.warningThreshold || 21);
                    return (
                      <TableRow key={opp.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{opp.name}</p>
                            <p className="text-xs text-muted-foreground">{opp.dealType.replace('_', ' ')}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            style={{ borderColor: stage?.color, color: stage?.color }}
                          >
                            {opp.stageName}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{formatCurrency(opp.dealSize)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={opp.probability} className="w-16 h-2" />
                            <span className="text-sm">{opp.probability}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {opp.expectedCloseDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </TableCell>
                        <TableCell>
                          <span className={cn(
                            "font-medium",
                            isOverdue && "text-amber-500"
                          )}>
                            {opp.daysInCurrentStage} days
                            {isOverdue && <AlertTriangle className="h-3 w-3 inline ml-1" />}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stakeholders Tab */}
        <TabsContent value="stakeholders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5 text-primary" />
                Stakeholder Influence Map
              </CardTitle>
              <CardDescription>
                Visualize relationships and influence across the organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {accountStakeholders.map((stakeholder) => {
                  const RoleIcon = getRoleIcon(stakeholder.primaryRole);
                  return (
                    <Card key={stakeholder.id} className="relative overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 w-1 h-full" 
                        style={{ backgroundColor: stakeholder.decisionAuthority === 'final' ? '#8B5CF6' : stakeholder.decisionAuthority === 'strong_influence' ? '#3B82F6' : '#9CA3AF' }}
                      />
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {stakeholder.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">{stakeholder.name}</p>
                              <p className="text-sm text-muted-foreground">{stakeholder.title}</p>
                              <p className="text-xs text-muted-foreground">{stakeholder.department}</p>
                            </div>
                          </div>
                          {stakeholder.isDecisionMaker && (
                            <Crown className="h-5 w-5 text-amber-500" />
                          )}
                        </div>

                        <div className="mt-4 space-y-3">
                          <div className="flex flex-wrap gap-1">
                            {stakeholder.roles.map((role) => (
                              <Badge key={role} variant="outline" className={cn("text-xs", getRoleBadgeColor(role))}>
                                {role.replace('_', ' ')}
                              </Badge>
                            ))}
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-muted-foreground text-xs">Power</p>
                              <div className="flex items-center gap-1">
                                <Progress value={stakeholder.powerScore * 10} className="h-1.5 flex-1" />
                                <span className="font-medium">{stakeholder.powerScore}</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Influence</p>
                              <div className="flex items-center gap-1">
                                <Progress value={stakeholder.influenceScore * 10} className="h-1.5 flex-1" />
                                <span className="font-medium">{stakeholder.influenceScore}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t">
                            <span className={cn("text-sm font-medium", getStrengthColor(stakeholder.relationshipStrength))}>
                              {stakeholder.relationshipStrength} relationship
                            </span>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Phone className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Mail className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Calendar className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Opportunities Tab */}
        <TabsContent value="opportunities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Opportunity Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Sales Stage Pipeline Visual */}
              <div className="mb-6">
                <div className="flex items-center gap-1 overflow-x-auto pb-2">
                  {defaultSalesStages.filter(s => s.category !== 'closing' || s.code === 'WON').slice(0, 8).map((stage, index) => {
                    const stageOpps = accountOpportunities.filter(o => o.stageId === stage.id);
                    const stageValue = stageOpps.reduce((sum, o) => sum + o.dealSize, 0);
                    return (
                      <div key={stage.id} className="flex-1 min-w-[100px]">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ backgroundColor: stage.color + '40' }}
                        >
                          <div 
                            className="h-full rounded-full transition-all"
                            style={{ 
                              backgroundColor: stage.color,
                              width: stageOpps.length > 0 ? '100%' : '0%'
                            }}
                          />
                        </div>
                        <div className="mt-2 text-center">
                          <p className="text-xs font-medium truncate">{stage.name}</p>
                          <p className="text-lg font-bold" style={{ color: stage.color }}>
                            {stageOpps.length}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {stageValue > 0 ? formatCurrency(stageValue) : '-'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Opportunities List */}
              <div className="space-y-4">
                {accountOpportunities.map((opp) => {
                  const stage = defaultSalesStages.find(s => s.id === opp.stageId);
                  return (
                    <div key={opp.id} className="p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{opp.name}</h4>
                            {opp.isStrategicDeal && (
                              <Badge variant="outline" className="bg-purple-500/10 text-purple-600">
                                Strategic
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {opp.dealType.replace('_', ' ')} • Created {opp.createdDate.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-primary">{formatCurrency(opp.dealSize)}</p>
                          <p className="text-sm text-muted-foreground">
                            Weighted: {formatCurrency(opp.weightedValue)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Stage</p>
                          <Badge variant="outline" style={{ borderColor: stage?.color, color: stage?.color }}>
                            {opp.stageName}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Probability</p>
                          <p className="font-medium">{opp.probability}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Expected Close</p>
                          <p className="font-medium">
                            {opp.expectedCloseDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Forecast</p>
                          <Badge variant="secondary">{opp.forecastCategory.replace('_', ' ')}</Badge>
                        </div>
                      </div>

                      {opp.competitors.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-xs text-muted-foreground mb-2">Competition</p>
                          <div className="flex gap-2">
                            {opp.competitors.map((comp) => (
                              <Badge 
                                key={comp.name} 
                                variant="outline"
                                className={cn(
                                  comp.threat === 'high' && 'border-red-200 bg-red-50 text-red-600',
                                  comp.threat === 'medium' && 'border-amber-200 bg-amber-50 text-amber-600',
                                  comp.threat === 'low' && 'border-green-200 bg-green-50 text-green-600',
                                )}
                              >
                                {comp.name} ({comp.threat})
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {accountActivities.map((activity) => (
                    <div key={activity.id} className="flex gap-4 p-4 border rounded-lg">
                      <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0",
                        activity.type === 'meeting' && 'bg-blue-500/10 text-blue-500',
                        activity.type === 'call' && 'bg-green-500/10 text-green-500',
                        activity.type === 'email' && 'bg-purple-500/10 text-purple-500',
                        activity.type === 'demo' && 'bg-amber-500/10 text-amber-500',
                      )}>
                        {activity.type === 'meeting' && <Users className="h-5 w-5" />}
                        {activity.type === 'call' && <Phone className="h-5 w-5" />}
                        {activity.type === 'email' && <Mail className="h-5 w-5" />}
                        {activity.type === 'demo' && <Briefcase className="h-5 w-5" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{activity.subject}</p>
                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                          </div>
                          <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                            {activity.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{activity.scheduledDate.toLocaleDateString()}</span>
                          <span>{activity.duration} min</span>
                          <span>{activity.ownerName}</span>
                        </div>
                        {activity.outcome && (
                          <div className="mt-2">
                            <Badge 
                              variant="outline"
                              className={cn(
                                activity.outcome === 'positive' && 'bg-green-50 text-green-600 border-green-200',
                                activity.outcome === 'negative' && 'bg-red-50 text-red-600 border-red-200',
                                activity.outcome === 'neutral' && 'bg-gray-50 text-gray-600 border-gray-200',
                              )}
                            >
                              {activity.outcome}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contracts Tab */}
        <TabsContent value="contracts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Contracts & Agreements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-medium">Active Contracts</p>
                    <Badge className="bg-emerald-500">{formatCurrency(selectedAccount.activeContractValue)}</Badge>
                  </div>
                  <Progress value={75} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Next renewal: {selectedAccount.nextRenewalDate?.toLocaleDateString() || 'N/A'}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-medium">Total Contract Value</p>
                    <Badge variant="outline">{formatCurrency(selectedAccount.totalContractValue)}</Badge>
                  </div>
                  <Progress value={100} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Outstanding: {formatCurrency(selectedAccount.outstandingReceivables)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg">
                  <ArrowUpRight className="h-5 w-5 text-emerald-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-emerald-700">Strong executive relationship</p>
                    <p className="text-sm text-emerald-600">CTO relationship score is 10/10</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg">
                  <ArrowUpRight className="h-5 w-5 text-emerald-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-emerald-700">High win rate</p>
                    <p className="text-sm text-emerald-600">80% win rate vs 65% average</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Risks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                  <ArrowDownRight className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-700">Stalled opportunity</p>
                    <p className="text-sm text-amber-600">Digital Platform deal in stage for 45 days</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                  <ArrowDownRight className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-700">Competitor presence</p>
                    <p className="text-sm text-amber-600">Medium threat from Competitor A</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <AddOpportunityDialog
        open={opportunityDialogOpen}
        onOpenChange={setOpportunityDialogOpen}
        onSave={handleSaveOpportunity}
        editData={{ 
          name: '', 
          account: selectedAccount.name, 
          value: '', 
          stage: 'Prospecting', 
          probability: '20%', 
          owner: selectedAccount.ownerName 
        }}
      />
      
      <AddContactDialog
        open={contactDialogOpen}
        onOpenChange={setContactDialogOpen}
        onSave={handleSaveContact}
        mode="create"
        defaultAccount={selectedAccount.name}
      />
      
      <LogActivityDialog
        open={activityDialogOpen}
        onOpenChange={setActivityDialogOpen}
        onSave={handleSaveActivity}
        defaultAccount={selectedAccount.name}
        accountContacts={accountStakeholders.map(s => s.name)}
      />
    </AppLayout>
  );
}
