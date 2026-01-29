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
    Receipt,
    Building2,
    Calendar,
    DollarSign,
    FileText,
    Truck,
    Package,
    CheckCircle,
    Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Order {
    id: string;
    account: string;
    quote: string;
    value: string;
    status: string;
    poNumber: string;
    orderDate: string;
    deliveryDate: string;
}

interface OrderDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    order: Order | null;
}

const getStatusConfig = (status: string) => {
    switch (status) {
        case "Delivered":
            return { color: "bg-success/10 text-success border-success/20", icon: CheckCircle };
        case "Processing":
            return { color: "bg-info/10 text-info border-info/20", icon: Package };
        case "Invoiced":
            return { color: "bg-primary/10 text-primary border-primary/20", icon: Receipt };
        case "Pending PO":
            return { color: "bg-accent/10 text-accent border-accent/20", icon: Clock };
        case "In Transit":
            return { color: "bg-warning/10 text-warning border-warning/20", icon: Truck };
        default:
            return { color: "bg-muted text-muted-foreground border-border", icon: Receipt };
    }
};

export function OrderDetailDialog({ open, onOpenChange, order }: OrderDetailDialogProps) {
    if (!order) return null;

    const statusConfig = getStatusConfig(order.status);
    const StatusIcon = statusConfig.icon;

    const handleGenerateInvoice = () => {
        toast.success("Invoice generated", {
            description: `Invoice for ${order.id} has been created`,
        });
    };

    const handleTrackDelivery = () => {
        toast.info("Delivery tracking", {
            description: `Tracking information for ${order.id} will be available shortly`,
        });
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-lg">
                <SheetHeader>
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Receipt className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <SheetTitle className="text-xl font-mono">{order.id}</SheetTitle>
                            <SheetDescription className="flex items-center gap-2 mt-1">
                                Sales Order
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                    {/* Status */}
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className={cn("font-medium gap-1", statusConfig.color)}>
                            <StatusIcon className="h-3 w-3" />
                            {order.status}
                        </Badge>
                    </div>

                    <Separator />

                    {/* Value */}
                    <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <DollarSign className="h-4 w-4" />
                            <span className="text-xs uppercase tracking-wide">Order Value</span>
                        </div>
                        <p className="text-2xl font-bold">{order.value}</p>
                    </div>

                    <Separator />

                    {/* Account & References */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            Details
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                                <Building2 className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Account</p>
                                    <p className="font-medium">{order.account}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Quote Reference</p>
                                    <p className="font-medium font-mono">{order.quote}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                                <Receipt className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">PO Number</p>
                                    <p className="font-medium">{order.poNumber}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Dates */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            Timeline
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Order Date</p>
                                    <p className="font-medium text-sm">{order.orderDate}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30">
                                <Truck className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Delivery Date</p>
                                    <p className="font-medium text-sm">{order.deliveryDate}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2 pt-4">
                        <Button variant="outline" className="flex-1 gap-2" onClick={handleGenerateInvoice}>
                            <Receipt className="h-4 w-4" />
                            Generate Invoice
                        </Button>
                        <Button className="flex-1 gap-2" onClick={handleTrackDelivery}>
                            <Truck className="h-4 w-4" />
                            Track Delivery
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
