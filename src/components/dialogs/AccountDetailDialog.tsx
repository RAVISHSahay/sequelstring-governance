import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
    Building2,
    Map,
    Users,
    TrendingUp,
    Briefcase,
    DollarSign,
    User,
    Clock,
    UserCheck,
    Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Priority = "Critical" | "High" | "Medium" | "Low";

interface AssignmentHistory {
    date: string;
    owner: string;
    presales?: string;
    assignedBy: string;
}

interface CommunicationHistory {
    id: string;
    date: string;
    type: "email" | "call" | "meeting";
    subject: string;
    body?: string;
    to: string[];
    cc?: string[];
    sentBy: string;
    attachments?: string[];
}

interface Account {
    id: number;
    name: string;
    type: string;
    industry: string;
    revenue: string;
    deals: number;
    contacts: number;
    status: string;
    owner: string;
    presales?: string;
    priority?: Priority;
    assignmentHistory?: AssignmentHistory[];
    communicationHistory?: CommunicationHistory[];
}

interface AccountDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    account: Account | null;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case "Active":
            return "bg-success/10 text-success border-success/20";
        case "Prospect":
            return "bg-info/10 text-info border-info/20";
        case "Inactive":
            return "bg-muted text-muted-foreground border-border";
        default:
            return "bg-muted text-muted-foreground border-border";
    }
};

const getTypeColor = (type: string) => {
    switch (type) {
        case "Enterprise":
            return "bg-primary/10 text-primary border-primary/20";
        case "PSU":
            return "bg-accent/10 text-accent border-accent/20";
        case "Government":
            return "bg-warning/10 text-warning border-warning/20";
        default:
            return "bg-muted text-muted-foreground border-border";
    }
};

const getPriorityConfig = (priority: Priority) => {
    switch (priority) {
        case "Critical":
            return {
                color: "bg-destructive/10 text-destructive border-destructive/20",
                icon: "🔴",
            };
        case "High":
            return {
                color: "bg-orange-500/10 text-orange-600 border-orange-500/20",
                icon: "🟠",
            };
        case "Medium":
            return {
                color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
                icon: "🟡",
            };
        case "Low":
            return {
                color: "bg-green-500/10 text-green-600 border-green-500/20",
                icon: "🟢",
            };
    }
};

export function AccountDetailDialog({
    open,
    onOpenChange,
    account,
}: AccountDetailDialogProps) {
    const navigate = useNavigate();

    if (!account) return null;

    const handleViewMap = () => {
        onOpenChange(false);
        navigate(`/account-map?account=${encodeURIComponent(account.name)}`);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-lg">
                <SheetHeader>
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Building2 className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <SheetTitle className="text-xl">{account.name}</SheetTitle>
                            <SheetDescription className="flex items-center gap-2 mt-1">
                                <Briefcase className="h-4 w-4" />
                                {account.industry}
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                    {/* Status Badges */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <Badge
                            variant="outline"
                            className={cn("font-medium", getTypeColor(account.type))}
                        >
                            {account.type}
                        </Badge>
                        <Badge
                            variant="outline"
                            className={cn("font-medium", getStatusColor(account.status))}
                        >
                            {account.status}
                        </Badge>
                        {account.priority && (
                            <Badge
                                variant="outline"
                                className={cn(
                                    "font-medium",
                                    getPriorityConfig(account.priority).color
                                )}
                            >
                                {getPriorityConfig(account.priority).icon} {account.priority}{" "}
                                Priority
                            </Badge>
                        )}
                    </div>

                    <Separator />

                    {/* Key Metrics */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 rounded-lg bg-muted/50">
                            <DollarSign className="h-5 w-5 mx-auto text-success mb-2" />
                            <p className="text-lg font-bold">{account.revenue}</p>
                            <p className="text-xs text-muted-foreground">Revenue</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted/50">
                            <TrendingUp className="h-5 w-5 mx-auto text-primary mb-2" />
                            <p className="text-lg font-bold">{account.deals}</p>
                            <p className="text-xs text-muted-foreground">Deals</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted/50">
                            <Users className="h-5 w-5 mx-auto text-accent mb-2" />
                            <p className="text-lg font-bold">{account.contacts}</p>
                            <p className="text-xs text-muted-foreground">Contacts</p>
                        </div>
                    </div>

                    <Separator />

                    {/* Assignment History */}
                    {account.assignmentHistory && account.assignmentHistory.length > 0 && (
                        <>
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                    Assignment History
                                </h4>
                                <div className="space-y-3 max-h-60 overflow-y-auto">
                                    {account.assignmentHistory.map((entry, index) => (
                                        <div
                                            key={index}
                                            className="flex gap-3 p-3 rounded-lg bg-muted/30"
                                        >
                                            <div className="flex-shrink-0">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <UserCheck className="h-4 w-4 text-primary" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium text-sm">{entry.owner}</p>
                                                    {entry.presales && (
                                                        <>
                                                            <span className="text-muted-foreground">•</span>
                                                            <p className="text-sm text-muted-foreground">
                                                                {entry.presales}
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(entry.date).toLocaleDateString("en-IN", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                    <span className="ml-2">by {entry.assignedBy}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <Separator />
                        </>
                    )}

                    {/* Communication History */}
                    {account.communicationHistory &&
                        account.communicationHistory.length > 0 && (
                            <>
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                        Communication History
                                    </h4>
                                    <div className="space-y-3 max-h-80 overflow-y-auto">
                                        {account.communicationHistory.map((entry) => (
                                            <div
                                                key={entry.id}
                                                className="flex gap-3 p-4 rounded-lg bg-muted/30 border border-border/50"
                                            >
                                                <div className="flex-shrink-0">
                                                    <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                                                        <Mail className="h-4 w-4 text-blue-600" />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-semibold text-sm truncate">
                                                                {entry.subject}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                                To: {entry.to.join(", ")}
                                                                {entry.cc && entry.cc.length > 0 && (
                                                                    <span className="ml-2">
                                                                        CC: {entry.cc.join(", ")}
                                                                    </span>
                                                                )}
                                                            </p>
                                                        </div>
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs shrink-0"
                                                        >
                                                            {entry.type}
                                                        </Badge>
                                                    </div>
                                                    {entry.body && (
                                                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                                            {entry.body}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                                        <Clock className="h-3 w-3" />
                                                        {new Date(entry.date).toLocaleDateString(
                                                            "en-IN",
                                                            {
                                                                day: "numeric",
                                                                month: "short",
                                                                year: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            }
                                                        )}
                                                        <span className="ml-2">
                                                            by {entry.sentBy}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <Separator />
                            </>
                        )}

                    {/* Current Team */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            Current Team
                        </h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">{account.owner}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Sales Representative
                                    </p>
                                </div>
                            </div>
                            {account.presales && (
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                                        <Users className="h-5 w-5 text-accent" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{account.presales}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Presales Support
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2 pt-4">
                        <Button
                            variant="outline"
                            className="flex-1 gap-2"
                            onClick={handleViewMap}
                        >
                            <Map className="h-4 w-4" />
                            View 360° Map
                        </Button>
                        <Button
                            className="flex-1 gap-2"
                            onClick={() => {
                                onOpenChange(false);
                                navigate("/contacts");
                            }}
                        >
                            <Users className="h-4 w-4" />
                            View Contacts
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
