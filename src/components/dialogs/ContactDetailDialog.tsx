import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Building2,
    Mail,
    Phone,
    Linkedin,
    User,
    Briefcase,
    Calendar,
    TrendingUp,
    Newspaper,
    History
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ImportantDatesSection } from "@/components/contact/ImportantDatesSection";
import { NewsAlertsSection } from "@/components/intelligence/NewsAlertsSection";
import { ClickToCallButton } from "@/components/call/ClickToCallButton";

interface Contact {
    id: number;
    name: string;
    title: string;
    account: string;
    email: string;
    phone: string;
    role: string;
    influence: string;
    lastContact: string;
    accountId: string;
}

interface ContactDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    contact: Contact | null;
}

const getRoleColor = (role: string) => {
    switch (role) {
        case "Decision Maker":
            return "bg-primary/10 text-primary border-primary/20";
        case "Executive Sponsor":
            return "bg-accent/10 text-accent border-accent/20";
        case "Champion":
            return "bg-success/10 text-success border-success/20";
        case "Technical Buyer":
            return "bg-info/10 text-info border-info/20";
        default:
            return "bg-muted text-muted-foreground border-border";
    }
};

const getInfluenceColor = (influence: string) => {
    switch (influence) {
        case "Critical":
            return "text-destructive";
        case "High":
            return "text-accent";
        case "Medium":
            return "text-info";
        default:
            return "text-muted-foreground";
    }
};

export function ContactDetailDialog({ open, onOpenChange, contact }: ContactDetailDialogProps) {
    if (!contact) return null;

    const handleEmailClick = () => {
        window.location.href = `mailto:${contact.email}`;
    };

    const handleLinkedInClick = () => {
        const searchQuery = encodeURIComponent(`${contact.name} ${contact.account}`);
        window.open(`https://www.linkedin.com/search/results/all/?keywords=${searchQuery}`, '_blank');
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-xl w-full overflow-y-auto">
                <SheetHeader>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarFallback className="bg-primary/10 text-primary text-xl font-medium">
                                {contact.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <SheetTitle className="text-xl">{contact.name}</SheetTitle>
                            <SheetDescription className="flex items-center gap-2 mt-1">
                                <Briefcase className="h-4 w-4" />
                                {contact.title}
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                <Tabs defaultValue="overview" className="mt-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="news">News & Intel</TabsTrigger>
                        <TabsTrigger value="dates">Dates</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6 mt-4">
                        {/* Role and Influence */}
                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className={cn("font-medium", getRoleColor(contact.role))}>
                                {contact.role}
                            </Badge>
                            <div className="flex items-center gap-1">
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                <span className={cn("font-semibold", getInfluenceColor(contact.influence))}>
                                    {contact.influence}
                                </span>
                                <span className="text-sm text-muted-foreground">influence</span>
                            </div>
                        </div>

                        <Separator />

                        {/* Account Info */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                Account
                            </h4>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Building2 className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">{contact.account}</p>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <History className="h-3 w-3" />
                                        <span>Last contact: {contact.lastContact}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Contact Info */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                Contact Information
                            </h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Email</p>
                                            <p className="font-medium text-primary">{contact.email}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={handleEmailClick}>
                                        <Mail className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Phone</p>
                                            <p className="font-medium text-primary">{contact.phone}</p>
                                        </div>
                                    </div>
                                    <ClickToCallButton
                                        phoneNumber={contact.phone}
                                        entityType="contact"
                                        entityId={contact.id.toString()}
                                        entityName={contact.name}
                                    />
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
                                    <div className="flex items-center gap-3">
                                        <Linkedin className="h-5 w-5 text-[#0077B5]" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">LinkedIn</p>
                                            <p className="font-medium text-primary">View Profile</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={handleLinkedInClick}>
                                        <Linkedin className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="news" className="mt-4">
                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Account Intelligence</h4>
                            <p className="text-sm">Latest news and alerts for <span className="font-semibold">{contact.account}</span></p>
                        </div>
                        <NewsAlertsSection accountId={contact.accountId} accountName={contact.account} />
                    </TabsContent>

                    <TabsContent value="dates" className="mt-4">
                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Important Dates</h4>
                            <p className="text-sm">Manage birthdays, anniversaries, and automated greetings.</p>
                        </div>
                        <ImportantDatesSection contactId={contact.id.toString()} contactName={contact.name} />
                    </TabsContent>
                </Tabs>
            </SheetContent>
        </Sheet>
    );
}
