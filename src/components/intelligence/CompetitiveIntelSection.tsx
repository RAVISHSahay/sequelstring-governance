import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Brain,
    Plus,
    Edit,
    Eye,
    EyeOff,
    Clock,
    User,
    Target,
    TrendingUp,
    FileText,
    Server,
    Handshake,
    ShoppingCart,
    Trophy,
} from "lucide-react";
import { AccountIntelEntry, IntelType, ConfidenceLevel, SourceType } from "@/types/intelligence";
import { getIntelByAccountId, addIntelEntry, updateIntelEntry } from "@/data/intelligence";
import { toast } from "sonner";

interface CompetitiveIntelSectionProps {
    accountId: string;
    accountName: string;
}

const getIntelTypeIcon = (type: IntelType) => {
    switch (type) {
        case 'competitor': return <Target className="h-4 w-4" />;
        case 'pricing': return <TrendingUp className="h-4 w-4" />;
        case 'product': return <FileText className="h-4 w-4" />;
        case 'techstack': return <Server className="h-4 w-4" />;
        case 'partnership': return <Handshake className="h-4 w-4" />;
        case 'procurement': return <ShoppingCart className="h-4 w-4" />;
        case 'winloss': return <Trophy className="h-4 w-4" />;
        default: return <Brain className="h-4 w-4" />;
    }
};

const getIntelTypeLabel = (type: IntelType) => {
    switch (type) {
        case 'competitor': return 'Competitor Analysis';
        case 'pricing': return 'Pricing Intel';
        case 'product': return 'Product Info';
        case 'techstack': return 'Tech Stack';
        case 'partnership': return 'Partnership';
        case 'procurement': return 'Procurement';
        case 'winloss': return 'Win/Loss Insight';
        case 'market_trend': return 'Market Trend';
    }
};

const getConfidenceColor = (level: ConfidenceLevel) => {
    switch (level) {
        case 'High': return 'bg-green-500/10 text-green-600 border-green-500/20';
        case 'Medium': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
        case 'Low': return 'bg-red-500/10 text-red-600 border-red-500/20';
    }
};

const getSourceColor = (source: SourceType) => {
    switch (source) {
        case 'Public': return 'bg-blue-500/10 text-blue-600';
        case 'Partner': return 'bg-purple-500/10 text-purple-600';
        case 'Customer Feedback': return 'bg-green-500/10 text-green-600';
        case 'Sales Observation': return 'bg-orange-500/10 text-orange-600';
        case 'Market Research': return 'bg-indigo-500/10 text-indigo-600';
    }
};

export function CompetitiveIntelSection({ accountId, accountName }: CompetitiveIntelSectionProps) {
    const [intel, setIntel] = useState<AccountIntelEntry[]>([]);
    const [filter, setFilter] = useState<IntelType | 'all'>('all');
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        setIntel(getIntelByAccountId(accountId, true)); // Sales-visible only
    }, [accountId]);

    const filteredIntel = filter === 'all'
        ? intel
        : intel.filter(i => i.intelType === filter);

    const intelTypes: IntelType[] = ['competitor', 'pricing', 'procurement', 'winloss', 'partnership'];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const isReviewDue = (reviewDate?: string) => {
        if (!reviewDate) return false;
        return new Date(reviewDate) <= new Date();
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                    <Button
                        variant={filter === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('all')}
                    >
                        All ({intel.length})
                    </Button>
                    {intelTypes.map(type => {
                        const count = intel.filter(i => i.intelType === type).length;
                        return (
                            <Button
                                key={type}
                                variant={filter === type ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilter(type)}
                                className="gap-1"
                            >
                                {getIntelTypeIcon(type)}
                                {getIntelTypeLabel(type)}
                                {count > 0 && <Badge variant="secondary" className="ml-1">{count}</Badge>}
                            </Button>
                        );
                    })}
                </div>
                <Button onClick={() => setShowAddForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Intel
                </Button>
            </div>

            {/* Intel Cards */}
            {filteredIntel.length === 0 ? (
                <Card>
                    <CardContent className="py-8">
                        <div className="text-center text-muted-foreground">
                            <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No competitive intelligence available</p>
                            <p className="text-sm mt-1">Add insights about {accountName}</p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {filteredIntel.map(item => (
                        <Card key={item.id} className={`hover:shadow-md transition-shadow ${isReviewDue(item.reviewDueAt) ? 'border-orange-500/50' : ''}`}>
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            {getIntelTypeIcon(item.intelType)}
                                        </div>
                                        <div>
                                            <CardTitle className="text-base">{item.title}</CardTitle>
                                            <p className="text-xs text-muted-foreground">
                                                {getIntelTypeLabel(item.intelType)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {item.visibility === 'sales_visible' ? (
                                            <Eye className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-3 whitespace-pre-wrap">
                                    {item.content}
                                </p>

                                {/* Tags */}
                                {item.tags.length > 0 && (
                                    <div className="flex items-center gap-1 flex-wrap mb-3">
                                        {item.tags.map(tag => (
                                            <Badge key={tag} variant="outline" className="text-xs">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                {/* Metadata */}
                                <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className={getConfidenceColor(item.confidenceLevel)}>
                                            {item.confidenceLevel} Confidence
                                        </Badge>
                                        <Badge variant="secondary" className={getSourceColor(item.sourceType)}>
                                            {item.sourceType}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {formatDate(item.createdAt)}
                                        </span>
                                    </div>
                                </div>

                                {/* Review Warning */}
                                {isReviewDue(item.reviewDueAt) && (
                                    <div className="mt-3 p-2 bg-orange-500/10 rounded-lg text-orange-600 text-xs flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        Review due - please verify this information is still accurate
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Legal Disclaimer */}
            <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded-lg">
                <strong>Disclaimer:</strong> This is public-domain information collected from various sources.
                Please validate before external use. Confidence levels indicate reliability of the source.
            </div>
        </div>
    );
}
