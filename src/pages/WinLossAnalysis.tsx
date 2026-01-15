import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { 
  Trophy, 
  XCircle, 
  TrendingUp, 
  TrendingDown, 
  Target,
  Users,
  Building2,
  DollarSign,
  Calendar,
  AlertTriangle,
  Lightbulb,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock win/loss data
const winLossData = {
  summary: {
    totalDeals: 156,
    wins: 89,
    losses: 52,
    abandoned: 15,
    winRate: 57.1,
    avgWinSize: 285000,
    avgLossSize: 195000,
    avgWinCycle: 45,
    avgLossCycle: 62,
  },
  trend: [
    { month: 'Jul', wins: 12, losses: 8, winRate: 60 },
    { month: 'Aug', wins: 15, losses: 10, winRate: 60 },
    { month: 'Sep', wins: 18, losses: 9, winRate: 67 },
    { month: 'Oct', wins: 14, losses: 11, winRate: 56 },
    { month: 'Nov', wins: 16, losses: 7, winRate: 70 },
    { month: 'Dec', wins: 14, losses: 7, winRate: 67 },
  ],
  lossReasons: [
    { reason: 'Price', count: 18, percentage: 34.6, value: 3200000 },
    { reason: 'Competition', count: 14, percentage: 26.9, value: 2800000 },
    { reason: 'Product Fit', count: 8, percentage: 15.4, value: 1500000 },
    { reason: 'Budget Constraints', count: 6, percentage: 11.5, value: 1100000 },
    { reason: 'Timing', count: 4, percentage: 7.7, value: 600000 },
    { reason: 'Internal Gaps', count: 2, percentage: 3.8, value: 400000 },
  ],
  competitorAnalysis: [
    { competitor: 'Salesforce', wins: 8, losses: 12, winRate: 40, avgDealSize: 320000 },
    { competitor: 'HubSpot', wins: 14, losses: 6, winRate: 70, avgDealSize: 180000 },
    { competitor: 'Microsoft Dynamics', wins: 6, losses: 8, winRate: 43, avgDealSize: 280000 },
    { competitor: 'Zoho', wins: 18, losses: 4, winRate: 82, avgDealSize: 120000 },
    { competitor: 'No Competition', wins: 43, losses: 0, winRate: 100, avgDealSize: 250000 },
  ],
  byStage: [
    { stage: 'Prospecting', wins: 89, losses: 52, total: 200, winRate: 44.5 },
    { stage: 'Qualification', wins: 89, losses: 35, total: 156, winRate: 57.1 },
    { stage: 'Proposal', wins: 89, losses: 22, total: 120, winRate: 74.2 },
    { stage: 'Negotiation', wins: 89, losses: 8, total: 98, winRate: 90.8 },
    { stage: 'Closing', wins: 89, losses: 3, total: 92, winRate: 96.7 },
  ],
  recentDeals: [
    { id: 'OPP-101', name: 'Enterprise Suite - TechCorp', result: 'won', value: 450000, competitor: 'Salesforce', reason: null, closeDate: '2024-12-10' },
    { id: 'OPP-102', name: 'Cloud Migration - FinServ', result: 'lost', value: 320000, competitor: 'Microsoft Dynamics', reason: 'Price', closeDate: '2024-12-08' },
    { id: 'OPP-103', name: 'Analytics Platform - RetailMax', result: 'won', value: 180000, competitor: 'HubSpot', reason: null, closeDate: '2024-12-05' },
    { id: 'OPP-104', name: 'CRM Implementation - MedHealth', result: 'lost', value: 280000, competitor: 'Salesforce', reason: 'Product Fit', closeDate: '2024-12-03' },
    { id: 'OPP-105', name: 'Sales Automation - LogiTrans', result: 'won', value: 220000, competitor: null, reason: null, closeDate: '2024-11-28' },
  ],
  insights: [
    { type: 'positive', title: 'Strong Win Rate Against HubSpot', description: 'We win 70% of deals when competing with HubSpot. Leverage this in competitive situations.' },
    { type: 'warning', title: 'Price Sensitivity Issue', description: 'Price is cited in 35% of losses. Consider value-based selling training or flexible pricing options.' },
    { type: 'positive', title: 'High Conversion in Negotiation', description: 'Once deals reach Negotiation stage, win rate jumps to 91%. Focus on getting more deals to this stage.' },
    { type: 'negative', title: 'Salesforce Competition Struggles', description: 'Only 40% win rate against Salesforce. Develop competitive battle cards and differentiators.' },
  ],
};

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const formatCurrency = (value: number) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  return `₹${value.toLocaleString()}`;
};

export default function WinLossAnalysis() {
  const [period, setPeriod] = useState('Q4-2024');
  const [tab, setTab] = useState('overview');

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Win/Loss Analysis</h1>
                <p className="text-muted-foreground mt-1">
                  Competitive intelligence and deal outcome analytics
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
                    <SelectItem value="H2-2024">H2 2024</SelectItem>
                    <SelectItem value="FY-2024">FY 2024</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">Export Report</Button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Win Rate</p>
                      <p className="text-2xl font-bold text-emerald-600">{winLossData.summary.winRate}%</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-emerald-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Wins</p>
                      <p className="text-2xl font-bold">{winLossData.summary.wins}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-emerald-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Losses</p>
                      <p className="text-2xl font-bold">{winLossData.summary.losses}</p>
                    </div>
                    <TrendingDown className="h-8 w-8 text-destructive" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Win Size</p>
                      <p className="text-2xl font-bold">{formatCurrency(winLossData.summary.avgWinSize)}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Win Cycle</p>
                      <p className="text-2xl font-bold">{winLossData.summary.avgWinCycle} days</p>
                    </div>
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="reasons">Loss Reasons</TabsTrigger>
                <TabsTrigger value="competition">Competition</TabsTrigger>
                <TabsTrigger value="deals">Recent Deals</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Win Rate Trend */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Win Rate Trend</CardTitle>
                      <CardDescription>Monthly win/loss performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={winLossData.trend}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="month" className="text-xs" />
                            <YAxis className="text-xs" />
                            <Tooltip 
                              contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                            />
                            <Legend />
                            <Bar dataKey="wins" fill="#10b981" name="Wins" />
                            <Bar dataKey="losses" fill="#ef4444" name="Losses" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Stage Conversion */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Stage Conversion Funnel</CardTitle>
                      <CardDescription>Win rate by sales stage</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {winLossData.byStage.map((stage) => (
                          <div key={stage.stage} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>{stage.stage}</span>
                              <span className="font-medium">{stage.winRate.toFixed(1)}%</span>
                            </div>
                            <div className="h-3 bg-muted rounded-full overflow-hidden flex">
                              <div 
                                className="bg-emerald-500 h-full"
                                style={{ width: `${(stage.wins / stage.total) * 100}%` }}
                              />
                              <div 
                                className="bg-destructive h-full"
                                style={{ width: `${(stage.losses / stage.total) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-amber-500" />
                      Key Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {winLossData.insights.map((insight, idx) => (
                        <div 
                          key={idx}
                          className={cn(
                            "p-4 rounded-lg border",
                            insight.type === 'positive' && "bg-emerald-500/5 border-emerald-500/20",
                            insight.type === 'warning' && "bg-amber-500/5 border-amber-500/20",
                            insight.type === 'negative' && "bg-destructive/5 border-destructive/20"
                          )}
                        >
                          <h4 className="font-medium flex items-center gap-2">
                            {insight.type === 'positive' && <TrendingUp className="h-4 w-4 text-emerald-500" />}
                            {insight.type === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                            {insight.type === 'negative' && <TrendingDown className="h-4 w-4 text-destructive" />}
                            {insight.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reasons" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Loss Reasons Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Loss Reason Distribution</CardTitle>
                      <CardDescription>Primary reasons for lost deals</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={winLossData.lossReasons}
                              cx="50%"
                              cy="50%"
                              outerRadius={100}
                              dataKey="count"
                              label={({ reason, percentage }) => `${reason}: ${percentage}%`}
                            >
                              {winLossData.lossReasons.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Loss Reasons Table */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Loss Reason Details</CardTitle>
                      <CardDescription>Revenue impact by reason</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Reason</TableHead>
                            <TableHead className="text-right">Count</TableHead>
                            <TableHead className="text-right">% of Losses</TableHead>
                            <TableHead className="text-right">Lost Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {winLossData.lossReasons.map((reason) => (
                            <TableRow key={reason.reason}>
                              <TableCell className="font-medium">{reason.reason}</TableCell>
                              <TableCell className="text-right">{reason.count}</TableCell>
                              <TableCell className="text-right">{reason.percentage}%</TableCell>
                              <TableCell className="text-right text-destructive">{formatCurrency(reason.value)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="competition" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Competitive Win Rates
                    </CardTitle>
                    <CardDescription>Performance against key competitors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Competitor</TableHead>
                          <TableHead className="text-right">Wins</TableHead>
                          <TableHead className="text-right">Losses</TableHead>
                          <TableHead className="text-right">Win Rate</TableHead>
                          <TableHead className="text-right">Avg Deal Size</TableHead>
                          <TableHead>Performance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {winLossData.competitorAnalysis.map((comp) => (
                          <TableRow key={comp.competitor}>
                            <TableCell className="font-medium">{comp.competitor}</TableCell>
                            <TableCell className="text-right text-emerald-600">{comp.wins}</TableCell>
                            <TableCell className="text-right text-destructive">{comp.losses}</TableCell>
                            <TableCell className="text-right font-medium">{comp.winRate}%</TableCell>
                            <TableCell className="text-right">{formatCurrency(comp.avgDealSize)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress 
                                  value={comp.winRate} 
                                  className={cn(
                                    "w-20 h-2",
                                    comp.winRate >= 60 ? "[&>div]:bg-emerald-500" : 
                                    comp.winRate >= 40 ? "[&>div]:bg-amber-500" : "[&>div]:bg-destructive"
                                  )}
                                />
                                <Badge 
                                  variant={comp.winRate >= 60 ? "default" : comp.winRate >= 40 ? "secondary" : "destructive"}
                                >
                                  {comp.winRate >= 60 ? 'Strong' : comp.winRate >= 40 ? 'Even' : 'Weak'}
                                </Badge>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="deals" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Closed Deals</CardTitle>
                    <CardDescription>Latest wins and losses with details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Opportunity</TableHead>
                          <TableHead>Result</TableHead>
                          <TableHead className="text-right">Value</TableHead>
                          <TableHead>Competitor</TableHead>
                          <TableHead>Loss Reason</TableHead>
                          <TableHead>Close Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {winLossData.recentDeals.map((deal) => (
                          <TableRow key={deal.id}>
                            <TableCell className="font-medium">{deal.name}</TableCell>
                            <TableCell>
                              <Badge variant={deal.result === 'won' ? 'default' : 'destructive'}>
                                {deal.result === 'won' ? (
                                  <><Trophy className="h-3 w-3 mr-1" /> Won</>
                                ) : (
                                  <><XCircle className="h-3 w-3 mr-1" /> Lost</>
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(deal.value)}</TableCell>
                            <TableCell>{deal.competitor || '—'}</TableCell>
                            <TableCell>{deal.reason || '—'}</TableCell>
                            <TableCell>{new Date(deal.closeDate).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
