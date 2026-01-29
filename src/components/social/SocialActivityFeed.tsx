import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Linkedin,
    Twitter,
    MessageSquare,
    Heart,
    Share2,
    ExternalLink,
    CheckSquare,
    FileText,
    Briefcase,
    Eye,
    Bell,
    Activity,
} from "lucide-react";
import { SocialEvent, SocialEventType, SocialPlatform } from "@/types/socialProfile";
import { getEventsByContactId, markEventAsRead, markAllEventsAsRead, getPlatformInfo } from "@/data/socialProfiles";
import { toast } from "sonner";

interface SocialActivityFeedProps {
    contactId: string;
    contactName: string;
    onRefresh?: () => void;
}

const getEventTypeIcon = (type: SocialEventType) => {
    switch (type) {
        case 'new_post': return <MessageSquare className="h-4 w-4" />;
        case 'profile_update': return <FileText className="h-4 w-4" />;
        case 'job_change': return <Briefcase className="h-4 w-4" />;
        case 'mention': return <Bell className="h-4 w-4" />;
        case 'reaction': return <Heart className="h-4 w-4" />;
        case 'new_connection': return <Share2 className="h-4 w-4" />;
    }
};

const getEventTypeLabel = (type: SocialEventType) => {
    switch (type) {
        case 'new_post': return 'New Post';
        case 'profile_update': return 'Profile Update';
        case 'job_change': return 'Job Change';
        case 'mention': return 'Mentioned';
        case 'reaction': return 'Reaction';
        case 'new_connection': return 'New Connection';
    }
};

const getPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
        case 'linkedin': return <Linkedin className="h-4 w-4" />;
        case 'twitter': return <Twitter className="h-4 w-4" />;
        default: return <Activity className="h-4 w-4" />;
    }
};

const formatEventTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 48) return 'Yesterday';
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

export function SocialActivityFeed({ contactId, contactName, onRefresh }: SocialActivityFeedProps) {
    const [events, setEvents] = useState<SocialEvent[]>([]);

    useEffect(() => {
        loadEvents();
    }, [contactId]);

    const loadEvents = () => {
        setEvents(getEventsByContactId(contactId));
    };

    const handleMarkAsRead = (eventId: string) => {
        markEventAsRead(eventId);
        loadEvents();
        onRefresh?.();
    };

    const handleMarkAllAsRead = () => {
        markAllEventsAsRead(contactId);
        loadEvents();
        onRefresh?.();
        toast.success("All events marked as read");
    };

    const handleCreateTask = (event: SocialEvent) => {
        toast.success("Task created", {
            description: `Follow up on: ${event.title}`,
        });
    };

    const handleAddNote = (event: SocialEvent) => {
        toast.success("Note added to contact");
    };

    const unreadCount = events.filter(e => !e.isRead).length;

    if (events.length === 0) {
        return (
            <Card>
                <CardContent className="py-12">
                    <div className="text-center text-muted-foreground">
                        <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <h3 className="font-semibold text-lg mb-2">No Social Activity</h3>
                        <p className="text-sm">
                            Connect social profiles to see activity from {contactName}
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            {unreadCount > 0 && (
                <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                        {unreadCount} new {unreadCount === 1 ? 'update' : 'updates'}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                        <Eye className="h-4 w-4 mr-2" />
                        Mark All as Read
                    </Button>
                </div>
            )}

            {/* Events */}
            <div className="space-y-3">
                {events.map(event => {
                    const platformInfo = getPlatformInfo(event.platform);
                    return (
                        <Card
                            key={event.id}
                            className={`transition-all ${!event.isRead ? 'border-primary/50 bg-primary/5' : ''}`}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                    {/* Platform Icon */}
                                    <div
                                        className="p-2 rounded-lg"
                                        style={{ backgroundColor: `${platformInfo.color}15`, color: platformInfo.color }}
                                    >
                                        {getPlatformIcon(event.platform)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant="outline" className="gap-1">
                                                {getEventTypeIcon(event.eventType)}
                                                {getEventTypeLabel(event.eventType)}
                                            </Badge>
                                            {!event.isRead && (
                                                <Badge variant="default" className="text-xs">New</Badge>
                                            )}
                                            <span className="text-xs text-muted-foreground ml-auto">
                                                {formatEventTime(event.eventTime)}
                                            </span>
                                        </div>

                                        <p className="text-sm mb-2">
                                            {event.content}
                                        </p>

                                        {/* Engagement Stats */}
                                        {event.engagement && (
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                                                {event.engagement.likes !== undefined && (
                                                    <span className="flex items-center gap-1">
                                                        <Heart className="h-3 w-3" />
                                                        {event.engagement.likes}
                                                    </span>
                                                )}
                                                {event.engagement.comments !== undefined && (
                                                    <span className="flex items-center gap-1">
                                                        <MessageSquare className="h-3 w-3" />
                                                        {event.engagement.comments}
                                                    </span>
                                                )}
                                                {event.engagement.shares !== undefined && (
                                                    <span className="flex items-center gap-1">
                                                        <Share2 className="h-3 w-3" />
                                                        {event.engagement.shares}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="gap-1"
                                                onClick={() => window.open(event.eventUrl, '_blank')}
                                            >
                                                <ExternalLink className="h-3 w-3" />
                                                View
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="gap-1"
                                                onClick={() => handleCreateTask(event)}
                                            >
                                                <CheckSquare className="h-3 w-3" />
                                                Create Task
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="gap-1"
                                                onClick={() => handleAddNote(event)}
                                            >
                                                <FileText className="h-3 w-3" />
                                                Add Note
                                            </Button>
                                            {!event.isRead && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="gap-1 ml-auto"
                                                    onClick={() => handleMarkAsRead(event.id)}
                                                >
                                                    <Eye className="h-3 w-3" />
                                                    Mark Read
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
