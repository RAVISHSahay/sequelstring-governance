import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { 
  ActivityLogEntry, 
  ActivityActionType, 
  ActivityEntityType
} from "@/data/activityLog";
import { supabase } from "@/integrations/supabase/client";

interface ActivityLogContextType {
  activities: ActivityLogEntry[];
  isLoading: boolean;
  logActivity: (
    action: ActivityActionType,
    entityType: ActivityEntityType,
    entityName: string,
    description: string,
    entityId?: string,
    metadata?: Record<string, any>,
    userInfo?: { userId: string; userName: string; userRole: string }
  ) => Promise<void>;
  clearActivities: () => void;
  getActivitiesByType: (entityType: ActivityEntityType) => ActivityLogEntry[];
  getActivitiesByAction: (action: ActivityActionType) => ActivityLogEntry[];
  getActivitiesByDateRange: (startDate: Date, endDate: Date) => ActivityLogEntry[];
  refetch: () => Promise<void>;
}

const ActivityLogContext = createContext<ActivityLogContextType | undefined>(undefined);

// Map database row to ActivityLogEntry
const mapDbToEntry = (row: any): ActivityLogEntry => ({
  id: row.id,
  action: row.action as ActivityActionType,
  entityType: row.entity_type as ActivityEntityType,
  entityName: row.entity_name,
  entityId: row.entity_id,
  description: row.description,
  metadata: row.metadata,
  userId: row.user_id,
  userName: row.user_name,
  userRole: row.user_role,
  timestamp: new Date(row.created_at),
  ipAddress: row.ip_address,
});

export function ActivityLogProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch activities from Supabase
  const fetchActivities = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);

      if (error) {
        console.error("Error fetching activities:", error);
        return;
      }

      if (data) {
        setActivities(data.map(mapDbToEntry));
      }
    } catch (err) {
      console.error("Error fetching activities:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel("activity_logs_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "activity_logs",
        },
        (payload) => {
          const newEntry = mapDbToEntry(payload.new);
          setActivities((prev) => [newEntry, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const logActivity = useCallback(
    async (
      action: ActivityActionType,
      entityType: ActivityEntityType,
      entityName: string,
      description: string,
      entityId?: string,
      metadata?: Record<string, any>,
      userInfo?: { userId: string; userName: string; userRole: string }
    ) => {
      try {
        const { error } = await supabase.from("activity_logs").insert({
          action,
          entity_type: entityType,
          entity_name: entityName,
          entity_id: entityId,
          description,
          metadata: metadata || null,
          user_id: userInfo?.userId || "anonymous",
          user_name: userInfo?.userName || "Anonymous",
          user_role: userInfo?.userRole || "Unknown",
        });

        if (error) {
          console.error("Error logging activity:", error);
          // Fallback to local state if insert fails
          const newActivity: ActivityLogEntry = {
            id: crypto.randomUUID(),
            action,
            entityType,
            entityName,
            entityId,
            description,
            metadata,
            userId: userInfo?.userId || "anonymous",
            userName: userInfo?.userName || "Anonymous",
            userRole: userInfo?.userRole || "Unknown",
            timestamp: new Date(),
          };
          setActivities((prev) => [newActivity, ...prev]);
        }
        // Realtime will handle adding the new entry to state
      } catch (err) {
        console.error("Error logging activity:", err);
      }
    },
    []
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
        isLoading,
        logActivity,
        clearActivities,
        getActivitiesByType,
        getActivitiesByAction,
        getActivitiesByDateRange,
        refetch: fetchActivities,
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
