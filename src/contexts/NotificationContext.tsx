import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { Notification, NotificationType, mockNotifications } from "@/data/notifications";
import { 
  playNotificationSound, 
  NotificationSoundType, 
  isSoundEnabled, 
  setSoundEnabled,
  showBrowserNotification,
  requestNotificationPermission,
} from "@/lib/notificationSound";
import { toast } from "sonner";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
  pushNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  simulateIncomingNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Map notification types to sound types
const typeToSound: Record<NotificationType, NotificationSoundType> = {
  alert: "alert",
  reminder: "reminder",
  system: "system",
  success: "success",
  warning: "alert",
};

// Sample notifications for simulation
const sampleNotifications: Omit<Notification, "id" | "timestamp" | "read">[] = [
  {
    type: "success",
    title: "Deal Closed Won! 🎉",
    message: "Cloud Migration project with ICICI Bank has been marked as Closed Won (₹1.2 Cr).",
    link: "/opportunities",
    actionLabel: "View Deal",
  },
  {
    type: "alert",
    title: "Urgent: Quote Expiring",
    message: "Quote for Axis Bank expires in 2 hours. Customer hasn't responded yet.",
    link: "/quotes",
    actionLabel: "View Quote",
  },
  {
    type: "system",
    title: "Approval Required",
    message: "Discount approval needed for Bajaj Finserv quote (22% off). Requires Finance sign-off.",
    link: "/quotes",
    actionLabel: "Review",
  },
  {
    type: "reminder",
    title: "Meeting in 15 minutes",
    message: "Demo call with SBI Cards team scheduled at 3:00 PM. Don't forget to prepare the POC results.",
    link: "/activities",
  },
  {
    type: "warning",
    title: "Pipeline Gap Detected",
    message: "Current pipeline is ₹45L short of Q2 target. Consider accelerating deals in Negotiation stage.",
    link: "/forecasting",
  },
  {
    type: "success",
    title: "Target Achieved! 🏆",
    message: "Congratulations! You've hit 105% of your monthly revenue target.",
    link: "/performance",
  },
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [soundEnabled, setSoundEnabledState] = useState(isSoundEnabled);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Request browser notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
      const newNotification: Notification = {
        ...notification,
        id: crypto.randomUUID(),
        timestamp: new Date(),
        read: false,
      };
      setNotifications((prev) => [newNotification, ...prev]);
    },
    []
  );

  // Push notification with sound and toast
  const pushNotification = useCallback(
    (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
      const newNotification: Notification = {
        ...notification,
        id: crypto.randomUUID(),
        timestamp: new Date(),
        read: false,
      };
      
      setNotifications((prev) => [newNotification, ...prev]);

      // Play sound based on notification type
      if (isSoundEnabled()) {
        const soundType = typeToSound[notification.type];
        playNotificationSound(soundType);
      }

      // Show browser notification for critical types
      if (notification.type === "alert" || notification.type === "success") {
        showBrowserNotification(notification.title, {
          body: notification.message,
          tag: newNotification.id,
        });
      }

      // Show toast notification
      const toastType = notification.type === "success" ? "success" 
        : notification.type === "alert" || notification.type === "warning" ? "error" 
        : "info";
      
      if (toastType === "success") {
        toast.success(notification.title, {
          description: notification.message,
          duration: 5000,
        });
      } else if (toastType === "error") {
        toast.error(notification.title, {
          description: notification.message,
          duration: 5000,
        });
      } else {
        toast.info(notification.title, {
          description: notification.message,
          duration: 5000,
        });
      }
    },
    []
  );

  const toggleSound = useCallback(() => {
    const newValue = !isSoundEnabled();
    setSoundEnabled(newValue);
    setSoundEnabledState(newValue);
    
    if (newValue) {
      // Play a test sound when enabling
      playNotificationSound("system");
    }
  }, []);

  // Simulate incoming notification (for demo)
  const simulateIncomingNotification = useCallback(() => {
    const randomNotification = sampleNotifications[Math.floor(Math.random() * sampleNotifications.length)];
    pushNotification(randomNotification);
  }, [pushNotification]);

  // Auto-simulate notifications periodically (for demo - every 45 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      // Only simulate if tab is visible and randomly (30% chance)
      if (document.visibilityState === "visible" && Math.random() < 0.3) {
        simulateIncomingNotification();
      }
    }, 45000);

    return () => clearInterval(interval);
  }, [simulateIncomingNotification]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        addNotification,
        pushNotification,
        soundEnabled,
        toggleSound,
        simulateIncomingNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
