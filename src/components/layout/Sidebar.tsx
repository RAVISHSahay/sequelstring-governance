import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  Target,
  FileText,
  Receipt,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  FileCheck,
  Clock,
  DollarSign,
  Shield,
  UserCog,
  LucideIcon,
  Map,
  GitBranch,
  TrendingUp,
  Trophy,
  FlaskConical,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Permission } from "@/types/rbac";

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  permission?: Permission;
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, permission: "view_dashboard" },
  { name: "Accounts", href: "/accounts", icon: Building2, permission: "view_accounts" },
  { name: "Account Map", href: "/account-map", icon: Map, permission: "view_accounts" },
  { name: "Contacts", href: "/contacts", icon: Users, permission: "view_contacts" },
  { name: "Leads", href: "/leads", icon: Target, permission: "view_leads" },
  { name: "Opportunities", href: "/opportunities", icon: Briefcase, permission: "view_opportunities" },
  { name: "Quotes", href: "/quotes", icon: FileText, permission: "view_quotes" },
  { name: "Contracts", href: "/contracts", icon: FileCheck, permission: "view_contracts" },
  { name: "Orders", href: "/orders", icon: Receipt, permission: "view_orders" },
  { name: "Activities", href: "/activities", icon: Clock, permission: "view_dashboard" },
];

const intelligenceNav: NavItem[] = [
  { name: "Forecasting", href: "/forecasting", icon: TrendingUp, permission: "view_dashboard" },
  { name: "Win/Loss", href: "/win-loss", icon: Trophy, permission: "view_dashboard" },
  { name: "POC Tracking", href: "/poc-tracking", icon: FlaskConical, permission: "view_dashboard" },
  { name: "Sales Stages", href: "/sales-stages", icon: GitBranch, permission: "view_admin" },
];

const incentiveNav: NavItem[] = [
  { name: "Targets", href: "/targets", icon: Target, permission: "view_targets" },
  { name: "Incentives", href: "/incentives", icon: DollarSign, permission: "view_incentives" },
  { name: "Payouts", href: "/payouts", icon: Receipt, permission: "view_payouts" },
  { name: "Performance", href: "/performance", icon: BarChart3, permission: "view_performance" },
  { name: "Admin", href: "/admin", icon: Shield, permission: "view_admin" },
];

const secondaryNav: NavItem[] = [
  { name: "Users", href: "/users", icon: UserCog, permission: "manage_users" },
  { name: "Reports", href: "/reports", icon: BarChart3, permission: "view_reports" },
  { name: "User Guide", href: "/user-guide", icon: BookOpen, permission: "view_dashboard" },
  { name: "Pricing", href: "/pricing", icon: DollarSign, permission: "view_dashboard" },
  { name: "Settings", href: "/settings", icon: Settings, permission: "view_dashboard" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { hasPermission } = useAuth();

  const filterByPermission = (items: NavItem[]) => {
    return items.filter((item) => !item.permission || hasPermission(item.permission));
  };

  const visibleNavigation = filterByPermission(navigation);
  const visibleIntelligenceNav = filterByPermission(intelligenceNav);
  const visibleIncentiveNav = filterByPermission(incentiveNav);
  const visibleSecondaryNav = filterByPermission(secondaryNav);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 ease-in-out flex flex-col",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-accent flex items-center justify-center">
              <span className="text-sm font-bold text-white">SS</span>
            </div>
            <span className="text-lg font-bold text-sidebar-foreground">
              SequelString
            </span>
          </div>
        )}
        {collapsed && (
          <div className="h-8 w-8 rounded-lg bg-gradient-accent flex items-center justify-center mx-auto">
            <span className="text-sm font-bold text-white">SS</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {visibleNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "nav-item",
                  isActive ? "nav-item-active" : "nav-item-inactive"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </div>

        {/* Intelligence Section */}
        {visibleIntelligenceNav.length > 0 && (
          <div className="mt-6 pt-4 border-t border-sidebar-border">
            {!collapsed && (
              <p className="px-3 mb-2 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
                Intelligence
              </p>
            )}
            <div className="space-y-1">
              {visibleIntelligenceNav.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "nav-item",
                      isActive ? "nav-item-active" : "nav-item-inactive"
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Incentive Engine Section */}
        {visibleIncentiveNav.length > 0 && (
          <div className="mt-6 pt-4 border-t border-sidebar-border">
            {!collapsed && (
              <p className="px-3 mb-2 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
                Incentive Engine
              </p>
            )}
            <div className="space-y-1">
              {visibleIncentiveNav.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "nav-item",
                      isActive ? "nav-item-active" : "nav-item-inactive"
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Secondary Navigation */}
        {visibleSecondaryNav.length > 0 && (
          <div className="mt-6 pt-4 border-t border-sidebar-border">
            <div className="space-y-1">
              {visibleSecondaryNav.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "nav-item",
                      isActive ? "nav-item-active" : "nav-item-inactive"
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="nav-item nav-item-inactive w-full justify-center"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
