import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Building2,
  Users,
  Target,
  Briefcase,
  FileText,
  FileCheck,
  Receipt,
  Clock,
  TrendingUp,
  Trophy,
  FlaskConical,
  GitBranch,
  DollarSign,
  BarChart3,
  Shield,
  UserCog,
  Settings,
  BookOpen,
  Plus,
  Search,
  Map,
  HelpCircle,
  LogOut,
  User,
  Moon,
  Sun,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useOnboarding } from "@/contexts/OnboardingContext";

interface CommandItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  keywords?: string[];
  shortcut?: string;
  group: "navigation" | "actions" | "settings" | "help";
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { startTour } = useOnboarding();

  // Toggle command palette with Cmd+K or Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  const navigationItems: CommandItem[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, action: () => navigate("/"), keywords: ["home", "overview", "main"], group: "navigation" },
    { id: "accounts", label: "Accounts", icon: Building2, action: () => navigate("/accounts"), keywords: ["company", "organization", "client"], group: "navigation" },
    { id: "account-map", label: "Account Map", icon: Map, action: () => navigate("/account-map"), keywords: ["360", "view", "stakeholder"], group: "navigation" },
    { id: "contacts", label: "Contacts", icon: Users, action: () => navigate("/contacts"), keywords: ["people", "person", "stakeholder"], group: "navigation" },
    { id: "leads", label: "Leads", icon: Target, action: () => navigate("/leads"), keywords: ["prospect", "potential", "inbound"], group: "navigation" },
    { id: "opportunities", label: "Opportunities", icon: Briefcase, action: () => navigate("/opportunities"), keywords: ["deals", "pipeline", "sales"], group: "navigation" },
    { id: "quotes", label: "Quotes", icon: FileText, action: () => navigate("/quotes"), keywords: ["proposal", "pricing", "cpq"], group: "navigation" },
    { id: "contracts", label: "Contracts", icon: FileCheck, action: () => navigate("/contracts"), keywords: ["agreement", "legal", "document"], group: "navigation" },
    { id: "orders", label: "Orders", icon: Receipt, action: () => navigate("/orders"), keywords: ["purchase", "buy", "transaction"], group: "navigation" },
    { id: "activities", label: "Activities", icon: Clock, action: () => navigate("/activities"), keywords: ["log", "history", "timeline"], group: "navigation" },
    { id: "forecasting", label: "Forecasting", icon: TrendingUp, action: () => navigate("/forecasting"), keywords: ["prediction", "revenue", "projection"], group: "navigation" },
    { id: "win-loss", label: "Win/Loss Analysis", icon: Trophy, action: () => navigate("/win-loss"), keywords: ["analysis", "report", "insights"], group: "navigation" },
    { id: "poc-tracking", label: "POC Tracking", icon: FlaskConical, action: () => navigate("/poc-tracking"), keywords: ["proof", "concept", "trial"], group: "navigation" },
    { id: "sales-stages", label: "Sales Stages", icon: GitBranch, action: () => navigate("/sales-stages"), keywords: ["pipeline", "configuration", "stage"], group: "navigation" },
    { id: "targets", label: "Targets", icon: Target, action: () => navigate("/targets"), keywords: ["quota", "goal", "objective"], group: "navigation" },
    { id: "incentives", label: "Incentives", icon: DollarSign, action: () => navigate("/incentives"), keywords: ["commission", "bonus", "reward"], group: "navigation" },
    { id: "payouts", label: "Payouts", icon: Receipt, action: () => navigate("/payouts"), keywords: ["payment", "settlement", "disbursement"], group: "navigation" },
    { id: "performance", label: "Performance", icon: BarChart3, action: () => navigate("/performance"), keywords: ["metrics", "kpi", "achievement"], group: "navigation" },
    { id: "admin", label: "Admin Controls", icon: Shield, action: () => navigate("/admin"), keywords: ["governance", "control", "configuration"], group: "navigation" },
    { id: "users", label: "User Management", icon: UserCog, action: () => navigate("/users"), keywords: ["team", "member", "role"], group: "navigation" },
    { id: "reports", label: "Reports", icon: BarChart3, action: () => navigate("/reports"), keywords: ["analytics", "data", "export"], group: "navigation" },
    { id: "pricing", label: "Pricing", icon: DollarSign, action: () => navigate("/pricing"), keywords: ["price", "catalog", "product"], group: "navigation" },
  ];

  const actionItems: CommandItem[] = [
    { id: "new-lead", label: "Create New Lead", icon: Plus, action: () => navigate("/leads"), keywords: ["add", "create", "new"], shortcut: "L", group: "actions" },
    { id: "new-account", label: "Create New Account", icon: Plus, action: () => navigate("/accounts"), keywords: ["add", "create", "new"], shortcut: "A", group: "actions" },
    { id: "new-opportunity", label: "Create New Opportunity", icon: Plus, action: () => navigate("/opportunities"), keywords: ["add", "create", "deal"], shortcut: "O", group: "actions" },
    { id: "new-quote", label: "Create New Quote", icon: Plus, action: () => navigate("/quotes/new"), keywords: ["add", "create", "proposal"], shortcut: "Q", group: "actions" },
    { id: "new-contact", label: "Create New Contact", icon: Plus, action: () => navigate("/contacts"), keywords: ["add", "create", "person"], shortcut: "C", group: "actions" },
  ];

  const settingsItems: CommandItem[] = [
    { id: "settings", label: "Settings", icon: Settings, action: () => navigate("/settings"), keywords: ["preferences", "configuration"], group: "settings" },
    { id: "profile", label: "My Profile", icon: User, action: () => navigate("/settings"), keywords: ["account", "me", "user"], group: "settings" },
    { id: "logout", label: "Sign Out", icon: LogOut, action: () => logout(), keywords: ["exit", "leave", "signout"], group: "settings" },
  ];

  const helpItems: CommandItem[] = [
    { id: "user-guide", label: "User Guide", icon: BookOpen, action: () => navigate("/user-guide"), keywords: ["help", "documentation", "manual"], group: "help" },
    { id: "take-tour", label: "Take a Tour", icon: HelpCircle, action: () => startTour(), keywords: ["onboarding", "tutorial", "guide"], group: "help" },
  ];

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Quick Actions">
          {actionItems.map((item) => (
            <CommandItem
              key={item.id}
              value={`${item.label} ${item.keywords?.join(" ") || ""}`}
              onSelect={() => runCommand(item.action)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
              {item.shortcut && (
                <CommandShortcut>⌘{item.shortcut}</CommandShortcut>
              )}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navigation">
          {navigationItems.map((item) => (
            <CommandItem
              key={item.id}
              value={`${item.label} ${item.keywords?.join(" ") || ""}`}
              onSelect={() => runCommand(item.action)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Settings">
          {settingsItems.map((item) => (
            <CommandItem
              key={item.id}
              value={`${item.label} ${item.keywords?.join(" ") || ""}`}
              onSelect={() => runCommand(item.action)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Help">
          {helpItems.map((item) => (
            <CommandItem
              key={item.id}
              value={`${item.label} ${item.keywords?.join(" ") || ""}`}
              onSelect={() => runCommand(item.action)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
