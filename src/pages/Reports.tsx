import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  DollarSign,
  Target,
  Calendar,
  Download,
  PieChart,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

const reportCategories = [
  {
    title: "Sales Performance",
    description: "Pipeline, revenue, and win rate analytics",
    icon: TrendingUp,
    color: "bg-primary/10 text-primary",
    reports: ["Pipeline Analysis", "Revenue Forecast", "Win/Loss Analysis", "Sales Velocity"],
  },
  {
    title: "Account Analytics",
    description: "Account health and engagement metrics",
    icon: Users,
    color: "bg-info/10 text-info",
    reports: ["Account Health Score", "Engagement Trends", "Revenue by Account", "Churn Risk"],
  },
  {
    title: "Quote & Pricing",
    description: "Quote performance and discount analysis",
    icon: FileText,
    color: "bg-accent/10 text-accent",
    reports: ["Quote Conversion", "Discount Analysis", "Pricing Trends", "Approval Metrics"],
  },
  {
    title: "Revenue Operations",
    description: "Forecast accuracy and revenue metrics",
    icon: DollarSign,
    color: "bg-success/10 text-success",
    reports: ["Forecast Accuracy", "ARR/MRR Trends", "Revenue Recognition", "Margin Analysis"],
  },
];

const quickReports = [
  { name: "MTD Pipeline Summary", lastRun: "2 hours ago" },
  { name: "Weekly Sales Activity", lastRun: "Yesterday" },
  { name: "Quarterly Forecast", lastRun: "3 days ago" },
  { name: "Top Accounts by Revenue", lastRun: "1 week ago" },
];

export default function Reports() {
  return (
    <AppLayout title="Reports & Analytics">
      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="stat-card animate-slide-up cursor-pointer hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <span className="font-semibold">Pipeline Dashboard</span>
          </div>
          <p className="text-sm text-muted-foreground">Real-time pipeline visibility</p>
        </div>
        <div className="stat-card animate-slide-up cursor-pointer hover:border-primary/30 transition-colors" style={{ animationDelay: "0.05s" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Target className="h-5 w-5 text-accent" />
            </div>
            <span className="font-semibold">Forecast Report</span>
          </div>
          <p className="text-sm text-muted-foreground">Q1 2025 revenue forecast</p>
        </div>
        <div className="stat-card animate-slide-up cursor-pointer hover:border-primary/30 transition-colors" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Activity className="h-5 w-5 text-success" />
            </div>
            <span className="font-semibold">Activity Report</span>
          </div>
          <p className="text-sm text-muted-foreground">Team performance metrics</p>
        </div>
        <div className="stat-card animate-slide-up cursor-pointer hover:border-primary/30 transition-colors" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-info/10">
              <PieChart className="h-5 w-5 text-info" />
            </div>
            <span className="font-semibold">Discount Analysis</span>
          </div>
          <p className="text-sm text-muted-foreground">Margin impact review</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Categories */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-semibold text-foreground">Report Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportCategories.map((category, index) => (
              <Card
                key={category.title}
                className="p-5 cursor-pointer hover:shadow-md hover:border-primary/20 transition-all animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className={cn("p-3 rounded-xl", category.color)}>
                    <category.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{category.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                    <div className="space-y-1">
                      {category.reports.map((report) => (
                        <p key={report} className="text-sm text-primary hover:underline cursor-pointer">
                          {report}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Reports */}
          <div className="stat-card animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Recent Reports</h3>
              <Button variant="ghost" size="sm" className="text-primary">
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {quickReports.map((report) => (
                <div
                  key={report.name}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{report.name}</p>
                    <p className="text-xs text-muted-foreground">{report.lastRun}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Scheduled Reports */}
          <div className="stat-card animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Scheduled</h3>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Weekly Pipeline</span>
                <span className="text-foreground">Mon 9:00 AM</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Monthly Revenue</span>
                <span className="text-foreground">1st of month</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Quarterly Review</span>
                <span className="text-foreground">End of Q</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              Manage Schedules
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
