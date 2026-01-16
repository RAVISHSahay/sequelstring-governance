import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { 
  ActivityLogEntry, 
  ActivityActionType, 
  ActivityEntityType, 
  mockActivityLog 
} from "@/data/activityLog";
import { useAuth } from "@/contexts/AuthContext";
import { roleInfo } from "@/types/rbac";

interface ActivityLogContextType {
  activities: ActivityLogEntry[];
  logActivity: (
    action: ActivityActionType,
    entityType: ActivityEntityType,
    entityName: string,
    description: string,
    entityId?: string,
    metadata?: Record<string, any>
  ) => void;
  clearActivities: () => void;
  getActivitiesByType: (entityType: ActivityEntityType) => ActivityLogEntry[];
  getActivitiesByAction: (action: ActivityActionType) => ActivityLogEntry[];
  getActivitiesByDateRange: (startDate: Date, endDate: Date) => ActivityLogEntry[];
}

const ActivityLogContext = createContext<ActivityLogContextType | undefined>(undefined);

export function ActivityLogProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<ActivityLogEntry[]>(mockActivityLog);
  const { user } = useAuth();

  const logActivity = useCallback(
    (
      action: ActivityActionType,
      entityType: ActivityEntityType,
      entityName: string,
      description: string,
      entityId?: string,
      metadata?: Record<string, any>
    ) => {
      const newActivity: ActivityLogEntry = {
        id: crypto.randomUUID(),
        action,
        entityType,
        entityName,
        entityId,
        description,
        metadata,
        userId: user?.id || "anonymous",
        userName: user ? `${user.firstName} ${user.lastName}` : "Anonymous",
        userRole: user ? roleInfo[user.role].label : "Unknown",
        timestamp: new Date(),
      };

      setActivities((prev) => [newActivity, ...prev]);
    },
    [user]
  );

  const clearActivities = useCallback(() => {
    setActivities([]);
  }, []);

  const getActivitiesByType = useCallback(
    (entityType: ActivityEntityType) => {
      return activities.filter((a) => a.entityType === entityType);
    },
    [activities]
  );

  const getActivitiesByAction = useCallback(
    (action: ActivityActionType) => {
      return activities.filter((a) => a.action === action);
    },
    [activities]
  );

  const getActivitiesByDateRange = useCallback(
    (startDate: Date, endDate: Date) => {
      return activities.filter(
        (a) => a.timestamp >= startDate && a.timestamp <= endDate
      );
    },
    [activities]
  );

  return (
    <ActivityLogContext.Provider
      value={{
        activities,
        logActivity,
        clearActivities,
        getActivitiesByType,
        getActivitiesByAction,
        getActivitiesByDateRange,
      }}
    >
      {children}
    </ActivityLogContext.Provider>
  );
}

export function useActivityLog() {
  const context = useContext(ActivityLogContext);
  if (context === undefined) {
    throw new Error("useActivityLog must be used within an ActivityLogProvider");
  }
  return context;
}
