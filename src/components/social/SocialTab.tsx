import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SocialProfilesList } from "./SocialProfilesList";
import { SocialActivityFeed } from "./SocialActivityFeed";
import { ConnectSocialDialog } from "./ConnectSocialDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Activity, Plus } from "lucide-react";
import { getSocialAccountsByContactId, getEventsByContactId, getUnreadEventsCount } from "@/data/socialProfiles";

interface SocialTabProps {
    contactId: string;
    contactName: string;
}

export function SocialTab({ contactId, contactName }: SocialTabProps) {
    const [connectDialogOpen, setConnectDialogOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        setUnreadCount(getUnreadEventsCount(contactId));
    }, [contactId, refreshKey]);

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
                        onRefresh={handleRefresh}
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
