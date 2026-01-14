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
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Accounts", href: "/accounts", icon: Building2 },
  { name: "Contacts", href: "/contacts", icon: Users },
  { name: "Leads", href: "/leads", icon: Target },
  { name: "Opportunities", href: "/opportunities", icon: Briefcase },
  { name: "Quotes", href: "/quotes", icon: FileText },
  { name: "Contracts", href: "/contracts", icon: FileCheck },
  { name: "Orders", href: "/orders", icon: Receipt },
  { name: "Activities", href: "/activities", icon: Clock },
];

const incentiveNav = [
  { name: "Targets", href: "/targets", icon: Target },
  { name: "Incentives", href: "/incentives", icon: DollarSign },
  { name: "Payouts", href: "/payouts", icon: Receipt },
  { name: "Performance", href: "/performance", icon: BarChart3 },
];

const secondaryNav = [
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Pricing", href: "/pricing", icon: DollarSign },
  { name: "Settings", href: "/settings", icon: Settings },
];

const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

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
          {navigation.map((item) => {
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

        {/* Incentive Engine Section */}
        <div className="mt-6 pt-4 border-t border-sidebar-border">
          {!collapsed && (
            <p className="px-3 mb-2 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
              Incentive Engine
            </p>
          )}
          <div className="space-y-1">
            {incentiveNav.map((item) => {
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

        {/* Secondary Navigation */}
        <div className="mt-6 pt-4 border-t border-sidebar-border">
          <div className="space-y-1">
            {secondaryNav.map((item) => {
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
