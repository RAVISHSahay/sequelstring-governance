import { useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
    History,
    Phone,
    Mail,
    Users,
    Calendar,
    Target,
    TrendingUp,
    MessageSquare,
    Video,
    MapPin,
    FileText,
    CheckCircle2,
    Clock,
    XCircle,
    ArrowRight,
    Building2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Activity, Opportunity, StageHistoryEntry, Stakeholder } from '@/types/account';
import { defaultSalesStages } from '@/data/mockAccountData';

interface AccountHistoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    accountName: string;
    activities: Activity[];
    opportunities: Opportunity[];
    stakeholders: Stakeholder[];
}

const getActivityIcon = (type: string) => {
    switch (type) {
        case 'call':
            return Phone;
        case 'email':
            return Mail;
        case 'meeting':
            return Users;
        case 'demo':
            return Video;
        case 'site_visit':
            return MapPin;
        case 'proposal_review':
            return FileText;
        default:
            return Calendar;
    }
};

const getActivityColor = (type: string) => {
    switch (type) {
        case 'call':
            return 'bg-blue-500/10 text-blue-600 border-blue-200';
        case 'email':
            return 'bg-purple-500/10 text-purple-600 border-purple-200';
        case 'meeting':
            return 'bg-green-500/10 text-green-600 border-green-200';
        case 'demo':
            return 'bg-amber-500/10 text-amber-600 border-amber-200';
        case 'site_visit':
            return 'bg-teal-500/10 text-teal-600 border-teal-200';
        default:
            return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'completed':
            return CheckCircle2;
        case 'planned':
            return Clock;
        case 'cancelled':
            return XCircle;
        default:
            return Clock;
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'completed':
            return 'text-green-600';
        case 'planned':
            return 'text-blue-600';
        case 'cancelled':
            return 'text-red-600';
        default:
            return 'text-gray-600';
    }
};

const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const formatShortDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

// Generate comprehensive history from all sources
const generateAccountHistory = (
    activities: Activity[],
    opportunities: Opportunity[],
    stakeholders: Stakeholder[]
) => {
    const historyItems: {
        id: string;
        type: 'activity' | 'stage_change' | 'stakeholder' | 'opportunity';
        date: Date;
        title: string;
        description: string;
        icon: any;
        iconBg: string;
        metadata?: Record<string, any>;
    }[] = [];

    // Add activities
    activities.forEach((activity) => {
        const Icon = getActivityIcon(activity.type);
        historyItems.push({
            id: `activity-${activity.id}`,
            type: 'activity',
            date: activity.completedDate || activity.scheduledDate,
            title: activity.subject,
            description: activity.description,
            icon: Icon,
            iconBg: getActivityColor(activity.type),
            metadata: {
                status: activity.status,
                outcome: activity.outcome,
                participants: activity.participants,
                duration: activity.duration,
                type: activity.type,
            },
        });
    });

    // Add stage changes from opportunities
    opportunities.forEach((opp) => {
        opp.stageHistory?.forEach((stageChange, index) => {
            const fromStage = defaultSalesStages.find((s) => s.id === stageChange.fromStageId);
            const toStage = defaultSalesStages.find((s) => s.id === stageChange.toStageId);
            historyItems.push({
                id: `stage-${opp.id}-${index}`,
                type: 'stage_change',
                date: stageChange.changedAt,
                title: `Stage Changed: ${opp.name}`,
                description: stageChange.notes || `Moved from ${fromStage?.name || 'New'} to ${toStage?.name || 'Unknown'}`,
                icon: TrendingUp,
                iconBg: 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
                metadata: {
                    fromStage: fromStage?.name || 'New',
                    toStage: toStage?.name,
                    daysInStage: stageChange.daysInStage,
                    changedBy: stageChange.changedBy,
                    opportunityName: opp.name,
                },
            });
        });
    });

    // Add opportunity creation events
    opportunities.forEach((opp) => {
        historyItems.push({
            id: `opp-created-${opp.id}`,
            type: 'opportunity',
            date: opp.createdDate,
            title: `Opportunity Created: ${opp.name}`,
            description: `${opp.dealType.replace('_', ' ')} deal worth ₹${(opp.dealSize / 100000).toFixed(1)}L`,
            icon: Target,
            iconBg: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
            metadata: {
                dealSize: opp.dealSize,
                dealType: opp.dealType,
                owner: opp.ownerName,
            },
        });
    });

    // Sort by date descending
    return historyItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export function AccountHistoryDialog({
    open,
    onOpenChange,
    accountName,
    activities,
    opportunities,
    stakeholders,
}: AccountHistoryDialogProps) {
    const [activeTab, setActiveTab] = useState('all');

    const allHistory = generateAccountHistory(activities, opportunities, stakeholders);

    const filteredHistory = activeTab === 'all'
        ? allHistory
        : allHistory.filter(item => item.type === activeTab);

    // Stats
    const completedActivities = activities.filter((a) => a.status === 'completed').length;
    const plannedActivities = activities.filter((a) => a.status === 'planned').length;
    const totalStageChanges = opportunities.reduce((sum, opp) => sum + (opp.stageHistory?.length || 0), 0);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-xl">
                <SheetHeader className="space-y-1">
                    <SheetTitle className="flex items-center gap-2">
                        <History className="h-5 w-5 text-primary" />
                        Account History
                    </SheetTitle>
                    <SheetDescription className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {accountName}
                    </SheetDescription>
                </SheetHeader>

                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-4 py-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{completedActivities}</p>
                        <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{plannedActivities}</p>
                        <p className="text-xs text-muted-foreground">Planned</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-indigo-600">{totalStageChanges}</p>
                        <p className="text-xs text-muted-foreground">Stage Changes</p>
                    </div>
                </div>

                <Separator />

                {/* Filter Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                        <TabsTrigger value="activity" className="text-xs">Activities</TabsTrigger>
                        <TabsTrigger value="stage_change" className="text-xs">Stage</TabsTrigger>
                        <TabsTrigger value="opportunity" className="text-xs">Deals</TabsTrigger>
                    </TabsList>

                    <TabsContent value={activeTab} className="mt-4">
                        <ScrollArea className="h-[calc(100vh-340px)]">
                            {filteredHistory.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <History className="h-12 w-12 mx-auto mb-4 opacity-30" />
                                    <p>No history records found</p>
                                </div>
                            ) : (
                                <div className="relative space-y-0">
                                    {/* Timeline line */}
                                    <div className="absolute left-5 top-3 bottom-3 w-0.5 bg-border" />

                                    {filteredHistory.map((item, index) => {
                                        const Icon = item.icon;
                                        const StatusIcon = item.metadata?.status ? getStatusIcon(item.metadata.status) : null;

                                        return (
                                            <div
                                                key={item.id}
                                                className="relative pl-12 pb-6 group"
                                            >
                                                {/* Timeline dot */}
                                                <div className={cn(
                                                    "absolute left-2.5 w-5 h-5 rounded-full border-2 border-background flex items-center justify-center",
                                                    item.iconBg
                                                )}>
                                                    <Icon className="h-3 w-3" />
                                                </div>

                                                {/* Content card */}
                                                <div className="bg-card border rounded-lg p-4 hover:border-primary/30 transition-colors">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <p className="font-medium text-sm truncate">{item.title}</p>
                                                                {item.metadata?.status && (
                                                                    <Badge variant="outline" className={cn("text-xs", getStatusColor(item.metadata.status))}>
                                                                        {item.metadata.status}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                                                {item.description}
                                                            </p>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground whitespace-nowrap">
                                                            {formatShortDate(item.date)}
                                                        </p>
                                                    </div>

                                                    {/* Metadata */}
                                                    {item.type === 'stage_change' && item.metadata && (
                                                        <div className="flex items-center gap-2 mt-3 text-xs">
                                                            <Badge variant="outline" className="bg-gray-100">
                                                                {item.metadata.fromStage}
                                                            </Badge>
                                                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                                            <Badge variant="outline" className="bg-primary/10 text-primary">
                                                                {item.metadata.toStage}
                                                            </Badge>
                                                            {item.metadata.daysInStage > 0 && (
                                                                <span className="text-muted-foreground ml-2">
                                                                    ({item.metadata.daysInStage} days in stage)
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}

                                                    {item.type === 'activity' && item.metadata?.participants && (
                                                        <div className="flex items-center gap-2 mt-3">
                                                            <div className="flex -space-x-2">
                                                                {item.metadata.participants.slice(0, 3).map((participant: string, i: number) => (
                                                                    <Avatar key={i} className="h-6 w-6 border-2 border-background">
                                                                        <AvatarFallback className="text-[10px] bg-primary/10">
                                                                            {participant.split(' ').map((n: string) => n[0]).join('')}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                ))}
                                                            </div>
                                                            {item.metadata.duration && (
                                                                <span className="text-xs text-muted-foreground">
                                                                    {item.metadata.duration} mins
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}

                                                    {item.metadata?.outcome && (
                                                        <div className="mt-2">
                                                            <Badge
                                                                variant="outline"
                                                                className={cn(
                                                                    "text-xs",
                                                                    item.metadata.outcome === 'positive' && 'bg-green-50 text-green-600 border-green-200',
                                                                    item.metadata.outcome === 'neutral' && 'bg-gray-50 text-gray-600 border-gray-200',
                                                                    item.metadata.outcome === 'negative' && 'bg-red-50 text-red-600 border-red-200',
                                                                )}
                                                            >
                                                                Outcome: {item.metadata.outcome}
                                                            </Badge>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </SheetContent>
        </Sheet>
    );
}
