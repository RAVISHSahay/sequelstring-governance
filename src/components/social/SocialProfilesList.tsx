import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Linkedin,
    Twitter,
    Instagram,
    Youtube,
    Github,
    Facebook,
    ExternalLink,
    RefreshCw,
    Trash2,
    Link2,
    Clock,
    MapPin,
    Building2,
} from "lucide-react";
import { SocialAccount, SocialPlatform } from "@/types/socialProfile";
import { getPlatformInfo } from "@/data/socialProfiles";
import { useSocialProfiles } from "@/hooks/useSocialProfiles";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SocialProfilesListProps {
    contactId: string;
    onRefresh?: () => void;
}

const getPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
        case 'linkedin': return <Linkedin className="h-5 w-5" />;
        case 'twitter': return <Twitter className="h-5 w-5" />;
        case 'instagram': return <Instagram className="h-5 w-5" />;
        case 'youtube': return <Youtube className="h-5 w-5" />;
        case 'github': return <Github className="h-5 w-5" />;
        case 'facebook': return <Facebook className="h-5 w-5" />;
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'active': return 'bg-green-500';
        case 'disconnected': return 'bg-gray-500';
        case 'error': return 'bg-red-500';
        default: return 'bg-gray-500';
    }
};

export function SocialProfilesList({ contactId, onRefresh }: SocialProfilesListProps) {
    const { accounts, isLoading, disconnectAccount, deleteAccount } = useSocialProfiles(contactId);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
    const [syncing, setSyncing] = useState<string | null>(null);

    const handleSync = async (accountId: string) => {
        setSyncing(accountId);
        // Simulate sync delay for now as real sync might take time
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSyncing(null);
        toast.success("Profile synced successfully");
        onRefresh?.();
    };

    const handleDisconnect = (accountId: string) => {
        disconnectAccount(accountId, {
            onSuccess: () => {
                toast.success("Account disconnected");
                onRefresh?.();
            },
            onError: () => toast.error("Failed to disconnect account")
        });
    };

    const handleDelete = (accountId: string) => {
        setAccountToDelete(accountId);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (accountToDelete) {
            deleteAccount(accountToDelete, {
                onSuccess: () => {
                    toast.success("Account removed");
                    onRefresh?.();
                },
                onError: () => toast.error("Failed to delete account")
            });
        }
        setDeleteConfirmOpen(false);
        setAccountToDelete(null);
    };

    const formatLastSynced = (dateString?: string) => {
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        const now = new Date();
        const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours}h ago`;
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };

    if (isLoading) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                Loading profiles...
            </div>
        );
    }

    if (accounts.length === 0) {
        return (
            <Card>
                <CardContent className="py-12">
                    <div className="text-center text-muted-foreground">
                        <Link2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <h3 className="font-semibold text-lg mb-2">No Connected Profiles</h3>
                        <p className="text-sm mb-4">
                            Connect social profiles to track activity and engage with this contact
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2">
                {accounts.map(account => {
                    const platformInfo = getPlatformInfo(account.platform);
                    return (
                        <Card key={account.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                    {/* Avatar */}
                                    <Avatar className="h-14 w-14">
                                        {account.profilePhotoUrl ? (
                                            <AvatarImage src={account.profilePhotoUrl} />
                                        ) : (
                                            <AvatarFallback
                                                className={platformInfo.bgColor}
                                                style={{ color: platformInfo.color }}
                                            >
                                                {getPlatformIcon(account.platform)}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>

                                    {/* Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold">{account.displayName || account.handle}</h3>
                                            <div className={`h-2 w-2 rounded-full ${getStatusColor(account.status)}`} />
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            {account.handle}
                                        </p>
                                        {account.bio && (
                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                                {account.bio}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            {account.location && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {account.location}
                                                </span>
                                            )}
                                            {account.company && (
                                                <span className="flex items-center gap-1">
                                                    <Building2 className="h-3 w-3" />
                                                    {account.company}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Platform Badge */}
                                    <Badge
                                        variant="outline"
                                        className="gap-1"
                                        style={{ borderColor: platformInfo.color, color: platformInfo.color }}
                                    >
                                        {getPlatformIcon(account.platform)}
                                        {platformInfo.name}
                                    </Badge>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between mt-4 pt-3 border-t">
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        Synced: {formatLastSynced(account.lastSyncedAt)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => window.open(account.profileUrl, '_blank')}
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleSync(account.id)}
                                            disabled={syncing === account.id}
                                        >
                                            <RefreshCw className={`h-4 w-4 ${syncing === account.id ? 'animate-spin' : ''}`} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(account.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove Social Profile</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to remove this social profile? This will also delete all associated activity data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>Remove</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
