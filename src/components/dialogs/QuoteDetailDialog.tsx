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
    FileText,
    Building2,
    Calendar,
    DollarSign,
    User,
    Download,
    Send,
    CheckCircle,
    Clock,
    AlertCircle,
    Percent,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Quote {
    id: string;
    name: string;
    account: string;
    opportunity: string;
    value: string;
    discount: string;
    status: string;
    approver: string;
    validUntil: string;
    owner: string;
    createdAt: string;
    version: string;
}

interface QuoteDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    quote: Quote | null;
}

const getStatusConfig = (status: string) => {
    switch (status) {
        case "Accepted":
        case "Approved":
            return { color: "bg-success/10 text-success border-success/20", icon: CheckCircle };
        case "Sent":
            return { color: "bg-info/10 text-info border-info/20", icon: Send };
        case "Pending Approval":
            return { color: "bg-accent/10 text-accent border-accent/20", icon: Clock };
        case "Draft":
            return { color: "bg-muted text-muted-foreground border-border", icon: FileText };
        case "Rejected":
            return { color: "bg-destructive/10 text-destructive border-destructive/20", icon: AlertCircle };
        default:
            return { color: "bg-muted text-muted-foreground border-border", icon: FileText };
    }
};

export function QuoteDetailDialog({ open, onOpenChange, quote }: QuoteDetailDialogProps) {
    if (!quote) return null;

    const statusConfig = getStatusConfig(quote.status);
    const StatusIcon = statusConfig.icon;

    const handleDownloadPDF = () => {
        toast.success("Generating PDF...", {
            description: `Quote ${quote.id} will be downloaded shortly`,
        });
    };

    const handleSendToCustomer = () => {
        toast.success("Quote sent!", {
            description: `Quote ${quote.id} has been sent to ${quote.account}`,
        });
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-lg">
                <SheetHeader>
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center">
                            <FileText className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <SheetTitle className="text-xl">{quote.name}</SheetTitle>
                            <SheetDescription className="flex items-center gap-2 mt-1">
                                <span className="font-mono text-xs">{quote.id}</span>
                                <span className="text-muted-foreground">•</span>
                                <span>{quote.version}</span>
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                    {/* Status */}
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className={cn("font-medium gap-1", statusConfig.color)}>
                            <StatusIcon className="h-3 w-3" />
                            {quote.status}
                        </Badge>
                        {quote.approver !== "-" && (
                            <span className="text-sm text-muted-foreground">
                                Approver: {quote.approver}
                            </span>
                        )}
                    </div>

                    <Separator />

                    {/* Value and Discount */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                <DollarSign className="h-4 w-4" />
                                <span className="text-xs uppercase tracking-wide">Quote Value</span>
                            </div>
                            <p className="text-2xl font-bold">{quote.value}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                <Percent className="h-4 w-4" />
                                <span className="text-xs uppercase tracking-wide">Discount</span>
                            </div>
                            <p className={cn(
                                "text-2xl font-bold",
                                parseFloat(quote.discount) > 10 ? "text-destructive" :
                                    parseFloat(quote.discount) > 5 ? "text-accent" : "text-foreground"
                            )}>
                                {quote.discount}
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* Account & Opportunity */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            Related To
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                                <Building2 className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Account</p>
                                    <p className="font-medium">{quote.account}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                                <DollarSign className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Opportunity</p>
                                    <p className="font-medium">{quote.opportunity}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Dates & Owner */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">Valid Until</p>
                                <p className="font-medium text-sm">{quote.validUntil}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">Owner</p>
                                <p className="font-medium text-sm">{quote.owner}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2 pt-4">
                        <Button variant="outline" className="flex-1 gap-2" onClick={handleDownloadPDF}>
                            <Download className="h-4 w-4" />
                            Download PDF
                        </Button>
                        <Button className="flex-1 gap-2" onClick={handleSendToCustomer}>
                            <Send className="h-4 w-4" />
                            Send to Customer
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
