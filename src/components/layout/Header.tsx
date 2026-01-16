import { Bell, Search, Plus, ChevronDown, LogOut, User, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { roleInfo } from "@/types/rbac";
import { RoleSwitcher } from "@/components/auth/RoleSwitcher";
import { TourTrigger } from "@/components/onboarding/TourTrigger";
import { HelpTrigger } from "@/components/help/HelpTrigger";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userInitials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
    : 'U';

  const userName = user ? `${user.firstName} ${user.lastName}` : 'User';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block" data-tour="global-search">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search accounts, deals, contacts..."
            className="w-80 pl-10 bg-background"
          />
        </div>

        {/* Quick Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="gap-1" data-tour="quick-actions">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>New Lead</DropdownMenuItem>
            <DropdownMenuItem>New Account</DropdownMenuItem>
            <DropdownMenuItem>New Opportunity</DropdownMenuItem>
            <DropdownMenuItem>New Quote</DropdownMenuItem>
            <DropdownMenuItem>New Contact</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Role Switcher (Demo) */}
        <RoleSwitcher />

        {/* Tour Trigger */}
        <TourTrigger />

        {/* Help Center */}
        <HelpTrigger />

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full bg-accent text-[10px] font-bold text-accent-foreground flex items-center justify-center">
            3
          </span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 pl-2 pr-3" data-tour="user-menu">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatarUrl} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-medium leading-none">{userName}</span>
                {user && (
                  <span className="text-xs text-muted-foreground">
                    {roleInfo[user.role].label}
                  </span>
                )}
              </div>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
