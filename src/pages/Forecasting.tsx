import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Target,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Users,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock forecast data
const forecastData = {
  summary: {
    quota: 5000000,
    closed: 1250000,
    commit: 850000,
    bestCase: 1200000,
    pipeline: 2500000,
    attainment: 25,
    gap: 2700000,
  },
  byCategory: [
    { name: 'Closed Won', value: 1250000, color: '#10b981' },
    { name: 'Commit', value: 850000, color: '#6366f1' },
    { name: 'Best Case', value: 1200000, color: '#f59e0b' },
    { name: 'Pipeline', value: 2500000, color: '#94a3b8' },
  ],
  trend: [
    { period: 'Week 1', closed: 200000, commit: 600000, bestCase: 800000 },
    { period: 'Week 2', closed: 450000, commit: 700000, bestCase: 900000 },
    { period: 'Week 3', closed: 750000, commit: 750000, bestCase: 1000000 },
    { period: 'Week 4', closed: 1250000, commit: 850000, bestCase: 1200000 },
  ],
  byRep: [
    { name: 'Rahul Sharma', quota: 1200000, closed: 450000, commit: 250000, bestCase: 300000, pipeline: 500000, attainment: 37.5 },
    { name: 'Priya Mehta', quota: 1000000, closed: 320000, commit: 180000, bestCase: 280000, pipeline: 450000, attainment: 32 },
    { name: 'Vikram Singh', quota: 1500000, closed: 480000, commit: 320000, bestCase: 420000, pipeline: 800000, attainment: 32 },
    { name: 'Anita Desai', quota: 800000, closed: 0, commit: 100000, bestCase: 200000, pipeline: 400000, attainment: 0 },
    { name: 'Rajesh Kumar', quota: 500000, closed: 0, commit: 0, bestCase: 0, pipeline: 350000, attainment: 0 },
  ],
  atRiskDeals: [
    { id: 'OPP-001', name: 'Enterprise CRM Implementation', account: 'TechCorp India', value: 450000, stage: 'Negotiation', daysStalled: 21, risk: 'high' },
    { id: 'OPP-002', name: 'Cloud Migration Project', account: 'FinServ Ltd', value: 320000, stage: 'Proposal', daysStalled: 14, risk: 'medium' },
    { id: 'OPP-003', name: 'Analytics Platform', account: 'RetailMax', value: 180000, stage: 'Qualification', daysStalled: 28, risk: 'high' },
  ],
  stageDistribution: [
    { stage: 'Prospecting', count: 24, value: 2800000 },
    { stage: 'Qualification', count: 18, value: 1950000 },
    { stage: 'Proposal', count: 12, value: 1400000 },
    { stage: 'Negotiation', count: 6, value: 850000 },
    { stage: 'Closing', count: 3, value: 450000 },
  ],
};

const formatCurrency = (value: number) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  return `₹${value.toLocaleString()}`;
};

export default function Forecasting() {
  const [period, setPeriod] = useState('Q4-2024');
  const [view, setView] = useState<'summary' | 'team' | 'deals'>('summary');

  const gapPercentage = ((forecastData.summary.quota - forecastData.summary.closed - forecastData.summary.commit) / forecastData.summary.quota) * 100;
  const coverageRatio = ((forecastData.summary.closed + forecastData.summary.commit + forecastData.summary.bestCase) / forecastData.summary.quota) * 100;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <Header title="Pipeline Forecasting" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Pipeline Forecasting</h1>
                <p className="text-muted-foreground mt-1">
                  Stage-weighted revenue forecasting and pipeline governance
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-[140px]">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Q4-2024">Q4 2024</SelectItem>
                    <SelectItem value="Q3-2024">Q3 2024</SelectItem>
                    <SelectItem value="Q2-2024">Q2 2024</SelectItem>
                    <SelectItem value="FY-2024">FY 2024</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">Export Report</Button>
              </div>
            </div>

            {/* Forecast Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Closed Won
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-600">
                    {formatCurrency(forecastData.summary.closed)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {forecastData.summary.attainment}% of quota
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border-indigo-500/20">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-indigo-500" />
                    Commit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-indigo-600">
                    {formatCurrency(forecastData.summary.commit)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    High confidence deals
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-amber-500" />
                    Best Case
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-600">
                    {formatCurrency(forecastData.summary.bestCase)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upside potential
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-500/10 to-slate-500/5 border-slate-500/20">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-slate-500" />
                    Pipeline
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-600">
                    {formatCurrency(forecastData.summary.pipeline)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Total open opportunities
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quota Attainment Progress */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Quota Attainment</CardTitle>
                    <CardDescription>Progress toward {formatCurrency(forecastData.summary.quota)} target</CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{coverageRatio.toFixed(0)}%</p>
                    <p className="text-sm text-muted-foreground">Coverage Ratio</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-8 bg-muted rounded-full overflow-hidden flex">
                    <div 
                      className="bg-emerald-500 h-full transition-all"
                      style={{ width: `${(forecastData.summary.closed / forecastData.summary.quota) * 100}%` }}
                    />
                    <div 
                      className="bg-indigo-500 h-full transition-all"
                      style={{ width: `${(forecastData.summary.commit / forecastData.summary.quota) * 100}%` }}
                    />
                    <div 
                      className="bg-amber-500 h-full transition-all"
                      style={{ width: `${(forecastData.summary.bestCase / forecastData.summary.quota) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-emerald-500" />
                        <span>Closed: {formatCurrency(forecastData.summary.closed)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-indigo-500" />
                        <span>Commit: {formatCurrency(forecastData.summary.commit)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-amber-500" />
                        <span>Best Case: {formatCurrency(forecastData.summary.bestCase)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Gap: {formatCurrency(forecastData.summary.gap)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Forecast Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Forecast Trend</CardTitle>
                  <CardDescription>Weekly progression toward quota</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={forecastData.trend}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="period" className="text-xs" />
                        <YAxis tickFormatter={(v) => formatCurrency(v)} className="text-xs" />
                        <Tooltip 
                          formatter={(value: number) => formatCurrency(value)}
                          contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                        />
                        <Area type="monotone" dataKey="closed" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Closed" />
                        <Area type="monotone" dataKey="commit" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} name="Commit" />
                        <Area type="monotone" dataKey="bestCase" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} name="Best Case" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Category Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Forecast Categories</CardTitle>
                  <CardDescription>Pipeline distribution by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={forecastData.byCategory}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                        >
                          {forecastData.byCategory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Team Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Forecast
                </CardTitle>
                <CardDescription>Individual rep performance and forecast</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sales Rep</TableHead>
                      <TableHead className="text-right">Quota</TableHead>
                      <TableHead className="text-right">Closed</TableHead>
                      <TableHead className="text-right">Commit</TableHead>
                      <TableHead className="text-right">Best Case</TableHead>
                      <TableHead className="text-right">Pipeline</TableHead>
                      <TableHead>Progress</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {forecastData.byRep.map((rep) => {
                      const progress = (rep.closed / rep.quota) * 100;
                      const coverage = ((rep.closed + rep.commit + rep.bestCase) / rep.quota) * 100;
                      
                      return (
                        <TableRow key={rep.name}>
                          <TableCell className="font-medium">{rep.name}</TableCell>
                          <TableCell className="text-right">{formatCurrency(rep.quota)}</TableCell>
                          <TableCell className="text-right text-emerald-600">{formatCurrency(rep.closed)}</TableCell>
                          <TableCell className="text-right text-indigo-600">{formatCurrency(rep.commit)}</TableCell>
                          <TableCell className="text-right text-amber-600">{formatCurrency(rep.bestCase)}</TableCell>
                          <TableCell className="text-right text-muted-foreground">{formatCurrency(rep.pipeline)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={progress} className="w-24 h-2" />
                              <span className={cn(
                                "text-sm font-medium",
                                progress >= 50 ? "text-emerald-600" : progress >= 25 ? "text-amber-600" : "text-destructive"
                              )}>
                                {progress.toFixed(0)}%
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* At-Risk Deals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  At-Risk Deals
                </CardTitle>
                <CardDescription>Stalled opportunities requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Opportunity</TableHead>
                      <TableHead>Account</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                      <TableHead className="text-right">Days Stalled</TableHead>
                      <TableHead>Risk</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {forecastData.atRiskDeals.map((deal) => (
                      <TableRow key={deal.id}>
                        <TableCell className="font-medium">{deal.name}</TableCell>
                        <TableCell>{deal.account}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{deal.stage}</Badge>
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(deal.value)}</TableCell>
                        <TableCell className="text-right">
                          <span className="flex items-center justify-end gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {deal.daysStalled}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={deal.risk === 'high' ? 'destructive' : 'secondary'}>
                            {deal.risk}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
