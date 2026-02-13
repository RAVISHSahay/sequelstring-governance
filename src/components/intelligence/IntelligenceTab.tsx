import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewsAlertsSection } from "./NewsAlertsSection";
import { CompetitiveIntelSection } from "./CompetitiveIntelSection";
import { SubscriptionPanel } from "./SubscriptionPanel";
import { Newspaper, Brain, Bell, Server } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface IntelligenceTabProps {
    accountId: string;
    accountName: string;
}

import { useIntelligence } from "@/hooks/useIntelligence";

export function IntelligenceTab({ accountId, accountName }: IntelligenceTabProps) {
    const { accountNews, isLoading } = useIntelligence(accountId);
    const newsCount = accountNews.length;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Public Domain Intelligence</h2>
                    <p className="text-muted-foreground">
                        News, competitive intel, and market insights for {accountName}
                    </p>
                </div>
            </div>

            <Tabs defaultValue="news" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="news" className="flex items-center gap-2">
                        <Newspaper className="h-4 w-4" />
                        News & Alerts
                        {newsCount > 0 && (
                            <Badge variant="secondary" className="ml-1">{newsCount}</Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="intel" className="flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        Competitive Intel
                    </TabsTrigger>
                    <TabsTrigger value="techstack" className="flex items-center gap-2">
                        <Server className="h-4 w-4" />
                        Tech Stack
                    </TabsTrigger>
                    <TabsTrigger value="subscriptions" className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        Subscriptions
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="news" className="mt-4">
                    <NewsAlertsSection
                        accountId={accountId}
                        accountName={accountName}
                        newsItems={accountNews}
                        isLoading={isLoading}
                    />
                </TabsContent>

                <TabsContent value="intel" className="mt-4">
                    <CompetitiveIntelSection accountId={accountId} accountName={accountName} />
                </TabsContent>

                <TabsContent value="techstack" className="mt-4">
                    <TechStackSection accountId={accountId} />
                </TabsContent>

                <TabsContent value="subscriptions" className="mt-4">
                    <SubscriptionPanel accountId={accountId} accountName={accountName} />
                </TabsContent>
            </Tabs>
        </div>
    );
}

// Tech Stack Section Component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { TechStackEntry } from "@/types/intelligence";
import { getTechStackByAccountId, addTechStackEntry } from "@/data/intelligence";
import { toast } from "sonner";

function TechStackSection({ accountId }: { accountId: string }) {
    const [techStack, setTechStack] = useState<TechStackEntry[]>([]);

    useEffect(() => {
        setTechStack(getTechStackByAccountId(accountId));
    }, [accountId]);

    const categoryIcons: Record<string, string> = {
        ERP: '🏢',
        CRM: '👥',
        RPA: '🤖',
        OCR: '📄',
        Cloud: '☁️',
        BI: '📊',
        Analytics: '📈',
        Security: '🔒',
        Communication: '💬',
        Other: '⚙️',
    };

    const categories = [...new Set(techStack.map(t => t.category))];

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    Technology Stack
                </CardTitle>
                <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Technology
                </Button>
            </CardHeader>
            <CardContent>
                {techStack.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <Server className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No tech stack information available</p>
                        <p className="text-sm mt-1">Add technologies used by this account</p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {categories.map(category => (
                            <Card key={category} className="border-dashed">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm flex items-center gap-2">
                                        <span>{categoryIcons[category] || '⚙️'}</span>
                                        {category}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="space-y-2">
                                        {techStack
                                            .filter(t => t.category === category)
                                            .map(tech => (
                                                <div
                                                    key={tech.id}
                                                    className="flex items-center justify-between p-2 bg-muted/50 rounded"
                                                >
                                                    <div>
                                                        <p className="font-medium text-sm">{tech.technology}</p>
                                                        <p className="text-xs text-muted-foreground">{tech.vendor}</p>
                                                    </div>
                                                    <Badge
                                                        variant="outline"
                                                        className={tech.confidence === 'High' ? 'text-green-600' : 'text-yellow-600'}
                                                    >
                                                        {tech.confidence}
                                                    </Badge>
                                                </div>
                                            ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
