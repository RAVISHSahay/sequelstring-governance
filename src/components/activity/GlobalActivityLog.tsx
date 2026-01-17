import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  History,
  Search,
  Filter,
  Calendar as CalendarIcon,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Download,
  Upload,
  LogIn,
  LogOut,
  CheckCircle,
  XCircle,
  RefreshCw,
  UserPlus,
  MessageSquare,
  ArrowRightLeft,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useActivityLog } from "@/contexts/ActivityLogContext";
import {
  ActivityLogEntry,
  ActivityActionType,
  ActivityEntityType,
  actionLabels,
  entityLabels,
  formatActivityTime,
} from "@/data/activityLog";

const actionIcons: Record<ActivityActionType, React.ComponentType<{ className?: string }>> = {
  create: Plus,
  update: Pencil,
  delete: Trash2,
  view: Eye,
  export: Download,
  import: Upload,
  login: LogIn,
  logout: LogOut,
  approve: CheckCircle,
  reject: XCircle,
  convert: RefreshCw,
  assign: UserPlus,
  comment: MessageSquare,
  upload: Upload,
  download: Download,
};

const actionColors: Record<ActivityActionType, string> = {
  create: "bg-emerald-500/10 text-emerald-500",
  update: "bg-blue-500/10 text-blue-500",
  delete: "bg-destructive/10 text-destructive",
  view: "bg-muted text-muted-foreground",
  export: "bg-purple-500/10 text-purple-500",
  import: "bg-purple-500/10 text-purple-500",
  login: "bg-muted text-muted-foreground",
  logout: "bg-muted text-muted-foreground",
  approve: "bg-emerald-500/10 text-emerald-500",
  reject: "bg-destructive/10 text-destructive",
  convert: "bg-amber-500/10 text-amber-500",
  assign: "bg-blue-500/10 text-blue-500",
  comment: "bg-muted text-muted-foreground",
  upload: "bg-purple-500/10 text-purple-500",
  download: "bg-purple-500/10 text-purple-500",
};

export function GlobalActivityLog() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [entityFilter, setEntityFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const { activities, isLoading } = useActivityLog();

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          activity.entityName.toLowerCase().includes(query) ||
          activity.description.toLowerCase().includes(query) ||
          activity.userName.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Action filter
      if (actionFilter !== "all" && activity.action !== actionFilter) {
        return false;
      }

      // Entity filter
      if (entityFilter !== "all" && activity.entityType !== entityFilter) {
        return false;
      }

      // Date range filter
      if (dateRange.from && activity.timestamp < dateRange.from) {
        return false;
      }
      if (dateRange.to) {
        const endOfDay = new Date(dateRange.to);
        endOfDay.setHours(23, 59, 59, 999);
        if (activity.timestamp > endOfDay) {
          return false;
        }
      }

      return true;
    });
  }, [activities, searchQuery, actionFilter, entityFilter, dateRange]);

  const clearFilters = () => {
    setSearchQuery("");
    setActionFilter("all");
    setEntityFilter("all");
    setDateRange({});
  };

  const hasActiveFilters =
    searchQuery || actionFilter !== "all" || entityFilter !== "all" || dateRange.from || dateRange.to;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <History className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Activity Log
            <Badge variant="secondary" className="ml-2">
              {filteredActivities.length} entries
            </Badge>
          </SheetTitle>
        </SheetHeader>

        {/* Filters */}
        <div className="px-6 pb-4 space-y-3 border-b">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter row */}
          <div className="flex gap-2 flex-wrap">
            {/* Action filter */}
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {Object.entries(actionLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Entity filter */}
            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(entityLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Date range picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2 min-w-[140px]">
                  <CalendarIcon className="h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <span className="text-xs">
                        {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d")}
                      </span>
                    ) : (
                      format(dateRange.from, "MMM d")
                    )
                  ) : (
                    "Date Range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>

            {/* Clear filters */}
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                <X className="h-3 w-3" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Activity List */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading activities...</p>
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="text-center py-12">
                <History className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">No activities found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {hasActiveFilters ? "Try adjusting your filters" : "Activities will appear here"}
                </p>
              </div>
            ) : (
              filteredActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function ActivityItem({ activity }: { activity: ActivityLogEntry }) {
  const Icon = actionIcons[activity.action];
  const colorClass = actionColors[activity.action];

  return (
    <div className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
      <div className="flex gap-3">
        {/* Icon */}
        <div className={cn("h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0", colorClass)}>
          <Icon className="h-4 w-4" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-[10px] font-medium">
                {actionLabels[activity.action]}
              </Badge>
              <Badge variant="secondary" className="text-[10px]">
                {entityLabels[activity.entityType]}
              </Badge>
            </div>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
              {formatActivityTime(activity.timestamp)}
            </span>
          </div>

          <h4 className="text-sm font-medium truncate mb-1">{activity.entityName}</h4>
          <p className="text-xs text-muted-foreground line-clamp-2">{activity.description}</p>

          {/* Metadata */}
          {activity.metadata && Object.keys(activity.metadata).length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {Object.entries(activity.metadata).map(([key, value]) => (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted text-[10px] text-muted-foreground"
                >
                  <span className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}:</span>
                  <span>{String(value)}</span>
                </span>
              ))}
            </div>
          )}

          {/* User info */}
          <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
            <span className="font-medium">{activity.userName}</span>
            <span>•</span>
            <span>{activity.userRole}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
