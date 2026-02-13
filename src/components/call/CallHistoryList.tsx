import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Phone,
    PhoneIncoming,
    PhoneOutgoing,
    Clock,
    User,
    CheckCircle,
    XCircle,
    PhoneMissed,
} from "lucide-react";
import { CallActivity, CallDisposition, CallStatus } from "@/types/callIntegration";
import { useCalls } from "@/hooks/useCalls";

interface CallHistoryListProps {
    entityId: string;
    entityType?: string;
    limit?: number;
}

const getStatusIcon = (status: CallStatus) => {
    switch (status) {
        case 'Connected':
            return <CheckCircle className="h-4 w-4 text-green-500" />;
        case 'No Answer':
            return <PhoneMissed className="h-4 w-4 text-orange-500" />;
        case 'Busy':
            return <XCircle className="h-4 w-4 text-yellow-500" />;
        case 'Failed':
            return <XCircle className="h-4 w-4 text-red-500" />;
        default:
            return <Phone className="h-4 w-4 text-muted-foreground" />;
    }
};

const getDispositionColor = (disposition?: CallDisposition) => {
    switch (disposition) {
        case 'Interested':
            return 'bg-green-500/10 text-green-600 border-green-500/20';
        case 'Call Back':
            return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
        case 'Not Interested':
            return 'bg-red-500/10 text-red-600 border-red-500/20';
        case 'Follow-up Required':
            return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
        case 'Meeting Scheduled':
            return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
        case 'Converted':
            return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
        case 'DNC':
            return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
        default:
            return 'bg-muted text-muted-foreground border-border';
    }
};

const formatDuration = (seconds?: number) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return `Today, ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday, ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    }
};

export function CallHistoryList({ entityId, entityType, limit = 10 }: CallHistoryListProps) {
    // Determine filters based on entityType
    const filters = entityType === 'contact' ? { contactId: entityId } : undefined; // Extend for user/account if needed
    const { calls, isLoading } = useCalls(filters);

    if (isLoading) {
        return (
            <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                    Loading calls...
                </CardContent>
            </Card>
        );
    }

    if (calls.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Phone className="h-5 w-5" />
                        Call History
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        <Phone className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No call history available</p>
                        <p className="text-sm mt-1">Calls will appear here after making or receiving calls</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Call History
                    <Badge variant="secondary" className="ml-2">{calls.length}</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {calls.map((call) => (
                        <div
                            key={call.id}
                            className="flex items-start justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                            <div className="flex items-start gap-3">
                                <div className="mt-1">
                                    {call.direction === 'outbound' ? (
                                        <PhoneOutgoing className="h-4 w-4 text-blue-500" />
                                    ) : (
                                        <PhoneIncoming className="h-4 w-4 text-green-500" />
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{call.entityName || call.toNumber}</span>
                                        {getStatusIcon(call.status)}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {formatDuration(call.duration)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <User className="h-3 w-3" />
                                            {call.userName}
                                        </span>
                                    </div>
                                    {call.notes && (
                                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                            {call.notes}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-muted-foreground">
                                    {formatDate(call.startTime)}
                                </p>
                                {call.disposition && (
                                    <Badge
                                        variant="outline"
                                        className={`mt-1 text-xs ${getDispositionColor(call.disposition)}`}
                                    >
                                        {call.disposition}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
