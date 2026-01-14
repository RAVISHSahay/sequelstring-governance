import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Target,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  Globe,
  Package,
  Edit,
  Copy,
  Trash2,
  Eye,
} from "lucide-react";
import { mockTargets, incentiveSummaryStats } from "@/data/mockIncentiveData";
import { Target as TargetType, TargetLevel, TargetType as TargetTypeEnum } from "@/types/incentives";
import { AddTargetDialog } from "@/components/incentives/AddTargetDialog";
import { useToast } from "@/hooks/use-toast";

const levelIcons: Record<TargetLevel, typeof Users> = {
  individual: Users,
  team: Users,
  region: Globe,
  product: Package,
  platform: Building2,
  service_line: Building2,
  key_account: Building2,
  channel_partner: Building2,
};

const levelLabels: Record<TargetLevel, string> = {
  individual: "Individual",
  team: "Team",
  region: "Region",
  product: "Product",
  platform: "Platform",
  service_line: "Service Line",
  key_account: "Key Account",
  channel_partner: "Channel Partner",
};

const typeLabels: Record<TargetTypeEnum, string> = {
  revenue: "Revenue",
  booking: "Booking",
  collection: "Collection",
  margin: "Margin",
  volume: "Volume",
  strategic: "Strategic",
};

const formatCurrency = (value: number) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  return `₹${value.toLocaleString()}`;
};

const formatValue = (value: number, type: TargetTypeEnum) => {
  if (type === 'volume' || type === 'strategic') {
    return value.toLocaleString();
  }
  return formatCurrency(value);
};

export default function Targets() {
  const { toast } = useToast();
  const [targets, setTargets] = useState<TargetType[]>(mockTargets);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState<TargetType | null>(null);

  const filteredTargets = targets.filter((target) => {
    const matchesSearch =
      target.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      target.levelEntityName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === "all" || target.level === selectedLevel;
    const matchesType = selectedType === "all" || target.type === selectedType;
    const matchesPeriod = selectedPeriod === "all" || target.period === selectedPeriod;
    return matchesSearch && matchesLevel && matchesType && matchesPeriod;
  });

  const handleSaveTarget = (data: Partial<TargetType>) => {
    if (editingTarget) {
      setTargets(prev =>
        prev.map(t => t.id === editingTarget.id ? { ...t, ...data } as TargetType : t)
      );
      toast({ title: "Target updated successfully" });
    } else {
      const newTarget: TargetType = {
        id: `TGT-${String(targets.length + 1).padStart(3, '0')}`,
        name: data.name || '',
        level: data.level || 'individual',
        levelEntityId: data.levelEntityId || '',
        levelEntityName: data.levelEntityName || '',
        type: data.type || 'revenue',
        periodicity: data.periodicity || 'quarterly',
        fiscalYear: data.fiscalYear || 'FY2024',
        period: data.period || 'Q1 2024',
        targetValue: data.targetValue || 0,
        weightage: data.weightage || 100,
        minimumThreshold: data.minimumThreshold || 0,
        stretchTarget: data.stretchTarget || 0,
        carryForwardEnabled: data.carryForwardEnabled || false,
        rolloverEnabled: data.rolloverEnabled || false,
        achieved: 0,
        achievementPercentage: 0,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTargets(prev => [...prev, newTarget]);
      toast({ title: "Target created successfully" });
    }
    setEditingTarget(null);
  };

  const handleEdit = (target: TargetType) => {
    setEditingTarget(target);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setTargets(prev => prev.filter(t => t.id !== id));
    toast({ title: "Target deleted successfully" });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success/10 text-success border-0">Active</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'closed':
        return <Badge variant="outline">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getAchievementColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-success';
    if (percentage >= 80) return 'bg-chart-4';
    if (percentage >= 60) return 'bg-warning';
    return 'bg-destructive';
  };

  // Summary stats by level
  const statsByLevel = {
    individual: targets.filter(t => t.level === 'individual').length,
    team: targets.filter(t => t.level === 'team').length,
    region: targets.filter(t => t.level === 'region').length,
    product: targets.filter(t => t.level === 'product').length,
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Sales Targets</h1>
            <p className="text-muted-foreground">
              Manage targets across individuals, teams, regions, and products
            </p>
          </div>
          <Button onClick={() => { setEditingTarget(null); setDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Target
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="stat-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Targets</p>
                  <p className="text-2xl font-bold">{incentiveSummaryStats.totalActiveTargets}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Achievement</p>
                  <p className="text-2xl font-bold">{incentiveSummaryStats.avgAchievementRate}%</p>
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
                  <p className="text-sm text-muted-foreground">Individual Targets</p>
                  <p className="text-2xl font-bold">{statsByLevel.individual}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-chart-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Team/Region Targets</p>
                  <p className="text-2xl font-bold">{statsByLevel.team + statsByLevel.region}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search targets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                  <SelectItem value="region">Region</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="platform">Platform</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="booking">Booking</SelectItem>
                  <SelectItem value="collection">Collection</SelectItem>
                  <SelectItem value="margin">Margin</SelectItem>
                  <SelectItem value="volume">Volume</SelectItem>
                  <SelectItem value="strategic">Strategic</SelectItem>
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
                  <SelectItem value="FY2024">FY2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Targets Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Target List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="table-header">
                  <TableHead>Target</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead className="text-right">Target</TableHead>
                  <TableHead className="text-right">Achieved</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTargets.map((target) => {
                  const LevelIcon = levelIcons[target.level];
                  return (
                    <TableRow key={target.id}>
                      <TableCell>
                        <div className="font-medium">{target.name}</div>
                        <div className="text-xs text-muted-foreground">{target.id}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <LevelIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{levelLabels[target.level]}</span>
                        </div>
                      </TableCell>
                      <TableCell>{target.levelEntityName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{typeLabels[target.type]}</Badge>
                      </TableCell>
                      <TableCell>{target.period}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatValue(target.targetValue, target.type)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatValue(target.achieved, target.type)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <Progress
                            value={Math.min(target.achievementPercentage, 100)}
                            className="h-2 flex-1"
                          />
                          <span className={`text-sm font-medium ${
                            target.achievementPercentage >= 100 ? 'text-success' :
                            target.achievementPercentage >= 80 ? 'text-chart-4' :
                            'text-warning'
                          }`}>
                            {target.achievementPercentage.toFixed(1)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(target.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(target)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Target
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="h-4 w-4 mr-2" />
                              Clone Target
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(target.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Target
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <AddTargetDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveTarget}
        editData={editingTarget}
      />
    </AppLayout>
  );
}
