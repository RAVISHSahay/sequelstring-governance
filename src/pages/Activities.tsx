import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Plus, Phone, Mail, Calendar, FileText, CheckCircle, MessageSquare, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogActivityDialog } from "@/components/dialogs/LogActivityDialog";
import { toast } from "sonner";

interface Activity {
  id: number;
  type: string;
  icon: any;
  title: string;
  description: string;
  account: string;
  contact: string;
  user: string;
  initials: string;
  time: string;
  duration: string;
  outcome: string;
}

const initialActivities: Activity[] = [
  {
    id: 1,
    type: "call",
    icon: Phone,
    title: "Discovery Call - Tata Steel",
    description: "Discussed platform requirements and integration needs. CTO interested in POC.",
    account: "Tata Steel Ltd",
    contact: "Rajesh Sharma",
    user: "Priya Sharma",
    initials: "PS",
    time: "2 hours ago",
    duration: "45 min",
    outcome: "Positive",
  },
  {
    id: 2,
    type: "email",
    icon: Mail,
    title: "Proposal Follow-up",
    description: "Sent revised proposal with updated pricing and payment terms.",
    account: "Reliance Industries",
    contact: "Priya Menon",
    user: "Rahul Mehta",
    initials: "RM",
    time: "4 hours ago",
    duration: "-",
    outcome: "Sent",
  },
  {
    id: 3,
    type: "meeting",
    icon: Video,
    title: "Technical Demo",
    description: "Demonstrated API integration capabilities and security features.",
    account: "HDFC Bank",
    contact: "Amit Patel",
    user: "Vikram Das",
    initials: "VD",
    time: "Yesterday",
    duration: "1h 30min",
    outcome: "Positive",
  },
  {
    id: 4,
    type: "task",
    icon: CheckCircle,
    title: "Contract Review Completed",
    description: "Legal team approved MSA with minor amendments.",
    account: "Infosys Ltd",
    contact: "Sunita Reddy",
    user: "Legal Team",
    initials: "LT",
    time: "Yesterday",
    duration: "-",
    outcome: "Completed",
  },
  {
    id: 5,
    type: "note",
    icon: FileText,
    title: "Meeting Notes - Budget Discussion",
    description: "CFO confirmed Q1 budget allocation. Proceed with formal proposal.",
    account: "Mahindra Group",
    contact: "Vikram Singh",
    user: "Anjali Kumar",
    initials: "AK",
    time: "2 days ago",
    duration: "-",
    outcome: "Info",
  },
];

const upcomingTasks = [
  { id: 1, title: "Follow up with Tata Steel", due: "Today, 4:00 PM", priority: "High" },
  { id: 2, title: "Send revised quote to Reliance", due: "Tomorrow", priority: "Medium" },
  { id: 3, title: "Schedule demo with Kotak Bank", due: "Jan 20", priority: "Medium" },
  { id: 4, title: "Contract renewal - HDFC", due: "Jan 25", priority: "High" },
];

const getTypeStyles = (type: string) => {
  switch (type) {
    case "call":
      return "bg-info/10 text-info";
    case "email":
      return "bg-primary/10 text-primary";
    case "meeting":
      return "bg-accent/10 text-accent";
    case "task":
      return "bg-success/10 text-success";
    case "note":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getOutcomeColor = (outcome: string) => {
  switch (outcome) {
    case "Positive":
      return "bg-success/10 text-success border-success/20";
    case "Completed":
      return "bg-success/10 text-success border-success/20";
    case "Sent":
      return "bg-info/10 text-info border-info/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const getIconForType = (type: string) => {
  switch (type) {
    case "call":
      return Phone;
    case "email":
      return Mail;
    case "meeting":
      return Video;
    case "task":
      return CheckCircle;
    case "note":
      return FileText;
    default:
      return FileText;
  }
};

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.account.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || activity.type === activeTab.slice(0, -1); // Remove 's' from 'calls', 'emails', etc.
    return matchesSearch && matchesTab;
  });

  const handleLogActivity = () => {
    setDialogOpen(true);
  };

  const handleSaveActivity = (activity: Activity) => {
    // Set the correct icon based on type
    const Icon = getIconForType(activity.type);
    const activityWithIcon = { ...activity, icon: Icon };
    setActivities((prev) => [activityWithIcon, ...prev]);
    toast.success('Activity logged successfully');
  };

  return (
    <AppLayout title="Activities">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Activity Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              <Button className="gap-2" onClick={handleLogActivity}>
                <Plus className="h-4 w-4" />
                Log Activity
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="calls">Calls</TabsTrigger>
              <TabsTrigger value="emails">Emails</TabsTrigger>
              <TabsTrigger value="meetings">Meetings</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4 space-y-4">
              {filteredActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="stat-card hover:shadow-md transition-shadow cursor-pointer animate-fade-in"
                  >
                    <div className="flex gap-4">
                      <div className={cn("p-3 rounded-xl h-fit", getTypeStyles(activity.type))}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-foreground">{activity.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                          </div>
                          <Badge variant="outline" className={cn("flex-shrink-0", getOutcomeColor(activity.outcome))}>
                            {activity.outcome}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                          <span>{activity.account}</span>
                          <span>•</span>
                          <span>{activity.contact}</span>
                          {activity.duration !== "-" && (
                            <>
                              <span>•</span>
                              <span>{activity.duration}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                              {activity.initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">{activity.user}</span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </TabsContent>
            <TabsContent value="calls" className="mt-4 space-y-4">
              {filteredActivities.filter(a => a.type === 'call').map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="stat-card hover:shadow-md transition-shadow cursor-pointer animate-fade-in"
                  >
                    <div className="flex gap-4">
                      <div className={cn("p-3 rounded-xl h-fit", getTypeStyles(activity.type))}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-foreground">{activity.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                          </div>
                          <Badge variant="outline" className={cn("flex-shrink-0", getOutcomeColor(activity.outcome))}>
                            {activity.outcome}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </TabsContent>
            <TabsContent value="emails" className="mt-4 space-y-4">
              {filteredActivities.filter(a => a.type === 'email').map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="stat-card hover:shadow-md transition-shadow cursor-pointer animate-fade-in"
                  >
                    <div className="flex gap-4">
                      <div className={cn("p-3 rounded-xl h-fit", getTypeStyles(activity.type))}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-foreground">{activity.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                          </div>
                          <Badge variant="outline" className={cn("flex-shrink-0", getOutcomeColor(activity.outcome))}>
                            {activity.outcome}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </TabsContent>
            <TabsContent value="meetings" className="mt-4 space-y-4">
              {filteredActivities.filter(a => a.type === 'meeting').map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="stat-card hover:shadow-md transition-shadow cursor-pointer animate-fade-in"
                  >
                    <div className="flex gap-4">
                      <div className={cn("p-3 rounded-xl h-fit", getTypeStyles(activity.type))}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-foreground">{activity.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                          </div>
                          <Badge variant="outline" className={cn("flex-shrink-0", getOutcomeColor(activity.outcome))}>
                            {activity.outcome}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </TabsContent>
            <TabsContent value="tasks" className="mt-4 space-y-4">
              {filteredActivities.filter(a => a.type === 'task').map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="stat-card hover:shadow-md transition-shadow cursor-pointer animate-fade-in"
                  >
                    <div className="flex gap-4">
                      <div className={cn("p-3 rounded-xl h-fit", getTypeStyles(activity.type))}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-foreground">{activity.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                          </div>
                          <Badge variant="outline" className={cn("flex-shrink-0", getOutcomeColor(activity.outcome))}>
                            {activity.outcome}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Tasks */}
          <div className="stat-card animate-slide-up">
            <h3 className="font-semibold text-foreground mb-4">Upcoming Tasks</h3>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="h-5 w-5 rounded border-2 border-border mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{task.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{task.due}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs flex-shrink-0",
                      task.priority === "High" ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-primary">
              View All Tasks
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="stat-card animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <h3 className="font-semibold text-foreground mb-4">This Week</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Calls Made</span>
                <span className="font-semibold">{activities.filter(a => a.type === 'call').length + 24}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Emails Sent</span>
                <span className="font-semibold">{activities.filter(a => a.type === 'email').length + 56}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Meetings</span>
                <span className="font-semibold">{activities.filter(a => a.type === 'meeting').length + 8}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tasks Completed</span>
                <span className="font-semibold text-success">{activities.filter(a => a.type === 'task').length + 12}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LogActivityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveActivity}
      />
    </AppLayout>
  );
}
