import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Newspaper,
    ExternalLink,
    Plus,
    ThumbsDown,
    MessageSquare,
    Briefcase,
    CheckSquare,
    Share2,
    TrendingUp,
    DollarSign,
    Users,
    Scale,
    Rocket,
    BarChart,
    GitMerge,
    Shield,
    Award,
    Handshake,
    Building2,
    UserMinus,
} from "lucide-react";
import { AccountNewsItem, NewsTag, NewsRelevance } from "@/types/intelligence";
import { getNewsByAccountId, updateNewsStatus, addNewsItem } from "@/data/intelligence";
import { toast } from "sonner";

interface NewsAlertsSectionProps {
    accountId: string;
    accountName: string;
}

const getTagIcon = (tag: NewsTag) => {
    switch (tag) {
        case 'Funding': return <DollarSign className="h-3 w-3" />;
        case 'Contract': return <Briefcase className="h-3 w-3" />;
        case 'Leadership Change': return <Users className="h-3 w-3" />;
        case 'Litigation': return <Scale className="h-3 w-3" />;
        case 'Product Launch': return <Rocket className="h-3 w-3" />;
        case 'Earnings': return <BarChart className="h-3 w-3" />;
        case 'M&A': return <GitMerge className="h-3 w-3" />;
        case 'Cyber Incident': return <Shield className="h-3 w-3" />;
        case 'Award': return <Award className="h-3 w-3" />;
        case 'Partnership': return <Handshake className="h-3 w-3" />;
        case 'Expansion': return <Building2 className="h-3 w-3" />;
        case 'Layoffs': return <UserMinus className="h-3 w-3" />;
        default: return <Newspaper className="h-3 w-3" />;
    }
};

const getTagColor = (tag: NewsTag) => {
    switch (tag) {
        case 'Funding': return 'bg-green-500/10 text-green-600 border-green-500/20';
        case 'Contract': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
        case 'Leadership Change': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
        case 'Litigation': return 'bg-red-500/10 text-red-600 border-red-500/20';
        case 'Product Launch': return 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20';
        case 'Earnings': return 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20';
        case 'M&A': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
        case 'Cyber Incident': return 'bg-red-600/10 text-red-700 border-red-600/20';
        case 'Award': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
        case 'Partnership': return 'bg-teal-500/10 text-teal-600 border-teal-500/20';
        case 'Expansion': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
        case 'Layoffs': return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
        default: return 'bg-muted text-muted-foreground';
    }
};

const getRelevanceColor = (relevance: NewsRelevance) => {
    switch (relevance) {
        case 'High': return 'bg-primary text-primary-foreground';
        case 'Medium': return 'bg-secondary text-secondary-foreground';
        case 'Low': return 'bg-muted text-muted-foreground';
    }
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 48) return 'Yesterday';
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

export function NewsAlertsSection({ accountId, accountName }: NewsAlertsSectionProps) {
    const [news, setNews] = useState<AccountNewsItem[]>([]);
    const [filter, setFilter] = useState<NewsTag | 'all'>('all');

    useEffect(() => {
        setNews(getNewsByAccountId(accountId));
    }, [accountId]);

    const handleDismiss = (id: string) => {
        updateNewsStatus(id, 'dismissed');
        setNews(prev => prev.filter(n => n.id !== id));
        toast.success("News item dismissed");
    };

    const handleCreateOpportunity = (newsItem: AccountNewsItem) => {
        toast.success("Opportunity created", {
            description: `From: ${newsItem.title}`,
        });
    };

    const handleCreateTask = (newsItem: AccountNewsItem) => {
        toast.success("Task created", {
            description: `Follow up on: ${newsItem.title}`,
        });
    };

    const handleShare = (newsItem: AccountNewsItem) => {
        navigator.clipboard.writeText(newsItem.sourceUrl);
        toast.success("Link copied to clipboard");
    };

    const filteredNews = filter === 'all'
        ? news
        : news.filter(n => n.tags.includes(filter));

    const uniqueTags = [...new Set(news.flatMap(n => n.tags))];

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
                <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('all')}
                >
                    All ({news.length})
                </Button>
                {uniqueTags.map(tag => (
                    <Button
                        key={tag}
                        variant={filter === tag ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter(tag)}
                        className="gap-1"
                    >
                        {getTagIcon(tag)}
                        {tag}
                    </Button>
                ))}
            </div>

            {/* News Cards */}
            {filteredNews.length === 0 ? (
                <Card>
                    <CardContent className="py-8">
                        <div className="text-center text-muted-foreground">
                            <Newspaper className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No news items available</p>
                            <p className="text-sm mt-1">News about {accountName} will appear here</p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredNews.map(item => (
                        <Card key={item.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        {/* Tags & Relevance */}
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <Badge className={getRelevanceColor(item.relevanceScore)}>
                                                {item.relevanceScore}
                                            </Badge>
                                            {item.tags.map(tag => (
                                                <Badge
                                                    key={tag}
                                                    variant="outline"
                                                    className={`gap-1 ${getTagColor(tag)}`}
                                                >
                                                    {getTagIcon(tag)}
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>

                                        {/* Title */}
                                        <h3 className="font-semibold text-lg mb-1">
                                            <a
                                                href={item.sourceUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-primary hover:underline"
                                            >
                                                {item.title}
                                            </a>
                                        </h3>

                                        {/* Summary */}
                                        <p className="text-muted-foreground text-sm mb-3">
                                            {item.summary}
                                        </p>

                                        {/* Source & Date */}
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <span className="font-medium">{item.sourceName}</span>
                                            <span>•</span>
                                            <span>{formatDate(item.publishedAt)}</span>
                                            {item.matchedTerms.length > 0 && (
                                                <>
                                                    <span>•</span>
                                                    <span>Matched: {item.matchedTerms.join(', ')}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-1"
                                            onClick={() => window.open(item.sourceUrl, '_blank')}
                                        >
                                            <ExternalLink className="h-3 w-3" />
                                            Read
                                        </Button>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2 mt-4 pt-3 border-t">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="gap-1"
                                        onClick={() => handleCreateOpportunity(item)}
                                    >
                                        <Briefcase className="h-4 w-4" />
                                        Create Opportunity
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="gap-1"
                                        onClick={() => handleCreateTask(item)}
                                    >
                                        <CheckSquare className="h-4 w-4" />
                                        Create Task
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="gap-1"
                                        onClick={() => handleShare(item)}
                                    >
                                        <Share2 className="h-4 w-4" />
                                        Share
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="gap-1 text-muted-foreground"
                                        onClick={() => handleDismiss(item.id)}
                                    >
                                        <ThumbsDown className="h-4 w-4" />
                                        Not Relevant
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
