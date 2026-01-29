import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Bell,
    Plus,
    X,
    Save,
    Building2,
    Mail,
    Clock,
} from "lucide-react";
import { AccountNewsSubscription } from "@/types/intelligence";
import { getSubscriptionByAccountId, saveNewsSubscription } from "@/data/intelligence";
import { toast } from "sonner";

interface SubscriptionPanelProps {
    accountId: string;
    accountName: string;
}

export function SubscriptionPanel({ accountId, accountName }: SubscriptionPanelProps) {
    const [subscription, setSubscription] = useState<Partial<AccountNewsSubscription>>({
        accountId,
        includeCompanyName: true,
        includeNameVariants: true,
        nameVariants: [],
        includeSubsidiaries: false,
        subsidiaryNames: [],
        includeCompetitorMentions: false,
        includeKeywords: [],
        excludeKeywords: [],
        frequency: 'daily',
        channels: ['crm'],
        isEnabled: true,
    });

    const [newVariant, setNewVariant] = useState('');
    const [newIncludeKeyword, setNewIncludeKeyword] = useState('');
    const [newExcludeKeyword, setNewExcludeKeyword] = useState('');
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        const existing = getSubscriptionByAccountId(accountId);
        if (existing) {
            setSubscription(existing);
        }
    }, [accountId]);

    const updateField = (field: keyof AccountNewsSubscription, value: any) => {
        setSubscription(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const addToList = (field: 'nameVariants' | 'subsidiaryNames' | 'includeKeywords' | 'excludeKeywords', value: string) => {
        if (!value.trim()) return;
        const currentList = subscription[field] || [];
        if (!currentList.includes(value.trim())) {
            updateField(field, [...currentList, value.trim()]);
        }
    };

    const removeFromList = (field: 'nameVariants' | 'subsidiaryNames' | 'includeKeywords' | 'excludeKeywords', value: string) => {
        const currentList = subscription[field] || [];
        updateField(field, currentList.filter(v => v !== value));
    };

    const handleSave = () => {
        saveNewsSubscription(subscription as Omit<AccountNewsSubscription, 'id' | 'createdAt' | 'updatedAt'>);
        setHasChanges(false);
        toast.success("Subscription settings saved", {
            description: `News alerts for ${accountName} have been updated`,
        });
    };

    return (
        <div className="space-y-6">
            {/* Enable/Disable */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            News Subscription
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <Label htmlFor="enabled" className="text-sm">
                                {subscription.isEnabled ? 'Enabled' : 'Disabled'}
                            </Label>
                            <Switch
                                id="enabled"
                                checked={subscription.isEnabled}
                                onCheckedChange={(checked) => updateField('isEnabled', checked)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Receive automated news alerts about {accountName}. Configure matching rules and delivery preferences below.
                    </p>
                </CardContent>
            </Card>

            {/* Matching Rules */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Matching Rules</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Company Name */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="companyName"
                                checked={subscription.includeCompanyName}
                                onCheckedChange={(checked) => updateField('includeCompanyName', !!checked)}
                            />
                            <Label htmlFor="companyName" className="cursor-pointer">
                                Company name exact match
                            </Label>
                        </div>
                        <Badge variant="outline">{accountName}</Badge>
                    </div>

                    {/* Name Variants */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="nameVariants"
                                checked={subscription.includeNameVariants}
                                onCheckedChange={(checked) => updateField('includeNameVariants', !!checked)}
                            />
                            <Label htmlFor="nameVariants" className="cursor-pointer">
                                Name variants (Ltd/Inc, abbreviations)
                            </Label>
                        </div>
                        {subscription.includeNameVariants && (
                            <div className="ml-6 space-y-2">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Add variant (e.g., TCS, Tata CS)"
                                        value={newVariant}
                                        onChange={(e) => setNewVariant(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                addToList('nameVariants', newVariant);
                                                setNewVariant('');
                                            }
                                        }}
                                    />
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            addToList('nameVariants', newVariant);
                                            setNewVariant('');
                                        }}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {(subscription.nameVariants || []).map(variant => (
                                        <Badge key={variant} variant="secondary" className="gap-1">
                                            {variant}
                                            <X
                                                className="h-3 w-3 cursor-pointer hover:text-destructive"
                                                onClick={() => removeFromList('nameVariants', variant)}
                                            />
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Subsidiaries */}
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="subsidiaries"
                            checked={subscription.includeSubsidiaries}
                            onCheckedChange={(checked) => updateField('includeSubsidiaries', !!checked)}
                        />
                        <Label htmlFor="subsidiaries" className="cursor-pointer">
                            Subsidiaries / brands
                        </Label>
                    </div>

                    {/* Competitor Mentions */}
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="competitors"
                            checked={subscription.includeCompetitorMentions}
                            onCheckedChange={(checked) => updateField('includeCompetitorMentions', !!checked)}
                        />
                        <Label htmlFor="competitors" className="cursor-pointer">
                            Competitor mentions with account
                        </Label>
                    </div>
                </CardContent>
            </Card>

            {/* Keyword Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Keyword Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Include Keywords */}
                    <div className="space-y-2">
                        <Label>Include keywords (tender, RFP, award, etc.)</Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Add keyword to include"
                                value={newIncludeKeyword}
                                onChange={(e) => setNewIncludeKeyword(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        addToList('includeKeywords', newIncludeKeyword);
                                        setNewIncludeKeyword('');
                                    }
                                }}
                            />
                            <Button
                                size="sm"
                                onClick={() => {
                                    addToList('includeKeywords', newIncludeKeyword);
                                    setNewIncludeKeyword('');
                                }}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {(subscription.includeKeywords || []).map(keyword => (
                                <Badge key={keyword} variant="default" className="gap-1 bg-green-600">
                                    + {keyword}
                                    <X
                                        className="h-3 w-3 cursor-pointer"
                                        onClick={() => removeFromList('includeKeywords', keyword)}
                                    />
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Exclude Keywords */}
                    <div className="space-y-2">
                        <Label>Exclude keywords (noise reduction)</Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Add keyword to exclude"
                                value={newExcludeKeyword}
                                onChange={(e) => setNewExcludeKeyword(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        addToList('excludeKeywords', newExcludeKeyword);
                                        setNewExcludeKeyword('');
                                    }
                                }}
                            />
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    addToList('excludeKeywords', newExcludeKeyword);
                                    setNewExcludeKeyword('');
                                }}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {(subscription.excludeKeywords || []).map(keyword => (
                                <Badge key={keyword} variant="destructive" className="gap-1">
                                    - {keyword}
                                    <X
                                        className="h-3 w-3 cursor-pointer"
                                        onClick={() => removeFromList('excludeKeywords', keyword)}
                                    />
                                </Badge>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Delivery Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Delivery Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Frequency</Label>
                            <Select
                                value={subscription.frequency}
                                onValueChange={(value) => updateField('frequency', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="realtime">Real-time</SelectItem>
                                    <SelectItem value="hourly">Hourly digest</SelectItem>
                                    <SelectItem value="daily">Daily digest</SelectItem>
                                    <SelectItem value="weekly">Weekly summary</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Channels</Label>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="crm"
                                        checked={(subscription.channels || []).includes('crm')}
                                        onCheckedChange={(checked) => {
                                            const channels = subscription.channels || [];
                                            if (checked) {
                                                updateField('channels', [...channels, 'crm']);
                                            } else {
                                                updateField('channels', channels.filter(c => c !== 'crm'));
                                            }
                                        }}
                                    />
                                    <Label htmlFor="crm" className="cursor-pointer flex items-center gap-1">
                                        <Building2 className="h-4 w-4" />
                                        In-CRM
                                    </Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="email"
                                        checked={(subscription.channels || []).includes('email')}
                                        onCheckedChange={(checked) => {
                                            const channels = subscription.channels || [];
                                            if (checked) {
                                                updateField('channels', [...channels, 'email']);
                                            } else {
                                                updateField('channels', channels.filter(c => c !== 'email'));
                                            }
                                        }}
                                    />
                                    <Label htmlFor="email" className="cursor-pointer flex items-center gap-1">
                                        <Mail className="h-4 w-4" />
                                        Email
                                    </Label>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Save Button */}
            {hasChanges && (
                <div className="flex justify-end">
                    <Button onClick={handleSave} className="gap-2">
                        <Save className="h-4 w-4" />
                        Save Subscription Settings
                    </Button>
                </div>
            )}
        </div>
    );
}
