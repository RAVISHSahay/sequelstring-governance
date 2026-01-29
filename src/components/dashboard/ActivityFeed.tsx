import { Phone, Mail, Calendar, FileText, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  {
    id: 1,
    type: "call",
    icon: Phone,
    title: "Call with Tata Steel - Discovery",
    description: "Discussed requirements for enterprise platform",
    time: "2 hours ago",
    user: "Priya S",
  },
  {
    id: 2,
    type: "email",
    icon: Mail,
    title: "Proposal sent to Reliance Industries",
    description: "Cloud migration services proposal v2.0",
    time: "4 hours ago",
    user: "Rahul M",
  },
  {
    id: 3,
    type: "meeting",
    icon: Calendar,
    title: "Meeting scheduled with HDFC Bank",
    description: "API integration demo - Tomorrow 10:00 AM",
    time: "5 hours ago",
    user: "Vikram D",
  },
  {
    id: 4,
    type: "document",
    icon: FileText,
    title: "NDA signed - Mahindra Group",
    description: "Non-disclosure agreement executed",
    time: "Yesterday",
    user: "Legal Team",
  },
  {
    id: 5,
    type: "deal",
    icon: CheckCircle,
    title: "Deal closed - Infosys Support Contract",
    description: "₹12,00,000 annual contract signed",
    time: "Yesterday",
    user: "Anjali K",
  },
];

const getIconStyles = (type: string) => {
  switch (type) {
    case "call":
      return "bg-info/10 text-info";
    case "email":
      return "bg-primary/10 text-primary";
    case "meeting":
      return "bg-accent/10 text-accent";
    case "document":
      return "bg-warning/10 text-warning";
    case "deal":
      return "bg-success/10 text-success";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export function ActivityFeed() {
  return (
    <div className="stat-card animate-slide-up" style={{ animationDelay: "0.25s" }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Recent Activity
          </h3>
          <p className="text-sm text-muted-foreground">
            Latest interactions and updates
          </p>
        </div>
        <a
          href="/activities"
          className="text-sm font-medium text-primary hover:underline"
        >
          View all
        </a>
      </div>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className="flex gap-3 pb-4 border-b border-border/50 last:border-0 last:pb-0"
          >
            <div
              className={cn(
                "p-2 rounded-lg h-fit flex-shrink-0",
                getIconStyles(activity.type)
              )}
            >
              <activity.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground text-sm">
                {activity.title}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {activity.description}
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span>{activity.user}</span>
                <span>•</span>
                <span>{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
