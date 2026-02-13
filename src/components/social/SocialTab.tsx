import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SocialProfilesList } from "./SocialProfilesList";
import { SocialActivityFeed } from "./SocialActivityFeed";
import { ConnectSocialDialog } from "./ConnectSocialDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Activity, Plus } from "lucide-react";
import { useSocialEvents } from "@/hooks/useSocialEvents";

interface SocialTabProps {
    contactId: string;
    contactName: string;
}

export function SocialTab({ contactId, contactName }: SocialTabProps) {
    const [connectDialogOpen, setConnectDialogOpen] = useState(false);
    // Use hook for real data
    const { events } = useSocialEvents(contactId);
    const unreadCount = events.filter(e => !e.isRead).length;

    // Refresh key isn't strictly needed for profiles list anymore as it uses query invalidation
    // But ActivityFeed might still need it if it's not hooked up yet, or we can remove it if we rely on its own state
    const [refreshKey, setRefreshKey] = useState(0); // Keeping for now for ActivityFeed

    // useEffect for unread count removed as it's derived from hook data

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Social Profiles</h2>
                    <p className="text-muted-foreground">
                        Connected social accounts and activity for {contactName}
                    </p>
                </div>
                <Button onClick={() => setConnectDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Connect Profile
                </Button>
            </div>

            <Tabs defaultValue="profiles" className="w-full">
                <TabsList>
                    <TabsTrigger value="profiles" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Connected Profiles
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Activity Feed
                        {unreadCount > 0 && (
                            <Badge variant="destructive" className="ml-1">{unreadCount}</Badge>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profiles" className="mt-4">
                    <SocialProfilesList
                        contactId={contactId}
                        onRefresh={handleRefresh} // Keeping for now to trigger activity feed refresh if needed
                    />
                </TabsContent>

                <TabsContent value="activity" className="mt-4">
                    <SocialActivityFeed
                        contactId={contactId}
                        contactName={contactName}
                        onRefresh={handleRefresh}
                    />
                </TabsContent>
            </Tabs>

            <ConnectSocialDialog
                open={connectDialogOpen}
                onOpenChange={setConnectDialogOpen}
                contactId={contactId}
                contactName={contactName}
                onConnect={handleRefresh}
            />
        </div>
    );
}
