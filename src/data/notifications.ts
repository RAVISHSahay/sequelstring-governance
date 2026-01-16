export type NotificationType = "alert" | "reminder" | "system" | "success" | "warning";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  link?: string;
  actionLabel?: string;
}

// Mock notifications for demo
export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "alert",
    title: "Deal at Risk",
    message: "Tata Steel opportunity has been in Negotiation stage for 45 days without activity.",
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
    read: false,
    link: "/opportunities",
    actionLabel: "View Deal",
  },
  {
    id: "2",
    type: "reminder",
    title: "Follow-up Due",
    message: "Scheduled follow-up call with Rajesh Kumar at Infosys is due today at 3:00 PM.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    read: false,
    link: "/activities",
    actionLabel: "Log Activity",
  },
  {
    id: "3",
    type: "success",
    title: "Deal Closed Won!",
    message: "Congratulations! ERP Integration Suite with Wipro has been marked as Closed Won (₹45L).",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    link: "/opportunities",
  },
  {
    id: "4",
    type: "system",
    title: "Quote Approval Required",
    message: "Quote #Q-2025-0042 for Reliance Industries requires your approval (Discount: 18%).",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    read: false,
    link: "/quotes",
    actionLabel: "Review Quote",
  },
  {
    id: "5",
    type: "warning",
    title: "Target at Risk",
    message: "Q1 revenue target is 68% achieved with 12 days remaining. Review pipeline for acceleration opportunities.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    read: true,
    link: "/targets",
  },
  {
    id: "6",
    type: "reminder",
    title: "POC Deadline Approaching",
    message: "Cloud Migration POC for HDFC Bank ends in 3 days. Ensure all KPIs are documented.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    read: true,
    link: "/poc-tracking",
  },
  {
    id: "7",
    type: "system",
    title: "New User Added",
    message: "Neha Gupta has been added to your team as Sales Representative.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    link: "/users",
  },
  {
    id: "8",
    type: "alert",
    title: "High-Influence Blocker Detected",
    message: "CFO at Mahindra & Mahindra marked as Blocker with influence score 5. Review stakeholder strategy.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26), // 26 hours ago
    read: true,
    link: "/account-map",
    actionLabel: "View Stakeholders",
  },
];

export function formatNotificationTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
