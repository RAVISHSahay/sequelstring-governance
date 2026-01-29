import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Linkedin,
    Twitter,
    Instagram,
    Youtube,
    Github,
    Facebook,
    Loader2,
    CheckCircle,
    AlertCircle,
} from "lucide-react";
import { SocialPlatform } from "@/types/socialProfile";
import { connectSocialAccount, simulateOAuthConnect, getPlatformInfo } from "@/data/socialProfiles";
import { toast } from "sonner";

interface ConnectSocialDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    contactId: string;
    contactName: string;
    onConnect?: () => void;
}

const platforms: { value: SocialPlatform; label: string; icon: React.ReactNode }[] = [
    { value: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="h-4 w-4" /> },
    { value: 'twitter', label: 'X (Twitter)', icon: <Twitter className="h-4 w-4" /> },
    { value: 'instagram', label: 'Instagram', icon: <Instagram className="h-4 w-4" /> },
    { value: 'youtube', label: 'YouTube', icon: <Youtube className="h-4 w-4" /> },
    { value: 'github', label: 'GitHub', icon: <Github className="h-4 w-4" /> },
    { value: 'facebook', label: 'Facebook', icon: <Facebook className="h-4 w-4" /> },
];

export function ConnectSocialDialog({
    open,
    onOpenChange,
    contactId,
    contactName,
    onConnect,
}: ConnectSocialDialogProps) {
    const [platform, setPlatform] = useState<SocialPlatform>('linkedin');
    const [profileUrl, setProfileUrl] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleConnect = async () => {
        if (!profileUrl.trim()) {
            toast.error("Please enter a profile URL");
            return;
        }

        setIsConnecting(true);
        setConnectionStatus('connecting');

        const result = await simulateOAuthConnect(platform, profileUrl);

        if (result.success && result.account) {
            // Save the account
            connectSocialAccount({
                contactId,
                platform,
                platformUserId: result.account.platformUserId || '',
                handle: result.account.handle || '',
                profileUrl,
                displayName: result.account.displayName,
                bio: result.account.bio,
                isConnected: true,
                status: 'active',
                lastSyncedAt: new Date().toISOString(),
                syncFrequency: 'daily',
            });

            setConnectionStatus('success');
            toast.success("Profile connected successfully", {
                description: `${getPlatformInfo(platform).name} profile linked to ${contactName}`,
            });

            setTimeout(() => {
                onOpenChange(false);
                onConnect?.();
                resetForm();
            }, 1500);
        } else {
            setConnectionStatus('error');
            setErrorMessage(result.error || 'Connection failed');
            toast.error("Connection failed", {
                description: result.error,
            });
        }

        setIsConnecting(false);
    };

    const resetForm = () => {
        setPlatform('linkedin');
        setProfileUrl('');
        setConnectionStatus('idle');
        setErrorMessage('');
    };

    const getPlaceholder = () => {
        switch (platform) {
            case 'linkedin': return 'https://linkedin.com/in/username';
            case 'twitter': return 'https://twitter.com/username';
            case 'instagram': return 'https://instagram.com/username';
            case 'github': return 'https://github.com/username';
            case 'youtube': return 'https://youtube.com/@channel';
            case 'facebook': return 'https://facebook.com/profile';
            default: return 'Enter profile URL';
        }
    };

    return (
        <Dialog open={open} onOpenChange={(open) => {
            onOpenChange(open);
            if (!open) resetForm();
        }}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Connect Social Profile</DialogTitle>
                    <DialogDescription>
                        Link a social media profile for {contactName} to monitor their activity.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Platform Selection */}
                    <div className="space-y-2">
                        <Label>Platform</Label>
                        <Select value={platform} onValueChange={(v) => setPlatform(v as SocialPlatform)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {platforms.map(p => (
                                    <SelectItem key={p.value} value={p.value}>
                                        <div className="flex items-center gap-2">
                                            {p.icon}
                                            {p.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Profile URL */}
                    <div className="space-y-2">
                        <Label>Profile URL</Label>
                        <Input
                            placeholder={getPlaceholder()}
                            value={profileUrl}
                            onChange={(e) => setProfileUrl(e.target.value)}
                            disabled={isConnecting}
                        />
                    </div>

                    {/* Connection Status */}
                    {connectionStatus !== 'idle' && (
                        <div className={`p-4 rounded-lg flex items-center gap-3 ${connectionStatus === 'connecting' ? 'bg-blue-500/10 text-blue-600' :
                                connectionStatus === 'success' ? 'bg-green-500/10 text-green-600' :
                                    'bg-red-500/10 text-red-600'
                            }`}>
                            {connectionStatus === 'connecting' && (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <div>
                                        <p className="font-medium">Connecting...</p>
                                        <p className="text-sm opacity-75">Authenticating with {getPlatformInfo(platform).name}</p>
                                    </div>
                                </>
                            )}
                            {connectionStatus === 'success' && (
                                <>
                                    <CheckCircle className="h-5 w-5" />
                                    <div>
                                        <p className="font-medium">Connected Successfully!</p>
                                        <p className="text-sm opacity-75">Profile linked and synced</p>
                                    </div>
                                </>
                            )}
                            {connectionStatus === 'error' && (
                                <>
                                    <AlertCircle className="h-5 w-5" />
                                    <div>
                                        <p className="font-medium">Connection Failed</p>
                                        <p className="text-sm opacity-75">{errorMessage}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Privacy Notice */}
                    <p className="text-xs text-muted-foreground">
                        By connecting, you authorize SequelString to access public profile data.
                        We only collect information visible on the platform.
                    </p>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isConnecting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConnect}
                        disabled={isConnecting || connectionStatus === 'success'}
                    >
                        {isConnecting ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Connecting...
                            </>
                        ) : (
                            'Connect Profile'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
