import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { PipelineChart } from "@/components/dashboard/PipelineChart";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { RecentDeals } from "@/components/dashboard/RecentDeals";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import {
  TrendingUp,
  Target,
  Briefcase,
  IndianRupee,
  FileText,
  Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <AppLayout title="Dashboard">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Pipeline Value"
          value="₹2.4 Cr"
          change={12}
          changeLabel="vs last month"
          icon={<IndianRupee className="h-5 w-5" />}
          variant="primary"
          onClick={() => navigate('/opportunities')}
        />
        <StatCard
          title="Active Opportunities"
          value="67"
          change={8}
          changeLabel="vs last month"
          icon={<Briefcase className="h-5 w-5" />}
          variant="accent"
          onClick={() => navigate('/opportunities')}
        />
        <StatCard
          title="Deals Won (MTD)"
          value="₹58L"
          change={24}
          changeLabel="vs target"
          icon={<TrendingUp className="h-5 w-5" />}
          variant="success"
          onClick={() => navigate('/opportunities')}
        />
        <StatCard
          title="Win Rate"
          value="34%"
          change={-2}
          changeLabel="vs last month"
          icon={<Target className="h-5 w-5" />}
          onClick={() => navigate('/win-loss')}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard
          title="Open Quotes"
          value="23"
          changeLabel="₹1.2 Cr total"
          icon={<FileText className="h-5 w-5" />}
          onClick={() => navigate('/quotes')}
        />
        <StatCard
          title="Active Accounts"
          value="142"
          change={5}
          changeLabel="new this month"
          icon={<Users className="h-5 w-5" />}
          onClick={() => navigate('/accounts')}
        />
        <StatCard
          title="Avg Deal Size"
          value="₹18.5L"
          change={15}
          changeLabel="vs last quarter"
          icon={<IndianRupee className="h-5 w-5" />}
          onClick={() => navigate('/performance')}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <PipelineChart />
        <RevenueChart />
      </div>

      {/* Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentDeals />
        <ActivityFeed />
      </div>
    </AppLayout>
  );
}
