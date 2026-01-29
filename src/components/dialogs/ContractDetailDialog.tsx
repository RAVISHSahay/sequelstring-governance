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
    FileCheck,
    Building2,
    Calendar,
    DollarSign,
    Download,
    RefreshCw,
    CheckCircle,
    Clock,
    AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Contract {
    id: string;
    name: string;
    account: string;
    type: string;
    value: string;
    status: string;
    startDate: string;
    endDate: string;
    renewalAlert: boolean;
}

interface ContractDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    contract: Contract | null;
}

const getStatusConfig = (status: string) => {
    switch (status) {
        case "Active":
            return { color: "bg-success/10 text-success border-success/20", icon: CheckCircle };
        case "Pending Signature":
            return { color: "bg-accent/10 text-accent border-accent/20", icon: Clock };
        case "Completed":
            return { color: "bg-muted text-muted-foreground border-border", icon: FileCheck };
        default:
            return { color: "bg-muted text-muted-foreground border-border", icon: FileCheck };
    }
};

const getTypeColor = (type: string) => {
    switch (type) {
        case "MSA":
            return "bg-primary/10 text-primary border-primary/20";
        case "License":
            return "bg-info/10 text-info border-info/20";
        case "Support":
            return "bg-success/10 text-success border-success/20";
        case "NDA":
            return "bg-accent/10 text-accent border-accent/20";
        default:
            return "bg-muted text-muted-foreground border-border";
    }
};

export function ContractDetailDialog({ open, onOpenChange, contract }: ContractDetailDialogProps) {
    if (!contract) return null;

    const statusConfig = getStatusConfig(contract.status);
    const StatusIcon = statusConfig.icon;

    const handleDownloadPDF = () => {
        toast.success("Generating PDF...", {
            description: `Contract ${contract.id} will be downloaded shortly`,
        });
    };

    const handleInitiateRenewal = () => {
        toast.success("Renewal initiated", {
            description: `Renewal process started for ${contract.name}`,
        });
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-lg">
                <SheetHeader>
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center">
                            <FileCheck className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <SheetTitle className="text-xl flex items-center gap-2">
                                {contract.name}
                                {contract.renewalAlert && (
                                    <AlertTriangle className="h-5 w-5 text-destructive" />
                                )}
                            </SheetTitle>
                            <SheetDescription className="flex items-center gap-2 mt-1">
                                <span className="font-mono text-xs">{contract.id}</span>
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                    {/* Status and Type */}
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className={cn("font-medium", getTypeColor(contract.type))}>
                            {contract.type}
                        </Badge>
                        <Badge variant="outline" className={cn("font-medium gap-1", statusConfig.color)}>
                            <StatusIcon className="h-3 w-3" />
                            {contract.status}
                        </Badge>
                    </div>

                    {contract.renewalAlert && (
                        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                            <div className="flex items-center gap-2 text-destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <span className="font-medium text-sm">Renewal due within 30 days</span>
                            </div>
                        </div>
                    )}

                    <Separator />

                    {/* Value */}
                    <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <DollarSign className="h-4 w-4" />
                            <span className="text-xs uppercase tracking-wide">Contract Value</span>
                        </div>
                        <p className="text-2xl font-bold">{contract.value}</p>
                    </div>

                    <Separator />

                    {/* Account */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            Account
                        </h4>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                            <Building2 className="h-5 w-5 text-muted-foreground" />
                            <p className="font-medium">{contract.account}</p>
                        </div>
                    </div>

                    <Separator />

                    {/* Dates */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            Contract Period
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Start Date</p>
                                    <p className="font-medium text-sm">{contract.startDate}</p>
                                </div>
                            </div>
                            <div className={cn(
                                "flex items-center gap-2 p-3 rounded-lg",
                                contract.renewalAlert ? "bg-destructive/10" : "bg-muted/30"
                            )}>
                                <Calendar className={cn("h-4 w-4", contract.renewalAlert ? "text-destructive" : "text-muted-foreground")} />
                                <div>
                                    <p className="text-xs text-muted-foreground">End Date</p>
                                    <p className={cn(
                                        "font-medium text-sm",
                                        contract.renewalAlert && "text-destructive"
                                    )}>{contract.endDate}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2 pt-4">
                        <Button variant="outline" className="flex-1 gap-2" onClick={handleDownloadPDF}>
                            <Download className="h-4 w-4" />
                            Download PDF
                        </Button>
                        <Button className="flex-1 gap-2" onClick={handleInitiateRenewal}>
                            <RefreshCw className="h-4 w-4" />
                            Initiate Renewal
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
