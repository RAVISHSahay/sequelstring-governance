import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  DollarSign,
  AlertTriangle,
  Medal,
  Trophy,
  ArrowUpRight,
  ArrowDownRight,
  Download,
} from "lucide-react";
import {
  mockSalespersonPerformance,
  mockTeamPerformance,
  incentiveSummaryStats,
} from "@/data/mockIncentiveData";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const formatCurrency = (value: number) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  return `₹${value.toLocaleString()}`;
};

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

export default function Performance() {
  const [selectedPeriod, setSelectedPeriod] = useState("Q1 2024");
  const [selectedView, setSelectedView] = useState("individual");

  // Prepare chart data
  const teamChartData = mockTeamPerformance.map(team => ({
    name: team.teamName,
    target: team.totalTarget / 10000000,
    achieved: team.totalAchieved / 10000000,
    achievement: team.achievementPercentage,
  }));

  const discountPayoutData = mockTeamPerformance.map(team => ({
    name: team.teamName,
    discount: team.avgDiscount,
    payout: team.avgPayout / 100000,
  }));

  const pieData = mockTeamPerformance.map(team => ({
    name: team.teamName,
    value: team.incentiveLiability,
  }));

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-success" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <ArrowUpRight className="h-4 w-4 text-muted-foreground" />;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-amber-500 text-white"><Trophy className="h-3 w-3 mr-1" />1st</Badge>;
    if (rank === 2) return <Badge className="bg-gray-400 text-white"><Medal className="h-3 w-3 mr-1" />2nd</Badge>;
    if (rank === 3) return <Badge className="bg-amber-700 text-white"><Medal className="h-3 w-3 mr-1" />3rd</Badge>;
    return <Badge variant="outline">#{rank}</Badge>;
  };

  return (
    <AppLayout title="Performance Dashboard">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Performance Dashboard</h1>
            <p className="text-muted-foreground">
              Real-time performance tracking and incentive analytics
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Q1 2024">Q1 2024</SelectItem>
                <SelectItem value="Q2 2024">Q2 2024</SelectItem>
                <SelectItem value="FY2024">FY2024</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Leadership Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="stat-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Achievement</p>
                  <p className="text-2xl font-bold">{incentiveSummaryStats.avgAchievementRate}%</p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-3 w-3 text-success" />
                    <span className="text-xs text-success">+3.2% vs last period</span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Target className="h-5 w-5 text-success" />
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
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-3 w-3 text-warning" />
                    <span className="text-xs text-muted-foreground">Accrued this period</span>
                  </div>
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
                  <p className="text-sm text-muted-foreground">Top Performer</p>
                  <p className="text-2xl font-bold">{formatCurrency(incentiveSummaryStats.topPerformerEarnings)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Trophy className="h-3 w-3 text-amber-500" />
                    <span className="text-xs text-muted-foreground">YTD Earnings</span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card border-l-4 border-l-destructive">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Commission Leakage</p>
                  <p className="text-2xl font-bold text-destructive">₹2.03 L</p>
                  <div className="flex items-center gap-1 mt-1">
                    <AlertTriangle className="h-3 w-3 text-destructive" />
                    <span className="text-xs text-destructive">Due to over-discounting</span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedView} onValueChange={setSelectedView}>
          <TabsList>
            <TabsTrigger value="individual">Individual Performance</TabsTrigger>
            <TabsTrigger value="team">Team Performance</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="individual" className="space-y-4">
            {/* Salesperson Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle>Salesperson Leaderboard</CardTitle>
                <CardDescription>Individual performance with target achievement and expected payouts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSalespersonPerformance.map((person) => (
                    <Card key={person.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
                              {person.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{person.name}</h3>
                                {getRankBadge(person.rank)}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {person.teamName} • {person.region}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Expected Payout</p>
                            <p className="text-xl font-bold text-success">{formatCurrency(person.expectedPayout)}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Pipeline Contribution</p>
                            <p className="font-semibold">{formatCurrency(person.pipelineContribution)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">YTD Earnings</p>
                            <p className="font-semibold">{formatCurrency(person.ytdEarnings)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Commission Leakage</p>
                            <p className="font-semibold text-destructive">-{formatCurrency(person.commissionLeakage)}</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {person.targets.map((target) => (
                            <div key={target.targetId}>
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{target.targetName}</span>
                                  {getTrendIcon(target.trend)}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-muted-foreground">
                                    {target.type === 'revenue' || target.type === 'booking' 
                                      ? formatCurrency(target.achieved)
                                      : target.achieved} / {target.type === 'revenue' || target.type === 'booking'
                                      ? formatCurrency(target.target)
                                      : target.target}
                                  </span>
                                  <Badge variant={target.percentage >= 100 ? 'default' : 'outline'} className={target.percentage >= 100 ? 'bg-success' : ''}>
                                    {target.percentage.toFixed(1)}%
                                  </Badge>
                                </div>
                              </div>
                              <Progress value={Math.min(target.percentage, 100)} className="h-2" />
                              <p className="text-xs text-muted-foreground mt-1">
                                {target.daysRemaining} days remaining
                              </p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            {/* Team Performance Table */}
            <Card>
              <CardHeader>
                <CardTitle>Team Performance Summary</CardTitle>
                <CardDescription>Aggregate performance by team with margin and discount analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="table-header">
                      <TableHead>Team</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead className="text-right">Target</TableHead>
                      <TableHead className="text-right">Achieved</TableHead>
                      <TableHead>Achievement</TableHead>
                      <TableHead className="text-right">Incentive Liability</TableHead>
                      <TableHead className="text-right">Avg Discount</TableHead>
                      <TableHead className="text-right">Margin Erosion</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTeamPerformance.map((team) => (
                      <TableRow key={team.teamId}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{team.teamName}</p>
                            <p className="text-sm text-muted-foreground">{team.region}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            {team.memberCount}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(team.totalTarget)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(team.totalAchieved)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={Math.min(team.achievementPercentage, 100)}
                              className="h-2 w-20"
                            />
                            <span className={`text-sm font-medium ${
                              team.achievementPercentage >= 90 ? 'text-success' :
                              team.achievementPercentage >= 70 ? 'text-chart-4' :
                              'text-warning'
                            }`}>
                              {team.achievementPercentage.toFixed(1)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-warning">
                          {formatCurrency(team.incentiveLiability)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={team.avgDiscount > 10 ? 'destructive' : 'outline'}>
                            {team.avgDiscount}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-destructive">
                          -{formatCurrency(team.marginErosion)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Team Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Target vs Achievement by Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={teamChartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                          formatter={(value: number) => [`₹${value} Cr`, '']}
                        />
                        <Bar dataKey="target" fill="hsl(var(--muted-foreground))" name="Target" />
                        <Bar dataKey="achieved" fill="hsl(var(--primary))" name="Achieved" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Incentive Liability Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                        >
                          {pieData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => [formatCurrency(value), 'Liability']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            {/* Discount vs Payout Correlation */}
            <Card>
              <CardHeader>
                <CardTitle>Discount vs Payout Correlation</CardTitle>
                <CardDescription>
                  Analysis of discounting behavior and its impact on commission payouts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={discountPayoutData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" className="text-xs" />
                      <YAxis yAxisId="left" className="text-xs" />
                      <YAxis yAxisId="right" orientation="right" className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Bar yAxisId="left" dataKey="discount" fill="hsl(var(--destructive))" name="Avg Discount %" />
                      <Bar yAxisId="right" dataKey="payout" fill="hsl(var(--success))" name="Avg Payout (₹L)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Key Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-l-4 border-l-success">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Top Insight</h3>
                  <p className="text-sm text-muted-foreground">
                    Enterprise Sales team has the highest achievement rate at 90.67% with moderate discounting (9.5% avg).
                  </p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-warning">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Attention Required</h3>
                  <p className="text-sm text-muted-foreground">
                    Government Sales has 15.8% avg discount - highest across teams. Commission penalties applied.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-chart-4">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Opportunity</h3>
                  <p className="text-sm text-muted-foreground">
                    3 salespeople are within 5% of stretch targets. Accelerator multipliers will apply on achievement.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
