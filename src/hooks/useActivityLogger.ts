import { useCallback } from "react";
import { useActivityLog } from "@/contexts/ActivityLogContext";
import { useAuth } from "@/contexts/AuthContext";
import { ActivityActionType, ActivityEntityType } from "@/data/activityLog";

export function useActivityLogger() {
  const { logActivity } = useActivityLog();
  const { user } = useAuth();

  const log = useCallback(
    async (
      action: ActivityActionType,
      entityType: ActivityEntityType,
      entityName: string,
      description: string,
      entityId?: string,
      metadata?: Record<string, any>
    ) => {
      const userInfo = user
        ? {
            userId: user.id,
            userName: `${user.firstName} ${user.lastName}`,
            userRole: user.role,
          }
        : undefined;

      await logActivity(action, entityType, entityName, description, entityId, metadata, userInfo);
    },
    [logActivity, user]
  );

  return { log };
}
