import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bell,
  BellRing,
  Clock,
  AlertTriangle,
  AlertCircle,
  Calendar,
  Phone,
  Mail,
  Video,
  Users,
  Settings2,
  Check,
  X,
  Timer,
  ChevronRight,
  Zap,
  Crown,
  Target,
} from "lucide-react";
import { Stakeholder } from "@/types/account";
import { CommunicationEntry } from "./StakeholderCommunicationLog";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { format, differenceInDays, addDays, isAfter, isBefore } from "date-fns";

export type ReminderPriority = 'critical' | 'high' | 'medium' | 'low';
export type ReminderStatus = 'active' | 'snoozed' | 'dismissed' | 'completed';

export interface FollowUpReminder {
  id: string;
  stakeholderId: string;
  stakeholderName: string;
  stakeholderRole: string;
  stakeholderInfluence: number;
  priority: ReminderPriority;
  status: ReminderStatus;
  daysSinceLastContact: number;
  lastContactDate: Date;
  lastContactType: string;
  expectedFrequency: number; // days
  suggestedAction: string;
  reason: string;
  snoozedUntil?: Date;
  linkedOpportunityId?: string;
  linkedOpportunityName?: string;
}

interface FollowUpRemindersProps {
  stakeholders: Stakeholder[];
  communications: CommunicationEntry[];
  onLogActivity?: (stakeholderId: string) => void;
  onSelectStakeholder?: (stakeholder: Stakeholder) => void;
}

interface ReminderSettings {
  enabled: boolean;
  criticalDays: number;
  highDays: number;
  mediumDays: number;
  lowDays: number;
  prioritizeByInfluence: boolean;
  excludeNegativeSentiment: boolean;
}

const defaultSettings: ReminderSettings = {
  enabled: true,
  criticalDays: 14,
  highDays: 21,
  mediumDays: 30,
  lowDays: 45,
  prioritizeByInfluence: true,
  excludeNegativeSentiment: false,
};

const priorityConfig: Record<ReminderPriority, { label: string; color: string; bgColor: string; icon: any }> = {
  critical: { label: 'Critical', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30', icon: AlertCircle },
  high: { label: 'High', color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900/30', icon: AlertTriangle },
  medium: { label: 'Medium', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30', icon: Clock },
  low: { label: 'Low', color: 'text-slate-600', bgColor: 'bg-slate-100 dark:bg-slate-800', icon: Bell },
};

const roleLabels: Record<string, string> = {
  economic_buyer: 'Economic Buyer',
  technical_approver: 'Technical Approver',
  influencer: 'Influencer',
  gatekeeper: 'Gatekeeper',
  champion: 'Champion',
  user: 'User',
  executive_sponsor: 'Executive Sponsor',
  procurement: 'Procurement',
};

export function FollowUpReminders({
  stakeholders,
  communications,
  onLogActivity,
  onSelectStakeholder,
}: FollowUpRemindersProps) {
  const [settings, setSettings] = useState<ReminderSettings>(defaultSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [snoozedReminders, setSnoozedReminders] = useState<Map<string, Date>>(new Map());
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  // Generate reminders based on communication gaps
  const reminders = useMemo(() => {
    if (!settings.enabled) return [];

    const now = new Date();
    const generatedReminders: FollowUpReminder[] = [];

    stakeholders.forEach((stakeholder) => {
      // Get all communications for this stakeholder
      const stakeholderComms = communications
        .filter((c) => c.stakeholderId === stakeholder.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      const lastComm = stakeholderComms[0];
      const lastContactDate = lastComm ? new Date(lastComm.date) : new Date(stakeholder.lastContactDate);
      const daysSinceLastContact = differenceInDays(now, lastContactDate);

      // Calculate expected frequency based on stakeholder importance
      let expectedFrequency = settings.lowDays;
      if (stakeholder.isKeyContact || stakeholder.isDecisionMaker) {
        expectedFrequency = settings.highDays;
      }
      if (stakeholder.primaryRole === 'economic_buyer' || stakeholder.primaryRole === 'champion') {
        expectedFrequency = settings.criticalDays;
      }

      // Check if reminder is needed
      const overdueDays = daysSinceLastContact - expectedFrequency;
      if (overdueDays <= 0) return;

      // Skip if negative sentiment and setting is enabled
      if (settings.excludeNegativeSentiment && stakeholder.sentiment === 'negative') return;

      // Calculate priority
      let priority: ReminderPriority = 'low';
      if (overdueDays >= settings.criticalDays) {
        priority = 'critical';
      } else if (overdueDays >= settings.highDays - settings.mediumDays) {
        priority = 'high';
      } else if (overdueDays >= settings.mediumDays - settings.lowDays) {
        priority = 'medium';
      }

      // Boost priority for high-influence stakeholders
      if (settings.prioritizeByInfluence && stakeholder.influenceScore >= 8) {
        if (priority === 'medium') priority = 'high';
        if (priority === 'low') priority = 'medium';
      }

      // Determine suggested action based on preferred channel
      let suggestedAction = 'Schedule a call';
      switch (stakeholder.preferredChannel) {
        case 'email':
          suggestedAction = 'Send a check-in email';
          break;
        case 'video':
          suggestedAction = 'Schedule a video call';
          break;
        case 'in_person':
          suggestedAction = 'Arrange an in-person meeting';
          break;
      }

      // Get linked opportunity if any
      const linkedOpp = stakeholderComms.find((c) => c.linkedOpportunityId);

      const reminder: FollowUpReminder = {
        id: `reminder_${stakeholder.id}`,
        stakeholderId: stakeholder.id,
        stakeholderName: stakeholder.name,
        stakeholderRole: stakeholder.primaryRole,
        stakeholderInfluence: stakeholder.influenceScore,
        priority,
        status: 'active',
        daysSinceLastContact,
        lastContactDate,
        lastContactType: lastComm?.type || 'unknown',
        expectedFrequency,
        suggestedAction,
        reason: `No contact in ${daysSinceLastContact} days (expected every ${expectedFrequency} days)`,
        linkedOpportunityId: linkedOpp?.linkedOpportunityId,
        linkedOpportunityName: linkedOpp?.linkedOpportunityName,
      };

      generatedReminders.push(reminder);
    });

    // Sort by priority and influence
    return generatedReminders
      .filter((r) => !dismissedIds.has(r.id) && !completedIds.has(r.id))
      .filter((r) => {
        const snoozedUntil = snoozedReminders.get(r.id);
        if (snoozedUntil && isAfter(snoozedUntil, now)) return false;
        return true;
      })
      .sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return b.stakeholderInfluence - a.stakeholderInfluence;
      });
  }, [stakeholders, communications, settings, dismissedIds, snoozedReminders, completedIds]);

  const handleSnooze = (reminderId: string, days: number) => {
    const snoozedUntil = addDays(new Date(), days);
    setSnoozedReminders((prev) => new Map(prev).set(reminderId, snoozedUntil));
    toast({
      title: "Reminder Snoozed",
      description: `Will remind you again on ${format(snoozedUntil, 'MMM d, yyyy')}`,
    });
  };

  const handleDismiss = (reminderId: string) => {
    setDismissedIds((prev) => new Set(prev).add(reminderId));
    toast({ title: "Reminder Dismissed" });
  };

  const handleComplete = (reminderId: string) => {
    setCompletedIds((prev) => new Set(prev).add(reminderId));
    toast({ title: "Marked as Completed", description: "Great job maintaining the relationship!" });
  };

  const handleLogActivity = (stakeholderId: string) => {
    if (onLogActivity) {
      onLogActivity(stakeholderId);
    }
    const reminder = reminders.find((r) => r.stakeholderId === stakeholderId);
    if (reminder) {
      setCompletedIds((prev) => new Set(prev).add(reminder.id));
    }
  };

  const getInitials = (name: string) => name.split(' ').map((n) => n[0]).join('').toUpperCase();

  const criticalCount = reminders.filter((r) => r.priority === 'critical').length;
  const highCount = reminders.filter((r) => r.priority === 'high').length;

  if (!settings.enabled) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="text-muted-foreground">Follow-up reminders are disabled</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => setSettings({ ...settings, enabled: true })}>
            Enable Reminders
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <BellRing className="h-5 w-5 text-primary" />
                {reminders.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] text-destructive-foreground flex items-center justify-center font-medium">
                    {reminders.length}
                  </span>
                )}
              </div>
              <CardTitle className="text-base">Follow-up Reminders</CardTitle>
              {criticalCount > 0 && (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {criticalCount} critical
                </Badge>
              )}
              {highCount > 0 && (
                <Badge variant="outline" className="gap-1 bg-amber-100 text-amber-700 border-amber-300">
                  <AlertTriangle className="h-3 w-3" />
                  {highCount} high
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSettingsOpen(true)}>
              <Settings2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {reminders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Check className="h-10 w-10 mb-3 text-emerald-500" />
              <p className="font-medium">All caught up!</p>
              <p className="text-sm">No follow-up reminders at this time</p>
            </div>
          ) : (
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {reminders.map((reminder) => {
                  const config = priorityConfig[reminder.priority];
                  const PriorityIcon = config.icon;

                  return (
                    <div
                      key={reminder.id}
                      className={cn(
                        "group flex items-start gap-3 p-3 rounded-lg border transition-all hover:shadow-sm",
                        reminder.priority === 'critical' && "border-red-200 bg-red-50/50 dark:bg-red-900/10",
                        reminder.priority === 'high' && "border-amber-200 bg-amber-50/50 dark:bg-amber-900/10"
                      )}
                    >
                      {/* Avatar */}
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarFallback className={cn("text-xs", config.bgColor, config.color)}>
                          {getInitials(reminder.stakeholderName)}
                        </AvatarFallback>
                      </Avatar>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{reminder.stakeholderName}</span>
                              {reminder.stakeholderInfluence >= 8 && (
                                <Crown className="h-3.5 w-3.5 text-amber-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                              <span>{roleLabels[reminder.stakeholderRole] || reminder.stakeholderRole}</span>
                              {reminder.linkedOpportunityName && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Target className="h-3 w-3" />
                                    {reminder.linkedOpportunityName}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <Badge variant="outline" className={cn("gap-1", config.bgColor, config.color)}>
                            <PriorityIcon className="h-3 w-3" />
                            {config.label}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 mt-2 text-xs">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                              Last contact: {format(reminder.lastContactDate, 'MMM d')} ({reminder.daysSinceLastContact} days ago)
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 mt-2">
                          <Zap className="h-3 w-3 text-primary" />
                          <span className="text-xs font-medium text-primary">{reminder.suggestedAction}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-3">
                          <Button
                            size="sm"
                            className="h-7 text-xs gap-1"
                            onClick={() => handleLogActivity(reminder.stakeholderId)}
                          >
                            <Phone className="h-3 w-3" />
                            Log Activity
                          </Button>
                          
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                                <Timer className="h-3 w-3" />
                                Snooze
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-40 p-2" align="start">
                              <div className="space-y-1">
                                {[1, 3, 7, 14].map((days) => (
                                  <Button
                                    key={days}
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-xs"
                                    onClick={() => handleSnooze(reminder.id, days)}
                                  >
                                    {days} day{days > 1 ? 's' : ''}
                                  </Button>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs gap-1"
                            onClick={() => handleComplete(reminder.id)}
                          >
                            <Check className="h-3 w-3" />
                            Done
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs gap-1 opacity-0 group-hover:opacity-100"
                            onClick={() => handleDismiss(reminder.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              Reminder Settings
            </DialogTitle>
            <DialogDescription>
              Configure when and how follow-up reminders are generated
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Master Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Reminders</Label>
                <p className="text-xs text-muted-foreground">Receive follow-up reminders for stakeholders</p>
              </div>
              <Switch
                checked={settings.enabled}
                onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked })}
              />
            </div>

            <Separator />

            {/* Threshold Settings */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Activity Gap Thresholds</Label>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-red-600">Critical (days)</Label>
                  <Select
                    value={settings.criticalDays.toString()}
                    onValueChange={(v) => setSettings({ ...settings, criticalDays: parseInt(v) })}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[7, 10, 14, 21].map((d) => (
                        <SelectItem key={d} value={d.toString()}>{d} days</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-amber-600">High (days)</Label>
                  <Select
                    value={settings.highDays.toString()}
                    onValueChange={(v) => setSettings({ ...settings, highDays: parseInt(v) })}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[14, 21, 30, 45].map((d) => (
                        <SelectItem key={d} value={d.toString()}>{d} days</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-blue-600">Medium (days)</Label>
                  <Select
                    value={settings.mediumDays.toString()}
                    onValueChange={(v) => setSettings({ ...settings, mediumDays: parseInt(v) })}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[21, 30, 45, 60].map((d) => (
                        <SelectItem key={d} value={d.toString()}>{d} days</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-slate-600">Low (days)</Label>
                  <Select
                    value={settings.lowDays.toString()}
                    onValueChange={(v) => setSettings({ ...settings, lowDays: parseInt(v) })}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[30, 45, 60, 90].map((d) => (
                        <SelectItem key={d} value={d.toString()}>{d} days</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Additional Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Prioritize by Influence</Label>
                  <p className="text-xs text-muted-foreground">
                    Boost priority for high-influence stakeholders
                  </p>
                </div>
                <Switch
                  checked={settings.prioritizeByInfluence}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, prioritizeByInfluence: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Exclude Negative Sentiment</Label>
                  <p className="text-xs text-muted-foreground">
                    Don't remind for stakeholders with negative sentiment
                  </p>
                </div>
                <Switch
                  checked={settings.excludeNegativeSentiment}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, excludeNegativeSentiment: checked })
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSettings(defaultSettings)}>
              Reset to Defaults
            </Button>
            <Button onClick={() => setSettingsOpen(false)}>Save Settings</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
