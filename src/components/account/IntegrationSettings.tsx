import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Mail, 
  Calendar, 
  RefreshCw, 
  Check, 
  X, 
  Settings2, 
  Link2, 
  Unlink,
  Clock,
  ArrowRightLeft,
  Filter,
  AlertCircle,
  Loader2,
  ExternalLink,
  Shield,
  Zap
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export interface IntegrationProvider {
  id: string;
  name: string;
  icon: string;
  type: 'email' | 'calendar' | 'both';
  connected: boolean;
  lastSync?: Date;
  syncEnabled: boolean;
  autoLogEnabled: boolean;
  account?: string;
  itemsSynced?: number;
  syncFrequency?: 'realtime' | '5min' | '15min' | '1hour' | 'manual';
}

interface IntegrationSettingsProps {
  onSyncComplete?: (count: number) => void;
  onAutoLogToggle?: (enabled: boolean, provider: string) => void;
}

const defaultProviders: IntegrationProvider[] = [
  {
    id: 'google',
    name: 'Google Workspace',
    icon: '🔵',
    type: 'both',
    connected: true,
    lastSync: new Date(Date.now() - 15 * 60 * 1000),
    syncEnabled: true,
    autoLogEnabled: true,
    account: 'team@sequelstring.com',
    itemsSynced: 142,
    syncFrequency: '5min',
  },
  {
    id: 'microsoft',
    name: 'Microsoft 365',
    icon: '🟦',
    type: 'both',
    connected: false,
    syncEnabled: false,
    autoLogEnabled: false,
  },
  {
    id: 'outlook',
    name: 'Outlook.com',
    icon: '📧',
    type: 'email',
    connected: false,
    syncEnabled: false,
    autoLogEnabled: false,
  },
];

const syncRules = [
  { id: 'contacts', label: 'Only sync emails from known contacts', enabled: true },
  { id: 'domain', label: 'Include all emails from customer domains', enabled: true },
  { id: 'calendar_invites', label: 'Log calendar invites as meetings', enabled: true },
  { id: 'attachments', label: 'Store email attachments', enabled: false },
  { id: 'threads', label: 'Group email threads together', enabled: true },
];

export function IntegrationSettings({ onSyncComplete, onAutoLogToggle }: IntegrationSettingsProps) {
  const [providers, setProviders] = useState<IntegrationProvider[]>(defaultProviders);
  const [rules, setRules] = useState(syncRules);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<IntegrationProvider | null>(null);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);

  const handleConnect = (providerId: string) => {
    const provider = providers.find(p => p.id === providerId);
    if (provider) {
      setSelectedProvider(provider);
      setConnectDialogOpen(true);
    }
  };

  const handleConfirmConnect = () => {
    if (!selectedProvider) return;
    
    setProviders(prev => prev.map(p => 
      p.id === selectedProvider.id 
        ? { 
            ...p, 
            connected: true, 
            lastSync: new Date(),
            syncEnabled: true,
            autoLogEnabled: true,
            account: `user@${selectedProvider.name.toLowerCase().replace(' ', '')}.com`,
            itemsSynced: 0,
            syncFrequency: '5min' as const,
          }
        : p
    ));
    setConnectDialogOpen(false);
    toast({
      title: "Integration Connected",
      description: `${selectedProvider.name} has been connected successfully. Initial sync starting...`,
    });
    
    // Simulate initial sync
    setTimeout(() => {
      handleSync(selectedProvider.id);
    }, 500);
  };

  const handleDisconnect = (providerId: string) => {
    setProviders(prev => prev.map(p => 
      p.id === providerId 
        ? { 
            ...p, 
            connected: false, 
            syncEnabled: false,
            autoLogEnabled: false,
            account: undefined,
            lastSync: undefined,
            itemsSynced: undefined,
          }
        : p
    ));
    toast({
      title: "Integration Disconnected",
      description: "The integration has been removed.",
    });
  };

  const handleSync = async (providerId: string) => {
    setIsSyncing(providerId);
    
    // Simulate sync process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newItems = Math.floor(Math.random() * 15) + 3;
    
    setProviders(prev => prev.map(p => 
      p.id === providerId 
        ? { 
            ...p, 
            lastSync: new Date(),
            itemsSynced: (p.itemsSynced || 0) + newItems,
          }
        : p
    ));
    
    setIsSyncing(null);
    onSyncComplete?.(newItems);
    toast({
      title: "Sync Complete",
      description: `${newItems} new communications have been logged.`,
    });
  };

  const handleToggleAutoLog = (providerId: string, enabled: boolean) => {
    setProviders(prev => prev.map(p => 
      p.id === providerId ? { ...p, autoLogEnabled: enabled } : p
    ));
    const provider = providers.find(p => p.id === providerId);
    onAutoLogToggle?.(enabled, provider?.name || '');
    toast({
      title: enabled ? "Auto-logging Enabled" : "Auto-logging Disabled",
      description: enabled 
        ? "New communications will be automatically logged." 
        : "Communications will not be logged automatically.",
    });
  };

  const handleUpdateFrequency = (providerId: string, frequency: string) => {
    setProviders(prev => prev.map(p => 
      p.id === providerId ? { ...p, syncFrequency: frequency as IntegrationProvider['syncFrequency'] } : p
    ));
  };

  const handleToggleRule = (ruleId: string) => {
    setRules(prev => prev.map(r => 
      r.id === ruleId ? { ...r, enabled: !r.enabled } : r
    ));
  };

  const connectedCount = providers.filter(p => p.connected).length;
  const totalSynced = providers.reduce((acc, p) => acc + (p.itemsSynced || 0), 0);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5 text-primary" />
              <CardTitle>Email & Calendar Integration</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Zap className="h-3 w-3" />
                {connectedCount} connected
              </Badge>
              {totalSynced > 0 && (
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  {totalSynced} synced
                </Badge>
              )}
            </div>
          </div>
          <CardDescription>
            Connect your email and calendar to automatically log communications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Provider List */}
          <div className="space-y-4">
            {providers.map((provider) => (
              <div 
                key={provider.id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg border transition-all",
                  provider.connected 
                    ? "bg-primary/5 border-primary/20" 
                    : "bg-muted/30 border-border hover:border-primary/30"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{provider.icon}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{provider.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {provider.type === 'both' ? 'Email & Calendar' : provider.type === 'email' ? 'Email' : 'Calendar'}
                      </Badge>
                      {provider.connected && (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 gap-1">
                          <Check className="h-3 w-3" />
                          Connected
                        </Badge>
                      )}
                    </div>
                    {provider.connected && provider.account && (
                      <p className="text-sm text-muted-foreground mt-1">{provider.account}</p>
                    )}
                    {provider.connected && provider.lastSync && (
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Last synced: {new Date(provider.lastSync).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {provider.connected ? (
                    <>
                      {/* Auto-log toggle */}
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-md border">
                        <Label htmlFor={`auto-${provider.id}`} className="text-xs text-muted-foreground cursor-pointer">
                          Auto-log
                        </Label>
                        <Switch
                          id={`auto-${provider.id}`}
                          checked={provider.autoLogEnabled}
                          onCheckedChange={(checked) => handleToggleAutoLog(provider.id, checked)}
                        />
                      </div>

                      {/* Sync button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSync(provider.id)}
                        disabled={isSyncing === provider.id}
                        className="gap-1"
                      >
                        {isSyncing === provider.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                        Sync Now
                      </Button>

                      {/* Settings */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedProvider(provider);
                          setSettingsDialogOpen(true);
                        }}
                      >
                        <Settings2 className="h-4 w-4" />
                      </Button>

                      {/* Disconnect */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDisconnect(provider.id)}
                      >
                        <Unlink className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => handleConnect(provider.id)} className="gap-1">
                      <Link2 className="h-4 w-4" />
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Sync Rules */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Sync Rules</span>
              </div>
              <Badge variant="outline">{rules.filter(r => r.enabled).length} active</Badge>
            </div>
            <div className="space-y-3">
              {rules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between py-2">
                  <Label htmlFor={rule.id} className="text-sm cursor-pointer">{rule.label}</Label>
                  <Switch
                    id={rule.id}
                    checked={rule.enabled}
                    onCheckedChange={() => handleToggleRule(rule.id)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium">Privacy & Security</p>
              <p className="text-xs text-muted-foreground mt-1">
                Your credentials are securely stored and encrypted. Only business-related communications 
                matching your sync rules are logged. Personal emails are never accessed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connect Dialog */}
      <Dialog open={connectDialogOpen} onOpenChange={setConnectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{selectedProvider?.icon}</span>
              Connect {selectedProvider?.name}
            </DialogTitle>
            <DialogDescription>
              Authorize access to sync your emails and calendar events automatically.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted/50 rounded-lg space-y-3">
              <p className="text-sm font-medium">This integration will:</p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Read emails from known contacts and customer domains
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Access calendar events with customer participants
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Automatically log communications to the CRM
                </li>
              </ul>
            </div>

            <div className="flex items-start gap-2 p-3 border rounded-lg border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
              <p className="text-xs text-amber-700 dark:text-amber-400">
                You'll be redirected to {selectedProvider?.name} to authorize access. 
                No password is stored in our system.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConnectDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmConnect} className="gap-1">
              <ExternalLink className="h-4 w-4" />
              Authorize & Connect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-xl">{selectedProvider?.icon}</span>
              {selectedProvider?.name} Settings
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Sync Frequency */}
            <div className="space-y-2">
              <Label>Sync Frequency</Label>
              <Select 
                value={selectedProvider?.syncFrequency || '5min'} 
                onValueChange={(v) => selectedProvider && handleUpdateFrequency(selectedProvider.id, v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Real-time</SelectItem>
                  <SelectItem value="5min">Every 5 minutes</SelectItem>
                  <SelectItem value="15min">Every 15 minutes</SelectItem>
                  <SelectItem value="1hour">Every hour</SelectItem>
                  <SelectItem value="manual">Manual only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sync Stats */}
            {selectedProvider?.connected && (
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <p className="text-sm font-medium">Sync Statistics</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Synced</p>
                    <p className="font-semibold text-lg">{selectedProvider.itemsSynced || 0}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Sync</p>
                    <p className="font-semibold">
                      {selectedProvider.lastSync 
                        ? new Date(selectedProvider.lastSync).toLocaleTimeString() 
                        : 'Never'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Domain Filter */}
            <div className="space-y-2">
              <Label>Additional Domain Filter</Label>
              <Input placeholder="e.g., @partnerdomain.com" />
              <p className="text-xs text-muted-foreground">
                Add extra domains to include in sync (comma-separated)
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSettingsDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setSettingsDialogOpen(false);
              toast({ title: "Settings Saved", description: "Integration settings have been updated." });
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
