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
import {
    Building2,
    Mail,
    Phone,
    Linkedin,
    User,
    Briefcase,
    Calendar,
    TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ImportantDatesSection } from "@/components/contact/ImportantDatesSection";

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

    const handlePhoneClick = () => {
        window.location.href = `tel:${contact.phone}`;
    };

    const handleLinkedInClick = () => {
        const searchQuery = encodeURIComponent(`${contact.name} ${contact.account}`);
        window.open(`https://www.linkedin.com/search/results/all/?keywords=${searchQuery}`, '_blank');
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-lg">
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

                <div className="mt-6 space-y-6">
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
                                <p className="text-sm text-muted-foreground">Last contact: {contact.lastContact}</p>
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
                            <button
                                onClick={handleEmailClick}
                                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                            >
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium text-primary">{contact.email}</p>
                                </div>
                            </button>
                            <button
                                onClick={handlePhoneClick}
                                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                            >
                                <Phone className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Phone</p>
                                    <p className="font-medium text-primary">{contact.phone}</p>
                                </div>
                            </button>
                            <button
                                onClick={handleLinkedInClick}
                                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                            >
                                <Linkedin className="h-5 w-5 text-[#0077B5]" />
                                <div>
                                    <p className="text-sm text-muted-foreground">LinkedIn</p>
                                    <p className="font-medium text-primary">View Profile</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2 pt-4">
                        <Button variant="outline" className="flex-1 gap-2" onClick={handleEmailClick}>
                            <Mail className="h-4 w-4" />
                            Email
                        </Button>
                        <Button variant="outline" className="flex-1 gap-2" onClick={handlePhoneClick}>
                            <Phone className="h-4 w-4" />
                            Call
                        </Button>
                        <Button variant="outline" className="flex-1 gap-2" onClick={handleLinkedInClick}>
                            <Linkedin className="h-4 w-4" />
                            LinkedIn
                        </Button>
                    </div>

                    <Separator />

                    {/* Important Dates Section */}
                    <ImportantDatesSection
                        contactId={contact.id.toString()}
                        contactName={contact.name}
                    />
                </div>
            </SheetContent>
        </Sheet>
    );
}
