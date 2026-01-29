import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Gift,
    Users,
    Brain,
    Phone,
    Calendar,
    Mail,
    Newspaper,
    Activity,
    CheckCircle,
    Rocket,
} from "lucide-react";
import { ImportantDatesSection } from "@/components/contact/ImportantDatesSection";
import { CallHistoryList } from "@/components/call/CallHistoryList";
import { ClickToCallButton } from "@/components/call/ClickToCallButton";
import { IntelligenceTab } from "@/components/intelligence/IntelligenceTab";
import { SocialTab } from "@/components/social/SocialTab";

export default function EnterpriseFeatures() {
    const [activeTab, setActiveTab] = useState("overview");

    // Demo data
    const demoContact = {
        id: "1",
        name: "Rajesh Sharma",
        phone: "+91 98765 43210",
    };

    const demoAccount = {
        id: "1",
        name: "Tata Steel Ltd",
    };

    const features = [
        {
            id: "occasion",
            title: "Occasion-Based Auto Email",
            description: "Automated birthday, anniversary, and custom occasion greetings",
            icon: Gift,
            status: "complete",
            highlights: [
                "Add important dates per contact",
                "4 email templates (Birthday, Anniversary, Custom)",
                "Personalization with 7 tokens",
                "Manual send for testing",
                "Opt-out controls",
                "Leap year handling",
            ],
        },
        {
            id: "social",
            title: "Social Profile Integration",
            description: "LinkedIn, X (Twitter), and multi-platform social monitoring",
            icon: Users,
            status: "complete",
            highlights: [
                "Connect LinkedIn, X, Instagram, GitHub, YouTube, Facebook",
                "OAuth simulation for connection",
                "Activity feed with engagement stats",
                "Unread notifications",
                "Create tasks from social events",
                "Profile sync management",
            ],
        },
        {
            id: "intel",
            title: "Public Domain Intelligence",
            description: "Account-level news, competitive intel, and market insights",
            icon: Brain,
            status: "complete",
            highlights: [
                "News aggregation with relevance scoring",
                "12 news category tags",
                "Competitive intelligence workspace",
                "Tech stack tracking",
                "News subscription management",
                "Filter and exclude keywords",
                "Create opportunities from news",
            ],
        },
        {
            id: "call",
            title: "Outbound Call Integration",
            description: "Telesales CTI integration with click-to-call and logging",
            icon: Phone,
            status: "complete",
            highlights: [
                "Click-to-call buttons",
                "Call pop with real-time timer",
                "Disposition selection (8 options)",
                "Automatic call logging",
                "Call history per entity",
                "DNC list management",
                "Next action suggestions",
                "Call scripts library",
            ],
        },
    ];

    return (
        <AppLayout title="Enterprise Features">
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Rocket className="h-8 w-8 text-primary" />
                        Enterprise Features Demo
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Explore the four new enterprise-grade features added to SequelString CRM
                    </p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="occasion" className="gap-2">
                            <Gift className="h-4 w-4" />
                            Occasion Email
                        </TabsTrigger>
                        <TabsTrigger value="social" className="gap-2">
                            <Users className="h-4 w-4" />
                            Social
                        </TabsTrigger>
                        <TabsTrigger value="intel" className="gap-2">
                            <Brain className="h-4 w-4" />
                            Intelligence
                        </TabsTrigger>
                        <TabsTrigger value="call" className="gap-2">
                            <Phone className="h-4 w-4" />
                            Calls
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6 mt-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            {features.map((feature) => {
                                const Icon = feature.icon;
                                return (
                                    <Card key={feature.id} className="hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                                        <Icon className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                                                        <CardDescription>{feature.description}</CardDescription>
                                                    </div>
                                                </div>
                                                <Badge variant="default" className="gap-1 bg-green-600">
                                                    <CheckCircle className="h-3 w-3" />
                                                    Complete
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2">
                                                {feature.highlights.map((highlight, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                                        {highlight}
                                                    </li>
                                                ))}
                                            </ul>
                                            <Button
                                                className="mt-4 w-full"
                                                onClick={() => setActiveTab(feature.id)}
                                            >
                                                Try {feature.title}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* Stats Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Implementation Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-4 gap-4 text-center">
                                    <div className="p-4 bg-primary/10 rounded-lg">
                                        <p className="text-3xl font-bold text-primary">4</p>
                                        <p className="text-sm text-muted-foreground">Features</p>
                                    </div>
                                    <div className="p-4 bg-green-500/10 rounded-lg">
                                        <p className="text-3xl font-bold text-green-600">25+</p>
                                        <p className="text-sm text-muted-foreground">Components</p>
                                    </div>
                                    <div className="p-4 bg-blue-500/10 rounded-lg">
                                        <p className="text-3xl font-bold text-blue-600">3000+</p>
                                        <p className="text-sm text-muted-foreground">Lines of Code</p>
                                    </div>
                                    <div className="p-4 bg-purple-500/10 rounded-lg">
                                        <p className="text-3xl font-bold text-purple-600">100%</p>
                                        <p className="text-sm text-muted-foreground">TypeScript</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Occasion Email Tab */}
                    <TabsContent value="occasion" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Gift className="h-5 w-5" />
                                    Occasion-Based Auto Email
                                </CardTitle>
                                <CardDescription>
                                    Demo: Managing important dates for {demoContact.name}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ImportantDatesSection
                                    contactId={demoContact.id}
                                    contactName={demoContact.name}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Social Tab */}
                    <TabsContent value="social" className="mt-6">
                        <SocialTab
                            contactId={demoContact.id}
                            contactName={demoContact.name}
                        />
                    </TabsContent>

                    {/* Intelligence Tab */}
                    <TabsContent value="intel" className="mt-6">
                        <IntelligenceTab
                            accountId={demoAccount.id}
                            accountName={demoAccount.name}
                        />
                    </TabsContent>

                    {/* Call Integration Tab */}
                    <TabsContent value="call" className="mt-6">
                        <div className="space-y-6">
                            {/* Click to Call Demo */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Phone className="h-5 w-5" />
                                        Click-to-Call Demo
                                    </CardTitle>
                                    <CardDescription>
                                        Click the button to initiate a call to {demoContact.name}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                                        <div className="flex-1">
                                            <p className="font-medium">{demoContact.name}</p>
                                            <p className="text-sm text-muted-foreground">{demoContact.phone}</p>
                                        </div>
                                        <ClickToCallButton
                                            phoneNumber={demoContact.phone}
                                            entityType="contact"
                                            entityId={demoContact.id}
                                            entityName={demoContact.name}
                                            showLabel
                                        />
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-4">
                                        ℹ️ Clicking will open a Call Pop panel with timer, notes, and disposition selection.
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Call History */}
                            <CallHistoryList
                                entityId={demoContact.id}
                                entityType="contact"
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
